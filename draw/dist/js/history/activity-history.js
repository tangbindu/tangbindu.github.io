/*
 * @Author: bowentang
 * @Date: 2021-09-07 16:01:08
 * @LastEditTime: 2021-09-09 01:14:42
 * @FilePath: /draw/src/ts/activity-history.ts
 * @Description:
 */
import storage from '../tools/storage.js';
const rememberActivity = (stage) => {
    let timmer = null;
    // 记忆体-存储
    stage.mouseEvent.handler('mouseup', () => {
        timmer && clearTimeout(timmer);
        timmer = setTimeout(() => {
            storage.saveStage(stage);
        }, 200);
    });
    stage.mouseEvent.handler('mousewheel', () => {
        timmer && clearTimeout(timmer);
        timmer = setTimeout(() => {
            storage.saveStage(stage);
        }, 200);
    });
    stage.keyBoardEvent.handler('keyup', () => {
        timmer && clearTimeout(timmer);
        timmer = setTimeout(() => {
            storage.saveStage(stage);
        }, 200);
    });
    stage.mouseEvent.handler('resize', () => {
        storage.saveStage(stage);
    });
};
export const rememberStage = (stage) => {
    var _a;
    // 记忆
    rememberActivity(stage);
    // 获取
    const stageData = storage.getStage();
    if (Object.keys(stageData.stage).length > 0) {
        stage.width = stageData.stage.width;
        stage.height = stageData.stage.height;
        stage.resize(stage.width, stage.height);
        stage.backgroundColor = stageData.stage.backgroundColor || '#2c3448';
    }
    // 恢复
    (_a = stageData.sprites) === null || _a === void 0 ? void 0 : _a.forEach((spriteConfig) => {
        let sprite = null;
        switch (spriteConfig.type) {
            case 'RectSprite':
                sprite = stage.addRectSprite(spriteConfig);
                break;
            case 'ImageSprite':
                // sprite=stage.addImageSprite(spriteConfig.imagePath,spriteConfig)  // 图片暂时缓存不了
                break;
            default:
                void (0);
        }
        (sprite === null || sprite === void 0 ? void 0 : sprite.active) && stage.spritesController.addActiveSprite(sprite);
    });
};
//# sourceMappingURL=activity-history.js.map