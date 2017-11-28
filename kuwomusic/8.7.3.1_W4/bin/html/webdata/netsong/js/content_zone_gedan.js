;(function(){
	var currentObj;
	var pn = 0;
	var rn = 100;
	var tagDbId;
	var type;
	var isIndex;
	var psrc;
	var bread;
	var sort;
	var currentName;
	var newnum = 0;
	var sortarr = ['custom','hot','new'];
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
		sort = getStringKey(msg,'sort') || 0;
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
		var url = "http://album.kuwo.cn/album/dj2015new?type="+type+"&subType="+sourceid+"&tagDbId=" + tagDbId + "&pn="+pn+"&rn="+rn+"&sort="+sortarr[sort]+"";
		//getScriptData(url);
		$.ajax({
	        url:url,
	        dataType:'jsonp',
	        crossDomain:false,
	        jsonpCallback:'getGedanInfoData',
			success:function(json){
				getGedanInfoData(json);
			},
			error:function(xhr){
				var httpstatus = xhr.status;
				var sta = httpstatus.toString();
				if(sta==200){
					$.ajax({
				        url:url,
				        dataType:'text',
				        crossDomain:false,
						success:function(json){
							var json = eval('('+json+')');
							getGedanInfoData(json);
						},
						error:function(xhr){
							loadErrorPage();
						}
				    });
				}else{
					loadErrorPage();
				}
			}
	    });
	}
	
	// 创建歌单内容
	function getGedanInfoData(jsondata) {
		var data = jsondata;
		var id = data.id;			
		var pic = data.pic2016||data.pic;			
		var info = data.info;		
		var title = data.title;
		var tag = data.tag || '无';
		var child = data.musiclist;
		var len = child.length;
		var arr = [];
		var xia = 0;
		var currentPn = parseInt(data.pn);
		var total = data.count;
		var totalPage = parseInt(data.total,10);
		var newarr = [];
		currentName = checkSpecialChar(title,"disname");
		newnum = data.newCount || 0;
		info = info.replace(/<br\/>/g,'');
		MUSICLISTOBJ = {};
		for (var i = 0; i < len; i++) {
			if (i < newnum && pn == 0 && (sort == 0 || sort == 2)) {
				newarr[newarr.length] = createGedanMusicList(child[i],i,rn,currentPn,psrc+currentName)
			} else {
				arr[xia++] = createGedanMusicList(child[i],i,rn,currentPn,psrc+currentName);
			}		
		}
		var newListStr = '';
		if (newnum > 0 && pn == 0 && (sort == 0 || sort == 2)) {
			$(".sub").css({"position":"relative","left":"0px"});
			var date = new Date();
			var month = date.getMonth();
			var date = date.getDate();
			$(".bnew").html((month+1) + "月"+date+"日 / 更新" + newnum + "首新歌").show();
			newListStr = '<li class="newlist"><ul style="display:inline; overflow:auto;">'+newarr.join('')+'<div style="clear:both"></div></ul></li>';
		} else {
			$(".def").find(".checkall").show();
			$(".def").find(".bnew").hide();
			newListStr = '';
		}
		if (type == 'tag') {
			var index = parseInt(sort,10);
			$(".sort_wrap").find("li").eq(index).hide().siblings().show();		
			var sortstr = $(".sort_wrap").find("li").eq(index).find("a").html();
			$(".sort_wrap").find(".sort").html('<i></i>'+sortstr);
			if (newnum > 0 && pn == 0 && (sort == 0 || sort == 2)) {
				$(".sub").find(".sort_wrap").show();
			} else {
				$(".def").find(".sort_wrap").show();
			}	
		}	
		var bigStr = newListStr + arr.join('');	
		var pageStr = createPage(totalPage, currentPn+1);
		$(".checkall font").html(total);
		if(info=='')$(".info").hide();
		$(".info").html('<span class="icon icon_info"></span>'+info);
		$(".bread span").html(checkSpecialChar(title,"disname"));		
		$(".gedan_head .pic img").attr("src",pic);
		$(".gedan_head .name").html(checkSpecialChar(title,"disname"));
		$(".kw_music_list").html(bigStr);
		/*数据加载完显示*/
		$(".max_content").show();
		if (pageStr) $(".page").html(pageStr).show();
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
			var other = '|pn='+pn+'|psrc='+psrc+'->|bread='+bread+'|type='+type+'|tagDbId='+tagDbId+'|sort='+sort;		
			commonClick(new Node(source,sourceid,name,0,'',other));
			return false;
		});
		
		$(".sort_wrap").mouseenter(function(){
			$(this).children("ul").show();
			return false;
		}).mouseleave(function(){
			$(this).children("ul").hide();
			return false;
		});
		
		$(".sort_wrap li").click(function(){
			var source = currentObj.source;
			var sourceid = currentObj.sourceid;
			var name = currentObj.name;
			var id = currentObj.id;
			var sortby = $(this).index();
			var other = '|pn=0|psrc='+psrc+'->|bread='+bread+'|type='+type+'|tagDbId='+tagDbId+'|sort='+sortby;		
			commonClick(new Node(source,sourceid,name,id,'',other));
			return false;
		});	
	}

})();