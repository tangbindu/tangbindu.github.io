/**
 * Created by alltasxiao.
 */
var CommonTool = {
    //网络请求公共方法
    httpRequest: function (option, callback) {
        $.ajax({
            type: 'POST',
            url: option.url,
            data: option.param,
            dataType: "json",
            traditional: true,//传数组
            success: function (result) {
                //根据返回结果进行操作
                callback(result);
            },
            error: function (error) {
                console.log("请求错误")
            }
        });
    }
};