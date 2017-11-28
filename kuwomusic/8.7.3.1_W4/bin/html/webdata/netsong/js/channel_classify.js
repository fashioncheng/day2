var currentObj={};
window.onload = function () {
	var url1=decodeURIComponent(window.location.href);
    // param=url1.substring(url1.indexOf('{'),url1.lastIndexOf('}')+1);
    // if(param!='')OnJump(param);
    callClientNoReturn('domComplete');
	centerLoadingStart("content");
	//currentObj = fobj.goldjson;
	var classifyChannelData = getDataByCache('classify-channel');
	if(classifyChannelData){
		try{
			getClassifyListData($.parseJSON(classifyChannelData));
		}catch(e){
			var url = 'http://qukudata.kuwo.cn/q.k?op=query&cont=tree&node=1&pn=0&rn=20&fmt=json&src=mbox&level=3';
			$.ajax({
		        url:url,
		        dataType:'jsonp',
		        crossDomain:false,
				success:function(json){
					getClassifyListData(json);
				}
		    });
		}
	}else{
		var url = 'http://qukudata.kuwo.cn/q.k?op=query&cont=tree&node=1&pn=0&rn=20&fmt=json&src=mbox&level=3';
		//getScriptData(url);
		var d = new Date();
        var time = d.getYear()+d.getMonth()+d.getDate()+d.getHours()+parseInt((d.getMinutes()/20));
        time = ''+d.getYear()+d.getMonth()+d.getDate()+time;
        url = url+"&ttime="+time;
        var classifystrattime=new Date().getTime();
		$.ajax({
	        url:url,
	        dataType:'jsonp',
	        crossDomain:false,
			success:function(json){
				var endtime=new Date().getTime()-classifystrattime;
                realTimeLog("WEBLOG","url_time:"+endtime+";"+"qukutree"+";"+url);
                realShowTimeLog(url,1,endtime,0,0);
				getClassifyListData(json);
			},
			error:function(xhr){
                var endtime=new Date().getTime()-classifystrattime;
                loadErrorPage();
                var httpstatus = xhr.status;
                if(typeof(httpstatus)=="undefined"){
                    httpstatus = "-1";
                }
                var sta = httpstatus.toString();
                realTimeLog("WEBLOG","url_error:"+sta+";qukutree;"+url);
                webLog("请求失败,url:"+url);
                realShowTimeLog(url,0,endtime,sta,0);
            }
	    });
	}

};

$(window).resize(function() {
	iframeObj.refresh();
});
function getClassifyListData(jsondata) {
	var data = jsondata;
	var child = data.child;
	var len = child.length;
	var hotarr = [];
	var arr = [];
	var xia = 0;
	for (var i = 0; i < len; i++) {
		var obj = child[i];
		var pic = obj.pic5 || '';
		var id = obj.id;
		if (obj.pc_extend) {
			if (obj.pc_extend.indexOf('NOTSHOWPC2015') > -1) continue;
		}
		if (id==88092 || id==88077 || id==88102 || id==13 || id==88121 || id==10 || id==15|| id==257335) {//专区入口id=257335 by deng
			if (obj.child.length < 1) continue;
			arr[xia++] = '<div class="classify_wrap"><div class="c_t"></div><div class="c_c">';
			arr[xia++] = '<div class="cc_l"><div class="c_pic"><img onerror="imgOnError(this,60);" width="60" height="60" src="';
			arr[xia++] = pic;
			arr[xia++] = '"></div></div><div class="cc_r">';
			var classifyList = obj.child;
			var classifyLen = classifyList.length;
			var classifyarr = [];
			var index = classifyLen;	
			for (var j = 0; j < classifyLen; j++ ) {
				var cObj = classifyList[j];
				if (cObj.pc_extend) {
					if (cObj.pc_extend.indexOf('NOTSHOWPC2015') > -1) continue;
				}
				var source = cObj.source;
				if (source != 40 && source != 5 && id!=257335) continue;
				
				var name = cObj.name;
				var disname = cObj.disname;
				//if (disname == 'DJ') disname = 'DJ专区';
				var oClass = '';
				var stp = getStringKey(cObj.pc_extend,'STP') || 0;
				var csrc = id==257335?"曲库->分类->"+name+'专区':"曲库->分类->"+name;
				var other = '|psrc=分类->|csrc='+csrc+'|bread=-2,5,分类,-2';
				var digest = id==257335?43:40;
				var sourceId = id==257335?cObj.sourceid:cObj.id;
				var click = commonClickString(new Node(digest,sourceId,name,0,cObj.extend,other));
				if (stp && hotarr.length < 3) {
					hotarr.push(cObj);
					// index--;
					// continue;
				}
				index > 6 ? oClass = 'pt3' : oClass = 'pt22';
				classifyarr[classifyarr.length] = '<span class="';
				classifyarr[classifyarr.length] = oClass;
				classifyarr[classifyarr.length] = '"><a href="###" hidefocus onclick="';
				classifyarr[classifyarr.length] = click;
				classifyarr[classifyarr.length] = '" title="';
				classifyarr[classifyarr.length] = disname;
				classifyarr[classifyarr.length] = '">';
				classifyarr[classifyarr.length] = disname;
				classifyarr[classifyarr.length] = '</a>';
				var newhot = "";
				if (cObj.extend && cObj.extend.indexOf("RECM")>-1) {
					newhot = "<img src='img/jian.gif' />"; 
				} else if (cObj.extend && cObj.extend.indexOf("HOT")>-1){
				    newhot = "<img src='img/re.gif' />"; 
				} else if (cObj.isnew==1){
				    newhot = "<img src='img/xin.gif' />"; 
				} 
				classifyarr[classifyarr.length] = newhot;
				classifyarr[classifyarr.length] = '</span>';
			}
			arr[xia++] = classifyarr.join('');
			arr[xia++] = '</div></div><div class="c_b"></div></div>';
		}
	}
	var hotlistarr = [];
	for (var i = 0; i < hotarr.length; i++) {
		var obj = hotarr[i];
		var source = obj.source
		var id = obj.id;
		var name = obj.name;
		var disname = obj.disname;
		var pic = getStringKey(obj.pc_extend,'PCSORTTOP') || '';
		var other = '|psrc=分类->|bread=-2,5,分类,-2';
		var click = commonClickString(new Node(source,id,name,0,obj.extend,other));
		var oStyle = '';
		i == 2 ? oStyle = 'margin-right:0;' : oStyle = '';
		hotlistarr[hotlistarr.length] = '<a href="###" title="';
		hotlistarr[hotlistarr.length] = disname;
		hotlistarr[hotlistarr.length] = '" hidefocus style="';
		hotlistarr[hotlistarr.length] = oStyle;
		hotlistarr[hotlistarr.length] = '" onclick="';
		hotlistarr[hotlistarr.length] = click;
		hotlistarr[hotlistarr.length] = '"><img src="';
		hotlistarr[hotlistarr.length] = pic;
		hotlistarr[hotlistarr.length] = '" width="230" height="90"></a>';			
	}
	if (hotlistarr.length > 0) {
		//$(".hot_classify").html(hotlistarr.join('')).show();
	}
	$(".kw_classify_list").html(arr.join(''));
	centerLoadingEnd("content");
	iframeObj.refresh();		
}
