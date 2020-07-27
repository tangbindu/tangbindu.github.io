import eventTarget from "./eventTarget.js";

//event
class DragFile extends eventTarget{
    constructor(){
        super();
        this.init();
    }
    init(){
        //拖拽上传文件
        window.document.addEventListener("dragenter", (e)=>{
            e.stopPropagation();
            e.preventDefault();
        }, false);
        window.document.addEventListener("dragover", (e)=>{
            e.stopPropagation();
            e.preventDefault();
        }, false);
        window.document.addEventListener("drop", (e)=>{
            //获取一张图片
            let handleFile=(files)=>{
                let i = 0;
                let readerFiles=(file)=>{
                    let reader = new FileReader();
                    reader.onload = ((theFile)=>{
                        let imgData = theFile.srcElement.result;
                        this.trigger("files",imgData,e)
                    })
                    reader.readAsDataURL(file);
                }
                for(let i=0;i<files.length;i++){
                    readerFiles(files[i]);
                }
            }
            handleFile(e.dataTransfer.files);
            e.stopPropagation();
            e.preventDefault();
        }, false);
    }
}
export default DragFile;