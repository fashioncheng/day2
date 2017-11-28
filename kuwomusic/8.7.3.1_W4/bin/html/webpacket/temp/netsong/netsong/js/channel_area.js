// 专区 by deng
;(function(){
	var id = '';//专区id
	var radioid = 0;//电台id
	var status = '';//电台状态
	var name = '';//专区名字
	var dataCsrc = '';
	var isChannelMv = false;
	window.onload = function (){
		var call = "GetRadioNowPlaying";
		var str = callClient(call);
		var url = decodeURIComponent(window.location.href).replace(/###/g,'');
		var msg = getUrlMsg(url);
		radioid = getValue(str,'radioid');
		status = getValue(str,'playstatus');
		dataCsrc = getStringKey(msg,'csrc');
		callClientNoReturn('domComplete');
		centerLoadingStart("content");
		id = getValue(msg,'sourceid');
		name = getValue(msg,'name');
		// channelMv页面
		if(url.indexOf("channel_mv")>-1){
			isChannelMv = true;
			dataCsrc = "曲库->MV"
		}
		$("body").attr("data-csrc",dataCsrc);
		getSomeData();
		objBindFn();
	};
	function getSomeData(){
		var url = 'http://mobileinterfaces.kuwo.cn/er.s?type=get_pc_qz_data&f=web&id='+id+'&prod=pc';
		if(url!=''){
			$.ajax({
				url : url,
				dataType : "text",
				type : "get",
				crossDomain : false,
				success : function(data){
					try{
						loadAreaListData(eval('('+data+')'));
					}catch(e){
						loadErrorPage();
					}
				},
				error : function(){
                	loadErrorPage();
				}
			});
		}
	}

// 加载专区各模块
	function loadAreaListData(jsondata){
		var data = jsondata;
		for (var i=0;i<data.length;i++) {
			var dataModel = data[i];
			var type = dataModel.type;
			var list = dataModel.list;
			var label = dataModel.label;
			var mdigest = dataModel.mdigest;
			var mid = dataModel.mid;
			checkEmptyObject(dataModel);
			if(type=="banner"){
				$("#areaModel").append(getFocus(list,i));
				$(".pic").show();
				$(".focus").show();
				setBanner(i);
			}else if(type=="4s"){
				$("#areaModel").append(createAreaChooseTag(list));
			}else {
				getAreaModel(type,label,list,mdigest,mid);
			}
		}
		centerLoadingEnd("content");
	}
// 加载专区各模块 end

/** 获取专区各模块逻辑判断
* type ui样式 music->歌曲列表 暂不支持
* label 模块标题
* list 模块数据
* mdigest 更多 模块类型 5->分类内容 42->pc暂无转分类
* mid 更多 模块id
*/
	function getAreaModel(type,label,list,mdigest,mid){
		var data = list;
		var len = data.length;
		var arr = [];
		var more = '';
		var click = '';
		var csrc = dataCsrc;
		if(label!=""){
			if(mdigest=="5"&&isChannelMv)csrc="曲库->分类";
			csrc +='->'+label;
		}
		var other = '|psrc=分类->'+label+'->|csrc='+csrc.replace(/'/g,"-")+'|bread=-2,5,分类,-2';
		// more 更多
		mdigest=mdigest=="42"?"5":mdigest;
		if(mdigest=="5"){
			click = commonClickString(new Node(mdigest,mid,label,mid,'',other,'area'));
		}else{
			click = commonClickString(new Node(mdigest,mid,label,mid,'',other));
		}
		if(mdigest!=''&&mid!=''){
			more= '<span class="more"><em>|</em><a hidefocus="" href="###" onclick="'+click+'">更多</a></span>';
    	}
    	var areaTitle = label==''?'':'<h2><span class="title">'+label+'</span>'+more+'</h2>';
    	var areaStr = '<div class="areaModelItem">'+areaTitle+'<ul>';
    	//更多end
		for (var i = 0; i < len; i++) {
			var dataItem = data[i];
			var digest = dataItem.digest;
			var listType = dataItem.type;
			checkEmptyObject(dataItem);
			// 内链，APP推广不支持
			if(listType=="ad"||listType=="app"){
				continue;
			}
			if(digest=="9"){
				// 电台
                var radiocsrc = $('body').attr('data-csrc') + '->' + label;
                console.log('radiocsrc:' + radiocsrc);
		        arr[arr.length] = createRadioBlock (dataItem, 'area', 0,i,null,radiocsrc);
		    }else if(digest=="7"){
		    	// MV
		    	var extend = dataItem.extend||'';
		    	if(isChannelMv){
		    		other = '|psrc=MV->'+label+'|csrc='+csrc.replace(/'/g,"-")+'|bread=-2,3,MV,-2';
		    	}
				arr[arr.length] = createMVBlock(dataItem,'area',extend,other,i,label);
		    }else if(type=="music"){
		    	continue;
			}else{
				// 其他（歌手、歌单、专辑。。。）
				if(isChannelMv){
					csrc = "曲库->MV->"+label;
				}
		    	arr[arr.length] = createAreaBlock(dataItem,type,digest,name,csrc);
		    }
		}
		if(arr.join('')==''){
			return;
		}
		$("#areaModel").append(areaStr+arr.join('')+"</ul></div>");
		areaLazyLoad();
		if (radioid) {
			initRadioStatus(parseInt(status,10),radioid);
		}
		centerLoadingEnd("content");
	}
// 获取专区各模块逻辑判断 end

/** 创建焦点图
* jsondata 焦点图数据
* index 焦点图索引（由于专区可以配置多个焦点图）
*/
	function getFocus(jsondata,index){
		var data = jsondata;
		var len = data.length;
		var arr = [];
		var btnarr = [];
		var focusArr = [];
		var oClass = '';
		var oStyle = '';
		if (len == 0) return; 
		for (var i=0; i<len; i++) {
			var obj = data[i];
			var type = obj.type;
			checkEmptyObject(obj);
			// 过滤焦点图 内链 app推广
			if(type=="ad"||type=="app"){
				continue;
			}
			var pic = obj.img||obj.small_img;
			var source = obj.digest;
			var sourceid = obj.id;
			var name = obj.desc;
			var disname = obj.desc;
			var titlename = checkSpecialChar(obj.name,'titlename');
			var csrc = dataCsrc+'->焦点图->'+titlename;
			var id = sourceid;
			var iplayFn = "";
			if (source == 21) id = getValue(id,'id');
			if(source==21&&sourceid.indexOf("?")>-1){
			    sourceid = sourceid+"&from=areafocus";
		    }
		    if(source==7){
		    	sourceid = obj.parms;
		    }else{
		    	iplayFn = 'iPlay(arguments[0],'+source+','+id+',this); return false;';
		    }
			var click = commonClickString(new Node(source,sourceid,checkSpecialChar(disname,"name"),0,obj.extend,"|csrc="+csrc));
			var iplay = '<i onclick="'+iplayFn+'" data-csrc="'+csrc+'" data-ipsrc="专区->焦点图->'+disname+'" class="i_play" title="直接播放"></i>';
			
			i==0 ? oStyle = '' : oStyle = 'display:none';
			i==0 ? oClass = 'current' : oClass = '';
			arr[arr.length] = '<a title="';
			arr[arr.length] = titlename;
			arr[arr.length] = '" href="###" hidefocus style="';
			arr[arr.length] = oStyle;
			arr[arr.length] = '" onclick="';
			arr[arr.length] = click;
			arr[arr.length] = '">';
			arr[arr.length] = iplay;
			arr[arr.length] = '<img src="';
			arr[arr.length] = pic;
			arr[arr.length] = '"></a>';
			btnarr[btnarr.length] = '<a title="';
			btnarr[btnarr.length] = titlename;
			btnarr[btnarr.length] = '" href="###" hidefocus class="';
			btnarr[btnarr.length] = oClass;
			btnarr[btnarr.length] = '"></a>';
		}
		focusArr[focusArr.length] = '<div class="focus area banner';
		focusArr[focusArr.length] = index;
		focusArr[focusArr.length] = '"><div class="pic">';
		focusArr[focusArr.length] = arr.join('');
		focusArr[focusArr.length] = '</div><span class="btn" id="focus_btn">';
		focusArr[focusArr.length] = btnarr.join("");
		focusArr[focusArr.length] = '</span><i class="prev" title="上一个" style="display: none;"></i><i class="next" title="下一个" style="display: none;"></i></div>'
		return focusArr.join("");
	}
// 创建焦点图 end

/** banner控制
* bannerIndex 焦点图索引（由于专区可以配置多个焦点图）
*/
	function setBanner(bannerIndex){
		var index = 0;
		var timer = null;
		var size = $(".banner"+bannerIndex+" .btn a").size();
		$(".banner"+bannerIndex).live("mouseenter",function(){
			clearInterval(timer);
			$(this).children("i").show();
			return false;
		}).live("mouseleave",function(){
			startMove();
			$(this).children("i").hide();
			return false;
		});
		$(".banner"+bannerIndex+" .btn a").live("mouseenter",function(){
			index = $(this).index();
			tab();
			return false;
		}).eq(0).mouseenter();
		$(".banner"+bannerIndex+" .prev").live("click",function(){
			index--;
			if (index < 0) index = size - 1;
			tab();
			return false;
		});
		$(".banner"+bannerIndex+" .next").live("click",function(){
			index++;
			if (index >=  size) index = 0;
			tab();
			return false;
		});	
		startMove();
		function startMove(){
			clearInterval(timer);
			timer = setInterval(function(){
				index++;
				if (index > size-1) index = 0;
				tab();
			},5000);		
		}
		function tab(){
			$(".banner"+bannerIndex+" .pic").children("a").eq(index).show().siblings("a").hide();
			$(".banner"+bannerIndex+" .btn a").eq(index).addClass("current").siblings("a").removeClass("current");		
		}
	}
// banner控制

// 事件绑定
	function objBindFn() {
		// 电台
		$(".br_pic").live("mouseenter",function(){
			if ($(this).hasClass("on")) return;
			$(this).addClass("on");
			var status = $(this).attr("c-status");			
			var someClass = $(this).parent().attr('class');
			var s = someClass.indexOf("radio_");
			var id = someClass.substring(s + 6);
			var stopicon = '';
			var click = '';
			if (status == 1) {
				click = 'stopRadio(arguments[0],\''+id+'\',true);';
				stopicon = '<i title="暂停播放" onclick="" class="radio_pause"></i>';
				$(this).find(".radio_pause").remove();
				$(this).find(".radio_play").remove();
			} else if (status == 2)	{
				click = 'continueRadio(arguments[0],\''+id+'\',true);';
				stopicon = '<i title="继续播放" onclick="" class="radio_start"></i>';
				$(this).find(".radio_start").remove();
				$(this).find(".radio_stop").remove();
			} else {
			    stopicon = '<i title="继续播放" onclick="" class="radio_start"></i>';
			    click = $(this).attr('_onclick');
			}
			$(this).append(stopicon);
			$(this).removeAttr('onclick');
			$(this).unbind("click").bind("click", function () {
			    if (status != 2 && status != 1 && status != 4) {
			        if ($(this).hasClass('on')) {
			            $(this).removeClass('on');
			        }
			    }
			    eval(click);
			});
			return false;
			});
		$(".br_pic").live("mouseleave",function(){
			$(this).removeClass("on");
			$(this).find(".radio_pause").remove();
			$(this).find(".radio_start").remove();
			var status = $(this).attr("c-status");
			if (status == 1) {
				var stopicon = '<img class="radio_play" src="img/radio_play.gif">';
				$(this).find(".radio_play").remove();
				$(this).find(".i_play").hide();
				$(this).append(stopicon);
			} else if (status == 2)	{
				var playicons = '<i class="radio_stop"></i>';
				$(this).find(".radio_stop").remove();
				$(this).find(".i_play").hide();
				$(this).append(playicons);
			}
			return false;
		});
		// 电台 end
	}
// 事件绑定 end

// lazyLoad
	$(window).scroll(function(){
        areaLazyLoad();
	});
	$(window).resize(function(){
	    areaLazyLoad();
	});
	function areaLazyLoad(){
	    $(".lazy").each(function(i){
	        var thisobj = $(this);
	        var top = thisobj.offset().top;
	        if(top <= getContentHeight() ) {
	            thisobj.removeClass("lazy").attr("src",thisobj.attr("data-original"));
	        }
	    });
	}
	function getContentHeight(){
	    var scrollT=document.documentElement.scrollTop||document.body.scrollTop;
	    contentHeight = ($(window).height()+scrollT);
	    return contentHeight;
	}
// lazyload end

// 检测数据异常加载loadErrorPage
function checkEmptyObject(data){
	if($.isEmptyObject(data)||data==null||data==undefined){loadErrorPage();}
}

})();
