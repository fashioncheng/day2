;(function(){
	var currentObj;
	var pn = 0;
	var rn = 100;
	var tagDbId;
	var type;
	var isIndex;
	var sourceid;
	var psrc;
	var bread;
	var currentName;
	var oldurl=decodeURIComponent(window.location.href)[0];
	var oldmsg;
	window.onload = function(){
		callClientNoReturn('domComplete');
		var url=decodeURIComponent(window.location.href);
		var msg=getUrlMsg(url);
		oldmsg=msg;
		centerLoadingStart("content");
		//currentObj = fobj.goldjson;
		sourceid = url2data(msg,'sourceid');
		psrc = getStringKey(msg,'psrc');
		bread = getStringKey(msg,'bread');	
		pn = getStringKey(msg,'pn') || 0;
		tagDbId = getStringKey(msg,'tagDbId');
		type = getStringKey(msg,'type');
		isIndex = getStringKey(msg,'from');
		getSomeData();
		objBindFn();
	};
	
	$(window).resize(function(){
		iframeObj.refresh();
	});
	
	// 获取歌单数据
	function getSomeData() {
		var url = "http://album.kuwo.cn/album/dj2015new?type=mv&rn="+rn+"&pn="+pn+"";
		//getScriptData(url);
		$.ajax({
	        url:url,
	        dataType:'jsonp',
	        crossDomain:false,
	        jsonpCallback:'loadSomeMVGeDan',
			success:function(json){
				loadSomeMVGeDan(json);
			}
	    });
	}
	
	// 创建歌单内容
	function loadSomeMVGeDan(jsondata) {
		var data = jsondata;
		var id = data.id;			
		var pic = data.pic;			
		var info = data.info;			
		var title = data.title;
		var tag = data.tag || '无';
		var child = data.musiclist;
		var len = child.length;
		var arr = [];
		var currentPn = parseInt(data.pn);
		var total = data.count;
		var totalPage = parseInt(data.total,10);
		currentName = checkSpecialChar(title,"disname");
		MUSICLISTOBJ = {};
		for (var i = 0; i < len; i++) {
			arr[arr.length] = createMVBlock(child[i],'MV','',psrc+currentName,i);
		}
		var pageStr = createPage(totalPage, currentPn+1);
		$(".checkall font").html("共"+total+"首");
		if(info=='')$(".info").hide();
		$(".info span").html(info);	
		$(".bread span").html(checkSpecialChar(title,"disname"));		
		$(".gedan_head .pic img").attr("src",pic);
		$(".gedan_head .name").html(checkSpecialChar(title,"disname"));
		$(".kw_music_list").html(arr.join(''));
		/*数据加载完显示*/
		$(".max_content").show();
		if (pageStr) $(".page").html(pageStr).show();
		$(".like_btn").attr("c-id",id);
		showLike('get','PLAYLIST');		
		iframeObj.refresh();
		centerLoadingEnd("content");
	}
	
	function objBindFn() {
		$(".open").live("click",function(){
			$(".info").addClass("on");
			$(".info span").html(infoTxt + '<a href="###" hidefocus class="fold">[收起]</a>');
			return false;
		});
		
		$(".fold").live("click",function(){
			$(".info").removeClass("on");
			refreshInfoTxt();
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
			var source = url2data(oldmsg,'source');
			var sourceid = url2data(oldmsg,'sourceid');
			var name = url2data(oldmsg,'name');
			var extend = url2data(oldmsg,'extend');
			var other = '|pn='+pn+'|psrc='+psrc+'->|bread='+bread+'|type='+type+'|tagDbId='+tagDbId;		
			commonClick(new Node(source,sourceid,name,0,'',other));
			return false;
		});	
	}

})();