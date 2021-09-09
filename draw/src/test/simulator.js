/* eslint-disable*/

// 舞台
const drawboard = new Drawboard();
// 安置stage
document.getElementById('stageWrap').appendChild(drawboard.stage.canvas);
// 外显
window.drawboard = drawboard;