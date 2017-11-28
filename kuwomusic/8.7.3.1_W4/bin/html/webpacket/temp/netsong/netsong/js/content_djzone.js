var currentObj={};
var currentBread;
var zoneName;
var mJson = null;
var	currentBangId = 0;
var	currentBangName = "";
var psrc = '';
var bread = '';
var radioid = 0;
var status = '';
window.onload = function (){
	callClientNoReturn('domComplete');
	centerLoadingStart("content");
	var call = "GetRadioNowPlaying";
    var str = callClient(call);
	radioid = getValue(str,'radioid');
	status = getValue(str,'playstatus');  	
	//currentObj = fobj.goldjson;
	psrc = getStringKey(currentObj.other,'psrc');
	bread = getStringKey(currentObj.other,'bread');
	currentBread = currentObj.source +','+currentObj.sourceid +','+currentObj.name+','+currentObj.id;
	getSomeData();
	objBindFn();
	//ABLog("DJZONE","PV");
};

$(window).resize(function() {
	iframeObj.refresh();
});

// 进入专区
function getSomeData(){
	var url = 'http://album.kuwo.cn/album/dj2015new';
	$.ajax({
        url:url,
        dataType:'jsonp',
        crossDomain:false,
        jsonpCallback:"getZoneData",
		success:function(json){
			getZoneData(json);
		}
    });
	//getScriptData(url);
}
// 获取DJ专区数据
function getZoneData(jsondata){
	var data = jsondata;
	//console.info(data)
	var dataCont = data.data;
	var bangData = dataCont.djBang;
	var diantaiData = dataCont.radioMap;
	var singerData = dataCont.singerList;
	var tagsData = dataCont.tags;
	var mvData = dataCont.djMvs;
	var recList = dataCont.recList;
	zoneName = "DJ专区";
	var topBanner = dataCont.topBanner;
	if (topBanner) {
		var pic = topBanner.picUrl;
		var url = topBanner.oid;
		var name = topBanner.name;
		var typeName = topBanner.typeName;
		if (url && typeName == 'jxj') {
			$(".top_banner").show();
			$(".top_banner").html("<a href=\"###\" hidefocus=\"true\"><img src=\""+pic+"\" width=\"620\"/ onload=\"iframeObj.refresh();\"></a>");
			$(".top_banner").find("a").live("click",function(){
				commonClick(new Node(21, url, name, 0));
			});
		} else if (url && typeName == 'pic') {
			$(".top_banner").show();
			$(".top_banner").html("<a href=\"###\" hidefocus=\"true\"><img src=\""+pic+"\" width=\"620\"/ onload=\"iframeObj.refresh();\"></a>");
			$(".top_banner").find("a").live("click",function(){
				commonClick(new Node(17, url, name, 0));
			});
		} else if (url && typeName == 'topic') {
			$(".top_banner").show();
			$(".top_banner").html("<a href=\"###\" hidefocus=\"true\"><img src=\""+pic+"\" width=\"620\"/ onload=\"iframeObj.refresh();\"></a>");
			$(".top_banner").find("a").live("click",function(){
				commonClick(new Node(36, url, name, 0));
			});
		} else if (!url && typeName == 'pic'){
			$(".top_banner").show();
			$(".top_banner").html("<img src=\""+pic+"\" width=\"620\"/ onload=\"iframeObj.refresh();\">");
		}
		iframeObj.refresh();
	}
	var bottomBanner = dataCont.bottomBanner;
	if (bottomBanner) {
		var pic1 = bottomBanner.picUrl;
		var url1 = bottomBanner.oid;
		var name1 = bottomBanner.name;
		$(".bottom_banner").show();
		$(".bottom_banner").find("img").attr("src",pic1);
	}
	createBang(bangData);
	createDiantai(diantaiData);
	createDJArtist(singerData);
	createTagList(tagsData);
	createMVList(mvData);
	createRecList(recList);
	centerLoadingEnd("content");
}

function createBang(jsondata){
	var data = jsondata;
	var len = data.length;
	var bangTagObj = $(".bang_tab");
	var bangListObj = $(".bang_list");
	var bangTagArr = [];
	var bangListArr = [];
	var tagxia = 0;
	var listxia = 0;
	for (var i = 0; i < data.length; i++) {
		var obj = data[i];
		var tagName = obj.name;
		var listData = obj.child;
		var currentClass = '';
		if (i == 0) {
			currentClass = 'current';
		}
		currentBangName = tagName;
		bangTagArr[tagxia++] = '<a href="###" hidefocus class="';
		if(i==1){
			currentClass = 'mid';
		}
		bangTagArr[tagxia++] = currentClass;
		bangTagArr[tagxia++] = '">';
		bangTagArr[tagxia++] = checkSpecialChar(tagName,"disname");
		bangTagArr[tagxia++] = '</a>';
		var listStyle = '';
		if (i==0){

			listStyle = 'display:block;';
		}else{
			listStyle = 'display:none;';
		}
		bangListArr[listxia++] = '<div class="com_bang_list" c-id="list_' + i + '" style="'+listStyle+'" data-id="new">' + createBangList(listData) + '</div>';
	}
	var bangTagStr = bangTagArr.join('');
	var bangListStr = bangListArr.join('');
	bangTagObj.html(bangTagStr);
	bangListObj.html(bangListStr);
	/*数据加载完显示*/
	$(".max_content").show();
	bangTagArr = null;
	bangTagStr = null;
	bangListArr = null;
	bangListStr = null;
}
// 创建榜单列表
function createBangList(jsondata) {
	var data = jsondata;
	var len = data.length;
	var listArr = [];
	var xia = 0;
	var obj;
	var rid;			//歌曲ID
	var name;			//歌曲名
	var album;			//专辑名
	var artist;			//歌手名
	var params;
	var formats;
	var playMusicPsrc;
	var numStyle;
	var artistClick;
    var albumid;
    var artistid;
	for (var i = 0; i < len; i++) {
		obj = data[i];
		if(obj == null){
			//添加容错
			continue;
		}
		rid = obj.id;
		pid = obj.pid; 
		phbid = obj.phbid;
		name = obj.name;
		artist = obj.artist;
		album = obj.album;
		albumid = obj.albumid;
		artistid = obj.artistid;
		score100 = obj.score100;
		formats = obj.formats;
		param = obj.params;
        //console.info(obj)
		if (typeof(album) == "undefined") album = obj.malbum;
		if (!album || album == null) album = "";				
		if (typeof(pid) == "undefined") pid = '';
		if (typeof(phbid) == "undefined") phbid = '';
		if (param!="") {
			var paramArray;
			var childArray = [];
			var childi = 0;
			var lastArray = [];
			param = returnSpecialChar(param);
			paramArray = param.split(";");
			childArray[childi++] = encodeURIComponent(returnSpecialChar(name));
			childArray[childi++] = encodeURIComponent(returnSpecialChar(artist));
			childArray[childi++] = encodeURIComponent(returnSpecialChar(album));
			lastArray[lastArray.length] =   getMultiVerNum(obj);
			lastArray[lastArray.length] =   getPointNum(obj);
			lastArray[lastArray.length] =   getPayNum(obj);
			lastArray[lastArray.length] =   artistid;
			lastArray[lastArray.length] =   albumid;
			var strLastArray = lastArray.join("\t")
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
			playMusicPsrc = '曲库->' + psrc + zoneName + '->' + currentBangName;
			mvpsrc = '';
			musicmvstringarray = [];
			musicmvstringarray[0] = musicMVString;
			musicmvstringarray[1] = mvpsrc;
			musicmvstringarray[2] = formats;
			musicMVString = musicmvstringarray.join('\t');
			musicString = encodeURIComponent(musicString);
			musicMVString = encodeURIComponent(musicMVString);
		}
		params = getParams(musicString, formats, playMusicPsrc,strLastArray);
		level = '';
		tips = '';
		artistClick	= commonClickString(new Node(4, artistid, artist, 4));
		numStyle = '';
		if (i < 3) {
			numStyle = 'color:#0aafe6; font-size:20px;';
		}
		if (i%10 == 0 && i == 0) {
			listArr[xia++] = '<ul c-id="main_list">';
		} else if (i%10 == 0 && i > 0 && i < len - 1){
			listArr[xia++] = '</ul><ul c-id="main_list" style="margin-left:20px; display:inline-block;">';
		}
		listArr[xia++] = '<li c-id="list_l" data-music="';
		listArr[xia++] = params;
		listArr[xia++] = '" data-mdcode="';
		listArr[xia++] = formats;
		listArr[xia++] = '" data-musicId="';
		listArr[xia++] = rid;
		listArr[xia++] = '">';
		listArr[xia++] = '<span class="num" style="';
		listArr[xia++] = numStyle;
		listArr[xia++] = '">';
		listArr[xia++] = i+1;
		listArr[xia++] = '</span>';
		listArr[xia++] = '<div class="songname"><a href="###" hidefocus c-id="one" title="';
		listArr[xia++] = checkSpecialChar(name,'titlename');
		listArr[xia++] = '">';
		listArr[xia++] = checkSpecialChar(name,'disname');
		listArr[xia++] = '</a></div>';
		listArr[xia++] = '<div class="singer"><a href="###" hidefocus title="';
		listArr[xia++] = checkSpecialChar(artist,'titlename');
		listArr[xia++] = '" onclick="';
		listArr[xia++] = artistClick;
		listArr[xia++] = '">';
		listArr[xia++] = checkSpecialChar(artist,'disname');
		listArr[xia++] = '</a></div>';
		listArr[xia++] = '<div c-id="opt" class="opt">';
		listArr[xia++] = '<a href="###" hidefocus title="添加歌曲" class="icon_bg icon_two" c-id="two"></a>';
		listArr[xia++] = '<a href="###" hidefocus title="下载歌曲" class="icon_bg icon_four" c-id="four"></a>';
		listArr[xia++] = '</div></li>';
		if (i == len - 1){
			listArr[xia++] = '</ul>'
		}
	}
	return listArr.join('');
}

// 创建电台
function createDiantai(jsondata){
	var data = jsondata;
	var child = data.child;
	var len = child.length;
	var arr = [];
	for (var i = 0; i < len; i++ ) {
	try{
		arr[arr.length] = createRadioBlock (child[i], 'zone', 0);}catch(e){}
	}
	$(".diantai_list").html(arr.join(''));

	if (radioid) {
		initRadioStatus(parseInt(status,10),radioid);
	}	
}

// 创建DJ人
function createDJArtist(jsondata){
	var data = jsondata;
	var len = data.length;
	var arr = [];
	var obj;
	var pic;
	var source = 4;
	var sourceid;
	var name;
	var id = 0;
	var listen;
	var icon;
	var click;
	for (var i = 0; i < len; i++) {
		obj = data[i];
		sourceid = obj.sourceid;
		name = obj.name;
		titlename = checkSpecialChar(name,"titlename");
		disname = checkSpecialChar(name,"disname");
		if (obj.extend) {
			icon = getValue(obj.extend,'ICON');	
		} else {
			icon = '';
		}
		pic = getValue(obj.extend,'PIC2016') || obj.pic;
		listen = obj.listen;
		click = commonClickString(new Node(4,sourceid,name,0,"","psrc=分类->DJ专区->潮流DJ人->"));
		arr[arr.length] = '<li style="';
		if (i >= len - 4) {
			if(i==3){
				arr[arr.length] = 'margin:0;';
			}else{
				arr[arr.length] = 'margin-bottom:0px;';
			}
			
		}
		arr[arr.length] = '"><a href="###" hidefocus onclick="';
		arr[arr.length] = click;
		arr[arr.length] = '">';
		if (icon=='sole') {
			arr[arr.length] = '<span class="du"></span>';
		}
		arr[arr.length] = '<div class="pic"><img src="'
		arr[arr.length] = pic;
		arr[arr.length] = '" width="165"/></div><p class="name" title="';
		arr[arr.length] = titlename;
		arr[arr.length] = '">';
		arr[arr.length] = disname;
		arr[arr.length] = '</p><p class="info" title="';
		arr[arr.length] = listen;
		arr[arr.length] = '人在听">';
		arr[arr.length] = listen;
		arr[arr.length] = '人在听</p></a></li>';
	}
	$(".artist_list").html(arr.join('')).parent().show();
}

// 创建推荐歌单
function createRecList(jsondata){
	var data = jsondata;
	var len = data.length;
	var arr = [];
	var obj;
	var face;
	var userName;
	var name;
	var tagId;
	var tagDbId;	
	var pic;
	var flag;
	var listenCount;
	var flagStr;
	var type;	
	var click;
	var other;
	for (var i = 0; i < len; i++) {
		obj = data[i];
		face = obj.face;
		userName = obj.userName;
		name = obj.name;
		sourceid = 0;
		id = 0;				
		pic = obj.pic2016 || obj.pic;
		tagId = obj.tagId;
		type = obj.type;
		tagDbId = obj.tagDbId;
		flag = obj.flag;
		listenCount = obj.listenCount;
		other = '|psrc='+psrc+zoneName+'->|type='+type+'|tagDbId='+tagDbId+'|bread='+bread+';'+currentBread;
		click = commonClickString(new Node(-203,tagId,name,id,"",other));
		
		arr[arr.length] = '<li style="';
		if (i >= len - 4) {
			if(i==3){
				arr[arr.length] = 'margin:0;';
			}else{
				arr[arr.length] = 'margin-bottom:0px;';
			}
			
		}
		arr[arr.length] = '"><a href="###" hidefocus onclick="';
		arr[arr.length] = click;
		arr[arr.length] = '"><div class="pic"><div class="head"><div class="bg"></div><img src="';
		arr[arr.length] = face;
		arr[arr.length] = '" width="20" height="20px"/>'
		arr[arr.length] = userName;
		arr[arr.length] = '</div><img src="';
		arr[arr.length] = pic;
		arr[arr.length] = '" width="165"/></div><p class="name">';
		arr[arr.length] = name;
		arr[arr.length] = '</p><p class="info">';
		arr[arr.length] = listenCount;
		arr[arr.length] = '人在听</p></a></li>'
	}
	$(".gedan_list").html(arr.join('')).parent().show();
}

// 创建DJ分类
function createTagList(jsondata) {
	var data = jsondata;
	var len = data.length;
	var top4arr = [];
	var arr = [];
	var obj;
	var name;
	var tagId;
	var pic;
	var flag;
	var newCount;
	var flagStr;
	var listClass;
	var click;
	var num = 0;
	var type;
	var tagDbId;
	var listStyle;
	var index = 0;
	for (var i = 0; i < len; i++) {
		obj = data[i];
		num ++;
		name = obj.name;
		sourceid = currentBangId;
		id = sourceid;				
		pic = obj.pic2016 || obj.pic;
		tagId = obj.tagId;
		type = obj.type;
		tagDbId = obj.tagDbId;
		flag = obj.flag;
		newCount = obj.newCount;
		if (flag == 'new' || flag == 'hot'){
			newCount = '';
		}
		flagStr = '';
		listStyle = '';		
		var other = '|psrc='+psrc+zoneName+'->|type='+type+'|tagDbId='+tagDbId+'|bread='+bread+';'+currentBread;
		if (type == 'tagMv') {
			click = commonClickString(new Node(-204,tagId,name,id,"",other));
		} else if (type == 'jxj'){
			click = commonClickString(new Node(21,tagId,name,0));
		} else {
			click = commonClickString(new Node(-203,tagId,name,id,"",other));
		}
		if (i < 4){
			if (num % 4 == 0) {
				listStyle = 'margin-right:0;';
			}
			if (flag == 'new') {
				flagStr = '<span class="r_new"></span>';
			} else if (flag == 'hot') {
				flagStr = '<span class="r_hot"></span>';
			} else if (newCount) {
				flagStr = '<p class="r_num">+'+newCount+'</p>'
			}
			top4arr[top4arr.length] = '<li class="m1 guang_list" c-id="list_l" style="';
			top4arr[top4arr.length] = listStyle;
			top4arr[top4arr.length] = '">';
			top4arr[top4arr.length] = flagStr;
			top4arr[top4arr.length] = '<a href="###" hidefocus onclick="';
			top4arr[top4arr.length] = click;
			top4arr[top4arr.length] = '" title="';
			top4arr[top4arr.length] = checkSpecialChar(name,'titlename');
			top4arr[top4arr.length] = '"><span class="guang" style="width:242px; height:110px;"></span><img width="165" src="';
			top4arr[top4arr.length] = pic;
			top4arr[top4arr.length] = '"/></a></li>';
		} else {
			index ++;
			arr[arr.length] = '<span style="';
			if ((index)%5 == 0) {
				arr[arr.length] = 'background:none;'
			}
			arr[arr.length] = '"><a href="###" hidefocus onclick="';
			arr[arr.length] = click;
			arr[arr.length] = '" title="';
			arr[arr.length] = checkSpecialChar(name,'titlename');
			arr[arr.length] = '">';
			arr[arr.length] = checkSpecialChar(name,'disname');
			arr[arr.length] = '</a></span>';
		}
	}
	var bigstr = top4arr.join('') + '<div class="subtag">'+arr.join('')+'<div>'
	$(".class_list").html(bigstr).parent().show();
}

// 创建MV列表
function createMVList(jsondata){
	var data = jsondata;
	//console.info(data)
	var name = data.name;
	var child = data.child;
	var len = 8;
	var arr = [];
	var arrId = [];
	var pstr = psrc + zoneName + '->MV推荐';
	for (var i=0; i<len; i++) {
		arr[arr.length] = createMVBlock(child[i],'artist',i,pstr);
	}

	arrId[arrId.length] = child[i];

	$(".mv_list").html(arr.join('')).parent().show();
	$(".mv_wrap h1 font").html(name);
	iframeObj.refresh();
}
//获取PSRC
function getParams(params,formats,psrc,strLastArray) {
	psrcStr		  = psrc;
	decodeparams  = decodeURIComponent(params).replace(/;/g,'\t');		
	decodeparams  = decodeparams+'\t'+encodeURIComponent('VER=2013;FROM='+psrcStr)+'\t'+formats+'\t'+strLastArray;
	decodeparams  = encodeURIComponent(decodeparams);	//这个是它要的编号码的data-music
	return decodeparams;
}
function objBindFn() {
	// MV更多点击
	$(".moreMV").click(function(){
		var source = currentObj.source;
		var sourceid = currentObj.sourceid;
		var name = currentObj.name;
		var id = currentObj.id;
		var sourceid = currentBangId;
		var id = sourceid;
		var other = '|psrc='+psrc+zoneName+'->|type='+type+'|tagDbId='+tagDbId+'|bread='+bread+';'+currentBread;
		var mvname = $(this).parent().find("font").html();
		commonClick(new Node(-204, 0, mvname, 0, '' ,other));
	});	
	// 播放全部歌曲
	$("[c-id=allPlay]").live("click", function () {
		var index = $(".aob").attr("c-index");
		// 统计点击日志
		//ABLog("DJZONE","ALLPLAY:"+index);				
		var musicList = $("[c-id=list_" + index + "]").find("[c-id=list_l]");
		var size = musicList.size();
		var params = [];
		var htmlArray = [];
		var snum = 0;
		var musicString = '';
		musicList.each (function (i) {
			params = $(this).attr("data-music");
			if (!i) htmlArray[i] = 'n=' + size + '&s' + (i + 1) + "=" + params;
			if (i) htmlArray[i] = '&s' + (i + 1) + "=" + params;
		});
		musicString = htmlArray.join('');
		multipleMusicOption("Play", musicString);
		return false;
	});					
	// 添加全部歌曲
	$("[c-id=allAdd]").live("click", function () {
		var index = $(".aob").attr("c-index");
		//ABLog("DJZONE","ALLADD:"+index);
		var musicList = $("[c-id=list_" + index + "]").find("[c-id=list_l]");
		var size = musicList.size();
		var params = [];
		var htmlArray = [];
		var snum = 0;
		var musicString = '';
		musicList.each (function (i) {
			params = $(this).attr("data-music");
			if (!i) htmlArray[i] = 'n=' + size + '&s' + (i + 1) + "=" + params;
			if (i) htmlArray[i] = '&s' + (i + 1) + "=" + params;
		});
		musicString = htmlArray.join('');
		multipleMusicOption("Add", musicString);
		return false;
	});			
	// 播放歌曲
	$("[c-id=one]").live("click",function(){
		var playMusicString = $(this).parents("[c-id=list_l]").attr("data-music");
		singleMusicOption("Play", playMusicString);
		return false;
	});		
	// 添加歌曲
	$("[c-id=two]").live("click",function(){
		var playMusicString = $(this).parents("[c-id=list_l]").attr("data-music");
        var playindex = 0;
        if(playMusicString){
            playindex++;
            var playMusicStr = "n="+playindex+"&s"+playindex+"="+playMusicString;
            multipleMusicOption("AddTo",playMusicStr);
        }
		return false;
	});			
	// 下载歌曲
	$("[c-id=four]").live("click",function(){
		var playMusicString = $(this).parents("[c-id=list_l]").attr("data-music");
		singleMusicOption("Down", playMusicString);
		return false;
	});	
	// 所有列表hover效果
	$("[c-id=list_l]").live("mouseenter",function(){
		$(this).addClass("current").siblings().removeClass("current");;
		return false;
	});
	// 所有列表hover离开效果
	$("[c-id=list_l]").live("mouseleave",function(){
		$(this).removeClass("current");
		return false;
	});
	
	$(".guang_list").live("mouseenter",function(){
		$(".guang").stop().css({left:-220});
		$(this).find(".guang").stop().animate({left:140},500);
		return false;
	});
	
	// 榜单tab切换效果
	$(".bang_tab a").live("click", function(){
		$(this).addClass("current").siblings().removeClass("current");
		var index = $(this).index();
		// 统计点击日志
		currentBangId = index;
		currentBangName = $(this).html();
		var w = $(this).width();
		$(".com_bang_list").hide();
		$("[c-id=list_"+index+"]").show();
		$(".aob").attr("c-index",index);
		$(".move").stop().animate({left:w*index + "px"});
		return false;
	});
	
	// 查看更多排行榜歌单点击
	$(".hot_wrap .more").click(function(){
		var index = $(".aob").attr("c-index");
		// 统计点击日志
		//ABLog("DJZONE","ALLMORE:"+index);
		var source = currentObj.source;
		var sourceid = currentObj.sourceid;
		var name = currentObj.name;
		var id = currentObj.id; 
		var sourceid = currentBangId;
		var id = sourceid;
		var other = '|psrc='+psrc+zoneName+'->|type=bangdan|tagDbId=|bread='+bread+';'+currentBread;	
		commonClick(new Node(-203, sourceid, currentBangName, id, '' ,other));
	});
	
	
	$(".ding_content a").live("click",function(){
		if (!$(this).prev().attr("checked")) {
			$(this).prev().attr("checked",true);
			$(this).css("color","#ff4baa");
		} else {
			$(this).prev().attr("checked",false);
			$(this).css("color","#fff");
		}
		var index = $(".ding_pop input:checkbox:checked").size();
		$(".ding_pop .tips").html('已选'+ index +'项');		
		return false;
	});
	
	$(".ding_pop input").live("click",function(){
		if (!$(this).attr("checked")) {
			$(this).next().css("color","#fff");
		} else {
			$(this).next().css("color","#ff4baa");
		}
		var index = $(".ding_pop input:checkbox:checked").size();
		$(".ding_pop .tips").html('已选'+ index +'项');
	});	
	
	$(".diantai .btn").live("click",function(){
		if ($(this).html() == '确定'){
			var kid = getUserID("devid");
			var uid = getUserID("uid");
			var login = 0;
			if (!uid || uid == '0') {
				uid = 0;
			} else {
				login = 1;
			}			
			var arr = [];
			$(".ding_pop input:checkbox:checked").each(function(){
				arr.push($(this).parent().attr("data-id"));
			});
			
			if (arr.length < 1) {
				$(".ding_pop .tips").html('还没有定制内容呦~');
			} else {
				//ABLog("DJZONE","ARR:"+arr.join(','));
				var url = 'http://gxh2.kuwo.cn/newradio.nr?type=21&uid='+uid+'&login='+login+'&kid='+kid+'&cmd=set&ml_list=' + arr.join(',') + '&t='+Math.random();
				$.ajax({
					url:url,
					dataType:"text",
					type:"get",
					crossDomain:false,
					success:function(udata){
						$(".ding_pop").hide();
						eval($(".diantai_list .br_wrap").eq(0).find(".br_pic").attr("_onclick"));
					}
				});
			}
		} else {
			$(".ding_pop").hide();
		};
		return false;
	});
	
	$(".ding").live("click",function(){
		//ABLog("DJZONE","DING");
		if ($(".ding_pop").isShow()) {
			$(".ding_pop").hide();
		} else {
			var kid = getUserID("devid");
			var uid = getUserID("uid");
			var login = 0;
			if (!uid || uid == '0') {
				uid = 0;
			} else {
				login = 1;
			}
			$(".ding_pop input").attr("checked",false).next().css("color","#fff");
			$.ajax({
				url:"http://gxh2.kuwo.cn/newradio.nr?type=21&uid="+uid+"&login="+login+"&kid="+kid+"&cmd=get&t="+Math.random(),
				dataType:"text",
				type:"get",
				crossDomain:false,
				success:function(udata){
					var str = udata.replace("success\n","");
					str = $.trim(str);
					if (str == '') {
						$(".ding_pop input").attr("checked",true).next().css("color","#ff4baa");
						$(".ding_pop .tips").html('已选'+ $(".ding_pop input").size()+'项');
					} else {
						var arr = str.split(',');
						for (var i=0; i<arr.length; i++) {
							var num = $.trim(arr[i]);
							$(".ding_content span").each(function(){
								if ($(this).attr("data-id") == num) {
									$(this).find("input").attr("checked",true).next().css("color","#ff4baa");
								};
							});
							
						}
						$(".ding_pop .tips").html('已选'+ arr.length +'项');
					};
					$(".ding_pop").show();
				}
			});
		}
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
			stopicon = '<i title="暂停播放" onclick="" class="radio_pause"></i>';
			$(this).find(".radio_pause").remove();
			$(this).find(".radio_play").remove();
		} else if (status == 2)	{
			click = 'continueRadio(arguments[0],\''+id+'\',true);';
			stopicon = '<i title="继续播放" onclick="" class="radio_start"></i>';
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
			$(this).find(".radio_play").remove();
			$(this).find(".i_play").hide();
			$(this).append(stopicon);
		} else if (status == 2)	{
			var playicons = '<i class="radio_stop"></i>';
			$(this).find(".radio_stop").remove();
			$(this).find(".i_play").hide();
			$(this).append(playicons);
		}
		return false;
	});

	//歌手歌曲的hover效果
	// $('.hot_wrap .bang .bang_list ul li div').live('mouseenter mouseleave',function(ev){
	// 	if(ev.type=='mouseenter'){
	// 		$(this).addClass('active');
	// 		console.log($(this).attr('class'));
	// 	}else{
	// 		$(this).removeClass('active');
	// 		console.log($(this).attr('class'));
	// 	}
	// });
}

function cLogin() {
	$(".ding_pop").hide();
}
// 客户端登录后退出 回调
function cLogout() {
	$(".ding_pop").hide();
}

