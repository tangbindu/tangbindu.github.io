import { Graph } from '../sprite/sprite-graph.js';
import tools from '../tools/tools.js';
/**
* 网格
*/
class Grid extends Graph {
  public app: any;
  public gap: number;
  constructor(config) {
    super(config);
    this.app = config.app;
    const pos = { x: this.x, y: this.y };
    this.points = [pos, pos, pos, pos];
    this.id = 'app_grid';
    this.gap = config.gap || 10;
  }
  draw(ctx) {
    ctx.save();
    ctx.lineWidth = 1; // 线条粗细
    ctx.strokeStyle = 'rgba(255,255,255,.1)'; // 线条颜色
    ctx.font = '20px Helvetica Neue, SimHei'; // 字体
    ctx.fillStyle = 'rgba(255,255,255,.5)'; // 字体颜色
    // 只画可见范围的线条
    const scale = this.getScale();
    const getPosition = this.getPosition();
    const sx = getPosition.x % this.gap;
    const sy = getPosition.y % this.gap;
    const gap = this.gap * scale;
    // 横轴
    let y = 0;
    ctx.textBaseline = 'top'; // 上下对准线条
    ctx.textAlign = 'left'; // 左右对准线条
    while (gap * y < (this.app.height + gap)) {
      ctx.beginPath();
      ctx.moveTo(0, tools.toDrawVal(gap * y + sy * scale));
      ctx.lineTo(this.app.width, tools.toDrawVal(gap * y + sy * scale));
      ctx.stroke();
      ctx.fillText(this.gap * y - (getPosition.y - sy), 0, gap * y + sy * scale);
      y += 1;
    }
    // 纵轴
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    let x = 0;
    while (gap * x < (this.app.width + gap)) {
      ctx.beginPath();
      ctx.moveTo(tools.toDrawVal(gap * x + sx * scale), 0);
      ctx.lineTo(tools.toDrawVal(gap * x + sx * scale), this.app.height);
      ctx.stroke();
      ctx.fillText(this.gap * x - (getPosition.x - sx), gap * x + sx * scale, 0);
      x += 1;
    }
    ctx.restore();
  }
}

const grid = (stage) => {
  const grid = new Grid({
    x: 0,
    y: 0,
    zindex: -30000,
    app: stage,
    gap: 100,
  });
  grid.type = 'app_assist';
  grid.allowClick = false;
  stage.addSprite(grid);
  return grid;
};

export default grid;
