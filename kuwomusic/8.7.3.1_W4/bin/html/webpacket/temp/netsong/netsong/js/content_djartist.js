;(function(){
	var currentObj;
	var currentBread;
	var psrc = '';
	var bread = '';
	window.onload = function (){
		callClientNoReturn('domComplete');
		var url=decodeURIComponent(window.location.href);
		var msg=getUrlMsg(url);
		centerLoadingStart("content");
		//currentObj = fobj.goldjson;
		artistId = url2data(msg,'sourceid');
		psrc = getStringKey(msg,'psrc');
		bread = getStringKey(msg,'bread');
		//currentBread = currentObj.source +','+currentObj.sourceid +','+currentObj.name+','+currentObj.id;
		getSomeData(artistId);
		objBindFn();
	};
	
	$(window).resize(function() {
		iframeObj.refresh();
	});
	
	// 进入专区
	function getSomeData(id){
		if (id==1) {
			$(".com_tit font").html("潮流DJ人");
			$(".bread span").html("潮流DJ人");
			var url = 'http://album.kuwo.cn/album/dj2015new?type=singer';
			//getScriptData(url);
			$.ajax({
		        url:url,
		        dataType:'jsonp',
		        crossDomain:false,
		        jsonpCallback:"getArtistListData",
				success:function(json){
					getArtistListData(json);
				}
		    });
		} else if (id==2) {
			$(".share_gedan").show();
			$(".com_tit font").html("精彩推荐");
			$(".bread span").html("精彩推荐");
			var url = 'http://album.kuwo.cn/album/dj2015new?type=reclist';
			//getScriptData(url);	
			$.ajax({
		        url:url,
		        dataType:'jsonp',
		        crossDomain:false,
		        jsonpCallback:"getGeDanListData",
				success:function(json){
					getGeDanListData(json);
				}
		    });
		}
	}
	
	function getArtistListData(jsondata){
		var data = jsondata;
		var child = data.data.singerList;
		var len = child.length;
		var arr = [];
		var obj;
		var pic;
		var source = 4;
		var sourceid;
		var name;
		var id = 0;
		var icon;
		var listen;
		var click;
		for (var i = 0; i < len; i++) {
			obj = child[i];
			sourceid = obj.sourceid;
			name = obj.name;
			titlename = checkSpecialChar(name,"titlename");
			disname = checkSpecialChar(name,"disname");		
			if (obj.extend) {
				icon = getValue(obj.extend,'ICON');	
			} else {
				icon = '';
			}
			pic = getValue(obj.extend,'PIC2016') || obj.pic;
			listen = obj.listen;
			click = commonClickString(new Node(4,sourceid,name,0,"","psrc=分类->DJ专区->潮流DJ人->"));
			
			arr[arr.length] = '<li style="';
			if ((i+1)%4 == 0) {
				arr[arr.length] = 'margin-right:0;';
			}		
			arr[arr.length] = '"><a href="###" hidefocus onclick="';
			arr[arr.length] = click;
			arr[arr.length] = '">';
			if (icon=='sole') {
				arr[arr.length] = '<span class="du"></span>';
			}		
			arr[arr.length] = '<div class="pic"><img src="'
			arr[arr.length] = pic;
			arr[arr.length] = '" width="165"/></div><p class="name" title="';
			arr[arr.length] = titlename;
			arr[arr.length] = '">';
			arr[arr.length] = disname;
			arr[arr.length] = '</p><p class="info" title="';
			arr[arr.length] = listen;
			arr[arr.length] = '人在听">';
			arr[arr.length] = listen;
			arr[arr.length] = '人在听</p></a></li>';
		}
		$(".com_listwrap").html(arr.join('')).show();
		iframeObj.refresh();
		centerLoadingEnd("content");
	}
	
	// 创建推荐歌单
	function getGeDanListData(jsondata){
		var data = jsondata;
		var child = data.data.recList;
		var len = child.length;
		var arr = [];
		var obj;
		var face;
		var userName;
		var name;
		var tagId;
		var tagDbId;	
		var pic;
		var flag;
		var listenCount;
		var flagStr;
		var type;	
		var click;
		var other;
		for (var i = 0; i < len; i++) {
			obj = child[i];
			face = obj.face;
			userName = obj.userName;
			name = obj.name;
			sourceid = 0;
			id = 0;				
			pic = obj.pic;
			tagId = obj.tagId;
			type = obj.type;
			tagDbId = obj.tagDbId;
			flag = obj.flag;
			listenCount = obj.listenCount;
			other = 'type='+type+'|tagDbId='+tagDbId+'|psrc=首页->分类->DJ专区->|bread=-2,5,分类,-2*_*5,88079,DJ,88079';
			click = commonClickString(new Node(-203,tagId,name,id,"",other));
			arr[arr.length] = '<li style="';
			if ((i+1)%4 == 0) {
				arr[arr.length] = 'margin-right:0;';
			}
			arr[arr.length] = '"><a href="###" hidefocus onclick="';
			arr[arr.length] = click;
			arr[arr.length] = '"><div class="pic"><div class="head"><img src="';
			arr[arr.length] = face;
			arr[arr.length] = '" width="20" height="20px"/>'
			arr[arr.length] = userName;
			arr[arr.length] = '<div class="bg"></div></div><img src="';
			arr[arr.length] = pic;
			arr[arr.length] = '" width="165"/></div><p class="name">';
			arr[arr.length] = name;
			arr[arr.length] = '</p><p class="info">';
			arr[arr.length] = listenCount;
			arr[arr.length] = '人在听</p></a></li>'
		}
		$(".com_listwrap").html(arr.join('')).show();
		if ($(".max_content").height() < 400) $(".max_content").css("height","400px");
		iframeObj.refresh();
		centerLoadingEnd("content");	
	}
	
	var noGedanTimer = null;
	function createShareList(jsondata){
		var child = jsondata;
		var len = child.length;
		var obj;
		var name;
		var id;
		var arr = [];
		if (len < 1) {
			$(".no_gedan").show();
			clearTimeout(noGedanTimer);
			noGedanTimer = setTimeout(function(){
				$(".no_gedan").hide();
			},5000);
			return;
		}
		for (var i=0; i<len; i++) {
			obj = child[i];
			name = obj.name;
			id = parseInt(obj.id, 10) || -999;
			arr[arr.length] = '<li><a href="###" hidefocus data-id="';
			arr[arr.length] = id;
			arr[arr.length] = '" data-name="';
			arr[arr.length] = name;
			arr[arr.length] = '" title="';
			arr[arr.length] = name;
			arr[arr.length] = '">';
			arr[arr.length] = name
			arr[arr.length] = '</a></li>'
		}
		$(".share_gdlist .c_c").html(arr.join(''));
		if (len < 11) {
			$(".c_com").hide();
			$(".share_gdlist .c_cwarp").css("height",28 * len);
		} else {
			var h = $(".c_cwarp li").eq(0).height() * 10;
			$(".c_com").show();
			$(".share_gdlist .c_cwarp").css("height",h);
		}	
		$(".share_gdlist").show();
	}
	
	function cLogin() {
		$(".share_gdlist").hide();
		$(".qq_pop").hide();
	}
	// 客户端登录后退出 回调
	function cLogout() {
		$(".share_gdlist").hide();
		$(".qq_pop").hide();
		$(".no_gedan").hide();
	}
	
	function objBindFn() {
		$(".share_gedan").live("click",function(){
			//ABLog("DJZONE","SHAREGEDAN");
			if ($(".qq_pop").isShow() || $(".no_gedan").isShow()) {
				return;
			}
			if ($(".share_gdlist").isShow()){
				$(".share_gdlist").hide();
			} else {
				var sid = getUserID("sid");
				var uid = getUserID("uid");	
				if (!uid || uid == '0' || !sid || sid == '0') {
					callClientNoReturn("UserLogin?src=login");
					return;
				}
				/*var url = 'http://nplserver.kuwo.cn/pl.svc?op=getownlist&uid='+uid+'&sid='+sid+'&callback=getShareGeDan&t='+Math.random();
				getScriptData(url)*/;
				var str = callClient("UserPlayList");
				var listarr = str.split("\r\n");
				var arr = [];
				for (var i=0; i<listarr.length; i++){
					var somearr = listarr[i].split('\t');
					var name = somearr[0];
					var type = somearr[1];
					var id = somearr[3];
					var child = parseInt(somearr[2],10);
					if (type != 'list') continue;
					if (!child) continue;
					arr[arr.length] = {"name":name,"id":id};
				}
				createShareList(arr);
			}
			return false;
		});
		
		$("body").click(function(e){
			var e = window.event || e; // 兼容IE7
			var obj = $(e.srcElement || e.target);
			if (!$(obj).is(".share_gdlist,.share_gdlist *,.share_gedan")) { 
				$(".share_gdlist").hide();
			}
		});
		
		$(".c_b").live("click",function(){
			$(".c_t").removeClass("c_t_n");
			var t = parseInt($(".c_c").css("margin-top"))-120;
			if ( t <= $(".c_cwarp").height() - $(".c_c").height()){
				$(this).addClass("c_b_n");
				var et = $(".c_cwarp").height() - $(".c_c").height();
				$(".c_c").stop().animate({"margin-top":et},150);
			} else {
				$(this).removeClass("c_b_n");
				$(".c_c").stop().animate({"margin-top":t},150);
			}
			return false;
		});
		
		$(".c_t").live("click",function(){
			var t = parseInt($(".c_c").css("margin-top"))+120;
			$(".c_b").removeClass("c_b_n");
			if ( t >= 0){
				$(this).addClass("c_t_n");
				$(".c_c").stop().animate({"margin-top":0},100);
			} else {
				$(this).removeClass("c_t_n");
				$(".c_c").stop().animate({"margin-top":t},100);
			}
			return false;
		});
		
		$(".c_c a").live("click",function(){
			var uid = getUserID("uid");
			var currentid = $(this).attr("data-id");
			var isOK = false;
			$(".share_gdlist").hide();
			var str = callClient("UserPlayList");
			var listarr = str.split("\r\n");
			for (var i=0; i<listarr.length; i++){
				var somearr = listarr[i].split('\t');
				var id = somearr[3];
				var type = somearr[1];
				if (type != 'list') continue;
				if (id == currentid) isOK = true;
			}
			if (isOK){
				$(".qq_pop").show().attr({"data-uid":uid,"data-id":currentid});
			} else {
				$(".no_gedan").show();
			}
			
		});
		
		$(".qq_pop .btn").live("click",function(){
			var qqnum = $.trim($(this).parents(".qq_pop").find(".qq_input").val());
			if (qqnum == '' || qqnum == '还没有输入QQ呦~'){
				$(this).parents(".qq_pop").find(".qq_input").val('还没有输入QQ呦~')
				return;
			}
			//ABLog("DJZONE","SHARESUCCESS");
			var uid = $(this).parents(".qq_pop").attr("data-uid");
			var id = $(this).parents(".qq_pop").attr("data-id");
			//var url = 'http://album.kuwo.cn/album/dj2015new?type=userAddList&uid='+uid+'&qq='+qqnum+'&pid='+id+'&callback=shareGedan';
			//getScriptData(url);
			var url = 'http://album.kuwo.cn/album/dj2015new?type=userAddList&uid='+uid+'&qq='+qqnum+'&pid='+id;
			$.ajax({
		        url:url,
		        dataType:'jsonp',
		        crossDomain:false,
		        jsonpCallback:'shareGedan',
				success:function(json){
					shareGedan(json);
				}
		    });
			$(".qq_pop").hide();
		});
		
		$(".no_gedan .btn").live("click",function(){
			clearTimeout(noGedanTimer);
			$(".no_gedan").hide();
		});
		
		$(".qq_pop").find(".qq_input").focus(function(){
			if ($(this).val() == '还没有输入QQ呦~'){
				$(this).val('');	
			}
		});
		
		$(".qq_pop").find(".qq_input").focus(function(){
			if ($(this).val() == '还没有输入QQ呦~'){
				$(this).val('');	
			}
		});
	}
})();
