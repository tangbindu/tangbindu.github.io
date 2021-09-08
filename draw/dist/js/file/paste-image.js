const pasteImage = (stage) => {
    // 查找box元素,检测当粘贴时候2,
    document.addEventListener('paste', (e) => {
        for (let i = 0; i < e.clipboardData.items.length; i++) {
            // 判断是否是粘贴图片
            if (e.clipboardData && e.clipboardData.items[i].type.indexOf('image') > -1) {
                const reader = new FileReader();
                const file = e.clipboardData.items[i].getAsFile();
                reader.onload = (() => {
                    let _a;
                    let _b;
                    let _c;
                    let _d;
                    const imgData = reader.result;
                    // 假定data为img
                    const imgSprite = stage.addImageSprite(imgData, {
                        x: ((_b = (_a = stage.mouseEvent) === null || _a === void 0 ? void 0 : _a.curLogicPos) === null || _b === void 0 ? void 0 : _b.x) || 0,
                        y: ((_d = (_c = stage.mouseEvent) === null || _c === void 0 ? void 0 : _c.curLogicPos) === null || _d === void 0 ? void 0 : _d.y) || 0,
                        zindex: 0,
                        useDrag: true,
                    });
                    imgSprite.handler('imgLoaded', () => {
                        let width = 0;
                        stage.spritesController.getSpriteByName('image').forEach((img) => {
                            width += (img.width + 2);
                        });
                        imgSprite.x += (width - imgSprite.width);
                    });
                });
                reader.readAsDataURL(file);
            }
        }
    }, false);
};
export default pasteImage;
//# sourceMappingURL=paste-image.js.map