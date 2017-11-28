var artistComUrl = 'http://artistlistinfo.kuwo.cn/mb.slist?stype=artistlist&encoding=utf8&';
var currentObj;
var pn = 0;
var rn = 100;
var category = 0;
var orderType = 'hot';
var prefix;
var myartistObj = {
	"source":"999",
	"sourceid":"999",
	"id": "999",
	"name": "我收藏的",
	"music_num": "0",
	"listen": "0",
	"like": "0",
	"new_album": "0",
	"new_album_cnt": "0",
	"pic": "img/myartist.png"
};
var oldurl=decodeURIComponent(window.location.href).split('?')[0];
var oldmsg='';

window.onload = function() {
	callClientNoReturn('domComplete');
	var url1=decodeURIComponent(window.location.href);
	// param=url1.substring(url1.indexOf('{'),url1.lastIndexOf('}')+1);
	// if(param!='')OnJump(param);
	centerLoadingStart("content");
	var url=decodeURIComponent(window.location.href).replace(/###/g,'');
	var msg=getUrlMsg(url);
	oldmsg=msg;
	pn = getStringKey(msg,'pn') || 0;
	category = getStringKey(msg,'category') || 0;
	orderType = getStringKey(msg,'orderType') || 'hot';
	prefix = getStringKey(msg,'prefix') || '';
	if (prefix == '#') prefix = '%23';
	// currentObj = fobj.goldjson;
	// pn = getStringKey(currentObj.other,'pn') || 0;
	// category = getStringKey(currentObj.other,'category') || 0;
	// orderType = getStringKey(currentObj.other,'orderType') || 'hot';
	// prefix = getStringKey(currentObj.other,'prefix') || '';
	// if (prefix == '#') prefix = '%23';
	getSomeData();
	objBindFn();
};

$(window).resize(function() {
	iframeObj.refresh();
});

// 请求歌手列表数据
function getSomeData() {
	if(pn == 0 && category == 0 && orderType == 'hot'){
		var artistChannelData = getDataByCache('artist-channel');
		//var artistChannelData = getDataByCache('channelArtistData');
		if(artistChannelData){
			try{
				getArtistListData($.parseJSON(artistChannelData));
				//$('body').html(artistChannelData);
				setTimeout(function(){
					iframeObj.refresh();
				},100);
			}catch(e){
				//var url = 'http://artistlistinfo.kuwo.cn/mb.slist?stype=artistlist&callback=getArtistListData&category='+category+'&order='+orderType+'&pn='+pn+'&rn='+rn;
				var url = 'http://artistlistinfo.kuwo.cn/mb.slist?stype=artistlist&category='+category+'&order='+orderType+'&pn='+pn+'&rn='+rn+'&encoding=utf8';
				if (prefix) url = url + '&prefix=' + prefix;
				$.ajax({
			        url:url,
			        dataType:'jsonp',
					success:function(json){
						getArtistListData(json);
					}
			    });
			}
		}else{
			//var url = 'http://artistlistinfo.kuwo.cn/mb.slist?stype=artistlist&callback=getArtistListData&category='+category+'&order='+orderType+'&pn='+pn+'&rn='+rn;
			var url = 'http://artistlistinfo.kuwo.cn/mb.slist?stype=artistlist&category='+category+'&order='+orderType+'&pn='+pn+'&rn='+rn+'&encoding=utf8';
			if (prefix) url = url + '&prefix=' + prefix;
			$.ajax({
		        url:url,
		        dataType:'jsonp',
				success:function(json){
					getArtistListData(json);
					saveDataToCache("channelArtistData",$('body').html(),3600);
				}
		    });
		}
	}else{
		//var url = 'http://artistlistinfo.kuwo.cn/mb.slist?stype=artistlist&callback=getArtistListData&category='+category+'&order='+orderType+'&pn='+pn+'&rn='+rn;
		var url = 'http://artistlistinfo.kuwo.cn/mb.slist?stype=artistlist&category='+category+'&order='+orderType+'&pn='+pn+'&rn='+rn+'&encoding=utf8';
		if (prefix) url = url + '&prefix=' + prefix;
		$.ajax({
	        url:url,
	        dataType:'jsonp',
			success:function(json){
				getArtistListData(json);
			}
	    });
	}
	
}

// 创建歌手列表
function getArtistListData(jsondata) {
	var data = jsondata;
	var child = data.artistlist;
	var len = child.length;
	if (!len && len < 1) {
		$(".nothing").css("padding-top","50px").show();
		$(".kw_music_list").hide();
		centerLoadingEnd("content");
		iframeObj.refresh();		
		return;
	}
	var arr = [];
	if (category==0 && orderType=='hot' && pn==0) {
		arr[0] = createArtistBlock (myartistObj,'myartist');
	}
	for (var i=0; i<len; i++) {
		arr[arr.length] = createArtistChannelBlock(child[i], 'artist');
	}
	$(".kw_album_list").html(arr.join(''));
	var total = data.total;
	var totalPage = Math.ceil(total/rn);
	var currentPn = parseInt(data.pn,10);
	var pageStr = createPage(totalPage, currentPn+1);
	if (pageStr) $(".page").html(pageStr).show();
	centerLoadingEnd("content");
	iframeObj.refresh();
}

function objBindFn() {
	$(".category a").each(function(){
		var currentCategory = $(this).attr("c-category");
		if (currentCategory == category) {
			$(this).addClass("current");
			$(this).siblings().removeClass("current").removeClass("current_z");
		}
		$(".category").show();
	});	
	
	$(".prefix a").each(function(){
		var currentPrefix = $(this).attr("c-prefix");
		var oClass =  $(this).attr("class");
		var isZimu = false;
		if (oClass){
			if (oClass.indexOf('zimu') > -1) isZimu = true;
		}
		if (currentPrefix == prefix && !isZimu) {
			$(this).addClass("current");
			$(this).siblings().removeClass("current").removeClass("current_z");
		} else if (currentPrefix == prefix && isZimu) {
			$(this).addClass("current_z");
			$(this).siblings().removeClass("current").removeClass("current_z");
		}
		$(".prefix").show();
	});	
	
	$(".sub_nav").on("click" , "a",function(e){
		var obj = $(this);
		obj.siblings().removeClass("current current_z");
//		obj.siblings().removeClass("current_z");
		obj.hasClass("zimu") ? obj.addClass("current_z") : obj.addClass("current");

		$(".category a").each(function(){
			var classVal = $(this).attr("class");
			if (classVal) {
				if (classVal.indexOf("current") > -1) {
					category = $(this).attr("c-category");
					parseInt(category) ? orderType = 'hot' : orderType = 'dict';
				}
			}
		});
		
		$(".prefix a").each(function(){
			var classVal = $(this).attr("class");
			if (classVal) {
				if (classVal.indexOf("current") > -1) {
					prefix = $(this).attr("c-prefix");
					if (prefix == 'hot') {
						orderType = 'hot';
						prefix = '';
					}
				}
			}
		});
		var other = '|rn='+pn+'|category='+category+'|orderType='+orderType+'|prefix='+prefix;
		commonClick(new Node(-2,4,'歌手',-2,'',other));
		
		return false;
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
		var other = '|pn='+pn+'|category='+category+'|orderType='+orderType+'|prefix='+prefix;
		commonClick(new Node(-2,4,'歌手',-2,'',other));
	});	
}