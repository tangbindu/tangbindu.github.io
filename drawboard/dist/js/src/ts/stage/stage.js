/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-09-24 21:26:20
 * @FilePath: /draw/src/ts/stage.ts
 * @Description: 舞台,主要指canvas
 */
class Stage {
    /**
     * 构造
     */
    constructor() {
        // 初始化舞台
    }
    setSize(width, height) {
        this.width = width;
        this.height = height;
    }
    getSize() {
        return {
            width: this.width,
            height: this.height,
        };
    }
}
export default Stage;
//# sourceMappingURL=stage.js.map