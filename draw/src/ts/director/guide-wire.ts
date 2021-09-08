
import { Graph } from '../sprite/sprite-graph.js';
import tools from '../tools/tools.js';
/**
* Guidewires
*/
class Guidewires extends Graph {
  public app: any;
  constructor(config) {
    super(config);
    this.app = config.app;
    const pos = { x: this.x, y: this.y };
    this.points = [pos, pos, pos, pos];
    this.id = 'app_guidewires';
  }
  draw(ctx) {
    const scale = this.getScale();
    const getPosition = this.getPosition();
    // 竖
    ctx.save();
    ctx.fillStyle = 'rgba(0,255,0,.5)';
    ctx.beginPath();
    ctx.moveTo(tools.toDrawVal(getPosition.x * scale), tools.toDrawVal(0));
    ctx.lineTo(tools.toDrawVal(getPosition.x * scale + Math.max(scale, 1.0)), tools.toDrawVal(0));
    ctx.lineTo(tools.toDrawVal(getPosition.x * scale + Math.max(scale, 1.0)), tools.toDrawVal(this.app.height));
    ctx.lineTo(tools.toDrawVal(getPosition.x * scale), tools.toDrawVal(this.app.height));
    ctx.closePath();
    ctx.fill();
    // 横
    ctx.beginPath();
    ctx.moveTo(tools.toDrawVal(0), tools.toDrawVal(getPosition.y * scale));
    ctx.lineTo(tools.toDrawVal(0), tools.toDrawVal(getPosition.y * scale + Math.max(scale, 1.0)));
    ctx.lineTo(tools.toDrawVal(this.app.width), tools.toDrawVal(getPosition.y * scale + Math.max(scale, 1.0)));
    ctx.lineTo(tools.toDrawVal(this.app.width), tools.toDrawVal(getPosition.y * scale));
    ctx.closePath();
    ctx.fill();
    // 相对坐标
    const fontSize = 12;
    ctx.fillStyle = 'rgba(255,0,0,1)';
    ctx.font = `${fontSize * window.devicePixelRatio}px Helvetica Neue, SimHei`;
    // const text = "("+tools.toInt(getPosition.x-this.app.x+1) + ", " + tools.toInt(getPosition.y-this.app.y+1)+")";
    const text = `(${this.app.mouseEvent.curLogicPos.x}, ${this.app.mouseEvent.curLogicPos.y})`;
    ctx.fillText(text, Math.min(getPosition.x * scale + fontSize * window.devicePixelRatio, this.app.width - text.length * fontSize * window.devicePixelRatio / 2) - 10, Math.max(getPosition.y * scale - 10, fontSize * window.devicePixelRatio));
    ctx.restore();
  }
}

const guideWire = (stage) => {
  const guidewires = new Guidewires({
    x: 0,
    y: 0,
    zindex: 30000,
    app: stage,
  });
  guidewires.allowClick = false;
  guidewires.index = 1000000;
  guidewires.type = 'app_assist';
  stage.addSprite(guidewires);
  return guidewires;
};
export default guideWire;
