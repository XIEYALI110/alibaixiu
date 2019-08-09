var userArr = [];
$.ajax({
    type: 'get',
    url: '/users',
    success: function(res){
        // console.log(res); 
        userArr = res;
        // console.log(userArr); 
        render(userArr)
    }
})
function render(userArr) {
    var html = template('tpl', {userArr});
    // console.log(html);
    $('tbody').html(html);
}
//添加用户请求
$('#addUser').on('click', function(){
    //获取表单内容并格式化为参数字符串
    var formData = $('#form').serialize();
    // if(formData == '') {
    //     alert('请输入相关信息');
    //     return
    // }
    // console.log(formData);
    $.ajax({
    type: 'post',
    url: '/users',
    data: formData,
    success: function(res){
        // console.log(res); 
        userArr.push(res);
        // console.log(userArr); 
        render(userArr)
    }

    
})    
})
//用户选择文件
$('form').on('change', '#avatar', function() {
    var formData = new FormData();
    formData.append('avatar', this.files[0]);
    // console.log(formData);
    // console.log(this.files[0]);
    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        //不解析请求参数
        processData: false,
        //不要设置参数的类型
        contentType: false,
        success: function (res) {
            $('#preview').attr('src', res[0].avatar);
            $('#hiddenAvatar').val(res[0].avatar);
        }
    })    
    });


var ids
//修改事件委托
$('tbody').on('click', '.edit', function() {
    ids = $(this).attr('data-id')
    // console.log(id);
    var tr = $(this).parents('tr');
    $('#email').val(tr.children().eq(2).html());
    $('#nickName').val(tr.children().eq(3).html());
    var status = tr.children().eq(4).html();
    // console.log(status);
    if(status == '激活') {
        $('#jh').prop('checked', true)
    }
    else {
        $('#wjh').prop('checked', true)
    }
    var role = tr.children().eq(5).html();
    // console.log(status);
    if(role == '超级管理员') {
        $('#admin').prop('checked', true)
    }
    else {
        $('#normal').prop('checked', true)
    }
    // 获取地址
    var  imgSrc  = tr.children(1).children('img').attr('src');
    // 将图片地址写到隐藏域中
    $('#hiddenAvatar').val('imgSrc');
    // 如果imgSrc有值则渲染  没有则使用原始图片
    if(imgSrc){
        $('#preview').attr('src' , imgSrc);
    } else{
        $('#preview').attr('src' , "../assets/img/default.png");
    }
    $('#form h2').html('修改用户');
    $('#addUser').hide();
    $('#change').show();
    $('#change').on('click', function() {
        var data = $('#form').serialize();
        $.ajax({
            url: '/users/' + ids,
            type: 'put',
            data: data,
            success: function(res) {
                console.log(res);
                var index = userArr.findIndex(item => item._id == ids);
                console.log(index);
                userArr[index] = res;
                console.log(userArr);            
                render(userArr);
                
            }

        })
        $('#email').val('');
        $('#nickName').val('');
        $('.radio-inline input').prop('checked', false);
        $('form img').attr('src', '../assets/img/default.png');
        $('#form h2').html('添加新用户');
        $('#change').hide();
        $('#addUser').show();
    })
})

