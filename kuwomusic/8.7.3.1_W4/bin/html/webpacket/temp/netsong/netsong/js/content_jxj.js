var currentObj;
var isIE = !!(window.attachEvent && !window.opera)||!!window.ActiveXObject||"ActiveXObject" in window;
var isIE6 = $.browser.msie && $.browser.version=="6.0" == true;
var fobj = window.parent;
var reqRetry = false;

//if(fobj.QKOBJ && fobj.QKOBJ.reqretry && fobj.QKOBJ.reqretry==1){
//  reqRetry = true;
//}

function getDomainIPURL(url){
    var urlindex1 = url.indexOf("http://");
    var urlindex2 = url.indexOf(".cn/");
    var srchost = url.substring(urlindex1+7,urlindex2+3);
    var newurl = url.replace(srchost,fobj.hostConfig)+"&thost="+srchost;
    return newurl;
}

function scrollRefresh(){
    $(window.parent.document).find("#frame_content").height($("body").eq(0).height());
    try{
        iframeObj.refresh();
    }catch(e){}
}

function returnSpecialChar(s){
    s = ''+s;
	return s.replace(/\&amp;/g,"&").replace(/\&nbsp;/g," ").replace(/\&apos;/g,"'").replace(/\&quot;/g,"\"").replace(/\%26apos\%3B/g,"'").replace(/\%26quot\%3B/g,"\"").replace(/\%26amp\%3B/g,"&");
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

function singleMusicOption(option,musicString,mdcode){
    var csrc = $("body").attr("data-csrc")||'';
	var call = "";
	var musicstr = returnSpecialChar(musicString);
	if(option=="MV"){
		call = "Play?mv=1&n=1&s1="+musicstr+"&CSRC="+encodeURIComponent(csrc);
	}else if(option=="ShowHQ"){
		call = "SelQuality?mv=0&n=1&s1="+musicstr+"&mediacode="+mdcode+"&play=1";
	}else{
		call = option+"?mv=0&n=1&s1="+musicstr+"&CSRC="+encodeURIComponent(csrc);
	}
	callClientNoReturn(call);
	musicstr = null;
	call = null;
}
function multipleMusicOption(option,musicString,mdcode,ispack){
    var csrc = $("body").attr("data-csrc")||'';
	var call = "";
	var musicstr = returnSpecialChar(musicString);
    if(csrc!="")musicstr+="&CSRC="+encodeURIComponent(csrc);
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
window.onload = function(){
    var url=decodeURIComponent(window.location.href).replace(/###/g,'');
    var msg=getUrlMsg(url);
    var csrc = getStringKey(msg,'csrc');
    $("body").attr("data-csrc",csrc);
    // 歌曲 播放 添加 MV 下载 更多等操作
    $(".m_play").live("click",function(){
        if($(this).parentsUntil("ul").hasClass("copyright")){
            musicOnline();
            return;
        }
        var playMusicString = $(this).parent().attr("data-music");
        if(playMusicString){
            singleMusicOption("Play",playMusicString);
        }
    });
    $(".m_add").live("click",function(){
        if($(this).parentsUntil("ul").hasClass("copyright")){
            musicOnline();
            return;
        }
        var playMusicString = $(this).parent().attr("data-music");
        var playindex = 0;
        if(playMusicString){
            playindex++;
            var playMusicStr = "n="+playindex+"&s"+playindex+"="+playMusicString;
            multipleMusicOption("AddTo",playMusicStr);
        }

    });
    $(".m_mv").live("click",function(){
        if($(this).parentsUntil("ul").hasClass("copyright")){
            musicOnline();
            return;
        }
        var lmName = $(this).parents(".imsCva").find(".cvaRtit").html()||$(this).parents(".imsCvd").find(".cvbTit").html();
        var csrc = $("body").attr("data-csrc")+'->'+lmName+'->'+$(this).parent().find(".w_name").html();
        var playMusicString = $(this).parents("li").find(".icon").attr("data-music")+"&CSRC="+encodeURIComponent(csrc);
        if(playMusicString){
            singleMusicOption("MV",playMusicString);
        }
    });
    $(".m_down").live("click",function(){
        if($(this).parentsUntil("ul").hasClass("copyright")){
            musicOnline();
            return;
        }
        var playMusicString = $(this).parent().attr("data-music");
        if(playMusicString){
            singleMusicOption("Down",playMusicString);
        }
    });
    $(".m_more").live("click",function(){
        if($(this).parentsUntil("ul").hasClass("copyright")){
            musicOnline();
            return;
        }
        var playMusicString = $(this).parent().attr("data-music");
        if(playMusicString){
            var call = "ShowOperation?song="+playMusicString;
	        callClientNoReturn(call);
        }
    });
    // 清晰度
    $(".m_hd").live("click",function(){
        if($(this).parentsUntil("ul").hasClass("copyright")){
            musicOnline();
            return;
        }
        var playMusicString = $(this).parents("li").find(".icon").attr("data-music");
        var mdcode = $(this).attr("data-md");
        if(playMusicString&&mdcode){
		    singleMusicOption("ShowHQ",playMusicString,mdcode);
        }
    });
    // 歌曲名称 点击
    $(".w_name").live("click",function(){
        if($(this).parentsUntil("ul").hasClass("copyright")){
            musicOnline();
            return;
        }
        var lmName = $(this).parents(".imsCva").find(".cvaRtit").html()||$(this).parents(".imsCvd").find(".cvbTit").html();
        var csrc = $("body").attr("data-csrc")+'->'+lmName+'->'+$(this).html();
        var playMusicString = $(this).attr("data-music")+"&CSRC="+encodeURIComponent(csrc);
        if(playMusicString){
            singleMusicOption("Play",playMusicString);
        }
    });
    // 全部播放 添加 MV 下载 操作
    $(".all_play").live("click",function(){
        var playarray = [];
        var playindex = 0;
        $(".icon").each(function(i){
            var thisObj = $(this);
            var musicstr = thisObj.attr("data-music");
            var flag = true;
            var inputprev = thisObj.parents(".music_wrap")|| thisObj.parents("li");
            if(inputprev.parent().hasClass("copyright")){
                //musicOnline();
                flag = false;
            }else{
                if(inputprev.children().hasClass("m_l")){
                    flag = inputprev.find(".m_ckb").attr("checked");
                }    
            }
            if(flag&&musicstr){

                playindex++;
                playarray[playarray.length] = "&s"+playindex+"="+musicstr;
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
            var musicstr = thisObj.attr("data-music");
            var flag = true;
            var inputprev = thisObj.parents(".music_wrap")|| thisObj.parents("li");
            if(inputprev.parent().hasClass("copyright")){
                //musicOnline();
                flag = false;
            }else{
                if(inputprev.children().hasClass("m_l")){
                    flag = inputprev.find(".m_ckb").attr("checked");
                }    
            }
            if(flag&&musicstr){
                playindex++;
                playarray[playarray.length] = "&s"+playindex+"="+musicstr;
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
            var musicstr = thisObj.attr("data-music");
            var flag = true;
            var inputprev = thisObj.parents(".music_wrap")|| thisObj.parents("li");
            if(inputprev.parent().hasClass("copyright")){
                //musicOnline();
                flag = false;
            }else{
                if(inputprev.children().hasClass("m_l")){
                    flag = inputprev.find(".m_ckb").attr("checked");
                }    
            }
            if(flag&&!thisObj.find(".m_mv").hasClass("m_mv_n")&&musicstr){
                playindex++;
                playarray[playarray.length] = "&s"+playindex+"="+musicstr;
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
            var musicstr = thisObj.attr("data-music");
            var flag = true;
            var inputprev = thisObj.parents(".music_wrap")|| thisObj.parents("li");
            if(inputprev.parent().hasClass("copyright")){
                //musicOnline();
                flag = false;
            }else{
                if(inputprev.children().hasClass("m_l")){
                    flag = inputprev.find(".m_ckb").attr("checked");
                }    
            }
            if(flag&&musicstr){
                playindex++;
                playarray[playarray.length] = "&s"+playindex+"="+musicstr;
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
    $(".music_wrap").live("dblclick", function () {
        if($(this).hasClass("copyright")){
            musicOnline();
            return;
        }
        var lmName = $(this).parents(".imsCva").find(".cvaRtit").html()||$(this).parents(".imsCvd").find(".cvbTit").html();
        var csrc = $("body").attr("data-csrc")+'->'+lmName+'->'+$(this).find(".w_name").html();
        var playMusicString = $(this).find(".w_name").attr("data-music")+"&CSRC="+encodeURIComponent(csrc);
        if (playMusicString) {
            singleMusicOption("Play", playMusicString);
        }
    });
    $(".music_wrap").live("mousedown", function (e) {
        var ev = e||event;
        if(typeof(ev.which)!="undefined"&&ev.which==3){
            return;
        }
        currentX = ev.clientX;
        currentY = ev.clientY;
	    isDragMusic = true;
	    kk = true;
	    dragMusicString = $(this).find(".w_name").attr("data-music");
	    $(this).mousemove(function (e) {
	        var ev = e||event;
            var X = ev.clientX;
            var Y = ev.clientY;
            if(Math.abs(X-currentX)>5||Math.abs(Y-currentY)>5){
            }else{
                return false;
            }
	        if(isDragMusic&&dragMusicString!=""){
		        var currentobj = $(event.srcElement);
		        if(currentobj.is("a")){
			        isDragMusic = false;
			        return false;
		        }else if(currentobj.is("input")){
			        isDragMusic = false;
			        return false;
		        }else{
			         if(kk){
			            kk = false;
			            if($(this).hasClass("copyright")){
                            musicOnline();
                            return;
                        }
				        callClientNoReturn("Begindrag?song="+dragMusicString);
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
//   	currentObj = window.parent.goldjson;
   	currentObj={
   		extend: "",
		id: "87045",
		name: "酷我音乐调频",
		other: "|psrc=分类->|bread=-2,5,分类,-2",
		qkback: true,
		source: "21",
		sourceid: "http://album.kuwo.cn/album/h/mbox?id=911&from=jxfocus"
   	}
    centerLoadingStart("index");
	getSomeData();	
}
var kk=true;
var isDragMusic = false;
var dragMusicString = "";
var currentX;
function openTanMu(obj){
    if($(obj).parentsUntil("ul").hasClass("copyright")){
        musicOnline();
        return;
    }
    var lmName = $(this).parents(".imsCva").find(".cvaRtit").html()||$(this).parents(".imsCvd").find(".cvbTit").html();
    var csrc = $("body").attr("data-csrc")+'->'+lmName+'->'+$(obj).parents("li").find(".w_name").html();
    var playMusicString = $(obj).parents("li").find(".icon").attr("data-rid")+"&CSRC="+encodeURIComponent(csrc);
    if(playMusicString){
        singleMusicOption("MV",playMusicString+"&tanmustarted=1");
    }  
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
var iplaynum = 100;
var iPlayPSRC = "";
var csrc="";
function iPlay(evt, source, sourceid, obj) {

    iPlayPSRC = $(obj).attr("data-ipsrc");
    if($("body").attr("data-csrc").indexOf("原创电台")>-1){
        csrc = "曲库->分类->原创电台->相关节目全集->"+$(obj).parents(".b_wrap").find(".b_name a").html();
    }else{
        csrc = "曲库->分类->精选集->"+$(obj).parents(".b_wrap").find(".b_name a").html();
    }
    if (source == 4) {
        $.getScript("http://search.kuwo.cn/r.s?stype=artist2music&artistid=" + sourceid + "&pn=0&rn=" + iplaynum + "&callback=playArtistMusic&show_copyright_off=1&alflac=1");
    } else if (source == 13) {
        $.getScript("http://search.kuwo.cn/r.s?stype=albuminfo&albumid=" + sourceid + "&callback=playAlbumMusic&show_copyright_off=1&alflac=1");
    } else if (source == 21) {
        sourceid = getValue(sourceid,"id");
        $.getScript("http://album.kuwo.cn/album/mbox/commhd?flag=1&id=" + sourceid + "&pn=0&rn="+iplaynum+"&callback=playZhuanTiMusic");
    }
    if (isIE) {
        event.cancelBubble = true;
    } else {
        evt.stopPropagation();
    }
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
    if(csrc!="")bigString+="&CSRC="+encodeURIComponent(csrc);
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
    var album = data.name;
    for (var i = 0; i < musicSize; i++) {
        musicList[i].artistid = artistid;
        musicList[i].albumid = albumid;
        musicList[i].album = album;
    }
    var bigString = "";
    bigString = playMusicBigString(musicList, true);
    if(csrc!="")bigString+="&CSRC="+encodeURIComponent(csrc);
    callClientNoReturn("Play?mv=0&n=" + musicSize + bigString);
    bigString = null;
    musicList = null;
    data = null;
}
function playZhuanTiMusic(jsondata) {
    var data = jsondata;
    if (data == null || typeof (data.musiclist) == "undefined" || data.musiclist.length == 0) {
        return;
    }
    var musicList = data.musiclist;
    var musicSize = musicList.length;
    var bigString = "";
    var musicarray = [];
    var musici = 0;
    var someobj;
    var musicString;
    var psrc = iPlayPSRC || "";
	psrc = "VER=2015;FROM=曲库->"+psrc;
	psrc = encodeURIComponent(psrc);  
	var onlineflag = false;  
    for (var i = 0; i < musicSize; i++) {
        someobj = musicList[i];
        if(typeof(someobj.online)!="undefined"&&someobj.online.length==1&&someobj.online==0){
            onlineflag = true;
            continue;
        }
        musicString = decodeURIComponent(someobj.param).replace(/;/g, "\t");
        musicString += '\t'+psrc;
        musicString = encodeURIComponent(musicString);
        musicarray[musici++] = '&s';
        musicarray[musici++] = (i + 1);
        musicarray[musici++] = '=';
        musicarray[musici++] = musicString;
    }
    try{
    if(onlineflag){
        if(musicarray.length==0){
            musicOnline(); 
            return;   
        }else{
            musicOnline(true);
        }
    }
    }catch(e){}
    bigString = musicarray.join("");
    if(csrc!="")bigString+="&CSRC="+encodeURIComponent(csrc);
    callClientNoReturn("Play?mv=0&n=" + musicSize + bigString);
    bigString = null;
    musicList = null;
    data = null;
    musicSize = null;
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
    var psrc = iPlayPSRC || "";
	psrc = "VER=2015;FROM=曲库->"+psrc;
	psrc = encodeURIComponent(psrc);
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
            musicstringarray[musicstringarray.length] = musicString;
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
    try{
    if(onlineflag){
        if(bigarray.length==0){
            musicOnline();    
        }else{
            musicOnline(true);
        }
    }
    }catch(e){}
    return bigString;
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
function imgOnError(obj,type){
    var src = "";
    if(type==100){
        src = "img/def100.jpg";
    }else if(type==90){
        src = "img/def90.jpg";
    }else if(type==140){
        src = "img/def140.jpg";
    }else if(type==60){
        src = "img/def60.jpg";
    } else if (type == 70) {
        src = "img/def70.jpg";
    }else if(type==76){
        src = "img/def76.jpg";
    }
    obj.src = src;
    obj.onerror = null;
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
// 获取精选集数据
function getSomeData(flag) {
	//if(isIE){
        callClientNoReturn('domComplete');
        //var url=decodeURIComponent(decodeURIComponent(window.location.href));
        var url=window.location.href;
        var msg=getUrlMsg(url);
        var sourceid=decodeURIComponent(url2data(msg,'sourceid'));
	    //var sourceid = 'http://album.kuwo.cn/album/h/mbox?id=911&from=jxfocus';
	    var d = new Date();
        var time = d.getFullYear()+d.getMonth()+d.getDate()+d.getHours();
	    var someurl = "";
	    var sometime = "";
	    if(sourceid.indexOf("?")>-1){
		    if(typeof(currentObj.extend)!="undefined"&&currentObj.extend.indexOf("HSY")>-1){
			    sometime = "&type=hsy&time=";
		    }else{
			    sometime = "&time=";
		    }
	    }else{
		    if(typeof(currentObj.extend)!="undefined"&&currentObj.extend.indexOf("HSY")>-1){
			    sometime = "?type=hsy&time=";
		    }else{
			    sometime = "?time=";
		    }
	    }
		if(fobj.isRefresh){
		    someurl = sourceid+sometime+Math.random()+"&year=2016";
		    fobj.isRefresh = false;
	    }else{
		    someurl = sourceid+sometime+time+"&year=2016";
	    }
        if(flag){
            someurl += "&ttt=" + Math.random();
        }
        $.ajax({
	        url:someurl,
	        dataType:"text",
	        type:"get",
	        crossDomain:false,
	        success:function(httptext,textStatus){
	            //try{
	            if(textStatus=="success"&&httptext.indexOf("曲库")>-1){
	                centerLoadingEnd();
				    $(".max_content").html(httptext);
                    if($('body').height()==0){
                        getSomeData(true);
                    }
				    scrollRefresh();
			    }else{
				    loadErrorPage();
			    }
			    //}catch(e){alert(e.message);}
	        },
	        error:function(xhr){
	            if(reqRetry){
		            $.ajax({
		                url:getDomainIPURL(someurl),
		                dataType:"text",
	                    type:"get",
	                    crossDomain:false,
		                success:function(httptext,textStatus){
			                if(textStatus=="success"&&httptext.indexOf("曲库")>-1){
			                    centerLoadingEnd();
				                $(".max_content").html(httptext);
				                scrollRefresh();
			                }else{
				                loadErrorPage();
			                }
		                },
		                error:function(xhr){
			                loadErrorPage();
		                }
	                });
		            return;
		        }
			    loadErrorPage();
	        }
        }); 
	//}
}
function loadErrorPage(){
    centerLoadingEnd();
    try{
    window.parent.refBgColor();
    }catch(e){}
    $("#l_loadfail").remove();
    $("body").append('<div id="l_loadfail" style="display: block;height: 100%;padding:0;"><div class="loaderror"><img src="img/jiazai.jpg" /><p>网络似乎有点问题 , <a hidefocus href="###" onclick="errorRefresh();return false;">点此刷新页面</a></p></div></div>');
    try{ 
        var contentheight = $(window.parent.document).find(".allcontent").height();
        $(window.parent.document).find("#frame_content").height(contentheight);
        $("#l_loadfail").height(contentheight).show();
    }catch(e){}
}
function errorRefresh(){
	$("#l_loadfail").remove();
	callClientNoReturn("NavRefresh");
}
// function centerLoadingEnd(){
//     window.parent.centerLoadingEnd("index");
// }

// iframe 刷新
var iframeObj = {};
iframeObj.refresh = function(){
	var h = $("body").eq(0).height() + 20;
	if($("#l_loadfail").size()>0){
	    h = h - 30;
	}
	try{
	var ph = $(window.parent.document).height()-40;
	if(h<ph){
	    h = ph;
	}
	}catch(e){}
    $(window.parent.document).find("#frame_content").height(h);	
    try{    
        var contentheight = $(window.parent.document).find(".allcontent").height();
	    if(contentheight>h){
	        $(window.parent.document).find(".rtop").hide();    
	    }else if($(window.parent.document).find(".allcontent").scrollTop()>1){
	        $(window.parent.document).find(".rtop").show();  
	    }    
	}catch(e){}
}
