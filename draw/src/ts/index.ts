/*
 * @Author: bowentang
 * @Date: 2021-08-27 15:25:32
 * @LastEditTime: 2021-09-07 17:07:42
 * @FilePath: /draw/src/ts/index.ts
 * @Description:
 */
// 引入依赖模块
import { Stage } from './stage.js';
import { getLastStage, rememberActivity } from './activity-history.js';


// 工作台
window.onload = function () {
  const stageData = getLastStage();
  // 记忆舞台
  const stage = new Stage(stageData.stage);
  // 获取舞台容器
  const stageWrap = document.getElementById('stageWrap');
  stageWrap.appendChild(stage.canvas);
  // 记忆sprites
  stageData.sprites.forEach((spriteConfig) => {
    let sprite = null;
    switch (spriteConfig.type) {
      case 'RectSprite':
        sprite = stage.addRectSprite(spriteConfig);
        break;
      case 'ImageSprite':
        // sprite=stage.addImageSprite(spriteConfig.imagePath,spriteConfig)  // 图片暂时缓存不了
        break;
      default:
        void(0);
    }
    sprite?.active && stage.spritesController.addActiveSprite(sprite);
  });
  rememberActivity(stage);
  // 其他
  window.stage = stage;
};
