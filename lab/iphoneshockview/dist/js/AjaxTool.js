/**
 * Created by alltasxiao on 2017/12/22.
 */
var AjaxTool = function(option,callback) {
    $.ajax({
        type: option.type,
        url: option.url,
        data: option.data,
        dataType: "json",
        success: function (data) {
            if (data.success) {
                $("#createResult").html(data.msg);
            } else {
                $("#createResult").html("出现错误：" + data.msg);
            }
        },
        error: function (jqXHR) {
            alert("发生错误：" + jqXHR.status);
        }
    });
}