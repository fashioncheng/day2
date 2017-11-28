var topicObj;
var currObj;
var currentObj;
var shareTopObj;
var sharePopObj;
var shareContObj;
var flowcontentObj;
var tipsObj;
var textareaObj;
var submitObj;
var mtlo = {};
var topicId;
var currLikeBtn;
var currindex = -1;
var currVal = '';
var isAppend;
var isDragMusic = false;
var isLikeClick = true;
var isReturnAnchor = false;
var isDrag = 0;		
var getZanTime = 300000;
var currentLikeNum = 0;
var currentPastTopicName = "";
var topicInfoObj = {};
var isHTTPClick = true;
var pfrom = "首页->";
pfrom = "精选->";
topicInfoObj.isSubmitFinish = true;
var oldurl=decodeURIComponent(window.location.href).split('?')[0];
var oldmsg='';
window.onload = function () {
	callClientNoReturn('domComplete');
    centerLoadingStart("content");
    var url=decodeURIComponent(window.location.href);
	var msg=getUrlMsg(url);
	oldmsg=msg;
    //var json = fobj.goldjson;
    source = url2data(msg,'source');
	sourceid = url2data(msg,'sourceid');
	name = url2data(msg,'name');
	id = url2data(msg,'id');
	other = url2data(msg,'other');
	var currentMsg={
		source:source,
		sourceid:sourceid,
		name:name,
		id:id,
		other:other
	}
	currentObj = currentMsg;
	var json = currentObj;
	$(".bread span").html(currentObj.name);
    topicObj = $(".topic_con");
	tipsObj = $(".txtTips");	
    shareTopObj = topicObj.find("#top_obj");
    sharePopObj = topicObj.find("#sharePop");
    shareContObj = topicObj.find("#share_cont");
	textareaObj = sharePopObj.find("textarea");
	submitObj = sharePopObj.find(".submit");	
    currObj = topicObj;			
    mtlo.node = getDataByCache("topicNode") || 1;			// 话题类型 1他们分享 2歌曲话题列表 3我的分享 4往期话题
    mtlo.type = getDataByCache("topicType") || 'hot';		// 子菜单类型 热门、最新。
    mtlo.pn = getDataByCache("topicPn") || 1;				// 页数
    mtlo.rn = 50;											// 个数
	// 我的页面跳转处理
	if (json.extend2) {
		if(json.extend2.topicNode) mtlo.node = json.extend2.topicNode;
	}
	// 初始化选中当前页
	shareContObj.find(".tab_menu li").removeClass("current");
	shareContObj.find(".tab_menu_" + mtlo.node).addClass("current");
    someTopic(json);
	objBindFn();
}

// 请求话题数据
function someTopic(nodeobj) {
    topicId = currentObj.sourceid;
	var url = 'http://album.kuwo.cn/album/MusicTopicIndexServlet?itemId=' + currentObj.sourceid + '&r=' + Math.random();
    //getScriptData(url);
    $.ajax({
        url:url,
        dataType:'jsonp',
        crossDomain:false,
		success:function(json){
			getTopicData(json);
		}
    });
}

// 获取话题数据，请求列表数据
function getTopicData(jsondata) {
	var data = jsondata;
	if (!data) {
		webLog('getTopicDataNoData:' + obj2Str(data));
		return;
	}
	var name = data.topicName;
	var descName = data.topicDesc;
	var wordName = data.oneWordDesc;
	var noPicCookie = true;
	var colors = data.colors;
	var colorLen = colors.length;
	var topicPic = data.topicPic;
	var topicTit = data.topicDesc;
	var totalSong = data.totalSong;
	var totalTopic = data.totalTopic;
	var hotSongs = data.hotSongs;	
	
	$(".songnum font").html(totalSong);
	$(".topicnum font").html(totalTopic);
	shareTopObj.find(".banner img").attr("src", topicPic);
	shareTopObj.find(".banner img").attr("title", topicTit);
	shareTopObj.find(".banner img").load(function () {
		$(this).show();
		noPicCookie = false;
	});
	if (wordName) topicObj.find(".line_box").html("<span>导语</span>：" + wordName).show();
	if (noPicCookie) topicObj.find(".banner span img").show();
	sharePopObj.find("textarea").attr("data-val", "分享音乐点滴...");
	sharePopObj.find("textarea").html("分享音乐点滴...");

	// 获取颜色
	if (colorLen == 1) {
		sharePopObj.find(".icon").hide();
	} else if (colorLen >= 2) {
		sharePopObj.find(".icon").show();
		var listStr = [];
		var xia = 0;
		var obj;
		var colorVal;
		var colorName;
		var isBorder = '';
		for (var i = 0; i < colors.length; i++) {
			if (i == colors.length - 1) isBorder = 'border:none';
			obj = colors[i];
			colorVal = obj.color;
			colorName = obj.name;
			listStr[xia++] = '<div class="clearfix" style="';
			listStr[xia++] = isBorder;
			listStr[xia++] = '"><p class="color" style="background:';
			listStr[xia++] = colorVal;
			listStr[xia++] = '"></p><p class="tag" style="color:';
			listStr[xia++] = colorVal;
			listStr[xia++] = '">';
			listStr[xia++] = colorName;
			listStr[xia++] = '</p></div>';
		}
		sharePopObj.find(".taglist").html(listStr.join(''));
		sharePopObj.find(".taglist>div").eq(0).hide();
	} else {
		colors[0].name = '天空蓝';
		colors[0].color = '#46b4e6';
	}
	sharePopObj.find(".select>.color").css("backgroundColor", colors[0].color);
	sharePopObj.find(".select>.tag").html(colors[0].name).css("color",colors[0].color);
	showModule(mtlo);
	createJxList(hotSongs);
	getZanCount();
	//setBread("topic",currentObj);
	currObj.find(".subnav2 span").html(currentObj.name);
	$(".topic_con").show();
}


/************************************************
 * 加载相应模块 如果是我的分享判断是否为登录用户 
 * 1 为所有分享列表；
 * 2 为话题列表；
 * 3 为我的分享列表；
 * 4 往期话题；
 ***********************************************/
 
function showModule(nodeObj, isP) {
	centerLoadingStart("content");
    if (nodeObj.node) mtlo.node = nodeObj.node;
    if (nodeObj.type) mtlo.type = nodeObj.type;
    if (nodeObj.pn) mtlo.pn = nodeObj.pn;
    if (nodeObj.rn) mtlo.rn = nodeObj.rn;
	isAppend = isP || false;
	var uid = getUserID("uid");
    var com = 'http://album.kuwo.cn/album/MusicTopicServlet?';
    var com1 = '';
	if (eval(uid)){
		com1 = '&uid=' + uid;
	}else{
		com1 = '';
	}
		
	// 如果未登录切换我的分享不请求数据
    if (mtlo.node == 3 && !eval(uid)) {
		// moveKuai(mtlo.node);
    	isHTTPClick = true;
		shareContObj.find(".share_list").hide();
		shareContObj.find(".music_list").hide();
		shareContObj.find(".music_list").html("");
		shareContObj.find(".nothing1").hide();
		shareContObj.find(".nothing1").show();
		shareContObj.find(".tab_menu li").removeClass("current");
		shareContObj.find(".menu li").removeClass("current");
		shareContObj.find(".tab_menu_" + mtlo.node).addClass("current");
		shareContObj.find(".menu ." + mtlo.type).addClass("current");
	    centerLoadingEnd("content");
		iframeObj.refresh();
		return;
    }
    if(mtlo.node==4){
        closeYindao();
    }
	var oMinutes = new Date().getMinutes();
	someRandom = '2014Topic' + Math.random();
	var url = com + 'itemId=' + currentObj.sourceid + '&node=' + mtlo.node + '&type=' + mtlo.type + '&pn=' + mtlo.pn + '&rn=' + mtlo.rn + com1 + '&r=' + someRandom;
	//getScriptData(url);
	$.ajax({
        url:url,
        dataType:'jsonp',
        crossDomain:false,
		success:function(json){
			getTopicDataList(json);
		}
    });
}

// 获取相应列表数据
function getTopicDataList(jsondata) {
	var data = jsondata; 
	if (!data) {
		isHTTPClick = true;
		return;
	}
	var totalPage = data.totalPage;
	var pn = data.pn;
	var node = data.node;
	var type = data.type;
	var child = data.child;
	var listStr = '';
	
	if (node != mtlo.node || type != mtlo.type || pn != mtlo.pn) {
		isHTTPClick = true;
		return;
	}
	
	// 把当前类型页数存入缓存刷新直接跳转
	//saveDataToCache('topicNode', node , 999999999999999999); 
	//saveDataToCache('topicType', type , 999999999999999999);
	//saveDataToCache('topicPn', pn , 999999999999999999);
	$(".menu_line").show();
	$(".music_list").css("margin-top","0px");
	if (mtlo.node == 4) {
		$(".menu_line").hide();
		$(".music_list").css("margin-top","20px");
		$(".all_play").hide();
		$(".zan_tips").hide().find("span").html(0);
		$(".menu .hot a").html("热门话题");
		$(".menu .new a").html("最新话题");
	} else if (mtlo.node == 3){
		currentLikeNum = parseInt($(".new_like_icon").find("font").html());
		if (isNaN(currentLikeNum)) currentLikeNum = 0;
		if (currentLikeNum > 0){
			$(".zan_tips").show().find("span").html(currentLikeNum);
		}
		$(".all_play").hide();
		$(".new_like_icon").hide().find("font").html(0);
		$(".menu .hot a").html("热门分享");
		$(".menu .new a").html("最新分享");	
	} else {
		$(".all_play").show();
		$(".zan_tips").hide().find("span").html(0);
		$(".menu .hot a").html("热门分享");
		$(".menu .new a").html("最新分享");		
	}	
	
	if (child.length > 0) {   
		shareContObj.find(".nothing1").hide();
		shareContObj.find(".share_list").show();
		listStr = getTopicDataListStr(child, node);
		shareContObj.find(".music_list").html(listStr);
		
		// 是否显示切换用户按钮
		if (node == 2){
			var oW = shareContObj.find(".musiclist").eq(0).find("em").width();
			if(oW > 600){
				shareContObj.find(".musiclist").eq(0).find(".user_change").show();
			}
		}
		shareContObj.find(".music_list").show();
	} else {
		shareContObj.find(".share_list").hide();
		shareContObj.find(".music_list").hide();
		shareContObj.find(".music_list").html("");
		shareContObj.find(".nothing1").show();
	}
	// moveKuai(mtlo.node);
	shareContObj.find(".tab_menu li").removeClass("current");
	shareContObj.find(".menu li").removeClass("current");
	shareContObj.find(".tab_menu_" + node).addClass("current");
	shareContObj.find(".menu ." + type).addClass("current");
	
	// 是否显示分页
	if (totalPage > 1) {
		var pageStr = createPage(totalPage, pn);
		shareContObj.find(".page").attr("data-total", totalPage);
		shareContObj.find(".page p").html(pageStr);
		shareContObj.find(".page p .cont a").eq(pn - 1).addClass("current");
		shareContObj.find(".page").show();
	} else {
		shareContObj.find(".page").hide();
	}
	
	// 点击页码跳转到锚点位
	if (isReturnAnchor) {
		//returnAnchor(shareContObj);
		$('body').scrollTop(0);
		isReturnAnchor = false;			
	}else{
		returnTop();
	}
	
	// 发表留言后插入动画
	if(isAppend){
		var oH = shareContObj.find(".music_list li").eq(0).height();
		shareContObj.find(".music_list li").eq(0).css("height", "0");		
		pushData();

		// 插入留言
		function pushData(){
			shareContObj.find(".music_list li").eq(0).stop().animate({ height: oH }, 500 , function(){
				var rid = $(this).attr("data-musicid");
				var tid = $(this).attr("data-tid");
				//shareContObj.find(".music_list li").eq(0).animate({ marginLeft: 0 }, 200 );
				addShareFn(rid, tid);
				iframeObj.refresh();
			});	
		}
	}
	isHTTPClick = true;
	centerLoadingEnd("content");
	iframeObj.refresh();
	
	// 显示引导层
	var isFirstTopic = getDataByCache('firstTopic');
	if(!isFirstTopic){
		saveDataToCache('firstTopic','1','999999999999999999');
		$(".yindao").show();
	}	
}

// 创建相应歌曲分享列表
function getTopicDataListStr(child, node) {
    var str = '';
    var node = parseInt(node, 10);
	switch (node) {
        case 1: str = createShareList(child,node); break;
        case 2: str = createTopicMusicList(child); break;
        case 3: str = createShareList(child,node); break;
		case 4: str = createPastTopicList(child,node); break;
        default: webLog("当前话题列表的node:" + node + "没有定义...");
    }
    return str || "";
}

// 创建页码
function createPage(total, currentPg) {
    var pageHtml = "";
    if (total > 1) {
        if (currentPg != 1) {
            pageHtml += '<a hidefocus="true" href="javascript:;" class="ypage">上一页</a>';
        } else {
            pageHtml += '<a hidefocus="true" href="javascript:;" class="nopage">上一页</a>';
        }
        pageHtml += '<a hidefocus="true" href="javascript:;" ' + (currentPg == 1 ? 'class="current"' : '') + '>1</a>';
        if (currentPg > 4) pageHtml += '<span>...</span>';
        for (i = (currentPg >= 4 ? (currentPg - 2) : 2) ; i <= (currentPg + 2 >= total ? (total - 1) : (currentPg + 2)) ; i++) {
            if (currentPg == i) {
                pageHtml += '<a hidefocus="true" href="javascript:;" class="current">' + i + '</a>';
            } else {
                pageHtml += '<a hidefocus="true" href="javascript:;">' + i + '</a>';
            }
        }
        if (currentPg + 3 < total) pageHtml += '<span>...</span>';
        if (total != 1) pageHtml += '<a hidefocus="true" href="javascript:;" ' + (currentPg == total ? 'class="current"' : '') + '>' + total + '</a>';
        if (currentPg != total) {
            pageHtml += '<a hidefocus="true" href="javascript:;" class="ypage">下一页</a>';
        } else {
            pageHtml += '<a hidefocus="true" href="javascript:;" class="nopage">下一页</a>';
        }
    }
    return pageHtml;
}

// 创建分享列表（带用户信息）
function createShareList(jsondata,node) {
    var data = jsondata;
    var arr = [];
    var xia = 0;
    var len = data.length;
    var obj;
    var userInfo;
    var musicInfo;
    var rid;
	var tid;
    var content;
    var likeNum;
    var liked;
    var musicColor;
    var userPic;
    var userName;
    var artist;
    var artistId;
    var time;
    var musicId;
    var musicName;
    var formats;
    var psrc;
    var params;
    var oStyle;
	var oMarginLeft;
    var jumpUserPageStr;
	var artistClick;
	var share2Str;
	
    for (var i = 0; i < len; i++) {
        obj = data[i];
        tid = obj.tid || 0;
        time = obj.time;
        content = obj.content || '';
        content ? oStyle = 'display:block' : oStyle = 'display:none';
		
		if(i==0 && isAppend) {
			oMarginLeft = "0";
		}else{
			oMarginLeft = "0";
		}
        musicColor = obj.color;
        likeNum = obj.likeCount;
        eval(obj.liked) ? liked = 'liked' : liked = 'like';
        userInfo = obj.userInfo;
        musicInfo = obj.musicInfo;
        userInfo ? userPic = userInfo.face || 'http://image.kuwo.cn/us/secrets.gif' : userPic = 'http://image.kuwo.cn/us/secrets.gif';
        userInfo ? userName = userInfo.name || '' : userName = '';
        userInfo ? userId = userInfo.id || '' : userId = '';

        //jumpUserPageStr = 'callClient(\'Jump?channel=my&url=' + encodeURIComponent('http://mboxspace.kuwo.cn/ucm/mbox2013/home_2016.jsp?pageReady=false&uid=' + userId) + '\'); return false;';
        var url = "http://www.kuwo.cn/pc/my/index?uid=" +getUserID("uid")+"&vuid="+userId;
        jumpUserPageStr = 'jumpToOtherUser(\''+url+'\');return false;'

		var musicArr = [];
        var n = 0;
		
		rid = '';
		musicName = '';
		artist = '';
		artistId = '';
		artistClick = '';
		params = '';
		formats = '';
		share2Str = '';
		if (node == 3) {
			share2Str = '<p class="myshare"><a class="share"></a>分享</p>';
		}
        if (musicInfo) {
			rid = musicInfo.id;
            musicName = musicInfo.songName;
            artist = musicInfo.artist;
			artistId = musicInfo.artistId;
			artistClick = commonClickString(new Node(4, artistId, artist, 4));
            params = musicInfo.params;
            formats = musicInfo.formats;
            if (node == 1){
				psrc = '曲库->'+pfrom+'音乐话题->'+currentObj.name+'->全部分享';
			}else if (node == 3){
				psrc = '曲库->'+pfrom+'音乐话题->'+currentObj.name+'->我的分享';
			}else{
				psrc = '曲库->'+pfrom+'音乐话题->'+currentObj.name+'->其他';
			}
            params = getParams(params, formats, psrc,artistId);
            musicArr[n++] = '<div class="mu clearfix"><dl>';
            musicArr[n++] = '<dd class="icon"><a href="javascript:;" hidefocus="true" title="播放歌曲" class="bg play"></a></dd>';
            musicArr[n++] = '<dd class="icon"><a href="javascript:;" hidefocus="true" title="添加歌曲" class="bg add"></a></dd>';
            musicArr[n++] = '<dd class="icon"><a href="javascript:;" hidefocus="true" title="下载歌曲" class="bg down"></a></dd>';
            musicArr[n++] = '<dd class="icon"><a href="javascript:;" hidefocus="true" title="分享歌曲" class="bg share"></a></dd>';
            musicArr[n++] = '<dd class="icon"><a href="javascript:;" hidefocus="true" title="更多操作" class="bg more"></a></dd>';
            musicArr[n++] = '</dl><div class="singer" style="color:';
			musicArr[n++] = musicColor
			musicArr[n++] = '"><a href="javascript:;" hidefocus="true" title="直接播放" class="bg play"></a>';
            musicArr[n++] = '<div class="music_info"><a href="javascript:;" hidefocus="true" class="play_music" title="';
			musicArr[n++] = musicName;
			musicArr[n++] = '" style="color:';
			musicArr[n++] = musicColor
			musicArr[n++] = '">';
			musicArr[n++] = musicName;
			musicArr[n++] = '</a>';
            musicArr[n++] = ' - <a href="javascript:;" hidefocus="true" title="';
			musicArr[n++] = artist;
			musicArr[n++] = '" style="color:';
			musicArr[n++] = musicColor;
			musicArr[n++] = '" class="artist_a" onclick="';
			musicArr[n++] = artistClick;
			musicArr[n++] = '">';
			musicArr[n++] = artist;
            musicArr[n++] = '</a></div></div></div>';
        }
        var musicStr = musicArr.join('');

        arr[xia++] = '<li class="usercomment clearfix" style="margin-left:' + oMarginLeft + '" data-music="';
		arr[xia++] = params;
		arr[xia++] = '" data-mdcode="';
		arr[xia++] = formats;
		arr[xia++] = '" data-musicId="';
		arr[xia++] = rid;
		arr[xia++] = '" data-num="';
		arr[xia++] = i
		arr[xia++] = '" data-tid="';
		arr[xia++] = tid
        arr[xia++] = '"><a hidefocus="true" href="javascript:;" title="';
		arr[xia++] = userName
		arr[xia++] = '" onclick="';
        arr[xia++] = jumpUserPageStr;
        arr[xia++] = '"><img src="';
		arr[xia++] = userPic;
        arr[xia++] = '" width="55" height="55" /></a><div class="comm clearfix"><p class="username">';
        arr[xia++] = '<a href="javascript:;" hidefocus="true" onclick="';
		arr[xia++] = jumpUserPageStr;
		arr[xia++] = '">';
		arr[xia++] = userName
		arr[xia++] = '</a><span>';
		arr[xia++] = time
		arr[xia++] = '</span></p>';
        arr[xia++] = musicStr;
        arr[xia++] = '<p class="tips" style="';
		arr[xia++] = oStyle;
		arr[xia++] = '">';
		arr[xia++] = content;
        arr[xia++] = '</p><p class="zan"><a class="bg ';
		arr[xia++] = liked;
		arr[xia++] = '"></a>赞(<font>';
		arr[xia++] = likeNum;
		arr[xia++] = '</font>)</p>';
		arr[xia++] = share2Str;
		arr[xia++] = '</div></li>';
    }
    return arr.join('');
}

// 创建话题歌曲列表列表
function createTopicMusicList(jsondata) {
    var data = jsondata;
	var arr = [];
    var xia = 0;
    var len = data.length;
    var obj;
    var userInfo;
    var musicInfo;
    var rid;
    var tid;
    var likeNum;
    var liked;
    var musicColor;
    var userPic;
    var userName;
    var artist;
    var artistId;
    var time;
    var musicId;
    var musicName;
    var formats;
    var psrc;
    var params;
    var oStyle;
    var oClass;
	var users;
    var usersStr;
	var currNum;
	var numSize;
    for (var i = 0; i < len; i++) {
        obj = data[i];
        tid = obj.tid || 0;
        time = obj.time;
        musicColor = obj.color;
        likeNum = obj.likeCount;
        eval(obj.liked) ? liked = 'liked' : liked = 'like';
        musicInfo = obj.musicInfo;
        rid = musicInfo.id;
        musicName = musicInfo.songName;
        artist = musicInfo.artist;
		artistId = musicInfo.artistId;
		artistClick = commonClickString(new Node(4, artistId, artist, 4));
        params = musicInfo.params;
       
        formats = musicInfo.formats;
        psrc = '曲库->'+pfrom+'音乐话题->'+currentObj.name+'->精选歌曲';
        params = getParams(params, formats, psrc,artistId);
        users = obj.users;
		usersStr = '';
		currNum = (i + 1) + (mtlo.rn * (mtlo.pn - 1));
		numSize = '24px';
		numColor = '#C0BEBE';
		
		if(currNum < 10){
			numSize = '24px';
			if(currNum <= 3){
				numColor = '#F58B0D';
			}
		}else if(currNum >= 10 && currNum < 100){
			numSize = '18px';
		}else if(currNum >= 100){
			numSize = '14px';
		}
		if (users){
			for(var j = 0; j < users.length; j++) {
				var name = users[j].name;
				var id = users[j].id;
				//var jumpUserPageStr = 'callClient(\'Jump?channel=my&url=' + encodeURIComponent('http://mboxspace.kuwo.cn/ucm/mbox2013/home_2016.jsp?pageReady=false&uid=' + id) + '\'); return false;';
				var url = "http://www.kuwo.cn/pc/my/index?uid=" +getUserID("uid")+"&vuid="+id;
				usersStr += '<a hidefocus="true" href="javascript:;" title="' + name + '"onclick="jumpToOtherUser(\''+url+'\')">'+name+'</a>';
			}
		}

        if (i == 0) {
            oStyle = 'display:block';
            oClass = 'current current';
        } else {
            oStyle = 'display:none';
            oClass = 'adcurrent';
        }
		
        arr[xia++] = '<li class="musiclist ';
		arr[xia++] = oClass
		arr[xia++] = ' clearfix" data-music="';
		arr[xia++] = params;
		arr[xia++] = '" data-mdcode="';
		arr[xia++] = formats
		arr[xia++] = '" data-musicId="';
		arr[xia++] = rid;
		arr[xia++] = '" data-num="' + i + '">';
        arr[xia++] = '<p class="num topnum" style="font-size:';
		arr[xia++] = numSize
		arr[xia++] = '; color:';
		arr[xia++] = numColor;
		arr[xia++] = '">';
		arr[xia++] = currNum;
        arr[xia++] = '</p><div class="rightcon clearfix"><p class="musicname"><span class="double">';
        arr[xia++] = '<a href="javascript:;" hidefocus="true">';
		arr[xia++] = musicName;
		arr[xia++] = '</a></span></p>';
        arr[xia++] = '<p class="artistname">';
        arr[xia++] = '<a href="javascript:;" hidefocus="true" onclick="';
		arr[xia++] = artistClick;
		arr[xia++] = '">';
		arr[xia++] = artist;
		arr[xia++] = '</a></p>';		
        //arr[xia++] = '<p class="zan"><a class="bg ' + liked + '"></a>赞（<font>' + likeNum + '</font>）</p>';
        arr[xia++] = '<p class="zan">';
		arr[xia++] = likeNum;
		arr[xia++] = '人赞过</p>';
        arr[xia++] = '<dl><dd class="icon"><a href="javascript:;" hidefocus="true" title="播放歌曲" class="bg play"></a></dd>';
        arr[xia++] = '<dd class="icon"><a href="javascript:;" hidefocus="true" title="添加歌曲" class="bg add"></a></dd>';
        arr[xia++] = '<dd class="icon"><a href="javascript:;" hidefocus="true" title="下载歌曲" class="bg down"></a></dd>';
        arr[xia++] = '<dd class="icon"><a href="javascript:;" hidefocus="true" title="分享歌曲" class="bg share"></a></dd>';
        arr[xia++] = '<dd class="icon"><a href="javascript:;" hidefocus="true" title="更多操作" class="bg more"></a></dd></dl>';
        arr[xia++] = '<div class="tips clear" style="';
		arr[xia++] = oStyle
		arr[xia++] = '"><p><font>歌曲分享自：</font><span class="users"><em>';
        arr[xia++] = usersStr;
        arr[xia++] = '</em></span></p>';
		arr[xia++] = '<div class="user_change">'
		arr[xia++] = '<a href="javascript:;" hidefocus="true" class="prev noprev"></a>';
		arr[xia++] = '<a href="javascript:;" hidefocus="true" class="next"></a>';
        arr[xia++] = '</div></div></div></li>';
    }
    return arr.join('');
}

// 创建往期话题列表
function createPastTopicList(jsondata, node) {
	var data = jsondata;
	var arr = [];
    var xia = 0;
    var len = data.length;
    var obj;
	var listClass;
	var pic;
	var phase;
	var topicName;
	var topicId;
	var topicCount;
	var click;
	
	for (var i = 0; i < len; i++) {	
		obj = data[i];
		pic = obj.picThumb;
		topicId = obj.topicId;
		topicCount = obj.countTopic;
		phase = obj.phase;
		topicName = obj.topicName;
		i % 2 ? listClass = "" : listClass = "mr32";
		click = commonClickString(new Node(currentObj.source, topicId , topicName, 0));

		arr[xia++] = '<li data-id="';
		arr[xia++] = topicId;
		arr[xia++] = '" data-name="';
		arr[xia++] = topicName;
		arr[xia++] = '" class="';
		arr[xia++] = listClass;
		arr[xia++] = '"><div class="left"><div class="b9_wrap" c-id="com_b_wrap"><a onclick="refreshTopicInfo(); ';
		arr[xia++] = click;
		arr[xia++] = '" href="###" hidefocus="true" class="pic">';
		arr[xia++] = '<em class="b_play" title="直接播放" onclick="iplay(arguments[0],this);"></em><span class="mask"></span><img width="100" height="100" src="';
		arr[xia++] = pic;
		arr[xia++] = '"></a></div></div>';
		arr[xia++] = '<div class="right"><p class="topic_tit">';
		arr[xia++] = '<a href="###" hidefocus="true" title="';
		arr[xia++] = phase + '：' + topicName;
		arr[xia++] = '" onclick="refreshTopicInfo(); ';
		arr[xia++] = click;
		arr[xia++] = '">';
		arr[xia++] = phase + '：' + topicName;
		arr[xia++] = '</a></p><p class="topic_words">';
		arr[xia++] = topicCount + '条留言';
		arr[xia++] = '</p><a href="###" hidefocus="true" class="play_jx" onclick="iplay(arguments[0],this);"></a></div></li>';
	}
	return '<ul class="topic_list">' + arr.join('') + '</ul>';
}

// 我要分享回调
function addTopic(jsondata) {
	var data = jsondata; if (!data) return;
    var status = data.status;
	closeSearchTipsList(true);
	closeSearchList();
	deleteMusicInfo();
	if (status == 0) {
		mtlo.node = 1;
		mtlo.type = 'new';
		mtlo.pn = 1;
		topicInfoObj.isSubmitFinish = true;
		showModule(mtlo, true);
		closeShare();
		setTimeout(function(){
			sharePopObj.find(".search_topic").val(sharePopObj.find(".search_topic").attr("data-val")).css("color","c3c3c3");
			sharePopObj.find("textarea").html(sharePopObj.find("textarea").attr("data-val")).css("color","c3c3c3");
		}, 500);
		var url = 'http://album.kuwo.cn/album/MusicTopicIndexServlet?itemId=' + currentObj.sourceid + '&r=' + Math.random();
		//getScriptData(url,false);
		$.ajax({
	        url:url,
	        dataType:'jsonp',
	        crossDomain:false,
			success:function(json){
				refreshInfo(json);
			}
	    });
	} else {
		topicInfoObj.isSubmitFinish = true;
		closeShare();
		setTimeout(function(){
			sharePopObj.find(".search_topic").val(sharePopObj.find(".search_topic").attr("data-val")).css("color","c3c3c3");
			sharePopObj.find("textarea").html(sharePopObj.find("textarea").attr("data-val")).css("color","c3c3c3");
		}, 500);		
	}
}

// 创建精选歌曲
function createJxList(jsondata){
	var data = jsondata; if (!data) return;
	var len = data.length;
	var obj;
	var rid;
	var pid;
	var phbid;
	var musicName;
	var artist;
	var artistid;
	var album;
	var albumid;
	var param;
	var formats;
	var jsStr = 'n=' + len;
	var arr = [];
	var xia = 0;
	
	for (var i = 0; i < len; i++) {	
		obj = data[i];
		rid = obj.id;
		pid = 0;
		phbid = 0;
		musicName = obj.songName;
		artist = obj.artist;
		artistid = obj.artistid;
		album = obj.album;
		albumid = obj.albumid;
		param = obj.params;
		formats = obj.formats;
		
		if (param!="") {
			var paramArray;
			var musicstringarray = [];
			var childArray = [];
			var childi = 0;	
			param = returnSpecialChar(param);
			paramArray = param.split(";");
			childArray[childi++] = encodeURIComponent(returnSpecialChar(musicName));
			childArray[childi++] = encodeURIComponent(returnSpecialChar(artist));
			childArray[childi++] = encodeURIComponent(returnSpecialChar(album));
			for(var j = 3; j < paramArray.length; j++) {
				childArray[childi++] = paramArray[j];
			}
			musicString = childArray.join('\t');
			childArray = null;
			musicMVString = musicString;
			mvridnum = paramArray[11];
			if(paramArray[11].length>5){
				hasMV = true;
				mvClass = "three";
			}
			if(mvridnum.indexOf("MKV")>-1){
				mvridnum = mvridnum.substring(4);
			}else if(mvridnum.indexOf("MV")>-1){
				mvridnum = mvridnum.substring(3);
			}
			musicridnum = paramArray[5];
			if(musicridnum.indexOf("MUSIC")>-1){
				musicridnum = musicridnum.substring(6);
			}
			// psrc = getPSRC(artistid,albumid,pid,musicridnum,phbid);
			psrc = encodeURIComponent('曲库->'+pfrom+'音乐话题->'+currentObj.name+'->播放精选');
			mvpsrc =  ''; //getMVPSRC(artistid,albumid,pid,mvridnum,musicridnum,phbid)
			musicstringarray = [];
			musicstringarray[0] = musicString;
			musicstringarray[1] = psrc;
			musicstringarray[2] = formats;
			musicString = musicstringarray.join('\t');		
			musicString = encodeURIComponent(musicString);
		}			
		param = getParams(musicString, formats, psrc,artistid);
		arr[i] = '&s' + (i + 1) + '=' + param;
	}	
	jsStr += arr.join('');
	$(".playJx").attr("data-music", jsStr);
}

// 		
function addShareFn(rid, tid) {
	// 如果选择分享调出分享弹窗
	if ($(".share_icon").find(".current").size() > 0) {
		var to = $(".share_icon").find(".current").find("a").attr("class");
		var call = 'ShowShareWnd?rid=MUSIC_' + rid + '|||to$' + to + '|||from$myTopic|||id$' + tid + '|||itemId$' + topicId;
		callClientNoReturn(call);
	}		
}

// 获取点赞数
var zantimer = null;
function getZanCount(){
	var uid = parseInt(getUserID("uid"));
	var node = mtlo.node;
	if (!uid) {
		clearTimeout(zantimer);
		zantimer = setTimeout(getZanCount, getZanTime);			
		return;
	}
	if (node != 3) {
		var time = new Date().getTime();
		var zanUrl = 'http://album.kuwo.cn/album/MusicTopicServlet?node=zan&uid=' + uid + '&itemId=' + currentObj.sourceid + '&r=' + Math.random();	
		//getScriptData(zanUrl);
		$.ajax({
	        url:zanUrl,
	        dataType:'jsonp',
	        crossDomain:false,
			success:function(json){
				showZanCount(json);
			}
	    });
	}else{
		var time = new Date().getTime();
		var zanUrl = 'http://album.kuwo.cn/album/MusicTopicServlet?node=zan&type=3&uid=' + uid + '&itemId=' + currentObj.sourceid + '&r=' + Math.random();	
		//getScriptData(zanUrl);
		$.ajax({
	        url:zanUrl,
	        dataType:'jsonp',
	        crossDomain:false,
			success:function(json){
				showZanTips(json);
			}
	    });
	}
}

// 获取我的页面点赞数
function showZanTips(jsondata){
	try{
		var data = jsondata; if (!data) return;
		var dataCont = data.data; if (!dataCont) return;
		var currentTipsNum = parseInt($(".zan_tips").find("span").html());
		if (isNaN(currentTipsNum)) currentTipsNum = 0;
		var newLikeNum = parseInt(dataCont.newLikeNum);
		var num = 0;
		currentLikeNum ? num = newLikeNum + currentLikeNum : num = newLikeNum + currentTipsNum;
		currentLikeNum = 0;
		$(".new_like_icon").hide().find("font").html(0);
		if (num > 0) {
			$(".zan_tips").show().find("span").html(num);
		} else {
			$(".zan_tips").hide().find("span").html("");
		}
		if (dataCont.sec) getZanTime = dataCont.sec * 1000;
		clearTimeout(zantimer);
		zantimer = setTimeout(getZanCount, getZanTime);
	}catch(e){}
}

// 获取点赞数
function showZanCount(jsondata){
	try{
		var data = jsondata; if (!data) return;
		var dataCont = data.data; if (!dataCont) return;
		var newLikeNum = parseInt(dataCont.newLikeNum);
		if (isNaN(newLikeNum)) newLikeNum = 0;
		if (newLikeNum > 0) {
			$(".new_like_icon").show().find("font").html(newLikeNum);
		}else{
			$(".new_like_icon").hide();
		}
		if (dataCont.sec) getZanTime = dataCont.sec * 1000;	
		clearTimeout(zantimer);
		zantimer = setTimeout(getZanCount, getZanTime);
	}catch(e){}
}

// 刷新歌曲数量和评论数
function refreshInfo(jsondata){
	var data = jsondata; if (!data) return;
	var totalSong = data.totalSong;
	var totalTopic = data.totalTopic;
	$(".songnum font").html(totalSong);
	$(".topicnum font").html(totalTopic);
}

// 添加喜欢
function showLike(jsondata) {
	isLikeClick = true;
    var data = jsondata;
    var status = data.status;
	var likeNum = data.likeCount;
	var liked = eval(data.liked);
	var tid = data.tid;
	if (status == 0 && liked) {
		shareContObj.find(".music_list li").eq(currLikeBtn).find(".zan a").removeClass("like").addClass("liked");
		shareContObj.find(".music_list li").eq(currLikeBtn).find(".zan font").html(likeNum);
    }else if(status == 0 && !liked){
		shareContObj.find(".music_list li").eq(currLikeBtn).find(".zan a").removeClass("liked").addClass("like");
		shareContObj.find(".music_list li").eq(currLikeBtn).find(".zan font").html(likeNum);
	}
}

// 获取用户信息
function getUserInfo(jsondata) {
    var data = jsondata; if (!data) return;
    var userId = data.uid;
    var userName = data.userName;
    var userPic = data.userFace;
    var myurl = encodeURIComponent('http://mboxspace.kuwo.cn/ucm/mbox2013/home_2016.jsp?pageReady=false&uid=' + userId);
    sharePopObj.find(".userInfo").unbind("click").live("click", function () {
        //callClient('Jump?channel=my&url=' + myurl);
        callClientNoReturn('JumpToHomePage?vuid=' + userId);
        return false;
    });
    sharePopObj.find(".userInfo").unbind("click").live("click", function () {
        //callClient('Jump?channel=my&url=' + myurl);
        callClientNoReturn('JumpToHomePage?vuid=' + userId);
        return false;
    });	
    sharePopObj.find(".userInfo").attr("title", userName);
    sharePopObj.find(".userInfo img").attr("src", userPic);
}

// 请求搜索提示列表数据
function loadSearchTipsData(val){
	var url = 'http://tips.kuwo.cn/t.s?c=mbox&w='+val+'&rformat=json&encoding=utf8';
	$.ajax({
		url	: url,
		dataType : "json",
		crossDomain:false,
		success : function(jsondata,textStatus){
			if(textStatus=="success"){
				var data = jsondata;
				createSearchTipsList(data);
			}
		},
		error : function(xhr){webLog("loadSearchTipsData:" + url);}
	});
}

// 创建搜索提示列表
function createSearchTipsList(jsondata){
	var data = jsondata; if (!data) return;
	var lists = data.WORDITEMS;
	var len = Math.min(data.HITNUM,6);
	var str = '';
	var obj;
	var name;
	var num;

	if(len==0) {
		closeSearchTipsList();
		return;
	}
	
	for(var i=0; i<len; i++){
		obj = lists[i];
		name = obj.RELWORD;
		num = obj.SNUM;
		if(currindex == i){
			str += '<li class="current">';
		}else{
			str += '<li>';
		}
		str += '<span class="tips_num">'+num+'</span><a href="javascript:;" hidefocus="true" class="tips_name">'+name+'</a></li>';
	}
	sharePopObj.find(".share_search").find(".searc_tips").html(str);
	sharePopObj.find(".share_search").find(".searc_tips").show();
	closeSearchList();
}

// 请求搜索结果列表数据
function loadSearchData(val){	
	var url = 'http://search.kuwo.cn/r.s?all='+val+'&ft=music&newsearch=1&itemset=web_2013&client=kt&cluster=0&pn=0&rn=10&rformat=json&encoding=utf8';
	//getScriptData(url, false);
	$.ajax({
        url:url,
        dataType:'jsonp',
        crossDomain:false,
		success:function(json){
			getSearchData(json);
		}
    });
}

// 创建搜索结果列表
function getSearchData(jsondata){
	var data = jsondata; if(!data) return; 
	closeSearchTipsList();
	currindex = -1;
	var lists = data.abslist;
	var len = lists.length;
	var obj;
	var arr = [];
	var xia = 0;
	var musicRid;
	var musicName;
	var artist;
	var artistId;
	var artistName;
	var albumName;
	var albumId;
	var score;
	var width;
	var scoreNum;
	var formats;
	var level;
	var musicString;
	var rid;
	var mp3rid;
	var mvrid;
	var musicridnum;
	var psrc;
	var musicstringarray;
	var musici;

	if(len == 0){
		closeSearchList();
		return;
	}
	
	for(var i=0; i<len; i++){
		obj = lists[i];
		musicRid = obj.MUSICRID;
		if(musicRid.indexOf('MUSIC_') > -1){
			rid = musicRid.substring(6);
		}else{
			rid = musicRid;
		}
		musicName = obj.SONGNAME;
		artist = obj.ARTIST;
		artistId = obj.ARTISTID;
		albumName = obj.ALBUM;
		mp3rid = obj.MP3RID;
		mvrid = obj.MKVRID;
		formats = obj.FORMATS;
		psrc = '曲库->'+pfrom+'音乐话题->'+ currentObj.name +'->试听';
		musicstringarray = [];
		musici = 0;
		musicstringarray[musici++] = encodeURIComponent(returnSpecialChar(musicName));
		musicstringarray[musici++] = encodeURIComponent(returnSpecialChar(artist));
		musicstringarray[musici++] = encodeURIComponent(returnSpecialChar(albumName));
		musicstringarray[musici++] = obj.NSIG1;
		musicstringarray[musici++] = obj.NSIG2;
		musicstringarray[musici++] = 'MUSIC_' + rid;
		musicstringarray[musici++] = obj.MP3NSIG1;
		musicstringarray[musici++] = obj.MP3NSIG2;
		musicstringarray[musici++] = mp3rid;
		musicstringarray[musici++] = obj.MKVNSIG1;
		musicstringarray[musici++] = obj.MKVNSIG2;
		musicstringarray[musici++] = mvrid;
		musicstringarray[musici++] = obj.HASECHO;
		musicString = musicstringarray.join('\t');
		musicstringarray = null;
		musicMVString = musicString;
		musicString = musicString + "\t" + encodeURIComponent(psrc) +"\t"+formats;
		musicString = encodeURIComponent(musicString);

		arr[xia++] = '<li class="" data-music="';
		arr[xia++] = musicString;
		arr[xia++] = '" data-mdcode="';
		arr[xia++] = formats;
		arr[xia++] = '" data-musicId="';
		arr[xia++] = rid;
		arr[xia++] = '">';
		arr[xia++] = '<span><a href="javascript:;" hidefocus="true" class="play"></a></span>';
		arr[xia++] = '<div class="search_music"><a href="javascript:;" hidefocus="true">';
		arr[xia++] = checkSpecialChar(musicName,"disname");
		arr[xia++] = '</a></div>';
		arr[xia++] = '<div class="search_name"><a href="javascript:;" hidefocus="true">';
		arr[xia++] = artist;
		arr[xia++] = '</a></div></li>';
	}
	sharePopObj.find(".search_close font").html("共找到" + len + "首歌曲");
	sharePopObj.find(".search_cont ul").html(arr.join(''));
	sharePopObj.find(".search_cont").css("height","0px");
	
	var parentH = 121;
	var contentH = len * 24;
	if(contentH <= parentH){
		sharePopObj.find(".search_cont ul").css("height", contentH);
		sharePopObj.find(".search_cont").stop().animate({ height: contentH }, 500, function () {
			iframeObj.refresh();
		});		
	}else{
		sharePopObj.find(".search_cont ul").css("height","121px");
		sharePopObj.find(".search_cont").stop().animate({ height: 121 }, 500, function () {
			iframeObj.refresh();
		});				
	}
	sharePopObj.find(".search_wrap").show();
	sharePopObj.find(".search_wrap").css("visibility","visible");
	iframeObj.refresh();
}

// 当输入内容发生变化 搜索提示
function changeVal(obj){
	var obj = $(obj);
	var val = obj.val();
	if (val == currVal && val != '') return false;
	currVal = val
	if (val == '') {
		closeSearchTipsList();
		currindex = -1;
		return false;
	}
	val = encodeURIComponent(obj.val());
	loadSearchTipsData(val);
	return false;
}

// 关闭搜索结果列表
function closeSearchList(del){
	var obj = sharePopObj.find(".search_wrap");
	obj.find(".search_cont ul").html("").css("height","0").scrollTop(0);
	obj.hide().css("visibility","hidden");
	if (del) sharePopObj.find(".search_topic").val(sharePopObj.find(".search_topic").attr("data-val")).css("color","#c3c3c3");		
	currVal = ''
}

// 关闭搜索提示列表
function closeSearchTipsList(s){
	var isDeleteVal = s;
	if(isDeleteVal){
		sharePopObj.find(".search_topic").val(sharePopObj.find(".search_topic").attr("data-val")).css("color","#c3c3c3");	
		sharePopObj.find(".searc_tips").hide();
		currVal = ''
	}else{
		sharePopObj.find(".searc_tips").hide();
	}
}

// 删除已添加歌曲
function deleteMusicInfo(){
	sharePopObj.find(".music1").html("");
	sharePopObj.find(".music1").hide();
	$("#dragMusicBox").attr("data-musicId", "");
	sharePopObj.find(".share_search").show();
	closeSearchTipsList(true);
	closeSearchList();
}

// 跳转锚点位置
function returnAnchor(obj){
	fobj.setScrollTop(0);
}

// TAB菜单选中效果
function moveKuai(num) {
    var obj = shareContObj.find(".moveKuai");
    var moveVal = (num - 1) * 130 + 'px';
    obj.stop().animate({ left: moveVal }, 300);
}

// 剩余字数
function countTextNum(){
	var maxLength = 140;
	var initText = textareaObj.attr("data-val");
	var valNum = textareaObj.val().length;
	if(textareaObj.val() == initText){
		valNum = 0;
	}
	if(maxLength >= valNum){
		submitObj.attr("disabled", false);
		tipsObj.html('还可以输入<span style="color:#46b4e6">' + (maxLength - valNum) + '</span>字');
	}else{
		submitObj.attr("disabled", true);
		tipsObj.html('已超出<span style="color:#E44443">' + (valNum - maxLength)+ '</span>字');
	}
}

// 收起我要分享
function closeShare(){
	sharePopObj.stop().animate({ height: 0 }, 500, function () {
		var objH = topicObj.height();
		var clientH = $("#allcontent").height();
		if (objH <= clientH) returnTop();			
		sharePopObj.css("overflow","hidden");
		sharePopObj.find(".taglist").hide();
		closeSearchTipsList();
		closeSearchList();
		iframeObj.refresh();
	});
}

// 打开我要分享
function openShare(){
	sharePopObj.stop().animate({ height: 215 }, 500, function () {
		sharePopObj.css("overflow","visible")
		iframeObj.refresh();
	});
}

// 直接播放往期话题热门歌曲
function playTopicMusic(jsondata){
	var data = jsondata; if (!data) return;
	var musicList = data.musiclist;
	var musicSize = musicList.length;
	// currentBread = '曲库->首页->音乐话题->' + currentObj.name + '往期话题->直接播放->' + currentPastTopicName;
	currentBread = '曲库->'+pfrom+'音乐话题->' + currentObj.name + '->往期话题';
	var bigString = playMusicBigString(musicList,true,0,0,"",currentBread);
	callClientNoReturn("Play?mv=0&n="+musicSize + bigString);
	musicList = null;
	bigString = null;
	data = null;	
}

function playMusicBigString(objs, flag, pid, phbid, name, somepsrc){
	var musicList = objs;
	var musicSize = musicList.length;
	var bigString = "";
	var bigarray = [];
	var someObj;
	var param;
	var paramArray;
	var childArray;
	var musicString;
	var musicridnum;
	var psrc;
	var musicstringarray;
	var sarray;
	var si;
	var rid;
	var mp3rid;
	var mvrid;
	var psrc;
	var musicstringarray;
	var xia;
	//flag为true 用param
	if(flag){
		for(var i = 0; i < musicSize; i++){
			someObj = musicList[i];
			param = someObj.param;
			if(typeof(param)=="undefined"){
				param = someObj.params;
			}
			param = returnSpecialChar(param);
			paramArray = param.split(";");
			childArray = [];
			musicString = "";
			for(var j=0;j<paramArray.length;j++){
				if(j < 3){
					childArray[j] = encodeURIComponent(returnSpecialChar(paramArray[j]));
				}else{
					childArray[j] = paramArray[j];
				}
			}
			musicString = childArray.join('\t');
			musicridnum = paramArray[5];
			if(musicridnum.indexOf("MUSIC")>-1){
				musicridnum = musicridnum.substring(6);
			}
			childArray = null;
			paramArray = null;
			if (somepsrc){
				psrc = encodeURIComponent(somepsrc);
			} else {
				psrc = getPSRC(someObj.artistid,someObj.albumid,0,musicridnum,phbid);
			}
			
			musicstringarray = [];
			musicstringarray[0] = musicString;
			musicstringarray[1] = psrc;
			musicstringarray[2] = someObj.formats;
			musicString = musicstringarray.join('\t');
			musicstringarray = null;
			musicString = encodeURIComponent(musicString);
			sarray = [];
			si = 0;
			sarray[si++] = '&s';
			sarray[si++] = (i+1);
			sarray[si++] = '=';
			sarray[si++] = musicString;
			bigarray[i] = sarray.join('');
			sarray = null;
		}
	}else{
		for(var i = 0; i < musicSize; i++){
			someObj = musicList[i];
			rid = "MUSIC_"+ someObj.musicrid;
			mp3rid = "MP3_"+someObj.mp3rid;
			mvrid = "MV_"+someObj.mkvrid;
			if (somepsrc){
				psrc = somepsrc;
			} else {
				psrc = getPSRC(someObj.artistid,someObj.albumid,0,musicridnum,phbid);
			}
			musicstringarray = [];
			xia = 0;
			musicstringarray[xia++] = encodeURIComponent(returnSpecialChar(someObj.name));
			musicstringarray[xia++] = encodeURIComponent(returnSpecialChar(someObj.artist));
			musicstringarray[xia++] = encodeURIComponent(returnSpecialChar(someObj.album));
			musicstringarray[xia++] = someObj.nsig1;
			musicstringarray[xia++] = someObj.nsig2;
			musicstringarray[xia++] = rid;
			musicstringarray[xia++] = someObj.mp3sig1;
			musicstringarray[xia++] = someObj.mp3sig2;
			musicstringarray[xia++] = mp3rid;
			musicstringarray[xia++] = someObj.mkvnsig1;
			musicstringarray[xia++] = someObj.mkvnsig2;
			musicstringarray[xia++] = mvrid;
			musicstringarray[xia++] = someObj.hasecho;
			musicstringarray[xia++] = psrc;
			musicstringarray[xia++] = someObj.formats;
			musicString = musicstringarray.join('\t');
			musicstringarray = null;
			musicString = encodeURIComponent(musicString);
			sarray = [];
			si = 0;
			sarray[si++] = '&s';
			sarray[si++] = (i+1);
			sarray[si++] = '=';
			sarray[si++] = musicString;
			bigarray[i] = sarray.join('');
			sarray = null;
		}
	}
	bigString = bigarray.join('');
	bigarray = null;
	musicList = null;
	return bigString;
}

// 关闭引导层
function closeYindao(){
	$(".yindao").hide();
}

// 初始化缓存数据
function refreshTopicInfo(){
	saveDataToCache('topicNode', 1 , 999999999999999999); 
	saveDataToCache('topicType', 'hot' , 999999999999999999);
	saveDataToCache('topicPn', 1 , 999999999999999999);		
}

//获取PSRC
function getParams(params,formats,psrc,artistid){
	psrcStr		  = psrc;
	decodeparams  = decodeURIComponent(params).replace(/;/g,'\t');		
	decodeparams  = decodeparams+'\t'+encodeURIComponent('VER=2013;FROM='+psrcStr)+'\t'+ formats+'\t'+0+'\t'+0+'\t'+0+'\t'+artistid;
	decodeparams  = encodeURIComponent(decodeparams);	//这个是它要的编号码的data-music
	return decodeparams;
}
function objBindFn() {
	topicObj.find(".shareBtn").live("click", function () {
		if (sharePopObj.height() > 0 ){
			closeShare();
			return false;
		}
        var uid = getUserID("uid");
        if (uid == 0) {
            callClientNoReturn("UserLogin?src=login");
        } else {
			//请求用户信息
            var url = 'http://album.kuwo.cn/album/MusicTopicIndexServlet?method=getUser&uid=' + uid;
            //getScriptData(url, false);
			$.ajax({
		        url:url,
		        dataType:'jsonp',
		        crossDomain:false,
				success:function(json){
					getUserInfo(json);
				}
		    });
			// 判断客户端是否支持歌曲反拖拽，不支持走搜索
			if(isDrag){
				sharePopObj.find(".share_search").hide();
				sharePopObj.find(".music1").show();
			}else{
				if(!sharePopObj.find(".music1").isShow()){
					sharePopObj.find(".music1").hide();
					sharePopObj.find(".share_search").show();
					$("#dragMusicBox").attr("data-musicId","");
				}
			}
			// countTextNum();
			sharePopObj.find(".ts").hide();
			openShare();
			closeYindao();
        }
        iframeObj.refresh();
        return false;
    });


	// 点击分享块以外区域收起我要分享
    topicObj.live("click", function (e) {
        var obj = $(e.srcElement);
        var isChild = isChild(obj);
		if (obj.hasClass('sharePop')){
			return;
		}

        if (sharePopObj.isShow() && !isChild) {
			// closeShare();
        }
		
		// 判断点击元素是否为对象外的元素
        function isChild(obj) {
            while (obj.parent().attr("class") != 'topic_con') {
                obj = obj.parent();
                if (obj.hasClass("sharePop")) return;
            }
            return 0;
        }
        return false;
    });	
	
	
	// 点击搜索歌曲Tips列表以外区域隐藏Tips列表
	sharePopObj.live("click", function(e){
		var obj = $(e.srcElement);
		sharePopObj.find(".taglist").hide();
		if (obj.parents(".share_search").size() > 0){
			return false;
		}
		closeSearchTipsList(true);
		closeSearchList();
		return false;
	});
	
	// 搜索时显示搜索提示列表
	sharePopObj.find(".search_topic").keyup(function(e) {
		var keycode = e.which;
		if(keycode == 40 || keycode == 38 || keycode == 13){
			if(keycode == 40){
				currindex = currindex + 1;
				if(currindex > sharePopObj.find(".searc_tips li").size() - 1) currindex = 0;
				sharePopObj.find(".searc_tips li").removeClass("current");
				sharePopObj.find(".searc_tips li").eq(currindex).addClass("current");
			}
			if(keycode == 38){
				currindex = currindex - 1;
				if(currindex < 0) currindex = sharePopObj.find(".searc_tips li").size() - 1;
				sharePopObj.find(".searc_tips li").removeClass("current");
				sharePopObj.find(".searc_tips li").eq(currindex).addClass("current");
			}
			if(keycode == 13){
				var currAct = sharePopObj.find(".searc_tips").find(".current a");
				var val = '';
				if(currAct.size() > 0 && sharePopObj.find(".searc_tips").isShow()){
					val = sharePopObj.find(".searc_tips").find(".current a").html();
					sharePopObj.find(".search_topic").val(val);				
				}else{
					val = sharePopObj.find(".search_topic").val();
				}
				currVal = val;
				val = encodeURIComponent(val);
				loadSearchData(val);
			}				
			return false;
		}
		var val = $(this).val();
		if (val == currVal && val != '') return false;
		currVal = val;
		if (val == '') {
			closeSearchTipsList();
			currindex = -1;
			return false;
		}
		val = encodeURIComponent($(this).val());
		loadSearchTipsData(val);
		return false;
	});
	
	// 搜索提示列表hover
	sharePopObj.find(".searc_tips li").live("mouseenter", function(){
		currindex = $(this).index();
		sharePopObj.find(".searc_tips li").removeClass("current");
		$(this).addClass("current");
		return false;
	});
	
	// 搜索框获得焦点时如有文字显示搜索提示列表
	sharePopObj.find(".search_topic").focus(function(){
		if ($(this).val() == $(this).attr("data-val")) $(this).val("").css("color","#666");
		var val = $(this).val();
		if (val == '') {
			currindex = -1;
			closeSearchTipsList();
			return false;
		}
		if (currVal == val) return false;
		currVal = val;
		val = encodeURIComponent(val);
		loadSearchTipsData(val);		
		return false;
	});	
	sharePopObj.find(".search_topic").blur(function(){
		if ($(this).val() == "") $(this).val($(this).attr("data-val")).css("color","#c3c3c3");
		return false;
	});
	
	// 点击搜索按钮创建搜索结果列表
	sharePopObj.find(".searchBtn").live("click", function(){
		var val = sharePopObj.find(".search_topic").val();
		if (val == sharePopObj.find(".search_topic").attr("data-val")){
			return false;
		}
		currVal = val;
		val = encodeURIComponent(val);
		loadSearchData(val);
		return false;
	});
		
	// 点击搜索提示列表创建搜索结果列表
	sharePopObj.find(".searc_tips li").live("click", function(){
		var val = $(this).find("a").html();
		sharePopObj.find(".search_topic").val(val);
		currVal = val;
		val = encodeURIComponent(val);
		loadSearchData(val);
		return false;
	});
		
	// 点击搜索结果列表
	sharePopObj.find(".search_cont li").live("click", function(e){
		var obj = $(e.srcElement);
		if (obj.attr("class") == 'play'){
			var playMusicString = obj.parents("li").attr("data-music");
			singleMusicOption('Play', playMusicString);
			return false;
		}
		var musicName = $(this).find(".search_music a").html();
		var artist = $(this).find(".search_name a").html();
		var musicId = $(this).attr("data-musicId");
		var colorVal = sharePopObj.find(".select>.color").css("backgroundColor");
		var htmlStr = '<font style="color:'+ colorVal +'" title="'+ musicName + ' - ' + artist + '">'+ musicName + ' - ' + artist + '</font><a href="javascript:;" hidefocus="true" title="删除分享歌曲" class="close" onclick="deleteMusicInfo(); return false;"></a>'
		sharePopObj.find(".share_search").hide();
		$("#dragMusicBox").attr("data-musicId", musicId);
		$("#dragMusicBox").html(musicName);
		
		sharePopObj.find(".music1").html(htmlStr);
		sharePopObj.find(".music1").show();
		closeSearchTipsList(true);
		sharePopObj.find(".ts").hide();
		return false;
	});

	// HOVER高亮显示搜索结果
	sharePopObj.find(".search_cont li").live("mouseenter", function(){
		sharePopObj.find(".search_cont li").removeClass("current");
		$(this).addClass("current");
		return false;
	});	
	sharePopObj.find(".search_cont li").live("mouseleave", function(){
		sharePopObj.find(".search_cont li").removeClass("current");
		return false;
	});
		
    // 提交话题
    sharePopObj.find(".submit").live("click", function () {
    	if(!topicInfoObj.isSubmitFinish || $(this).attr("disabled")) {
			return false;
		}
		var uid = getUserID("uid");
		var cont = sharePopObj.find("textarea").html();
        var colorVal = encodeURIComponent($(this).parents(".comm").find(".select>.color").css("backgroundColor"));
        var rid = parseInt($("#dragMusicBox").attr("data-musicId"), 10);
		var musicRidStr = '';
		if (rid) musicRidStr = '&rid=MUSIC_' + rid;
		if(sharePopObj.find("textarea").attr("data-val") == cont && !musicRidStr){
			sharePopObj.find(".ts").show();
			return false;
		}else if(sharePopObj.find("textarea").attr("data-val") == cont){
			cont = '';
		}
		cont = encodeURIComponent(encodeURIComponent(cont));
		topicInfoObj.isSubmitFinish = false;
		var url = 'http://album.kuwo.cn/album/MusicTopicIndexServlet?method=addTopic';
        var param = 'uid=' + uid + '&color=' + colorVal + musicRidStr + '&content=' + cont + '&itemId=' + currentObj.sourceid;
        $.ajax({
			url : url,
			type : "POST",
			data : param,
			dataType : "json",
			crossDomain:false,
			success:function(json){
				addTopic(json);
			}
		});		
		//getScriptData(url, false);
        return false;
    });
	
	// textarea 获取焦点时取消提示
    var textTimer = null;	
	sharePopObj.find("textarea").focus(function(){
		var _this = $(this);
		$(this).css("color","#666");
		sharePopObj.find(".ts").hide();
		var cont = $(this).html().replace(/(^\s*)|(\s*$)/g,"");
		var val = $(this).attr("data-val");
		if (cont == val) $(this).html("");
        clearInterval(textTimer);
        // textTimer = setInterval(countTextNum, 50);
        return false;		
	});
	sharePopObj.find("textarea").blur(function(){
		var cont = $(this).html().replace(/(^\s*)|(\s*$)/g,"");
		var val = $(this).attr("data-val");
		if (!cont) {
			$(this).css("color","#c3c3c3").html(val);
		}
		// countTextNum();
		clearInterval(textTimer);
		return false;
	});

    // 点击选择颜色
    sharePopObj.find(".select").live("click", function () {
		if ($(this).find(".taglist").children().size() == 0) return false;
        if ($(this).find(".taglist").isShow()) {
            $(this).find(".taglist").hide();
        } else {
            $(this).find(".taglist").show();
        }
        return false;
    });

    // 点击选择颜色下拉显示隐藏
    var colorObj = sharePopObj.find(".select>.color");
    var tagObj = sharePopObj.find(".select>.tag");
    sharePopObj.find(".taglist>div").live("click", function () {
        var colorVal = $(this).find(".color").css("backgroundColor");
        var colorName = $(this).find(".tag").html();
        colorObj.css("backgroundColor", colorVal);
		$("#dragMusicBox").find("font").css("color", colorVal);
		sharePopObj.find(".select>.tag").css("color", colorVal);
        tagObj.html(colorName);
        sharePopObj.find(".taglist>div").show();
        $(this).hide().parent().hide();
        return false;
    });
	
    // 一级列表切换
    topicObj.find(".tab_menu a").live("click", function () {
        if (!isHTTPClick) return;
        isHTTPClick = false;
    	var node = $(this).parent().attr("data-node");
        mtlo.node = node;
        mtlo.type = 'hot';
        if (mtlo.node == 4) mtlo.type = 'new';
        mtlo.pn = 1;
		isReturnAnchor = false;		
        centerLoadingStart();
        showModule(mtlo);
        return false;
    });

    // 二级列表HOVER
    topicObj.find(".menu a").live("mouseover", function () {
		$(this).parent().addClass("current1");
        return false;
    });    
	topicObj.find(".menu a").live("mouseout", function () {
		$(this).parent().removeClass("current1");
        return false;
    });

    // 二级别列表切换
    topicObj.find(".menu a").live("click", function () {
    	if (!isHTTPClick) return;
    	isHTTPClick = false;    	
        var type = $(this).parent().attr("data-type");
        mtlo.type = type;
        mtlo.pn = 1;
		isReturnAnchor = false;
        centerLoadingStart();
        showModule(mtlo);
        return false;
    });

    // 点击分页
    shareContObj.find(".page a").live("click", function () {
        if ($(this).hasClass("nopage")) return false;
    	if (!isHTTPClick) return;
    	isHTTPClick = false;   
        var pn = $(this).html();
        var totalPage = $(this).parents(".page").attr("data-total");
        var currPn = parseInt(shareContObj.find(".page .current").html(), 10);

        if (pn == "上一页") {
            pn = currPn - 1;
        } else if (pn == "下一页") {
            pn = currPn + 1;
        } else {
            pn = parseInt($(this).html(), 10);
        }
        mtlo.pn = pn;
        isReturnAnchor = true;
		centerLoadingStart();
        showModule(mtlo);

        return false;
    });


    // 移入高亮歌曲操作按钮
    shareContObj.find(".music_list .mu").live("mouseenter", function () {
        $(this).addClass("current");
		$(this).css("background","#f2f2f2");
        return false;
    });
    shareContObj.find(".music_list .mu").live("mouseleave", function () {
        $(this).removeClass("current");
		$(this).css("background","#ffffff");
        return false;
    });
	
	
	// 往期话题hover
	$(".topic_list .pic").live("mouseenter", function () {
		$(this).addClass("current1");
	});
	$(".topic_list .pic").live("mouseleave", function () {
		$(this).removeClass("current1");
	});
	
	// 往期话题直接播放
	$("[c-id=com_b_wrap]").find(".b_play").live("mouseenter", function () {
		$(this).addClass("b_play_h");
		return false;
	});
	$("[c-id=com_b_wrap]").find(".b_play").live("mouseleave", function () {
		$(this).removeClass("b_play_h");
		return false;
	});
    // 移入改变当前行样式
    shareContObj.find(".musiclist").live("mouseenter", function () {
    	var oW = $(this).find("em").width();
		if(oW > 600){
			$(this).find(".user_change").show();
		}	
		iframeObj.refresh();
		if($(this).attr("class").indexOf("adcurrent") < 0) return false;
        shareContObj.find(".musiclist").removeClass('current').addClass('adcurrent');
        shareContObj.find(".musiclist").find(".tips").hide();
		shareContObj.find(".musiclist").find(".user_change").hide();
		shareContObj.find(".musiclist").removeClass("current");

		$(this).addClass("current");
        $(this).removeClass('adcurrent').addClass('current');
        $(this).find(".tips").show();
		
		var oW = $(this).find("em").width();
		if(oW > 600){
			$(this).find(".user_change").show();
		}	
		iframeObj.refresh();
		return false;
    });

	// 切换话题榜歌曲分享用户列表
	var isClick = true;
	shareContObj.find(".next").live("click", function () {
		var moveKuai = $(this).parents(".tips").find("em");
		var oClass = $(this).attr("class");
		if(oClass.indexOf("nonext") > -1) return false; 
		if(!isClick) return false;
		isClick = false;
		var oW = moveKuai.width(); 			  		
		var l = parseInt(moveKuai.css("left"), 10);
		if(oW + l <= 300){										
			isClick = true;
			return false;
		}
		moveKuai.stop().animate({left: l - 300}, 500, function(){
			isClick = true;
		});
		$(this).prev().removeClass("noprev");
		if(oW + l <= 600 + 300 ) $(this).addClass("nonext");	 			  	
		return false;
	});
	shareContObj.find(".prev").live("click", function () {
		var moveKuai = $(this).parents(".tips").find("em");
		var oClass = $(this).attr("class");
		if(oClass.indexOf("noprev") > -1) return false; 
		if(!isClick) return false;
		isClick = false;	
		var oW = moveKuai.width();
		var l = parseInt(moveKuai.css("left"), 10);
		if(l + 300 > 0){
			isClick = true;
			return false;
			return false;
		}
		moveKuai.stop().animate({ left: l + 300 }, 500 ,function(){
			isClick = true;
		});
		$(this).next().removeClass("nonext");
		if(l + 600 > 0) $(this).addClass("noprev");
		return false;
	});   
	
	// 播放歌曲
    shareContObj.find("a.play,a.play_music,.double>a").live("click", function () {
        var playMusicString = $(this).parents("li").attr("data-music");
        singleMusicOption("Play", playMusicString);
        return false;
    });
   
    // 播放全部歌曲
    topicObj.find(".play_all").live("click", function () {
		if(!shareContObj.find(".music_list").isShow()) return false;
        var songList = shareContObj.find(".music_list li");
        var size = songList.size();
        var params = [];
        var htmlArray = [];
        var snum = 0;
        var musicString = '';
        songList.each(function (i) {
            params = $(this).attr("data-music");
            if (!i) htmlArray[i] = 'n=' + size + '&s' + (i + 1) + "=" + params;
            if (i) htmlArray[i] = '&s' + (i + 1) + "=" + params;
        });
        musicString = htmlArray.join('');
        multipleMusicOption("Play", musicString);
        return false;
    });


	// 播放精选 
	$(".playJx").live("click", function() {
		var musicString = $(this).attr("data-music");
		multipleMusicOption("Play", musicString);
        return false;		
	});

    // 添加歌曲
    shareContObj.find("a.add").live("click", function () {
        var playMusicString = $(this).parents("li").attr("data-music");
        var playindex = 0;
        if(playMusicString){
            playindex++;
            var playMusicStr = "n="+playindex+"&s"+playindex+"="+playMusicString;
            multipleMusicOption("AddTo",playMusicStr);
        }
        return false;
    });


	// 下载歌曲
	shareContObj.find("a.down").live("click", function () {
		var playMusicString = $(this).parents("li").attr("data-music");
		singleMusicOption('Down', playMusicString);
		return false;
	});
		
	// 分享歌曲
	shareContObj.find("a.share ,.myshare").live("click",function(){
		var musicId = $(this).parents("li").attr("data-musicId");
		var txt = $(this).parents("li").find(".tips").html();
		var tid = $(this).parents("li").attr("data-tid");
		var call = '';
		if ($(this).parents(".myshare").size() > 0 || $(this).hasClass("myshare")) {
			call = 'ShowShareWnd?rid=MUSIC_' + musicId + '|||from$myTopic|||id$' + tid + '|||itemId$' + topicId;
		} else {
			call = 'ShowShareWnd?rid=MUSIC_' + musicId + '|||from$topic|||id$' + topicId + '|||itemId$' + topicId;
		}
		callClientNoReturn(call);
		return false;
	});	

    // more歌曲
    shareContObj.find("a.more").live("click", function () {
        var playMusicString = $(this).parents("li").attr("data-music");
        var call = "ShowOperation?song=" + playMusicString;
        callClientNoReturn(call);
        return false;
    });

    // 双击播放歌曲
    shareContObj.find(".music_list .mu,.double").live("dblclick", function () {
        var playMusicString = $(this).parents("li").attr("data-music") || $(this).attr("data-music");
        singleMusicOption("Play", playMusicString);
        return false;
    });

    // 歌曲拖拽
    var kk = true;
    shareContObj.find(".music_list .mu,.musiclist").live("mousedown", function (e) {
        var ev = e || event;
        if (typeof (ev.which) != "undefined" && ev.which == 3) {
            return false;
        }
        currentX = ev.clientX;
        currentY = ev.clientY;
        isDragMusic = true;
        kk = true;
        dragMusicString = $(this).parents("li").attr("data-music") || $(this).attr("data-music");

        $(this).mousemove(function (e) {
            var ev = e || event;
            var X = ev.clientX;
            var Y = ev.clientY;
            if (Math.abs(X - currentX) > 5 || Math.abs(Y - currentY) > 5) {

            } else {
                return false;
            }
            if (isDragMusic && dragMusicString != "") {
                var currentobj = $(event.srcElement);
                if (currentobj.is("a")) {
                    isDragMusic = false;
                    return false;
                } else if (currentobj.is("input") || currentobj.hasClass("ichoice") || currentobj.hasClass("ihd") || currentobj.parent().hasClass("ihd") || currentobj.parent().hasClass("five")) {
                    isDragMusic = false;
                    return false;
                } else {
                    if (kk) {
                        kk = false;
                        callClientNoReturn("Begindrag?song=" + dragMusicString);
                    }
                }
                return false;
            }
        });
        return false;
    });
    shareContObj.find(".music_list .mu,.musiclist").live("mouseup", function () {
        isDragMusic = false;
        $(this).unbind("mousemove");
        return false;
    });


    // 喜欢按钮
    shareContObj.find(".zan").live("click", function () {
        var isLike = $(this).find("a").attr("class");
        var rid = $(this).parents("li").attr("data-musicId");
		var tid = $(this).parents("li").attr("data-tid") || 0;
        var str = 'http://album.kuwo.cn/album/MusicTopicIndexServlet?method=';
		var type = '';
        var uid = getUserID("uid");
		isLikeClick = false;
        if (uid == 0){
            callClientNoReturn("UserLogin?src=login");
			isLikeClick = true;
        }else {
            if (isLike.indexOf("liked") > -1) {
                type = 'removeLike';
            } else {
                type = 'addLike';
            }
			currLikeBtn = $(this).parents('li').attr("data-num");
            var url = str + type + '&itemId=' + currentObj.sourceid + '&rid=MUSIC_' + rid + '&uid=' + uid + '&tid='+tid+'&node='+mtlo.node+'';
			//getScriptData(url,false);
			$.ajax({
		        url:url,
		        dataType:'jsonp',
		        crossDomain:false,
				success:function(json){
					showLike(json);
				}
		    });
        }
        return false;
    });
	
	// 同时分享到
	$(".share_icon span").live("click" , function() {
		if ($(this).hasClass("current")) {
			$(this).removeClass("current");
		} else {
			$(this).addClass("current").siblings().removeClass("current");
		}
	});
	
}


function iplay(evt,obj){
	currentPastTopicName = $(obj).parents("li").attr("data-name");
	var topicId = $(obj).parents("li").attr("data-id");
	var url = 'http://album.kuwo.cn/album/MusicTopicServlet?node=pastList&type=' + topicId;
	//getScriptData(url);	
	$.ajax({
        url:url,
        dataType:'jsonp',
        crossDomain:false,
		success:function(json){
			playTopicMusic(json);
		}
    });
    if (isIE) {
        event.cancelBubble = true;
    } else {
        evt.stopPropagation();
    }
}



