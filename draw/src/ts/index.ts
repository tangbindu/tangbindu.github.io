/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-09-08 02:07:56
 * @FilePath: /draw/src/ts/index.ts
 * @Description:
 */
// 引入依赖模块
import { Stage } from './stage.js';
import { rememberStage } from './history/activity-history.js';


// 工作台
window.onload = function () {
  // 舞台
  const stage = new Stage({});
  // 记忆 stage
  rememberStage(stage);
  // 安置stage
  const stageWrap = document.getElementById('stageWrap');
  stageWrap.appendChild(stage.canvas);
  // 其他
  window.stage = stage;
};
