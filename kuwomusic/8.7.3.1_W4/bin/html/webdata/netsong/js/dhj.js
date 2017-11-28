var isIE = !!(window.attachEvent && !window.opera) || !!window.ActiveXObject || "ActiveXObject" in window;
function jsonError(e){

}
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
var version = "";
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
function getDataByCache(key){
	var cacheValue = callClient("GetCache?key="+encodeURIComponent(key));
	var data = "";
	if(typeof(cacheValue)!="undefined" && cacheValue!=""){
		try{
			data = cacheValue;
		}catch(e){
		}
	}
	return data;
}
function saveDataToCache(url,dataValue,time){
	try{
		var cachetime;
		if(typeof(dataValue)!="undefined"&&dataValue!=""&&dataValue!=null){
			if(url=="refreshnum"){
				cachetime = 1200;
			}else if(url=="INDEXDATA"){
				cachetime = 604800;
			}else{
				if(url.indexOf("newsearch")<0){
					cachetime = 1200;
				}else{
					cachetime = 86400;
				}
			}
			if(typeof(time)!="undefined"){
				cachetime = time;
			}
			callClient("SetCache?key="+encodeURIComponent(url)+"&time="+cachetime+"\r\n"+dataValue);
		}
	}catch(e){
	}
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
var searchSourceKey = "";
var currentDHJID;
function getHeJiMusicString(someobj){
    var playarray = [];
	var playi = 0;
	var playstring = "";
	playarray[playi++] = encodeURIComponent(returnSpecialChar(someobj.name));
	playarray[playi++] = encodeURIComponent(returnSpecialChar(someobj.artist));
	playarray[playi++] = encodeURIComponent(returnSpecialChar(someobj.album));
	playarray[playi++] = someobj.nsig1;
	playarray[playi++] = someobj.nsig2;
	playarray[playi++] = "MUSIC_"+someobj.id;
	playarray[playi++] = someobj.mp3nsig1;
	playarray[playi++] = someobj.mp3nsig2;
	playarray[playi++] = "MP3_"+someobj.mp3rid;
	playarray[playi++] = someobj.mkvnsig1;
	playarray[playi++] = someobj.mkvnsig2;
	playarray[playi++] = "MV_"+someobj.mkvrid;
	playarray[playi++] = someobj.hasecho;
	playarray[playi++] = encodeURIComponent("VER=2015;FROM=曲库->\""+searchSourceKey+"\"的搜索结果->大合集->结果页->"+currentDHJID);
	playarray[playi++] = '';
	playarray[playi++] = getMultiVerNum(someobj);
	playarray[playi++] = getPointNum(someobj);
	playarray[playi++] = getPayNum(someobj);
	playarray[playi++] = getArtistID(someobj);
	playarray[playi++] = getAlbumID(someobj);
	playstring = playarray.join("\t");
	playstring = encodeURIComponent(playstring);
	return playstring;
}
var searchBeginNum = -1; //  日志
var dhjname;//  日志
var dhjreltype = "";
var xiu_heji = "loading";
var gethejijsondata = "";
var isshowxiu = "loading";
//大合集数据
function getHeJi(jsondata){
	var data = jsondata;
	currentDHJID = data.id;
	dhjname = data.name;
	var type = data.type;
	dhjreltype = type;
// 大合集 (匹配专辑或歌手)
	if(type=="artist"){
		var pic = data.pic;
		if(pic!=""&&pic.indexOf("http")>-1){
			pic = pic.replace("starheads/100","starheads/70");
		}
		var picstring = "";
		picstring = '<img src="'+pic+'" onerror="this.src=\'img/kuwo.jpg\'"  width="100" height="100" class="pic100"/>';
		var name = data.name;
		name = returnSpecialChar(name);
		call = "MBOXLOG?stype=type_sdhj&snum="+searchBeginNum+"&showdhj=showartist&dhjname="+name;
		callClientNoReturn(call);
		var hrefstring = 'jumpQK(4,'+data.id+',\''+checkSpecialChar(name,"name")+'\',4)';
		var btnname = data.btnname;
		if(typeof(btnname)=="undefined"){
			btnname = "查看歌手";
		}
		var artistsongnum = 0;
		var artistalbumnum = 0;
		var artistmvnum = 0;
		if(typeof(data.songnum)!="undefined"&&data.songnum!=""){
		    artistsongnum = data.songnum;
		}
		if(typeof(data.albumnum)!="undefined"&&data.albumnum!=""){
		    artistalbumnum = data.albumnum;
		}
		if(typeof(data.mvnum)!="undefined"&&data.mvnum!=""){
		    artistmvnum = data.mvnum;
		}
		var onlinepeople = 50*artistsongnum+100*artistalbumnum+3*artistmvnum;
		var newdate = new Date();
		var newhour = newdate.getHours();
		if(newhour>=1&&newhour<8){
		    onlinepeople = onlinepeople*0.4;
		}
		if(newhour>=8&&newhour<15){
		    onlinepeople = onlinepeople*2.2;
		}
		if(newhour>=15&&newhour<21){
		    onlinepeople = onlinepeople*2.7;
		}
		var newmin = newdate.getMinutes();
		var ran = Math.random()*10;
		ran = Math.floor(ran);
		var rannum = newmin*ran;
		var ran2 = Math.random()*2;
		ran2 = Math.floor(ran2);
		if(ran2==0){
		    rannum = -rannum;
		}	
		onlinepeople = Math.floor(onlinepeople);
		onlinepeople = onlinepeople+rannum;
		var newstring = '<div class="dhjnew1"><div class="dhjnew2"><a onclick="playWellChoosen('+data.id+');return false;" hidefocus href="###" title="播放精选">播放精选</a></div><div class="dhjnew3">与好音乐不期而遇</div></div>';
		$("#search_heji_artist .heji_pic").html('<a class="w_a_hj1" data-pos="-5" hidefocus href="###" onclick="'+hrefstring+'" title="'+checkSpecialChar(name,"titlename")+'">'+picstring+'</a>');	
		$("#search_heji_artist .hj_main h2").html('<a style="float:left;" class="w_a_hj1" data-pos="-4" hidefocus href="###" onclick="'+hrefstring+'" title="'+checkSpecialChar(name,"titlename")+'">'+searchReplaceAll(cutStrByGblen(name,42))+'</a>'+newstring);
		var hotsongstring = '';
		hotsongstring = '<b onclick="dhjArtistNewLog();dhjArtistNew(4,'+data.id+',\''+checkSpecialChar(name,"name")+'\',4);return false;">'+artistsongnum+'</b>&nbsp;&nbsp;单曲&nbsp;<i>|</i>&nbsp;<b onclick="dhjArtistNewLog();dhjArtistNew(-4,'+data.id+',\''+checkSpecialChar(name,"name")+'\',-4);return false;">'+artistalbumnum+'</b>&nbsp;&nbsp;专辑&nbsp;&nbsp;<i>|</i>&nbsp;&nbsp;<b onclick="dhjArtistNewLog();dhjArtistNew(-5,'+data.id+',\''+checkSpecialChar(name,"name")+'\',-5);return false;">'+artistmvnum+'</b>&nbsp;&nbsp;MV';
		$("#search_heji_artist .hj_search").eq(0).html(hotsongstring);
		$("#search_heji_artist").show();
		var left2 = $(".dhjnew2").offset().left;
		var top2 = $(".dhjnew2").offset().top;
		var posx2 = left2;
		var posy2 = top2+$(".dhjnew2").height();
		callClientNoReturn("DHJFinish?w=661&h=70&type=artist&advicex=0&advicey=0&btnx="+posx2+"&btny="+posy2);
	}else if(type=="playlist"){
		var pic = data.pic;
		if(pic!=""&&pic.indexOf("http")>-1){
			pic = pic.replace("150.jpg","100.jpg");
		}
		var picstring = "";
		var name = data.name;
		name = returnSpecialChar(name);
		call = "MBOXLOG?stype=type_sdhj&snum="+searchBeginNum+"&showdhj=showlist&dhjname="+name;
		callClientNoReturn(call);
		var hrefstring = 'jumpQK(8,'+data.id+',\''+checkSpecialChar(name,"name")+'\',8)';
		var listtitle = "播放歌单";
		var listtitle2 = "";
		if(typeof(data.songnum)!="undefined"&&data.songnum>0){
		    listtitle = "共"+data.songnum+"首歌曲";
		    listtitle2 = listtitle;
		}
		var newstring = '<div class="dhjnew1"><div class="dhjnew2"><a onclick="playPlaylist(1,'+data.id+');return false;" hidefocus href="###" title="'+listtitle+'">播放歌单</a></div><div class="dhjnew4">'+listtitle2+'</div></div>';
		picstring = '<a class="w_a_hj2" data-pos="-5" hidefocus href="###" onclick="'+hrefstring+'"><img src="'+pic+'" onerror="this.src=\'img/kuwo.jpg\'"  width="70" height="70" class="pic100"/></a>';
		var btnname = data.btnname;
		if(typeof(btnname)=="undefined"){
			btnname = "查看歌单";
		}
		$("#search_heji_playlist .heji_pic").html(picstring);	
		$("#search_heji_playlist .hj_main h2").html('<a style="float:left;" class="w_a_hj2" data-pos="-4" hidefocus href="###" onclick="'+hrefstring+'" title="'+checkSpecialChar(name,"titlename")+'">'+searchReplaceAll(cutStrByGblen(name,42))+'</a>'+newstring);
		var hotsongobj = data.hotsong;
		var hotsongstring = '<span>热门单曲：</span>';
		for(var i = 0,j = hotsongobj.length>3?3:hotsongobj.length;i<j;i++){
			var someobj = hotsongobj[i];
			var songname = someobj.name;
			var playstring = getHeJiMusicString(someobj);
			hotsongstring += '<div class="w_heji"><em><a data-music="'+playstring+'" title="播放歌曲" hidefocus href="###" class="mcbtn w_a_heji" data-pos="-2"></a></em><p><a data-music="'+playstring+'" hidefocus href="###" class="hj_song w_a_heji" data-pos="-2" title="'+songname+'">'+searchReplaceAll(songname)+'</a></p></div>';
		}
		if(hotsongobj.length==0){
		    hotsongstring = "";
		}
		$("#search_heji_playlist .hj_search").eq(0).html(hotsongstring);
		$("#search_heji_playlist").show();
		callClientNoReturn("DHJFinish?w=661&h=70&type=playlist");
	}else if(type=="album"){
		var pic = data.pic;
		if(pic!=""&&pic.indexOf("http")>-1){
			pic = pic.replace("albumcover/120","albumcover/70");
		}
		var picstring = "";
		picstring = '<img src="'+pic+'" onerror="this.src=\'img/kuwo.jpg\'"  width="100" height="100" class="pic100"/>';
		var name = data.name;
		name = returnSpecialChar(name);
		call = "MBOXLOG?stype=type_sdhj&snum="+searchBeginNum+"&showdhj=showalbum&dhjname="+name;
		callClientNoReturn(call);
		var hrefstring = 'jumpQK(13,'+data.id+',\''+checkSpecialChar(name,"name")+'\',13)';
		var btnname = data.btnname;
		if(typeof(btnname)=="undefined"){
			btnname = "查看专辑";
		}
		var listtitle = "播放专辑";
		var listtitle2 = "";
		if(typeof(data.songnum)!="undefined"&&data.songnum>0){
		    listtitle = "共"+data.songnum+"首";
		    listtitle2 = listtitle;
		}
		var newstring = '<div class="dhjnew1"><div class="dhjnew2"><a onclick="playPlaylist(3,'+data.id+');return false;" hidefocus href="###" title="'+listtitle+'">播放专辑</a></div><div class="dhjnew4">'+listtitle2+'</div></div>';
		picstring = '<a class="w_a_hj3" data-pos="-5" hidefocus href="###" onclick="'+hrefstring+'"><img src="'+pic+'" onerror="this.src=\'img/kuwo.jpg\'"  width="70" height="70" class="pic100"/></a>';	
	    $("#search_heji_album .heji_pic").html(picstring);	
		$("#search_heji_album .hj_main h2").html('<a style="float:left;" class="w_a_hj3" data-pos="-4" hidefocus href="###" onclick="'+hrefstring+'" title="'+checkSpecialChar(name,"titlename")+'">'+searchReplaceAll(cutStrByGblen(name,42))+'</a>'+newstring);
		var hotsongobj = data.hotsong;
		var hotsongstring = '<span>专辑内容：</span>';
		for(var i = 0,j = hotsongobj.length>3?3:hotsongobj.length;i<j;i++){
			var someobj = hotsongobj[i];
			var songname = someobj.name;
			var playstring = getHeJiMusicString(someobj);
			hotsongstring += '<div class="w_heji"><em><a data-music="'+playstring+'" title="播放歌曲" hidefocus href="###" class="mcbtn w_a_heji" data-pos="-3"></a></em><p><a data-music="'+playstring+'" hidefocus href="###" class="hj_song w_a_heji" data-pos="-3" title="'+songname+'">'+searchReplaceAll(songname)+'</a></p></div>';
		}
		if(hotsongobj.length==0){
		    hotsongstring = "";
		}
		$("#search_heji_album .hj_search").eq(0).html(hotsongstring);
		var newsongobj = data.newsong;
		var newsongstring = '<span>最新单曲：</span>';
		for(var m = 0,n = newsongobj.length;m<n;m++){
			var someobj2 = newsongobj[m];
			var songname2 = someobj2.name;
			var playstring = getHeJiMusicString(someobj2);
			newsongstring += '<div class="w_heji"><em><a data-pos="-2" data-music="'+playstring+'" title="播放歌曲" hidefocus href="###" class="mcbtn w_a_heji"></a></em><p><a data-music="'+playstring+'" hidefocus href="###" class="hj_song w_a_heji" data-pos="-2" title="'+songname2+'">'+searchReplaceAll(songname2)+'</a></p></div>';
		}
		if(newsongobj.length==0){
		    newsongstring = "";
		}
		$("#search_heji_album").show();
		callClientNoReturn("DHJFinish?w=661&h=70&type=album");
	}else if(type=="subject"){
		var pic = data.pic;
		var picstring = "";
		var name = data.name;
		name = returnSpecialChar(name);
		call = "MBOXLOG?stype=type_sdhj&snum="+searchBeginNum+"&showdhj=showsubject&dhjname="+name;
		callClientNoReturn(call);
		var url = data.pageurl;
		if(url.indexOf("?")>-1){
		    url = url + "&from=search&dhjid="+data.id+"&searchkey="+encodeURIComponent((encodeURIComponent(searchKey)))+"&jxjType=2016Mbox";
		}
		url = encodeURIComponent(url);
		var hrefstring = 'jumpQK(21,\''+url+'\',\''+checkSpecialChar(name,"name")+'\',21)';
		var listtitle = "播放歌单";
		var listtitle2 = "";
		if(typeof(data.songnum)!="undefined"&&data.songnum>0){
		    listtitle = "共"+data.songnum+"首歌曲";
		    listtitle2 = listtitle;
		}
		var newstring = '<div class="dhjnew1"><div class="dhjnew2"><a onclick="playPlaylist(2,'+data.id+',this);return false;" hidefocus href="###" title="'+listtitle+'">播放歌单</a></div><div class="dhjnew4">'+listtitle2+'</div></div>';
		picstring = '<a class="w_a_hj4" data-pos="-5" hidefocus href="###" onclick="'+hrefstring+'"><img src="'+pic+'" onerror="this.src=\'img/kuwo.jpg\'"  width="70" height="70" class="pic100"/></a>';
		var btnname = data.btnname;
		if(typeof(btnname)=="undefined"){
			btnname = "查看专题";
		}
		$("#search_heji_subject .heji_pic").html(picstring);	
		$("#search_heji_subject .hj_main h2").html('<a style="float:left;" class="w_a_hj4" data-pos="-4" hidefocus href="###" onclick="'+hrefstring+'" title="'+checkSpecialChar(name,"titlename")+'">'+searchReplaceAll(cutStrByGblen(name,42))+'</a>'+newstring);
		var hotsongobj = data.hotsong;
		var hotsongstring = '<span>热门单曲：</span>';
		for(var i = 0,j = hotsongobj.length>3?3:hotsongobj.length;i<j;i++){
			var someobj = hotsongobj[i];
			var songname = someobj.name;
			var playstring = getHeJiMusicString(someobj);
			hotsongstring += '<div class="w_heji"><em><a data-music="'+playstring+'" title="播放歌曲" hidefocus href="###" class="mcbtn w_a_heji" data-pos="-2"></a></em><p><a data-music="'+playstring+'" hidefocus href="###" class="hj_song w_a_heji" data-pos="-2" title="'+songname+'">'+searchReplaceAll(songname)+'</a></p></div>';
		}
		if(hotsongobj.length==0){
		    hotsongstring = "";
		}
		$("#search_heji_subject .hj_search").eq(0).html(hotsongstring);
		$("#search_heji_subject").show();
		callClientNoReturn("DHJFinish?w=661&h=70&type=subject");
	}else if(type=="ranklist"){
	    try{
	    var params = data.pageurl;
	    params = params.replace(/&quot;/g,'"');
	    params = eval('('+params+')');
	    if(params.source&&params.source==-203){
	        djCommObj = params;
	        var bangcache = getDataByCache("DJBANGCACHE");
	        if(bangcache==""){
	            $.getScript("http://album.kuwo.cn/album/dj2014?type="+params.extend2.type+"&subType="+params.sourceid+"&callback=getDJBang&time="+Math.random());
	        }else{
	            try{
	                getDJBang(eval('('+bangcache+')'));
	            }catch(e){
	                $.getScript("http://album.kuwo.cn/album/dj2014?type="+params.extend2.type+"&subType="+params.sourceid+"&callback=getDJBang&time="+Math.random());
	            }    
	        }        	        
	    }
	    }catch(e){}
	}
	checkDHJWidth();
}
var djBangObj;
var djCommObj;
var cacheFlag = false;
function getDJBang(jsondata){
    try{
    if(!jsondata||!jsondata.musiclist){
        return;
    }
    if(!cacheFlag){
        try{
            saveDataToCache("DJBANGCACHE",obj2Str(jsondata),86400);
            cacheFlag = true;
        }catch(e){}
    }
    djBangObj = jsondata;
    var name = jsondata.title;
    call = "MBOXLOG?stype=type_sdhj&snum="+searchBeginNum+"&showdhj=showranklist&dhjname="+name;
    callClientNoReturn(call);
    var pic = "img/dhj/bang.png";
    var picstring = "";
    var djbangid = 0;
    var hrefstring = 'goDJBang();return false;';
    var listtitle = "播放歌单";
	var listtitle2 = "";
	if(typeof(jsondata.count)!="undefined"&&jsondata.count>0){
	    listtitle = "共"+jsondata.count+"首歌曲";
	    listtitle2 = listtitle;
	}
    picstring = '<a class="w_a_hj2 w_djbang" data-pos="-5" hidefocus href="###" onclick="'+hrefstring+'"><img src="'+pic+'" onerror="this.src=\'img/kuwo.jpg\'"  width="70" height="70" class="pic100"/></a>';
	//var newstring = '<a id="w_sugg"></a><div class="dhjnew1"><div class="dhjnew2 w_djhj2"><a onclick="playDJPlaylist();return false;" hidefocus href="###" title="'+listtitle+'">播放全部</a></div></div>';
	var newstring = '<a id="w_sugg"></a><div class="dhjnew1"><div class="dhjnew2 w_djhj2"><a onclick="playDJPlaylist();return false;" hidefocus href="###" title="'+listtitle+'"></a></div></div>';
	$("#search_heji_banglist .heji_pic").html(picstring);
    $("#search_heji_banglist .hj_main h2").html('<a style="float:left;" class="w_a_hj2 w_djbang" data-pos="-4" hidefocus href="###" onclick="'+hrefstring+'" title="'+checkSpecialChar(name,"titlename")+'">'+searchReplaceAll(cutStrByGblen(name,42))+'</a>'+newstring);
	var hotsongobj = jsondata.musiclist;
	var hotsongstring = '';
	for(var i = 0,j = hotsongobj.length>3?3:hotsongobj.length;i<j;i++){
		var someobj = hotsongobj[i];
		var songname = someobj.name;
		var playstring = getHeJiMusicStringNew(someobj);
		var pstyle = "";
	    $("#w_dhj_width").html(songname);
	    pstyle = 'style="width:105px;"';        
		hotsongstring += '<div class="w_heji" style="margin-right:15px;"><em><a data-music="'+playstring+'" title="播放歌曲" hidefocus href="###" class="mcbtn w_a_heji" data-pos="-23"></a></em><p '+pstyle+'><a data-music="'+playstring+'" hidefocus href="###" class="hj_song w_a_heji" data-pos="-23" title="'+songname+'">'+(i+1)+'. '+searchReplaceAll(songname)+'</a></p></div>';
	}
	if(hotsongobj.length==0){
	    hotsongstring = "";
	}
	$("#search_heji_banglist .hj_search").html(hotsongstring);
    $("#search_heji_banglist").show();
    callClientNoReturn("DHJFinish?w=661&h=70&type=banglist&advicex=0&advicey=0&btnx=0&btny=0");
    }catch(e){}
}
function playDJPlaylist(){
    if(!djBangObj||!djBangObj.musiclist||djBangObj.length==0){
        return;
    }
    var call = "";
    var objs = djBangObj.musiclist;
    var musicarray = [];
    var musici = 0;
    for(var i=0,j=objs.length;i<j;i++){
       musicarray[musici++] = '&s'+(i+1)+"="+getHeJiMusicStringNew(objs[i]); 
    }
    call = "Play?mv=0&n="+objs.length+musicarray.join("");
    callClientNoReturn(call);
    searchOperationLog("djbangplay","-20","music","noref");
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
function getHeJiMusicStringNew(someobj){
    var playarray = [];
	var playi = 0;
	var param = someobj.playparam;
	param = returnSpecialChar(param);
	var paramArray = param.split(";");
	var playstring = "";
	playarray[playi++] = encodeURIComponent(returnSpecialChar(someobj.name));
	playarray[playi++] = encodeURIComponent(returnSpecialChar(someobj.artist));
	playarray[playi++] = encodeURIComponent(returnSpecialChar(someobj.album));
	for(var j=3;j<paramArray.length;j++){
		playarray[playi++] = paramArray[j];
	}
	playarray[playi++] = encodeURIComponent("VER=2015;FROM=曲库->\""+searchSourceKey+"\"的搜索结果->大合集->结果页->"+currentDHJID);
	playarray[playi++] = '';
	playarray[playi++] = getMultiVerNum(someobj);
	playarray[playi++] = getPointNum(someobj);
	playarray[playi++] = getPayNum(someobj);
	playarray[playi++] = getArtistID(someobj);
	playarray[playi++] = getAlbumID(someobj);
	playstring = playarray.join("\t");
	playstring = encodeURIComponent(playstring);
	return playstring;
}
function goDJBang(){	
    try{
    searchOperationLog("ref","-21","music","refdjbang");
    var other = "|psrc=分类->DJ专区->|bread=-2,5,分类,-2;40,190481,DJ,0|type=bangdan|tagDbId=";
    other = encodeURIComponent(other);
    var channelInfo=getChannelInfo("",'classify');
    var info  = 'source='+djCommObj.source+'&sourceid='+djCommObj.sourceid+'&name='+djCommObj.name+'&id='+djCommObj.id+'&other='+other;
 	var src = 'content_djzone_gedan.html?'+info;
    callClientNoReturn('Jump?channel=classify&param={"source":"'+djCommObj.source+'","sourceid":"'+djCommObj.sourceid+'","name":"'+djCommObj.name+'","id":"'+djCommObj.id+'","extend":"","other":"'+other+'"};' + encodeURIComponent('url:${netsong}'+src) + ';'  + encodeURIComponent('jump:'+channelInfo));
    }catch(e){}	
}
function goDJZone(){
    try{
    searchOperationLog("ref","-22","music","refdjzone");	
    var other = "|psrc=分类->|bread=-2,5,分类,-2";
    other = encodeURIComponent(other);
    var channelInfo=getChannelInfo("",'classify');
    var src = "content_djzone.html";
    callClientNoReturn('Jump?channel=classify&param={"source":"40","sourceid":"190481","name":"DJ","id":"0","extend":"","other":"'+other+'"};' + encodeURIComponent('url:${netsong}'+src) + ';' + encodeURIComponent('jump:'+channelInfo));
    }catch(e){}
}
function DHJPos(){  
	if(dhjreltype=="artist"){
	    callClientNoReturn("DHJPos?w=661&h=70&type=artist");
	}else if(dhjreltype=="playlist"||dhjreltype=="subject"){
		callClientNoReturn("DHJPos?w=661&h=70&type="+dhjreltype);
	}
}
function jumpQK(source,sourceid,name,id){
    var other = "";
    var channelInfo = "";
    var channelNode='';
    var src='';
    if(source==13){
    	channelNode = 'artist';
    	src = 'content_album.html?';
     	channelInfo = getChannelInfo("","artist");
        other = "|psrc="+encodeURIComponent("\""+searchSourceKey+"\"")+"的搜索结果->大合集->专辑页->"+currentDHJID;
    }else if(source==4){
    	channelNode = 'artist';
    	src = 'content_artist.html?';
     	channelInfo = getChannelInfo("","artist");
        other = "|psrc="+encodeURIComponent("\""+searchSourceKey+"\"")+"的搜索结果->大合集->歌手页->"+currentDHJID;
    }else if(source==8||source==12){
    	channelNode = 'songlib';
    	src = 'content_gedan.html?';
     	channelInfo = getChannelInfo("","index");
        other = "|from=index|psrc="+encodeURIComponent("\""+searchSourceKey+"\"")+"的搜索结果->大合集->歌单页->"+currentDHJID;
    }else if(source==21){
    	src = "content_jxj.html?";
		channelNode = 'classify';
     	channelInfo = getChannelInfo("","classify");
     	sourceid = encodeURIComponent(sourceid);
	}
    other = encodeURIComponent(other);
 	param = '{\'source\':\''+source+'\',\'sourceid\':\''+sourceid+'\',\'name\':\''+name+'\',\'id\':\''+id+'\',\'extend\':\'\',\'other\':\''+other+'\'}'
 	var info = 'source='+source+'&sourceid='+sourceid+'&name='+name+'&id='+id+'&other='+other;
 	src = src+info;
    //var call = "Jump?channel=songlib&param="+encodeURIComponent(param) + ";" + encodeURIComponent('jump:'+channelInfo);
    var call = "Jump?channel="+channelNode+"&param="+encodeURIComponent(param) + ";" + encodeURIComponent('url:${netsong}'+src) + ';' + encodeURIComponent('jump:'+channelInfo);
    callClientNoReturn(call);
}
//点击歌手大合集单曲专辑MV数字跳转
function dhjArtistNew(type,id,name){
	searchOperationLog("ref","-8","music","refartist");
	var other = "";
	if(type==-4){
	    other = "|psrc=|bread=|tabType=album|pn=0";
	}else if(type==-5){
	    other = "|psrc=|bread=|tabType=mv|pn=0";
	}
	var channelInfo = getChannelInfo("","artist");
	var info = 'source=4&sourceid='+id+'&name='+name+'&id=4&other='+other;
 	var src = 'content_artist.html?'+info;
    callClientNoReturn('Jump?channel=artist&param={\'source\':\'4\',\'sourceid\':\''+id+'\',\'name\':\''+encodeURIComponent(name)+'\',\'id\':\'4\',\'extend\':\'\',\'other\':\''+encodeURIComponent(other)+'\'};' + encodeURIComponent('url:${netsong}'+src) + ';' +  encodeURIComponent('jump:'+channelInfo));}
function dhjArtistNewLog(){
   searchOperationLog("ref","-8","music","refartist"); 
}
function ABLOG(msg){
   //callClient("ABLog?msg="+msg); 
}
//播放歌单
function playPlaylist(type,id){
    var url = "";
    var playtype = "";
    if(type==1){
    	playtype = "playplaylist";
        url = "http://nplserver.kuwo.cn/pl.svc?op=getlistinfo&pid="+id+"&vipver="+getVersion()+"&pn=0&rn=1000&encode=utf-8&keyset=pl2012&identity=kuwo&callback=dhjGeDan";
    }else if(type==2){
    	playtype = "playsubject";
        url = "http://album.kuwo.cn/album/mbox/commhd?flag=1&id="+id+"&vipver="+getVersion()+"&callback=dhjZhuanTi";
    }else if(type==3){
    	playtype = "playalbum";
        url = "http://search.kuwo.cn/r.s?stype=albuminfo&albumid="+id+"&vipver="+getVersion()+"&callback=dhjGeDan&show_copyright_off=1&alflac=1";
    }
    searchOperationLog(playtype,"-9","music","noref");
    $.getScript(url);
}
function dhjGeDan(jsondata){
    var data = jsondata;
	if(typeof(data)=="undefined"||data==null||typeof(data.musiclist)=="undefined"){
		return;
	}
	var musicList = data.musiclist;
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
	var onlineflag = false;
    var albumid = data.albumid;
    var copyNum = 0;
	for(var i = 0; i < musicSize; i++){
		someObj = musicList[i];
		if(typeof(someObj.online)!="undefined"&&someObj.online.length==1&&someObj.online==0){
            onlineflag = true;
            copyNum ++;
            continue;
        }
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
		musicstringarray = [];
		musicstringarray[musicstringarray.length] = musicString;
		musicstringarray[musicstringarray.length] = encodeURIComponent("VER=2015;FROM=曲库->\""+searchSourceKey+"\"的搜索结果->大合集->结果页->"+currentDHJID);
		musicstringarray[musicstringarray.length] = someObj.formats;
		musicstringarray[musicstringarray.length] = getMultiVerNum(someObj);
		musicstringarray[musicstringarray.length] = getPointNum(someObj);
		musicstringarray[musicstringarray.length] = getPayNum(someObj);
		musicstringarray[musicstringarray.length] = getArtistID(someObj);
        if(albumid){
            musicstringarray[musicstringarray.length] = albumid;
        }else{
            musicstringarray[musicstringarray.length] = getAlbumID(someObj);
        }
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
	bigString = bigarray.join("");
	if(onlineflag&&musicSize == copyNum){
        musicOnline(true);
    }
	if(bigString==""){
		return;
	}
	callClientNoReturn("Play?mv=0&n="+musicSize+bigString);
	musicList = null;
	bigString = null;
	data = null;
}
// 操作歌曲下线的歌曲
function musicOnline(flag){
    var type = 1;
    if(flag){
        type = 2;
    }
    callClientNoReturn("CopyrightDlg?type="+type);
}
function dhjZhuanTi(jsondata){
    var data = jsondata;
    if(data==null||typeof(data.musiclist)=="undefined"||data.musiclist.length==0){
        return;
    }
    var musicList = data.musiclist;
	var musicSize = musicList.length;
	var bigString = "";
	var musicarray = [];
	var musici = 0;
	var someobj;
	var musicString;
    var albumid = data.albumid;
    var param;
    var paramArray;
    var childArray;
	for(var i=0;i<musicSize;i++){
        someObj = musicList[i];
        param = someObj.param;
        if(typeof(param)=="undefined"){
            param = someObj.params;
        }
        if(albumid){
          albumid= albumid;
        }else{
           albumid =getAlbumID(someObj);
        }
	    musicString = decodeURIComponent(param).replace(/;/g,"\t")+"\t"+encodeURIComponent("VER=2015;FROM=曲库->\""+searchSourceKey+"\"的搜索结果->大合集->结果页->"+currentDHJID)+"\t" +someObj.formats+"\t"+getMultiVerNum(someObj)+"\t" + getPointNum(someObj) + "\t"+getPayNum(someObj)+"\t"+getArtistID(someObj)+"\t"+albumid;
	    musicString = encodeURIComponent(musicString);
	    musicarray[musici++] = '&s';
	    musicarray[musici++] = (i+1);
	    musicarray[musici++] = '=';
	    musicarray[musici++] = musicString;
	}
	bigString = musicarray.join("");
	callClientNoReturn("Play?mv=0&n="+musicSize+bigString);
	bigString = null;
	musicList = null;
	data = null;
	musicSize = null;    
}
var choosenObj;
//播放精选歌曲取歌手前500首
function playWellChoosen(id){
    searchOperationLog("playwell","-9","music","noref");
    if(typeof(choosenObj)=="object"){
        checkLastObj();
        return;
    }
    var url = "http://search.kuwo.cn/r.s?stype=artist2music&artistid="+id+"&pn=0&rn=500&vipver="+getVersion()+"&callback=wellChoosenResult&show_copyright_off=1&alflac=1&time="+Math.random();
    $.getScript(url);
}
//数组的移除方法
Array.prototype.remove = function (dx) {  
    if (isNaN(dx) || dx > this.length) {  
        return false;  
    }  
    for (var i = 0, n = 0; i < this.length; i++) {  
        if (this[i] != this[dx]) {  
            this[n++] = this[i];  
        }  
    }  
    this.length -= 1;  
}; 
//解析歌手歌曲数据 并播放
function wellChoosenResult(jsondata){
    try{
    var data = jsondata;
    if(typeof(data)=="undefined"||typeof(data.musiclist)=="undefined"||data.musiclist.length==0){
        return;
    }
    var musicList = data.musiclist;
    choosenObj = musicList;
    var musicsize = musicList.length;
    if(musicsize<=10){
        playRandomObjs();
    }else if(musicsize<=50){
        var newobjs = getRandomObjs(); 
        playRandomObjs(newobjs);
    }else if(musicsize<=100){
        var newobjs = getRandomObjs2();
        playRandomObjs(newobjs);
    }else{
        var newobjs = getRandomObjs3();
        playRandomObjs(newobjs);
    }
    }catch(e){}
}
//检查是否可以再次点击播放精选
var randomOver = false;
function checkLastObj(){
    if(randomOver){
        return;
    }
    var musicsize = choosenObj.length;
    if(musicsize<=10){
        playRandomObjs(choosenObj);
        randomOver = true;
    }else if(musicsize<=50){
        var newobjs = getRandomObjs(); 
        playRandomObjs(newobjs);
    }else if(musicsize<=100){
        var newobjs = getRandomObjs2(); 
        playRandomObjs(newobjs);
    }else{
        var newobjs = getRandomObjs3(); 
        playRandomObjs(newobjs);
    }  
}
//获取歌曲列表中的随机10首歌曲
function getRandomObjs(){
    var objssize = choosenObj.length;
    var newarray = [];
    var newi = 0;
    if(objssize>=10){
        for(var i=0;i<10;i++){
            var randomnum = objssize;
            if(choosenObj.length<randomnum){
                randomnum = choosenObj.length;
            }
            var randomi = Math.random()*randomnum;
            randomi = Math.floor(randomi);
            var someobj = choosenObj[randomi];
            newarray[newi++] = someobj;
            choosenObj.remove(randomi);
        }
    }
    return newarray;
}
var headarray = [];
var lastarray = [];
var arrayisload = false;
//获取歌曲列表中的随机歌曲(歌曲数在50—100之间)(取top50前5首和后面的5首)
function getRandomObjs2(){
    var headi = 0;
    var lasti = 0;
    if(!arrayisload){
        var objssize = choosenObj.length;
        for(var i=0;i<objssize;i++){
            if(i<50){
                headarray[headi++] = choosenObj[i];
            }else{
                lastarray[lasti++] = choosenObj[i];
            }
        }
        arrayisload = true;
    }
    var headsize = headarray.length;
    var lastsize = lastarray.length;
    var newarray = [];
    var newi = 0;
    if(lastsize>5){
        for(var i=0;i<5;i++){
            var randomnum = headsize;
            if(headarray.length<randomnum){
                randomnum = headarray.length;
            }
            var randomi = Math.random()*randomnum;
            randomi = Math.floor(randomi);
            var someobj = headarray[randomi];
            newarray[newi++] = someobj;
            headarray.remove(randomi);
            choosenObj.remove(randomi);
        }
        for(var i=0;i<5;i++){
            var randomnum = lastsize;
            if(lastarray.length<lastsize){
                randomnum = lastarray.length;
            }
            var randomi = Math.random()*randomnum;
            randomi = Math.floor(randomi);
            var someobj = lastarray[randomi];
            newarray[newi++] = someobj;
            lastarray.remove(randomi);
            choosenObj.remove(randomi+headsize-5);
        }
    }else{
        var otherindex = 10-lastsize;
        for(var i=0;i<otherindex;i++){
            var randomnum = headsize;
            if(headarray.length<randomnum){
                randomnum = headarray.length;
            }
            var randomi = Math.random()*randomnum;
            randomi = Math.floor(randomi);
            var someobj = headarray[randomi];
            newarray[newi++] = someobj;
            headarray.remove(randomi);
            choosenObj.remove(randomi);
        }
        for(var i=0;i<lastsize;i++){
            var randomnum = lastsize;
            if(lastarray.length<lastsize){
                randomnum = lastarray.length;
            }
            var randomi = Math.random()*randomnum;
            randomi = Math.floor(randomi);
            var someobj = lastarray[randomi];
            newarray[newi++] = someobj;
            lastarray.remove(randomi);
            choosenObj.remove(randomi+headsize-otherindex);
        }
    }
    return newarray;
}
//获取歌曲列表中的随机歌曲(歌曲数在100以上)(取top50前5首和后面的5首 先取固定10次 然后在100首之外的随机取10个即可 最后没有的话有多少取多少)
function getRandomObjs3(){
    var headi = 0;
    var lasti = 0;
    if(!arrayisload){
        var objssize = choosenObj.length;
        for(var i=0;i<objssize;i++){
            if(i<50){
                headarray[headi++] = choosenObj[i];
            }else{
                lastarray[lasti++] = choosenObj[i];
            }
        }
        arrayisload = true;
    }
    var headsize = headarray.length;
    var lastsize = lastarray.length;
    var newarray = [];
    var newi = 0;
    if(headsize>0){
        for(var i=0;i<5;i++){
            var randomnum = headsize;
            if(headarray.length<randomnum){
                randomnum = headarray.length;
            }
            var randomi = Math.random()*randomnum;
            randomi = Math.floor(randomi);
            var someobj = headarray[randomi];
            newarray[newi++] = someobj;
            headarray.remove(randomi);
        }
        for(var i=0;i<5;i++){
            var randomnum = lastsize;
            if(lastarray.length<lastsize){
                randomnum = lastarray.length;
            }
            var randomi = Math.random()*randomnum;
            randomi = Math.floor(randomi);
            var someobj = lastarray[randomi];
            newarray[newi++] = someobj;
            lastarray.remove(randomi);
        }
    }else{
        var bigi = lastsize;
        if(bigi>10){
            bigi = 10;
        }else{
            bigi = lastsize;
            randomOver = true;
        }
        for(var i=0;i<bigi;i++){
            var randomnum = lastsize;
            if(lastarray.length<lastsize){
                randomnum = lastarray.length;
            }
            var randomi = Math.random()*randomnum;
            randomi = Math.floor(randomi);
            var someobj = lastarray[randomi];
            newarray[newi++] = someobj;
            lastarray.remove(randomi);
        }
    }
    return newarray;
}
//随机获取歌曲列表中的某个对象 并在原来基础上移除该对象
function getSomeRandomObj(objs,num){
    var objarray = objs;
    var randomnum = num;
    if(objarray.length<num){
        randomnum = headarray.length;
    }
    var randomi = Math.random()*randomnum;
    randomi = Math.floor(randomi);
    var someobj = objarray[randomi];
    var newarray = [];
    var newi = 0;
    newarray[newi++] = someobj;
    objarray.remove(randomi);
    return objarray;
}
//播放取出的随机歌曲
function playRandomObjs(objs){
    var playstr = "";
    var objssize = objs.length;
    var onlineflag = false;
    for(var i=0;i<objssize;i++){
        var someobj = objs[i];
        if(typeof(someobj.online)!="undefined"&&someobj.online.length==1&&someobj.online==0){
            onlineflag = true;
            continue;
        }
        playstr += ("&s"+(i+1)+"="+getOneMusicString(objs[i]));
    }
    if(onlineflag){
        musicOnline(true);
    }
    callClientNoReturn("Play?mv=0&n="+objssize+playstr);
}
//获取一首歌曲的播放参数
function getOneMusicString(someobj){
    var playarray = [];
    var playi = 0;
    var playstring = "";
    playarray[playi++] = encodeURIComponent(returnSpecialChar(someobj.name));
    playarray[playi++] = encodeURIComponent(returnSpecialChar(someobj.artist));
    playarray[playi++] = encodeURIComponent(returnSpecialChar(someobj.album));
    playarray[playi++] = someobj.nsig1;
    playarray[playi++] = someobj.nsig2;
    playarray[playi++] = "MUSIC_"+someobj.musicrid;
    playarray[playi++] = someobj.mp3sig1;
    playarray[playi++] = someobj.mp3sig2;
    playarray[playi++] = "MP3_"+someobj.mp3rid;
    playarray[playi++] = someobj.mkvnsig1;
    playarray[playi++] = someobj.mkvnsig2;
    playarray[playi++] = "MV_"+someobj.mkvrid;
    playarray[playi++] = someobj.hasecho;
    playarray[playi++] = encodeURIComponent("VER=2015;FROM=曲库->\""+searchSourceKey+"\"的搜索结果->大合集->结果页->"+currentDHJID);
    playarray[playi++] = someobj.formats;
    playarray[playi++] = getMultiVerNum(someobj);
	playarray[playi++] = getPointNum(someobj);
	playarray[playi++] = getPayNum(someobj);
	playarray[playi++] = getArtistID(someobj);
	playarray[playi++] = getAlbumID(someobj);
    playstring = playarray.join("\t");
    playstring = encodeURIComponent(playstring);
    return playstring;
}

var currentSearchType = "";
var currentSearchFlag = true;
//检查是否在搜索页面操作
function searchResultOperation(){
	if(searchLogIsOpen){
		searchIsOperation = true;
	}
}
var searchBeginTime;
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
	if(new Date().getTime() - searchBeginTime > 200000){
		return;
	}
	var call = "MBOXLOG?stype=type_soperation&operationtype="+operationtype+"&pos="+pos+"&snum="+searchBeginNum+"&searchtype="+searchtype+"&refaddr="+refaddr;
	callClientNoReturn(call);
}
function checkDHJWidth(){
    try{   
    var wwidth = $(window).width();
	$("#allcontent,#flowContent,.heji").width(wwidth);
	if(dhjreltype=="ranklist"){
	    $(".hj_main").width(wwidth-202);   
	}else{
	    $(".hj_main").width(wwidth-70); 
	}
	}catch(e){}
}
window.onresize=function(){
    checkDHJWidth();
}
$(function(){	
	//收听合集下的单曲
	$(".w_a_heji").live("click",function(){
		var playMusicString = $(this).attr("data-music");
		singleMusicOption("Play",playMusicString);
		var pos = $(this).attr("data-pos");
		if(typeof(pos)=="undefined"){
			pos = 0;
		}
		searchOperationLog("dhj_play",pos,"music","noref");
	});
	$(".w_a_hj1").live("click",function(){
		var pos = $(this).attr("data-pos");
		if(typeof(pos)=="undefined"){
			pos = 0;
		}
		if($(this).hasClass("w_djbang")){
		    return;
		}
		searchOperationLog("ref",pos,"music","refartist");
	});
	$(".w_a_hj2").live("click",function(){
		var pos = $(this).attr("data-pos");
		if(typeof(pos)=="undefined"){
			pos = 0;
		}
		if($(this).hasClass("w_djbang")){
		    return;
		}
		searchOperationLog("ref",pos,"music","refplaylist");
	});
	$(".w_a_hj3").live("click",function(){
		var pos = $(this).attr("data-pos");
		if(typeof(pos)=="undefined"){
			pos = 0;
		}
		if($(this).hasClass("w_djbang")){
		    return;
		}
		searchOperationLog("ref",pos,"music","refalbum");
	});
	$(".w_a_hj4").live("click",function(){
		var pos = $(this).attr("data-pos");
		if(typeof(pos)=="undefined"){
			pos = 0;
		}
		if($(this).hasClass("w_djbang")){
		    return;
		}
		searchOperationLog("ref",pos,"music","refsubject");
	});
	
	var location = window.location.href;
	location = ''+location;
	location = location.replace("%26showadvice","&showadvice");
	var key = getValue(location,"key");
	var snum = getValue(location,"snum");

	if(snum){
		searchBeginNum = snum;
	}else{
		var nowDate = new Date();
		var pastDate = new Date("1601","00","01");
		searchBeginNum = "utf8_" + getUserID("devid") + encodeURIComponent(key.replace("&", "")) + parseInt((nowDate.getTime() + nowDate.getTimezoneOffset() * 60 * 1000 - pastDate.getTime())/1000/60/60);
	}
	if(typeof(key)=="undefined"||key==""){
	    return;
	}
	searchBeginTime = new Date().getTime();
	key = decodeURIComponent(key);
	searchKey = key;
	searchSourceKey = key;
	key = encodeURIComponent(key);
	var wwidth = $(window).width();
	if(wwidth>200){
	    $("#allcontent,#flowContent,.heji").width(wwidth);
	    $(".hj_main").width(wwidth-70);    
	}
	try{
	    var mliststr = callClient("GetSearchMusicList?key="+key+"&n=1");
	    if(mliststr==""){
	        xiu_heji = "error";
	        getDHJRequest(key);
	        return;
	    }
	    var mlistobj = eval('('+mliststr+')');
	    if(!mlistobj.key||mlistobj.key!=key){
	        xiu_heji = "error";
	        getDHJRequest(key);
	        return;
	    }
	    var mlist = mlistobj.musiclist;
	    if(mlist.length==0){
	        xiu_heji = "error";
	        getDHJRequest(key);
	        return;
	    }
	    var firstsearchmusicname = mlist[0].name;
	    var songname = mlist[0].name;
	    songname = decodeURIComponent(songname);   //   singerName key的歌手名
	    var songartist = mlist[0].artist;   // 搜索 key
	    songartist = decodeURIComponent(songartist);
		var singerId = mlist[0].musicrid  //  歌曲ID

	    if(songartist.length>6){
	        songartist = songartist.substr(0,6);
	    }
	    if(songname.length>12){
	        songname = songname.substr(0,12);
	    }
	    firstsearcharray[0] = songname;
	    firstsearcharray[1] = songartist;
	    firstsearcharray[2] = singerId;

	    songartist =  decodeURIComponent(firstsearchmusicname)
	    if(xiusearchkey.indexOf("(")>-1){
	        xiusearchkey = xiusearchkey.substr(0,xiusearchkey.indexOf("("));
	    }
	    xiusearchkey = $.trim(xiusearchkey);
	    var forflag = true;
	    var concertstr = callClient("GetConcertInfo");
	    if(concertstr!=""){
	        for(var i=0,j=mlist.length;i<j&&forflag;i++){
                var songartist = mlist[i].artist;  
                var concertobj = eval('('+concertstr+')');
                if(concertobj&&concertobj.concertlist){
                    for(var m=0,n=concertobj.concertlist.length;m<n;m++){
                        var conobj = concertobj.concertlist[m];
                        var concertartist = conobj.artist;
                        if(concertartist==songartist){
                            forflag = false;
                            var pic = conobj.pic;
                            pic = changeImgDomain(pic);
                            $("#search_concert").show();
                            $("#search_concert").prepend("<div style='clear:both;'><a data-url='"+conobj.url+"' hidefocus target='_blank' href='###' onclick='concertClick(this);return false;'><img width='620' height='70' onerror='this.onerror=null;this.src=\"img/dhj/concertbanner.jpg\";' src='"+pic+"' /></a></div>");                           
                            callClientNoReturn("DHJFinish?w=661&h=70&type=concert");
                            var conimg = new Image();
                            concertartistid = mlist[i].artistid;
                            conimg.src = "http://g.koowo.com/g.real?aid=text_ad_2055&ver="+getVersion()+"&type=show&uid="+getUserID("uid")+"&cid="+getUserID("devid")+"&itemid="+concertartistid;
                            break;
                        }
                    }
                }     
            }       
	    }else{
	        
	    }
	    if(!forflag){
	        return;
	    }else{
	        getDHJRequest(key);
	    }

        // 露出
		//http://g.koowo.com/g.real?aid=text_ad_3135&ver=盒子版本号&type=show&cid=
		//点击：
		//http://g.koowo.com/g.real?aid=text_ad_3135&ver=盒子版本号&uid=用户ID&cid=cid&url=跳转链接

//		act            写死 8
//		key            音乐盒处理完得到的歌曲名
//		singerName     key的歌手名
//		singerId       歌曲ID
//		searchContent  搜索输入的关键字
//		callback       回调地址 可为空
//		from 渠道号    1001008095


	}catch(e){
	    xiu_heji = "error";
	}	
});
function getDHJRequest(key){
    $.getScript("http://dhjss.kuwo.cn/s.c?all="+key+"&rformat=json&version="+getVersion()+"&callback=getHeJi&tset=artist,album,playlist,subject,ranklist&time="+Math.random());
}
var concertartistid;
function concertClick(obj){
    var url = $(obj).attr("data-url");
    if(url.indexOf("?")>-1){
        url = url + "&cid=" + getUserID("devid");
    }else{
        url = url + "?cid=" + getUserID("devid");  
    }
    if(url!=""){
        openURL(url);
    }
    var conimg = new Image();
    conimg.src = "http://g.koowo.com/g.real?aid=text_ad_2056&ver="+getVersion()+"&uid="+getUserID("uid")+"&cid="+getUserID("devid")+"&itemid="+concertartistid;
}
// 秀场--主播浮动层
var xiusearchkey = "";
var firstsearcharray = [];
var getxiujsondata = "";
function openXIU(obj,pos){
    var url = $(obj).attr("data-url");
    if(url.indexOf("?")>-1){
        url = url + "&cid=" + getUserID("devid");
    }else{
        url = url + "?cid=" + getUserID("devid");  
    }
    if(pos==-8){
        var xiuimg = new Image();
        xiuimg.src = "http://g.koowo.com/g.real?aid=text_ad_3135&ver="+getVersion();
    }else{
        return;
    }
    openURL(url);
    searchOperationLog("x_open",pos,"music","noref");
}
function openURL(url) {
    if (url.indexOf("x.kuwo.cn") > -1) {
        var param = callClient("LiveShowParam");
        if (param != "") {
            if (url.indexOf("?") > -1) {
                url = url + param;
            } else {
                url = url + "?" + param.substr(1);
            }
        }
    }
    //add by luger 添加秀场盒内弹窗弹出20150521
    if(url.indexOf("x.kuwo.cn")>-1){
    	if(getVersion() > 'MUSIC_8.0.1.0'){
    		callClientNoReturn("ShowOpenRoom?width=1400&height=830&url="+encodeURIComponent(url));
    		return;
    	}
    }
    
    var backstr = callClient("OpenBrowser?browser=default&url=" + encodeURIComponent(url));
    if (backstr != 1) {
        window.open(url);
    }
}
//单曲操作
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
var searchKey;

function getUserID(s){
	var clientString = callClient("UserState?src=user");
	var clientid = getValue(clientString,s);
	if(clientid==""){
		clientid = 0;
	}
	return clientid;
}
function getChannelInfo(src,channel){
	if("index"==channel || src.indexOf("init") > -1){
		//return("{'source':'0','qkback':'true'};name:推荐;")
		return('ch:2;name:songlib;');
	}else if("radio"==channel || src.indexOf("radio") > -1){
		//return("{'source':'-2','sourceid':'8','name':'1','id':'-2'};name:电台;");
		return('ch:10000;name:radio;');
	}else if("mv"==channel || src.indexOf("mv") > -1){
		//return("{'source':'-2','sourceid':'3','name':'2','id':'-2'};name:MV;");
		return('ch:10001;name:MV;');
	}else if("classify"==channel || src.indexOf("classify") > -1 || src.indexOf("djzone") > -1){
		//return("{'source':'-2','sourceid':'5','name':'4','id':'-2'};name:分类;");
		return('ch:10002;name:classify;');
	}else if("artist"==channel || src.indexOf("artist") > -1){
		//return("{'source':'-2','sourceid':'4','name':'3','id':'-2'};name:歌手;");
		return('ch:10003;name:artist;');
	}else if("bang"==channel || src.indexOf("bang") > -1){
		//return("{'source':'-2','sourceid':'2','name':'0','id':'-2'};name:排行;");
		return('ch:10004;name:bang;');
	}else if("jxj"==channel || src.indexOf("jxj") > -1){
		return("{'source':'-2','sourceid':'86237','name':'15','id':'-2'};name:精选集;");
	}else if("xiu"==channel || src.indexOf("x.kuwo.cn") > -1){
		return("ch:8;name:直播;");
	}
}