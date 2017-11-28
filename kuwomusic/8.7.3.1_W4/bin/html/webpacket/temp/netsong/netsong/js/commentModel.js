/**
 * Created by ping.deng on 16-3-24.评论回复功能 start
 */
var kw_comment_rows = 10;//每页几条
var kw_comment_flagPage = false;//判断点击翻页
var kw_comment_commentNum = 0;//评论数
var gedanId = 0;
var kw_comment_type = '';
var cssFlag = false; //用于加载css文件
var ver = getVersion();
var kid = getUserID("all").kid; 
function init_comment_model(boxname,type,uniq_id){
	gedanId = uniq_id;
	kw_comment_type = type;
	//document.addEventListener('DOMContentLoaded',function(){
		;(function(document){
			var oDiv = document.createElement('div');
			oDiv.id = 'commentArea';
			if(type=='z1'){
				oDiv.className = 'z1_commentArea';
			}
			var oBox = document.querySelector(boxname);
			oBox.appendChild(oDiv);
			oDiv.style.display = "none";
			var comment_other = `<div class="end_box"></div>
								<div class="popup_mask"></div>
								<div class="popup" style="display:none">
									<div class="titleBox">
										<p>删除评论</p>
										<a href="javascript:;" class="close"></a>
									</div>
									<p class="desc">确定要删除评论吗？</p>
									<div class="btnBox">
										<a href="javascript:;" class="cancel">取消</a>
										<a href="javascript:;" class="confirm">确定</a>
									</div>
								</div>`;
			var oBody = document.getElementsByTagName('body')[0];
			var oldStr = oBody.innerHTML;
			oBody.innerHTML = oldStr+comment_other;
			commentModel(uniq_id);
		})(document);

	//});
}

// 评论模块
function commentModel(strsid){
	var checkReply = '';//用于判断输入框中是否为回复用户名：
    var commentId = '';//评论id
    // 加载输入框评论按钮
	$("#commentArea").html(
		'<p class="title_">留言评论<span class="num">0条</span></p>'+
			'<div id="message">'+
				'<div class="textBox">'+
					'<textarea id="messageCon" class="scrollBox"></textarea>'+
					'<span class="word">还可以输入<span class="length">300</span>个字</span>'+
				'</div>'+
				'<a href="javascript:;" id="messageBtn">评论</a>'+
				'<span class="emotion"></span>'+
				'<div class="faceBox scrollBox"></div>'+
			'</div>'+
			'<div class="listBox">'+
				'<h4>精彩评论</h4>'+
				'<div id="rec_list"></div>'+
			'</div>'+
			'<div class="listBox">'+
				'<h4>最新评论</h4>'+
				'<div id="list"></div>'+
			'</div>'+
		'<div class="pageComment"></div>'
	); 
	//加载评论列表
	loadRecCommentList(kw_comment_type,1,strsid);
	//loadCommentList(kw_comment_type,1);
	//点赞
	var praiseFlag = false;
    $(".praise").die("click").live("click",function(ev){
    	var uid = getUserID("uid");
    	if(uid==0){
	        callClientNoReturn("UserLogin?src=login");
            
            ev.stopPropagation();            
	        return false;
		};
    	if(!praiseFlag){
    		praiseFlag = true;
    		var _this = $(this);
	        var num = _this.html();
	        var flag = eval(_this.attr("data-flag"));
	        var box = _this.parents(".box")
	        var cId = box.attr("data-id");
	        var praiseUrl = '';
	        num = num==''?0:num;
	        if(!flag){
	        	praiseUrl = "http://comment.kuwo.cn/com.s?type=click_like&uid="+uid+"&cid="+cId+"&sid="+gedanId+"&digest="+kw_comment_type+"&f=web&prod="+ver+"&devid="+kid;
	        }else{
	        	praiseUrl = "http://comment.kuwo.cn/com.s?type=cancel_like&uid="+uid+"&cid="+cId+"&sid="+gedanId+"&digest="+kw_comment_type+"&f=web&prod="+ver+"&devid="+kid;
	        }
	        $.ajax({
	        	type:"get",
	        	url:praiseUrl,
	        	dataType:"json",
	        	success:function(data){
	        		if(!flag){
			        	_this.html(parseInt(num)+1);
			        	_this.attr("data-flag","true");
			        	_this.addClass('praised');
			        }else{
			        	_this.html((parseInt(num)-1)<=0?'':(parseInt(num)-1));
			        	_this.attr("data-flag","false");
			        	_this.removeClass('praised');
			        }
			        praiseFlag = false;
	        	},
				error:function(){
					praiseFlag = false;
				}
	        });
    	}
        ev.stopPropagation();            
	    return false;
    });
	//回复
    $(".reply").die("click").live("click",function(ev){
        var message = $('#messageCon');
        var content = $(this).parents(".contentComment");
        var name = content.find(".user a").html()+'：';
        commentId = $(this).parents(".box").attr("data-id");
        checkReply = '回复'+name;
        $('#message').attr('data-memo',checkReply);
        $('#message').show();
        //$(".length").html(300-checkReply.length);
        message.val(checkReply);
        message.focus();
        message.attr("data-reply","true");
        $('.closeCommentBtn').show();
        ev.stopPropagation();
        return false;
        
    });
	//评论按钮
    $('#messageBtn').die("click").live("click",function(ev){
    	var uid = getUserID("uid");
    	if(uid==0){
	        callClientNoReturn("UserLogin?src=login");
            ev.stopPropagation();
	        return false;
		};
    	var messageCon = $('#messageCon').val().replace(/(^\s+)|(\s+$)/g,"");//评论内容去除前后空格
    	var domStr = '';
    	var isReply = eval($('#messageCon').attr("data-reply"));//是否为回复  true为回复  false为评论
    	var dataCon = '';
    	var msgUrl = '';
    	var currentPage = $(".pageComment .current").html()||'1';
    	if(isReply){
    		var replyCon = messageCon.substring(messageCon.indexOf('：')+1).replace(/(^\s+)|(\s+$)/g,"");//回复内容去除前后空格;
    		if(replyCon==''){
    			$('#messageCon').val(checkReply);
				$(".length").html(300-checkReply.length);
    			//callClient("ShowTips?msg=内容不能为空！"); 
    			show_end_box('内容不能为空噢');
    			return;
    		}else if(replyCon.length<5){
    			//callClient("ShowTips?msg=评论不能少于5个字！");
    			show_end_box('评论不能少于5个字噢');
    			return;
    		}
    		dataCon = replyCon;
    		$('#messageCon').attr("data-reply","false");
    		msgUrl = "http://comment.kuwo.cn/com.s?type=post_comment&uid="+uid+"&digest="+kw_comment_type+"&sid="+gedanId+"&reply="+commentId+"&f=web&prod="+ver+"&devid="+kid;
    	}else{
    		if(messageCon==''){
    			$('#messageCon').val('');
				$(".length").html(300);
    			//callClient("ShowTips?msg=内容不能为空！");
    			show_end_box('内容不能为空噢');
                 ev.stopPropagation();
    			return;
    		}else if(messageCon.length<5){
    			//callClient("ShowTips?msg=评论不能少于5个字！");
    			show_end_box('评论不能少于5个字噢');
                 ev.stopPropagation();
    			return;
    		}
    		dataCon = messageCon;
    		msgUrl = "http://comment.kuwo.cn/com.s?type=post_comment&uid="+uid+"&digest="+kw_comment_type+"&sid="+gedanId+"&f=web&prod="+ver+"&devid="+kid;
    	}
		$.ajax({
			type:"post",
			dataType:"json",
			data: dataCon,
			url:msgUrl,
			success:function(data){
				var info = data.info;
				if(info==undefined){
					//callClient("ShowTips?msg=评论太频繁了，请稍后重试！");
					show_end_box('评论太频繁了，休息一会吧!');
					isReply = isReply?$('#messageCon').attr("data-reply","true"):$('#messageCon').attr("data-reply","false");
				}else{
					//callClient("ShowTips?msg=评论成功！");
					show_end_box('评论成功!');
					if($("#list").hasClass("noComment"))$("#list").html("").removeClass("noComment");
					if(currentPage=='1'){
			    		if(isReply){
				    		domStr = createReplyBox(info);
				    	}else{
				    		domStr = createCommentBox(info);
				    	}
			    		$("#list").prepend(domStr);
			    		if($("#list").children().length==kw_comment_rows+1){
			    			setTimeout(function(){
			    				loadCommentList(kw_comment_type,1);
			    			},500);
			    		}
			    	}else{
		    			setTimeout(function(){
		    				loadCommentList(kw_comment_type,1);
		    			},500);
			    	}
			    	$('#message').attr('data-memo','');
			    	$('#messageCon').val('');
					$(".length").html(300);
					kw_comment_commentNum = parseInt(kw_comment_commentNum)+1;
                    var tabNum = kw_comment_commentNum > 99 ? "99+" : kw_comment_commentNum;
                    $(".tabNum").html(tabNum);
					$("#commentArea .num").html(kw_comment_commentNum+'条');
				}
			},
			error:function(){
				//callClient("ShowTips?msg=评论失败，请稍后重试！"); 
				show_end_box('评论失败，请稍后重试!');
			}
		});
        
        ev.stopPropagation();
        return false;
    });
	//字数判断    
    $("#messageCon").live("keydown keyup blur focus",function (){
    	var _this = $(this);
        var val = _this.val();
        var memo = $('#message').attr('data-memo');
        var len = val.length;
        var word = $(".length");
        var message = $("#messageCon");
        if(checkReply!=''&&val.substring(0,checkReply.length)==checkReply){
        	message.attr("data-reply","true");
        }else{
        	message.attr("data-reply","false");
        }
        if(val.indexOf(memo)>-1){
        	if(len-memo.length>300){
        		var tmp = val.substring(memo.length,300+memo.length);
        		_this.val(memo+tmp);
        	}
        	var num = (300-(len-memo.length))<0?0:300-(len-memo.length);
        }else{
        	if(len>300)_this.val(val.substring(0,300));
        	var num = 300-len<0?0:300-len;
        }
        word.html(num);
    });
	// 删除评论显示确定删除弹窗
	$(".delete").die("click").live("click",function(){
		var body_h = $('body').height();
		$('.popup_mask').height(body_h+20).show();
		$('.popup').show();

		var delEleId = $(this).parents(".box").attr('data-id');
		var delEleIndex = $(this).parents(".box").index();
		$('.popup .confirm').attr('data-delid',delEleId);
		$('.popup .confirm').attr('data-index',delEleIndex);
		return ;
	});
	// 取消按钮和关闭按钮的逻辑
	$(".popup .close,.popup .cancel,.popup .confirm").die("click").live("click",function(){
		$(".popup").hide();
		$('.popup_mask').hide();
	});
	// 确定按钮逻辑
	$('.popup .confirm').die("click").live("click",function(ev){
		var uid = getUserID("uid");
		var delId = $(this).attr("data-delid");
		var delEleIndex = $(this).attr("data-index");
		var currentPage = $(".pageComment .current").html()||'1';
		$.ajax({
			url:"http://comment.kuwo.cn/com.s?type=del_scomment&digest="+kw_comment_type+"&sid="+gedanId+"&uid="+uid+"&cid="+delId+"&f=web&prod="+ver+"&devid="+kid,
			type:"get",
			dataType:"json",
			success:function(data){
				if(data.result=='error'){
					show_end_box('删除失败，请稍后重试!');
                    ev.stopPropagation();                    
					return false;
				}
				if(currentPage==1&&$("#list").children().length<=kw_comment_rows){
					$('#list .box').eq(delEleIndex).remove();
					kw_comment_commentNum = parseInt(kw_comment_commentNum)-1;
					if(kw_comment_commentNum==0){
						$("#list").html("恭喜你，快来抢沙发吧！").addClass("noComment");
						$("#list").prev().hide();
					}
					$("#commentArea .num").html(kw_comment_commentNum+'条');
					var tabNum = kw_comment_commentNum > 99 ? "99+" : kw_comment_commentNum;
          			$(".tabNum").html(tabNum);
				}else{
					loadCommentList(kw_comment_type,currentPage);
				}
			},
			error:function(){
				//callClient("ShowTips?msg=删除失败，请稍后重试！");
				show_end_box('删除失败，请稍后重试!');
			}
		});
        
        ev.stopPropagation();
        return false;
	});
	
	//删除按钮回复按钮的过滤
	$(".box").live("mouseenter",function(){
		var uid = getUserID("uid");
		var _this = $(this);
		var theUid = _this.attr("data-uid");
		var delete_ = _this.find(".delete");
		var delLine = _this.find(".delLine");
		var reply = _this.find(".reply");
		_this.find(".info_ span").show();
		if(uid==theUid){
			reply.show();
			delete_.show();
			delLine.show();
		}else{
			reply.show();
			delete_.hide();
			delLine.hide();
		}
	});
	$(".box").live("mouseleave",function(){
		var _this = $(this);
		var delete_ = _this.find(".delete");
		_this.find(".info_ span").hide();
		_this.find(".reply").hide();
		delete_.hide();
	});
	//表情
	createFace();
	var faceShow = false;
	var faceBox = $(".faceBox");
	$(".emotion").die("click").live("click",function(ev){
		if(!faceShow){
			faceBox.show();
			faceShow=true;
		}else{
			faceBox.hide();
			faceShow=false;
		}
        ev.stopPropagation();
		return false;
	});
	$(document).live("click",function(){
		faceBox.hide();
		faceShow=false;
	});
	$(".faceBox img").die("click").live("click",function(ev){
		var messageCon = $("#messageCon").val();
		faceBox.hide();
		faceShow = false;
		$("#messageCon").val(messageCon+= "[" + this.alt + "]").focus();
        ev.stopPropagation();
        return false;
	});
	//翻页
	$(".pageComment a").die("click").live("click",function(){
		var oClass = $(this).attr("class");
		faceBox.hide();
		faceShow=false;
		if (oClass.indexOf("no") > -1) return;
		kw_comment_flagPage = true;
		var pn = 1;
		var goPnNum = $(this).html();
		if (goPnNum == '上一页') {
			pn = parseInt($(".pageComment .current").html()) - 1;
		} else if (goPnNum == '下一页'){
			pn = parseInt($(".pageComment .current").html())+1;
		} else {
			pn = parseInt($(this).html());
		}
		commentPageNum = pn;
		if(pn == 1){
			loadRecCommentList(kw_comment_type,pn);
		}else{
			$('#rec_list').html('');
			$('.listBox').eq(0).hide();
			loadCommentList(kw_comment_type,pn);
		}
	});
}
// 加载精彩评论
function loadRecCommentList(digest,pn,strgedanId){
    
    var strid;
    if( strgedanId != 'undefined' && strgedanId != '' && strgedanId != null){
        strid = strgedanId;
        gedanId = strgedanId;
    }else{
        strid = gedanId;
    }
    
	var userId = getUserID("uid");//获取用户uid
    var url = "http://comment.kuwo.cn/com.s?type=get_rec_comment&uid="+userId+"&digest="+digest+"&sid="+strid+"&page="+pn+"&rows="+kw_comment_rows+"&f=web&prod="+ver+"&devid="+kid;
	$.ajax({
		type:"get",
		dataType:"json",
		url:url,
		success:function(data){
			var rows = 20;
			if(data.rows){
				//清空评论列表
				$("#rec_list").html('').show();
				var datarows = data.rows.length;
				for(var i=0;i<datarows;i++){
					if(i == datarows-1){
						$("#rec_list").append(createReplyBox(data.rows[i],true));
					}else{
						$("#rec_list").append(createReplyBox(data.rows[i]));
					}
					if(eval(data.rows[i].is_like)){
						$("#rec_list .praise").eq(i).addClass('praised');
					}
				}
				$('.listBox').eq(0).show();
			}else{
				$(".listBox").eq(0).hide();
			}
			loadCommentList(kw_comment_type,1,rows,strgedanId);
			if(!cssFlag){
				//加载css文件
				var oHead = document.getElementsByTagName('head')[0];
				var oCssLink = document.createElement('link');
				oCssLink.href = 'css/comm_COMMENT.css';
				oCssLink.rel = 'stylesheet';
				oCssLink.type = 'text/css';
				oHead.appendChild(oCssLink);
				$("#commentArea").show();
				cssFlag = true;
			}
		},
		error:function(e){
            $(".commentBox").html('');
            console.log($(".commentBox").html());
			$(".commentBox").append('<div id="l_loadfail" style="display:block; height:100%; padding:0; top:0;text-align:center"><div class="loaderror"><img style="margin:60px 0 10px 0" src="img/unlogin_img.png" /><p style="margin-top:10px;">网络似乎有点问题 , <a hidefocus href="###" onclick="window.location.reload();return false;">点此刷新页面</a></p></div></div>')
			var httpstatus = e.status;
		    if(typeof(httpstatus)=="undefined"){
			    httpstatus = "-1";
		    }
		    var sta = httpstatus.toString();
		    var errorStr = e.responseText;
		    if(httpstatus ==200){
		    	realShowTimeLog(url,0,1,errorStr,0);
		    }else{
		    	realShowTimeLog(url,0,1,sta,0);
		    }
		}
	});
}
// 加载评论列表
function loadCommentList(digest,pn,rows,strgedanId){
    
    kw_comment_commentNum = 0;
    var strid;
    if( strgedanId != 'undefined' && strgedanId != '' && strgedanId != null){
        strid = strgedanId;
        gedanId = strgedanId;
    }else{
        strid = gedanId;
    }
	var userId = getUserID("uid");//获取用户uid
	var customRows = 20;
	var createRows = rows || 20;
    var url = "http://comment.kuwo.cn/com.s?type=get_comment&uid="+userId+"&digest="+digest+"&sid="+strid+"&page="+pn+"&rows="+customRows+"&f=web&prod="+ver+"&devid="+kid;
	$.ajax({
		type:"get",
		dataType:"json",
		url:url,
		success:function(data){
			if(data.rows){
				//清空评论列表
    			$("#list").html("");
				var pageStrCom = createPage(parseInt(data.totalPage), parseInt(data.currentPage));
				$(".pageComment").html(pageStrCom).show();
				var rowsLen = data.rows.length;
				if(rowsLen>=createRows){
					rowsLen = createRows;
				}
				for(var i=0;i<rowsLen;i++){
					if(i == rowsLen-1){
						$("#list").append(createReplyBox(data.rows[i],true));
					}else{
						$("#list").append(createReplyBox(data.rows[i]));
					}
					if(eval(data.rows[i].is_like)){
						$("#list .praise").eq(i).addClass('praised');
					}
				}
				kw_comment_commentNum = data.total;
                var tabNum = kw_comment_commentNum > 99 ? "99+" : kw_comment_commentNum;
                $(".tabNum").html(tabNum);
				$("#commentArea .num").html(kw_comment_commentNum+'条');
				if(kw_comment_flagPage)$(window).scrollTop($(".title_").position().top-10);
			}else{
				$("#list").html("恭喜你，快来抢沙发吧！").addClass("noComment");
				$("#list").prev().hide();
			}
			if(!cssFlag){
				//加载css文件
				var oHead = document.getElementsByTagName('head')[0];
				var oCssLink = document.createElement('link');
				oCssLink.href = 'css/comm_COMMENT.css';
				oCssLink.rel = 'stylesheet';
				oCssLink.type = 'text/css';
				oHead.appendChild(oCssLink);
				$("#commentArea").show();
				cssFlag = true;
			}

		},
		error:function(e){
			var httpstatus = e.status;
		    if(typeof(httpstatus)=="undefined"){
			    httpstatus = "-1";
		    }
		    var sta = httpstatus.toString();
		    var errorStr = e.responseText;
		    if(httpstatus ==200){
		    	realShowTimeLog(url,0,1,errorStr,0);
		    }else{
		    	realShowTimeLog(url,0,1,sta,0);
		    }
		}
	});
} 
//创建评论模块
function createCommentBox(jsondata){
	var likeNum = jsondata.like_num==0?'':jsondata.like_num;
	var url = "http://www.kuwo.cn/pc/my/index?uid=" +getUserID("uid")+"&vuid="+jsondata.u_id;
	var timeSlot = timeFormat(jsondata.time);
	var userName = decodeURIComponent(jsondata.u_name.replace(/\+/g,"%20"));
	if(userName=="")userName="酷小我_"+parseInt(Math.random()*10000);
    return '<div class="box" data-id="'+jsondata.id+'" data-uid="'+jsondata.u_id+'">'+
    	   		'<div class="picBox">'+
					'<a href="javascript:;" onclick="jumpToOtherUser(\''+url+'\')"><img class="head" src="'+jsondata.u_pic+'" onerror="imgOnError(this,60)" alt="" /></a>'+
				'</div>'+
                '<div class="contentComment">'+
                    '<div class="main">'+
                        '<p class="replyBox">'+
                            '<span class="user"><a href="javascript:;" onclick="jumpToOtherUser(\''+url+'\')">'+userName+'</a></span>'+
                            '<span class="time">'+timeSlot+'</span>'+
                            '<span class="replyCon">'+filterFace(jsondata.msg)+'</span>'+
                        '</p>'+
                    '</div>'+
                    '<div class="info_">'+
                        '<a class="praise" data-flag="'+jsondata.is_like+'" href="javascript:;">'+likeNum+'</a>'+
                        '<span></span>'+
	                    '<a class="reply" href="javascript:;">回复</a>'+
	                    '<span class="delLine"></span>'+
	                    '<a class="delete" href="javascript:;">删除</a>'+
                    '</div>'+
                '</div>'+
            '</div>';
}
//创建回复模块	
function createReplyBox(info,isLast){
	var reply = info.reply;
	var replyStr = '';
	var likeNum = info.like_num==0?'':info.like_num;
	var time = getUnixTime(info.time);
	var timeSlot = timeFormat(time);
	var userName = decodeURIComponent(info.u_name.replace(/\+/g,"%20"));
	if(userName=="")userName="酷小我_"+parseInt(Math.random()*10000);
	var url = "http://www.kuwo.cn/pc/my/index?uid=" +getUserID("uid")+"&vuid="+info.u_id;
	if(reply!=undefined){
		var replyUrl = "http://www.kuwo.cn/pc/my/index?uid=" +getUserID("uid")+"&vuid="+reply.u_id;
		replyStr = '<div class="commentBox">'+
	                    '<p class="commentCon"><span class="userComment"><a href="javascript:;" onclick="jumpToOtherUser(\''+replyUrl+'\')">@'+decodeURIComponent(reply.u_name.replace(/\+/g,"%20"))+'</a>：</span>'+filterFace(reply.msg)+'</p>'+
	                '</div>';
	}else{
		replyStr='';
	}
	var boxclass = 'box';
	if(isLast){
		boxclass = 'box boxLast';
	}
    return '<div class="'+boxclass+'" data-id="'+info.id+'" data-uid="'+info.u_id+'">'+
				'<div class="picBox">'+
					'<a href="javascript:;" onclick="jumpToOtherUser(\''+url+'\')"><img class="head" src="'+info.u_pic+'" onerror="imgOnError(this,60)" alt="" /></a>'+
				'</div>'+
                '<div class="contentComment">'+
                    '<div class="main">'+
                        '<p class="replyBox">'+
                            '<span class="user"><a href="javascript:;"  onclick="jumpToOtherUser(\''+url+'\')">'+userName+'</a></span>'+
                            '<span class="time">'+timeSlot+'</span>'+
                            '<span class="replyCon">'+filterFace(info.msg)+'</span>'+
                        '</p>'+
                    '</div>'+
                    replyStr+
                    '<div class="info_">'+
                        '<a class="praise" data-flag="'+info.is_like+'" href="javascript:;">'+likeNum+'</a>'+
                        '<span></span>'+
	                    '<a class="reply" href="javascript:;">回复</a>'+
	                    '<span class="delLine"></span>'+
	                    '<a class="delete" href="javascript:;">删除</a>'+
                    '</div>'+
                '</div>'+
            '</div>';
}
//日期处理相关
function getUnixTime(dateStr){
    var newstr = dateStr.replace(/-/g,'/'); 
    var date =  new Date(newstr); 
    var time_str = date.getTime().toString();
    return time_str.substr(0, 10);
}
function timeFormat(time) {
	if(!time)return false;
  	var now, diff, ret, t, y, m, d, h, i, s;
  	// 当前时间戳
  	now = Date.parse(new Date())/1000;
  	// 差值
  	diff = now - time;
  	// 设置时间
  	t = new Date();
  	t.setTime(time*1000);
  	y = t.getFullYear();
  	m = t.getMonth()+1;
  	d = t.getDate();
  	h = t.getHours();
  	i = t.getMinutes();
  	s = t.getSeconds();
  	m = m > 9 ? m : '0' + m;
  	d = d > 9 ? d : '0' + d;
  	h = h > 9 ? h : '0' + h;
  	i = i > 9 ? i : '0' + i;
  	s = s > 9 ? s : '0' + s;
  	// 开始判断
  	if(diff > (60*60*24)){
    	ret = y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
  	}else if(diff > (60*60)){
    	ret = parseInt(diff/3600) + "小时前";
  	}else if(diff > 60){
    	ret = parseInt(diff/60) + "分钟前";
  	}else{
    	ret = "刚刚";
  	}
  	return ret;
}
//表情相关
function filterFace(msg) {
	//先过滤html标签
    if(msg.match(/<[^>]+>/g)){
    	msg = msg.replace(/</g,'').replace(/>/g,'');
    }
    msg = msg.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,'[微笑]');
    //后替换成表情
    var filterMsg = msg.replace(/\[[\u4e00-\u9fa5]+\]/g,
    function(faceName){
        faceName = faceName.substring(1, faceName.length - 1);
        if(emojiConfig[faceName]){
        	return '<img src="img/comment/face/' + emojiConfig[faceName] + ".png" + '" />';
        }else{
        	return '['+faceName+']';
        }
    });
    return filterMsg;
}
function createFace(){
	var faceStr = '';
	for(var item in emojiConfig){
        faceStr += '<img src="img/comment/face/'+emojiConfig[item]+'.png" title="'+item+'" alt="'+item+'" />'
    }
    $(".faceBox").html(faceStr)
}

function show_end_box(msg){
	if($('.end_box').css('display')=='block'){
		return;
	}
	$('.end_box').show().html(msg);
	setTimeout(function(){
		$('.end_box').hide().html('');
	},2000);
}
//评论回复功能 end
// 创建页码
function createPage(total, currentPg) {
    var pageHtml = '';
    if (total > 1) {
        if (currentPg != 1) {
            pageHtml += '<a hidefocus href="###" class="next">上一页</a>';
        } else {
            pageHtml += '<a hidefocus href="###" class="nonext">上一页</a>';
        }
        pageHtml += '<a hidefocus  href="###" ' + (currentPg == 1 ? 'class="current"' : 'class=""') + '>1</a>';
        if (currentPg > 4) pageHtml += '<span class="point">...</span>';
        
        for (var i = (currentPg >= 4 ? (currentPg - 2) : 2) ; i <= (currentPg + 2 >= total ? (total - 1) : (currentPg + 2)) ; i++) {
            if (currentPg == i) {
                pageHtml += '<a hidefocus href="###" class="current">' + i + '</a>';
            } else {
                pageHtml += '<a hidefocus href="###" class="">' + i + '</a>';
            }
        }
        if (currentPg + 3 < total) pageHtml += '<span class="point">...</span>';
        if (total != 1) pageHtml += '<a hidefocus href="###" ' + (currentPg == total ? 'class="current"' : 'class=""') + '>' + total + '</a>';
        if (currentPg != total) {
            pageHtml += '<a hidefocus href="###" class="prev">下一页</a>';
        } else {
            pageHtml += '<a hidefocus href="###" class="noprev">下一页</a>';
        }
    }else{
        pageHtml = '';
    }
    return pageHtml;
}

var emojiConfig = {//表情对应表
	"微笑" : "emoji_1",
	"哭" : "emoji_2",
	"难过" : "emoji_3",
	"发火" : "emoji_4",
	"奇怪" : "emoji_5",
	"尴尬" : "emoji_6",
	"可爱" : "emoji_7",
	"害怕" : "emoji_8",
	"囧" : "emoji_9",
	"闭嘴" : "emoji_10",
	"脸红" : "emoji_11",
	"亲亲" : "emoji_12",
	"喜欢" : "emoji_13",
	"睡觉" : "emoji_14",
	"大哭" : "emoji_15",
	"使坏" : "emoji_16",
	"嘲笑" : "emoji_17",
	"晕" : "emoji_18",
	"大爱" : "emoji_19",
	"鄙视" : "emoji_20",
	"奋斗" : "emoji_21",
	"汗" : "emoji_22",
	"不屑" : "emoji_23",
	"吐" : "emoji_24",
	"挖鼻孔" : "emoji_25",
	"拜托" : "emoji_26",
	"美味" : "emoji_27",
	"害羞" : "emoji_28",
	"期待" : "emoji_29",
	"困" : "emoji_30",
	"辩论" : "emoji_31",
	"拜拜" : "emoji_32",
	"糗大了" : "emoji_33",
	"爱钱" : "emoji_34",
	"书呆子" : "emoji_35",
	"沉默" : "emoji_36",
	"委屈" : "emoji_37",
	"大叫" : "emoji_38",
	"打你" : "emoji_39",
	"惊讶" : "emoji_40",
	"耍酷" : "emoji_41",
	"烧香" : "emoji_42",
	"卖萌" : "emoji_43",
	"羞羞" : "emoji_44",
	"藐视" : "emoji_45",
	"高兴" : "emoji_46",
	"疑问" : "emoji_47",
	"大笑" : "emoji_48",
	"开心" : "emoji_49",
	"骷髅" : "emoji_50",
	"群众" : "emoji_51",
	"合作" : "emoji_52",
	"挑衅" : "emoji_53",
	"棒" : "emoji_54",
	"差" : "emoji_55",
	"剪刀手" : "emoji_56",
	"可以" : "emoji_57",
	"客气" : "emoji_58",
	"嘴唇" : "emoji_59",
	"西瓜" : "emoji_60",
	"苹果" : "emoji_61",
	"红心" : "emoji_62",
	"小狗" : "emoji_63",
	"小猫" : "emoji_64",
	"礼物" : "emoji_65",
	"鲜花" : "emoji_66",
	"残花" : "emoji_67",
	"咖啡" : "emoji_68",
	"米饭" : "emoji_69",
	"胶囊" : "emoji_70",
	"菜刀" : "emoji_71",
	"炸弹" : "emoji_72",
	"粑粑" : "emoji_73",
	"心" : "emoji_74",
	"心碎" : "emoji_75",
	"花" : "emoji_76",
	"树叶" : "emoji_77",
	"日历" : "emoji_78",
	"小熊" : "emoji_79",
	"蛋糕" : "emoji_80",
	"太阳" : "emoji_81",
	"彩虹" : "emoji_82",
	"皇冠" : "emoji_83",
	"雪花" : "emoji_84",
	"医药箱" : "emoji_85",
	"音乐" : "emoji_86",
	"汽车" : "emoji_87",
	"红酒" : "emoji_88",
	"画画" : "emoji_89",
	"飞机" : "emoji_90",
	"猪头" : "emoji_91",
	"创可贴" : "emoji_92",
	"信" : "emoji_93",
	"足球" : "emoji_94",
	"蜡烛" : "emoji_95",
	"星星" : "emoji_96",
	"月亮" : "emoji_97",
	"闪电" : "emoji_98",
	"杯子" : "emoji_99",
	"黄钻" : "emoji_100",
	"照相" : "emoji_101",
	"滑冰" : "emoji_102",
	"下雨" : "emoji_103",
	"手套" : "emoji_104",
	"蘑菇" : "emoji_105",
	"章鱼" : "emoji_106",
	"梨" : "emoji_107",
	"马" : "emoji_108",
	"云" : "emoji_109",
	"威武" : "emoji_110",
};