var targetObj = {};
var radioid = 0;
var status = '';
window.onload = function() {
	callClientNoReturn('domComplete');
	// var url1=decodeURIComponent(window.location.href);
	// param=url1.substring(url1.indexOf('{'),url1.lastIndexOf('}')+1);
	// if(param!='')OnJump(param);
	centerLoadingStart("content");
	var call = "GetRadioNowPlaying";
    var str = callClient(call);
	radioid = getValue(str,'radioid');
	status = getValue(str,'playstatus');
	var uid = getUserID("uid");
	var login = 0;
	if (uid != 0) login = 1;

	var radioChannelData = getDataByCache('radio-channel');
	//var radioChannelData = getDataByCache('channelRadioData');
	//var radioChannelData = '';
	if(radioChannelData){
		try{
			getRadioListData($.parseJSON(radioChannelData));
			//$('body').html(radioChannelData);
			if (radioid) {
				initRadioStatus(parseInt(status,10),radioid);
			}
		}catch(e){
			//var url = 'http://qukudata.kuwo.cn/q.k?op=query&cont=tree&node=87235&pn=0&rn=100&fmt=json&src=mbox&level=3&sourceset=tag_radio&callback=getRadioListData&extend=gxh&kid='+getUserID("devid")+'&uid='+uid+'&ver='+getVersion()+'&login='+login;
			//getScriptData(url);
			var url = 'http://qukudata.kuwo.cn/q.k?op=query&cont=tree&node=87235&pn=0&rn=100&fmt=json&src=mbox&level=3&sourceset=tag_radio&extend=gxh&kid='+getUserID("devid")+'&uid='+uid+'&ver='+getVersion()+'&login='+login;
			$.ajax({
		        url:url,
		        dataType:'jsonp',
		        crossDomain:false,
				success:function(json){
					getRadioListData(json);
				},
				error:function(xhr){
					loadErrorPage();
				}
		    });
		}
	}else{
		var url = 'http://qukudata.kuwo.cn/q.k?op=query&cont=tree&node=87235&pn=0&rn=100&fmt=json&src=mbox&level=3&sourceset=tag_radio&extend=gxh&kid='+getUserID("devid")+'&uid='+uid+'&ver='+getVersion()+'&login='+login;
		//getScriptData(url);
		var d = new Date();
        var time = d.getYear()+d.getMonth()+d.getDate()+d.getHours()+parseInt((d.getMinutes()/20));
        time = ''+d.getYear()+d.getMonth()+d.getDate()+time;
        url = url+"&ttime="+time;
        var radiostrattime=new Date().getTime();
		$.ajax({
	        url:url,
	        dataType:'jsonp',
	        crossDomain:false,
			success:function(json){
				var endtime=new Date().getTime()-radiostrattime;
                realTimeLog("WEBLOG","url_time:"+endtime+";"+"qukutree"+";"+url);
                realShowTimeLog(url,1,endtime,0,0);
				getRadioListData(json);
			},
            error:function(xhr){
                var endtime=new Date().getTime()-radiostrattime;
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

$(window).scroll(function() {
	set_left_nav_current();
});

function OnLeaveChanel(){
    
}

// 创建电台列表
function getRadioListData(jsondata){
	var data = jsondata;
	var child = data.child;
	var len = child.length;
	var navarr = [];
	var navxia = 0;
	var arr = [];
	var xia = 0;
	var index = 0;
    var MyTag = 0 ;
	for (var i = 0; i < len; i++) {
        MyTag += 1;
		var obj = child[i];
		if (obj.pc_extend.indexOf('NOTSHOWPC2015') > -1) continue;
		var disname = obj.disname;
		var id = obj.id;
		var tag = 'tag' + id;
		var isCurrent = '';
		i == 0 ? isCurrent = 'current' : isCurrent = '';
		navarr[navxia++] = '<a hidefocus style="margin-right:15px;" href="###" c-target="'
		navarr[navxia++] = tag;
		navarr[navxia++] = '" class="';
		navarr[navxia++] = isCurrent;
		navarr[navxia++] = '" title="';
		navarr[navxia++] = disname;
		navarr[navxia++] = '">';
		navarr[navxia++] = disname;
		navarr[navxia++] = '<span></span>';
		navarr[navxia++] = '</a>';
		arr[xia++] = '<h2 id="';
		arr[xia++] = tag;
		arr[xia++] = '" class="radioTitle"><span class="title">';
		arr[xia++] = disname;
		arr[xia++] = '<font style="font-size:12px;"> . FM</font>';
		arr[xia++] = '</span></h2>';
		var radioList = child[i].child;
		var radioLen = radioList.length;
		var radioarr = [];
		var radioxia = 0;
		for (var j = 0; j < radioLen; j++ ) {
			if (radioList[j].pc_extend.indexOf('NOTSHOWPC2015') > -1) continue;
			index++;
			radioarr[radioxia++] = createRadioBlock (radioList[j], 'radio', 0,index,MyTag);
		}
		arr[xia++] = '<ul class="kw_radio_list">';
		arr[xia++] = radioarr.join('');
		arr[xia++] = '</ul>';
	}

	
	var navStr = navarr.join('');
	var contentStr = arr.join('');
	$(".leftNav").html(navStr);
	$(".radio_con").html(contentStr);
	centerLoadingEnd("content");
	saveDataToCache("channelRadioData",$('body').html(),3600);
	setTimeout(function(){
		radioLoadImages();
	},100);
	
	if (radioid) {
		initRadioStatus(parseInt(status,10),radioid);
	}
}

function radioLoadImages(){
    var scrollT=document.documentElement.scrollTop||document.body.scrollTop;
	var clientH=document.documentElement.clientHeight;
	var scrollB=scrollT+clientH;
	var imgs = $('.lazy');
	imgs.each(function(i){
		if($(this).offset().top<scrollB){
			if($(this)[0].getAttribute('data-original')!=='{$pic}'){
				$(this)[0].setAttribute('src', $(this)[0].getAttribute('data-original'));
				$(this).removeClass('lazy');
			}
		}
	});
}

function objBindFn() {
	$(window).scroll(function(){
  		radioLoadImages();
  	});
  	$(window).resize(function(){
  		radioLoadImages();
  	});
	$('.leftNav a').live('click',function(){
		$('.leftNav a').removeClass('current');
		$(this).addClass('current');
		var index = $(this).index();
		var t = $('.kw_radio_list').eq(index).offset().top;
		set_left_nav_current = null;
		set_window_top(t-60);
		setTimeout(function(){
			set_left_nav_current=function (t){
				var scrollT = document.documentElement.scrollTop || document.body.scrollTop;
				var clientH2 = document.documentElement.clientHeight/2;
				var current_flag = scrollT+clientH2;

				var top_arr = get_radio_top();
				var len = top_arr.length;
				for(var i=0; i<len; i++){
					if(top_arr[i]<current_flag){
						$('.leftNav a').removeClass('current');
						$('.leftNav a').eq(i).addClass('current');
					}
				}
			};
		},500);
	});

	$(".sub_nav a").live("click",function() {
		var obj = $(this);
		obj.siblings().removeClass("current");
		obj.addClass("current");
		var t = $("#" + obj.attr("c-target")).offset().top;
		setAreaTop(t);
		setTimeout(function(){$(".sub_nav a").removeClass("current").eq(0).addClass("current")},500);
		return false;
	});
	
	$(".br_pic").live("mouseenter",function(){
		if ($(this).hasClass("on")) return;
		$(this).addClass("on");
		var status = $(this).attr("c-status");		
		var someClass = $(this).parent().attr('class');
		var s = someClass.indexOf("radio_");
		var id = someClass.substring(s + 6);
		var stopicon = '';
		var click = '';        
		if (status == 1 || status == 4 ) {
			click = 'stopRadio(arguments[0],\''+id+'\',true);';
			
			$(this).find(".radio_pause").remove();
			$(this).find(".radio_play").remove();
            $(this).parent().find('.playing_oper').show();
            $(this).find('.lstdiv').hide();
            stopicon = '<i title="暂停播放" onclick="" class="radio_pause"></i>';

		} else if (status == 2)	{
			click = 'continueRadio(arguments[0],\''+id+'\',true);';
			stopicon = '<i title="继续播放" onclick="" class="radio_start"></i>';
			$(this).find(".radio_start").remove();
			$(this).find(".radio_stop").remove();
            $(this).parent().find('.playing_oper').show();
            $(this).find('.lstdiv').hide();
		}else{  
            stopicon = '<i title="继续播放" onclick="" class="radio_start"></i>';
            click = $(this).attr('_onclick');
        }        
		$(this).append(stopicon);
		$(this).removeAttr('onclick');
		$(this).unbind("click").bind("click", function () {            
            if( status != 2 && status != 1 && status != 4 ){
                if( $(this).hasClass('on') ){
                    $(this).removeClass('on');
                }
            }            
			eval(click);
		});		

        $(".radio_like").unbind("click").bind("click", radiobtnlike);
        $(".radio_dust").unbind("click").bind("click", radiobtndust);
        $(".radio_add").unbind("click").bind("click", radiobtnadd);
		return false;
	});
	
	$(".br_pic").live("mouseleave",function(){
		$(this).removeClass("on");
		$(this).find(".radio_pause").remove();
		$(this).find(".radio_start").remove();
		var status = $(this).attr("c-status");
		if (status == 1) {
			var stopicon = '<img class="radio_play" src="img/radio_play.gif">';
			$(this).find(".radio_play").remove();
			$(this).find(".i_play").hide();
			$(this).append(stopicon);
		} else if (status == 2)	{
			var playicons = '<i class="radio_stop"></i>';
			$(this).find(".radio_stop").remove();
			$(this).find(".i_play").hide();
			$(this).append(playicons);
		}
        $(this).parent().find('.playing_oper').hide();
        $(this).find('.lstdiv').show();
		return false;
	});

	function setAreaTop(t) {
		var tt = t || 0;
		$("body").stop().animate({scrollTop:tt},500);
	}
}


//点击喜欢按钮
function radiobtnlike(ev) {
    var strSetFav = "SetSonglikeState";
    callClientNoReturn(strSetFav);

    ev.stopPropagation();
    return false;
}


function SetSongFav(infoStr){
    var playingSongInfo = callClient('GetRadioPlayingSongInfo');
    var b_like = parseInt(getValue(playingSongInfo,'blike'));
    var call = "GetRadioNowPlaying";
    var str = callClient(call);
    var id = getValue(str,'radioid');
    var DesObj = $(".radio_" + id).find(".br_pic");
    if(b_like){
        DesObj.find(".playing_oper").find(".radio_like").addClass("radio_liked");
        DesObj.find(".playing_oper").find(".radio_like").attr("title","已喜欢")
    }else{
        DesObj.find(".playing_oper").find(".radio_like").removeClass("radio_liked");
        DesObj.find(".playing_oper").find(".radio_like").attr("title","喜欢")
    }
}

//垃圾箱按钮
function radiobtndust(ev) {
    var strSetFav = "RadioClickDustbin?icontype=del";
    callClientNoReturn(strSetFav);

    ev.stopPropagation();
    return false;
}

//电台播放时的'+'按钮
function radiobtnadd(ev) {
    var strSetFav = "RadioMore";
    callClientNoReturn(strSetFav);

    ev.stopPropagation();
    return false;
}

function set_left_nav_current(){
	var scrollT = document.documentElement.scrollTop || document.body.scrollTop;
	var clientH2 = document.documentElement.clientHeight/2;
	var current_flag = scrollT+clientH2;

	var top_arr = get_radio_top();
	var len = top_arr.length;
	for(var i=0; i<len; i++){
		if(top_arr[i]<current_flag){
			$('.leftNav a').removeClass('current');
			$('.leftNav a').eq(i).addClass('current');
		}
	}
}

function get_radio_top(){
	var arr = [];
	var count = 0;
	$('.kw_radio_list').each(function(){
		var nowT = $(this).offset().top;
		arr[count++] = nowT;
	});
	return arr;
}

function set_window_top(t){
	$("body").animate({scrollTop:t},500);
}