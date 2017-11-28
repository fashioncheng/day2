
var isPassive = false;
window.onload = function() {
    var url = decodeURIComponent(window.location.href).replace(/###/g,'');
    var silent = getStringKey(url,'silent');
    if(silent=="1"){
        isPassive=true;//静默安装
        $(".newUserIndex").remove();
    }else{
        $(".newUserIndex_passive").remove();
    }

    var bangIdArr = [130,124,126];
    var clickFlag = "new_user_1_pv";
    if(isPassive)clickFlag="new_user_2_pv";
    picLog(clickFlag);
    getBangList();
    getRadioList();
    getBangMusicList(bangIdArr);
    getMVList()
    objBind();
};

// 获取榜单页面数据
function getBangList(){
    var url = 'http://qukudata.kuwo.cn/q.k?op=query&cont=tree&node=2&pn=0&rn=20&fmt=json&src=mbox&level=2';
    $.ajax({
        url:url,
        dataType:'jsonp',
        success:function(jsondata){
            var data = jsondata;
            var child = data.child;
            var len = child.length;
            var bangStr = "";
            for (var i = 0; i < len; i++) {
                var item = child[i];
                var id = item.id;
                var name = item.name;
                if (item.pc_extend.indexOf('NOTSHOWPC2015') > -1) continue;
                if(id==22499||id==22495||id==22777||name.indexOf("月新歌榜")>-1){
                    bangStr += createBangBlock (child[i], 'bang', 0);
                }
            }
            $(".bang_list").html(bangStr);
            iframeObj.refresh();
        },
        error:function(){
            showError();
        }
    });
}

// 获取电台列表
function getRadioList(){
    var radioDataList = [{"id":"-4459","latesttime":"981","name":"经典怀旧","playfre":"1","playtime":"0~24","radioblur":"http://star.kwcdn.kuwo.cn/star/radio/blur/-4459.jpg?t=4459","radiopic":"http://star.kwcdn.kuwo.cn/star/radio/blur/-4459.jpg?t=4459","radiopicnp":"/201203/1331021476994.jpg","radiopicpl":"/201203/1331024088189.jpg","recommond":"0","type":"4","upatetime":"2012-05-11"},
        {"id":"-6003","latesttime":"2016-01-26","name":"伤感电台","playfre":"1","playtime":"0~24","radioblur":"http://star.kwcdn.kuwo.cn/star/radio/blur/-6003.jpg?t=6003","radiopic":"http://star.kwcdn.kuwo.cn/star/radio/blur/-6003.jpg?t=6003","radiopicnp":"/201203/1331101145819.jpg","radiopicpl":"/201203/1331100823968.jpg","recommond":"0","type":"4","upatetime":"2008-08-08"},
        {"id":"-6001","latesttime":"2016-07-12","name":"酷我热歌","playfre":"1","playtime":"0~24","radioblur":"http://star.kwcdn.kuwo.cn/star/radio/blur/-6001.jpg?t=6001","radiopic":"http://star.kwcdn.kuwo.cn/star/radio/blur/-6001.jpg?t=6001","radiopicnp":"/201203/1331101086029.jpg","radiopicpl":"/201203/1331100802547.jpg","recommond":"0","type":"4","upatetime":"2008-08-08"},
        {"id":"-25445","latesttime":"2017-01-16","name":"劲爆DJ","playfre":"1","playtime":"0~24","radioblur":"http://star.kwcdn.kuwo.cn/star/radio/blur/-25445.jpg?t=25445","radiopic":"http://star.kwcdn.kuwo.cn/star/radio/blur/-25445.jpg?t=25445","radiopicnp":"/201501/1421894707832.jpg","radiopicpl":"/201501/1421894747561.jpg","recommond":"0","type":"4","upatetime":"2016-06-24"}];
    if(isPassive){
        radioDataList = [{"id":"-4459","latesttime":"981","name":"经典怀旧","playfre":"1","playtime":"0~24","radioblur":"http://star.kwcdn.kuwo.cn/star/radio/blur/-4459.jpg?t=4459","radiopic":"http://star.kwcdn.kuwo.cn/star/radio/blur/-4459.jpg?t=4459","radiopicnp":"/201203/1331021476994.jpg","radiopicpl":"/201203/1331024088189.jpg","recommond":"0","type":"4","upatetime":"2012-05-11"},
        {"id":"-6003","latesttime":"2016-01-26","name":"伤感电台","playfre":"1","playtime":"0~24","radioblur":"http://star.kwcdn.kuwo.cn/star/radio/blur/-6003.jpg?t=6003","radiopic":"http://star.kwcdn.kuwo.cn/star/radio/blur/-6003.jpg?t=6003","radiopicnp":"/201203/1331101145819.jpg","radiopicpl":"/201203/1331100823968.jpg","recommond":"0","type":"4","upatetime":"2008-08-08"},
        {"id":"-25445","latesttime":"2017-01-16","name":"劲爆DJ","playfre":"1","playtime":"0~24","radioblur":"http://star.kwcdn.kuwo.cn/star/radio/blur/-25445.jpg?t=25445","radiopic":"http://star.kwcdn.kuwo.cn/star/radio/blur/-25445.jpg?t=25445","radiopicnp":"/201501/1421894707832.jpg","radiopicpl":"/201501/1421894747561.jpg","recommond":"0","type":"4","upatetime":"2016-06-24"}];
    }
    var radioStr = "";
    for (var i = 0; i < radioDataList.length; i++) {
        radioStr += createRadio(radioDataList[i],(i+1));
    };
    $(".radioBox ul").html(radioStr);
    loadImages();
}

// 创建电台列表
function createRadio(jsondata,index){
    var html = [];
    var clickAndLog = BuildClickStr(jsondata,0,index);
    var id = jsondata.id;
    var radioClass = 'radio_' + id;
    var radio_default_img = "img/def90.jpg";
    var pic =  "http://star.kwcdn.kuwo.cn/star/radio/blur/"+id+"_140.jpg?"+id;
    var listen = jsondata.listeners
    var disname = jsondata.name;
    var arr=[];

    html[html.length] = '<li class="br_wrap ';
    html[html.length] = radioClass;
    html[html.length] = '"><a _onclick="';
    html[html.length] = clickAndLog;
    html[html.length] = '" onclick="';
    html[html.length] = clickAndLog;
    html[html.length] = '" title="';
    html[html.length] = disname;
    html[html.length] = '" class="br_pic" href="###" hidefocus>';
    html[html.length] = '<span class="br_shade"></span><i title="直接播放" class="i_play i_play_big"></i><img width="100" height="100" src="';
    html[html.length] = radio_default_img;
    html[html.length] = '" class="lazy" onerror="imgOnError(this,150);" data-original="';
    html[html.length] = pic + '"' + '>';
    html[html.length] = '</a><p class="br_name"><a onclick="';
    html[html.length] = clickAndLog;
    html[html.length] = '" title="';
    html[html.length] = disname;
    html[html.length] = '" href="###" hidefocus>';
    html[html.length] = disname;
    html[html.length] = '</a></p></li>';

    return html.join("");
}
// 创建电台radiolog及commonclick串
function BuildClickStr(jsondata, ntype,index) {
    var type = 4;
    if (ntype == 0) {
        type = 4;
    } else if (ntype == 1) {
        type = 9;
    }
    var onclick = "radioLog('POSITION:1,1|GPOSITION:1,1| FROMPAGE:新用户首页| RADIOID:" + jsondata.id + '|CSRCTAG:' +jsondata.name + "');";
    var piclog = "picLog('new_user_1_radio"+index+"');";
    if(isPassive)piclog = "picLog('new_user_2_radio"+index+"');";                      
    var commonclick = "commonClick({'source':'9','sourceid':'" + jsondata.id + ",";
    commonclick += jsondata.name + "," + jsondata.radiopicnp + "," + jsondata.radiopicpl + ",";
    commonclick += jsondata.upatetime + "," + jsondata.latesttime + "," + type + ",";
    commonclick += jsondata.playtime + "," + jsondata.listeners + "," + type + ",";
    commonclick += "1',";
    commonclick += "'name'" + ":" + "'" + jsondata.name + "'" + "," + "'id'" + ":" + "'" + jsondata.listeners + "'" + ",";
    commonclick += "'extend'" + ":" + "'|" + 'RADIO_PIC=' + jsondata.radiopic + '|' + 'DIS_NAME=' + jsondata.name + "|','tagIndex':'1'";
    commonclick += "});";
    onclick += commonclick;
    onclick += piclog + "callClient('CloseWindow')";
    return onclick;
}

// 创建一个榜的html
function createBangBlock(obj,from,isrefresh){
    var html = [];
    var name = checkSpecialChar(obj.name,"name");
    var disname = checkSpecialChar(obj.disname,"disname") || checkSpecialChar(name,"disname");
    var titlename = checkSpecialChar(disname,"titlename");
    var info = obj.info;
    var sNum = info.indexOf('更新于');
    var sourceid = obj.sourceid;
    var id = obj.id;
    var csrc = "新用户首页->分类榜单->"+name;
    var other = '|psrc=排行榜->|bread=-2,2,排行榜,0|csrc=曲库->排行榜->'+name;
    var click = commonClickString(new Node(1,id,name,sourceid,'',other));
    if (sNum > -1) info = info.substring(3) + '';
    var pic = obj.pic2 || obj.pic;
    if(pic==""){
        pic = default_img;
    }else{
        pic = changeImgDomain(pic);
    }
    html[html.length] = '<li class="b_wrap"><a data-csrc="';
    html[html.length] = csrc;
    html[html.length] = '" playFn="iPlay(arguments[0],1,';
    html[html.length] = sourceid
    html[html.length] = ',this)" jumpFn="';
    html[html.length] = click;
    html[html.length] = '" title="';
    html[html.length] = titlename;
    html[html.length] = '" class="b_pic" href="###" hidefocus>';
    html[html.length] = '<img data-original="';
    html[html.length] = pic;
    html[html.length] = '" class="lazy" onerror="imgOnError(this,100);" width="100" height="100" src="';
    html[html.length] = default_img;
    html[html.length] = '"></a><p class="b_name"><a onclick="';
    html[html.length] = click;
    html[html.length] = '" title="';
    html[html.length] = titlename;
    html[html.length] = '" href="###" hidefocus>';
    html[html.length] = disname;
    html[html.length] = '</a></p><p class="b_info"><a onclick="';
    html[html.length] = click;
    html[html.length] = '" title="';
    html[html.length] = info;
    html[html.length] = '" href="###" hidefocus>';
    html[html.length] = info;
    html[html.length] = '</a></p></li>';
    return html.join("");
}

// 获取榜单歌曲
function getBangMusicList(bangIdArr){
    for(var i=0;i<bangIdArr.length;i++){
    	(function(index){
            var url = 'http://kbangserver.kuwo.cn/ksong.s?from=pc&fmt=json&type=bang&data=content&id='+bangIdArr[i]+'&pn=0&rn=200&isbang=1&show_copyright_off=1&pcmp4=1';
            url = getChargeURL(url);
            $.ajax({
                url:url,
                dataType:'jsonp',
                success:function(jsondata){
                    var musicList = jsondata.musiclist;
                    var bangMusicStr = "";
                    var piclog = "picLog('new_user_1_song')";
                    if(isPassive)piclog = "picLog('new_user_2_song')";
                    for(var i=0;i<3;i++){
                        var obj = musicList[i];
                        var id = obj.id;
                        var name = obj.name;
                        var artist = obj.artist;
                        var artistid = obj.artistid;
                        var click = "commonClick({'source':'4','sourceid':'"+artistid+"','name':'"+artist+"','id':'4'})";
                        bangMusicStr+='<li><a data-rid="'+
                        id+
                        '" class="w_name" data-csrc="新用户首页->Ku音乐流行榜" hidefocus="" href="javascript:'+piclog+';callClient(\'CloseWindow\')" title="'+
                        name+
                        '">'+
                        name+
                        '</a><a class="artist" onclick="'+
                        click+
                        ';callClient(\'CloseWindow\')" hidefocus="" href="###" title="'+
                        artist+
                        '">&nbsp- '+
                        artist+
                        '</a></li>';
                        saveMusicInfo(obj,"bang","");
                    }
                    $(".bang").eq(index).find("ul").html(bangMusicStr);
                },
                error:function(){
                    showError();
                }
            });
        })(i);
    }
}

// 获取MV
function getMVList(){
    var url = 'http://nplserver.kuwo.cn/pl.svc?op=getlistinfo&pid=236742510&pn=0&rn=3&encode=utf-8&&keyset=mvpl&identity=kuwo&pcmp4=1';
    url = getChargeURL(url);
    $.ajax({
        url:url,
        dataType:'jsonp',
        success:function(jsondata){
            var musicList = jsondata.musiclist;
            var mvStr = "";
            for(var i=0;i<musicList.length;i++){
                mvStr+=createMVBlock(musicList[i],i);;
            }
            $(".mvBox ul").html(mvStr,i);
            loadImages();
        },
        error:function(){
            showError();
        }
    });
}


// 延时加载
function loadImages(){
    var scrollT=document.documentElement.scrollTop||document.body.scrollTop;
    var clientH=document.documentElement.clientHeight;
    var scrollB=scrollT+clientH;
    var imgs = $('.lazy');
    imgs.each(function(i){
        if($(this)[0].offsetTop<scrollB){
            if($(this)[0].getAttribute('data-original')!=='{$pic}'){
                $(this)[0].setAttribute('src', $(this)[0].getAttribute('data-original'));
                $(this).removeClass('lazy');
            }
        }
    });
}

// 事件绑定
function objBind(){
    $(".b_pic").live("click",function(){
        picLog("new_user_1_cat_bang"+($(this).parents(".b_wrap").index()+1));
        var jumpFn = $(this).attr("jumpFn");
        var playFn = $(this).attr("playFn");
        eval(playFn)
        setTimeout(function(){
            eval(jumpFn);
            callClient("CloseWindow");
        },100);
    });
    $(".bangCover").live("click",function(){
        picLog($(this).attr("data-clickFlag"));
        var id = $(this).attr("c-id");
        var index = $(this).parents(".bang").index();
        var bangNameArr = ["风向标","华语榜","粤语榜"]
        var other = '|psrc=排行榜->|bread=-2,2,排行榜,0|tabIndex='+index+'|csrc=曲库->排行榜->Ku音乐流行榜->'+bangNameArr[index];
        var source="1";
        var sourceid="257172";
        var name="Ku音乐流行榜";
        saveDataToCache("isNewUserIndex","true");
        commonClick(new Node(source,sourceid,name,id,'',other));
        callClient("CloseWindow");
        return false;
    });
    $(".closeWindow").live("click",function(){
        if(!$(this).hasClass("noPicLog"))picLog($(this).attr("data-clickFlag"));
        callClient("CloseWindow");
    });
    $(".moreRadio").live("click",function(){
        picLog($(this).attr("data-clickFlag"));
        commonClick({'source':'-2','sourceid':'8'});
        callClient("CloseWindow");
    });
    $(".moreBang").live("click",function(){
        picLog($(this).attr("data-clickFlag"));
        commonClick({'source':'-2','sourceid':'2'});
        callClient("CloseWindow");
    });
    $(".sign").live("click",function(){
        picLog("new_user_2_more4");
        callClient('dropTipsSign?');
        callClient("CloseWindow");
    });
    $(".moreGirl").live("click",function(){
        picLog("new_user_2_more1");
        callClient("Jump?channel=mnx");
        callClient("CloseWindow");
    });
    $(".moreMv").live("click",function(){
        picLog("new_user_2_more2");
        go_channel_mv_page();
        callClient("CloseWindow");
    });
}
// MV创建方法
function createMVBlock(obj,index){
    var online = obj.online;
    if(typeof(online)!="undefined"&&online.length==1&&online==0){
        return;
    }
    if(obj.hasmv==0)return;
    var html = [];
    var name = checkSpecialChar(obj.name,"name");
    var disname = checkSpecialChar(obj.disname,"disname") || checkSpecialChar(name,"disname");
    var titlename = checkSpecialChar(disname,"titlename");
    var pic = obj.pic || obj.mvpic || obj.img || '';
    var infoStr = '';
    var click = '';
    var datamv = '';
    var psrc = "VER=2015;FROM=曲库->"+psrc;
    psrc = encodeURIComponent(psrc);
    var csrc = "新用户首页->禁播MV->"+name
    var rid = obj.musicid||obj.id;
    var param = obj.params;
    var piclog = "picLog('new_user_2_mv"+(index+1)+"');callClient('CloseWindow')";
    if(param!=""){
        param = returnSpecialChar(param);
        var paramArray = param.split(";");
        var childarray = [];
        childarray[0] = encodeURIComponent(returnSpecialChar(name));
        var artist = obj.artist;
        childarray[1] = encodeURIComponent(returnSpecialChar(artist));
        var album = paramArray[2];
        childarray[2] = encodeURIComponent(returnSpecialChar(album));
        for(var j=3;j<paramArray.length;j++){
            childarray[j] = paramArray[j];
        }
        var formats = obj.formats || "";
        childarray[childarray.length] = psrc;
        childarray[childarray.length] = formats;
        childarray[childarray.length] = getMultiVerNum(obj);
        childarray[childarray.length] = getPointNum(obj);
        childarray[childarray.length] = getPayNum(obj);
        childarray[childarray.length] = getArtistID(obj);
        childarray[childarray.length] = getAlbumID(obj);
        mvString = childarray.join('\t');
        childarray = null;
        var mvridnum = paramArray[11];
        if (mvridnum) {
            if(mvridnum.indexOf("MKV")>-1){
                mvridnum = mvridnum.substring(4);
            }else if(mvridnum.indexOf("MV")>-1){
                mvridnum = mvridnum.substring(3);
            }
        }
        var musicridnum = paramArray[5];

        
        if (musicridnum) {
            if(musicridnum.indexOf("MUSIC")>-1) musicridnum = musicridnum.substring(6);
        }
        mvString = encodeURIComponent(mvString);
    }
    click = "someMV(this);"+piclog;
    datamv = mvString;
    MVLISTOBJ[MVLISTOBJ.length] = mvString;
    MVLISTOBJECT[MVLISTOBJECT.length] = obj;
    pic = getMVPic(pic);
    if(obj.artist.length>20){
        obj.artist=obj.artist.substring(0,21)+'...';
    }
    infoStr = '<p class="bmv_info"><a onclick="'+commonClickString(new Node("4",obj.artistid,checkSpecialChar(obj.artist,"name"),"4"))+';callClient(\'CloseWindow\')" title="'+ checkSpecialChar(obj.artist,"titlename") +'" href="###" hidefocus>'+checkSpecialChar(obj.artist,"disname")+'</a></p>';
    if(pic==""){
        pic = mv_default_img;
    }else{
        pic = changeImgDomain(pic);
    }
    var mviconstr = "";
    if(typeof(getTanMuMVIconStr)=="function"){
        mviconstr = getTanMuMVIconStr(obj);
    }
    html[html.length] = '<li class="bmv_wrap';
    html[html.length] = getCopyrightClass(obj);
    html[html.length] = '" data-index="'+index+'" data-rid="'+rid+'">';
    html[html.length] = mviconstr;
    html[html.length] = '<a onclick="';
    html[html.length] = click;
    html[html.length] = '" data-mv="';
    html[html.length] = datamv;
    html[html.length] = '" data-csrc="';
    html[html.length] = csrc;
    html[html.length] = '" title="';
    html[html.length] = titlename;
    html[html.length] = '" class="bmv_pic" href="###" hidefocus><img width="165" height="95" src="';
    html[html.length] = mv_default_img;
    html[html.length] = '" class="lazy" onerror="imgOnError(this,140);" data-original="';
    html[html.length] = pic;
    html[html.length] = '" /></a><p class="bmv_name"><a onclick="';
    html[html.length] = click;
    html[html.length] = '" data-mv="';
    html[html.length] = datamv;
    html[html.length] = '" data-csrc="';
    html[html.length] = csrc;
    html[html.length] = '" title="';
    html[html.length] = titlename;
    html[html.length] = '" href="###" hidefocus>';
    html[html.length] = disname;
    html[html.length] = '</a></p>';
    html[html.length] = infoStr;
    html[html.length] = '</li>';
    return html.join("");
}
// 跳转MV
function go_channel_mv_page(){
    var channelNode = 'MV';
    var src = 'channel_mv.html?';
    var channelInfo = getChannelInfo("","mv");
    var source = 43;
    var sourceid = 34;
    var param = '{\'source\':\''+source+'\',\'sourceid\':\''+sourceid+'\'}';
    var info = 'source='+source+'&sourceid='+sourceid;
    src = src+info;
    var call = "Jump?channel="+channelNode+"&param="+encodeURIComponent(param) + ";" + encodeURIComponent('url:${netsong}'+src) + ';' + encodeURIComponent('jump:'+channelInfo);
    callClient(call);
}
// 点击统计
function picLog(clickFlag){
    if(!clickFlag){
        return;
    }
    window.setTimeout(function(){
        var pic = new Image();
        pic.src="http://webstat.kuwo.cn/logtj/comm/commjstj/pc/"+clickFlag+".jpg";
    },200);
}

// error
function showError(){
    $(".successBox").hide();
    $(".errorBox").show();
    if(isPassive){
        picLog('new_user_2_error');
    }else{
        picLog('new_user_1_error');
    }
}
