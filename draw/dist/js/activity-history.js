/*
 * @Author: bowentang
 * @Date: 2021-09-07 16:01:08
 * @LastEditTime: 2021-09-07 16:14:17
 * @FilePath: /draw/src/ts/activity-history.ts
 * @Description:
 */
import storage from './storage.js';
export const getLastStage = () => {
    // 记忆体-获取
    const stageData = storage.getStage();
    stageData.stage.width = document.body.clientWidth;
    stageData.stage.height = document.body.clientHeight;
    stageData.stage.backgroundColor = stageData.stage.backgroundColor || '#2c3448';
    return stageData;
};
export const rememberActivity = (stage) => {
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
//# sourceMappingURL=activity-history.js.map