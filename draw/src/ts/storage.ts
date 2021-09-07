/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-08-27 19:20:30
 * @FilePath: /draw_ts/src/ts/storage.ts
 * @Description:
 */
const storage = {
  // stage
  stage: {},
  // sprites
  sprites: [],
  saveStage(stage) {
    this.stage = {};
    this.sprites = [];
    // save stage
    for (const name in stage) {
      if (typeof stage[name] !== 'object') {
        this.stage[name] = stage[name];
        this.stage.x = 0;
        this.stage.y = 0;
        this.stage.scale = 1;
      }
    }
    // sage sprite
    stage.spritesController.sprites.forEach((sprite) => {
      if (sprite.type != 'app_assist') {
        const spriteConfig = {};
        for (const proName in sprite) {
          if (typeof sprite[proName] !== 'object') {
            if (proName === 'imagePath' && (sprite[proName].length > 200)) {
              // 不存了
              spriteConfig[proName] = '#';
            } else {
              spriteConfig[proName] = sprite[proName];
            }
          }
        }
        this.sprites.push(spriteConfig);
      }
    });
    localStorage.setItem('stage', JSON.stringify(this.stage));
    localStorage.setItem('sprites', JSON.stringify(this.sprites));
  },
  getStage() {
    return {
      stage: JSON.parse(localStorage.getItem('stage')) || {},
      sprites: JSON.parse(localStorage.getItem('sprites')) || [],
    };
  },

};
export default storage;
