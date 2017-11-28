var targetObj = {};
var volume;
var fobj=window.parent;
var saveAsiaUrl = "http://kbangserver.kuwo.cn/ksong.s?from=pc&fmt=json&type=bang&data=content&id=132&pn=0&rn=20&show_copyright_off=1&get_next_version=1&pcmp4=1&isbang=1&t="+new Date().getTime();
var asiaOldList = '';
var csrc="";
window.onload = function() {
    callClientNoReturn('domComplete');
    var url1=decodeURIComponent(window.location.href);
    // param=url1.substring(url1.indexOf('{'),url1.lastIndexOf('}')+1);
    // if(param!='')OnJump(param);
	centerLoadingStart("content");
	
	var bangHotChannelData = getDataByCache('bangHot-channel');
	var bangListChannelData = getDataByCache('bangList-channel');
    
	if(bangListChannelData){
		try{
			getBangListData($.parseJSON(bangListChannelData));
		}catch(e){
            var url = 'http://qukudata.kuwo.cn/q.k?op=query&cont=tree&node=2&pn=0&rn=20&fmt=json&src=mbox&level=2';
            $.ajax({
                url:url,
                dataType:'jsonp',
                success:function(json){
                    getBangListData(json);
                }
            });
		}
	}else{
		// var url = 'http://qukudata.kuwo.cn/q.k?op=query&cont=tree&node=2&pn=0&rn=20&fmt=json&src=mbox&level=2&callback=getBangListData';
		// getScriptData(url);
		var url = 'http://qukudata.kuwo.cn/q.k?op=query&cont=tree&node=2&pn=0&rn=20&fmt=json&src=mbox&level=2';
        var d = new Date();
        var time = d.getYear()+d.getMonth()+d.getDate()+d.getHours()+parseInt((d.getMinutes()/20));
        time = ''+d.getYear()+d.getMonth()+d.getDate()+time;
        url = url+"&ttime="+time;
        var bangstrattime=new Date().getTime();
		$.ajax({
	        url:url,
	        dataType:'jsonp',
			success:function(json){
                var endtime=new Date().getTime()-bangstrattime;
                realTimeLog("WEBLOG","url_time:"+endtime+";"+"qukutree"+";"+url);
                realShowTimeLog(url,1,endtime,0,0);
				getBangListData(json);
			},
            error:function(xhr){
                var endtime=new Date().getTime()-bangstrattime;
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

	objBindFn();
};

$(window).resize(function() {
	iframeObj.refresh();
});

// 获取榜单页面数据
function getBangListData(jsondata) {
	var data = jsondata;
	var child = data.child;
	var len = child.length;
	var classify = '';
	for (var i = 0; i < len; i++) {
		if (child[i].pc_extend.indexOf('NOTSHOWPC2015') > -1) continue;
		var sourceid = child[i].sourceid;
		if (sourceid==17 || sourceid==16 || sourceid == 93) {
            $(".txt"+sourceid).html(child[i].intro);
            continue;
        }
		var cname = getStringKey(child[i].pc_extend,"BDTYPE").split('-')[0];
		var oid = 'BD_' + getStringKey(child[i].pc_extend,"BDTYPE").split('-')[1];
		if (!cname) {
			cname = '特色榜';
			oid = 'BD_sbshow';

		}
		if (classify.indexOf(cname) == -1) {
			classify = classify + '|'+ cname;
			$(".bang_con .bang_list")[0].innerHTML += '<h2 style="margin-top:-10px"><span class="title">'+cname+'</span></h2><ul id="'+ oid + '" class="kw_album_list">'+createBangBlock(child[i], 'bang', 0)+'</ul>';
		} else {


			$("#"+oid)[0].innerHTML += createBangBlock (child[i], 'bang', 0);

		}
	}
	centerLoadingEnd("content");
	iframeObj.refresh();
}
var globalVolume;

function getHotBangListData(jsondata) {
	var data = jsondata;
	var child = data.musiclist;
	var len = child.length;
	var name = data.name || '';
	var arr = [];
	var strl = '';
	var strr = '';
	var xia = 0;
    var bigstr = '';
    var currentVolume=data.currentVolume||'';
    var h1Str = '';
    var top = '';
    if(currentVolume.length>0){
        currentVolume = currentVolume.split('|')
        currentVolume=currentVolume[0]+'第'+currentVolume[1]+'期';
        volume=currentVolume;
    }
    globalVolume = volume;
	MUSICLISTOBJ = {};
    var seconds = data.second;
    if(data.type == "music2"){
        // // 请求打榜下一份数据
        // //getScriptData(getChargeURL(saveAsiaUrl));
        // $.ajax({
        //     url:getChargeURL(saveAsiaUrl),
        //     dataType:'jsonp',
        //     success:function(json){
        //         //getHotBangListData(json);
        //         getAsiaOldListData(json);
        //     }
        // });
        // // 显示打榜当前数据
        // var countTo = seconds * 1000 + new Date().valueOf();
        // $('.countdown').countdown(countTo, function (event) {
        //     var $this = $('.countdown')
        //     switch (event.type) {
        //         case "seconds":
        //         case "minutes":
        //         case "hours":
        //         case "days":
        //         case "weeks":
        //         case "daysLeft":
        //             $this.find('.' + event.type).html(event.value);
        //             break;
        //         case "finished":
        //             bigstr='<ul class="asiaList">'+asiaOldList+'</ul>';
        //             $(".bang_con .fixed_list_asia").html(bigstr);
        //             dbTime();
        //             break;
        //     }
        // });
        // var psrc='排行榜->'+data.name+'->'+globalVolume;
        // h1Str = '<a hidefocus href="###" class="all_jump" style="float:left;margin-left:0px" title="完整榜单">完整榜单</a>\
        //          <a hidefocus href="###" class="rules js-rules" style="float:left" title="榜单规则">榜单规则</a>\
        //          <a hidefocus href="###" class="all_down" title="下载全部歌曲">下载</a>\
        //          <a hidefocus href="###" class="all_play" title="播放全部歌曲">全部播放</a>';
        // top = '11px';

        // var musicNum = 0;
        // var count=0;
        // while(count<10){
        //     var online = child[count].online;
        //     if(typeof(online)!="undefined"&&online.length==1&&online==0){
        //         count++;
        //         continue;
        //     }
        //     arr[xia++] = createfixedAsiaMusicList(child[count],'bang',musicNum,psrc);
        //     musicNum++;
        //     count++;
        // }
        // bigstr='<ul class="asiaList">'+arr.join('')+'</ul>';
        // $(".bang_con .fixed_list").hide();
        // $(".bang_con .fixed_list_asia").show();
        // $(".countdown").show();
    }else{
        var psrc = '排行榜->'+data.name;
        h1Str = '<a hidefocus href="###" class="all_jump" title="完整榜单">完整榜单</a>\
                 <a hidefocus href="###" class="all_down" title="下载全部歌曲">下载</a>\
                 <a hidefocus href="###" class="all_add" title="添加全部歌曲">添加</a>\
                 <a hidefocus href="###" class="all_play" title="播放全部歌曲">播放全部</a>';
        top = '25px';
        for (var i = 0; i < len; i++) {
            arr[xia++] = createfixedMusicList (child[i],'bang',i,psrc);
            if (i == 9) {
                strl = arr.join('');
                arr = [];
                xia = 0;
            }
            if (i == len - 1)  strr = arr.join('');
        }
        bigstr = '<ul style="margin-right:30px;">'+strl+'</ul><ul>'+strr+'</ul>';
        $(".bang_con .fixed_list").show();
        $(".bang_con .fixed_list_asia").hide();
        $(".countdown").hide();
    }
    $("h1").html(h1Str).css("margin-top",top);
    $(".bang_con .fixed_list").html(bigstr);
    // 移除隐藏的类名icon
    for(var i=0;i<$(".bang_con .fixed_list").length;i++){
        if($(".bang_con .fixed_list").eq(i).css("display")=='none'){
            $(".bang_con .fixed_list").eq(i).find(".icon").removeClass('icon');
        }
    }
	$(".bang_list").show();
	centerLoadingEnd("content");	
	iframeObj.refresh();
}
// // 存打榜榜单下一份数据
// function getAsiaOldListData(jsondata){
//     var arr = [];
//     var data = jsondata;
//     var child = data.musiclist;
//     var len = child.length;
//     var currentVolume=data.currentVolume||'';
//     var psrc='排行榜->'+data.name+'->'+globalVolume;
    
//     var musicNum = 0;
//     var count=0;
//     while(count<10){
//         var online = child[count].online;
//         if(typeof(online)!="undefined"&&online.length==1&&online==0){
//             count++;
//             continue;
//         }
//         arr[arr.length] = createfixedAsiaMusicList(child[count],'bang',musicNum,psrc);
//         musicNum++;
//         count++;
//     }
//     // 存下一份数据
//     asiaOldList = arr.join('');
// }
// // 打榜倒计时2分钟后存打榜下一份数据
// function dbTime(){
//     var seconds = 600;//10分钟
//     var countTo = seconds * 1000 + new Date().valueOf();
//     var bigstr = '';
//     // 2分钟后存打榜下一份数据
//     setTimeout(function(){
//         $.getScript(getChargeURL(saveAsiaUrl));
//     },120000);
//     // 倒计时
//     $('.countdown').countdown(countTo, function (event) {
//         var $this = $('.countdown')
//         switch (event.type) {
//             case "seconds":
//             case "minutes":
//             case "hours":
//             case "days":
//             case "weeks":
//             case "daysLeft":
//                 $this.find('.' + event.type).html(event.value);
//                 break;
//             case "finished":
//                 // 倒计时结束渲染页面并回调
//                 bigstr='<ul class="asiaList">'+asiaOldList+'</ul>';
//                 $(".bang_con .fixed_list_asia").html(bigstr);
//                 dbTime();
//                 break;
//         }
//     });
//     $(".bang_list").show();
//     centerLoadingEnd("content");    
//     iframeObj.refresh();
// }

$(".bang_head a").live("click",function(){
    MUSICLISTOBJ = {};
    $(this).addClass('current').siblings().removeClass('current');
    csrc = "曲库->排行榜->"+$(".bang_head .current").html();
    $("body").attr("data-csrc",csrc);
    var psrcPath =  "VER=2015;FROM=曲库->排行榜->"+$(this).attr("c-name");
    $(".toolbar .all_down").attr("data-psrc",psrcPath)
    saveDataToCache("chargePsrc",psrcPath)
    var tabId = $(this).attr('c-id');
    //var url = 'http://kbangserver.kuwo.cn/ksong.s?from=pc&fmt=json&type=bang&data=content&id='+tabId+'&pn=0&rn=20&callback=getHotBangListData&show_copyright_off=1&isbang=1&t='+ new Date().getTime();
    // getScriptData(getChargeURL(url));
    var url = 'http://kbangserver.kuwo.cn/ksong.s?from=pc&fmt=json&type=bang&data=content&id='+tabId+'&pn=0&rn=20&show_copyright_off=1&pcmp4=1&isbang=1&t='+ new Date().getTime();
    $.ajax({
        url:url,
        dataType:'jsonp',
        success:function(json){
            getHotBangListData(json);
        },
        timeout:5000,
        error:function(){
            loadErrorPage()
        }
    });
    return false;
})




function objBindFn() {
    centerLoadingStart("content");
    $("#hot_tag").trigger("click")
	$(".all_jump").live("click", function(){
		var sourceid = $(".bang_head .current").attr("c-sourceid");
		var name = $(".bang_head .current").attr("c-name");
		var id = $(".bang_head .current").attr("c-id");
		var other = '|psrc=排行榜->|bread=-2,2,排行榜,0|csrc='+csrc;
		fobj.commonClick(new Node(1,sourceid,name,id,'',other));
		return false;
	});
}
var musicId;
$(document).on("click",".js-hit",function(){
    var strTitle =  $(this).attr("data-title")
    musicId = $(this).parent(".icon").attr("data-rid");
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
    e.stopPropagation();
});
$(document).on("click","#js-share",function(e){
   // alert("ShowShareWnd?rid=MUSIC_"+musicId);
    var rid=$(this).parent().attr('data-rid');
    callClientNoReturn("ShowShareWnd?rid=MUSIC_"+musicId);
    realTimeLog("ABLOG","TYPE:ASIAN_BANG_SHARE|RID:MUSIC_"+rid+"|VOLUME:"+volume);
    e.stopPropagation()
});
$(document).on("click","#js-add",function(e){
    var rid=$(this).parent().attr('data-rid');
    var name = $(this).parent().attr("data-name");
    var artist = $(this).parent().attr("data-artist");
    realTimeLog("ABLOG","TYPE:ASIAN_BANG_VOTE|RID:MUSIC_"+rid+"|VOLUME:"+volume);
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
   var rid = $(this).closest(".icon").attr("data-rid")
    callClientNoReturn("ShowShareWnd?rid=MUSIC_"+rid);
    e.stopPropagation();
    realTimeLog("ABLOG","TYPE:ASIAN_BANG_SHARE|RID:MUSIC_"+rid+"|VOLUME:"+volume);
});








