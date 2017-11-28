var currentObj;
var gedanId;
var infoTxt = '';
var psrc;
var csrc;
var bread;
var txtLen = 0;
var pn = 0;
var rn = 100;
var isIndex;
var newnum = 0;
var currentName;
window.onload = function(){
    centerLoadingStart("content");
	var url=decodeURIComponent(window.location.href).replace(/###/g,'');
	var msg=getUrlMsg(url);
	gedanId = 1082685104;
	newnum = getStringKey(msg,'MUSIC_COUNT') || '0';
	psrc = '首页->新歌速递->';
	csrc = '曲库->首页->每日最新单曲->';
	objBindFn();
	getSomeData();
	tabPlaylist();
	tabHover();
};

var currentPlaylistName = "";
var currentPlaylistId = "";
var currentPlaylistPic = "";
var currentPlaylistInfo = "";
// 获取歌单数据
function getSomeData() {
	var numUrl = 'http://www.kuwo.cn/pc/index/newSongsInfoMore';
	$.ajax({
        url:numUrl,
		dataType:"text",
		type:"get",
		crossDomain:false,
		success:function(arr){
			var updateArr = eval('('+arr+')');
			$('.tabBtnWrap').html(createTabBtn(updateArr.data));
		},
		error:function(){
			loadErrorPage();
		}
    });

	var url = 'http://nplserver.kuwo.cn/pl.svc?op=getlistinfo&pid='+gedanId+'&pn='+pn+'&rn='+rn+'&encode=utf-8&keyset=pl2012&identity=kuwo&pcmp4=1';
	url = getChargeURL(url);
	$.ajax({
        url:url,
		dataType:"text",
		type:"get",
		crossDomain:false,
		success:function(arr){
			var updateArr = eval('('+arr+')');
			getGedanInfoData(updateArr);
		},
		error:function(){
			loadErrorPage();
		}
    });
}
// 创建歌单内容
function getGedanInfoData(jsondata) {
	var data = jsondata;
	var id = data.id;
	currentPlaylistId = id;		
	var pic = data.pic;	
	currentPlaylistPic = pic;		
	var info = data.info;			
	var title = data.title || currentObj.name;
	currentPlaylistName = title;
	currentName = title;
	var tag = data.tag || '无';
	var child = data.musiclist;
	var len = child.length;
	var arr = [];
	var newarr = [];
	var currentPn = parseInt(data.pn);
	var total = data.total;
	var totalPage = Math.ceil(total/rn);
	var tagstr = '<font>分类：</font>';
	var pstr = '';
	infoTxt = info.replace(/<br\/>/g,'');
	currentPlaylistInfo = infoTxt;
	txtLen = info.length;
	MUSICLISTOBJ = {};
	if (len < 1) {
		$(".w_nothing").html($(".nothing").show());
	}
	
//	if(psrc.indexOf("歌单页")>-1){
//	    pstr = psrc;
//	}else{
		pstr = psrc + currentName;

//	}
	$("body").attr("data-csrc",csrc + currentName);
	var musicNum = 0;
	for (var i = 0; i < len; i++) {
		var online = child[i].online;
		if(typeof(online)!="undefined"&&online.length==1&&online==0){
			continue;
		}
		if (i < newnum && pn == 0) {
			//每日新歌模块
			newarr[newarr.length] = createGedanMusicList(child[i],musicNum,rn,currentPn,pstr,true);
		} else {
			//每日新歌模块
			arr[arr.length] = createGedanMusicList(child[i],musicNum,rn,currentPn,pstr,true);
		}
		musicNum++;
	}
	var newListStr = '';
	var pageStr = createPage(totalPage, currentPn+1);
	$(".checkall font").html(data.total);
	if (newnum > 0 && pn == 0) {
		var date = new Date();
		var oYear = date.getFullYear();
		var month = date.getMonth();
		var date = date.getDate();
		$(".bnew").html("今日更新" + newnum + "首").show();
		$(".bnew").css('display','block');
		newListStr = '<li class="newlist"><ul style="display:inline; overflow:auto;">'+newarr.join('')+'<div style="clear:both"></div></ul></li>';
	} else {
		$(".def").find(".checkall").show();
		$(".def").find(".bnew").hide();
		newListStr = '';
	}
	var bigStr = newListStr + arr.join('');
	var tags = data.tag.split(",");
	if (isIndex) {
		if(isIndex=='index'){
			for(var i=0,j=tags.length;i<j;i++) {
				var oDate = new Date();
				var oYear = oDate.getFullYear();
				var oMonth = oDate.getMonth() + 1;
				var oDate = oDate.getDate();
				tagstr = '<font>更新时间：</font>'+ oYear + '-' + oMonth + '-' + oDate;
			}
		}else{
			for(var i=0,j=tags.length;i<j;i++) {
			    tagstr += tags[i].split(":")[0]+'&nbsp;&nbsp;';
			}
		}	
	} else {
		for(var i=0,j=tags.length;i<j;i++) {
		    tagstr += tags[i].split(":")[0]+'&nbsp;&nbsp;';
		}		
	}
	var date = new Date();
	var oYear = date.getFullYear();
	var month = date.getMonth();
	var date = date.getDate();
	
	$('.headTitleBox').html(createDateImg());
	$('.tabBtnBox').show();

	$(".classify").html(tagstr);
	$(".bread span").html(checkSpecialChar(title,"disname"));		
	$(".gedan_head .pic img").attr("src",pic);
	$(".gedan_head .name").html(checkSpecialChar(title,"disname"));
	$(".kw_music_list").html(bigStr);
	if (pageStr) $(".page").html(pageStr).show();
	$('.page').attr('data-sourceid',id);
	showLike('get','PLAYLIST');
	$('.content_Box').show();
	centerLoadingEnd("content");
	// if($(".kw_music_list").html()){
	// 	commentModel();// 歌单评论
	// 	centerLoadingEnd("content");
	// }
	iframeObj.refresh();
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
	if (isIndex) {
		if (newsong) {
			text = '今日看点：' + text;
		} else {
			text = '简介：' + text;
		}
	} else {
		text = '简介：' + text;
	}
	$(".info").html(text);
}
function objBindFn() {
	$(".open").live("click",function(){
		$(".info").addClass("on");
		var ttxt = infoTxt;
		if(isIndex&&newsong){
		    ttxt = "今日看点："+ttxt;
		}else{
		    ttxt = "简介："+ttxt;
		}
		$(".info").html(ttxt + '<a href="###" hidefocus class="fold">[收起]</a>');
	});
	$(".fold").live("click",function(){
		$(".info").removeClass("on");
		refreshInfoTxt();
	});
	$(".page a").live("click",function(){
		var oClass = $(this).attr("class");
		if (oClass.indexOf("no") > -1) return;
		var pn = 0;
		var goPnNum = $(this).html();
		if (goPnNum == '上一页') {
			pn = parseInt($(".page .current").html()) - 2;
		} else if (goPnNum == '下一页'){
			pn = parseInt($(".page .current").html());
		} else {
			pn = parseInt($(this).html()) -1;
		}
		var other = '|psrc='+psrc+'|bread='+bread+'|pn='+pn+'|from='+getStringKey('','from');	
		pn>0?newnum=0:newnum=$('.bnew').html().replace(/[^0-9]/g,'');
		var pid=$(this).parent().attr('data-sourceid');
		var url = 'http://nplserver.kuwo.cn/pl.svc?op=getlistinfo&pid='+pid+'&pn='+pn+'&rn='+rn+'&encode=utf-8&keyset=pl2012&identity=kuwo&pcmp4=1';
		if($(this).hasClass('current')){
			return;
		}
		$('.content_Box').hide();
		centerLoadingStart("content");
		$.ajax({
	        url:getChargeURL(url),
			dataType:"text",
			type:"get",
			crossDomain:false,
			success:function(arr){
				var updateArr = eval('('+arr+')');
				getGedanInfoData(updateArr);
			},
			error:function(){
			}
	    });
		$('body').scrollTop(0);
	});	
}

function createDateImg(){
	var arr=[];
	var oDate=new Date();
	var oYear=oDate.getFullYear();
	var month=oDate.getMonth();
	var date=oDate.getDate();
	var str=oYear+'-'+(month+1)+'-'+date;
	
	for(var i=0; i<str.length; i++){
		var imgstr='';
		var nameclass='';
		var tmp=str.charAt(i);
		if(tmp>=0){
			imgstr='img/gedanlatest/num'+tmp+'.png';
			nameclass='dateNumber';
		}else{
			imgstr='img/gedanlatest/line_shadow.png';
			nameclass='dateNumber dateLine';
		}			
		arr[arr.length]='<span class="'+nameclass+'"';
		arr[arr.length]='style="background:url('+imgstr+') no-repeat; _background:none; _filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='+imgstr+');"></span>';
	}
	arr[arr.length]='<span class="dayTitle"></span>';
	return arr.join('');
}

//切换歌单
function tabPlaylist(){
	$('.tabBtn').live('click',function(){
		var flagIndex=$(this).parent().find('.updateNum').attr('data-index');
        
		if($(this).hasClass('active')){
			return;
		}
		$('.content_Box').hide();
		centerLoadingStart("content");
		$('.all_ckb').attr('checked',true);
		$('.tabBtn').removeClass('active');
		$(this).addClass('active');
		newnum=$(this).parent().find('.updateNum').html().substring(1,$(this).parent().find('.updateNum').html().length);
		$('.bnew').html('今日更新'+newnum+'首');
		$('.like_btn').attr('c-id',$(this).attr('data-sourceid'));
		showLike('get','PLAYLIST');
		pn=0;
		var url = 'http://nplserver.kuwo.cn/pl.svc?op=getlistinfo&pid='+$(this).attr('data-sourceid')+'&pn='+pn+'&rn='+rn+'&encode=utf-8&keyset=pl2012&identity=kuwo&pcmp4=1';
		url = getChargeURL(url);
		$.ajax({
	        url:url,
			dataType:"text",
			type:"get",
			crossDomain:false,
			success:function(arr){
				var updateArr = eval('('+arr+')');
				getGedanInfoData(updateArr);
			},
			error:function(){
			}
	    });
	});
}

//切换按钮的移入移出
function tabHover(){
	$('.tabBtn').live('mouseenter mouseleave',function(ev){
		if(ev.type=='mouseenter'){
			if($(this)[0].className=='tabBtn'){
				$(this).addClass('hover');
			}
		}else{
			$(this).removeClass('hover');
		}
	});
}

// 创建标签
function createTabBtn(arr){
	var tabBtnArr=[];
	var nameclass='';
	for(var i=0; i<arr.length; i++){
		var json=arr[i];
		var updateBlockStr='';
		var newnum = getStringKey(json.extend,'MUSIC_COUNT') || 0;
        if (newnum > 99) newnum = 99;
        if (newnum > 0) {
        	updateBlockStr = '<span data-index="'+i+'" class="updateNum">+'+newnum+'</span>';
        }else if(newnum==0){
        	updateBlockStr = '<span data-index="'+i+'" class="updateNum" style="display:none;">+'+newnum+'</span>';
        }
		(i==0)? nameclass='tabBtn active':nameclass='tabBtn';
		tabBtnArr[tabBtnArr.length]='<li class="newTabBtnBox">'
		tabBtnArr[tabBtnArr.length]='<a title="';
		tabBtnArr[tabBtnArr.length]=json.name+',今日更新'+newnum+'首';
		tabBtnArr[tabBtnArr.length]='" href="javascript:;" class="'+nameclass+'" data-sourceid="'+json.sourceid+'">'+json.name+'</a>';
		tabBtnArr[tabBtnArr.length]=updateBlockStr;
		tabBtnArr[tabBtnArr.length]='</li>';
	}
	return tabBtnArr.join('');
}
