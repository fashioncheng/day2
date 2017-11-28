;(function(){
	var currentObj;
	var pn;
	var rn = 40;
	var typeId = 0;
	var typeName;
	var oldurl=decodeURIComponent(window.location.href).replace(/###/g,'').split('?')[0];
	var oldmsg='';
	window.onload = function (){
		callClientNoReturn('domComplete');
		centerLoadingStart("content");
		var url=decodeURIComponent(window.location.href).replace(/###/g,'');
		var msg=getUrlMsg(url);
		oldmsg = msg;
		//currentObj = fobj.goldjson;
		typeId = getStringKey(msg,'typeId') || 0;
		typeName = getStringKey(msg,'typeName') || '全部';
		typeClass = getStringKey(msg,'typeClass') || '';
		pn = getStringKey(msg,'pn') || 0;
		getSomeData();	
		objBindFn();
	};
	
	$(window).resize(function() {
		iframeObj.refresh();
	});
	
	function getSomeData(){
		if(pn == 0 && typeId == 0){
			var jxjChannelData = getDataByCache('jxj-channel');
			if(jxjChannelData){
				try{
					getJxjListData($.parseJSON(jxjChannelData));
				}catch(e){
					var url = 'http://album.kuwo.cn/album/jxjPast?typeId='+typeId+'&year=2016&rn='+rn+'&pn='+pn;
					//getScriptData(url);
					$.ajax({
				        url:url,
				        dataType:'jsonp',
				        crossDomain:false,
                        jsonpCallback:"getJxjListData",
						success:function(json){
							getJxjListData(json);
						}
				    });
				}
			}else{
				var url = 'http://album.kuwo.cn/album/jxjPast?typeId='+typeId+'&year=2016&rn='+rn+'&pn='+pn;
				//getScriptData(url);
				$.ajax({
			        url:url,
			        dataType:'jsonp',
			        crossDomain:false,
                    jsonpCallback:"getJxjListData",
					success:function(json){
						getJxjListData(json);
					}
			    });
			}
		}else{
			var url = 'http://album.kuwo.cn/album/jxjPast?typeId='+typeId+'&rn='+rn+'&pn='+pn;
			//getScriptData(url);
			$.ajax({
		        url:url,
		        dataType:'jsonp',
		        crossDomain:false,
                jsonpCallback:"getJxjListData",
				success:function(json){
					getJxjListData(json);
				}
		    });
		}
	}
	
	// 创建精选集列表
	function getJxjListData(jsondata) {
		var data = jsondata;
		var sliderData = data.data.sliderImgs;
		var typeData = data.data.jxjType;
		var fastData = data.data.fastDoor;
		var child = data.data.pastList;
		var len = child.length;
		var totalPage = data.data.totalPage;
		var currentPn = parseInt(data.data.pn,10);
		var pageStr = createPage(totalPage, currentPn+1);
		var arr = [];
		createFocus(sliderData);
		createType(typeData);
		createfast(fastData);
		for (var i = 0; i < len; i++ ) {
			arr[arr.length] = createJxjBlock(child[i], i, 0);
		}
		$(".kw_jxj_list").html(arr.join('')).prev().show();
		if (pageStr) $(".page").html(pageStr).show();
		centerLoadingEnd("content");
		iframeObj.refresh();
	}
	
	function createType(jsondata) {
		var data = jsondata;
		var len = data.length;
		var arr = [];
		arr[0] = '<li><a href="###" hidefocus c-id="0" >全部</a>';
		for (var i=0; i<len; i++) {
			var obj = data[i];
			var name = obj.name;
			var id = obj.id;
			var oClass = '';
			if (typeId == id){
				oClass = 'current';
			}
			arr[arr.length] = '<li><a href="###" hidefocus class="';
			arr[arr.length] = oClass;
			arr[arr.length] = '" c-id="';
			arr[arr.length] = id;
			arr[arr.length] = '">';
			arr[arr.length] = name;
			arr[arr.length] = '</a></li>';
		}
		$(".sort").find("font").html(typeName).parents(".sort_wrap").show().parents("h2").show();
		$(".sort_wrap ul .type_list").html(arr.join(''));
		if ($(".type_list").find(".current").size() < 1) {
			$(".type_list").find("a").eq(0).addClass("current");
		}
	}
	
	function createfast(jsondata) {
		var data = jsondata;
		var len = data.length;
		var arr = [];
		for (var i=0; i<len; i++) {
			var obj = data[i];
			var id = obj.id;
			var name = obj.name;
			var oStyle = 'color:' + obj.color || 'color:#323c50';
			var oClass = '';
			typeId == id ? oClass = 'current' : oClass = '';
			arr[arr.length] = '<a href="###" hidefocus style="';
			arr[arr.length] = oStyle;
			arr[arr.length] = '" class="';
			arr[arr.length] = oClass;
			arr[arr.length] = '" c-id="';
			arr[arr.length] = id;
	//		arr[arr.length] = '"><i></i>';
			arr[arr.length] = '">';
			arr[arr.length] = name;
			arr[arr.length] = '</a>';
		}
		$(".fast_wrap").html(arr.join('')).show();
		$(".title").show();
	}
	
	function createFocus(jsondata) {
		var data = jsondata;
		var len = data.length;
		var arr = [];
		var btnarr = [];
		var oClass = '';
		var oStyle = '';
		if (len < 2) return; 
		for (var i=0; i<len; i++) {
			var obj = data[i];
			var pic = obj.pic;
			var source = obj.source;
			var sourceid = obj.sourceid;
			var name = obj.info;
			var disname = obj.name;
			var id = sourceid;
			if (source == 21) id = getValue(id,'id');
			if(source==21&&sourceid.indexOf("?")>-1){
			    sourceid = sourceid+"&from=jxfocus";
		    }
			var click = commonClickString(new Node(source,sourceid,checkSpecialChar(disname,"name"),0,obj.extend,'|csrc=曲库->分类->精选集->焦点图->'+name));
			var iplay = '<i onclick="iPlay(arguments[0],'+source+','+id+',this); return false;" data-ipsrc="精选->焦点图->'+disname+'" class="i_play" title="直接播放"></i>';
			i==0 ? oStyle = '' : oStyle = 'display:none';
			i==0 ? oClass = 'current' : oClass = '';
			arr[arr.length] = '<a title="';
			arr[arr.length] = checkSpecialChar(name,"titlename");
			arr[arr.length] = '" href="###" hidefocus style="';
			arr[arr.length] = oStyle;
			arr[arr.length] = '" onclick="';
			arr[arr.length] = click;
			arr[arr.length] = '">';
			arr[arr.length] = iplay;
			arr[arr.length] = '<img src="';
			arr[arr.length] = pic;
			arr[arr.length] = '" width="620" height="140"></a>';
			btnarr[btnarr.length] = '<a title="';
			btnarr[btnarr.length] = checkSpecialChar(name,"titlename");
			btnarr[btnarr.length] = '" href="###" hidefocus class="';
			btnarr[btnarr.length] = oClass;
			btnarr[btnarr.length] = '"></a>';
		}
		$(".focus .btn").html(btnarr.join(''));
		$(".pic").html(arr.join('')).show();
		$(".focus").show();
	}
	
	function objBindFn() {
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
			var other = '|pn='+pn+'|typeId='+typeId+'|typeName=' + typeName;
			var source = url2data(oldmsg,'source');
			var sourceid = url2data(oldmsg,'sourceid');
			var name = url2data(oldmsg,'name');
			commonClick(new Node(source,sourceid,name,0,'',other));
			return false;
		});
		
		$(".type_list a").live("click",function(){
			var typeId = $(this).attr("c-id");
			var typeName = $(this).html();
			var other = '|pn='+pn+'|typeId='+typeId+'|typeName=' + typeName;
			var source = url2data(oldmsg,'source');
			var sourceid = url2data(oldmsg,'sourceid');
			var name = url2data(oldmsg,'name');
			commonClick(new Node(source,sourceid,name,0,'',other));
			//window.location.href=oldurl+'?'+'source='+source+'&sourceid='+sourceid+'&name='+name+'&typeId='+typeId+'&typeName='+typeName;
			return false;
		});
		
		$(".fast_wrap a").live("click",function(){
			var typeId = $(this).attr("c-id");
			var typeName = $(this).html();
			var other = '|pn=0|typeId='+typeId+'|typeName=' + typeName;
			$(this).addClass('current').siblings().removeClass('current');
			var typeClass = $(this).attr('class');
			var source = url2data(oldmsg,'source');
			var sourceid = url2data(oldmsg,'sourceid');
			var name = url2data(oldmsg,'name');
			commonClick(new Node(source,sourceid,name,0,'',other));
			//window.location.href=oldurl+'?'+'source='+source+'&sourceid='+sourceid+'&name='+name+'&typeId='+typeId+'&typeName='+typeName;
			return false;
		});
		
		$(".close").live("click",function(){
			$(".big_list").hide();
			return false;
		});
		
		$(".sort").live("click",function(){
		    try{
	            var h = $(".content").height();
	            if(h<400){
	                $(".content").height(400);
	            }
	        }catch(e){}
			$(".big_list").isShow() ? $(".big_list").hide() : $(".big_list").show();
			return false;
		});
		
		var index = 0;
		var timer = null;
		$(".focus").live("mouseenter",function(){
			clearInterval(timer);
			$(this).children("i").show();
			return false;
		}).live("mouseleave",function(){
			startMove();
			$(this).children("i").hide();
			return false;
		});
		$(".focus .btn a").live("mouseenter",function(){
			index = $(this).index();
			tab();
			return false;
		});
	
		$(".focus .prev").live("click",function(){
			index--;
			if (index < 0) index = $(".focus .btn a").size() - 1;
			tab();
			return false;
		});
		$(".focus .next").live("click",function(){
			index++;
			if (index >=  $(".focus .btn a").size()) index = 0;
			tab();
			return false;
		});	
		startMove();
		function startMove(){
			clearInterval(timer);
			timer = setInterval(function(){
				index++;
				if (index > 3) index = 0;
				tab();
			},5000);		
		}
		function tab(){
			$(".focus .pic").children("a").eq(index).show().siblings("a").hide();
			$(".focus .btn a").eq(index).addClass("current").siblings("a").removeClass("current");		
		}
		
	}

})();