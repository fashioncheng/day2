var currentObj;
var tabIndex;
var psrc;
var originalPsrc;
var bread;
var phbid;
var bangid;
var sourceid;
var currentVolume;
var nowDate;
var listennum;
var infoTxt = '';
var txtLen = 0;
var currentName;
var volumeFlag = false;//选期是否为当前期数
var oldurl=decodeURIComponent(window.location.href).split('?')[0];
var oldmsg='';
// 打榜当前数据接口
var ajaxContentUrl;
// 打榜下一份数据接口
var saveAsiaUrl = "http://kbangserver.kuwo.cn/ksong.s?from=pc&fmt=json&type=bang&data=content&id=132&pn=0&rn=200&callback=getAsiaOldListData&show_copyright_off=1&pcmp4=1&get_next_version=1&isbang=1&t="+new Date().getTime();
// 打榜下一份数据
var asiaOldData;
var csrc="";
// 来源于新用户首页
var isNewUserIndex = "false";
window.onload = function () {
    callClientNoReturn('domComplete');
    var url=decodeURIComponent(window.location.href).replace(/###/g,'');
    var msg=getUrlMsg(url);
    oldmsg=msg;
    centerLoadingStart("content");
    phbid = url2data(msg,'id');
    sourceid = url2data(msg,'sourceid');
    psrc = getStringKey(msg,'psrc');
    originalPsrc = getStringKey(msg,'psrc');
    bread = getStringKey(msg, 'bread');
    bangid = getStringKey(msg, 'bangid') || 0;
    tabIndex = getStringKey(msg, 'tabIndex') || 0;
    csrc = getStringKey(msg,'csrc');
    // 来源于新用户首页
    isNewUserIndex = getDataByCache("isNewUserIndex");
    // 来源于新用户首页 end

    //currentObj = fobj.goldjson;
    // phbid = currentObj.id;
    // psrc = getStringKey(currentObj.other, 'psrc');
    // originalPsrc = getStringKey(currentObj.other,'psrc');
    // bread = getStringKey(currentObj.other, 'bread');
    // bangid = getStringKey(currentObj.other, 'bangid') || 0;
    // tabIndex = getStringKey(currentObj.other, 'tabIndex') || 0;
    // 请求打榜当前数据
    ajaxContentUrl = getChargeURL('http://kbangserver.kuwo.cn/ksong.s?from=pc&fmt=json&type=bang&data=content&id=' + phbid + '&pn=0&rn=200&isbang=1&show_copyright_off=1&pcmp4=1&bangid=' + bangid+'&t='+new Date().getTime());
    $.ajax({
        url:ajaxContentUrl,
        dataType:'text',
        type:'get',
        success:function(json){
            var json = eval("("+json+")");
            getBangTabListData(json);
        },
        error:function(){
            loadErrorPage();
        }
    });
    //getScriptData(ajaxContentUrl);
    //createBread(currentObj, 'playlist');
    getSomeData();
    objBindFn();
    //iframeObj.refresh();
};

$(window).resize(function(){
	iframeObj.refresh();
	refreshInfoTxt();
});

// 获取榜单信息
function getSomeData() {
	var url = 'http://qukudata.kuwo.cn/q.k?op=query&cont=ninfo&node='+sourceid+'&pn=0&rn=10&fmt=json&src=mbox';
    //getScriptData(url);
    var d = new Date();
    var time = d.getYear()+d.getMonth()+d.getDate()+d.getHours()+parseInt((d.getMinutes()/20));
    time = ''+d.getYear()+d.getMonth()+d.getDate()+time;
    url = url+"&ttime="+time;
    var cbangstrattime=new Date().getTime();
    $.ajax({
        url:url,
        dataType:'jsonp',
        success:function(json){
            var endtime=new Date().getTime()-cbangstrattime;
            var csrcArr = [];
            csrcArr = csrc.split("->");
            realTimeLog("WEBLOG","url_time:"+endtime+";"+"qukutree"+";"+url);
            realShowTimeLog(url,1,endtime,0,0);
            getBangInfoData(json);
            if(!$(".tab").is(":hidden")&&csrcArr.length==3){
               csrc+="->单曲榜"; 
            }
            if(csrcArr.length==4)csrc = csrc.substring(0,csrc.lastIndexOf("->")+2)+$(".tab .current").html();
            $("body").attr("data-csrc",csrc);
        },
        error:function(xhr){
            var endtime=new Date().getTime()-cbangstrattime;
            loadErrorPage();
            var httpstatus = xhr.status;
            if(typeof(httpstatus)=="undefined"){
                httpstatus = "-1";
            }
            var sta = httpstatus.toString();
            realTimeLog("WEBLOG","url_error:"+sta+";qukutree;"+url);
            webLog("请求失败,url:"+url);
            realShowTimeLog(url,0,endtime,sta,0);
        }
    });
}

// 创建榜单内容
function getBangInfoData (jsondata) {
    var data = jsondata;
    var infoData = data.ninfo;
    var name = infoData.name;
    currentName = name;
    var intro = infoData.intro;
    var info = infoData.info;
    var pic = infoData.pic;
    var child = data.child;
    var len = child.length;
    var arr = [];
    var day = parseInt(info.substring(info.indexOf('-')+4),10);
    var month = parseInt(info.substring(info.indexOf('-')+1,info.indexOf('-')+3),10);
    nowDate = '最近更新：'+month+"月"+day+"日";
    listennum = infoData.listen;
    psrc = psrc + name;
    infoTxt = intro.replace(/<br\/>/g,'');
    txtLen = infoTxt.length;
    var rankurl = "";
    for(var i=0; i<len; i++) {
        var disname = child[i].disname;
        var sourceid = child[i].sourceid;
        var oClass = '';
        if (i == tabIndex) { 
            oClass = 'current';
            var url = 'http://kbangserver.kuwo.cn/ksong.s?from=pc&fmt=json&type=bang&data=content&id='+phbid+'&pn=0&rn=200&isbang=1&show_copyright_off=1&pcmp4=1';
            url = getChargeURL(url);
            if (bangid) url += '&bangid='+ bangid;
            rankurl = url;
        }
        arr[arr.length] = '<a hidefocus href="###" c-id="';
        arr[arr.length] = sourceid;
        arr[arr.length] = '" class="';
        arr[arr.length] = oClass;
        arr[arr.length] = '">';
        arr[arr.length] = disname;
        arr[arr.length] = '</a>';
    }
    if (len < 2) {
        $(".tab").hide();
    } else {
        $(".tab").html(arr.join('')).show();    
    }

    if(sourceid==56){
        $(".bang_box").css({"background":"url(img/hot.png) no-repeat"});
        $(".bang_head").css("background","#ea646d");
        $(".bang_head .bang_left .bang_name").css("width","256px");
    }else if(sourceid==29){
        $(".bang_head").css("background","#10afac");
        $(".bang_box").css({"background":"url(img/new.png) no-repeat"});
        $(".bang_head .bang_left .bang_name").css("width","256px");
    }else if(sourceid==96){
        $(".bang_head").css("background","#ed9b3b");
        $(".bang_box").css({"background":"url(img/up.png) no-repeat"});
        $(".bang_head .bang_left .bang_name").css("width","256px");
    }else {
        if(name.length>=15){
            name = name.substring(0,13);
        }
        $(".bang_box .bang_name").html(name);
        $(".bang_head").css("background","#54aee6");
        $(".bang_box").css({"background":"url(img/bang-other.png) no-repeat"});
    }
    $(".radio_btn").attr({"c-id":phbid,"c-name":name});
    // getScriptData(url);
    $.ajax({
        url:url,
        dataType:'jsonp',
        success:function(json){
            getBangTabListData(json);
        }
    });
    showRadio(phbid,"rank");
    refreshInfoTxt();
    iframeObj.refresh();
}
// 处理收听人数
function listenNum(listennum){
    if (listennum > 9999) {
        var n1 = parseInt(listennum / 10000,10);
        var n2 = listennum % 10000 + '';
        n2 = n2.substring(0,2);
        listen = n1 + '.' + n2 + '万';
    } else {
        listen = listennum;
    }
    return listen;
}
// 创建榜单列表榜数据
function getBangTabListData(jsondata) {
    var data = jsondata;
    var type = data.type;
    var volumeData = data.volume;
    var times = listenNum(parseInt(listennum));
    times = '<span class="icon"></span><span>'+times+'</span>';
    currentVolume = data.currentVolume;
    if(volumeData){
        createVolume(volumeData,currentVolume);
    } else {
        $(".bang_head .time").html(nowDate);
    }
    $(".bang_head .times").html(times);
    $(".listTitle").css("margin-bottom","0px");
    if(type=="music"){
        createMusicList(data);
    }else if(type=="music2"){
        // 打榜头部
        $(".bang_head").css("background","#b861ae");
        $(".bang_box").css({"background":"url(img/asia.jpg) no-repeat"});
        $(".bang_head .bang_left .bang_name").css("width","350px");
        $(".bang_right").append('<a class="b_btn js-rules" href="javascript:;">榜单规则</a>')
        // 打榜selall
        var selallStr = '<div>\
                            <div class="ml" style="width:56px;">\
                                <span class="checkall" style="float:left"><input type="checkbox" checked="true" class="all_ckb"><font class="top"></font></span>\
                            </div>\
                            <div class="mr_box">\
                                <div class="mr_box_r" style="width:240px">\
                                    <span class="s_list" style="margin-left:15px">分数</span>\
                                    <span class="s_list operation" style="width:31px;float: right;margin-right:53px;">操作</span>\
                                </div>\
                                <div class="mr_center_con" style="overflow: hidden;zoom:1;">\
                                    <span class="s_list m_name_box" style="width: 70%; margin-right: 0px;">歌名</span>\
                                    <span class="s_list m_artist_box" style="width: 29%; margin-right: 0px;">歌手</span>\
                                </div>\
                            </div>\
                        </div>'
        $(".listTitle").html(selallStr);
        // 显示打榜当前数据
        var seconds = data.second;
        var countTo = seconds * 1000 + new Date().valueOf();
        $('.countdown').countdown(countTo, function (event) {
            var $this = $('.countdown')
            switch (event.type) {
                case "seconds":
                case "minutes":
                case "hours":
                case "days":
                case "weeks":
                case "daysLeft":
                    $this.find('.' + event.type).html(event.value);
                    break;
                case "finished":
                    createMusic2List(asiaOldData);
                    dbTime();
                    break;
            }
        });
        createMusic2List(data);
        if(!volumeFlag){
            // 选当前期数请求打榜下一份数据
            $(".countdown").show();
            //getScriptData(getChargeURL(saveAsiaUrl));
            $.ajax({
                url:getChargeURL(saveAsiaUrl),
                dataType:'jsonp',
                success:function(json){
                    getBangTabListData(json);
                }
            });
        }else{
            // 选往前期
            oldBangInit();
        }
    }else if(type=="album"){
        createAlbumList(data);
    }else if(type=="artist"){
        createArtistList(data);
        
    }else if(type=="mv"){
        createMVList(data);
    }else{
        centerLoadingEnd("content");
        iframeObj.refresh();
    }    
}
function oldBangInit(){
    $(".js-hit").hide();
    $(".countdown").hide();
    $(".mr_r").css("width","200px");
    $(".mr_box_r").css("width","175px");
    $(".operation").css("margin-right","15px");
    $(".arrowping").css("visibility","hidden");
    $(".arrowup").css("visibility","hidden");
    $(".arrownew").css("visibility","hidden");
    $(".arrowdown").css("visibility","hidden");
    $(".db_music_list .icon_b span").css("color","#a1a1a1");
    $(".db_music_list .icon_b:eq(0) span").css("color","#fd0953");
    $(".db_music_list .icon_b:eq(1) span").css("color","#ff841d");
    $(".db_music_list .icon_b:eq(2) span").css("color","#f7c61a");
}
// 存打榜榜单下一份数据
function getAsiaOldListData(jsondata){
    // 存下一份数据
    asiaOldData = jsondata;
}
// 打榜倒计时2分钟后存打榜下一份数据
function dbTime(){
    var seconds = 600;//10分钟
    var countTo = seconds * 1000 + new Date().valueOf();
    var bigstr = '';
    // 2分钟后存打榜下一份数据
    setTimeout(function(){
        $.getScript(getChargeURL(saveAsiaUrl));
    },120000);
    // 倒计时
    $('.countdown').countdown(countTo, function (event) {
        var $this = $('.countdown')
        switch (event.type) {
            case "seconds":
            case "minutes":
            case "hours":
            case "days":
            case "weeks":
            case "daysLeft":
                $this.find('.' + event.type).html(event.value);
                break;
            case "finished":
                // 倒计时结束渲染页面并回调
                createMusic2List(asiaOldData);
                dbTime();
                break;
        }
    });
    $(".bang_list").show();
    centerLoadingEnd("content");    
    iframeObj.refresh();
}
function createVolume(volumeData,currentVolume) {
    var pastV = volumeData;
    var currentV = currentVolume;
    var weekarr = [];
    var volumearr = [];
    var sortarr = [];
    var currentYear =currentVolume.substring(0,4);
    var currentNum = currentVolume.substring(5)+'期';
    for (var i in pastV) {
        weekarr[weekarr.length] = '<a href="###" hidefocus><div class="leftCircle"></div>'+i+'</a>';
        volumearr.push(pastV[i]);
        sortarr.push(parseInt(i,10));
    }
    $(".bang_head .time").html(nowDate);
    if (sortarr.length < 1) return;
    if (sortarr[0] < sortarr[1]) {
        weekarr.reverse();
        volumearr.reverse();
    }
    if (weekarr.length > 4) weekarr.length = 4;
    if (volumearr.length > 4) volumearr.length = 4; 
    var bigstr = '';
    var bigarr = [];
    for (var i=0; i<volumearr.length; i++){
        var obj = volumearr[i];
        var yeararr = [];
        for (var j=0; j<obj.length; j++){
            var someObj = obj[j];
            var id = someObj.third_id;
            var name = someObj.name;

            yeararr[yeararr.length] = '<a href="###" hidefocus class="week" title="'+name+'期" c-id="'+id+'">'+name+'期</a>'
        }

        bigarr[bigarr.length] = '<div class="year_box" style="display:none;" c-index="'+i+'">'+yeararr.join('')+'</div>' 
        bigstr = bigarr.join('');
    }
    var navstr = '<div class="sub_nav" style="margin-bottom:5px;width:217px;">' + weekarr.join('') + '</div>';
    $(".type_list").html(navstr + bigstr);
    if (currentV == '0|0'){
        var week = $(".year_box").eq(0).find(".week").eq(0).text();
        $(".sort font").html(week);
        $(".year_box").eq(0).show();
        $(".sub_nav>a").eq(0).addClass("current");
        $(".year_box").eq(0).find(".week").eq(0).addClass("current");       
    } else {
        var currentYear = currentV.split('|')[0];
        var currentWeek = currentV.split('|')[1] + '期';
        var ai = 0;
        var bi = 0;
        $(".sort font").html(currentWeek);
        $(".sort").attr("title",currentWeek);
        $(".sub_nav>a").each(function(i){
            var year = $(this).text();
            if (year == currentYear) {
                ai = i;
                $(".year_box").eq(i).show();
                $(".sub_nav>a").eq(i).addClass("current");
                $(".year_box").eq(i).find("a").each(function(j){
                    if ($(this).html() == currentWeek) {
                        bi = j;
                        $(this).addClass("current");
                    }
                });
            }
        });
        if (ai!=0 || bi!=0) nowDate = currentYear +'年第'+currentWeek;
    }
    // 往期无打榜计时和打榜开关
    if(currentNum!=$('.bang_head .year_box a').eq(0).html()||currentYear!=$('.bang_head .sub_nav a').eq(0).html().match(/\d+(\.\d+)?/g)){
        volumeFlag = true;
    }else{
        volumeFlag = false;
    }
    $(".bang_head .time").html(nowDate);
    $(".bang_head .time").html(nowDate);
    $(".sort_wrap").show();
}

// 创建歌曲列表
function createMusicList(jsondata) {
    var data = jsondata;
    var child = data.musiclist;
    var len = child.length;
    var arr = [];
    MUSICLISTOBJ = {};
    if(psrc==''){
        psrc = '排行榜->'+currentName;
    }
    var musicNum = 0;
    for (var i = 0; i < len; i++) {
        var online = child[i].online;
        if(typeof(online)!="undefined"&&online.length==1&&online==0){
            len--;
            continue;
        }
        arr[arr.length] = createBangMusicList(child[i],musicNum,psrc);
        musicNum++;
    }
    $(".checkall font").html(len);
    $(".kw_block_list").hide().html(""); 
    $(".selall").show();       
    setTimeout(function(){
        $(".kw_music_list").get(0).innerHTML = arr.join(''); 
        setTimeout(function(){
            centerLoadingEnd("content");
            iframeObj.refresh();
        },1);   
    },1);  
    //来源于新用户首页
    if(eval(isNewUserIndex)){
        $(".all_play").click();
    }
}
// 创建打榜歌曲列表
var globalVolume;
function createMusic2List(jsondata){
    var data = jsondata;
    var child = data.musiclist;
    var len = child.length;
    var arr = [];
    MUSICLISTOBJ = {};
    var currentVolume = data.currentVolume
    currentVolume = currentVolume.split('|')
    currentVolume=currentVolume[0]+'第'+currentVolume[1]+'期';
    globalVolume = currentVolume;
    psrc = '排行榜->'+ '酷音乐亚洲排行榜' + '->' + currentVolume;
    var musicNum = 0;
    for (var i = 0; i < len; i++) {
        var online = child[i].online;
        if(typeof(online)!="undefined"&&online.length==1&&online==0){
            len--;
            continue;
        }
        arr[arr.length] = createBangAllMusicList(child[i],musicNum,psrc);
        musicNum++;
    }
    $(".checkall font").html(len);
    $(".kw_block_list").hide().html("");
    $(".kw_music_list").hide().html("");
    $(".db_music_list").html(arr.join(''));
    $(".selall").show();
    centerLoadingEnd("content");
    iframeObj.refresh();
}
// 创建专辑列表
function createAlbumList(jsondata) {
    var data = jsondata;
    var child = data.albumlist;
    var len = child.length;
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr[arr.length] = createAlbumBlock(child[i],'bang');
    }
    $(".selall").hide();
    $(".kw_music_list").hide().html("");
    $(".db_music_list").hide().html("");
    setTimeout(function(){
        $(".kw_block_list").get(0).innerHTML = arr.join('');
        centerLoadingEnd("content");
        iframeObj.refresh();
    },1);   
}

// 创建歌手列表
function createArtistList(jsondata) {
    var data = jsondata;
    var child = data.artistlist;
    var len = child.length;
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr[arr.length] = createArtistBlock(child[i],'bang');
    }
    $(".selall").hide();
    $(".kw_music_list").hide().html("");
    $(".db_music_list").hide().html("");
    setTimeout(function(){
        $(".kw_block_list").get(0).innerHTML = arr.join('');
        centerLoadingEnd("content");
        iframeObj.refresh();
	},1);   
}

// 创建MV列表
function createMVList(jsondata) {
    var data = jsondata;
    var child = data.mvlist;
    var len = child.length;
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr[arr.length] = createMVBlock(child[i],'bang','','排行榜->'+currentName+"(MV榜)",i);
    }
    $(".selall").hide();
    $(".selall_mv").find("font").html("共"+len+"首");
    $(".selall_mv").show();
    $(".selall_mv .all_playmv").show();
    $(".kw_music_list").hide().html('');
    $(".db_music_list").hide().html("");
    setTimeout(function(){
        //$(".kw_block_list").get(0).innerHTML = arr.join('');
        $(".kw_mv_list").get(0).innerHTML = arr.join('');
        centerLoadingEnd("content");
        iframeObj.refresh();
	},1); 
}

function refreshInfoTxt() {
	if ($(".info").hasClass("on")) return;
	var num = Math.floor(parseInt($(".info").width()) / 12.6) * 2 - 6;
	var text = '';
	if (txtLen > num){
		text = infoTxt.substring(0,num) + '...<a href="###" hidefocus class="open">[更多]</a>';
	} else {
		text = infoTxt;
	}
	$(".info span").html(text);
}

function objBindFn() {
    $(".open").live("click",function(){
        $(".info").addClass("on");
        $(".info span").html(infoTxt + '<a href="###" hidefocus class="fold">[收起]</a>');
        return false;
    });
    
    $(".fold").live("click",function(){
        $(".info").removeClass("on");
        refreshInfoTxt();
        return false;
    }); 
    
    $(".tab a").live("click",function(){
        var id = $(this).attr("c-id");
        var other = '|psrc='+originalPsrc+'|bread='+bread+'|tabIndex='+ $(this).index()+'|csrc='+csrc;
        // var other = '|psrc='+psrc+'|bread='+bread+'|tabIndex='+tabIndex+'|pn=0|bangid='+bangid;
        var url=decodeURIComponent(window.location.href);
        var msg=getUrlMsg(url);
        var source=url2data(msg,'source');
        var sourceid=url2data(msg,'sourceid');
        var name=url2data(msg,'name');
        commonClick(new Node(source,sourceid,name,id,'',other));
        return false;
    });
    
    $(".sub_nav>a").live("click",function(){
        var index = $(this).index();
        $(this).addClass("current").siblings().removeClass("current");
        $(".year_box").eq(index).show().siblings(".year_box").hide();
        return false;
    });
    
    $(".year_box .week").live("click",function(){
        var bangid = $(this).attr("c-id");
        var other = '';
        if(bangid==$(".year_box .week").eq(0).attr("c-id")){
            other = '|psrc='+originalPsrc+'|bread='+bread+'|tabIndex='+tabIndex+'|pn=0|';
        }else{
            other = '|psrc='+originalPsrc+'|bread='+bread+'|tabIndex='+tabIndex+'|pn=0|bangid='+bangid;
        }
        var source = url2data(oldmsg,'source');
        var sourceid = url2data(oldmsg,'sourceid');
        var name = url2data(oldmsg,'name');
        var id = url2data(oldmsg,'id');
        commonClick(new Node(source,sourceid,name,id,'',other));
        return false;
    }); 
    
    $(".close").live("click",function(){
        $(".big_list").hide();
        return false;
    });
    
    $(".sort").live("click",function(){
        try{
            var ph = $(window.parent.document).find("#frame_content").height()-20;
            var h = $(".max_content").height();
            if(h<ph){
                $(".max_content").css({"padding-bottom":"141px"});
            }else{
                $(".max_content").css("overflow","hiden");
            }
        }catch(e){}
        $(".big_list").isShow() ? $(".big_list").hide() : $(".big_list").show();
        return false;
    });
}


// 创建打榜列表
function createBangAllMusicList(obj,index,psrc){
    var id = obj.id;
    var   score = obj.score;
    var name = obj.name;
    var  artist = obj.artist;
    var  name_title;
    var modalTitle =obj.name + '--' +obj.artist;
    var mvclass = "";
    var oStyle = '';
    var colorClass ='';
    var ispoint = obj.ispoint;
    var mviconstr = "";
    if(ispoint=='1'){
        var strTm = getTanMuIconStr(obj)
        mviconstr = '<i class="m_score tm">'+ strTm + '</i>'
    }else{
        mvclass = checkMvIcon(obj);
        mviconstr = '<a hidefocus="" href="###" class="'+mvclass+'" style="" title="观看MV"></a>';
    }
    var namemax = 7;
    var artistmax = 4;
    if (name.length > namemax) {
        if (artist.length > artistmax){
            name = name.substring(0,namemax)+'...';
            artist = artist.substring(0,artistmax-1)+'...';
        }else{
            if(name.length-namemax>artistmax-artist.length){
                name = name.substring(0,namemax+(artistmax-artist.length))+'...';
                artist = artist;
            }else{
                name = name;
                artist = artist;
            }
        }
    }else {
        name = name;
        if(artist.length > artistmax){
            if(artist.length-artistmax>namemax-name.length){
                artist = artist.substring(0,artistmax+(namemax-name.length))+'...';
            }else{
                artist = artist;
            }
        }else{
            artist = artist;
        }
    }
    name_title = checkSpecialChar(name,"titlename");
    name = checkSpecialChar(name,"disname");
    // this
    //console.info(obj)
    var arr = [];
    var name = checkSpecialChar(obj.name,"name");
    var disname = checkSpecialChar(obj.disname,"disname") || checkSpecialChar(name,"disname");
    var titlename = checkSpecialChar(disname,"titlename");
    var num = index + 1;
    var artist = obj.artist;
    var artistid = obj.artistid;
    var id = obj.id;
    var param = obj.param;
    // 小地球标识字段
    var copyright = obj.copyright || obj.COPYRIGHT;
    // if(index%5==0){
    //  copyright=1;
    // }
    var tips = getMusicTips(name,artist,'');
    var score100 = parseInt(obj.score100) || 10;
    if(score100>100){
        score100 = 100;
    }
    var isnew = obj["new"];
    var newhtml = '';
    if(typeof(isnew)!="undefined" && isnew==1){
        newhtml = "<em class='musicnewimg'></em>";
    }
    if (num < 10) num = '0' + num;

    var tipClass = ''
    if(index <3 ){
        tipClass = "icon-"+ index;
    }
    var html = [];
    html.push('<li class="music_wrap" data-rid = "'+id+'" title="'+tips+'" c-rid = "'+id+'">');
    html.push('<div  class="m_l">');
    html.push('<input type="checkbox" checked="true" class="m_ckb">');
    html.push('<span class="num '+tipClass+'" style="width:16px;height: 24px;">'+num+'</span>');
    
    //  榜单名次细化
    var trend = obj.trend;
    var trendprefix = "";
    if(trend.length>0){
        trendprefix = trend.substring(0,1);
    }
    var trendClass = "";
    var arrowNum = obj.rank_change||'';
    var arrownewClass = 'arrowNum';
    var arrowTips = arrowNum;
    var isNew = obj.isnew;
    if(isNew&&isNew!='0'){
        trendClass = "arrownew";
        arrownewClass = '';
        arrowNum = '';
        arrowTips = '新上榜';
        colorClass ="s-red";
    }else{
        if(trendprefix=="u"){
            trendClass = "arrowup";
            arrowTips = arrowTips.indexOf('%')>-1?"上升"+arrowTips:"上升"+arrowTips+"位";
            colorClass ="s-red";
        }else if(trendprefix=="d"){
            trendClass = "arrowdown";
            arrowTips = arrowTips.indexOf('%')>-1?"下降"+arrowTips:"下降"+arrowTips+"位";
            colorClass = "s-blue";
        }else{
            trendClass = "arrowping";
            arrownewClass = '';
            arrowNum = '';
            arrowTips = '持平';
            colorClass ='s-green';
        }
    }
    html.push('</div>');
    html.push('<div  class="m_r">');
    html.push('<div  class="mr_r" style="width:266px;">');
    html.push('<div  class="icon icon_b" data-rid='+id+'>');
    html.push('<span style="margin:13px 9px 0 0;" class=" '+ trendClass+' "></span>');
    html.push('<span style="float:left; width:102px;" class="'+colorClass+'">'+ score +'<i style="font-style:normal;">分</i></span>');
    html.push('<a hidefocus="" href="###" class="m_hit  js-hit" data-artist="'+artist+'" data-name="'+name+'" style="margin-left:6px;" title="为它打榜" data-title="'+modalTitle+'">打榜</a>');
    html.push('<a hidefocus="" href="###" class="m_share js-share" style="margin-left:10px;" title="分享打榜">分享</a>');
    html.push('</div>');
    html.push('</div>');
    html.push('<div  class="mr_l n_ar">');
    html.push('<span class="m_name">');
    html.push('<a data-rid="'+id+'" class="w_name" hidefocus="" href="###" title="'+ name +'">'+ ie6SubStr(name,20,11) +'</a>');
    html.push(mviconstr);
    html.push('</span>');
    html.push('<span class="m_artist">');
    var clickjson =  commonClickString(new Node(4,obj.artistid,checkSpecialChar(artist,"name"),4));
    html.push('<a onclick="'+clickjson+'" hidefocus="" href="###" title="'+ artist +'">'+ artist +'</a>');
    html.push('</span>');
    html.push('</div>');
    html.push('</div>');
    html.push('</li>');
    saveMusicInfo(obj,"bang",psrc);
    return html.join("");
}
var musicId;
$(document).on("click",".js-hit",function(){
    var strTitle =  $(this).attr("data-title")
    musicId = $(this).parents("li").attr("data-rid");
    var name = $(this).attr("data-name");
    var artist = $(this).attr("data-artist");
    var scrollT=document.body.scrollTop || document.documentElement.scrollTop;
    var clientH2=document.documentElement.clientHeight/2;
    var scrollB2=scrollT+clientH2-156;
    $(".js-db").show().css('top',scrollB2+'px');
    $(".js-modal-gz").hide();
    $(".js-db").find(".js-modal-title").html(strTitle)
    $(".btn-group").attr('data-rid',musicId).attr("data-name",name).attr("data-artist",artist);
});
$(document).on("click",".js-rules",function(e){
    var scrollT=document.body.scrollTop || document.documentElement.scrollTop;
    var clientH2=document.documentElement.clientHeight/2;
    var scrollB2=scrollT+clientH2-228;
    $(".js-modal-gz").show().css("top",scrollB2 + "px");
    $(".js-db").hide();
    e.stopPropagation()
});
$(document).on("click","#js-play",function(e){
    e.stopPropagation()
});
$(document).on("click","#js-share",function(e){
    // alert("ShowShareWnd?rid=MUSIC_"+musicId);
    realTimeLog("ABLOG","TYPE:ASIAN_BANG_SHARE|RID:MUSIC_"+musicId+"|VOLUME:"+globalVolume);
    callClientNoReturn("ShowShareWnd?rid=MUSIC_"+musicId);
    e.stopPropagation()
});
$(document).on("click","#js-add",function(e){
    var rid=$(this).parent().attr('data-rid');
    var name = $(this).parent().attr("data-name");
    var artist = $(this).parent().attr("data-artist");
    realTimeLog("ABLOG","TYPE:ASIAN_BANG_VOTE|RID:MUSIC_"+rid+"|VOLUME:"+globalVolume);
    var param = "mid="+rid+"&songName="+name+"&artist="+artist+"&volume="+globalVolume+"&uid="+getUserID("uid")+"&sid="+getUserID("sid")+"&src=mbox";
    param = encodeURIComponent(param);
    var uid = getUserID('uid');
    if(uid==0){
        callClientNoReturn("UserLogin?src=login");
    }else{
        windowOpen("http://vip1.kuwo.cn/fans/dopay/?" + param);
    }
    e.stopPropagation();
});
$(document).on("click",".js-close",function(e){
    $(this).closest(".client-modal").hide()
    e.stopPropagation()

});
$(document).on("click",".js-share",function(e){
    var mid = $(this).parents("li").attr("data-rid");
    realTimeLog("ABLOG","TYPE:ASIAN_BANG_SHARE|RID:MUSIC_"+mid+"|VOLUME:"+globalVolume);
    callClientNoReturn("ShowShareWnd?rid=MUSIC_"+mid);
    e.stopPropagation();
});