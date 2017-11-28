window.onload = function(){
	callClientNoReturn('domComplete');
	centerLoadingStart("content");
	getSomeData();
};

function getSomeData() {
	var sid = getUserID("sid");
	var uid = getUserID("uid");
	//var url = 'http://nplserver.kuwo.cn/pl.svc?op=getlikeinfo&uid='+uid+'&sid='+sid+'&pn=0&rn=100&type=ARTIST&callback=getMyArtistData&r='+Math.random();
	//getScriptData(url);
	var url = 'http://nplserver.kuwo.cn/pl.svc?op=getlikeinfo&uid='+uid+'&sid='+sid+'&pn=0&rn=100&type=ARTIST&r='+Math.random();
	$.ajax({
        url:url,
        dataType:'jsonp',
        crossDomain:false,
		success:function(json){
			getMyArtistData(json);
		}
    });
}

function getMyArtistData(jsondata) {
	var data = jsondata;
	var child = data.abslist;
	var len = child.length;
	if (!len && len < 1) {
		//var t = $(fobj.window).height() / 2 - 150;
		$(".nothing_myartist").css("margin-top","64px").show();
		centerLoadingEnd("content");
		iframeObj.refresh();		
		return;
	}
	var arr = [];
	for (var i=0; i<len; i++) {
		arr[arr.length] = createArtistBlock (child[i], 'myartcontent');
	}
	$(".kw_album_list").html(arr.join(''));
	centerLoadingEnd("content");
	iframeObj.refresh();
}