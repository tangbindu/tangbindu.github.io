/*
 * @Author: bowentang
 * @Date: 2021-08-27 18:45:08
 * @LastEditTime: 2021-08-27 19:35:27
 * @FilePath: /draw/src/ts/animations.ts
 * @Description: 
 */
export default {
  animate({timing, draw, duration}) {
    let start = performance.now();
    requestAnimationFrame(function animate(time) {
      // timeFraction goes from 0 to 1
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
      // calculate the current animation state
      let progress = timing(timeFraction);
      draw(progress); // draw it
      if (timeFraction < 1) {
      requestAnimationFrame(animate);
      }
    });
  }
}