var isPassive = false;
window.onload = function() {
    var url = decodeURIComponent(window.location.href).replace(/###/g,'');
    var silent = getStringKey(url,'silent');
    if(silent=="1"){
        isPassive=true;//静默安装
        $(".newUserIndex").remove();
    }else{
        $(".newUserIndex_passive").remove();
    }
    var clickFlag = "new_user_active_pv";
    if(isPassive)clickFlag="new_user_passive_pv";
    picLog(clickFlag);
    objBind();
};
// 关闭弹窗
function closeWindow(obj){
    picLog(obj.attr("data-clickFlag"));
    var from = "主动安装";
    if(isPassive){
        from = "被动安装";
    }
    var psrc = "新用户首页->"+from;
    var csrc = psrc+"->红玫瑰";
    var musicObj = {
        album: "歌手第一季 第八期",
        albumid: "2152417",
        artist: "张碧晨",
        artistid: "195792",
        copyright: "0",
        duration: "276",
        formats: "WMA96|WMA128|MP3H|MP3192|MP3128|ALFLAC|AL|AAC48|AAC24",
        hasmv: "0",
        id: "22399768",
        is_point: "0",
        muti_ver: "0",
        name: "红玫瑰",
        online: "1",
        params: "红玫瑰;张碧晨;歌手第一季 第八期;2550536161;48802622;MUSIC_22399768;2136734938;639681148;22399768;0;0;MV_0;0",
        pay: "0",
        score100: "39"
    }
    saveMusicInfo(musicObj,"playlist",psrc);
    var playMusicString = MUSICLISTOBJ[22399768]+"&CSRC="+encodeURIComponent(csrc);
    singleMusicOption("Play",playMusicString);
    console.log(playMusicString)
    callClient("CloseWindow");
}
// 领取vip
function getVip(type){
    var uid = getUserID('uid');
    var devid = getUserID("devid");
    if(!type)picLog('new_user_getVip');
    if(uid==0){
        var parent = callClient('GetNavtiveWindow');
        picLog('new_user_login');
        callClient("UserLogin?src=login&parent="+parent+"&from=newUser");
    }else{
        $.ajax({
            url:"http://www.kuwo.cn/newh5/channelred/redeemKWVip?uid="+uid+"&devId="+devid+"&mobileu=&gid=&from=pc&secrect=nPFuP/nN9DXxyhLl1AUSvx388cWYY/We3XKqwYsrtxQngf0/SLR2NKRPvvxy/n9Q",
            type:"get",
            dataType:"json",
            success:function(jsondata){
                if(jsondata.status==200){
                    picLog('new_user_getVip_success');
                    callClient("RefreshVipLogo?");
                    saveDataToCache("isNewUserIndex","true");
                    showErrorTips(jsondata.msg);
                    setTimeout(function(){
                        var url = "${netsong}newUserPlayList.html?sourceid=618614391&other=|psrc=新用户首页->被动安装->|csrc=新用户首页->被动安装->VIP尊享无损歌单";
                        jumpToOtherUser(url);
                        callClient("CloseWindow");
                    },2000);
                }else{
                    showErrorTips(jsondata.msg);
                }
            },
            error:function(){
                showErrorTips("兑换失败，请稍后重试");
            }
        });
    }
}
// 页面跳转
function jumpToOtherUser(url){
    var param = '';
    param="vipPlayList";
    var channelInfo ='my';
    channelInfo = 'ch:3;name:vipPlayList;';
    var call = "PageJump?param="+encodeURIComponent(param) + ";" + encodeURIComponent(channelInfo)+ ";" +encodeURIComponent('url:'+url)+'&calljump=true';
    callClient(call);
}
// 抢先试听
function testListen(){
    picLog('new_user_testListen');
    saveDataToCache("isNewUserIndex","true");
    commonClick({'source':'8','sourceid':'2115341334','name':'歌手2017','id':'415016','extend':'AL_FLAG=1|','other':'|psrc=分类->歌手2017->|csrc=曲库->分类->歌手2017->歌单->歌手2017|bread=-2,5,分类,-2;40,415015,歌手2017,0'})
    callClient("CloseWindow");
}
function objBind(){
    $(".closeWindow_active,.closeWindow").live("click",function(){
        closeWindow($(this));
        return false;
    });
    $(".newUserIndex").live("click",function(){
        testListen();
        return false;
    });
}
// 点击统计
function picLog(clickFlag){
    if(!clickFlag){
        return;
    }
    var pic = new Image();
    pic.src="http://webstat.kuwo.cn/logtj/comm/commjstj/channelred/pc/"+clickFlag+".jpg?u="+getUserID("devid")+"&gid=&channel=&from=pc&src=";
}
// error
function showErrorTips(msg){
    if($('.errorTips').css('display')=='block'){
        return;
    }
    $('.errorTips').show().html(msg);
    setTimeout(function(){
        $('.errorTips').hide().html('');
    },2000);
}

// onlogin

function OnLogin(){
    if(isPassive){
    	getVip("isLogin");
    }
}



