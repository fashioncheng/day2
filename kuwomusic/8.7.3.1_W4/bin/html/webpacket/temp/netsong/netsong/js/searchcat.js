// 全局变量
var host_url = "http://search.kuwo.cn/";
var isopen = callClient("OpenChargeSong");
var MUSICLISTOBJ = {};
var version = "";
// 全局变量结束

//搜索时高亮替换
function searchReplaceAll(s){
	var returndata = s;
	if(searchSourceKey.indexOf("\\")>-1){
		return returndata;
	}else{
		var keys = searchSourceKey.split(' ');
		var sss = "(";
		var skey;
		for(var i=0,len=keys.length;i<len;i++){
		    skey = keys[i];
		    skey = skey.replace(/\(/g,"\\(").replace(/\)/g,"\\)");
			if(skey!=''){
				sss +=(skey+"|");
			}
		}
		sss = sss.substr(0,sss.length-1);
		sss += ")";
		try{
			returndata = returndata.replace(new RegExp(sss,"gi"),"<i class='ff66'>$1</i>");
		}catch(e){
		}
		return returndata;
	}
}
function searchLRCFunction(sourceKey){
	searchLRC();
}
var searchLRCPage = 0;
var searchLRCRn = 100;
var searchLRCTotal = 0;
var searchLRCLoad = false;
function searchLRC() {
	var url = host_url+"r.s?lrccontent="+searchKey+"&ft=music&newsearch=1&itemset=web_2013&client=kt&cluster=0&pn="+pn+"&rn="+searchLRCRn+"&rformat=json&callback=searchLRCResult&encoding=utf8&ver=MUSIC_5.2.1.3_UG8&primitive=0&show_copyright_off=1&alflac=1";
	$.getScript(getChargeURL(url));
}
function createMusicList(obj, index , rn , pn){
	var arr = [];
    var name = checkSpecialChar(obj.SONGNAME,"name");
    var disname = checkSpecialChar(obj.SONGNAME,"disname");
    disname = ie6SubStr(disname,22,18);
    var titlename = checkSpecialChar(obj.SONGNAME,"titlename");	
	var album = obj.ALBUM;
	album = ie6SubStr(album,12,8);
	var albumTitle = obj.ALBUM;
	var albumid = obj.ALBUMID;
	var artist = obj.ARTIST;
	artist = ie6SubStr(artist,12,8);
	var artistTitle = obj.ARTIST;
	var artistid = obj.ARTISTID;
	var formats = obj.FORMATS;
	var id = obj.MUSICRID;
	var copyright = obj.copyright || obj.COPYRIGHT;// 小地球标识字段
	var score100 = parseInt(obj.SCORE100) || 2;
	var rid = id.replace("MUSIC_","")
	var tips = getMusicTips(name,artist,album,rid);
	if(score100>100){
	    score100 = 100;
	}
	var num = rn * pn + index + 1;
	if (num < 10) num = '0' + num;
	arr[arr.length] = '<li class="music_wrap ';
	arr[arr.length] = getCopyrightClass(obj);
	arr[arr.length] = '" c-rid="';
    arr[arr.length] = id;
	arr[arr.length] = '" data-index="'+index+'" title="'+tips+'">';
	if(parseInt(copyright)==1){
		arr[arr.length] = '<div class="sourceTips" style="right:49px;"><div class="closebtn j_earthBtn"></div>';
		arr[arr.length] = '<p class="sourceTitle">'+name+'</p>';
		arr[arr.length] = '<p class="sourceUrl"></p>';
		arr[arr.length] = '<p class="sourceText">该资源来自第三方网站，酷我音乐未对其进行任何修改</p></div>';
	}
	arr[arr.length] = '<div class="m_r"><div class="mr_r"><div class="m_left"><input type="checkbox" checked="true" class="m_ckb"><span class="num">';
	arr[arr.length] = num;
	arr[arr.length] = '</span>';
	arr[arr.length] = '<div data-rid="';
	arr[arr.length] = id;
	arr[arr.length] = '" class="icon">';
	arr[arr.length] = '<a hidefocus href="###" class="m_add" title="添加歌曲"></a>';
	arr[arr.length] = '<a hidefocus href="###" class="m_down" title="下载歌曲">';
	arr[arr.length] = getMoney(obj,"down");
	arr[arr.length] = '</a><a hidefocus href="###" class="m_more" title="更多操作"></a></div></div>';
	// 小地球位置
	var earthClass='';
	if(parseInt(copyright)==1){
		earthClass='earth';
	}else{
		earthClass='earth no_earth';
	}
	arr[arr.length] = '<div class="mr_box"><div class="m_right"><div class="box_right"><div style="float:left;width:96px;"><i class="m_score">';
	arr[arr.length] = '<span style="width:';
	arr[arr.length] = score100;
	arr[arr.length] = '%;"></span></i><a title="该歌曲来自第三方网站" class="'+earthClass+'"></a></div>';
	arr[arr.length] = '<i title="选择试听音质" data-md="';
	arr[arr.length] = formats;
	arr[arr.length] = '" class="m_hd pz ';
	arr[arr.length] = getHqLevel(obj);
	arr[arr.length] = '"></i></div></div>';
	
	arr[arr.length] = '<div class="m_middle"><div class="nameMv"><span class="m_name"><a data-rid="';
	arr[arr.length] = id;
	arr[arr.length] = '" class="w_name" hidefocus href="###">';

	arr[arr.length] = searchReplaceAll(disname);
	arr[arr.length] = '</a>';
	if(!getTanMuIconStr(obj) && obj.IS_POINT == '0'){
		arr[arr.length] = '<a hidefocus href="###" class="';
		var mvclass = "";
		if(obj.MKVRID!="MV_0"){
		    mvclass = "m_mv";
		}else{
		    mvclass = "m_mv m_mv_n";
		}
		arr[arr.length] = mvclass;
		arr[arr.length] = '" title="观看MV"></a>';
	}
	if(getTanMuIconStr(obj) && obj.IS_POINT == '1' ){
        var strTm = getTanMuIconStr(obj);
        arr[arr.length] = '<i class="m_score tm">'+ strTm + '</i>'
    }
    var artistclick = '';
    var albumclick = '';
    var other = '|psrc=歌手->|bread=-2,4,歌手,0';
	artistclick = 'jumpQK(4,'+obj.ARTISTID+',\''+checkSpecialChar(artist,"name")+'\',4,\'\',\''+other+'\')';
	albumclick = 'jumpQK(13,'+obj.ALBUMID+',\''+checkSpecialChar(album,"name")+'\',13,\'\',\'\')';
	var isnew = obj["new"];
	var newhtml = ''
    if(typeof(isnew)!="undefined" && isnew==1){
        newhtml = "<em class='musicnewimg'></em>";
    }
	arr[arr.length] = newhtml;
	arr[arr.length] = '</div></span>';
	arr[arr.length] = '<span class="m_artist"><a onclick="';
	arr[arr.length] = artistclick;
	arr[arr.length] = '" hidefocus href="###">';
	arr[arr.length] = searchReplaceAll(checkSpecialChar(artist,"disname"));
	arr[arr.length] = '</a></span>';
	arr[arr.length] = '<span class="m_album"><a onclick="';
	arr[arr.length] = albumclick;
	arr[arr.length] = '" hidefocus href="###">';
	arr[arr.length] = searchReplaceAll(checkSpecialChar(album,"disname"));
	arr[arr.length] = '</a></span></div>';

	
	arr[arr.length] = '</div></div></li>';

	var lrc = obj.lrc;
	lrc = lrc.replace("LRC=","");
	lrc = searchReplaceAll(lrc);
	arr[arr.length] = '<div class="sou_geci ';
	arr[arr.length] = getCopyrightClass(obj);
	arr[arr.length] = '"><span>'+lrc+'</span></div>';
	saveMusicInfo(obj);
	return arr.join('');
}

function searchLRCResult(jsondata) {
    try{
	var starttime = new Date().getTime();
	var data = jsondata;
	if(typeof(data)=="undefined" || data==null||typeof(data.TOTAL)=="undefined"){
	    return;
	}
	var musicList = data.abslist;
	searchLRCTotal = data.TOTAL;
	if(parseInt(searchLRCTotal,10)==0){
		searchNoResult();
		return;
	}
	if(pn==0){
		//$(".checkall font").html("共找到"+searchLRCTotal+"个歌词");
		$(".checkall font").html(searchLRCTotal);
	}
	var htmlArray = [];
	var objSize = musicList.length;
	var someObj;
	for ( var i = 0; i < objSize; i++) {
		someObj = musicList[i];
		htmlArray[htmlArray.length] = createMusicList(someObj,i,pn,searchLRCRn);
	}
	$(".w_lrc .kw_music_list").html(htmlArray.join(""));
	var pageStr = createPage(Math.ceil(parseInt(searchLRCTotal, 10) / searchLRCRn), pn + 1);
	if (pageStr) $(".page").html(pageStr).show();
	searchRequestLog("suc","lyric",parseInt(pn,10)+1);
	$(".w_lrc").show();
	centerLoadingEnd();
	}catch(e){}
}
// 搜索歌单结果部分
function searchSetListFunction(sourceKey){
	searchSetList();
}
var searchSetListPage = 0;
var searchSetListRn = 100;
var searchSetListTotal = 0;
var searchSetListLoad = false;
function searchSetList() {
	var url = host_url +'r.s?all='+searchKey+'&pn='+pn+'&rn='+searchSetListRn+'&ft=playlist&encoding=utf8&rformat=json&pay=0&needliveshow=0&callback=searchSetListResult';
	$.getScript(getChargeURL(url));
}

function searchSetListResult(jsondata){
	try{
		var data = jsondata;
		if(typeof(data)=="undefined" || data==null||typeof(data.TOTAL)=="undefined"){
		    return;
		}
		var playList = data.abslist;
		searchSetListTotal = data.TOTAL;
		if(parseInt(searchSetListTotal) == 0){
			searchNoResult();
			return;
		}
		var playListSize = playList.length;
		var htmlArray = [];
		for (var i = 0; i < playListSize; i++) {
			htmlArray[htmlArray.length] = createPlaylistBlock(playList[i],i);
		}
		$(".w_playlist .kw_playlist").html(htmlArray.join(""));
		var pageStr = createPage(Math.ceil(parseInt(searchSetListTotal, 10) / searchSetListRn), pn + 1);
		if (pageStr) $(".page").html(pageStr).show();
		$(".w_playlist").show();
		centerLoadingEnd();
		// searchRequestLog("suc","album",parseInt(pn,10));
	}catch(e){}
}
function createPlaylistBlock (obj,from) {
    var html = [];
    var name = checkSpecialChar(obj.name,"name");
    var disname = checkSpecialChar(obj.disname,"disname") || checkSpecialChar(name,"disname");
    var titlename = checkSpecialChar(disname,"titlename");
    var info = obj.songnum + '首歌曲';
    var pic = obj.pic;
    pic = getPlaylistPic(pic,120);
    var icon = '';
    var other = '';
    var source = source;
    var sourceId = '';
    var click = '';
    var musicNum = parseInt(obj.songnum);
    if(isNaN(musicNum)){
        musicNum=0;
    }
    if(disname==""){
        disname="my";
    }
    var ipsrc = "|psrc=曲库-\>"+ searchSourceKey + "的搜索结果-\>歌单列表";
    if(!pic){
        pic = 'img/def120.png';
    }else{
        pic = changeImgDomain(pic);
    }
	source = obj.source;
	sourceId = obj.playlistid;
	//click = commonClickString(new Node(source,sourceId,name,obj.id,obj.extend,other));
	click = 'jumpQK(8,'+sourceId+',\''+checkSpecialChar(obj.name,"name")+'\',8,\'\',\''+other+'\')';

    html[html.length] = '<li class="b_wrap"><a onclick="';
    html[html.length] = click;
    html[html.length] = '" title="';
    html[html.length] = titlename;
    html[html.length] = '" class="b_pic" href="###" hidefocus>';
    html[html.length] = icon;
    html[html.length] = '<span class="b_shade"></span><i onclick="iPlay(arguments[0],8,';
    html[html.length] = sourceId;
    html[html.length] = ',this);return false;" data-ipsrc="';
    html[html.length] = ipsrc;
    html[html.length] = '" title="直接播放" class="i_play"></i><img width="120" height="120" src="';
    html[html.length] = pic;
    html[html.length] = '" class="lazy" onerror="imgOnError(this,120);" data-original="';
    html[html.length] = pic;
    html[html.length] = '" /></a><p class="b_name"><a onclick="';
    html[html.length] = click;
    html[html.length] = '" title="';
    html[html.length] = titlename;
    html[html.length] = '" href="###" hidefocus>';
    html[html.length] = searchReplaceAll(disname);;
    html[html.length] = '</a></p><p class="b_info"><a onclick="';
    html[html.length] = click;
    html[html.length] = '" title="';
    html[html.length] = info;
    html[html.length] = '" href="###" hidefocus>';
    html[html.length] = musicNum;
    html[html.length] = '首歌曲</a></p></li>';
    return html.join("");
}
// 搜索电台结果部分
function searchRadioFunction(sourceKey){
	searchRadioList();
}
var searchRadioPage = 0;
var searchRadioRn = 100;
var searchRadioTotal = 0;
var searchRadioLoad = false;
var radioid = 0;
var status = '';
function searchRadioList() {
	var url = host_url +'r.s?all='+searchKey+'&pn='+pn+'&rn='+searchRadioRn+'&ft=recordlist&encoding=utf8&rformat=json&pay=0&needliveshow=0&callback=searchRadioListResult';
	$.getScript(getChargeURL(url));
}
function searchRadioListResult(jsondata){
	try{
		var data = jsondata;
		if(typeof(data)=="undefined" || data==null||typeof(data.TOTAL)=="undefined"){
		    return;
		}
		var radioList = data.abslist;
		searchRadioTotal = data.TOTAL;
		if(parseInt(searchRadioTotal) == 0){
			searchNoResult();
			return;
		}
		var radioListSize = radioList.length;
		var htmlArray = [];
		for (var i = 0; i < radioListSize; i++) {
			htmlArray[htmlArray.length] = createRadioBlock(radioList[i],i);
		}
		$(".w_radiolist .kw_radiolist").html(htmlArray.join(""));
		var pageStr = createPage(Math.ceil(parseInt(searchRadioTotal, 10) / searchRadioRn), pn + 1);
		if (pageStr) $(".page").html(pageStr).show();
		$(".w_radiolist").show();
		centerLoadingEnd();
		objBindFn();

		var call = "GetRadioNowPlaying";
	    var str = callClient(call);
		radioid = getValue(str,'radioid');
		status = getValue(str,'playstatus');
		if(radioid){
			initRadioStatus(parseInt(status,10),radioid);
		}
		// searchRequestLog("suc","album",parseInt(pn,10));
	}catch(e){console.log(e.message);}
}
function createRadioBlock(obj,index) {
    var html = [];
    var name = checkSpecialChar(obj.name,"name");
    var disname = checkSpecialChar(obj.disname,"disname") || checkSpecialChar(name,"disname");
    var titlename = checkSpecialChar(disname,"titlename");
    var listen = '';
    var ricon = '';
    var pic = obj.pic;
    if(pic == ''){
        pic = 'img/def150.png';
    } else{
        pic = changeImgDomain(pic);
    }
    var radioClass = 'radio_' + obj.sourceid.split(',')[0];
    var disname2 =disname;
    disname2 = disname2.replace(/&apos;/g,'%26apos%3B').replace(/\'/g,'%26apos%3B');
    obj.extend = obj.extend+ "|RADIO_PIC=" + pic + "|DIS_NAME=" + disname2 + "|" ;
    //var click = 'jumpQK(9,'+obj.sourceid+',\''+obj.name+'\',9,\'\',\''+obj.extend+'\')';
    //var click = 'commonClick({\'source\':\'9\',\'sourceid\':\'-561,郭静电台,http://img1.kwcdn.kuwo.cn:81/star/starheads/30/73/32/2891550664.jpg,http://img1.kwcdn.kuwo.cn:81/star/starheads/55/73/32/2891550664.jpg,2008-08-08,2016-04-02,4,0~24,258818,4,1\',\'name\':\'郭静电台\',\'id\':\'undefined\',\'extend\':\'|RADIO_PIC=http://img1.sycdn.kuwo.cn/star/starheads/120/73/32/2891550664.jpg|DIS_NAME=郭静电台|\'})"';
    // var nodeobj = '{\'source\':\'9\',\'sourceid\':\''+obj.sourceid+'\',\'name\':\''+disname+'\',\'id\':\'9\',\'extend\':\''+obj.extend+'\'}';
    // var click = 'someDianTai(\''+obj.sourceid+'\','+nodeobj+')';
    obj.sourceid = obj.sourceid.replace(/&apos;/g,'%26apos%3B');
    name = name.replace(/&apos;/g,'%26apos%3B').replace(/\'/g,'%26apos%3B');
   	var click = commonClickString(new Node(obj.source, obj.sourceid, name, obj.nodeid, obj.extend));
    var r = Math.ceil(index/5);
    var l = index%5 || 5;
    var pos = r + ',' + l;
    var gps = "";
    var fpage = "";
    var dtid = obj.sourceid.split(",")[0];

 
    fpage = "搜索电台";
    gps = "1,1";
    var log = 'radioLog(\'POSITION:'+pos+'|GPOSITION:'+gps+'|FROMPAGE:'+fpage+'|RADIOID:'+dtid+'\'); ';

    
    html[html.length] = '<li class="br_wrap ';
    html[html.length] = radioClass;
    html[html.length] = '"><a _onclick="';
    html[html.length] = log;
    html[html.length] = click;
    html[html.length] = '" onclick="';
    html[html.length] = log;
    html[html.length] = click;
    html[html.length] = '" title="';
    html[html.length] = titlename;
    html[html.length] = '" class="br_pic" href="###" hidefocus>';
    html[html.length] = ricon;
    html[html.length] = '<span class="br_shade"></span><i title="直接播放" class="i_play i_play_big"></i><img width="140" height="140" src="';
    html[html.length] = pic;
    html[html.length] = '" class="lazy" onerror="imgOnError(this,150);" data-original="';
    html[html.length] = pic;
    html[html.length] = '" /></a><p class="br_name"><a onclick="';
    html[html.length] = log;
    html[html.length] = click;
    html[html.length] = '" title="';
    html[html.length] = titlename;
    html[html.length] = '" href="###" hidefocus>';
    html[html.length] = searchReplaceAll(disname);;
    html[html.length] = '</a></p><p class="br_info">';
    html[html.length] = '';
    html[html.length] = '</p></li>';
    return html.join("");
}

var searchAlbumPage = 0;
var searchAlbumRn = 100;
var searchAlbumTotal = 0;
function loadSearchAlbum(){
	var url = host_url+"r.s?all="+searchKey+"&ft=album&newsearch=1&itemset=web_2013&client=kt&cluster=0&pn="+pn+"&rn="+searchAlbumRn+"&rformat=json&callback=searchAlbumResult&encoding=utf8&show_copyright_off=1";
	$.getScript(getChargeURL(url));
}
function searchAlbumFunction(sourceKey){
	loadSearchAlbum();
}
function createAlbumBlock(obj) {
    var html = [];
    var album = obj.name;
    var name = checkSpecialChar(album,"name");
    var disname = checkSpecialChar(album,"disname");
    var titlename = checkSpecialChar(album,"titlename");
	var picUrl = obj.pic;
	if(picUrl == ""){
		picUrl = "img/kuwo.jpg";
	}else{
		picUrl = getAlbumPrefix(picUrl)+picUrl;
		//picUrl = picUrl.replace("albumcover/120","albumcover/100");
	}
    var infoStr = '';
    var artistclick = '';
    var albumclick = '';	
    var other = '|psrc=歌手->|bread=-2,4,歌手,0';
	artistclick = 'searchArtistNewLog(-301);jumpQK(4,'+obj.artistid+',\''+checkSpecialChar(obj.artist,"name")+'\',4,\'\',\''+other+'\')';
	albumclick = 'searchAlbumNewLog(-300);jumpQK(13,'+obj.albumid+',\''+name+'\',13,\'\',\'\')';
    infoStr = '<p class="b_info"><a onclick="'+artistclick+'" title="'+ checkSpecialChar(obj.artist,"titlename") +'" href="###" hidefocus>'+searchReplaceAll(checkSpecialChar(obj.artist,"disname"))+'</a></p>';
	html[html.length] = '<li class="b_wrap"><a onclick="';
	html[html.length] = albumclick;
	html[html.length] = '" title="';
    html[html.length] = titlename;
    html[html.length] = '" class="b_pic" href="###" hidefocus><span class="l_adm"></span><span class="b_shade"></span><i onclick="iPlay(arguments[0],13,';
    html[html.length] = obj.albumid;
    html[html.length] = ');searchAlbumNewLog(-300);return false;" title="直接播放" class="i_play"></i><img width="120" height="120" src="';
    html[html.length] = picUrl;
    html[html.length] = '" onerror="imgOnError(this,100);" />';
    html[html.length] = '</a><p class="b_name"><a onclick="';
    html[html.length] = albumclick;
    html[html.length] = '" title="';
    html[html.length] = titlename;
    html[html.length] = '" href="###" hidefocus>';
    html[html.length] = searchReplaceAll(disname);
    html[html.length] = '</a></p>';
	html[html.length] = infoStr;
	html[html.length] = '</li>';				
    return html.join("");     
}
function searchAlbumResult(jsondata){
    try{
	var starttime = new Date().getTime();
	var data = jsondata;
	if(typeof(data)=="undefined" || data==null||typeof(data.albumlist)=="undefined"){
	    return;
	}
	var albumList = data.albumlist;
	searchAlbumTotal = data.total;
	var currTotal = searchAlbumTotal;
	if(parseInt(currTotal,10)==0){
		searchNoResult();
		return;
	}
	var albumSize = albumList.length;
	var htmlArray = [];
	for ( var i = 0; i < albumSize; i++) {
		someObj = albumList[i];
		htmlArray[htmlArray.length] = createAlbumBlock(someObj);
	}
	$(".w_album .kw_album_list").html(htmlArray.join(""));
	var pageStr = createPage(Math.ceil(parseInt(searchAlbumTotal, 10) / searchAlbumRn), pn + 1);
	if (pageStr) $(".page").html(pageStr).show();
	$(".w_album").show();
	centerLoadingEnd();
	searchRequestLog("suc","album",parseInt(pn,10));
	}catch(e){}
}
var searchMVPage = 0;
var searchMVRn = 80;
var searchMVTotal = 0;
function loadSearchMV(){
	var url = host_url+"r.s?all="+searchKey+"&ft=music&newsearch=1&itemset=web_2013&client=kt&cluster=0&pn="+pn+"&rn="+searchMVRn+"&rformat=json&hasmkv=1&callback=searchMVResult&encoding=utf8&show_copyright_off=1";
	$.getScript(getChargeURL(url));
}
function searchMVFunction(sourceKey){
	loadSearchMV();
}

function createMVBlock(obj,index){
	var html = [];
	var mvname = obj.SONGNAME;
    var name = checkSpecialChar(mvname,"name");
    var disname = checkSpecialChar(mvname,"disname");
    var titlename = checkSpecialChar(mvname,"titlename");//小地球标示
    var copyright=obj.copyright || obj.COPYRIGHT;
	var picUrl = obj.MVPIC;
	if(picUrl == ""){
		picUrl = "img/def140.jpg";
	}else{
		picUrl = getMVPrefix(picUrl)+picUrl;
		picUrl = picUrl.replace("wmvpic/140","wmvpic/160")
	}
    var infoStr = '';
    var artistclick = '';	
    var other = '|psrc=歌手->|bread=-2,4,歌手,0';
	artistclick = 'searchArtistNewLog(-401);jumpQK(4,'+obj.ARTISTID+',\''+checkSpecialChar(obj.ARTIST,"name")+'\',4,\'\',\''+other+'\')';
	var musicString = '';
	var musicstringarray = [];
	musicstringarray[musicstringarray.length] = encodeURIComponent(returnSpecialChar(mvname));
	musicstringarray[musicstringarray.length] = encodeURIComponent(returnSpecialChar(obj.ARTIST));
	musicstringarray[musicstringarray.length] = encodeURIComponent(returnSpecialChar(obj.ALBUM));
	musicstringarray[musicstringarray.length] = obj.NSIG1;
	musicstringarray[musicstringarray.length] = obj.NSIG2;
	musicstringarray[musicstringarray.length] = obj.MUSICRID;
	musicstringarray[musicstringarray.length] = obj.MP3NSIG1;
	musicstringarray[musicstringarray.length] = obj.MP3NSIG2;
	musicstringarray[musicstringarray.length] = obj.MP3RID;
	musicstringarray[musicstringarray.length] = obj.MKVNSIG1;
	musicstringarray[musicstringarray.length] = obj.MKVNSIG2;
	musicstringarray[musicstringarray.length] = obj.MKVRID;
	musicstringarray[musicstringarray.length] = obj.HASECHO;
	var psrc = "VER=2015;FROM=曲库->\""+searchSourceKey+"\"的搜索结果->MV列表";
	psrc = encodeURIComponent(psrc);
	musicstringarray[musicstringarray.length] = psrc;
	musicstringarray[musicstringarray.length] = obj.FORMATS;
	musicstringarray[musicstringarray.length] = getMultiVerNum(obj);
	musicstringarray[musicstringarray.length] = getPointNum(obj);
	musicstringarray[musicstringarray.length] = getPayNum(obj);
	musicstringarray[musicstringarray.length] = getArtistID(obj);
	musicstringarray[musicstringarray.length] = getAlbumID(obj);
	musicString = musicstringarray.join('\t');
	musicstringarray = null;
	musicString = encodeURIComponent(musicString);
    var click = "searchMvNewLog();someMV(this);";
    if(parseInt(copyright)==1){
    	if(checkChinese(obj.ARTIST)){
    		if(obj.ARTIST.length>10){
    			obj.ARTIST=obj.ARTIST.substring(0,8)+'...';
    		}
    	}else{
    		if(obj.ARTIST.length>16){
    			obj.ARTIST=obj.ARTIST.substring(0,14)+'...';
    		}
    	}
		infoStr = '<p class="bmv_info"><a onclick="'+artistclick+'" title="'+ checkSpecialChar(obj.ARTIST,"titlename") +'" href="###" hidefocus>'+searchReplaceAll(checkSpecialChar(obj.ARTIST,"disname"))+'</a><a class="bmv_earth" title="该歌曲来自第三方网站" href="###"></a></p>';
	}else{
		infoStr = '<p class="bmv_info"><a onclick="'+artistclick+'" title="'+ checkSpecialChar(obj.ARTIST,"titlename") +'" href="###" hidefocus>'+searchReplaceAll(checkSpecialChar(obj.ARTIST,"disname"))+'</a></p>';
	}
    html[html.length] = '<li class="bmv_wrap ';
    html[html.length] = getCopyrightClass(obj);
    html[html.length] = '" data-index="'+index+'" data-rid="'+obj.MUSICRID.substring(6)+'">';
    html[html.length] = getTanMuMVIconStr(obj);
    if(parseInt(copyright)==1){
		html[html.length] = '<div class="sourceTips"><div class="closebtn j_earthBtn"></div>';
		html[html.length] = '<p class="sourceTitle">'+disname+'</p>';
		html[html.length] = '<p class="sourceUrl"></p>';
		html[html.length] = '<p class="sourceText">该资源来自第三方网站，酷我音乐未对其进行任何修改</p></div>';
	}
    html[html.length] = '<a data-mv="';
    html[html.length] = musicString;
    html[html.length] = '" onclick="';
    html[html.length] = click;
    html[html.length] = '" title="';
    html[html.length] = titlename;
    html[html.length] = '" class="bmv_pic" href="###" hidefocus><span class="bmv_shade"></span><i title="直接播放" class="i_play i_play_big"></i><img width="165" height="95" src="';
    html[html.length] = picUrl;
    html[html.length] = '" onerror="imgOnError(this,140);" />';
    html[html.length] = '</a><p class="bmv_name"><a data-mv="';
    html[html.length] = musicString;
    html[html.length] = '" onclick="';
    html[html.length] = click;
    html[html.length] = '" title="';
    html[html.length] = titlename;
    html[html.length] = '" href="###" hidefocus>';
    html[html.length] = searchReplaceAll(disname);
    html[html.length] = '</a></p>';
	html[html.length] = infoStr;
	html[html.length] = '</li>';
	MVLISTOBJ[MVLISTOBJ.length] = musicString;
	MVLISTOBJECT[MVLISTOBJECT.length] = obj;
	return html.join("");
}

function searchMVResult(jsondata){
    try{
	var starttime = new Date().getTime();
	var data = jsondata;
	if(typeof(data)=="undefined" || data==null||typeof(data.abslist)=="undefined"){
	    return;
	}
	var mvList = data.abslist;
	searchMVTotal = data.TOTAL;
	var currTotal = searchMVTotal;
	if(parseInt(currTotal,10)==0){
		searchNoResult();
		return;
	}
	var mvSize = mvList.length;
	var htmlArray = [];
	var someObj;
	MVLISTOBJ = [];//清空MVLISTOBJ
	for ( var i = 0; i < mvSize; i++) {
		someObj = mvList[i];
		var mvridnum = someObj.MKVRID;	
		if(mvridnum.length<5){
			//continue;
		}
		htmlArray[htmlArray.length] = createMVBlock(someObj,i);
	}
	$(".w_mv .kw_mv_list").html(htmlArray.join(""));
	$(".selall_mv").find("font").html("共"+searchMVTotal+"首");
	var pageStr = createPage(Math.ceil(parseInt(searchMVTotal, 10) / searchMVRn), pn + 1);
	if (pageStr) $(".page").html(pageStr).show();
	$(".w_mv").show();
	centerLoadingEnd();
	searchRequestLog("suc","mv",parseInt(pn,10));
	}catch(e){}
}

var searchArtistPage = 0;
var searchArtistRn = 100;
var searchArtistTotal = 0;
function searchArtistFunction(sourceKey){
	loadSearchArtist();
}
function loadSearchArtist(){
	var url = host_url+"r.s?all="+searchKey+"&ft=artist&newsearch=1&itemset=artist_2015&client=kt&cluster=0&pn="+pn+"&rn="+searchArtistRn+"&rformat=json&callback=searchArtistResult&encoding=utf8" + '&plat=pc&devid=' + getUserID("devid");
	$.getScript(url);
}
function createArtistBlock(obj) {
	var arr = [];
	var xia = 0;
	var artist = obj.ARTIST;
    var name = checkSpecialChar(artist,"name");
    var disname = checkSpecialChar(artist,"disname");
    var titlename = checkSpecialChar(artist,"titlename");
    var titleStr = obj.SONGNUM+"首歌曲"
	var picUrl = obj.PICPATH;
	if(picUrl == ""){
		picUrl = "img/kuwo.jpg";
	}else{
		picUrl = getArtistPrefix(picUrl)+picUrl;
		picUrl = picUrl.replace("starheads/55","starheads/120");
	}
	var other = '|psrc=歌手->|bread=-2,4,歌手,0';
	var click = '';
	var infoStr = '';
	click = 'jumpQK(4,'+obj.ARTISTID+',\''+name+'\',4,\'\',\''+other+'\');searchArtistNewLog(-200);';
	infoStr = '<p class="b_info"><a title="'+titleStr +'" href="###" hidefocus onclick="'+click+'">'+ obj.SONGNUM +'首歌曲</a></p>';
	arr[arr.length] = '<li class="b_wrap"><a title="';
	arr[arr.length] = titlename;
	arr[arr.length] = '" hidefocus href="###" onclick="';
	arr[arr.length] = click;
	arr[arr.length] = '" class="b_pic">';
	arr[arr.length] = '<span class="b_shade"></span>';
	arr[arr.length] = '<i onclick="iPlay(arguments[0],4,';
	arr[arr.length] = obj.ARTISTID;
	arr[arr.length] = ');searchArtistNewLog(-200);return false;" class="i_play" title="直接播放"></i>';
	arr[arr.length] = '<img onerror="imgOnError(this,100);" src="';
	arr[arr.length] = picUrl;
	arr[arr.length] = '" width="120" height="120"></img></a>';
	arr[arr.length] = '<p class="b_name"><a hidefocus href="###" onclick="';
	arr[arr.length] = click;
	arr[arr.length] = '" title="';
	arr[arr.length] = titlename;
	arr[arr.length] = '">';
	arr[arr.length] = searchReplaceAll(disname);
	arr[arr.length] = '</a></p>';
	arr[arr.length] = infoStr;
	arr[arr.length] = '</li>';			
	return arr.join('');		
}
function searchArtistResult(jsondata){
    try{
	var starttime = new Date().getTime();
	var data = jsondata;
	if(typeof(data)=="undefined" || data==null||typeof(data.abslist)=="undefined"){
	    return;
	}
	var artistListObj = data.abslist;
	searchArtistTotal = data.TOTAL;
	var currTotal = searchArtistTotal;
	if(parseInt(currTotal,10)==0){
		searchNoResult();
		return;
	}
	var artistSize = artistListObj.length;
	var htmlArray = [];
	for ( var i = 0; i < artistSize; i++) {
		someObj = artistListObj[i];
		if(someObj.SONGNUM==""||someObj.SONGNUM==0){
		    continue;
		}
		htmlArray[htmlArray.length] = createArtistBlock(someObj);
	}
    $(".w_artist .kw_album_list").html(htmlArray.join(""));
	var pageStr = createPage(Math.ceil(parseInt(searchArtistTotal,10)/searchArtistRn), pn+1);
	if (pageStr) $(".page").html(pageStr).show();
	$(".w_artist").show();
	centerLoadingEnd();
	searchRequestLog("suc","artist",parseInt(pn,10));
	}catch(e){}
}

function searchArtistNewLog(pos){
	searchOperationLog("ref",pos,"music","refartist");
}
function searchAlbumNewLog(pos){
	searchOperationLog("ref",pos,"music","refalbum");
}
function searchMvNewLog(){
	searchOperationLog("ref","-400","music","refmv");
}
function searchLyricNewLog(){
	searchOperationLog("ref","-500","music","reflyric");
}


function searchNoResult(){
	var somekey = searchSourceKey;
	somekey = somekey.replace(/</g,"&lt;");
	$(".w_noresult em").html(somekey);
	$(".w_noresult").show();
	$.getScript("http://topmusic.kuwo.cn/today_recommend/searchNoResult.js");
}
function handleSearchNoResult(jsondata){
	var data = jsondata;
	centerLoadingEnd();
	if(typeof(data)=="undefined"||data==null||typeof(data.datalist)=="undefined"||data.datalist.length==0){
		return;
	}
	var datalist = data.datalist;
	var datalistsize = datalist.length;
	var html = "";
	var htmlarray = [];
	var xia = 0;
	var hrefstring = "";
	htmlarray[xia++] = '<p class="l_p2">您还可以查看搜索热词：</p>';
	for(var i = 0; i < datalistsize; i++){
		var someobj = datalist[i];
		var source = someobj.source;
		if(source==2){
			source = 1;
		}
		var sourceid = someobj.sourceid;
		var nodeid = someobj.nodeid;
		var name = someobj.name;
		var disname = someobj.disname;
		hrefstring = 'jumpQK('+source+','+sourceid+',\''+checkSpecialChar(name,"name")+'\','+nodeid+')';
		if(source==5){
		    if(sourceid==28){
		        source = 29;
		        sourceid = 78067;
		        nodeid = 78067;
		        var other = "|psrc=分类->|bread=-2,5,分类,-2";
		        hrefstring = 'jumpQK(40,190481,\'DJ\',0,0,\''+other+'\')';
		    }else{
		        continue;
		    }
		}else if(source==8||source==12){
		    hrefstring = 'jumpQK('+source+','+sourceid+',\''+checkSpecialChar(name,"name")+'\','+nodeid+',\'\',\'|from=index\')';
		}else if(source==1){
		    hrefstring = 'jumpQK('+source+','+nodeid+',\''+checkSpecialChar(name,"name")+'\','+sourceid+',\'\',\'|psrc=排行榜->|bread=-2,2,排行榜,0\')';
		}
		htmlarray[xia++] = '<a hidefocus href="###" onclick="';
		htmlarray[xia++] = hrefstring;
		htmlarray[xia++] = '" title="';
		htmlarray[xia++] = disname;
		htmlarray[xia++] = '">';
		htmlarray[xia++] = disname;
		htmlarray[xia++] = '</a>';
	}
	html = htmlarray.join('');
	$("#noresult_con").html(html);
}

//search 跳转判断哪个类别
function searchFunction(nodeobj){
	centerLoadingStart();
	var key = nodeobj.sourceid;
	var index = nodeobj.id;
	searchKey = "";
	searchSourceKey = "";
	try{
	    searchSourceKey = decodeURIComponent(key);
	}catch(e){
	    searchSourceKey = key;
	}
	if(searchSourceKey=="&"){
		searchSourceKey = "&amp;";
	}
	key = encodeURIComponent(key);
	searchKey = encodeURIComponent(searchSourceKey);
	currSearchType = index;
	if(index=="artist"){
		searchArtistFunction(key);
	}else if(index=="album"){
		searchAlbumFunction(key);
	}else if(index=="mv"){
		searchMVFunction(key);
	}else if(index=="lrc"){
		searchLRCFunction(key);
	}else if(index=="radio"){
		searchRadioFunction(key);
	}else if(index=="setlist"){
		searchSetListFunction(key);
	}
}
var currentSearchType = "";
var currentSearchFlag = true;
var searchLogIsOpen = true;
//检查是否在搜索页面操作
function searchResultOperation(){
	if(searchLogIsOpen){
		searchIsOperation = true;
	}
}
//搜索请求 日志 成功或者失败
function searchRequestLog(result,searchtype,page){
	if(!searchLogIsOpen){
		return;
	}
	var time = new Date().getTime() - searchBeginTime;
	var call;
	if(page>1){
		call = "MBOXLOG?stype=type_spage&snum="+searchBeginNum+"&stime="+time+"&sresult="+result+"&searchtype="+searchtype;
	}else{
		call = "MBOXLOG?stype=type_stime&snum="+searchBeginNum+"&stime="+time+"&sresult="+result+"&searchtype="+searchtype;
	}
	callClientNoReturn(call);
}
//搜索之后 用户操作日志
function searchOperationLog(operationtype,pos,searchtype,refaddr){
	if(!searchLogIsOpen){//||searchObj.css("display")=="none" removed by luger
		return;
	}
	searchResultOperation();
	if(new Date().getTime() - searchBeginTime > 200000){
		return;
	}
	var call = "MBOXLOG?stype=type_soperation&operationtype="+operationtype+"&pos="+pos+"&snum="+searchBeginNum+"&searchtype="+searchtype+"&refaddr="+refaddr;
	callClientNoReturn(call);
}

window.onresize=function(){
    try{
	    if($(window).height() >= $("#content").height()){
	        $(".w_rtop").hide();    
	    }    
	}catch(e){}
    changeWidth();
}
function changeWidth(){   
    if(isIE7){
        $(".w_lrc").width($("body").width()-25);
    }else{
        $(".w_lrc").width($("body").width()-42);    
    }
}
var currSearchType = "";
var searchBeginTime = 0;
var searchBeginNum = -1;
var pn = 0;
var isIE = !!(window.attachEvent && !window.opera) || !!window.ActiveXObject || "ActiveXObject" in window;
var isIE6 = $.browser.msie && $.browser.version=="6.0" == true;
var isIE7 = $.browser.msie && $.browser.version=="7.0" == true;
var json = {};

// 歌曲拖拽相关
var isDragMusic = false;
var dragMusicString = "";
var currentX;
var currentY;
$(function(){
	callClientNoReturn('domComplete');
	var location = window.location.href;
	location = (location+'').replace(/%26/g,"&");
	var type = getValue(location,"type");
	var key = getValue(location,"key");
	var snum = getValue(location,"snum");
	if(snum){
		searchBeginNum = snum;
	}else{
		var nowDate = new Date();
		var pastDate = new Date("1601","00","01");
		searchBeginNum = "utf8_" + getUserID("devid") + encodeURIComponent(key.replace("&", "")) + parseInt((nowDate.getTime() + nowDate.getTimezoneOffset() * 60 * 1000 - pastDate.getTime())/1000/60/60);
	}
	json.id = type;
	json.sourceid = key;
	currSearchType = json.id;
	searchBeginTime = new Date().getTime();
	changeWidth();

    // 歌曲 播放 添加 MV 下载 更多等操作
    $(".m_play").live("click",function(){
    	searchLyricNewLog();
        if($(this).parentsUntil("ul").hasClass("copyright")){
            musicOnline();
            return;
        }
        var rid = $(this).parent().attr("data-rid");
        var playMusicString = MUSICLISTOBJ[rid];
        if(rid&&playMusicString){
            singleMusicOption("Play",playMusicString);
        }
    });
    $(".m_add").live("click",function(){
        if($(this).parentsUntil("ul").hasClass("copyright")){
            musicOnline();
            return;
        }
        var rid = $(this).parent().attr("data-rid");
        var playMusicString = MUSICLISTOBJ[rid];
        var playindex = 0;
	    if(rid&&playMusicString){
	        playindex++;
	        var playMusicStr = "n="+playindex+"&s"+playindex+"="+MUSICLISTOBJ[rid];
	        multipleMusicOption("AddTo",playMusicStr);
	    }
    });
    $(".m_mv").live("click",function(){
        if($(this).parentsUntil("ul").hasClass("copyright")){
            musicOnline();
            return;
        }
        var rid = $(this).parents("li").find(".icon").attr("data-rid");
        var playMusicString = MUSICLISTOBJ[rid];
        if(rid&&playMusicString){
            singleMusicOption("MV",playMusicString);
        }
    });
    $(".m_down").live("click",function(){
        if($(this).parentsUntil("ul").hasClass("copyright")){
            musicOnline();
            return;
        }
        var rid = $(this).parent().attr("data-rid");
        var playMusicString = MUSICLISTOBJ[rid];
        if(rid&&playMusicString){
            singleMusicOption("Down",playMusicString);
        }
    });
    $(".m_more").live("click",function(){
        if($(this).parentsUntil("ul").hasClass("copyright")){
            musicOnline();
            return;
        }
        var rid = $(this).parent().attr("data-rid");
        var playMusicString = MUSICLISTOBJ[rid];
        if(rid&&playMusicString){
            var call = "ShowOperation?song="+playMusicString;
		    callClientNoReturn(call);
        }
    });
    // 歌曲名称 点击
    $(".w_name").live("click",function(){
    	searchLyricNewLog();
        if($(this).parentsUntil("ul").hasClass("copyright")){
            musicOnline();
            return;
        }
        var rid = $(this).attr("data-rid");
        var playMusicString = MUSICLISTOBJ[rid];
        if(rid&&playMusicString){
            singleMusicOption("Play",playMusicString);
        }
    });
    // 清晰度
    $(".m_hd").live("click",function(){
        if($(this).parentsUntil("ul").hasClass("copyright")){
            musicOnline();
            return;
        }
        var rid = $(this).parents("li").find(".icon").attr("data-rid");
        var playMusicString = MUSICLISTOBJ[rid];
        var mdcode = $(this).attr("data-md");
        if(rid&&playMusicString&&mdcode){           
		    singleMusicOption("ShowHQ",playMusicString,mdcode);
        }
    });
    // 全部播放 添加 MV 下载 操作
    $(".all_play").live("click",function(){
        var playarray = [];
        var playindex = 0;
        $(".icon").each(function(i){
            var thisObj = $(this);
            var rid = thisObj.attr("data-rid");
            var flag = true;
            var inputprev = thisObj.parents("li");
            if(inputprev.hasClass("copyright")){
                //musicOnline();
                flag = false;
            }else{
                if(inputprev.find(".m_left")){
                	flag = inputprev.find(".m_ckb").attr("checked");
            
            	}   
            }
            if(flag&&rid&&MUSICLISTOBJ[rid]){
                playindex++;
                playarray[playarray.length] = "&s"+playindex+"="+MUSICLISTOBJ[rid];
            }
        });
        if(playindex>0){
            var playMusicString = ("n="+playindex+playarray.join(""));
            multipleMusicOption("Play",playMusicString);    
        }
    });
    $(".all_add").live("click",function(){
        var playarray = [];
        var playindex = 0;
        $(".icon").each(function(){
            var thisObj = $(this);
            var rid = thisObj.attr("data-rid");
            var flag = true;
            var inputprev = thisObj.parents("li");
            if(inputprev.parent().hasClass("copyright")){
                //musicOnline();
                flag = false;
            }else{
                if(inputprev.find(".m_left")){
                	flag = inputprev.find(".m_ckb").attr("checked");
            
            	}   
            }
            if(flag&&rid&&MUSICLISTOBJ[rid]){
                playindex++;
                playarray[playarray.length] = "&s"+playindex+"="+MUSICLISTOBJ[rid];
            }
        });
        if(playindex>0){
            var playMusicString = ("n="+playindex+playarray.join(""));
            multipleMusicOption("AddTo",playMusicString);    
        }
    });
    $(".all_mv").live("click",function(){
        var playarray = [];
        var playindex = 0;
        $(".icon").each(function(){       
            var thisObj = $(this);
            var rid = thisObj.attr("data-rid");
            var flag = true;
            var inputprev = thisObj.parents("li");
            if(inputprev.parent().hasClass("copyright")){
                //musicOnline();
                flag = false;
            }else{
                if(inputprev.find(".m_left")){
                	flag = inputprev.find(".m_ckb").attr("checked");
            
            	}    
            }
            if(flag&&!thisObj.find(".m_mv").hasClass("m_mv_n")&&rid&&MUSICLISTOBJ[rid]){
                playindex++;
                playarray[playarray.length] = "&s"+playindex+"="+MUSICLISTOBJ[rid];
            }
        });
        if(playindex>0){
            var playMusicString = ("n="+playindex+playarray.join(""));
            multipleMusicOption("MV",playMusicString);    
        }
    });
    $(".all_down").live("click",function(){
        var playarray = [];
        var playindex = 0;
        $(".icon").each(function(){
            var thisObj = $(this);
            var rid = thisObj.attr("data-rid");
            var flag = true;
            var inputprev = thisObj.parents("li");
            if(inputprev.parent().hasClass("copyright")){
                //musicOnline();
                flag = false;
            }else{
                if(inputprev.find(".m_left")){
                	flag = inputprev.find(".m_ckb").attr("checked");
            
            	}    
            }
            if(flag&&rid&&MUSICLISTOBJ[rid]){
                playindex++;
                playarray[playarray.length] = "&s"+playindex+"="+MUSICLISTOBJ[rid];
            }
        });
        if(playindex>0){
            var playMusicString = ("n="+playindex+playarray.join(""));
            multipleMusicOption("Down",playMusicString);    
        }
    });
    // 单曲复选框
    $(".m_ckb").live("click",function(){
        var thisObj = $(this);
	    var flag = thisObj.attr("checked");
	    if(!flag){	
            $(".all_ckb").attr("checked",false);
	    }else{
		    var inputs = $(".m_ckb");
		    var someobj;
		    var check = true;
		    for(var i = 0,j=inputs.size();i<j;i++){
			    someobj = inputs.eq(i);
			    if(someobj.css("visibility")!="hidden"&&!someobj.attr("checked")){
				    check = false;
				    break;
			    }
		    }
	        $(".all_ckb").attr("checked",check);
	    }
    });
    //双击单曲条播放歌曲
    $(".music_wrap").live("dblclick", function () {
        if($(this).hasClass("copyright")){
            musicOnline();
            return;
        }
        var rid = $(this).find(".w_name").attr("data-rid");
        var playMusicString = MUSICLISTOBJ[rid];
        if (rid && playMusicString) {
            singleMusicOption("Play", playMusicString);
        }
    });
    var kk = true;
    //歌曲拖拽
    $(".music_wrap").live("mousedown", function (e) {
        var ev = e || event;
        if (typeof (ev.which) != "undefined" && ev.which == 3) {
            return;
        }
        currentX = ev.clientX;
        currentY = ev.clientY;
        isDragMusic = true;
        kk = true;
        var rid = $(this).find(".w_name").attr("data-rid");
        dragMusicString = MUSICLISTOBJ[rid];
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
                } else if (currentobj.is("input")) {
                    isDragMusic = false;
                    return false;
                } else {
                    if (kk) {
                        kk = false;
                        if($(this).hasClass("copyright")){
                            musicOnline();
                            return;
                        }
                        callClientNoReturn("Begindrag?song=" + dragMusicString);
                    }
                }
                return false;
            }
        });
    });
    $(".music_wrap").live("mouseup", function () {
        isDragMusic = false;
        $(this).unbind("mousemove");
    });
    // 全选框
    $(".all_ckb").live("click",function(){
        var thisObj = $(this);
	    var flag = thisObj.attr("checked");
	    if(!flag){	
            $(".m_ckb").attr("checked",false);
	    }else{
	        $(".m_ckb").attr("checked",true);
	    }
    });  
    $(".page a").live("click",function(){
		var oClass = $(this).attr("class");
		if (oClass.indexOf("no") > -1) return;	
		var goPnNum = $(this).html();
		if (goPnNum == '上一页') {
			pn = parseInt($(".page .current").html()) - 2;
		} else if (goPnNum == '下一页'){
			pn = parseInt($(".page .current").html());
		} else {
			pn = parseInt($(this).html()) -1;
		}
		$(window).scrollTop(0);	
		searchFunction(json);
	});	
	$(".all_playmv").live("click",function(){
	    try{
	    var mvString = "";
	    var htmlarray = [];
	    var PLAYOBJ;
		PLAYOBJ = MVLISTOBJ;
		var onlineflag = false;
	    var mvlistsize = PLAYOBJ.length;	
	    for (var i=0; i<PLAYOBJ.length; i++) {
	        var someobj = MVLISTOBJECT[i];
	        if(typeof(someobj)!="undefined"&&typeof(someobj.ONLINE)!="undefined"&&someobj.ONLINE.length==1&&someobj.ONLINE==0){
	            mvlistsize--;
	            onlineflag = true;
	            continue;
	        }
		    htmlarray[i] = "&s"+(i+1)+"="+returnSpecialChar(PLAYOBJ[i]);
	    }
	    if(onlineflag){
	        if(mvlistsize==0){
	            musicOnline();
	            return;
	        }else{
	            musicOnline(true);
	        }
	    }
	    mvString = ("n="+PLAYOBJ.length + htmlarray.join(''));
	    multipleMusicOption("MV",mvString);	
	    }catch(e){}
	    return false;
    });	
    $(window).scroll(function(){
    	var contentTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
        if (contentTop > 15) {
        	$(".w_rtop").show();
        } else {
        	$(".w_rtop").hide();
        }
    });
	try{
	    searchFunction(json);
	}catch(e){
	}
});
var MVLISTOBJ = [];
var MVLISTOBJECT = [];

//document.oncontextmenu  = function(){return false};
document.onselectstart = function(){if(event.srcElement.tagName!="TEXTAREA"){return false}};
document.ondragstart = function(){return false};
document.onbeforecopy = function(){if(event.srcElement.tagName!="TEXTAREA"){return false}};
document.oncopy = function(){if(event.srcElement.tagName!="TEXTAREA"){document.selection.empty()}};
document.onselect = function() {if(event.srcElement.tagName!="TEXTAREA"){document.selection.empty()}};
if(isIE){
	 document.onclick = function() {if(event.shiftKey){if(event.srcElement.tagName!="INPUT"){return false;}}};
}
var check = function(e) {
	e = e || window.event;
	if((e.which || e.keyCode) == 116 || (e.ctrlKey && (e.which || e.keyCode) == 82)) {
		if(e.preventDefault) {
			e.preventDefault();
		} else {
			event.keyCode = 0;
			e.returnValue = false;
		}
	}
}

;(function(){
	var zindex=10;
	var ele=[];
	$('.bmv_earth').live('click',function(ev){
		$('.sourceTips').hide();
		var oBox=$(this)[0].parentNode.parentNode;
		ele[0]=oBox;
		var oEvent= ev || event;
		var _this=$(this);
		var oTip=$(oBox).find('.sourceTips');
		ele[1]=oTip;
		var liLen=$(this).parents('ul').children().length;
		var index=oBox.getAttribute('data-index');
		var rid=$(this).parents('.bmv_wrap').attr('data-rid');
		var url='http://datacenter.kuwo.cn/d.c?cmd=query&ft=music&cmkey=mbox_minfo&resenc=utf8&ids='+rid+'&callback=mvEarth';
		$.getScript(url,function(){
			var text='';
			if(jsondata.tag.length>42){
				text=jsondata.tag.substring(0,41)+'...';
			}else{
				text=jsondata.tag;
			}
			oTip[0].children[2].innerHTML='来源：'+text;
		});
		
		var clientWidth=document.documentElement.clientWidth;
		if(oEvent.clientX<Math.floor(clientWidth/2)){
			$(oTip).addClass('sourceTips2');
		}else{
			$(oTip).removeClass('sourceTips2');
		}
		zindex++;
		oBox.style.zIndex=zindex;
		oTip.show();
		return false;
	});
	var fobj = window.parent;
	fobj.window.onresize=function (){
		var clientWidth=fobj.document.documentElement.clientWidth;
		if(ele[0]){
			setTimeout(function(){
				var eleLeft=ele[0].offsetLeft;
				if(eleLeft<Math.floor(clientWidth/2)-50){
					$(ele[1]).addClass('sourceTips2');
				}else{
					$(ele[1]).removeClass('sourceTips2');
				}
			}, 200);
		}
		else{
			return false;
		}
	}
})();

$(document).live('click',function (){
	$('.sourceTips').hide();
});
/**
 * 小地球点击事件
 * @param  {[type]} ev){	var oTip          [description]
 * @return {[type]}           [description]
 */
$('.earth').live('click',function(ev){
	var oTip=$(this).parents('.music_wrap').find('.sourceTips');
	var oBox=$(this).parents('.music_wrap');
	oTip=oTip[0];
	oBox=oBox[0];
	var oEvent= ev || event;
	var _this=$(this);
	var liLen=$(this).parents('ul').children().length/2;
	var index=_this.parents(".music_wrap").attr('data-index');
	$('.sourceTips').hide();
	$('.ugc_tipsBox').hide();
	var earthTop = $(this).offset().top;
	var rid=$(this).parents(".music_wrap").attr('c-rid').replace("MUSIC_","");
	var url='http://datacenter.kuwo.cn/d.c?cmd=query&ft=music&cmkey=mbox_minfo&resenc=utf8&ids='+rid+'&callback=loadMusicOrigin';
	$.getScript(url,function(){
		var text='';
		if(jsondata.tag.length>35){
			text=jsondata.tag.substring(0,34)+'...';
		}else{
			text=jsondata.tag;
		}
		oTip.children[2].innerHTML='来源：'+text;
	});
	if(liLen<5){
		oBox.parentNode.style.height=liLen*oBox.offsetHeight+50+'px';
		$(oTip).addClass('sourceTips2');
		oTip.style.top=(earthTop+22)+'px';
		$(oTip).show();
	}else{
		if(liLen-index<10){
			oTip.style.top=(earthTop-90)+'px';
			$(oTip).show();
		}else if(index<3){
			$(oTip).addClass('sourceTips2');
			oTip.style.top=(earthTop+22)+'px';
			$(oTip).show();
		}else if(liLen-index<3){
			oTip.style.top=(earthTop-90)+'px';
			$(oTip).show();
		}else{
			oTip.style.top=(earthTop-90)+'px';
			$(oTip).show();
		}
	}
	return false;
});

/**
 * 小地球弹窗关闭
 * @param  {[type]} ){	$(this).parent().hide();} [description]
 * @return {[type]}                                [description]
 */
$('.j_earthBtn').live('click',function(){
	$(this).parent().hide();
});

// hover 歌曲列表显示TIPS
$(".music_wrap").live("mouseenter",function(){
	var rid = $(this).attr("c-rid").replace("MUSIC_","")
	var url='http://datacenter.kuwo.cn/d.c?cmd=query&ft=music&cmkey=mbox_minfo&resenc=utf8&ids='+rid+'&callback=tips';
	var _this = $(this);
	$.getScript(url,function(){
		var text='';
		var reg =/来源.*/;
		text=jsondata.tag;
		setTimeout(function(){
			var from = _this.attr("title").replace(reg,"来源："+text).replace(/审批文号.*/,"").replace(/MV出品人.*/,"");
			_this.attr("title",from);
		},500);
		
	});
	if(isIE6) $(this).addClass("music_wraphover");
});

//hover 歌曲列表显示TIPS
$(".music_wrap").live("mouseleave",function(){
	if(isIE6) $(this).removeClass("music_wraphover");
});
//music  hover时显示的tips

function getMusicTips(name,artist,albumName,rid){
	try{
		var tips = "";
		var tipsarray = [];
		var xia = 0;
		tipsarray[xia++] = '歌名：';
		tipsarray[xia++] = checkSpecialChar(name,"titlename");
		if(artist){
			tipsarray[xia++] = '&#13;歌手：';
			tipsarray[xia++] = checkSpecialChar(artist,"titlename");
		}		
		if(albumName){
			tipsarray[xia++] = '&#13;专辑：';
			tipsarray[xia++] = checkSpecialChar(albumName,"titlename");
		}
		tipsarray[xia++] = '&#13;来源：加载中...';
		tipsarray[xia++] = '&#13;审批文号：加载中...';
		tipsarray[xia++] = '&#13;MV出品人：加载中...';
		tips = tipsarray.join('');
		tipsarray = null;
		return tips;
	}catch(e){}
}

// ie6 列表字符串截取
function ie6SubStr(str,num1,num2){
	if(isIE6){
		if(testStrScale(str)){

			if(!(str.length<num1)){
				str=str.substring(0,num1)+"...";
			}

			return str;
		}else{
			if(!(str.length<num2)){
				str=str.substring(0,num2)+"...";
			}
			return str;
		}
	}else{
		return str;
	}
}

function testStrScale(str){
	var eLen=0;
	var oLen=0;
	for(var i=0; i<str.length; i++){
		if(str.charCodeAt(i)>255){
			oLen++;
		}else{
			eLen++;
		}
	}
	if((eLen/(eLen+oLen))>0.5){
		return true;
	}else{
		return false;
	}
}
function jsonError(e){

}

// 辅助函数
function callClient(call){
	try{
		return window.external.callkwmusic(call);
	}catch(e){
		return "";
	}
}

function callClientNoReturn(call){
	try{
		return window.external.callkwmusic(call,0);
	}catch(e){
		return "";
	}
}

// 弹幕 多版本相关
function getTanMuMVIconStr(someObj){
    var tanmuiconstr = "";	
    var ispoint = someObj.IS_POINT;
    if(typeof(ispoint)=="undefined"){
    	ispoint = someObj.ispoint;	
    }     
    if(typeof(ispoint)=="undefined"){
    	ispoint = someObj.is_point;
    }
    if(typeof(ispoint)!="undefined"&&ispoint==1){
    	tanmuiconstr = "<b class='tm_mv'></b>";
    }
    return tanmuiconstr;
}
function getTanMuIconStr(someObj){
    var tanmuiconstr = "";	
    var ispoint = someObj.IS_POINT;
    if(typeof(ispoint)=="undefined"){
    	ispoint = someObj.ispoint;	
    }     
    if(typeof(ispoint)=="undefined"){
    	ispoint = someObj.is_point;
    }
    var hasmv = false;	
    if(typeof(someObj.MKVRID)!="undefined"&&someObj.MKVRID.substring(someObj.MKVRID.indexOf("_")+1)>0){

        hasmv = true;
    }else if(typeof(someObj.param)!="undefined"){
        var param = someObj.param;
        if(param.indexOf("MKV_")>0&&param.indexOf("MKV_0")<0){
            hasmv = true;
        }else if(param.indexOf("MV_")>0&&param.indexOf("MV_0")<0){
            hasmv = true;
        }
    }else if(typeof(someObj.params)!="undefined"){
        var params = someObj.params;
        if(params.indexOf("MKV_")>0&&params.indexOf("MKV_0")<0){
            hasmv = true;
        }else if(params.indexOf("MV_")>0&&params.indexOf("MV_0")<0){
            hasmv = true;
        } 
    }
    if(typeof(ispoint)!="undefined"&&ispoint==1&&hasmv){
    	tanmuiconstr = "<b title='弹幕' onclick='openTanMu(this);return false;'></b>";
    }
    return tanmuiconstr;
}
function getPointNum(someObj){
    var pointnum = someObj.ispoint;
    if(typeof(pointnum)=="undefined"){
        pointnum = someObj.is_point;
    }
    if(typeof(pointnum)=="undefined"){
        pointnum = someObj.IS_POINT;
    }
    if(typeof(pointnum)!="undefined"&&pointnum==1){
        pointnum = 1;
    }else{
        pointnum = 0;
    }
    return pointnum;
}
function getMultiVerNum(someObj){
    var multivernum = someObj.mutiver;
    if(typeof(multivernum)=="undefined"){
        multivernum = someObj.muti_ver;
    } 
    if(typeof(multivernum)=="undefined"){
        multivernum = someObj.MUTI_VER;
    }    
    if(typeof(multivernum)=="undefined"||multivernum.length==0){
        multivernum = 0;
    }
    return multivernum;
}
// 获取歌曲是否为付费歌曲
function getPayNum(someObj){
    var paynum = someObj.pay;
    if(typeof(paynum)=="undefined"){
        paynum = someObj.PAY;
    }
    if(typeof(paynum)=="undefined"){
        paynum = 0;
    }
    return paynum;
}
// 获取歌曲歌手id
function getArtistID(someObj){
    var artistid = someObj.artistid;
    if(typeof(artistid)=="undefined"){
        artistid = someObj.ARTISTID;
    }
    if(typeof(artistid)=="undefined"){
        artistid = 0;
    }
    return artistid;
}
// 获取歌曲专辑id
function getAlbumID(someObj){
    var albumid = someObj.albumid;
    if(typeof(albumid)=="undefined"){
        albumid = someObj.ALBUMID;
    }
    if(typeof(albumid)=="undefined"){
        albumid = 0;
    }
    return albumid;
}

// 获取歌曲 播放 下载 具体收费类型 是否需要添加money展示 0xDCBA A:音频播放B:音频下载C:视频播放D:视频下载
function getMoney(someObj,type){
    var moneyicon = "";
    //var isopen = callClient("OpenChargeSong");
    if(isopen!=1){
        return moneyicon;
    }
    var paynum = someObj.pay;
    if(typeof(paynum)=="undefined"){
        paynum = someObj.PAY;
    }
    if(typeof(paynum)!="undefined"){
        try{
            paynum = parseInt(paynum,10);
            paynum = paynum.toString(16);
            if(type=="play"){
                paynum = paynum.substr(paynum.length-1,1);
            }else if(type=="down"){
                paynum = paynum.substr(paynum.length-2,1);    
            }
            paynum = (paynum.toLocaleLowerCase()=="f")||paynum&1;
            if(paynum!=0){
                moneyicon = "<em></em>";
            }
        }catch(e){}
    }
    return moneyicon;
}
function getCopyrightClass(someObj){
    var online = someObj.ONLINE;
    var classstr = "";
    if(typeof(online)!="undefined"&&online.length==1&&online==0){
        classstr = "copyright";
    } 
    return classstr;
}
function openTanMu(obj){

    if($(obj).parentsUntil("ul").hasClass("copyright")){

        musicOnline();
        return;
    }
    var rid = $(obj).parents("li").attr("c-rid");
    if(rid&&MUSICLISTOBJ[rid]){
        var playMusicString = MUSICLISTOBJ[rid];
        singleMusicOption("MV",playMusicString+"&tanmustarted=1");
    }  
}
function getHqLevel(obj){
    var formats = "";
    if(typeof(obj.formats)!="undefined"){
        formats = obj.formats;
    }else if(typeof(obj.FORMATS)!="undefined"){
        formats = obj.FORMATS;
    }
	var levelclass = "";
	if(formats.indexOf('AL')>=0){
		levelclass = "aq";
	}else if(formats.indexOf('MP3H')>=0){
		levelclass = "sq";
	}else if(formats.indexOf('MP3192')>=0){
		levelclass = "sq";
	}else if(formats.indexOf('WMA128')>=0){
		levelclass = "hq";
	}else if(formats.indexOf('WMA96')>=0){
		levelclass = "lq";
	}
	return levelclass;
}

function saveMusicInfo(obj){
    var musicstringarray = [];
    var musici = 0;
    musicstringarray[musici++] = encodeURIComponent(returnSpecialChar(obj.SONGNAME));
	musicstringarray[musici++] = encodeURIComponent(returnSpecialChar(obj.ARTIST));
	musicstringarray[musici++] = encodeURIComponent(returnSpecialChar(obj.ALBUM));
	musicstringarray[musici++] = obj.NSIG1;
	musicstringarray[musici++] = obj.NSIG2;
	musicstringarray[musici++] = obj.MUSICRID;
	musicstringarray[musici++] = obj.MP3NSIG1;
	musicstringarray[musici++] = obj.MP3NSIG2;
	musicstringarray[musici++] = obj.MP3RID;
	musicstringarray[musici++] = obj.MKVNSIG1;
	musicstringarray[musici++] = obj.MKVNSIG2;
	musicstringarray[musici++] = obj.MKVRID;
	musicstringarray[musici++] = obj.HASECHO;
	var psrc = "VER=2015;FROM=曲库->\""+searchSourceKey+"\"的搜索结果->歌词列表";
	psrc = encodeURIComponent(psrc);
	musicstringarray[musici++] = psrc;
	musicstringarray[musici++] = obj.FORMATS;
	musicstringarray[musici++] = getMultiVerNum(obj);
	musicstringarray[musici++] = getPointNum(obj);
	musicstringarray[musici++] = getPayNum(obj);
	musicstringarray[musici++] = getArtistID(obj);
	musicstringarray[musici++] = getAlbumID(obj);
	musicString = musicstringarray.join('\t');
	musicString = encodeURIComponent(musicString);
	MUSICLISTOBJ[obj.MUSICRID] = musicString;
}

function rnd(n,m){
	return parseInt(n+Math.random()*(m-n));
}
function getAlbumPrefix(pic){
	//var num = getImgNumber(pic);
	var num = rnd(1,5);
	var prefix;
	prefix = "http://img"+num+".sycdn.kuwo.cn/star/albumcover/";
	return prefix;
}

function getMVPrefix(pic){
	//var num = getImgNumber(pic);
	var num = rnd(1,5);
	var prefix;
	prefix = "http://img"+num+".sycdn.kuwo.cn/wmvpic/";
	return prefix;
}
function checkChinese(str){
	if (escape(str).indexOf("%u")<0){
	  return false;
	}else{
	  return true;
	}
}

function someMV(obj){
    if($(obj).parentsUntil("ul").hasClass("copyright")){
        musicOnline();
        return;
    }
    singleMusicOption("MV",($(obj).attr("data-mv")));
}
function singleMusicOption(option,musicString,mdcode){
	var call = "";
	var musicstr = returnSpecialChar(musicString);
	if(option=="MV"){
		call = "Play?mv=1&n=1&s1="+musicstr;
	}else if(option=="ShowHQ"){
		call = "SelQuality?mv=0&n=1&s1="+musicstr+"&mediacode="+mdcode+"&play=1";
	}else{
		call = option+"?mv=0&n=1&s1="+musicstr;
	}
	callClientNoReturn(call);
	musicstr = null;
	call = null;
}

function getUserID(s){
	var clientString = callClient("UserState?src=user");
	var clientid = getValue(clientString,s);
	if(clientid==""){
		clientid = 0;
	}
	return clientid;
}
function getHashCode(str){
	var hash = 0;
	var len = str.length;
	if (len == 0) return hash;
	for (i = 0 ; i < len; i++) {
		var ch = "";
		ch = str.charCodeAt(i);
		hash = ((hash<<5)-hash)+ch;
		hash = hash & hash;
	}
	if(hash<0){
		hash = - hash;
	}
	return hash;
}
function getImgNumber(pic){
	var num = (getHashCode(pic+getUserID("devid"))%10)+1;
	if(num>=5){
		if(num>=8){
			num = 4;
		}else{
			num = 3;
		}
	}else{
		if(num>=2){
			num = 2;
		}
	}
	return num;
}
function getArtistPrefix(pic){
	//var num = getImgNumber(pic);
	var num = rnd(1,5);
	var prefix;
	prefix = "http://img"+num+".sycdn.kuwo.cn/star/starheads/";
	return prefix;
}
function jumpQK(source,sourceid,name,id,extend,other){
	//var channelInfo = "{'source':'-2','sourceid':'4','name':'3','id':'-2'};name:歌手;";
    //callClient('Jump?channel=songlib&param={\'source\':\''+source+'\',\'sourceid\':\''+sourceid+'\',\'name\':\''+encodeURIComponent(encodeURIComponent(name))+'\',\'id\':\''+id+'\',\'extend\':\'\',\'other\':\''+encodeURIComponent(other)+'\',\'back\':\'true\'};' + encodeURIComponent('jump:'+channelInfo));
	var channelInfo = '';
	var src = '';
	var channelName='';
    switch(source){
    	case 40:
    		channelInfo = "ch:10002;name:classify;";
    		channelName = 'classify';
    		src = "content_djzone.html?";
    		break;
    	case 1:
    		channelInfo = "ch:10004;name:bang;";
    		channelName = 'bang';
    		src = "content_bang.html?";
    		break;
    	case 13:
    		channelInfo = "ch:10003;name:artist;";
    		channelName = 'artist';
    		src = "content_album.html?";
    		break;
    	case 8:
    		channelInfo = "ch:2;name:songlib;";
    		channelName = 'songlib';
    		src = "content_gedan.html?";
    		break;
    	case 12:
    		channelInfo = "ch:2;name:songlib;";
    		channelName = 'songlib';
    		src = "content_gedan.html?";
    		break;
    	default:
    		channelInfo = "ch:10003;name:artist;";
    		channelName = 'artist';
    		src = "content_artist.html?";
    		break;
    }
    
    var param="{\'source\':\''+source+'\',\'sourceid\':\''+sourceid+'\',\'name\':\''"+encodeURIComponent(encodeURIComponent(name))+"'\',\'id\':\''+id+'\',\'extend\':\'\',\'other\':\''"+encodeURIComponent(other)+"'\',\'back\':\'true\'};";
   	var info='source='+source+'&sourceid='+sourceid+'&name='+name+'&id='+id+'&other='+other;
   	src = src+info;
    //var call = "PageJump?param="+encodeURIComponent(param) + ";" + encodeURIComponent(channelInfo)+ ";" +encodeURIComponent('url:${netsong}'+src)+'&calljump=true';
    //callClient(call);
    callClientNoReturn('Jump?channel='+channelName+'&param={\'source\':\''+source+'\',\'sourceid\':\''+sourceid+'\',\'name\':\''+encodeURIComponent(encodeURIComponent(name))+'\',\'id\':\''+id+'\',\'extend\':\'\',\'other\':\''+encodeURIComponent(other)+'\',\'back\':\'true\'};' + encodeURIComponent('url:${netsong}'+src) + ';' + encodeURIComponent('jump:'+channelInfo));
}

function createPage(total, currentPg) {
    var pageHtml = '';
    if (total > 1) {
        if (currentPg != 1) {
            pageHtml += '<a hidefocus href="###" class="next">上一页</a>';
        } else {
            pageHtml += '<a hidefocus href="###" class="nonext">上一页</a>';
        }
        pageHtml += '<a hidefocus  href="###" ' + (currentPg == 1 ? 'class="current"' : 'class=""') + '>1</a>';
        if (currentPg > 4) pageHtml += '<span class="point">...</span>';
        
        for (var i = (currentPg >= 4 ? (currentPg - 2) : 2) ; i <= (currentPg + 2 >= total ? (total - 1) : (currentPg + 2)) ; i++) {
            if (currentPg == i) {
                pageHtml += '<a hidefocus href="###" class="current">' + i + '</a>';
            } else {
                pageHtml += '<a hidefocus href="###" class="">' + i + '</a>';
            }
        }
        if (currentPg + 3 < total) pageHtml += '<span class="point">...</span>';
        if (total != 1) pageHtml += '<a hidefocus href="###" ' + (currentPg == total ? 'class="current"' : 'class=""') + '>' + total + '</a>';
        if (currentPg != total) {
            pageHtml += '<a hidefocus href="###" class="prev">下一页</a>';
        } else {
            pageHtml += '<a hidefocus href="###" class="noprev">下一页</a>';
        }
    }
    return pageHtml;
}

function iPlay(evt, source, sourceid) {
    if (source == 4) {
        var url = "http://search.kuwo.cn/r.s?stype=artist2music&artistid=" + sourceid + "&pn=0&rn=100&callback=playArtistMusic&show_copyright_off=1&alflac=1";
        $.getScript(getChargeURL(url));
    } else if (source == 13) {
        var url = "http://search.kuwo.cn/r.s?stype=albuminfo&albumid=" + sourceid + "&callback=playAlbumMusic&show_copyright_off=1&alflac=1";
        $.getScript(getChargeURL(url));
    } else if (source == 8){
    	var url = "http://nplserver.kuwo.cn/pl.svc?op=getlistinfo&pid=" + sourceid + "&pn=0&rn=100&callback=playGeDanMusic&encode=utf-8&keyset=pl2012&identity=kuwo";
        $.getScript(getChargeURL(url));
    }
    if (isIE) {
        event.cancelBubble = true;
    } else {
        evt.stopPropagation();
    }
}
function playGeDanMusic(jsondata) {
    var data = jsondata;
    if (typeof (data) == "undefined" || data == null || typeof (data.musiclist) == "undefined") {
        return;
    }
    var musicList = data.musiclist;
    var musicSize = musicList.length;
    var bigString = "";
    bigString = playMusicBigString(musicList, true);
    callClientNoReturn("Play?mv=0&n=" + musicSize + bigString);
    musicList = null;
    bigString = null;
    data = null;
}
function playArtistMusic(jsondata) {
    var data = jsondata;
    if (typeof (data) == "undefined" || data == null || typeof (data.musiclist) == "undefined") {
        return;
    }
    var musicList = data.musiclist;
    var musicSize = musicList.length;
    var bigString = "";
    bigString = playMusicBigString(musicList, false);
    callClientNoReturn("Play?mv=0&n=" + musicSize + bigString);
    musicList = null;
    bigString = null;
    data = null;
}
function playAlbumMusic(jsondata) {
    var data = jsondata;
    if (typeof (data) == "undefined" || data == null || typeof (data.musiclist) == "undefined") {
        return;
    }
    var musicList = data.musiclist;
    var musicSize = musicList.length;
    var artistid = data.artistid;
    var albumid = data.albumid;
    for (var i = 0; i < musicSize; i++) {
        musicList[i].artistid = artistid;
        musicList[i].albumid = albumid;
    }
    var bigString = "";
    bigString = playMusicBigString(musicList, true);
    callClientNoReturn("Play?mv=0&n=" + musicSize + bigString);
    bigString = null;
    musicList = null;
    data = null;
}
function playMusicBigString(objs, flag) {
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
    var onlineflag = false;
    if (flag) {
        for (var i = 0; i < musicSize; i++) {
            someObj = musicList[i];
            if(typeof(someObj.online)!="undefined"&&someObj.online.length==1&&someObj.online==0){
                onlineflag = true;
                continue;
            }
            param = someObj.param;
            if (typeof (param) == "undefined") {
                param = someObj.params;
            }
            param = returnSpecialChar(param);
            paramArray = param.split(";");
            childArray = [];
            musicString = "";
            for (var j = 0; j < paramArray.length; j++) {
                if (j < 3) {
                    childArray[j] = encodeURIComponent(returnSpecialChar(paramArray[j]));
                } else {
                    childArray[j] = paramArray[j];
                }
            }
            musicString = childArray.join('\t');
            musicridnum = paramArray[5];
            if (musicridnum.indexOf("MUSIC") > -1) {
                musicridnum = musicridnum.substring(6);
            }
            childArray = null;
            paramArray = null;
            musicstringarray = [];
            musicstringarray[0] = musicString;
            var psrc = "VER=2015;FROM=曲库->\""+searchSourceKey+"\"的搜索结果->专辑列表";
            psrc = encodeURIComponent(psrc);
            musicstringarray[musicstringarray.length] = psrc;
		    musicstringarray[musicstringarray.length] = someObj.formats;
		    musicstringarray[musicstringarray.length] = getMultiVerNum(someObj);
		    musicstringarray[musicstringarray.length] = getPointNum(someObj);
		    musicstringarray[musicstringarray.length] = getPayNum(someObj);
		    musicstringarray[musicstringarray.length] = getArtistID(someObj);
		    musicstringarray[musicstringarray.length] = getAlbumID(someObj);
            musicString = musicstringarray.join('\t');
            musicstringarray = null;
            musicString = encodeURIComponent(musicString);
            sarray = [];
            si = 0;
            sarray[si++] = '&s';
            sarray[si++] = (i + 1);
            sarray[si++] = '=';
            sarray[si++] = musicString;
            bigarray[bigarray.length] = sarray.join('');
            sarray = null;
        }
    } else {
        for (var i = 0; i < musicSize; i++) {
            someObj = musicList[i];
            if(typeof(someObj.online)!="undefined"&&someObj.online.length==1&&someObj.online==0){
                onlineflag = true;
                continue;
            }
            rid = "MUSIC_" + someObj.musicrid;
            mp3rid = "MP3_" + someObj.mp3rid;
            mvrid = "MV_" + someObj.mkvrid;
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
            var psrc = "VER=2015;FROM=曲库->\""+searchSourceKey+"\"的搜索结果->歌手列表";
            psrc = encodeURIComponent(psrc);
            musicstringarray[xia++] = psrc;
            musicstringarray[xia++] = someObj.formats;
		    musicstringarray[xia++] = getMultiVerNum(someObj);
		    musicstringarray[xia++] = getPointNum(someObj);
		    musicstringarray[xia++] = getPayNum(someObj);
		    musicstringarray[xia++] = getArtistID(someObj);
		    musicstringarray[xia++] = getAlbumID(someObj);
            musicString = musicstringarray.join('\t');
            musicstringarray = null;
            musicString = encodeURIComponent(musicString);
            sarray = [];
            si = 0;
            sarray[si++] = '&s';
            sarray[si++] = (i + 1);
            sarray[si++] = '=';
            sarray[si++] = musicString;
            bigarray[bigarray.length] = sarray.join('');
            sarray = null;
        }
    }
    bigString = bigarray.join('');
    musicList = null;
    // try{
    // if(onlineflag){
    //     if(bigarray.length==0){
    //         musicOnline();    
    //     }else{
    //         musicOnline(true);
    //     }
    // }
    // }catch(e){}
    try{
    if(onlineflag){
        if(bigarray.length==0){
            musicOnline();    
        }
    }
    }catch(e){}
    return bigString;
}

function centerLoadingStart(){
    $(".w_loading").remove();
    $("body").append("<div class='w_loading'><img src='img/loading.gif' alt='' /></div>");    
}
function bottomLoadingStart(){
    centerLoadingStart();
}
function centerLoadingEnd(){
    $(".w_loading").remove();
}
function bottomLoadingEnd(){
    centerLoadingEnd();
}
String.prototype.gblen = function() {
	var len = 0;
	for ( var i = 0; i < this.length; i++) {
		if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
			len += 2;
		} else {
			len++;
		}
	}
	return len;
}
function cutStrByGblen(str, gblen){
    if (str.gblen() <= gblen) {
	    return str;
    } else {
	    var baseCut = Math.floor((gblen - 1) / 2);
	    var result = str.substring(0, baseCut);
	    var nowGblen = result.gblen();
	    if (nowGblen < gblen) {
		    for ( var i = baseCut, len = str.length; i < len; i++) {
			    var charGblen = str.charAt(i).gblen();
			    if (nowGblen + charGblen <= gblen - 1) {
				    result += str.charAt(i);
				    nowGblen += charGblen;
			    } else {
				    var dotNum = gblen - nowGblen;
				    if(dotNum>0){
					    result += '...';
				    }
				    return result;
			    }
		    }
	    }
    }
}

function returnSpecialChar(s){
    s = ''+s;
	return s.replace(/\&amp;/g,"&").replace(/\&nbsp;/g," ").replace(/\&apos;/g,"'").replace(/\&quot;/g,"\"").replace(/\%26apos\%3B/g,"'").replace(/\%26quot\%3B/g,"\"").replace(/\%26amp\%3B/g,"&");
}
function checkSpecialChar(s,usetype){
	if (!s) return '';
    s = ''+s;
    if(usetype=="titlename"){
        return s.replace(/\&apos;/g,"'").replace(/\"/g,"&quot;").replace(/\&amp;apos;/g,"'");
    }else if(usetype=="name"){
        return s.replace(/\"/g,"&quot;").replace(/\'/g,"\\\'").replace(/\&apos;/g,"\\\'").replace(/\&#039;/g,"\\\'");
    }else if(usetype=="disname"){
        return s.replace(/\&quot;/g,"\"").replace(/\&apos;/g,"\'").replace(/\&nbsp;/g," ").replace(/&amp;/g,"&").replace(/\%26apos\%3B/g,"'").replace(/\%26quot\%3B/g,"\"").replace(/\%26amp\%3B/g,"&");
    }
    return s.replace(/\&/g,"&amp;").replace(/\"/g,"&quot;").replace(/\'/g,"\\\'").replace(/\&amp;apos;/g,"&#039;");
}

function windowOpen(url) {
    var backstr = callClient("OpenBrowser?browser=default&url=" + encodeURIComponent(url));
    if (backstr != 1) {
        window.open(url);
    }
}
function obj2Str(obj) {
	switch(typeof(obj)) {
		case 'object':
			var ret = [];
			if( obj instanceof Array) {
				for(var i = 0, len = obj.length; i < len; i++) {
					ret.push(obj2Str(obj[i]));
				}
				return '[' + ret.join(',') + ']';
			} else if( obj instanceof RegExp) {
				return obj.toString();
			} else {
				for(var a in obj) {
					ret.push("\""+a+"\""+ ':' + obj2Str(obj[a]));
				}
				return '{' + ret.join(',') + '}';
			}
		case 'function':
			return 'function() {}';
		case 'number':
			return obj.toString();
		case 'string':
			return "\"" + obj.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function(a) {
				return ("\n" == a) ? "\\n" : ("\r" == a) ? "\\r" : ("\t" == a) ? "\\t" : "";
			}) + "\"";
		case 'boolean':
			return obj.toString();
		default:
			return obj.toString();
	}
}

function getVersion(){
	if(version==""){
		version = callClient("GetVer");
	}
	return version;
}
function getValue(url,key){
    url = url.toString();
	if(url.indexOf('#')>=0){
		url = url.substring(0,url.length-1);
	}
	var value='';
	var begin = url.indexOf(key + '=');
	if(begin>=0){
		var tmp = url.substring(begin + key.length + 1);
		var eqIdx = tmp.indexOf('=');
		var end = 0;
		if(eqIdx>=0){
			tmp = tmp.substring(0,eqIdx);
			end = tmp.lastIndexOf('&');
		}else{
			end = tmp.length;
		}
		if(end>=0){
			try{
				value = decodeURIComponent(tmp.substring(0,end));
			}catch(e){
				value = tmp.substring(0,end);
			}
		}else{
			try{
				value = decodeURIComponent(tmp);
			}catch(e){
				value = tmp;
			}
		}
	}
	return value;
}
function imgOnError(obj,type){
    var src = "";
    if(type==100){
        src = "img/def100.jpg";
    }else if(type==90){
        src = "img/def90.jpg";
    }else if(type==120){
    	src = "img/def120.png";
    }else if(type==140){
        src = "img/def140.jpg";
    }else if(type==60){
        src = "img/def60.jpg";
    }else if(type==76){
        src = "img/def76.jpg";
    }
    obj.src = src;
    obj.onerror = null;
}
function singleMusicOption(option,musicString,mdcode){
	var call = "";
	var musicstr = returnSpecialChar(musicString);
	if(option=="MV"){
		call = "Play?mv=1&n=1&s1="+musicstr;
	}else if(option=="ShowHQ"){
		call = "SelQuality?mv=0&n=1&s1="+musicstr+"&mediacode="+mdcode+"&play=1";
	}else{
		call = option+"?mv=0&n=1&s1="+musicstr;
	}
	callClientNoReturn(call);
	musicstr = null;
	call = null;
}
function multipleMusicOption(option,musicString,mdcode,ispack){
	var call = "";
	var musicstr = returnSpecialChar(musicString);
	if(option=="Add"){
        option = "AddTo";
	}
	if(option=="MV"){
		call = "Play?mv=1&"+musicstr;
	}else{
	    if(ispack===true){
	        call = "PackDown?mv=0&"+musicstr;
	    }else{
	        call = option+"?mv=0&"+musicstr;
	    }
	}
	callClientNoReturn(call);
	musicstr = null;
	call = null;
}

// 操作歌曲下线的歌曲
function musicOnline(flag){
    var type = 1;
    if(flag){
        type = 2;
    }
    callClientNoReturn("CopyrightDlg?type="+type);
}
// 请求url是否根据 付费的开关添加vipver请求参数
function getChargeURL(url){
    if(getChargeIsOpen()){
        url = url+"&vipver="+getVersion();
    }
    if(url.indexOf('search.kuwo.cn') > 0 && url.indexOf('plat=pc') < 0){
        url = url  + '&plat=pc&devid=' + getUserID("devid");
    }
    return url;
}
// 付费开关
function getChargeIsOpen(){
    var isopen = callClient("OpenChargeSong");
    //isopen = 1;
    if(isopen!=1){
        return false;
    }
    return true;
}

// 获取歌单图片
function getPlaylistPic(picUrl,picSize){
    if(picUrl.indexOf("userpl2015") > -1 || picUrl.indexOf("luger") > -1){
        if("100 120 150 300 700".indexOf(picSize) > -1){
            if(picSize == 300){
                return picUrl.replace("_150.jpg","b.jpg");
            }else{
                return picUrl.replace("_150.jpg","_"+picSize+".jpg");
            }
        }
    }else if(picUrl.indexOf("userpl2013") > -1){
        if("100 120 150 300".indexOf(picSize) > -1){
            if(picSize == 300){
                return picUrl.replace("_100.jpg","b.jpg");
            }else{
                return picUrl.replace("_100.jpg","_"+picSize+".jpg");
            }
        }
    }else if(picUrl.indexOf("playlist") > -1){
        if("70 100 300 150".indexOf(picSize) > -1){
            if(picSize == 300){
                return picUrl;
            }else if(picSize == 70){
                return picUrl.replace("_.jpg","_s.jpg");
            }else if(picSize == 100){
                return picUrl.replace("_.jpg","_100.jpg");
            }else if(picSize == 150){
                return picUrl.replace("_.jpg","_100.jpg");
            }else{
                return picUrl;
            }
        }
    }else{
        return picUrl;
    }
}

// 替换图片服务器域名  传入图片地址 如果有img1 2 3 4域名的随机返回一个
function changeImgDomain(url){
	var newurl = url;
	//var num = getImgNumber(url);
	var num = rnd(1,5);
	var imgDomain = ".sycdn.kuwo.cn";
	newurl = newurl.replace(":81","");
	if(newurl.indexOf("star.kwcdn.kuwo.cn")>-1){
		newurl = newurl.replace("star.kwcdn.kuwo.cn","img"+num+imgDomain);
	}else if(newurl.indexOf("img1.kwcdn.kuwo.cn")>-1){
		newurl = newurl.replace("img1.kwcdn.kuwo.cn","img"+num+imgDomain);
	}else if(newurl.indexOf("img2.kwcdn.kuwo.cn")>-1){
		newurl = newurl.replace("img2.kwcdn.kuwo.cn","img"+num+imgDomain);
	}else if(newurl.indexOf("img3.kwcdn.kuwo.cn")>-1){
		newurl = newurl.replace("img3.kwcdn.kuwo.cn","img"+num+imgDomain);
	}else if(newurl.indexOf("img4.kwcdn.kuwo.cn")>-1){
		newurl = newurl.replace("img4.kwcdn.kuwo.cn","img"+num+imgDomain);
	}else if(newurl.indexOf("star.kuwo.cn")>-1){
		newurl = newurl.replace("star.kuwo.cn","img"+num+imgDomain);
	}else if(newurl.indexOf("img1.kuwo.cn")>-1){
		newurl = newurl.replace("img1.kuwo.cn","img"+num+imgDomain);
	}
	if(newurl.indexOf("albumcover/180")>-1){
		newurl = newurl.replace("albumcover/180","albumcover/100");
	}else if(newurl.indexOf("starheads/150")>-1){
		newurl = newurl.replace("starheads/150","starheads/100");
	}
	newurl = newurl.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
	return newurl;
}

// 电台相关开始-------------------
// 播放电台
function someDianTai(sourceid,nodeobj) {
    var params = sourceid.split(",");
    var pic1 = "http://img1.sycdn.kuwo.cn/star/tags"+params[2];
    if(params[2].indexOf("http://")>-1){
        pic1 = params[2];
    }
    var pic2 = "http://img1.sycdn.kuwo.cn/star/tags"+params[3];
    if(params[3].indexOf("http://")>-1){
        pic2 = params[3];
    }
    var pic3 = getStringKey(nodeobj.extend,"RADIO_PIC");
    var disname = getStringKey(nodeobj.extend,"DIS_NAME");
    var call = "AddMusicRadio?mrid="+params[0]+"&mrname="+encodeURIComponent(disname)+"&mrpic1="+pic1+"&mrpic2="+pic2+"&ut="+params[4]+"&lt="+params[5]+"&r="+params[6]+"&pt="+params[7]+"&num="+params[8]+"&mrtype="+params[9]+"&play="+params[10]+"&mrpic3="+pic3;
    callClientNoReturn(call);
}
//内容页的收听电台
/*
function getShowRadio(rcid,rctype){
    var call = 'ShowMusicRadio?rcid=' + rcid + '&rctype=' + rctype;
    return callClient(call);
}
function playRadio(rcid, rctype, name){
    var call = 'AddMusicRadio?rcid=' + rcid + '&rctype=' + rctype + '&rcname=' + encodeURIComponent(name) + '&play=1';
    callClientNoReturn(call);
}
function showRadio(typeid,typename){
    var show = getShowRadio(typeid,typename);
    if(show!=null && show + '' == '1'){
        setTimeout(function(){
            $(".radio_btn").show();
        },100);
    }else{
        $(".radio_btn").hide();
    }
}
*/
function playRadio(rcid, rctype, name){
    var call = 'AddMusicRadio?rcid=' + rcid + '&rctype=' + rctype + '&rcname=' + encodeURIComponent(name) + '&play=1';
    callClientNoReturn(call);
}
//改为异步调用
function getShowRadio(rcid,rctype){
    var call = 'ShowMusicRadio?rcid=' + rcid + '&rctype=' + rctype;
    callClientAsyn(call,function(name, args){
		var show = args[0];
        if(show!=null && show + '' == '1'){
            setTimeout(function(){
                $(".radio_btn").show();
            },100);
        }else{
            $(".radio_btn").hide();
        }
    });
}
function showRadio(typeid,typename){    
    getShowRadio(typeid,typename);
}
// 获取当前电台播放状态
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
var radioTimer = null;
function initRadioStatus(num,id) {
    // 电台正在播放  -1  暂停播放-2  无电台播放 -3
    if (num == 1){
        clearTimeout(radioTimer);
        var stopicon = '';
        var comobj = $(".br_pic");
        var obj = $(".radio_" + id).find(".br_pic");    
        comobj.attr("c-status","0");
        comobj.removeClass("current_pic");
        comobj.find(".radio_play").remove();
        comobj.find(".radio_start").remove();
        comobj.find(".radio_stop").remove();
        comobj.find(".radio_pause").remove();
        comobj.find(".i_play").show();
        comobj.attr("c-status","0");
        comobj.removeAttr('onclick');
        comobj.unbind("click").bind("click", function () {
            eval($(this).attr("_onclick"));
        });
        obj.addClass("current_pic");
        obj.find(".i_play").hide();
        obj.find(".radio_start").remove();
        obj.find(".radio_play").remove();
        obj.find(".radio_stop").remove();
        obj.attr("c-status","1");
        if (obj.hasClass("on")) {
            stopicon = '<i title="暂停播放" onclick="" class="radio_pause"></i>';
        } else {
            stopicon = '<img class="radio_play" src="img/radio_play.gif">';
        }
        obj.append(stopicon);
        obj.removeAttr('onclick');
        obj.unbind("click").bind("click", function () {
            stopRadio(arguments[0],id);
            return false;
        });
    
    } else if (num == 2) {
        clearTimeout(radioTimer);
        var playicon = '';
        var comobj = $(".br_pic");
        var obj = $(".radio_" + id).find(".br_pic");        
        comobj.removeClass("current_pic");
        comobj.find(".radio_play").remove();
        comobj.find(".radio_start").remove();       
        comobj.find(".radio_stop").remove();
        comobj.find(".radio_pause").remove();
        comobj.find(".i_play").show();
        comobj.attr("c-status","0");
        comobj.removeAttr('onclick');
        comobj.unbind("click").bind("click", function () {
            eval($(this).attr("_onclick"));
            return false;
        });
        obj.attr("c-status","2");
        obj.addClass("current_pic");
        obj.find(".i_play").hide();
        obj.find(".radio_play").remove();
        obj.find(".radio_stop").remove();
        obj.find(".radio_pause").remove();
        if (obj.hasClass("on")){
            playicon = '<i title="继续播放" onclick="" class="radio_start"></i>';
        } else {
            playicon = '<i class="radio_stop"></i>';
        }
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
            comobj.removeAttr('onclick');
            comobj.unbind("click").bind("click", function () {
                eval($(this).attr("_onclick"));
                return false;
            });
        }, 100);
    }
}
function objBindFn() {
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
}
// 电台相关结束-------------------
