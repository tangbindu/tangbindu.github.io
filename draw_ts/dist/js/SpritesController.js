import tools from "./tools.js";
class SpritesController {
    constructor() {
        //click的元素
        this.lastSprite = null;
        this.sprites = [];
        this.supportMultipleClick = false;
    }
    //队列问题
    //删除问题
    //全选
    //选择-id
    getSpriteById(id) {
        var sprite = null;
        this.sprites.map((item) => {
            if (item.id == id) {
                sprite = item;
            }
        });
        return sprite;
    }
    //通过一点获取sprite
    getSpriteByPoint(ctx, point) {
        let sprite = null;
        for (var i = (this.sprites.length - 1); i >= 0; i--) {
            if (!this.sprites[i].allowClick) {
                continue;
            }
            this.sprites[i].draw(ctx);
            if (this.sprites[i].isInPath(ctx, point)) {
                sprite = this.sprites[i];
                break;
            }
        }
        return sprite;
    }
    //增加
    addSprite(sprite) {
        this.sprites.push(sprite);
        this.sprites.sort((a, b) => {
            return a.zindex - b.zindex;
        });
        this.lastSprite = sprite;
    }
    //全选
    selectAll() {
        this.sprites.map((sprite) => {
            if (sprite.allowClick) {
                sprite.active = true;
            }
        });
    }
    //反选择
    reverseSelect() {
        this.sprites.map((sprite) => {
            if (sprite.allowClick) {
                sprite.active = false;
            }
        });
    }
    //复制
    copyActiveSprites() {
        this.getActiveSprites().map((sprite) => {
            if (sprite.type == "default" && sprite.name == "rect") {
                let cloneSprite = new Rect({ x: sprite.x, y: sprite.y });
                for (let i in sprite) {
                    cloneSprite[i] = tools.deepClone(sprite[i]);
                }
                cloneSprite.active = true;
                this.sprites.push(cloneSprite);
                sprite.active = false;
            }
        });
    }
    //粘贴
    pasteActiveSprites() {
    }
    //获取最后一个
    getLastSprite() {
        return this.sprites[this.sprites.length - 1];
    }
    //移除最后一个
    removeLastSprite() {
        let lastSpriteIndex = this.sprites.findIndex((item) => {
            return item == this.lastSprite;
        });
        this.sprites.splice(lastSpriteIndex, 1);
    }
    //删除精灵
    deleteSprites() {
        this.sprites = this.sprites.filter((sprite) => {
            return !sprite.active;
        });
    }
    //获取active
    getActiveSprites() {
        return this.sprites.filter((sprite) => {
            return sprite.active;
        });
    }
    //删除其他active
    clearOtherActiveSprites(sprite) {
        this.sprites.map((item) => {
            if (item != sprite) {
                item.active = false;
            }
        });
    }
    //移动
    moveSprites(moveVector) {
        this.sprites.map((item) => {
            item.active && item.move(moveVector);
        });
    }
}
export default SpritesController;
//# sourceMappingURL=SpritesController.js.map