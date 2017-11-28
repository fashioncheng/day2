var id = '';
var sampl = '';
var relaIndex = 0;
var totalIndex = -1;
var CurStatus = 3;
var bDetailEmpty = true;
var GuidLen = 36;
var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
var globalGuid = '';

$(function(){
    callClientNoReturn('domComplete');
    initParam();
    BindObj();
    
    var url = decodeURIComponent(window.location.href).replace(/###/g, '');
    id = parseInt(getValue(url, "id"));    
    BuildListInfo(id);
    GetNowPlayInfo();
    InitALlListSonsgStatus(totalIndex,CurStatus);    
    init_comment_model('.commentBox', 'cd', id);
    $(".commentBox").hide();
    BindObj();
    
    //console.log(bDetailEmpty);
    SetDetailIconTipShow(false);
    if( bDetailEmpty ){
        AsynGetAlbumDetailInfo(id);       
    }
})

function SetDetailIconTipShow(bshow){
    if( bshow ){
        $('.login_guide').show();
    }else{
        $('.login_guide').hide();
    }
}


function AsynGetAlbumDetailInfo(strid){
    
    if( strid == '' || strid == null ){
        return;
    }    
    
    var guid = GenGuid();
    globalGuid = guid;
    //console.log('guid:' + guid);
    var Param = 'funcname=GetCDIntro&guid=' + guid;
    Param = encodeURIComponent(Param);
   var call = 'GetCDIntro?id=' + strid + '&channel=hificollectdetail&asyncparam=' + Param;
    callClientNoReturn(call);
    //console.log(call);
}

function GetAlbumDetailInfoAndSet(strId){
    var strAlbumDetail = '';
    var url = 'http://api.cd.kuwo.cn/album/detail';
	$.ajax({
        url:url,
		dataType:"text",
		type:"post",
		crossDomain:false,
		data:{
			'id':strId
		},        
		success:function(str){            
			var jsondata = eval('('+str+')');
			if(jsondata.status==0 && jsondata.msg=='ok'){               
				var data = jsondata.data;               
                if( typeof(data) != 'undefined'){
                    //console.log(data.intro);
                    strAlbumDetail = data.intro;
                    //console.log(' From Net+++++');
                    SetAlbumIntroInfo(strAlbumDetail,true);
                    return;
                }				
			}
            
			if(jsondata.status=='query error'){
				strAlbumDetail = '';
                SetDetailIconTipShow(true);
			}
		},
		error:function(){
            strAlbumDetail = '';
            SetDetailIconTipShow(true);
		}
    });  
    
    return strAlbumDetail;
}


function OnRefresh(str){
    window.location.reload();
}

function GetNowPlayInfo(){
    var call = 'GetPlayingSongListInfo';
    var rst = callClient(call);
    if( rst == '' || rst == null ){
        InitALlListSonsgStatus(totalIndex,3);
        return;
    }
    
    var alid  = getValue(rst,'CdAlbumId');
    if( alid =='' || alid == null || alid != id ){
        return;
    }
    
    id = alid;
    
    var status = getValue(rst,'Status');
    var songPos = getValue(rst,'SongPos');
    totalIndex = songPos; 
    CurStatus = status;
}

function initParam(){
    id = '';
    sampl = '';
    relaIndex = 0;
    totalIndex = -1;
    CurStatus = 3;
    bDetailEmpty = true;
    globalGuid = '';
}

function BindObj(){
    $('.all_play').unbind('click').bind('click',PlayAllSongs);
    $('.all_add').unbind('click').bind('click',AddSongsTo);
    $('.all_ckb').unbind('click').bind('click',CheckOrUnCheckAllLists);
    $('.cdmusic_wrap').live('click',SongLiClick);
    $('.share').unbind('click').bind('click',ShareAlbumInfo);

    //切换type
    $('.controlBox a').live('click',function(){
        if($(this).hasClass('active')){
            return;
        }
        $('.controlBox a').removeClass('active');
        $(this).addClass('active');
        var btnName = $(this).html();
        if(btnName.indexOf('曲目')>-1){
            $('.infoBox,.commentBox').hide();
            $('.musicContentBox').show();
            return;
        }
        if(btnName.indexOf('详情')>-1){
            $('.musicContentBox,.commentBox').hide();
            $('.infoBox').show();
            return;
        }
        if (btnName.indexOf('评论') > -1) {
            $(".commentBox").show();
            $('.musicContentBox,.infoBox').hide();
            $('.commentBox').show();
            return;
        }
    });
}

function PlayAllSongs(){
    var call='CDPlayMusic?type=all&id=' + id;
    //console.log(call);
    callClientNoReturn(call);
}

function ShareAlbumInfo(){
    
    var strParam = encodeURIComponent('&type=cdpackage&position=cdpackage');
    var call = 'ShowShareWnd?rid=' + id + '&data=' + strParam;
    //console.log(call);
    callClientNoReturn(call);    
}

function AddSongsTo(){
    
    var songs = $('#musicListBox li');
    if( songs.length <= 0 ){
        return;
    }
    
    var nindexs = '';
    for( var nCnt = 0;nCnt < songs.length;nCnt++)
    {        
        var chk = $(songs[nCnt]).find('.m_ckb').attr('checked');
        if( chk != 'checked' ){
            continue;
        }
        nindexs += $(songs[nCnt]).attr('abso');        
        if( (nCnt +1) != songs.length ){            
            nindexs += ',';           
        }        
    }
    if( nindexs == '' ){
        var callalert = 'PlsChooseDlg?type=8';
        //console.log(callalert);
        callClientNoReturn(callalert);
        return;
    }
    
    var call = 'ShowCDMenu?type=addtolist&id=' + id + '&indexs=' + nindexs;
    //console.log(call);
    callClientNoReturn(call);    
}

function SongLiClick(){
    $('.cdmusic_wrap').removeClass('music_wrapClicked');
    $(this).addClass('music_wrapClicked');    
}


function PlaySongDbList(ele){
    if( typeof(ele) == 'undefined'){
        return;
    }
    
    var obj = $(ele);    
    var index = obj.attr('abso');
    var rid = obj.attr('rid');    
    var call = 'CDPlayMusic?type=single&id=' + id +'&index=' + index + '&rid=' + rid;
    console.log(call);
    callClientNoReturn(call);    
}

function PlayOneSongClk(ele){
    
    var obj = $(ele).parent().parent().parent();
    if( typeof(obj) == 'undefined'){
        return;
    }
    
    var index = obj.attr('abso');
    var rid = obj.attr('rid');
    
    var call = 'CDPlayMusic?type=single&id=' + id +'&index=' + index + '&rid=' + rid;
    console.log(call);
    callClientNoReturn(call);
}

function CheckOrUnCheckAllLists(){
    var bChk = this.checked;    
    if( bChk){
        $('.m_ckb').attr('checked',true);
    }else{
        $('.m_ckb').attr('checked',false);
    }
}

function SetalbumInfo(jsonObj){
    if( jsonObj == '' || jsonObj == null || typeof(jsonObj) == 'undefined'){
        return;
    }
    
    //console.log(jsonObj);
    
    $('.cdHeadInfo .cdName').get(0).innerHTML = jsonObj.name;
    $('.cdHeadInfo .cdName').attr('title',jsonObj.name);
    
    $('.cdHeadInfo .artist_name').get(0).innerHTML = jsonObj.artist;
    $('.cdHeadInfo .artist_name').attr('title',jsonObj.artist);
    
    $('.cdHeadInfo .suffix').get(0).innerHTML = jsonObj.format;
    $('.cdHeadInfo .present_time').get(0).innerHTML = jsonObj.publish_time;
    
    var picUrl = jsonObj.coverurl;
    if( picUrl != '' && picUrl != null ){
        if( picUrl.indexOf('_720.jpg') > 0 ){
           picUrl = picUrl.replace('_720.jpg','_150.jpg');
        }
    }
    $('.cdPicBox .cdHeadPic').attr('src',picUrl);
    
    var tags = jsonObj.tags;
    if( tags == '' || tags == null ){
        $('.cdHeadInfo .li_category_info').hide();
    }else{
        $('.cdHeadInfo .li_category_info').show();
        $('.cdHeadInfo .category').get(0).innerHTML = jsonObj.tags;    
    }
//    // 详情为空 没方案
//    $('.infoBox p').html(jsonObj.intro);
}

function SetAlbumIntroInfo(strInfo ,bsave){
    if( strInfo == '' || strInfo == null ){
         SetDetailIconTipShow(true);
        return;
    }    
    
    var arrInfo = [];    
    arrInfo = strInfo.split('\n');   
    var strInfo = '';
    for(var index = 0;index< arrInfo.length;index ++ ){
         strInfo += '<p>' + arrInfo[index] + '</p>';
        //console.log(arrInfo[index]);
    }
    //console.log('sdfasdfsad:' + strInfo);
    document.getElementById('cd_list_detail_info').innerHTML = '';
    if( strInfo != '' && strInfo != null ){
        $('.infoBox').append(strInfo);
        
        if( bsave ){
        var call = 'SetDownloadCDInfo?type=intro&id=' + id + '&content=' + encodeURIComponent(strInfo);
        //console.log(call);
        callClientNoReturn(call);
        }    
    }else{
        SetDetailIconTipShow(true);
    }   
    
    //console.log('setalbumInfotrinfo ' + strInfo);    
}

function BuildListInfo(strid){
    var call = 'GetDownloadCDInfo?id=' + strid + '&needsongs=1';
    var rst = callClient(call);       
    var JsonObj = eval('('+rst+')'); 
    //console.log(rst);
    var JsonSongArr = JsonObj[0];    
    SetalbumInfo(JsonSongArr);
    sampl = JsonSongArr["sampling"];
    var bHasDetail = false;
    if( JsonSongArr.hasOwnProperty('intro')){
        var intro = JsonSongArr["intro"];
        if( intro != '' && intro != null ){
            bDetailEmpty = false;
            console.log( ' from local ++++');            
            SetAlbumIntroInfo(decodeURIComponent(intro),false);
        }
    }else{
        bDetailEmpty = true;
    }
    var cdMusicArr = JsonSongArr["songs"] || [];
    $('#songsnum').get(0).innerHTML = cdMusicArr.length;
    if( cdMusicArr.length <= 0 ){
        //这里做特殊处理 需要和产品沟通
        return;
    }
    BuildSongList(JsonSongArr["songs"]);
}

function BuildSongList(JsonSongs){
    
    var model = loadTemplate('#kw_musicListBox');    
    var htmlStr = ''; 
    var indexIndisk = 0;
    
    while(true){        
        
        var song = JsonSongs.filter(function(v){return (parseInt(v.diskindex) == indexIndisk)});        
        if( song.length <= 0 ){            
            break;
        }
        
        var strdiv = '<div class="disk_sep" >';
        strdiv += '<span class="disk_index">' + 'Disc ' + (parseInt(indexIndisk) + 1) + '<span>' + '</div>';
        var str = drawListTemplate(song, model, DealWithAllSongsData);
        relaIndex = 0;
        
        var songNext = JsonSongs.filter(function(v){return (parseInt(v.diskindex) == (indexIndisk + 1))});
        if( songNext.length <= 0 && indexIndisk == 0 ){
            strdiv = '';
        }        
        htmlStr += strdiv + str;
        indexIndisk+=1;       
    }    
       
    $('#musicListBox').html(htmlStr);
    loadImages();
}

function OnJump(str) {
    
    commentModel(id);

}

function OnLeaveChanel(){
    
}

function DealWithAllSongsData(obj){
    
    totalIndex +=1;
    relaIndex +=1;
    
    var json = [];        
    var index = relaIndex;
    var numindex = relaIndex;
    var songname = obj.name;
    var artist = obj.artist;
    var failed = '';
    var longfailed = '';
    var sample_failed = '';
    var artist_failed = '';
    var nameboxfailed = '';
    var strerr = '';
    if( obj.hasOwnProperty('isfailed')){
        failed = obj.isfailed;
    }
    
    if( obj.hasOwnProperty('errinfo') ){
        strerr = obj.errinfo;
    }
    
    var nmin = parseInt(parseInt(obj.length)/1000/60);    
    if( nmin < 10 ){
        nmin = "0"+nmin + ":";
    }else{
        nmin = '' + nmin + ':';
    }
    
    var nsec = parseInt(parseInt(obj.length)/1000%60);
    if( nsec < 10 ){
        nsec = "0"+ nsec;
    }else{
        nsec = '' + nsec;
    }
    var duration = nmin + nsec;
    
    var rid = obj.rid;
    var status = '';
    if( failed == '1'){
        status = 'num_icon_play_failed';
        numindex='';
        sample_failed = 'sample_hot';
        longfailed = 'm_long_box_hot';
        artist_failed = 'm_artist_box_hot';
        nameboxfailed = 'm_name_box_hot';
        
    }
    
    json = {
        'index': numindex,
        'sample': sampl,
        'songname': songname,
        'artist': artist,
        'duration': duration,
        'rid':rid,
        'absoindex':totalIndex,
        'relapos':index,
        'failed':status,
        'sample_failed':sample_failed,
        'longbox_failed':longfailed,
        'artist_failed':artist_failed,
        'name_box_failed':nameboxfailed,
        'errinfo':strerr
    }
    return json;
}    

function SongListMenu(Obj){
    var _this = Obj;    
    var nIndex = $(_this).attr('abso');
    console.dir(_this);
    var rid = $(_this).attr('rid');
    var call = 'ShowCDMenu?type=songinfo&id=' + id + '&index=' + nIndex + '&rid=' + rid;
    console.log(call);    
    callClientNoReturn(call);
}

function InitlistStatus(obj){
    
    //console.log('InitlistStatus');
    if( typeof(obj) == 'undefined'){
        return;
    }   
    
    obj.find('.num').removeClass('num_icon');
    obj.find('.num').removeClass('num_icon_pause');
    
    obj.find('.m_name_box').removeClass('m_name_box_playing');
    obj.find('.m_artist_box').removeClass('m_artist_box_playing');
    obj.find('.m_long_box').removeClass('m_long_box_playing');
    obj.find('.sample').removeClass('sample_playing');
    
    for( var songIndex = 0;songIndex < obj.length;songIndex++){
        var subObj = obj[songIndex];
        
        if( $(subObj).find('.num').hasClass('num_icon_play_failed')){
            continue;
        }
        
        var relaPos = $(subObj).attr('relapos');
        $(subObj).find('.num').get(0).innerHTML = relaPos;        
    }
}

function SetSongFailedStatus(strPos,strerrinfo){
    
    if( parseInt(strPos) < 0 ){
        return;
    }
    
    var Obj = $('#musicListBox li').eq(parseInt(strPos));
    if( typeof(Obj) == 'undefined'){
        return;
    }
    
    var relaObj = '';
    relaObj = Obj.find('.m_name_box');
    
    if (!relaObj.hasClass('m_name_box_hot')) {
        relaObj.addClass('m_name_box_hot');
    }
    
    relaObj = Obj.find('.m_artist_box');
    if (!relaObj.hasClass('m_artist_box_hot')) {
        relaObj.addClass('m_artist_box_hot');
    }
    
    relaObj = Obj.find('.m_long_box');
    if (!relaObj.hasClass('m_long_box_hot')) {
        relaObj.addClass('m_long_box_hot');
    }
    
    relaObj = Obj.find('.sample');
    if (!relaObj.hasClass('sample_hot')) {
        relaObj.addClass('sample_hot');
    }
    
    relaObj = Obj.find('.num');
    if( !relaObj.hasClass('num_icon_play_failed') ){        
        
        //console.dir(relaObj);
        relaObj.removeClass('num_icon');        
        relaObj.get(0).innerHTML = '';
        //console.log(relaObj.get(0).innerHTML);
        relaObj.addClass('num_icon_play_failed');
        relaObj.attr('title',strerrinfo);
    }   
}

function InitALlListSonsgStatus(songPos,songstatus,strerrinfo){
    
    var Obj = $('.cdmusic_wrap');
    if(typeof(Obj) == 'undefined' || Obj.length <= 0 ){
        return;
    }    
    
    if( songstatus == 'playfailed'){
        SetSongFailedStatus(songPos,strerrinfo);       
        return;
    }  
    
    if( songstatus == '' || songstatus == null){       
        InitlistStatus(Obj);
        return;
    }
    
    InitlistStatus(Obj);
    if (songstatus == 1 || songstatus == 4) {
        var DesObj = $('.cdmusic_wrap').eq(songPos);
        
        DesObj.find('.num').empty();
        DesObj.find('.num').removeClass('num_icon_pause');
        DesObj.find('.num').addClass('num_icon');
        
        DesObj.find('.m_name_box').removeClass('m_name_box_hot');
        DesObj.find('.m_name_box').addClass('m_name_box_playing');
        
        DesObj.find('.m_artist_box').removeClass('m_artist_box_hot');        
        DesObj.find('.m_artist_box').addClass('m_artist_box_playing');
        
        DesObj.find('.m_long_box').removeClass('m_long_box_hot');
        DesObj.find('.m_long_box').addClass('m_long_box_playing');
        
        DesObj.find('.sample').removeClass('sample_hot');
        DesObj.find('.sample').addClass('sample_playing');
        DesObj.find('.num').removeClass('num_icon_play_failed');
        DesObj.find('.num').attr('title','');
    }else if( songstatus == 2){
        var DesObj = $('.cdmusic_wrap').eq(songPos);
        DesObj.find('.num').empty();
        DesObj.find('.num').removeClass('num_icon');
        DesObj.find('.num').addClass('num_icon_pause');
        
        DesObj.find('.m_name_box').removeClass('m_name_box_hot');
        DesObj.find('.m_name_box').addClass('m_name_box_playing');
        
        DesObj.find('.m_artist_box').removeClass('m_artist_box_hot');        
        DesObj.find('.m_artist_box').addClass('m_artist_box_playing');
        
        DesObj.find('.m_long_box').removeClass('m_long_box_hot');
        DesObj.find('.m_long_box').addClass('m_long_box_playing');
        
        DesObj.find('.sample').removeClass('sample_hot');
        DesObj.find('.sample').addClass('sample_playing');
        DesObj.find('.num').removeClass('num_icon_play_failed');
        DesObj.find('.num').attr('title','');
    }
}

function CDStatusNotify(str){
    
}

function musicNowPlaying(strParam){
    
    var Obj = $('.cdmusic_wrap');
    if( strParam == '' || strParam == null ){        
        //InitlistStatus(Obj);
        return;
    }
    
    //console.log(strParam);
    
    var albumid = getValue(strParam,'CdAlbumId');
    if( albumid == '' || albumid == null){
        var Obj = $('.cdmusic_wrap');
        if(typeof(Obj) == 'undefined' || Obj.length <= 0 ){
            return;
        }    
        InitlistStatus(Obj);
        return;
    }
    
    //console.log(strParam);
    
    if( albumid != id ){//说明专辑切换了，这时候要进行相应状态处理
        var Obj = $('.cdmusic_wrap');
        if(typeof(Obj) == 'undefined' || Obj.length <= 0 ){
            return;
        }    
        InitlistStatus(Obj);
        return;
    }
    
    var songStatus = getValue(strParam,'Status');
    var SongPos = getValue(strParam,'SongPos');
    var errinfo = getValue(strParam,'errinfo');
    CurStatus = songStatus;
    totalIndex = SongPos;
    
    InitALlListSonsgStatus(SongPos,songStatus,errinfo);
    
}

function jumpToOtherUser(url,flag){    
    
    if(typeof(flag)=="undefined"||flag==""||flag==null){
            flag='true';
    }
    var param = '';
    param={'souces':'myhomepage'};
    var channelInfo ='my';
    channelInfo = 'ch:3;name:myhomepage;';
    var call = "PageJump?param="+encodeURIComponent(param) + ";" + encodeURIComponent(channelInfo)+ ";" +encodeURIComponent('url:'+url)+'&calljump='+flag;
    callClientNoReturn(call);
}


function CDResultCallback(str){
    if( str == '' || str == null ){
        return;
    }
    
    var asynParam = getValue(str,'asyncparam');
    if( asynParam == '' || asynParam == null ){
        return;
    }
    
    asynParam = decodeURIComponent(asynParam);
    var comguid = getValue(asynParam,'guid');
    if( comguid != globalGuid ){
        return;
    }
    
    var func = getValue(asynParam,'funcname');
    if( func == '' || func == null ){
        return;
    }   
    
    if( func == 'GetCDIntro'){
        var aldetail = getValue(str,'result');
        aldetail = decodeURIComponent(aldetail);
        if( aldetail == '' || aldetail == null ){
            GetAlbumDetailInfoAndSet(id);
            return;
        } 
        
        //console.log( 'local :' + aldetail);
        SetAlbumIntroInfo(decodeURIComponent(aldetail),false); 
    }
}
    
    /*产生一个guid*/
function GenGuid() {

    var chars = CHARS;
    var uuid = new Array(GuidLen);
    var rnd = 0;
    var r;
    for (var i = 0; i < GuidLen; i++) {
        if (i == 8 || i == 13 || i == 18 || i == 23) {
            uuid[i] = '-';
        } else if (i == 14) {
            uuid[i] = '4';
        } else {
            if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
            r = rnd & 0xf;
            rnd = rnd >> 4;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
    }
    return uuid.join('');
}