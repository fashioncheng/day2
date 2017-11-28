var aPos=[];
var flag = true;
var f_id = '';//电台id
var radioid = -1;
var status = '';
var playingRadioLen = 0;
var now_f_id = 0;
var changeMore = 0;
var jumflag = 0;
var bJumped = false;
var enterrid = '';
var radiocacheTag = 'RADIO_NAV_TAG';
var cacheTime = 60 * 60 * 2;//cache存储2个小时
var blogin = 0;
var PRIV_FM_ID = '-26711';
// 轮播图
$(function () {
    callClientNoReturn('domComplete');    
    initWindow();
    SetNavTagindex();//设置跳转到本页面时点击的类型标签    
    var url = decodeURIComponent(window.location.href).replace(/###/g, '');
    console.log(url);
    var msg = getUrlMsg(url);
    var fid = url2data(msg, 'fid');
    jumflag = url2data(msg, 'top')
    GetPlayingInfo();

    f_id = fid;
    now_f_id = fid;
    
    //console.log('btimesec:' + bTimeSec + ' fid:' + fid);
    CheckToJump();//判断是否要进行相关时段电台的跳转    
    load_nav_data(fid);
    load_relation_radio_data(fid);//设置关联电台的数据
        
    setRadioInfo(); //设置radio下的喜欢和正在播放信息    
    DealScrollImg();//用户点击关联电台向左向右的动画    
    objbind();
    radioBind();
    setInterval(CheckPlayTimeSecRadio, 1000 * 60 * 5);  
    
});


function CheckToConfig(Obj){    
    
    if( typeof(Obj) == 'undefined' || Obj.length <= 0 ){
        return;
    }
    
    var call = 'CheckSpecRadio?rid=' + Obj.id + '&name=' + Obj.name + '&type=9';
    console.log('CheckToConfig:' + call);

    callClientNoReturn(call);
}

function GetPlayingInfo() {
    
    // 获取正在播放电台id、status    
    var call = "GetRadioNowPlaying";
    var str = callClient(call);
    if( str == '' || str == null){
        return;
    }
    radioid = parseInt(getValue(str, 'radioid'));
    status = getValue(str, 'playstatus');
    //jumflag = getValue(str, 'top');
    //console.log('call ' + str +  '  NowPlayingId :' + radioid + '  jumpflag ' + jumflag + ' jumflagtype:' + typeof (jumflag));
}

function SetNavTagindex() {
    var url = decodeURIComponent(window.location.href).replace(/###/g, '');
    var tagIndex = parseInt(getValue(url, "tagindex"));
    if (!isNaN(tagIndex)) {
        saveDataToCache("playingRadioPos", tagIndex);
    } else {
        saveDataToCache("playingRadioPos", 1);
    }
}

function CheckToJump() {

    if (!parseInt(jumflag)) {
        return;
    }   
    
    var bTimeSec = parseInt(IsCurTimeSecRadio(f_id));    
    if( !bTimeSec ){        
        return;
    }
    
    var info = GetSecRadioParam();
    var timesecid = info[1]; 
    
    console.log(' timesecid:' + timesecid + ' f_id:' + f_id  + ' jumflag:' + jumflag);
    if (timesecid != f_id) {
        
        CheckToConfig(info[2]);

        //        info[2].type = "9";
        //        var click = BuildClickString(info[2]);
        //        console.log(' jump start click ' + click);
        //
        //        eval(click);        
        //        bJumped = true;
    }
}

function DealScrollImg() {

    var oLeft = document.getElementById('left');
    var oRight = document.getElementById('right');
    var oUl = document.getElementById('rotatePic');
    var aLi = oUl.children;
    var aA = oUl.getElementsByTagName('a');
    var aImg = oUl.getElementsByTagName('img');
    var change;
    var obj = {};

    start();
    // 运动

    /*tab函数*/
    function tab(arrlen) {
        switch (arrlen) {
            case 2:
                for (var i = 0; i < aLi.length; i++) {
                    move($('.pic' + (i + 3))[0], {
                        left: aPos[i].left,
                        top: aPos[i].top
                    });
                    move($('.pic' + (i + 3) + ' img')[0], {
                        width: aPos[i].width,
                        opacity: aPos[i].opacity,
                        top: aPos[i].imgT
                    }, {
                        complete: function () {
                            setTimeout(function () {
                                flag = true;
                            }, 100);
                        }
                    });
                    aImg[i].onclick = aPos[i].fnClick;
                }
                break;
            case 3:
            case 4:
                for (var i = 0; i < aLi.length; i++) {
                    move($('.pic' + (i + 2))[0], {
                        left: aPos[i].left,
                        top: aPos[i].top
                    });
                    move($('.pic' + (i + 2) + ' img')[0], {
                        width: aPos[i].width,
                        opacity: aPos[i].opacity,
                        top: aPos[i].imgT
                    }, {
                        complete: function () {
                            setTimeout(function () {
                                flag = true;
                            }, 100);
                        }
                    });
                    aImg[i].onclick = aPos[i].fnClick;
                }
                break;
            case 5:
                for (var i = 0; i < aLi.length; i++) {
                    move($('.pic' + (i + 1))[0], {
                        left: aPos[i].left,
                        top: aPos[i].top
                    });
                    move($('.pic' + (i + 1) + ' img')[0], {
                        width: aPos[i].width,
                        opacity: aPos[i].opacity,
                        top: aPos[i].imgT
                    }, {
                        complete: function () {
                            setTimeout(function () {
                                flag = true;

                            }, 100);
                        }
                    });
                    aImg[i].onclick = aPos[i].fnClick;
                }
                break;
        }
    }
    /*tab函数*/

    // 向左
    function toLeft(arrlen) {
        if (flag) {
            flag = false;
            aPos.push(aPos.shift());
            obj = {
                mid: 88,
                midL: 0,
                midR: 181,
                rotatePic: $("#rotatePic li")
            };
            initzIndex(obj);
            tab(arrlen);
        }
    }
    // 向左

    // 向右
    function toRight(arrlen) {
        if (flag) {
            flag = false;
            aPos.unshift(aPos.pop());
            obj = {
                mid: 334,
                midL: 181,
                midR: 465,
                rotatePic: $("#rotatePic li")
            };
            initzIndex(obj);
            tab(arrlen);
        }
    }
    // 向右

    // 调z轴
    function initzIndex(obj) {
        $('.box').removeClass('boxActive');
        $('#rotatePic li').removeClass('active');
        if ($('#rotatePic li').length > 2) {
            for (var i = 0; i < obj.rotatePic.length; i++) {
                var left = parseInt(obj.rotatePic.eq(i).css("left"));
                if (left == obj.mid) {
                    obj.rotatePic.eq(i).css("zIndex", "3").addClass('active').find('.box').addClass('boxActive');
                } else if (left == obj.midL || left == obj.midR) {
                    obj.rotatePic.eq(i).css("zIndex", "2");
                } else {
                    obj.rotatePic.eq(i).css("zIndex", "1");
                }
            }
        } else {
            for (var i = 0; i < obj.rotatePic.length; i++) {
                var left = parseInt(obj.rotatePic.eq(i).css("left"));
                if (left == 334) {
                    obj.rotatePic.eq(i).css("zIndex", "3").addClass('active').find('.box').addClass('boxActive');
                } else {
                    obj.rotatePic.eq(i).css("zIndex", "2");
                }
            }
        }
    }
    // 调z轴

    // 自动轮播开启定时器
    function start() {};
    oRight.onclick = function () {
        toRight(playingRadioLen);
    };
    oLeft.onclick = function () {
        toLeft(playingRadioLen);
    };
    $('.j_left_direction').live('click', function () {
        toLeft(playingRadioLen);
    });
    $('.j_right_direction').live('click', function () {
        toRight(playingRadioLen);
    });
}
function OnLogin(){
   load_nav_data();
   
}
function OnLogout(){
   load_nav_data();
}

function OnJump(param){
}

function OnRefresh(str) {
    if( str == '' ){
        return;
    }

    var url = decodeURIComponent(window.location.href).replace(/###/g,'');
    var nEndPos = url.indexOf('?');
    if( nEndPos < 0 ){
        return;
    }
    var UrlSplice = url.substring(0,nEndPos+1);
    var startPos = str.lastIndexOf('?');
    var UrlDes = str.substring(startPos + 1,str.length);
    UrlSplice += encodeURIComponent(UrlDes);
    window.location.href = UrlSplice;
}



function GetSecRaidoIdAndTitle(data) {
    if( data == '' || typeof(data) == 'undefined'){
        return;
    }
    if (data.length <= 0) {
        return;
    }

    var jsonObj = eval('(' + data + ')');//返回的是从服务器下载的配置文件中获取的
    var strSectitle  = jsonObj.disname;//得到显示的名称

    //解析相应的参数
    var ParArr = [];
    var strPara = jsonObj.sourceid;
    ParArr = strPara.split(",");

    var SecRadioId = ParArr[0]; //第一个是id

    //创建json对象，用来创建时段电台的事件
    var Jsonstr = '{"id":' + '"' + ParArr[0] + '"' + ',"latesttime":' + '"' + ParArr[5] + '"' + ',"listeners":' + '"' + ParArr[8] + '"';
    Jsonstr += ',"name":' + '"' + ParArr[1] + '"' + ',"playtime":' + '"' + ParArr[7] + '"' + ',"radiopic":' + '"' + jsonObj.pic + '"';
    Jsonstr += ',"radiopicnp":' + '"' + ParArr[2] + '"' + ',"radiopicpl":' + '"' + ParArr[3] + '"' + ',"recomond":"0"';
    Jsonstr += ',"type":"4"' + ',"updatetime":' + '"' + ParArr[4] + '"' + '}';

    var ObjSec = eval("(" + Jsonstr + ")");  // 转换为json对象
    return [strSectitle,SecRadioId,ObjSec];
}

function GetSecRadioParam()
{
    var title;
    var data;
    var str = "CheckSecRadioRemark";
    var strret = callClient(str);
    if (strret.length > 0) {

        title = getValue(strret, "title");
        data = getValue(strret, "data");
    }

    var into = GetSecRaidoIdAndTitle(data);//解析出来
    return into;
}

function CheckPlayTimeSecRadio()
{
    console.log(" $$$$ interval $$$$ radioid: " + radioid);
    //radioid为正在播放的电台id
    if( radioid == '' ){        
        return;
    }
    var bTimeSec = parseInt(IsCurTimeSecRadio(radioid));    
    if( !bTimeSec ){        
        return;
    }

    var info = GetSecRadioParam();
    if( info.length <= 0 ){
        return;
    }
    var id = info[1];
    //console.log('getRid :' + info[1] + ' radioid ' + radioid + ' status ' + status + ' jumpflag ' + jumflag);
    if( id != radioid && status != 3 && jumflag == 1 ){
        
        CheckToConfig(info[2]);
//		info[2].type = "9";
//        var click = BuildClickString(info[2]);		
//        eval(click);
//        //jumflag = 0;
//        console.log('strclk:' + click);
    }
}

function ChgRelaRadios( strId) {
	//console.log(' $$$$$$$ChgRelaRadios: ' + strId);
    now_f_id = strId;
	load_relation_radio_data(strId);
}

function IsCurTimeSecRadio(strId)
{
    if( strId == '' ){
        return false;
    }

    var call = 'IsCurTimeSecRadio?rid=' + strId + '&bcur=0';
    var strRst = callClient(call);
    var bRet = getValue(strRst,'bTimeSec');
    return bRet;
}

function IsNowTimeSecRadio(strId)
{
    if( strId == '' ){
        return false;
    }

    var call = 'IsCurTimeSecRadio?rid=' + strId + '&bcur=1';
    var strRst = callClient(call);
    var bRet = getValue(strRst,'bTimeSec');
    return bRet;
}

function OnLeaveChanel() {
}
// 去除双击全选
$(document)[0].onselectstart = new Function("return false");

var slideBoxHeight = parseInt($("#slideBox").css("height"));
var slideControllHeight = parseInt($("#slideControll").css("height"));

$("#slideControll").live('click',function(){
	$("#slideControll .slideBtn p")[0].click();
	return false;
});

// 换台展开按钮
$("#slideControll .slideBtn p").on("click",function(){
	var text = $(this).html()=="换台"?"收起":"换台";
	$(this).html(text);
	$(this).removeClass();
	if(text=="收起"){
		$(this).addClass("up");
        LoadIndexImgs();
		
		show_change_radio_list();
	}else{        
        if (enterrid || enterrid == '0' ) {            
            var Obj = $('.radioList').find('.radio_' + enterrid).find('.br_pic');           
            Obj.removeClass('on');            
        }
    }
	$("#slideBox").stop().animate({"top":$("#slideBox").offset().top==0?(slideControllHeight-slideBoxHeight):0+"px"});
	// 重制切换按钮条件
	i = 0;
    $("#radioChose .left").hide();
	return false;
});
// 电台导航
$(".radioNav li").live('click',function(ev){
	if($(this).hasClass('clicked')){
		return;
	}
	$(".radioNav li").removeClass("clicked")
	$(this).addClass("clicked");
	var index = $(this).index();
	$('#radioChose ul').hide();
	$(".radioList").css('left',1);
	$('#radioChose ul').eq(index).show();
	changeBtnIsShow(index);  
    
	//换台各个页面中如果存在正在播放的电台 被播放电台的前置
//	playing_radio_gotop(index);
	// 重制切换按钮条件    
    saveDataToCache("playingRadioPos", index);
	i = 0;
	itemLen = $(".radioList").eq(index).children().length;
    $("#radioChose .left").hide();
    LoadIndexImgs(index);

	return false;
})

// 电台弹出层里面左右切换按钮
var itemWidth = $(".radioList li").width() || 140,
	radioBoxWidth = $("#radioChose").width(),
	changeLen = Math.floor(radioBoxWidth/itemWidth),
	itemLen = $(".radioList li").length;
	i=0;
$(window).resize(function(){
	i=0;
	$('#radioChose ul').css('left',0);
	radioBoxWidth = $("#radioChose").width();
	changeLen = Math.floor(radioBoxWidth/itemWidth);
	resizeChangeBtnIsShow();
	initWindow();
});

function initWindow(){
	var windowWidth = $(window).width(),
		windowHeight = $(window).height();
	$("body").css("height",windowHeight+"px");
}

function playing_radio_gotop(index,rid){    
    
    var call = "GetRadioNowPlaying";
    var str = callClient(call);
    if( str == '' || str == null){
        return;
    }
    
    //jumflag = getValue(str, 'top');
    var Nowradioid = parseInt(getValue(str, 'radioid'));
    
    if( rid != 'undefined' && rid != '' && rid != null){
        Nowradioid = rid;
    }   
    
	var aLi = $('#radioChose ul').eq(index).children();    
	aLi.each(function(i){
		var id = $(this).attr('class').split('_')[2];
		if(Nowradioid == id ){
            var dataindex = parseInt($(this).attr('data-index'));            
            if (!parseInt(jumflag) && dataindex > 0) {
                $('#radioChose ul').eq(index)[0].insertBefore($(this)[0], $('#radioChose ul').eq(index)[0].children[0]);
                return false;
            } else if (parseInt(jumflag)) {
                if (parseInt(blogin) && i == 0) {
                    $('#radioChose ul').eq(index)[0].insertBefore($(this)[0], $('#radioChose ul').eq(index)[0].children[3]);
                    return;
                } else {
                    if (!parseInt(blogin)) {
                        if (dataindex > 0 && i == 0) {
                            $('#radioChose ul').eq(index)[0].insertBefore($(this)[0], $('#radioChose ul').eq(index)[0].children[2]);
                            return;
                        }
                    }
                }
            }           
		}
	});  
}

function SetPriRadioPosFront(indextag){
    var tagpos = parseInt(indextag);
    if (tagpos < 0) {
        return;
    }
    
    //console.log(' indextag:' + indextag);

    if (tagpos == 1) {       
        var objpriv = $('#slideCon .radio_0');
        if (typeof (objpriv) != 'undefined') {
            $('#radioChose ul').eq(tagpos).prepend(objpriv);
        }
    }
}

function SetPrivFMFront(indextag){
    
    var tagpos = parseInt(indextag);
    if (tagpos < 0) {
        return;
    }   

    if (tagpos == 1) {       
        var objpriv = $('#slideCon .radio_' + PRIV_FM_ID);
        if (typeof (objpriv) != 'undefined') {
            $('#radioChose ul').eq(tagpos).prepend(objpriv);
        }
    }
}

function BuildTimeSecTopObj(){
    var info = GetSecRadioParam();    
    if( info == '' || info == null ){
        return '';
    }
    
    var SecId= info[1];    
    var SecInfo = '{' + '"' + 'id'+ '"' + ':' + '"' +  SecId + '"' + ',';
    SecInfo += '"' + 'latesttime' + '"' + ':' + '"' + info[2].latesttime + '"' + ',';
    SecInfo += '"' + 'listeners'  + '"' + ':' + '"' + info[2].listeners  + '"' + ',';
    SecInfo += '"' + 'name'       + '"' + ':' + '"' + info[0]       + '"' + ',';
    SecInfo += '"' + 'playfre'    + '"' + ':' + '"' + 0                  + '"' + ',';
    SecInfo += '"' + 'playtime'   + '"' + ':' + '"' + info[2].playtime   + '"' + ',';
    SecInfo += '"' + 'radioblur'  + '"' + ':' + '"' + 'http://star.kwcdn.kuwo.cn/star/radio/blur/' + SecId +'_140.jpg?' + SecId  + '"' + ',';
    SecInfo += '"' + 'radiopic'   + '"' + ':' + '"' + info[2].radiopic   + '"' + ',';
    SecInfo += '"' + 'radiopicnp' + '"' + ':' + '"' + info[2].radiopicnp + '"' + ',';
    SecInfo += '"' + 'radiopicpl' + '"' + ':' + '"' + info[2].radiopicpl + '"' + ',';
    SecInfo += '"' + 'recommond'  + '"' + ':' + '"' + 0                  + '"' + ',';
    SecInfo += '"' + 'type' + '"' + ':' + '"' +     + 9                  + '"' + ',';
    SecInfo += '"' + 'updatetime' + '"' + ':' + '"' + info[2].updatetime + '"' + '}';     
    return eval('(' + SecInfo + ')' );
}

function DealWithUserLists() {       
    
    var my_radio_data = callClient('GetUserRadioLists');
    my_radio_data = my_radio_data.replace(/musicradiolists/, 'child');
    my_radio_data = eval('(' + my_radio_data + ')');
    my_radio_data['disname'] = '我的';
    my_radio_data['name'] = '我的';   
            
    var SecInfo = BuildTimeSecTopObj();        
    if (SecInfo != '' && SecInfo != null) {
        my_radio_data['child'].splice(0, 0, SecInfo);
    }
   
    return my_radio_data;
}

//是否要通过接口去获取相应的电台数据
function GetDataCache(strTag){    
    var cachedata = getDataByCache(strTag);
    return cachedata;
}

function GetRadioJumpType(){
    
    var strPara = 0;
    var strcall = 'GetSecType';
    var strRt = callClient(strcall);
    if( strRt == '' || strRt == null){
        return strPara;
    }
    
    strPara = getValue(strRt,'type');
    return strPara;    
}

function DealWithInterfaceData(jsonRadio,relaId){
    
    var arr = jsonRadio.child;
    var dataArr = copyArr(arr);
    var my_radio_data = DealWithUserLists();    
    var userlist = my_radio_data.child;
    for( var index = 0;index < userlist.length;index++){
        var obj = userlist[index];
        if( obj.id == PRIV_FM_ID && index > 0 ){
            userlist.splice(0,0,obj);
            userlist.splice(index+1,1);
            break;
        }
    }
    dataArr.splice(1, 0, my_radio_data);
    for (var i = 0; i < dataArr.length; i++) {
        dataArr[i].indexnum = i;
    }
    var pos = getDataByCache('playingRadioPos');
    create_change_area(dataArr);
    show_change_radio_list();
    changeBtnIsShow(pos);
    //jumflag = GetRadioJumpType();        
    //SetPriRadioPosFront(1);    
    SetPrivFMFront(1);
    if (relaId && !parseInt(jumflag) ) {
        var DesObj = $(".radioList").eq(pos).find('.radio_' + relaId);
        if( DesObj.length > 1 ){
            var idnex = parseInt($(DesObj[0]).attr('data-index'));
            if( idnex > 0  ){
                DesObj = $(DesObj[0]);
            }else{
                DesObj = $(DesObj[1]);
            }
        }
        if (typeof (DesObj) != 'undefined') {
            $(".radioList").eq(pos).prepend(DesObj);
        }        
    }
    playing_radio_gotop(1,relaId);
}

// 加载换台数据
function load_nav_data(relationId) {
    
    blogin = UserIsLogin();
    var cacheData = GetDataCache(radiocacheTag);
    if (cacheData == '' || cacheData == null) {
        var userinfo = getUserID('all');
        var uid = userinfo.uid;
        var kid = userinfo.kid;
        var login = 0;
        if (uid) {
            login = 1;
        }
        var url = 'http://qukudata.kuwo.cn/q.k?op=query&cont=tree&node=87235&pn=0&rn=100&fmt=json&src=mbox&level=3&sourceset=tag_radio&extend=gxh&kid=' + kid + '&uid=' + uid + '&ver=' + getVersion() + '&login=' + login;
        $.ajax({
            url: url,
            dataType: 'jsonp',
            crossDomain: false,
            success: function (json) {
                saveDataToCache(radiocacheTag, JSON.stringify(json), cacheTime);
                DealWithInterfaceData(json,relationId);                
            },
            error: function (xhr) {}
        });
    }else{
        var Obj = eval('(' + cacheData + ')');        
        DealWithInterfaceData(Obj,relationId);        
    }
}

/*创建换台页数据*/
function create_change_area(data){    
	var navModel = loadTemplate('#radioNavModel');
	var radioBoxModel = loadTemplate('#kw_radioListBoxModel');

	var navHtml = drawListTemplate(data,navModel,proNavData);
	$('.radioNav').html(navHtml);

	var radiodata = [];
	for(var i=0; i<data.length; i++){
		radiodata.push(data[i].child);
	}
	var radioHtml = drawListTemplate(radiodata,radioBoxModel,proRadioBoxData);
	radioHtml = '<div class="changebtn left"></div><div class="changebtn right"></div>'+radioHtml;
	$('#radioChose').html(radioHtml);
	//loadImages();
}

function proNavData(obj){
	var json ={};

	var name = checkSpecialChar(obj.disName,"disname") || checkSpecialChar(obj.name,"disname");
	json = {
		'name':name
	};
	return json;
}

function proRadioBoxData(obj){
	// 处理数组添加索引
	for(var i=0; i<obj.length; i++){
		obj[i].indexnum = i;
	}

	var json = {};
	var radioModel = loadTemplate('#kw_radioListModel');
	var radioList = drawListTemplate(obj,radioModel,proRadioData);
	json = {
		'radioList':radioList
	};
	return json;
}

function BuildClickString(obj)
{
    var json = {};
    var pic = obj.pic2 || obj.pic5 || obj.pic || obj.radiopic;
    var indexnum = obj.indexnum;
    var pid = '';
    var click = '';
    var name = checkSpecialChar(obj.name,"name");
    var disname = checkSpecialChar(obj.disname,"disname") || checkSpecialChar(name,"disname");
    if(obj.sourceid){
        var radioClass = 'radio_'+obj.sourceid.split(',')[0];
        pid = obj.sourceid.split(',')[0];
        // click 处理

        var sourceid = obj.sourceid;
        obj.extend = obj.extend+ "|RADIO_PIC=" + pic + "|DIS_NAME=" + disname + "|" ;
        var jsonparameter = new Node('9',sourceid,name,obj.id,obj.extend);
        jsonparameter['notjump'] = 1;
        var onclickcsrc = "radioLog('POSITION:1,1|GPOSITION:1,1| FROMPAGE:电台播放| RADIOID:" + obj.sourceid.split(',')[0] + '|CSRCTAG:' +obj.name + "');";
        click = onclickcsrc + commonClickString(jsonparameter);
        click += ';reSetPageInfo('+pid+');';
        // 图片高斯处理
        pic = pic.replace(/star.+/gi,'star/radio/blur/'+pid+'.jpg');
    }else{
        if( obj.id == '' ){
            obj.id = 0;
            obj.name ='私人电台';
            obj.radiopicnp = 'img/siren.jpg';
            obj.radiopicpl = 'img/siren.jpg';
            disname ='私人电台';
            pic = 'img/siren.jpg';
            name ='私人电台';
        }
        var radioClass = 'radio_'+obj.id;
        pid = obj.id;
        // click 处理
        obj.extend = "|RADIO_PIC=" + pic + "|DIS_NAME=" + disname + "|" ;
        var sourceid = obj.id + ',' + obj.name + ',' + obj.radiopicnp + ',' + obj.radiopicpl + ',' + obj.upatetime + ',' + obj.latesttime + ',' + obj.type + ',' + obj.playtime + ',' + obj.listeners + ',' + obj.type + ',' + '1';
        var jsonparameter = new Node('9',sourceid,name,obj.id,obj.extend);
        jsonparameter['notjump'] = 1;
        click = commonClickString(jsonparameter);
        click += ';reSetPageInfo('+pid+',\'big\');';
    }
    return click;
}


function proRadioData(obj){
	var json = {};
	var pic = obj.pic2 || obj.pic5 || obj.pic || obj.radiopic;
	var indexnum = obj.indexnum;
	var pid = '';
	var click = '';
	var name = checkSpecialChar(obj.name,"name");
	var disname = '';
    var radioClass = '';    
    
	if(obj.sourceid){
        
        //从接口获取到的电台频道的信息是有sourceid的,从本地过来的没有相应的sourceid信息
        //且有相让的disname,从本地的相应的disname信息，取到的就是相应的disname信息
        pid = obj.sourceid.split(',')[0];
		radioClass = 'radio_'+pid;
        disname = checkSpecialChar(obj.disname,"disname") || checkSpecialChar(name,"disname");
		
		// click 处理        
		var sourceid = obj.sourceid;
		obj.extend = obj.extend+ "|RADIO_PIC=" + pic + "|DIS_NAME=" + disname + "|" ;
		var jsonparameter = new Node('9',sourceid,name,obj.id,obj.extend);
		jsonparameter['notjump'] = 1;
        var onclickcsrc = "radioLog('POSITION:1,1|GPOSITION:1,1| FROMPAGE:电台播放| RADIOID:" + pid + '|CSRCTAG:' +disname + "');";
		click = onclickcsrc +  commonClickString(jsonparameter);
		click += ';reSetPageInfo('+pid+');';
		// 图片高斯处理		
		var oDate = new Date();
	    var today = ''+oDate.getFullYear()+toDou(oDate.getMonth()+1)+toDou(oDate.getDate());
	    pic = 'http://star.kwcdn.kuwo.cn/star/radio/blur/'+pid+'_140.jpg?' + GenRadioRandomsufix(6);	    
	}else{
        if( obj.id == '' || obj.id == '0' || obj.id == '0'){            
            obj.id = '0';
            obj.name ='私人电台';
            obj.radiopicnp = 'img/siren.jpg';
            obj.radiopicpl = 'img/siren.jpg';
            disname ='私人电台';
            pic = 'img/siren.jpg';
            name ='私人电台';
        }else if( obj.type != '9' ) {
            pic = 'http://star.kwcdn.kuwo.cn/star/radio/blur/'+obj.id+'_140.jpg?' + GenRadioRandomsufix(6);
            disname = name;
        }else if( obj.type == '9' ){
            pic = 'img/shiduan.png';
            disname = '时段电台';
            //console.dir(obj);
        }
        pid = obj.id;
		radioClass = 'radio_'+pid;
        
		// click 处理
		obj.extend = "|RADIO_PIC=" + pic + "|DIS_NAME=" + name + "|" ;
		var sourceid = pid + ',' + obj.name + ',' + obj.radiopicnp + ',' + obj.radiopicpl + ',' + obj.upatetime + ',' + obj.latesttime + ',' + obj.type + ',' + obj.playtime + ',' + obj.listeners + ',' + obj.type + ',' + '1';
		var jsonparameter = new Node('9',sourceid,name,pid,obj.extend);
		jsonparameter['notjump'] = 1;
        var onclickcsrc = "radioLog('POSITION:1,1|GPOSITION:1,1| FROMPAGE:电台播放| RADIOID:" + pid + '|CSRCTAG:' +name + "');";
		click =  onclickcsrc + commonClickString(jsonparameter);
		click += ';reSetPageInfo('+pid+');';        
	}
    
	json = {
		'name':disname,
		'pic':pic,
		'indexNum':indexnum,
		'radioClass':radioClass,
		'pid':pid,
		'click':click
	};
	return json;
}
// 换台数据结束

//给和特定的电台对象设置相应的状态
function InitDesObjStatus(id,status){  
    
    if( id == '' || id == null){
        return;
    }
    
    if( status == '3' ){
        return;
    }
    
    var obj = $($('#radioChose ul').eq(1)[0]).find('.radio_' + id);
    if( obj.length <= 1 ){
        return;
    }
    

    
    var bflag = parseInt(jumflag);   
    var dataIndexFst = parseInt($(obj[0]).attr('data-index'));
    var dataIndexSec = parseInt($(obj[1]).attr('data-index'));    
   
    //console.log('jumpflag:' + jumflag);
    var DesObj = '';
    if( !bflag ){        
        DesObj = dataIndexFst > dataIndexSec?$(obj[1]).find('.br_pic'):$(obj[0]).find('.br_pic');
    }else if( bflag ){
        DesObj = dataIndexFst > dataIndexSec?$(obj[0]).find('.br_pic'):$(obj[1]).find('.br_pic');
    }    
    
    //把相应的状态给设置成停止状态
    DesObj.attr("c-status", "0");
    DesObj.removeClass("current_pic");
    DesObj.find(".radio_play").remove();
    DesObj.find(".radio_stop").remove();
    DesObj.find(".radio_start").remove();
    DesObj.find(".radio_pause").remove();
    DesObj.find(".i_play").hide();
    DesObj.removeAttr('onclick');
    DesObj.unbind("click").bind("click", function () {
        eval($(this).attr("_onclick"));
        return false;
    });    
}

function SetRadioNowPlayingStatus(strid) {
    
    var call = "GetRadioNowPlaying";
    var str = callClient(call);
    var rid = parseInt(getValue(str, 'radioid'));
    status = getValue(str, 'playstatus');
    //console.log('SetRadioNowPlayingStatus:' + strid + '  rid:' +rid +  ' status:' + status + ' jumflag:' + jumflag);
    
    var btag = parseInt(jumflag);    
    var desRid = rid;
    if( rid != strid && btag && parseInt(IsCurTimeSecRadio(rid))){
        desRid = strid;
    }
    
    //console.log('desid:' + desRid);
    if (desRid || parseInt(desRid) == 0) {
        initRadioStatus(parseInt(status, 10), desRid);
        InitDesObjStatus(desRid, status);
        $('.radio_play').attr('src', 'img/playing_page_gif.gif');
    } else {
        initRadioStatus(3);
    }
}

function SecTimeRadioJump(str){
    if( str == '' || str == null ){
        return;
    }
    
    var strid = str;
    now_f_id = strid;
    load_nav_data(strid);
    load_relation_radio_data(strid);
    playing_radio_gotop(1,strid);
    
}
// 关联电台开始
function load_relation_radio_data(fid,strfunc){   
    
    //jumflag = GetRadioJumpType();
    //console.log('relation  fid:' + fid + ' radioid:' + radioid + ' jumflag:' + jumflag);
	var url = 'http://gxh2.kuwo.cn/newradio.nr?type=30&num=5&uid='+getUserID('uid')+'&login=1&ver='+getVersion()+'&fid='+fid+'&_='+Math.random();
	$.ajax({
        url:url,
        dataType:'text',
        crossDomain:false,
		success:function(str){
			var arr = eval('('+str+')');			
			if(arr.length>5){
				arr.length = 5;
			}
			if(fid == 0){
				arr[0] = {'disname':'私人电台','extend':'','id':'200','info':'1人在听','name':'私人电台','pc_extend':'','pic':'','pic5':'img/siren.jpg','source':'9','sourceid':'0,私人电台,,,,,1,,200,1,1','tips':''};
			}
			changeRadioDataPos(arr,arr.length,fid);
			create_radio_area(arr,arr.length);
			SetRadioNowPlayingStatus(fid);
			var oUl=document.getElementById('rotatePic');
			var aLi=oUl.children;
			var aImg=oUl.getElementsByTagName('img');
            SetRelaRadioListenNum(arr);
             if( typeof(strfunc) == 'function'){
                strfunc(fid);
            }
			if(aLi.length<2){
				return;	
			}
			savePalyingRadioPos(aLi.length);
		},
        error:function(xhr){
            loadErrorPage();
        }
    });
}


function SetRelaRadioListenNum(jsonArr){
    if( jsonArr.length <= 0 ){
        return;
    }  
    
    var infoId = '';
    for (var nIndex = 0; nIndex < jsonArr.length; nIndex++) {
        infoId += jsonArr[nIndex].sourceid.split(',')[0];
        if ((nIndex + 1) != jsonArr.length){
            infoId += ',';            
        }
    } 
    
    var strver = getVersion();
    //此接口不关心uid和login状态
    var strUrl = 'http://gxh2.kuwo.cn/newradio.nr?type=3&uid=0&login=1&ver=' +strver+ '&fid=' + infoId;       
    $.ajax({
        url:strUrl,
        dataType:'text',
        crossDomain:false,
		success:function(str){			
			var arrInfo =[];
            arrInfo = str.split('\n');
            for( var nIndex = 0;nIndex<arrInfo.length;nIndex++){
                var idNum = [];
                idNum = arrInfo[nIndex].split('\t');
                if( idNum.length < 2 ){
                    continue;
                }
                var ObjEle = $('#rotatePic .radio_' + idNum[0]).find('.lis_cnt');
                if( typeof(ObjEle) == 'undefined'){
                    continue;
                }                
                var num = FormatRadioListenersNum(idNum[1]);
                var ele = ObjEle.get(0);
                if (typeof(ele) != 'undefined' ) {
                    ele.innerHTML = num;
                }
            }
		},
        error:function(xhr){
        }
    });   
}

function create_radio_area(data,childlen){    
    
	var mainModel = loadTemplate('#kw_playRadioListModel');

	var pos_param = '';
	switch(childlen){
		case 1:
			var html = drawListTemplate(data,mainModel,proPlayRadioData);
			//var pos_param = '181px';
			break;
		case 2:
			var html = drawListTemplate(data,mainModel,proPlayRadioData);
			break;
		case 3:
			var html = drawListTemplate(data,mainModel,proPlayRadioData);
			break;
		case 4:
			var html = drawListTemplate(data,mainModel,proPlayRadioData);
			break;
		case 5:
			var html = drawListTemplate(data,mainModel,proPlayRadioData);
			break;
	}

	$('#rotatePic').html(html);
	if($('#rotatePic li').length>1){
		$('#left,#right').show();
	}else{
		$('#left,#right').hide();
	}
    //如果是私人电台不显示相应的收听人数
    var priv = $("#rotatePic .radio_0");
    if( priv != 'undefined' && priv.length > 0 ){
        var privListCnt = priv.find(".lis_cnt");
        if( privListCnt != 'undefined' ){
            privListCnt.hide();
        }
    }

//	var scrollT = document.documentElement.scrollTop || document.body.scrollTop;
//	var clientH = document.documentElement.clientHeight;
//	var scrollB = scrollT + clientH;
	var imgs = $('#rotatePic .playinglazy');
	imgs.each(function (i) {
	    var src = $(this)[0].getAttribute('src');
	    var dataori = $(this)[0].getAttribute('data-original');
	    if (src != dataori) {
	        //console.log(' src:' + $(this)[0].getAttribute('src'));
	        //console.log('dataoriginal:' + $(this)[0].getAttribute('data-original'));
	        $(this)[0].setAttribute('src', $(this)[0].getAttribute('data-original'));
	    }
	});
	//loadImages();
}

function LoadIndexImgs(nlst){
    var pos = parseInt(nlst);    
    if( isNaN(pos) ){
       pos = getDataByCache('playingRadioPos');        
    }  
    
    var datalist = $('#radioChose ul').eq(pos).children();    
    for( var index = 0;index < datalist.size();index++){
        var objsrc = $(datalist[index]).find('.lazy').attr('src');
        var objDataOri = $(datalist[index]).find('.lazy').attr('data-original');       
        if( objsrc != objDataOri ){
            $(datalist[index]).find('.lazy').attr('src',objDataOri);
        }        
    }    
}

function proPlayRadioData(obj){
	var json = {};
	var disname = checkSpecialChar(obj.disname,"disname") || checkSpecialChar(name,"disname");
	var liClass = obj.liClass;
    var pid = obj.sourceid.split(',')[0];
	var radioClass = 'radio_'+pid;
	var pic = obj.pic2 || obj.pic5 || obj.pic || obj.radiopic;
    var listen = obj.listen || 0;
	//判断是否是歌手电台 如果是 图片切换
	var url = decodeURIComponent(window.location.href).replace(/###/g,'');
	var msg = getUrlMsg(url);
    
	var isArtistRadio = url2data(msg,'bArtType');
	if(isArtistRadio){
		pic = getPlayingArtistRadioPic(pic);
	}else{
		pic = changeImgDomain(pic);
	}
    
    
    //console.log('pid:' + pid + ' now_f_id:' + now_f_id + ' jumflag:' + jumflag);

    var bTimeSec = parseInt(IsCurTimeSecRadio(now_f_id));
	var sourceid = obj.sourceid;
	if (now_f_id == pid && parseInt(jumflag)) {
	    
	    if (bTimeSec) {
	        var sourceArr = sourceid.split(',');
	        if (sourceArr.length > 10) {
	            sourceArr[6] = '9';
	            sourceArr[9] = '9';
	            sourceid = sourceArr.join(',');
	        }
	    }
	}    
    
	obj.extend = obj.extend+ "|RADIO_PIC=" + pic + "|DIS_NAME=" + disname + "|" ;
	var jsonparameter = new Node('9',sourceid,name,pid,obj.extend);
	jsonparameter['notjump'] = 1;	
    var onclickcsrc = "radioLog('POSITION:1,1|GPOSITION:1,1| FROMPAGE:电台播放| RADIOID:" + obj.sourceid.split(',')[0] + '|CSRCTAG:' +obj.name + "');";
	var click = onclickcsrc + commonClickString(jsonparameter);
	click += ';reSetPageInfo('+pid+',\'big\');';
	
	var oDate = new Date();
    var today = ''+oDate.getFullYear()+toDou(oDate.getMonth()+1)+toDou(oDate.getDate());
    pic = 'http://star.kwcdn.kuwo.cn/star/radio/blur/'+pid+'.jpg?' + GenRadioRandomsufix(6);    
	var radioNowid = sourceid.split(',')[0];
	if(radioNowid==0){
		pic = 'img/siren.jpg';
	}
    
    if (pid == now_f_id && parseInt(jumflag) && bTimeSec ) {
        pic = 'img/shiduan.png';
        disname = '时段';
    }
    
	json = {
		'name':disname.replace('电台',''),
		'liClass':liClass,
        'listen':listen,
		'radioClass':radioClass,
		'pic':pic,
		'click':click
	};
	return json;
}

// 处理关联电台数据数组位置调换的函数
function changeRadioDataPos(arr,type,fid){
	$('.j_left_direction,.j_right_direction').show();
	switch(type){
		case 1:
			arr[0].liClass = 'pic3 active boxActive';
			$('.j_left_direction,.j_right_direction').hide();
			break;
		case 2:
			for(var i=0; i<arr.length; i++){
				var dtid = arr[i].sourceid.split(",")[0];
				if(fid == dtid && i>0){
					var tmpArr = copyArr(arr);
					arr[0] = tmpArr[i];
					arr[i] = tmpArr[0];
				}
			}
			arr[0].liClass = 'pic3 active boxActive';
			arr[1].liClass = 'pic4';
			break;
		case 3:
			for(var i=0; i<arr.length; i++){
				var dtid = arr[i].sourceid.split(",")[0];
				if(fid == dtid && i>0){
					var tmpArr = copyArr(arr);
					arr[0] = tmpArr[i];
					arr[i] = tmpArr[0];
				}
			}
			arr[0].liClass = 'pic3 active boxActive';
			for(var i=1; i<arr.length; i++){
				if(i<2){
					arr[i].liClass = 'pic'+(i+1);
				}else{
					arr[i].liClass = 'pic'+(i+2);
				}
			}
			break;
		case 4:
			for(var i=0; i<arr.length; i++){
				var dtid = arr[i].sourceid.split(",")[0];
				if(fid == dtid && i>0){
					var tmpArr = copyArr(arr);
					arr[0] = tmpArr[i];
					arr[i] = tmpArr[0];
				}
			}
			arr[0].liClass = 'pic3 active boxActive';
			for(var i=1; i<arr.length; i++){
				if(i<2){
					arr[i].liClass = 'pic'+(i+1);
				}else{
					arr[i].liClass = 'pic'+(i+2);
				}
			}
			$('.directionBtn_left1').hide();
			break;
		case 5:
			for(var i=0; i<arr.length; i++){
				var dtid = arr[i].sourceid.split(",")[0];
				if(fid == dtid && i>0){
					var tmpArr = copyArr(arr);
					arr[0] = tmpArr[i];
					arr[i] = tmpArr[0];
				}
			}
			arr[0].liClass = 'pic3 active boxActive';
			for(var i=1; i<arr.length; i++){
				if(i<3){
					arr[i].liClass = 'pic'+i;
				}else{
					arr[i].liClass = 'pic'+(i+1);
				}
			}
			break;
	}
	return arr;
}

function savePalyingRadioPos(arrlen){
	aPos = [];
	switch(arrlen){
		case 2:
			for(var i=0; i<arrlen; i++){
				aPos[i]={
					left:$('.pic'+(i+3))[0].offsetLeft,
					top:$('.pic'+(i+3))[0].offsetTop,
					width:$('.pic'+(i+3)+' img')[0].offsetWidth,
					opacity:parseFloat(getStyle($('.pic'+(i+3)+' img')[0],'opacity')),
					imgT:$('.pic'+(i+3)+' img')[0].offsetTop,
					fnClick:$('.pic'+(i+3)+' img')[0].onclick
				};
			}
			playingRadioLen = 2;
			break;
		case 3:
			for(var i=0; i<arrlen; i++){
				aPos[i]={
					left:$('.pic'+(i+2))[0].offsetLeft,
					top:$('.pic'+(i+2))[0].offsetTop,
					width:$('.pic'+(i+2)+' img')[0].offsetWidth,
					opacity:parseFloat(getStyle($('.pic'+(i+2)+' img')[0],'opacity')),
					imgT:$('.pic'+(i+2)+' img')[0].offsetTop,
					fnClick:$('.pic'+(i+2)+' img')[0].onclick
				};
			}
			playingRadioLen = 3;
			break;
		case 4:
			for(var i=0; i<arrlen; i++){
				aPos[i]={
					left:$('.pic'+(i+2))[0].offsetLeft,
					top:$('.pic'+(i+2))[0].offsetTop,
					width:$('.pic'+(i+2)+' img')[0].offsetWidth,
					opacity:parseFloat(getStyle($('.pic'+(i+2)+' img')[0],'opacity')),
					imgT:$('.pic'+(i+2)+' img')[0].offsetTop,
					fnClick:$('.pic'+(i+2)+' img')[0].onclick
				};
			}
			playingRadioLen = 4;
			break;
		case 5:
			for(var i=0; i<arrlen; i++){
				aPos[i]={
					left:$('.pic'+(i+1))[0].offsetLeft,
					top:$('.pic'+(i+1))[0].offsetTop,
					width:$('.pic'+(i+1)+' img')[0].offsetWidth,
					opacity:parseFloat(getStyle($('.pic'+(i+1)+' img')[0],'opacity')),
					imgT:$('.pic'+(i+1)+' img')[0].offsetTop,
					fnClick:$('.pic'+(i+1)+' img')[0].onclick
				};
			}
			playingRadioLen = 5;
			break;
	}
}

// 关联电台结束

// 辅助函数
function copyArr(arr){
	var arr2 = [];
	if(arr.length == 0){
		return arr2;
	}
	
	for(var i=0; i<arr.length; i++){
		var tmp = arr[i];
		arr2.push(tmp);
	}
	return arr2;
}

/*设置当前定位到的第几个索tag*/
function show_change_radio_list(){
	var nowRadioIndex = getDataByCache('playingRadioPos');
    //alert(nowRadioIndex);
    if( isNaN(parseInt(nowRadioIndex))){
        nowRadioIndex = 1;
    }
	$('.radioNav li').removeClass('clicked');
	$('.radioNav li').eq(nowRadioIndex).addClass('clicked');
	$('#radioChose ul').hide();
	$('#radioChose ul').css('left',0);
	$('#radioChose ul').eq(nowRadioIndex).show();
	itemLen = $(".radioList").eq(nowRadioIndex).children().length;
    if(itemLen<=changeLen){
    	$("#radioChose .right").hide();
    }else{
    	$("#radioChose .right").show();
    }
}

/*设置左右两边的方向箭头的显示与隐藏*/
function changeBtnIsShow(index){
	var len = $('#radioChose ul').eq(index).children().length;
	var ul_w = len*140;
	if(ul_w>radioBoxWidth){
		$('.changebtn').show();
		if(i==0)$("#radioChose .left").hide();
	}else{
		$('.changebtn').hide();
	}
}

function resizeChangeBtnIsShow(){
	$('.radioNav li').each(function(i){
		if($(this).hasClass('clicked')){
			changeBtnIsShow(i);
		}
	});
}

function objbind(){
	// 换台区域的左右点击按钮
	$("#radioChose .left").live('click',function(){
		i--;
		if(i<=0){
			i=0;
            $("#radioChose .left").hide();
            $("#radioChose .right").show();
		}
        else
        {
            $("#radioChose .right").show();
        }
		$(".radioList").stop(false,true).animate({"left":(-changeLen*itemWidth*i)});
		return false;
	});
	$("#radioChose .right").live('click',function(){
		i++;
		if(i>=itemLen/changeLen-1){
			i=itemLen/changeLen-1;
            $("#radioChose .left").show();
            $("#radioChose .right").hide()
		}
        else
        {
            $("#radioChose .left").show();
        }
		$(".radioList").stop(false,true).animate({"left":(-changeLen*itemWidth*i)});
		return false;
	});

	// 关联电台下的控制区域的按钮
	$('#controlBox .control_like').live('click',function(){
		callClientNoReturn('SetSonglikeState');
	});

	$('#controlBox .control_delete').live('click',function(){
		callClientNoReturn('RadioClickDustbin?icontype=del');
	});

	$('#controlBox .control_next').live('click',function(){
		callClientNoReturn('RadioClickDustbin?icontype=pass');
	});

	$('#controlBox .control_add').live('click',function(){
		callClientNoReturn('RadioMore');
	});

	$('body').live('click',function(){
		if($("#slideControll .slideBtn p").html() == '收起'){
			$("#slideControll .slideBtn p")[0].click();
		}
	});
}

// 获取当前电台播放状态
function radioNowPlaying(str) {
    if (str != ''){
        
        var id = getValue(str,'radioid');
        jumflag = getValue(str, 'top');
        var stat = getValue(str,'playstatus');
        var num = parseInt(stat,10);
        status = stat;
        radioid = id; 
        
        //console.log('radioNowPlaying id:' + id + ' status:' + status);
           
        if(num == 1 || num == 4){
        	setRadioInfo();
        }
        initRadioStatus(num, parseInt(id));
        InitDesObjStatus(radioid,status);
        $('.radio_play').attr('src','img/playing_page_gif.gif');
    } else {
        initRadioStatus(3);
        status = 3;
        //jumflag = false;
    }
}

// 设置歌手电台等相关信息
function setRadioInfo(){
	var playingSongInfo = callClient('GetRadioPlayingSongInfo');
	var musicInfo = getValue(playingSongInfo,'songinfo');
	$('#playingInfoBox .info').html(musicInfo);
	var b_like = parseInt(getValue(playingSongInfo,'blike'));
	if(b_like){
		$('#controlBox .control_like').addClass('control_likeActive');
        $('#controlBox .control_like').attr("title",'已喜欢');
	}else{
		$('#controlBox .control_like').removeClass('control_likeActive');
        $('#controlBox .control_like').attr("title",'喜欢');
	}
	//判断是否是歌手电台 如果是 下面不执行
    var isArtistRadio = false;
	if(now_f_id){
		var RadioInfo = 'IsArtRadio?fid='+now_f_id;
		RadioInfo = callClient(RadioInfo);
		isArtistRadio = parseInt(getValue(RadioInfo,'bType'));
	}else{
		var url = decodeURIComponent(window.location.href).replace(/###/g,'');
		var msg = getUrlMsg(url);
		isArtistRadio = url2data(msg,'bArtType');
	}
	if(isArtistRadio){
        $("#artistRadioBox").hide();
		return;
	}
    else{
        $("#artistRadioBox").show();
    }

	var artistId = getValue(playingSongInfo,'artid');

	if($('#artistRadioBox').find('.artistRadio_like').attr('c-id') == artistId){//避免重复设置
		return;
	}
	var url = 'http://search.kuwo.cn/r.s?stype=artistinfo&artistid='+artistId;
	$.ajax({
        url:getChargeURL(url),
        dataType:'jsonp',
        crossDomain:false,
		success:function(json){
			var dataArr = [];
			dataArr[0] = json;
			create_artist_radio_area(dataArr);
			$('#artistRadioBox img').attr('src',$('#artistRadioBox img').attr('data-original'));
			showLike('get','ARTIST');
		},
        error:function(xhr){
        }
    });
}

function musicNowPlaying(str){

}

function create_artist_radio_area(data){
    
    var playingSongInfo = callClient('GetRadioPlayingSongInfo');
    var artistId = getValue(playingSongInfo,'artid');
    var call = 'ShowMusicRadio?rcid=' + artistId + '&rctype=artist';
    var isshow = callClient(call);
    if (isshow == null || isshow + '' == '0') {
        $('#artistRadioBox').html("");
        $('#artistRadioBox').hide();
        return;
    }
	var model = loadTemplate('#kw_artistRadioModel');
	var html = drawListTemplate(data,model,proAritstRadioData);
	$('#artistRadioBox').html(html);
    
    $(".artist_radio").unbind("click").bind("click", function () {        
        var artistId = $(this).attr("c-id");
        var artistName = $(this).attr("c-name");
        playRadio(artistId, 'artist', artistName + '电台');
        try {
            radioLog('POSITION:1,1|GPOSITION:1,1|FROMPAGE:电台播放|RADIOID:' + artistId + '|CSRCTAG:' + artistName + '电台');
        } catch (e) {}
        return false;
    });    
}

function proAritstRadioData(obj){
	var json = {};

	var id = obj.id || 0;
	var name = checkSpecialChar(obj.name,'name');
	var pic = obj.pic;
	if(pic){
		pic = getArtistPic(pic);
	}else{
		pic = 'img/def60.jpg';
	}
	var artistclick = commonClickString(new Node('4',id,name,id,obj.extend));
	var artisttitle = checkSpecialChar(obj.name,'titlename');

	json = {
		'a_id':id,
		'name':name,
		'pic':pic,
		'artistclick':artistclick,
		'artisttitle':artisttitle
	};

	return json;
}

// 下方区域 歌手电台的收藏相关逻辑
function showLike(act,type) {
    var likeAct = act;
    var sid = getUserID("sid");
    var uid = getUserID("uid");
    var sourceid = $(".artistRadio_like").attr("c-id");
    var url = "http://nplserver.kuwo.cn/pl.svc?op=like&uid="+uid+"&sid="+sid+"&act="+act+"&sourceid="+sourceid+"&type="+type;
    $.ajax({
        url:url,
        dataType:"text",
        type:"get",
        crossDomain:false,
        success:function(jsondata){
            var data = eval('('+jsondata+')');
            likeOperation(data,act);    
        },
        error:function(){
        }
    });
}

function likeOperation(jsondata,likeAct){
    var likeArray = ['收藏','已收藏'];
    var data = jsondata;
    if(typeof(data)=="undefined"||data==null||typeof(data.result)=="undefined") return;
    if(data.result!="ok"){
        // webLog("likeOperation:喜欢系统返回错误");
        $(".artistRadio_like").removeClass("artistRadio_likeActive");
        $(".artistRadio_like").find('.content_name').attr('title','收藏该艺人');
        //$(".artistRadio_like").show();
        $(".artistRadio_like").find('.content_name').html(likeArray[0]).show();
        return;
    }
    var opret = data.opret;
    if (opret == "notcollected") {
        $(".artistRadio_like").removeClass("artistRadio_likeActive");
        $(".artistRadio_like").find('.content_name').attr('title','收藏该艺人');
        $(".artistRadio_like").find('.content_name').html(likeArray[0]).show();
    }
    if (opret == "collected") {
        $(".artistRadio_like").addClass("artistRadio_likeActive");
        $(".artistRadio_like").find('.content_name').attr('title','已收藏');
        $(".artistRadio_like").find('.content_name').html(likeArray[1]).show();
    }
    if(opret=="ok"){
        var likehtml = "";
        if(likeAct=="add"){
            $(".artistRadio_like").find('.content_name').html(likeArray[1]).show();
            $(".artistRadio_like").addClass("artistRadio_likeActive");
            $(".artistRadio_like").find('.content_name').attr('title','已收藏');
        }else if(likeAct=="delete"){
            $(".artistRadio_like").find('.content_name').html(likeArray[0]).show();
            $(".artistRadio_like").removeClass("artistRadio_likeActive");
            $(".artistRadio_like").find('.content_name').attr('title','收藏该艺人');
        }
    }   
}
//点击内容页的喜欢按钮
$(".artistRadio_like").live("click", function(){
    var likeArray = ['收藏','已收藏'];
    var uid = getUserID("uid");
    if (uid ==0 ){
        setTimeout(function(){
            callClientNoReturn("UserLogin?src=login");
        },25);  
    } else {
        var likehtml = $(this).find('.content_name').html();
        var target = $(this).attr("c-target");
        var act  = "";
        if (likehtml == likeArray[0]) {
            act = "add";
        } else if (likehtml==likeArray[1]){
            act = "delete";
        }
        showLike(act,target);
    }
    return false;
});

// 客户端完成喜欢操作之后的回调
function SetSongFav(infoStr){
	var playingSongInfo = callClient('GetRadioPlayingSongInfo');
	var b_like = parseInt(getValue(playingSongInfo,'blike'));
	if(b_like){
		$('#controlBox .control_like').addClass('control_likeActive');
        $('#controlBox .control_like').attr("title",'已喜欢');
	}else{
		$('#controlBox .control_like').removeClass('control_likeActive');
        $('#controlBox .control_like').attr("title",'喜欢');
	}
}

function radioBind(){
	$(".br_pic").live("mouseenter",function(){
		if ($(this).hasClass("on")) return;
		$(this).addClass("on");
        enterrid = $(this).parent().attr('data-pid');
		var status = $(this).attr("c-status");		
		var someClass = $(this).parent().attr('class');
		var s = someClass.indexOf("radio_");
		//console.log(someClass);
		var id = someClass.substring(s + 6);
		id = parseInt(id) + '';
		var stopicon = '';
		var click = '';
		if (status == 1 || status == 4 ) {
			if ($(this).find(".radio_pause").size() == 0) {
			    stopicon = '<i title="暂停播放" onclick="" class="radio_pause"></i>';
			}
			click = 'stopRadio(arguments[0],\''+id+'\',true);';
			stopicon = '<i title="暂停播放" onclick="" class="radio_pause"></i>';
			$(this).find(".radio_play").remove();
		} else if (status == 2)	{
		    if ($(this).find(".radio_start").size() == 0) {
			    stopicon = '<i title="继续播放" onclick="" class="radio_start"></i>';
			}
			click = 'continueRadio(arguments[0],\''+id+'\',true);';
			stopicon = '<i title="继续播放" onclick="" class="radio_start"></i>';
			$(this).find(".radio_stop").remove();
		}else{
            $(this).find('.i_play').show();
            click = $(this).attr('_onclick');
        }
		$(this).append(stopicon);
		$(this).removeAttr('onclick');
		$(this).unbind("click").bind("click", function () {
			//console.log(click);
			eval(click);
		});
		return false;
	});
	
	$(".br_pic").live("mouseleave",function(){
        enterrid = '';
		$(this).removeClass("on");
		$(this).find(".radio_pause").remove();
		$(this).find(".radio_start").remove();
		var status = $(this).attr("c-status");
		if (status == 1) {
			var stopicon = '<img class="radio_play" src="img/playing_page_gif.gif">';
			$(this).append(stopicon);
		} else if (status == 2)	{
			var playicons = '<i class="radio_stop"></i>';
			$(this).find(".i_play").hide();
			$(this).append(playicons);
		}else{
            $(this).find('.i_play').hide();
        }
		return false;
	});
}

function reSetPageInfo(nowfid,type){    
    
    jumflag = GetRadioJumpType();    
    now_f_id = nowfid;
    //console.log('resetpageinfo type :' + type + '  now_f_id:' + now_f_id + ' jumflag:' + jumflag);
	if (type == 'big') { //如果是关联电台区域的电台只执行重新读取导航电台数据	    
	    load_nav_data(now_f_id);        
	    saveDataToCache('playingRadioPos', 1);
	    return;
	} 
    
    
	$("#slideControll .slideBtn p")[0].click();
    load_nav_data(now_f_id);
	load_relation_radio_data(now_f_id);    
    //SetRadioNowPlayingStatus(now_f_id);

	var RadioInfo = 'IsArtRadio?fid='+now_f_id;
	RadioInfo = callClient(RadioInfo);
	var isArtistRadio = parseInt(getValue(RadioInfo,'bType'));
	if(!isArtistRadio){
		var playingSongInfo = callClient('GetRadioPlayingSongInfo');
		var artistId = getValue(playingSongInfo,'artid');
		var url = 'http://search.kuwo.cn/r.s?stype=artistinfo&artistid='+artistId;
		$.ajax({
	        url:getChargeURL(url),
	        dataType:'jsonp',
	        crossDomain:false,
			success:function(json){
				var dataArr = [];
				dataArr[0] = json;
				create_artist_radio_area(dataArr);
				$('#artistRadioBox img').attr('src',$('#artistRadioBox img').attr('data-original'));
				showLike('get','ARTIST');
			},
	        error:function(xhr){
	        }
	    });
	}else{
		$('#artistRadioBox').html('');
	}
}