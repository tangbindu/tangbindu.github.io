(function() {
    function Swipe(container, options) {
        "use strict";
        if (!container) {
            return;
        }

        options = options || {};

        // slide的包裹元素
        var element = container.children[0];
        var slides = [];
        // 容器宽度
        var width = 0;
        // slide的个数
        var length = 0;
        // 单个slide的宽度
        var slideWidth = 0;
        // 偏移位置
        var offset = 0;
        // 当前位置
        var nowDist = 0;
        // 当前索引
        var index = options.index || 0;
        // 切换的间隔
        var speed = options.speed || 300;

        // 是否自动轮播
        var delay = options.auto || 0;
        // 如果自动轮播，则默认循环轮播
        var continuous = options.continuous || options.auto || false;

        var past;

        var interval;

        var start = {};
        var delta = {};
        var isScrolling;

        // 事件处理
        var events = {
            handleEvent: function(event) {
                switch (event.type) {
                    case 'touchstart':
                        this.start(event);
                        break;
                    case 'touchmove':
                        this.move(event);
                        break;
                    case 'touchend':
                        offloadFn(this.end(event));
                        break;
                    case 'webkitTransitionEnd':
                    case 'msTransitionEnd':
                    case 'oTransitionEnd':
                    case 'otransitionend':
                    case 'transitionend':
                        offloadFn(this.transitionEnd(event));
                        break;
                }
                if (options.stopPropagation) {
                    event.stopPropagation();
                }
            },
            start: function(event) {
                if (options.onBeforeStart) {
                    options.onBeforeStart.call(this, event);
                }
                var touches = event.touches[0];

                // 定义滑动开始位置
                start = {
                    // 获取开始滑动的坐标
                    x: touches.pageX,
                    y: touches.pageY,

                    // touch的时间点
                    time: +new Date
                };

                isScrolling = undefined;

                delta = {};

                element.addEventListener('touchmove', this, false);
                element.addEventListener('touchend', this, false);
            },
            move: function(event) {
                // 不是滑动，返回
                if (event.touches.length > 1 || event.scale && event.scale !== 1) {
                    return;
                }

                var touches = event.touches[0];
                // 当前的位置 - 开始位置 = 移动的距离
                delta = {
                    x: touches.pageX - start.x,
                    y: touches.pageY - start.y
                };

                // 判断是否swipe
                if (typeof isScrolling == 'undefined') {
                    isScrolling = !! (isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
                }

                // 不是纵向滚动
                if (!isScrolling) {
                    event.preventDefault();
                    stop();
                    // 移动对象到移动的距离，保持对象和移动距离一致
                    translateUi(delta.x + nowDist, speed);
                }
            },
            end: function(event) {
                // 移动的时间间隔
                var duration = +new Date - start.time;

                // 判断移动是否触发翻页
                // 如果滑动期间小于250ms 并且 x轴上的距离大于20 或者滑动的距离大于整体宽度的一半
                var isValidSlide = Number(duration) < 250 && Math.abs(delta.x) > 20 || Math.abs(delta.x) > slideWidth / 3;

                // 判断是第一页或者最后一页
                var isPastBounds = !index && delta.x > 0 || index == length - 1 && delta.x < 0;

                // 滑动的方向 (true:right, false:left)
                var direction = delta.x < 0;

                // 横向滑动
                if (!isScrolling) {
                    if (isValidSlide && !isPastBounds) {
                        // 图片往右移，translate -
                        if (direction) {
                            next();
                        } else {
                            // 图片往左移，translate +
                            prev();
                        }
                    } else if (isPastBounds && continuous) {
                        if (index == 0) {
                            prev();
                        } else if (index == length - 1) {
                            next();
                        }
                    } else {
                        // 恢复到原来的状态
                        translateUi(nowDist, speed, true);
                    }
                }

                element.removeEventListener('touchmove', events, false);
                element.removeEventListener('touchend', events, false);
            },
            transitionEnd: function(event) {
                if (past == 'first') {
                    // 移动ui到offset的位置，让第一个元素左边留出空白
                    offloadFn(function() {
                        translateUi(-slideWidth + offset, 0, true);
                    });
                } else if (past == 'last') {
                    // 移动到最后一个
                    offloadFn(function() {
                        translateUi(-slideWidth * length + offset, 0, true);
                    });
                }
                past = null;
                if (delay) {
                    begin();
                }
                options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);
            }
        };

        // 设置
        setup();
        // 是否需要自动轮播
        if (delay) {
            begin();
        }

        element.addEventListener('touchstart', events, false);

        element.addEventListener('webkitTransitionEnd', events, false);
        element.addEventListener('msTransitionEnd', events, false);
        element.addEventListener('oTransitionEnd', events, false);
        element.addEventListener('otransitionend', events, false);
        element.addEventListener('transitionend', events, false);

        return {
            setup: function() {
                setup();
            },
            slide: function(to, speed) {
                stop();
                slide(to, speed);
            },
            prev: function() {
                stop();
                prev();
            },
            next: function() {
                stop();
                next();
            },
            stop: function() {
                // 取消
                stop();
            },
            getPos: function() {
                // 当前位置
                return index;
            },
            getNumSlides: function() {
                // 返回滑动个数
                return length;
            },
            refresh: function() {
                refresh();
            },
            kill: function() {
                stop();
                // 重置宽度
                element.style.width = '';

                index = 0;
                // 初始化位置
                translateUi(offset, 0, true);

                element.removeEventListener('touchstart', events, false);
                element.removeEventListener('webkitTransitionEnd', events, false);
                element.removeEventListener('msTransitionEnd', events, false);
                element.removeEventListener('oTransitionEnd', events, false);
                element.removeEventListener('otransitionend', events, false);
                element.removeEventListener('transitionend', events, false);
            }
        };

        /**
         * 初始化操作。
         * 给容器设置宽度
         * 给每一个slide设置宽度、left、translate
         *
         * @method setup
         */
        function setup() {
            // cache slides
            slides = element.children;
            length = slides.length;

            // 包裹元素的宽度
            width = getOuterWidth(container);
            console.log(getOuterWidth(slides[0]))
            // 轮播元素的宽度
            slideWidth = options.slideWidth || getOuterWidth(slides[0]);
            // 轮播元素居中，左右两边的距离
            offset = (width - slideWidth) / 2;
            if (continuous) {
                // 如果循环播放，在最后一个前面插入第一个的复制，在第一个的前面插入最后一个的复制
                // 在一个循环结束时，先按正常过渡到复制的元素，在transitionEnd里面直接translate到相应的位置
                // 如果直接硬切过去，体验有点不好
                var firstChild = element.firstElementChild;
                var lastChild = element.lastElementChild;
                element.appendChild(firstChild.cloneNode(true));
                element.insertBefore(lastChild.cloneNode(true), firstChild);
                element.style.width = ((length + 2) * slideWidth) + 'px';
                // 移动ui到offset的位置，让第一个元素左边留出空白
                translateUi((index + 1) * -slideWidth + offset, 0, true);
            } else {
                if (options.isSetWidth) {

                } else {
                    element.style.width = (length * slideWidth) + 'px';
                }

                // 移动ui到offset的位置，让第一个元素左边留出空白
                translateUi(index * -slideWidth + offset, 0, true);
                if (index > 1) {
                    offloadFn(function() {
                        options.callback && options.callback(index, slides[index]);
                    });
                }
            }

            container.style.visibility = 'visible';
        }

        function refresh() {
            slides = element.children;
            length = slides.length;
            element.style.width = (slides.length * slideWidth) + 'px';
        }

        function prev() {
            if (index) {
                slide(index - 1);
            } else {
                if (continuous) {
                    slideToLast();
                }
            }
        }

        function next() {
            if (index < length - 1) {
                slide(index + 1);
            } else {
                if (continuous) {
                    slideToFirst();
                }
            }
        }

        function slideToFirst() {
            move(-slideWidth + nowDist, speed);
            index = 0;
            past = 'first';
            offloadFn(function() {
                options.callback && options.callback(index, slides[index]);
            });
        }

        function slideToLast() {
            move(slideWidth + nowDist, speed);
            index = length - 1;
            past = 'last';
            offloadFn(function() {
                options.callback && options.callback(index, slides[index]);
            });
        }

        function slide(to, slideSpeed) {
            if (index == to) {
                return;
            }
            // 1: backward, -1: forward
            var direction = Math.abs(index - to) / (index - to);

            move(Math.abs(index - to) * slideWidth * direction + nowDist, slideSpeed || speed);
            index = to;
            offloadFn(options.callback && options.callback(index, slides[index]));
        }

        function move(dist, speed) {
            translateUi(dist, speed, true);
        }

        function translateUi(dist, speed, isEnd) {
            var style = element && element.style;
            if (!style) {
                return;
            }
            style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = speed + 'ms';
            style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
            style.msTransform = style.MozTransform = style.OTransform = 'translateX(' + dist + 'px)';
            // 正常切换，记录现在的位置
            if (isEnd) {
                nowDist = dist;
            }
        }

        function begin() {
            interval = setTimeout(next, delay);
        }

        function stop() {
            clearTimeout(interval);
        }

        // offload a functions execution
        function offloadFn(fn) {
            setTimeout(fn ||
            function() {}, 0)
        }

        function getOuterWidth(dom) {
            var marginLeft = parseFloat(window.getComputedStyle(dom, null).getPropertyValue('margin-left'));
            var marginRight = parseFloat(window.getComputedStyle(dom, null).getPropertyValue('margin-right'));
            return dom.offsetWidth + marginLeft + marginRight;
        }
    }

    qt.widget = qt.widget || {};
    qt.widget.Swipe = Swipe;

    if (window.jQuery || window.Zepto) {
        $.fn.Swipe = function(params) {
            return this.each(function() {
                $(this).data('Swipe', new Swipe($(this)[0], params));
            });
        }
    }
   
})();