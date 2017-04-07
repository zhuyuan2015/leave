$(function(){
    //默认6条最新留言
    getLeave(1);
    //增加留言
    $("#leave").submit(function(){
        $.ajax({
            url:'/addLeave',
            type:'post',
            data:$("#leave").serialize(),
            beforeSend:function(jqXHR,setting){
                $("#submit").get(0).disabled = true;
                $("#load").show();
            },
            success:function(data){
                if(data.result){
                    msg.info(true,"提交成功");
                    var complied = _.template($("#leaveTemplate").html());
                    var html = complied({
                        name: $("#name").val(),
                        content: $("#content").val(),
                        date: data.date
                    });
                    $("#leaveList").prepend($.parseHTML(html));
                }
            },
            complete : function(XMLHttpRequest,textStatus){
                $("#submit").get(0).disabled = false;
            },
            error:function(result){
                msg.info(false,"提交出错: 找不到提交地址或者网络错误");
            }
        });
        return false;
    });
    // 留言分页
    $.get("/leavePage",function(data){
        var count = data.result;
        if(count > 0){
            $.jqPaginator('#leavePage', {
                totalPages: Math.ceil(count / 6),
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    getLeave(num);
                }
            });
        }
    });
    //删除留言
    $("#leaveList").on("click",".delete",function(){
        var id = $(this).attr("name");
        $.get("/deleteLeave?id=" + id,function(data){
            if(data.result){
                $("#"+id).remove();
            }
        });
    });
});

function l(n){
    console.log(n);
}

/**
 * 获取留言
 * @param page
 */
function getLeave(page){
    $.get("/getLeave?page="+ (page - 1),function(data){
        var count = data.result.length;
        if(count > 0){
            var complied = _.template($("#leaveTemplate").html());
            $("#leaveList").html("");
            for(var i = 0; i < count; i++){
                var html = complied(data.result[i]);
                $("#leaveList").append($.parseHTML(html));
            }
        }else {
            $("#leaveList").append("<h3>还没有留言哦~</h3>");
        }
    });
}

/**
 * 状态提示
 * @type {{info: Function, close: Function}}
 */
var msg = {
    info:function(status,text){
        setTimeout(function(){
            $("#load").hide();
            var y = status == true ? "0px" : "-18px";
            $(".msg").css({
                backgroundPosition: "0 " + y
            }).next().html(text).parent().show();
            msg.close();
        },500);
    },
    close:function(){
        setTimeout(function(){
            $("#msg").hide();
        },2000);
    }
}
