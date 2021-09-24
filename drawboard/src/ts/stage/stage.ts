/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-09-24 21:26:20
 * @FilePath: /draw/src/ts/stage.ts
 * @Description: 舞台,主要指canvas
 */
class Stage{
  // 指canvas组件
  public canvas: HTMLCanvasElement;
  // 绘图上下文
  public ctx: CanvasRenderingContext2D;
  // stage的width
  public width: number;
  // stage的高
  public height: number;
  // ratio
  public devicePixelRatio: number;
  // scale
  public scale: number;
  // 背景颜色
  public backgroundColor: string;
  /**
   * 构造
   */
  constructor() {
    // 初始化舞台
  }
  
  setSize(width: number, height:number) {
    this.width = width;
    this.height = height
  }
  
  getSize() {
    return {
      width: this.width,
      height: this.height,
    }
  }
}
export default Stage;
