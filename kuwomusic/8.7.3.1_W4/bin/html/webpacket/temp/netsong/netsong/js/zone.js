var zoneObj;
var currObj;
var currentTagId;
var jxjClick;
var mJson = null;
var zoneNavId = "";
var fromZone;
var currentObj;
var bigbread = "";
var bigname = "";
var pn = 0;

window.onload = function(){
    centerLoadingStart("content");
	var json = fobj.goldjson;
	currentObj = json;
	pn = getStringKey(currentObj.other,'pn') || 0;
	if(currentObj.sourceid==78664){
	    bigname = "网络专区";
	}else if(currentObj.sourceid==79144){
	    bigname = "经典专区";
	}else if(currentObj.sourceid==78312){
	    bigname = "儿歌专区";
	}else if(currentObj.sourceid==78879){
	    bigname = "影视专区";   
	}else if(currentObj.sourceid==78521){
	    bigname = "韩国专区";    
	}
	bigbread = "29,"+currentObj.sourceid+","+bigname+","+currentObj.sourceid;
	zoneObj = $(".zone_con");
	currObj = zoneObj;
	zoneNavId = getStringKey(currentObj.other,'zoneNavId');
    if(zoneNavId!=""&&currentObj.sourceid!=""){
        zoneNavId = currentObj.sourceid;
    }
	fromZone = getStringKey(currentObj.other,'fromZone');

	currObj.find(".navlink").live("mouseover",function(){
		currObj.find('.nav .list').hide();
		$(this).next().show();
	});

	currObj.find(".list").live("mouseleave",function(){
		$(this).hide();
	});

	currObj.find(".list").live("mouseenter",function(){
		clearTimeout(navTimer);
	});

	currObj.find(".nav").live("mouseleave",function(){
		navTimer = setTimeout(function (){
			currObj.find('.nav .list').hide();
		},50);
	});

	$(".zone_gray_btn").live("click",function(){
		eval(jxjClick);
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
		var other = '|pn='+pn;
		fobj.commonClick(new Node(currentObj.source,currentObj.sourceid,currentObj.name,currentObj.id,currentObj.extend,other));
	});	
	
	try{
	someZone(json);
	}catch(e){}

};
function changeScroll(){}

/*
 *
 *  fobj.zoneNavId 当前专区 ID
 *
 *   29 专区 source
 *
 *  -28 专区形式
 *
 *  -29 列表形式
 *
 *  -30 歌单、专辑、歌手 块块形式
 *
 */

var userInfo = getVersion()+"&uid="+getUserID("uid")+"&kid="+getUserID("devid");
var zoneBreadInfoArr = [];		// 存面包屑数据
var zoneNavIndex = 0;			// 当前专区ID，创建导航时对应选中
var zoneGedanRn = 100;			// 歌单块块下拉加载个数
var zoneMvRn = 80;				// MV下拉加载个数
var zoneMusicRn = 100;			// 歌曲下拉加载个数
var zoneGedanId = 0;			// 存分类 ID，下载加载请求歌单
var zoneMusicId = 0;      		// 歌单 ID，下拉加载请求歌曲列表
var isFirstZone = false;		// 首次进入需要请求 child 数据
var zoneName = '';				// 专区名称 PSRC
var focusDataArr = [];			// 焦点图数据
var focusDataNewArr = [];			// 焦点图数据(新)
var taglength = 0;				// 分类个数
var zoneCurrNodeObj = null;		// 当前node对象


// 进入专区
function someZone(nodeobj){
	zoneFun.zoneFormat();
	setComfun(nodeobj);
}


// 通用方法，创建导航
function setComfun(nodeobj,num){
	var sourceid = parseInt(nodeobj.sourceid,10);
	var source = parseInt(nodeobj.source,10);
	var id = parseInt(nodeobj.id,10);
	if(!zoneNavId) zoneNavId = sourceid;
	// 如果首次进入请求歌曲列表
	if(source==29){
		isFirstZone = true;
		zoneNavIndex = 0;
	}else{
		isFirstZone=false;
		zoneCurrNodeObj = nodeobj;
		zoneNavIndex = id;
	}

	// 请求导航和歌单歌曲数据
	mJson = {
		op       :   'query',
		cont     :   'tree',
		node     :   zoneNavId,
		level    :   4,
		maxchd   :   50,
		fmt      :   'json',
		kset     :   'mbox',
		callback :   'getZoneData',
		version  :   userInfo
	}
	var url = 'http://qukudata.kuwo.cn/q.k?'+ zoneFun.json2url(mJson);
	getScriptData(url);
}


//获取专区导航数据
function getZoneData(jsondata){
    try{
	zoneName = jsondata.disname;
	var data = jsondata;
	var children = data.child;
	if(!children){
		return;
	}
	if(!zoneNavId&&data.id){
	    zoneNavId = data.id;
	}
	var zoneType =  parseInt(children[0].child[0].source,10);
	var navstr = createNav(data);
	currObj.find(".nav").html(navstr);
	currObj.find(".nav").show();
	// zoneType child 类型
	if(isFirstZone && zoneType==8){
		mJson = {
			op       :   'query',
			cont     :   'tree',
			node     :   children[0].id,
			level    :   3,
			maxchd   :   30,
			fmt      :   'json',
			kset     :   'mbox',
			callback :   'getZoneMMList',
			version  :   userInfo
		}
		var url = 'http://qukudata.kuwo.cn/q.k?'+ zoneFun.json2url(mJson);
		getScriptData(url);
	}else if(isFirstZone && zoneType==5){
		zoneBreadInfoArr[2] = data.child[0].disname;
		zoneBreadInfoArr[3] = data.child[0].id;
		var dataChild = children[0].child;
		var len = dataChild.length;
		zonenavname = zoneBreadInfoArr[2];
		set_CNL(dataChild,len);

	}else if(!isFirstZone){
		var nodeobj = zoneCurrNodeObj;
		var sourceid  = nodeobj.sourceid;
		var sourceNum = parseInt(nodeobj.source,10);
		mJson = {
			op       :   'query',
			node     :   nodeobj.id,
			fmt      :   'json',
			kset     :   'mbox'
		};
		if(sourceNum == -28){
			mJson.cont = 'tree';
			mJson.level = 4;
			mJson.maxchd = zoneGedanRn;
			mJson.callback = 'getZoneGedan';

		}else if(sourceNum==-29){
			mJson.cont = 'tree';
			mJson.level = 3;
			mJson.maxchd = zoneGedanRn;
			mJson.callback = 'getZoneMMList';

		}else if(sourceNum==-30){
			mJson.cont = 'ninfo';
			mJson.pn = pn;
			mJson.rn = zoneGedanRn;
			mJson.callback = 'getOldGedan';
			zoneGedanId = sourceid;

		}else{
			return;
		}
		var url = 'http://qukudata.kuwo.cn/q.k?'+ zoneFun.json2url(mJson);
		getScriptData(url);
	}
	}catch(e){}
}


//创建导航标签
function createNav(data){
	var data = data;
	var childlist = data.child;
	var len = childlist.length;
	var arr = [];
	var n = 0;

	try{
		for(var i=0; i<len; i++){
			var obj = childlist[i];
			var source = obj.source;
			var zoneType = obj.child[0].source;
			var id = obj.id;
			var sourceid = zoneNavId;
			var name = obj.disname;
			var ChildLen = obj.child.length;
			var other = "|zoneNavId="+zoneNavId+"|fromZone="+fromZone;
			if(i==0) zoneBreadInfoArr[0] = zoneName; zoneBreadInfoArr[1] = sourceid;
			if(ChildLen==1 && zoneType!=5){
				source = -29;
			}else if(ChildLen>1 && (zoneType==4||zoneType==8||zoneType==12||zoneType==13||zoneType==14||zoneType==21)){
				source = -30;
			}else if(ChildLen>1 && zoneType==5){
				source = -28;
			}else{
				continue;
			}
			var click = commonClickString(new Node(source,sourceid,name,id,'',other));
			if(i==0){
				arr[n++] = '<h1><a href="###" hidefocus onclick="'+click+'">'+name+'</a></h1><p>'
			}else{
				arr[n++] = '<a hidefocus href="###" onclick="';
				arr[n++] = click;
				if(zoneNavIndex==id) arr[n++] = '" class="def';
				arr[n++] = '">';
				arr[n++] = name;
				if(i==len-1) arr[n++] = '</a></p>';
				if(i<len-1) arr[n++] = '</a><em class="zoneNavline"></em>';
			}
		}
	}catch(e){
		
	}
	return arr.join('');
}


//请求多个分类内容
function getZoneGedan(jsondata){
	var data = jsondata;
	var childs = data.child;
	var len = childs.length;
	zoneBreadInfoArr[2] = data.disname;
	zonenavname = data.disname;
	zoneBreadInfoArr[3] = data.id;
	set_CNL(childs,len);
}


//拼新分类 多块数据（……）
function set_CNL(dataChild,len){
	var lot_somebox = [];
	// 非焦点图数据创建容器
	for(var i=0; i<len; i++){
		if(dataChild[i].source!=5 && dataChild[i].source!=6) continue;
		if(dataChild[i].source==5){
			lot_somebox[i] = '<div class="lot_box" id="zoneSomeDiv'+dataChild[i].id+'"></div>';
		}
		if(dataChild[i].source==6){
			lot_somebox[i] = '<div class="lot_box_mv" id="zoneSomeDiv'+dataChild[i].id+'"></div>';
		}
		taglength++;
	}
	currObj.find("#zoneGedan").html(lot_somebox.join(''));
	for(var i=0; i<len; i++){
		if(dataChild[i].source==34) focusDataArr.push(dataChild[i]);
		if(dataChild[i].source==31) focusDataNewArr.push(dataChild[i]);
		if(dataChild[i].source==30) getLyData(dataChild[i]);
		if(dataChild[i].source==6 || dataChild[i].source==5) showZoneGedan(dataChild[i]);
	}
	if(focusDataNewArr.length > 1){
		setNewFocusImg(focusDataNewArr);
	}else if(focusDataArr.length > 1){
		setFocusImg(focusDataArr);
	};

	// 请求精选集页面
	function getLyData(someObj){return;
		var sourceid = 'http://album.kuwo.cn/album/h/mbox?id='+someObj.sourceid;
		var name = someObj.name;
		var id = someObj.id;
		var oDate = new Date();
		var random = oDate.getDay()+''+oDate.getHours();
		jxjClick = commonClickString(new Node(21,sourceid,name,id));

		$$.ajax({
			url:'http://album.kuwo.cn/album/mini/jsp/huodong/zonely.jsp?id='+someObj.sourceid+'&'+random,
			dataType:"text",
			crossDomain:false,
			success:function(httptext,textStatus){
				if(textStatus=="success"){
					$("#zonely").html(httptext);
					iframeObj.refresh();
				}
			},
			error:function(xhr){
				webLog("zoneJxjError:"+ "http://album.kuwo.cn/album/mini/jsp/huodong/zonely.jsp?id="+someObj.sourceid+"&"+random);
			}
		});
	}
}

var zonenavname = "";
//请求专区歌曲列表
function getZoneMMList(jsondata){
    zonenavname = jsondata.disname;
	var musiclist = jsondata.child;
	if(musiclist=='' || musiclist==null || musiclist=='undefined'){
		musiclist = jsondata;
	}else{
		musiclist = musiclist[0];
	}
	var musicid = musiclist.sourceid;
	zoneMusicId = musicid;
	var source = musiclist.source;
	var url = '';
	mJson = {
		op       :   'getlistinfo',
		pid 	 :   musicid,
		pn       :   pn,
		encode   :   'utf-8',
		fmt      :   'json',
		identity :   'kuwo'
	}
	if(source==8 || source==12){
		mJson.rn = zoneMusicRn;
		mJson.callback = 'getZoneMusic';
		mJson.keyset = 'pl2012';
		url = 'http://nplserver.kuwo.cn/pl.svc?'+ zoneFun.json2url(mJson);

	}else if(source==14){
		zoneGedanId = musicid;
		mJson.rn = zoneMvRn;
		mJson.keyset = 'mvpl';
		mJson.callback = 'getZoneMVGeDan';
		url = 'http://nplserver.kuwo.cn/pl.svc?'+ zoneFun.json2url(mJson);

	}else{
		$("#bigGedanLei").html("暂无歌曲");
		$("#bigGedanLei").show();
		centerLoadingEnd("content");
	}
	getScriptData(getChargeURL(url));
}

//加载专区歌曲列表
function getZoneMusic(jsondata){
	var data = jsondata;
	var total =  parseInt(data.total);
	var musicList = data.musiclist;
	var breadname = data.title;
	var	totalpage = total%zoneMusicRn;
	var total = data.total;
	var currentPn = parseInt(data.pn,10);
	var totalPage = Math.ceil(total/zoneMusicRn);
	var bigStr = "";
	var musicarray = [];
	var psrc = "首页->"+bigname+"->"+zonenavname+"->"+data.title;
	for (var i = 0,j = musicList.length; i < j; i++) {
	    musicarray[musicarray.length] = createGedanMusicList(musicList[i],i,zoneMusicRn,currentPn,psrc);
	}
	var pageStr = createPage(totalPage, currentPn+1);
	if (pageStr) $(".page").html(pageStr).show();
	bigStr = musicarray.join("");
	currObj.find(".checkall font").html("共"+total+"首");
	currObj.find(".kw_music_list").html(bigStr);
	currObj.find(".con_right").show();
	centerLoadingEnd("content");
	iframeObj.refresh();
}

$(window).resize(function() {
	iframeObj.refresh();
});

//加载专区MV歌单
function getZoneMVGeDan(jsondata){
	var data = jsondata;
	var total = parseInt(data.total,10);
	var currentPn = parseInt(data.pn,10);
	var totalPage = Math.ceil(total/zoneMvRn);
	var pageStr = createPage(totalPage, currentPn+1);	
	var bigStr = someMvGedanStr(jsondata);
	$("#zoneMVGedan .likelist2").html(bigStr);
	if (pageStr) $(".page").html(pageStr).show();
	$("#zoneMVGedan").show();
	centerLoadingEnd("content");
	iframeObj.refresh();
}

//原有歌单块块
function getOldGedan(jsondata){
	var data = jsondata;
	var categoryString = "";
	var total = parseInt(data.total);
	var currentPn = parseInt(data.pn,10);
	var totalPage = Math.ceil(total/zoneGedanRn);
	var pageStr = createPage(totalPage, currentPn+1);
	zoneBreadInfoArr[2] = data.ninfo.disname;
	zoneBreadInfoArr[3] = data.ninfo.id;
	var psrcname = zoneName+"->"+zoneBreadInfoArr[2]+"->";
	categoryString = createGedanKuai(data,-30,psrcname);
	currObj.find("#bigGedanLei").html(categoryString);
	currObj.find("#bigGedanLei").show();
	if (pageStr) $(".page").html(pageStr).show();
	centerLoadingEnd("content");
	iframeObj.refresh();
}


//新分类歌单
var tagcallback = 0;
function showZoneGedan(jsondata){
	var bigStr;
	var name;
	var id;
	var data = jsondata;
	if(data.ninfo){
		name = data.ninfo.disname;
		id = data.ninfo.id;
	}else if(data.disname){
		name = data.disname;
		id = data.id;
	}else{
		name = '热门推荐';
	}
	var psrcname = bigname+"->"+zoneName+"->"+name+"->";
	var categoryString = createGedanKuai(data,'-28',psrcname);
	if(categoryString!=''){
		bigStr = '<div class="fenleiCategory"><h4>'+name+'</h4>'+ categoryString+'</div>';
	}else{
		bigStr = '';
	}
	tagcallback++;
	if(bigStr!=''){
		$("#zoneSomeDiv"+id).html(bigStr);
		$("#zoneSomeDiv"+id).show();
	}
	if(tagcallback==taglength){
		currObj.find("#zoneGedan").show();
		currObj.find("#zonely").show();
	}
	centerLoadingEnd("content");
	iframeObj.refresh();
}


//创建歌单列表
function createGedanKuai(data,type,psrcname){
	var childOO = data.child;
	var childOOSize = childOO.length;
	if(!childOOSize) return '';
	var htmlArray = [];
	var ran = parseInt(1000000*Math.random(),10);
	var someObj;
	var info;
	var click;
	var source;
	var jiaobiao;
	var sourceid;
	var issame;
	var disname;
	var titlename;
	var name;
	var id;
	var pic;
	var disname;
	var listen;
	var like;
	var tips;
	var htmlchildarray;
	var xia;
	var haslike;
	var pos;
	var divclass;
	var clickLogString;
	var extend;
	var intro;
	var Len9 = false;
	var len = 0;
	var isf = 0;
	
	for(var i=0;i<childOOSize;i++){
		someObj = childOO[i];
		issame = "";
		source = someObj.source;
		info = someObj.info;
		extend = someObj.extend;
		intro = someObj.intro;
		if(info=="" || !info) info = "";
		if(info=="0首歌曲") continue;
		if(info==""&&(source==4||source==8||source==12||source==13)) someObj.info = "10首歌曲";
		if(source==7 || source==8 || source==12 || source==14){
			issame = ''+sourceid;
		}else{
			issame = ''+source+someObj.id;
		}
		pic = someObj.pic;
		var pic1 = '';
		if(extend!='' && isf == 0){
			if(source==8 || source==12|| source==21){
				pic1 = zoneFun.findValue('LONGPIC=',extend,'|');
				isf ++;
			}
		}
		if(pic1!=''){
			pic = pic1;
			Len9 = true;
		}
		if(source!=12 && source!=8){
		    if(source==7){
				var psrc = encodeURIComponent('VER=2013;FROM=曲库->专区->'+zoneName);
			    sourceid = someObj.sourceid+"\t"+psrc;
			    sourceid = encodeURIComponent(sourceid);
		    }
			click = commonClickString(new Node(source,sourceid,name,id));
		}else{
		    var gedanId = 0;
		    if(data.ninfo){
				gedanId = data.ninfo.id;
		    }else{
				gedanId = data.id;
		    }
		    var other = "|zoneNavId="+zoneNavId+"|fromZone="+fromZone+"|gedanId="+gedanId+"|bread="+zoneBreadInfoArr+"|typenum="+type;
			click = commonClickString(new Node(-104,sourceid,name,id,'',other));
		}
		htmlchildarray = [];
		xia = 0;
		if((source==8||source==12) && (type==-28||type==-30)){
		    var someobject = {};
		    someobject.psrc = "首页->"+psrcname;
		    someobject.bread = "-2,5,分类,-2;"+bigbread+";"+currentObj.source+","+currentObj.sourceid+","+currentObj.name+","+currentObj.id+"";
		    someobject.zoneNavId = zoneNavId;
			htmlchildarray[xia++] = createPlaylistBlock(someObj,"zone",false,someobject);
		}else if(source==13){
			htmlchildarray[xia++] = createAlbumBlock(someObj,"zone");
		}else if(source==7){
		    var psrc = psrcname;
		    psrc = psrc.substring(0,psrc.lastIndexOf("->"));
		    htmlchildarray[xia++] = createMVBlock(someObj,"zone",false,"首页->"+psrc);
		}else if(source==4){
		    htmlchildarray[xia++] = createArtistBlock(someObj,"zone");
		}	
		htmlArray[len ++] = htmlchildarray.join('');
	}
	if(type==-28 && Len9) htmlArray.length = 10;
	return htmlArray.join('');
}


//拼MV歌单字符串
function someMvGedanStr(jsondata){
	var data = jsondata;
	var pid = data.id;
	var musicList = data.musiclist;
	var musicSize = musicList.length;
	var bigStr = "";
	var htmlArray = [];
	var someObj;
	var picUrl;
	var param;
	var artistid;
	var mvString;
	var paramArray;
	var childarray;
	var name;
	var artist;
	var album;
	var mvridnum;
	var musicridnum;
	var psrc;
	var mvName;
	var htmlchildarray;
	var xia;
	var showartist;
	var formats;
	var researr =[];
	var ii = 0;
	var	simlinkarr = [];
	var nn = 0;
	var researr =[];
	var breadname = data.title;

	for ( var i = 0; i < musicSize; i++) {
		someObj = musicList[i];
		picUrl = someObj.mvpic;
		if(typeof(picUrl)=="undefined"||picUrl == ""){
			picUrl = mv_default_img;
		}else if(picUrl.indexOf("http")>-1){
			picUrl = changeImgDomain(picUrl);
		}else{
			picUrl = getMVPrefix(picUrl)+picUrl;
		}
		picUrl = picUrl.replace("/120/","/160/");
		param = someObj.params;
		artistid = someObj.artistid;
		formats = someObj.formats;
		mvString = "";
		if(param!=""){
			param = returnSpecialChar(param);
			paramArray = param.split(";");
			childarray = [];
			name = paramArray[0];
			childarray[0] = encodeURIComponent(returnSpecialChar(name));
			artist = paramArray[1];
			childarray[1] = encodeURIComponent(returnSpecialChar(artist));
			album = paramArray[2];
			childarray[2] = encodeURIComponent(returnSpecialChar(album));
			for(var j=3;j<paramArray.length;j++){
				childarray[j] = paramArray[j];
			}
			mvString = childarray.join('\t');
			childarray = null;
			mvridnum = paramArray[11];
			if(mvridnum.length<5) {
			    //continue;
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
			//psrc = getMVPSRC(artistid,0,pid,mvridnum,musicridnum,0);
			if(fromZone){
				psrc = encodeURIComponent('VER=2013;FROM=曲库->首页->专区->'+zoneName);
			}else{
				psrc = encodeURIComponent('VER=2013;FROM=曲库->专区->'+zoneName);
			}
			mvString = mvString + "\t" + psrc+"\t"+formats+"\t"+getMultiVerNum(someObj);
			mvString = encodeURIComponent(mvString);
			mvString = checkSpecialChar(mvString,"name");
		}
		mvName = someObj.name;
		htmlchildarray = [];
		xia = 0;
		htmlchildarray[xia++] = createMVBlock(someObj,'MVGedan',false,"首页->"+bigname+"->"+zonenavname);
		htmlArray[i] = htmlchildarray.join('');
	}
	return bigStr = htmlArray.join('');
}


//专区焦点图
function starMoveFocus(obj){
	var zoneTimer = null;
	var aImgs = obj.find("ul li");
	var oBtn = obj.find(".zoneFocus_btn a");
	var oNext = obj.find("#zoneNext");
	var oPre = obj.find("#zonePre");
	var now = 0;
	var zIndex = 2;

	oBtn.live("mouseenter",function(){
		clearInterval(zoneTimer);
		now = $(this).index();
		tab();
		return false;
	});

	obj.live("mouseover",function(){
		oNext.show();
		oPre.show();
		clearInterval(zoneTimer);
		return false;
	});

	obj.live("mouseleave",function(){
		oNext.hide();
		oPre.hide();
		zoneTimer = setInterval(next,5000);
		return false;
	});

	oNext.live("click",next);
	oPre.live("click",prev);

	function next(){
		now++;
		if(now > aImgs.size()-1) now = 0;
		tab();
	}
	function prev(){
		now--;
		if(now < 0) now = aImgs.size()-1;
		tab();
	}
	function tab(num){
		oBtn.removeClass("focusbtnnow");
		oBtn.eq(now).addClass("focusbtnnow");
		zIndex++;
		aImgs.eq(now).attr("style","z-index:"+zIndex);
		aImgs.eq(now).hide();
		aImgs.eq(now).fadeIn();
	}
	zoneTimer = setInterval(next,5000);
}


//创建焦点图
function setFocusImg(jsondata){
	var data = jsondata;
	var len = data.length;
	var focusImgArr = [];
	var focusBtnArr = [];
	var nn = 0;
	var jj = 0;

	for(var i=0; i<len; i++){
		var obj = data[i];
		var imgUrl = obj.pic;
		var source = obj.source;
		var sourceid = obj.sourceid;
		if(source==7) sourceid = encodeURIComponent(sourceid);
		var nodeid =  obj.id;
		var name = obj.name;
		var disname = obj.disname;
		var titlename = disname;
		var name = checkSpecialChar(name,"name");
		var disname = checkSpecialChar(disname,"disname");
		var titlename = checkSpecialChar(titlename,"titlename");
	    //var other = "|zoneNavId="+zoneNavId+"|fromZone="+fromZone+"|gedanId="+nodeid+"|bread="+zoneBreadInfoArr+"|typenum=-28";
	    var other = "|bread=-2,5,分类,-2;"+bigbread+";"+currentObj.source+","+currentObj.sourceid+","+currentObj.name+","+currentObj.id+"|psrc=首页->"+bigname+"->"+zonenavname+"->焦点图->";
		//bread 信息存入缓存
		if(i==0){
			focusImgArr[nn++] = '<li style="z-index:2"><a href="###" hidefocus title="'
		}else{
			focusImgArr[nn++] = '<li style="z-index:1"><a href="###" hidefocus title="'
		}
		focusImgArr[nn++] = titlename;
		focusImgArr[nn++] = '" onclick="';
		if(source==34){
			focusImgArr[nn++] = commonClickString(new Node(8,sourceid,name,nodeid,'',other));
		}else if(source==7){
			focusImgArr[nn++] = commonClickString(new Node(source,sourceid,name,nodeid));
		}
		focusImgArr[nn++] = '"><img onerror="imgOnError(this);" width="630" src="';
		focusImgArr[nn++] = imgUrl;
		focusImgArr[nn++] = '" /></a></li>';
		if(i==0){
			focusBtnArr[jj++] = '<a href="###" hidefocus class="focusbtnnow" title="';
		}else{
			focusBtnArr[jj++] = '<a href="###" hidefocus title="';
		}
		focusBtnArr[jj++] = titlename;
		focusBtnArr[jj++] = '"></a>';
	}

	var focusImgStr = focusImgArr.join('');
	var focusBtnStr = '<div class="zoneFocus_btn">'+focusBtnArr.join('')+'</div>';

	$("#zoneFocusWarp .zoneFocusImg ul").html(focusImgStr);
	$("#zoneFocusWarp .zoneFocusImg ul").append(focusBtnStr)

	var oWarp = $("#zoneFocusWarp");
	starMoveFocus(oWarp);
	currObj.find("#zoneFocusWarp").show();
	iframeObj.refresh();
}



//创建焦点图 多类型
function setNewFocusImg(jsondata){
	var data = jsondata;
	var len = data.length;
	var focusImgArr = [];
	var focusBtnArr = [];
	var nn = 0;
	var jj = 0;

	for(var i=0; i<len; i++){
		var obj = data[i];
		var imgUrl = obj.pic;
		var source = zoneFun.findValue('JDTSOURCE=',obj.extend,'|');
		var sourceid = obj.sourceid;
		if(source==7){
			var psrc = encodeURIComponent('VER=2015;FROM=曲库->专区->'+zoneName);
		    sourceid = sourceid+"\t"+psrc;
		    sourceid = encodeURIComponent(sourceid);
	    }
		var nodeid =  obj.id;
		var name = obj.name;
		var disname = obj.disname;
		var titlename = disname;
		var name = checkSpecialChar(name,"name");
		var disname = checkSpecialChar(disname,"disname");
		var titlename = checkSpecialChar(titlename,"titlename");
	    //var other = "|zoneNavId="+zoneNavId+"|fromZone="+fromZone+"|gedanId="+nodeid+"|bread="+zoneBreadInfoArr+"|typenum=-28";
		var other = "|bread=-2,5,分类,-2;"+bigbread+";"+currentObj.source+","+currentObj.sourceid+","+currentObj.name+","+currentObj.id+"|psrc=首页->"+bigname+"->"+zonenavname+"->焦点图->";
		//bread 信息存入缓存
		if(i==0){
			focusImgArr[nn++] = '<li style="z-index:2"><a href="###" hidefocus title="'
		}else{
			focusImgArr[nn++] = '<li style="z-index:1"><a href="###" hidefocus title="'
		}
		focusImgArr[nn++] = titlename;
		focusImgArr[nn++] = '" onclick="';
		if(source==8 || source==12){
			focusImgArr[nn++] = commonClickString(new Node(source,sourceid,name,nodeid,'',other));
		}else{
			focusImgArr[nn++] = commonClickString(new Node(source,sourceid,name,nodeid));
		}
		focusImgArr[nn++] = '"><img onerror="imgOnError(this);" width="630" src="';
		focusImgArr[nn++] = imgUrl;
		focusImgArr[nn++] = '" /></a></li>';
		if(i==0){
			focusBtnArr[jj++] = '<a href="###" hidefocus class="focusbtnnow" title="';
		}else{
			focusBtnArr[jj++] = '<a href="###" hidefocus title="';
		}
		focusBtnArr[jj++] = titlename;
		focusBtnArr[jj++] = '"></a>';
	}

	var focusImgStr = focusImgArr.join('');
	var focusBtnStr = '<div class="zoneFocus_btn">'+focusBtnArr.join('')+'</div>';

	$("#zoneFocusWarp .zoneFocusImg ul").html(focusImgStr);
	$("#zoneFocusWarp .zoneFocusImg ul").append(focusBtnStr)

	var oWarp = $("#zoneFocusWarp");
	starMoveFocus(oWarp);
	currObj.find("#zoneFocusWarp").show();
	iframeObj.refresh();
}


var zoneFun = {};
zoneFun.findValue = function(name,str,t){
	var arr = str.split(t);
	for(var i=0; i<arr.length; i++){
		if(arr[i]=='') continue;
		if(arr[i].indexOf(name)>-1) return arr[i].substring(name.length).replace(/(^\s*)|(\s*$)/g,"");
	}
	return '';
}

zoneFun.zoneFormat = function(){
	centerLoadingStart();
	returnTop();
	focusDataArr = [];
	focusDataNewArr = [];
}

zoneFun.json2url = function(data){
	var arr=[];
	for(var i in data) arr.push(i+'='+data[i]);
	return arr.join('&');
}