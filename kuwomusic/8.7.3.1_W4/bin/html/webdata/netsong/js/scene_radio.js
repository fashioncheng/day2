var targetObj = {};
var isIE6 = $.browser.msie && $.browser.version=="6.0" == true;
window.onload = function() {
    centerLoadingStart("index");
    $(window).resize(function(){
        initWidth();
    });
    initWidth();
    if(isIE6){
        $(".i_play").live("mouseenter",function(){
            $(this).addClass("i_playhover");
        });
        $(".i_play").live("mouseleave",function(){
            $(this).removeClass("i_playhover");
        });
    }
	var uid = getUserID("uid");
	var login = 0;
	if (uid != 0) login = 1;
	var url = 'http://qukudata.kuwo.cn/q.k?op=query&cont=tree&node=87235&pn=0&rn=100&fmt=json&src=mbox&level=3&sourceset=tag_radio&callback=getRadioListData&extend=gxh&kid='+getUserID("devid")+'&uid='+uid+'&ver='+getVersion()+'&login='+login;
	$.getScript(url);
	
	$(".sub_nav a").live("click",function() {
		var obj = $(this);
		obj.siblings().removeClass("current");
		obj.addClass("current");
		var t = $("#" + obj.attr("c-target")).offset().top;
		$(window).scrollTop(t);	
		setTimeout(function(){$(".sub_nav a").removeClass("current").eq(0).addClass("current")},500);
		return false;
	});
	
	$(".br_pic").live("mouseenter",function(){
		if ($(this).hasClass("on")) return;
		$(this).addClass("on");
		var status = $(this).attr("c-status");
		if (!parseInt(status,10)) return;		
		var someClass = $(this).parent().attr('class');
		var s = someClass.indexOf("radio_");
		var id = someClass.substring(s + 6);
		var stopicon = '';
		var click = '';
		if (status == 1) {
			click = 'stopRadio(arguments[0],\''+id+'\',true);';
			stopicon = '<i title="暂停播放" onclick="'+click+'" class="radio_pause"></i>';
			$(this).find(".radio_pause").remove();
			$(this).find(".radio_play").remove();
		} else if (status == 2)	{
			click = 'continueRadio(arguments[0],\''+id+'\',true);';
			stopicon = '<i title="继续播放" onclick="'+click+'" class="radio_start"></i>';
			$(this).find(".radio_start").remove();
			$(this).find(".radio_stop").remove();
		}
		$(this).append(stopicon);
		$(this).removeAttr('onclick');
		$(this).unbind("click").bind("click", function () {
			eval(click);
		});		
		return false;
	});
	
	$(".br_pic").live("mouseleave",function(){
		$(this).removeClass("on");
		$(this).find(".radio_pause").remove();
		$(this).find(".radio_start").remove();
		var status = $(this).attr("c-status");
		if (status == 1) {
			var stopicon = '<img class="radio_play" src="img/radio_play.gif">';
			$(".br_pic").find(".radio_play").remove();
			$(this).find(".i_play").hide();
			$(this).append(stopicon);
		} else if (status == 2)	{
			var playicons = '<i class="radio_stop"></i>';
			$(".br_pic").find(".radio_stop").remove();
			$(this).find(".i_play").hide();
			$(this).append(playicons);
		}
		return false;
	});	
};

window.onresize=function(){
//    initWidth();
};
var currentWidth = 0;
function initWidth(){
    var w = $(window).width()+42-10;
    if(currentWidth==w){
        return;
    }
    currentWidth = w;
    var row = currentWidth/132;
    row = Math.floor(row);
    $(".channelContent").width(row*132-42);
    $(".content").width(row*132);
}
function commonClickString(obj){
    var clickarray = [];
    var index = 0;
    clickarray[index++] = "commonClick(";
    clickarray[index++] = getNodeJsonString(obj);
    clickarray[index++] = ")";
    var clickstring = clickarray.join('');
    return clickstring;
}
function commonClick(obj){
    someDianTai(obj.sourceid);
}
// 创建电台列表
function getRadioListData(jsondata){
    try{
	var data = jsondata;
	var child = data.child;
	var len = child.length;
	var navarr = [];
	var navxia = 0;
	var arr = [];
	var xia = 0;
	var index = 0;
	for (var i = 0; i < len; i++) {
		var obj = child[i];
		var disname = obj.disname;
		var id = obj.id;
		var tag = 'tag' + id;
		var isCurrent = '';
		if (obj.pc_extend.indexOf('NOTSHOWPC2015') > -1) continue;
		i == 0 ? isCurrent = 'current' : isCurrent = '';
		navarr[navxia++] = '<a hidefocus href="###" style="margin-right:15px;" c-target="'
		navarr[navxia++] = tag;
		navarr[navxia++] = '" class="';
		navarr[navxia++] = isCurrent;
		navarr[navxia++] = '" title="';
		navarr[navxia++] = disname;
		navarr[navxia++] = '"><i></i>';
		navarr[navxia++] = disname;
		navarr[navxia++] = '</a>';
		arr[xia++] = '<h2 id="';
		arr[xia++] = tag;
		arr[xia++] = '"><span class="title">';
		arr[xia++] = disname;
		arr[xia++] = '<font style="font-size:12px;"> . fm</font>';
		arr[xia++] = '</span></h2>';
		var radioList = child[i].child;
		var radioLen = radioList.length;
		var radioarr = [];
		var radioxia = 0;
		for (var j = 0; j < radioLen; j++ ) {
		    if(radioList[j].source!=9) continue;
			index++;
			radioarr[radioxia++] = createRadioBlock (radioList[j], 'sceneRadio', 0 , index);
		}
		arr[xia++] = '<ul class="kw_radio_list">';
		arr[xia++] = radioarr.join('');
		arr[xia++] = '</ul>';
	}
	var navStr = navarr.join('');
	var contentStr = arr.join('');
	$(".sub_nav").html(navStr);
	$(".radio_con").html(contentStr);
	centerLoadingEnd("index");
	loadImages();
	
	var call = "GetRadioNowPlaying";
    var str = callClient(call);
	var radioid = getValue(str,'radioid');
	var status = getValue(str,'playstatus');    
	
	if (radioid) {
		initRadioStatus(parseInt(status,10),radioid);
	}	
	
	navStr = null;
	contentStr = null;
	navarr = null;
	arr = null;
	}catch(e){}
}


var radioTimer = null;
function initRadioStatus(num,id) {
	// 电台正在播放  -1  暂停播放-2  无电台播放 -3
 	if (num == 1){
		clearTimeout(radioTimer);
		var comobj = $(".br_pic");
		var obj = $(".radio_" + id).find(".br_pic");	
		var stopicon = '';
		if (obj.hasClass("on")) {
			stopicon = '<i title="暂停播放" onclick="stopRadio(arguments[0],'+id+');" class="radio_pause"></i>';
		} else {
			stopicon = '<img class="radio_play" src="img/radio_play.gif">';
		}
		comobj.attr("c-status","0");
		comobj.removeClass("current_pic");
		comobj.find(".radio_play").remove();
		comobj.find(".radio_start").remove();
		comobj.find(".radio_stop").remove();
		comobj.find(".radio_pause").remove();
		comobj.find(".i_play").show();
		comobj.attr("c-status","0");
		comobj.each(function(){
			$(this).removeAttr('onclick');
			$(this).unbind("click").bind("click", function () {
				eval($(this).attr("_onclick"));
			});
		});
		obj.addClass("current_pic");
		obj.find(".i_play").hide();
		obj.find(".radio_start").remove();
		obj.find(".radio_play").remove();
		obj.find(".radio_stop").remove();
		obj.attr("c-status","1");
		obj.append(stopicon);
		obj.removeAttr('onclick');
		obj.unbind("click").bind("click", function () {
			stopRadio(arguments[0],id);
			return false;
		});
 	} else if (num == 2) {
		clearTimeout(radioTimer);
		var comobj = $(".br_pic");
		var obj = $(".radio_" + id).find(".br_pic");		
		var playicon = '';
		if (obj.hasClass("on")){
			playicon = '<i title="继续播放" onclick="continueRadio(arguments[0],'+id+');" class="radio_start"></i>';
		} else {
			playicon = '<i class="radio_stop"></i>';
		}
		comobj.removeClass("current_pic");
		comobj.find(".radio_play").remove();
		comobj.find(".radio_start").remove();		
		comobj.find(".radio_stop").remove();
		comobj.find(".radio_pause").remove();
		comobj.find(".i_play").show();
		comobj.attr("c-status","0");
		comobj.each(function(){
			$(this).removeAttr('onclick');
			$(this).unbind("click").bind("click", function () {
				eval($(this).attr("_onclick"));
				return false;
			});
		});
		obj.attr("c-status","2");
		obj.addClass("current_pic");
		obj.find(".i_play").hide();
		obj.find(".radio_play").remove();
		obj.find(".radio_stop").remove();
		obj.find(".radio_pause").remove();
		obj.append(playicon);
		obj.removeAttr('onclick');
		obj.unbind("click").bind("click", function () {
			continueRadio(arguments[0],id);
			return false;
		});
	} else {
		clearTimeout(radioTimer);
		radioTimer = setTimeout(function(){
			var comobj = $(".br_pic");
			comobj.attr("c-status","0");					
			comobj.removeClass("current_pic");
			comobj.find(".radio_play").remove();
			comobj.find(".radio_stop").remove();
			comobj.find(".radio_start").remove();
			comobj.find(".radio_pause").remove();
			comobj.find(".i_play").show();			
			comobj.each(function(){
				$(this).removeAttr('onclick');
				$(this).unbind("click").bind("click", function () {
					eval($(this).attr("_onclick"));
					return false;
				});
			});
		}, 100);
	}
}

//获取当前电台播放状态
function radioNowPlaying(str) {
	if (str != ''){
		var id = getValue(str,'radioid');
		var status = getValue(str,'playstatus');
		var num = parseInt(status,10);
		initRadioStatus(num,id);
	} else {
		initRadioStatus(3);
	}
}

// 暂停播放电台
function stopRadio(evt,id){
	var call = 'ChgRadioPlayStatus?radioid='+id+'&playstatus=2';
	callClientNoReturn(call);
}

// 继续播放电台 
function continueRadio(evt,id) {
	var call = 'ChgRadioPlayStatus?radioid='+id+'&playstatus=1';
	callClientNoReturn(call);
}


$(window).scroll(function(){
    loadImages();
	var contentTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
    if (contentTop > 15) {
    	$(".w_rtop").show();
    } else {
    	$(".w_rtop").hide();
    }    
});

function loadImages(){
    try{
        if($(".lazy").size()==0){
            return;
        }
        $(".lazy").each(function(i){
            var thisobj = $(this);
            var top = thisobj.offset().top;          
            var contentTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
            if(top <= $(window).height()+contentTop ) {
                thisobj.removeClass("lazy").attr("src",thisobj.attr("data-original"));
            }
        });
    }catch(e){}
}
