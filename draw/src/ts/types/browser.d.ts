/*
 * @Author: bowentang
 * @Date: 2021-09-07 14:59:17
 * @LastEditTime: 2021-09-07 15:12:07
 * @FilePath: /draw/src/ts/types/browser.d.ts
 * @Description: window对象扩展
 */
interface Window {
  stage:any;
}
interface document{
  body:{
    onmousewheel: any
  }
}


interface HTMLElement{
  onmousewheel?: (event: any) => any;
}



interface FileReader{
  srcElement: any;
}