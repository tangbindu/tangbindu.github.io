/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-09-09 19:33:55
 * @FilePath: /draw/src/ts/index.ts
 * @Description:
 */
// 引入依赖模块
import { Drawboard } from './drawboard.js';
// 工作台
window.onload = function () {
  // 舞台
  const drawboard = new Drawboard();
  // 安置stage
  document.getElementById('stageWrap').appendChild(drawboard.stage.canvas);
  // 外显
  window.drawboard = drawboard;
};
