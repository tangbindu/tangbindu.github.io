/*
 * @Author: bowentang
 * @Date: 2021-09-07 16:01:08
 * @LastEditTime: 2021-09-08 00:50:45
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
};
export const rememberStage = (stage) => {
    // 记忆
    rememberActivity(stage);
    // 获取
    const stageData = storage.getStage();
    stageData.stage.width = document.body.clientWidth;
    stageData.stage.height = document.body.clientHeight;
    stage.resize(stageData.stage.width, stageData.stage.height);
    stage.backgroundColor = stageData.stage.backgroundColor || '#2c3448';
    // 恢复
    stageData.sprites.forEach((spriteConfig) => {
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