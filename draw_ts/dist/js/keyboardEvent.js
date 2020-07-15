import eventTarget from "./eventTarget.js";
//event
class KeyBoardEvent extends eventTarget {
    constructor(app) {
        super();
        this.app = app;
        this.pressCmd = false;
        this.pressShift = false;
        this.pressSpace = false;
        this.init();
    }
    init() {
        let app = this.app;
        let self = this;
        document.onkeydown = function (event) {
            if (/Mac/.test(navigator.platform)) {
                if (self.pressCmd && event.keyCode == 65) {
                    //全选
                    app.spritesController.selectAll();
                    event.preventDefault();
                }
                else if (self.pressCmd && event.keyCode == 68) {
                    //反选
                    app.spritesController.reverseSelect();
                    event.preventDefault();
                }
                else if (self.pressCmd && event.keyCode == 67) {
                    //复制
                    app.spritesController.copyActiveSprites();
                    event.preventDefault();
                }
                else if (self.pressCmd && event.keyCode == 86) {
                    //粘贴
                    app.spritesController.pasteActiveSprites();
                    event.preventDefault();
                }
                else if (event.keyCode == 221) {
                    //放大
                    app.scaleStage(1 + 5 / 75);
                    event.preventDefault();
                }
                else if (event.keyCode == 219) {
                    //缩小
                    app.scaleStage(1 - 5 / 75);
                    event.preventDefault();
                }
                else if (event.keyCode == 77) {
                    //draw mode
                    app.executeMode("draw");
                    event.preventDefault();
                }
                else if (event.keyCode == 86) {
                    //edit mode
                    app.executeMode("edit");
                }
                else if (event.keyCode == 8) {
                    //删除
                    app.deleteSprites();
                }
                else if (event.keyCode == 16) {
                    //shift
                    self.pressShift = true;
                    event.preventDefault();
                }
                else if (event.keyCode == 37) {
                    //left37
                }
                else if (event.keyCode == 39) {
                    //right39
                }
                else if (event.keyCode == 38) {
                    //right38
                }
                else if (event.keyCode == 40) {
                    //bottom40
                }
                else if (event.keyCode == 91) {
                    //command
                    self.pressCmd = true;
                    event.preventDefault();
                }
                else if (event.keyCode == 57) {
                    //布局
                }
                else if (event.keyCode == 32) {
                    //移动
                    self.pressSpace = true;
                    app.stage.view.style.cursor = 'move';
                }
                else {
                    // console.dir(event.keyCode)
                }
            }
            else {
            }
            //onkeydown render
            app.render();
        };
        document.onkeyup = function (event) {
            app.stage.view.style.cursor = 'default';
            self.pressCmd = false;
            self.pressShift = false;
            self.pressSpace = false;
            //onkeyup render
            app.render();
        };
    }
}
export default KeyBoardEvent;
//# sourceMappingURL=keyboardEvent.js.map