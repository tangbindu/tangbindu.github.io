/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-09-09 11:31:37
 * @FilePath: /draw/src/ts/index.ts
 * @Description:
 */
// 引入依赖模块
import { Stage } from './stage.js';
// 工作台
window.onload = function () {
    // 舞台
    const stage = new Stage({});
    // 安置stage
    document.getElementById('stageWrap').appendChild(stage.canvas);
    // 外显
    window.stage = stage;
};
//# sourceMappingURL=index.js.map