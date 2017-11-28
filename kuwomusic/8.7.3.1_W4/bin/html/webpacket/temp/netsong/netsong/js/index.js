//全局变量获取
var VipObject = { isVip: false };//vip标志
var uid = 0;
var kid = 0;
var username = "";
var islogin = false; //是否登录初始化
var levelArray = []; //vip登录相关信息
var distarray={//地理信息 其中1、3、24为北上广 其它无用
	"%B1%B1%BE%A9":1,
	"%CC%EC%BD%F2":2,
	"%B9%E3%B6%AB":3,
	"%B8%A3%BD%A8":4,
	"%BC%AA%C1%D6":5,
	"%BA%A3%C4%CF":6,
	"%B9%E3%CE%F7":7,
	"%D5%E3%BD%AD":8,
	"%C9%BD%B6%AB":9,
	"%C4%FE%CF%C4":10,
	"%BA%DA%C1%FA%BD%AD":11,
	"%D4%C6%C4%CF":12,
	"%C9%BD%CE%F7":13,
	"%BA%FE%B1%B1":14,
	"%C9%C2%CE%F7":15,
	"%B8%CA%CB%E0":16,
	"%D6%D8%C7%EC":17,
	"%BA%D3%B1%B1":18,
	"%BD%AD%CB%D5":19,
	"%B0%B2%BB%D5":20,
	"%CB%C4%B4%A8":21,
	"%BA%D3%C4%CF":22,
	"%C7%E0%BA%A3":23,
	"%C9%CF%BA%A3":24,
	"%CE%F7%B2%D8":25,
	"%C4%DA%C3%C9%B9%C5":26,
	"%BD%AD%CE%F7":27,
	"%D0%C2%BD%AE":28,
	"%B9%F3%D6%DD":29,
	"%C1%C9%C4%FE":30,
	"%BA%FE%C4%CF":31
};
var startTime = new Date().getTime();

// radio use
var BroadcastSlide,
	radio_slideBoxs,
	hitListIndex= 0,
	timeSetInterval= null,
	radio_ClientHeight=document.documentElement.clientHeight,
	radio_BoxTop = 850;
	
$(function(){
	callClientNoReturn('domComplete');
	centerLoadingStart();

	//getIndexData();
	callCreateIndexListFn();
	getRcmRadioData();
	getRcmPlaylistData();
	
	radioBind();
	rcmBind();
	
	//  radio use
	setTimeout(function(){
		radio_BoxTop = document.getElementsByClassName('indexRadioBox')[0].offsetTop;
	},1000);
	BroadcastSlide = document.getElementById('BroadcastSlide'),
	hitListIndex= 0;
	window.onscroll = radio_scrollFn;
	
	try{
		getRadioStation();			
	}catch(e){
		console.error('广播电台message Data Error');
	}

	// 加载完成 发送日志确认此模板为白领模板
	var oDate = new Date();
	var month = toDou(oDate.getMonth()+1);
	var day = toDou(oDate.getDate());
	var date = ''+month+day;
	var ISWCCache = getDataByCache('ISWC'+date);
	if(!ISWCCache){
		realTimeLog("MUSICLISTEN_TEST","ISWC:1");
	}
	saveDataToCache('ISWC'+date,'todaysave');
});


//非个性化部分开始
function callCreateIndexListFn(){
	var indexCache = getDataByCache('indexdatacache');
	var defIndexCache = '{"data":{"huoDong":{"cacheTime":"2016-06-07 14:30:00","list":[{"id":"0","source":"17","name":"B1A4北京演唱会","pic":"http://img4.kwcdn.kuwo.cn/star/upload/4/4/1464254608100_.jpg","sourceId":"http://weibo.com/1738434147/Dxk4ytLp6?from=page_1006061738434147_profile&wvr=6&mod=weibotime&type=comment#_rnd1464253779679"},{"id":"0","source":"17","name":"乐范第二季于湉专场","pic":"http://img3.kwcdn.kuwo.cn/star/upload/7/7/1465269969911_.jpg","sourceId":"http://weibo.com/1738434147/DyvRTnJ6F?from=page_1006061738434147_profile&wvr=6&mod=weibotime"},{"id":"0","source":"17","name":"iKON巡演深圳站","pic":"http://img4.kwcdn.kuwo.cn/star/upload/7/7/1463997539591_.jpg","sourceId":"http://weibo.com/1738434147/DwRHw1XS9?ref=home&type=comment#_rnd1463991416472"},{"id":"0","source":"17","name":"“I Do致青春”音为走心演唱会","pic":"http://img4.kwcdn.kuwo.cn/star/upload/3/3/1464144488019_.jpg","sourceId":"http://huodong.kuwo.cn/huodong/st/newactpage?actId=325"},{"id":"0","source":"17","name":"《X战警·天启》免费看！","pic":"http://img1.kwcdn.kuwo.cn/star/upload/1/1/1464605168833_.jpg","sourceId":"http://weibo.com/1738434147/DxWojDxux?ref=home&type=comment#_rnd1464602653471"}]},"hotMv":{"cacheTime":"2016-06-07 14:30:00","list":[{"inFo":"仙 瓜 K 漏-最初的梦想","albumId":"551684","disName":"祝全体考生考试加油","extend":"|MUSIC_COUNT=0|","isNew":0,"pic":"http://img1.kwcdn.kuwo.cn/star/upload/10/10/1465267199306_.jpg","sourceId":"%E6%9C%80%E5%88%9D%E7%9A%84%E6%A2%A6%E6%83%B3;%E4%BB%99%20%E7%93%9C%20K%20%E6%BC%8F;%E3%80%90%E6%AD%8C%E5%8D%95%E3%80%91%E6%BD%AE%E8%A7%86%E9%A2%91;3707016064;2032809235;MUSIC_7104631;;;;1470561960;282426755;MV_724004;0","nodeId":0,"source":7,"isPoint":"0","artistId":"289194","mutiVer":"0","name":"祝全体考生考试加油","pay":"0","newCount":0},{"inFo":"瞬间爆炸型LowSing-【全明星】Boom瞎卡拉卡","albumId":"552790","disName":"Boom瞎卡拉卡","extend":"|MUSIC_COUNT=0|","isNew":0,"pic":"http://img2.kwcdn.kuwo.cn/star/upload/7/7/1465267135591_.jpg","sourceId":"%E3%80%90%E5%85%A8%E6%98%8E%E6%98%9F%E3%80%91Boom%E7%9E%8E%E5%8D%A1%E6%8B%89%E5%8D%A1;%E7%9E%AC%E9%97%B4%E7%88%86%E7%82%B8%E5%9E%8BLowSing;%E3%80%90%E6%AD%8C%E5%8D%95%E3%80%91%E9%AC%BC%E7%95%9C%E5%90%88%E9%9B%86;2422733825;3155180151;MUSIC_7113500;;;;1916009352;4219468868;MV_725964;0","nodeId":0,"source":7,"isPoint":"0","artistId":"283085","mutiVer":"0","name":"Boom瞎卡拉卡","pay":"0","newCount":0},{"inFo":"小初-染上你的颜色","albumId":"551684","disName":"跟着小可爱跳起来","extend":"|MUSIC_COUNT=0|","isNew":0,"pic":"http://img4.kwcdn.kuwo.cn/star/upload/9/9/1465267062457_.jpg","sourceId":"%E6%9F%93%E4%B8%8A%E4%BD%A0%E7%9A%84%E9%A2%9C%E8%89%B2;%E5%B0%8F%E5%88%9D;%E3%80%90%E6%AD%8C%E5%8D%95%E3%80%91%E6%BD%AE%E8%A7%86%E9%A2%91;3468172629;1007094523;MUSIC_7077102;;;;2902781185;927900180;MV_717007;0","nodeId":0,"source":7,"isPoint":"0","artistId":"288245","mutiVer":"0","name":"跟着小可爱跳起来","pay":"0","newCount":0},{"inFo":"惜缘、过去-【丞相司徒】霍元甲","albumId":"552790","disName":"嚯嚯嚯嚯嚯嚯","extend":"|MUSIC_COUNT=0|","isNew":0,"pic":"http://img1.kwcdn.kuwo.cn/star/upload/5/5/1465267020053_.jpg","sourceId":"%E3%80%90%E4%B8%9E%E7%9B%B8%E5%8F%B8%E5%BE%92%E3%80%91%E9%9C%8D%E5%85%83%E7%94%B2;%E6%83%9C%E7%BC%98%E3%80%81%E8%BF%87%E5%8E%BB;%E3%80%90%E6%AD%8C%E5%8D%95%E3%80%91%E9%AC%BC%E7%95%9C%E5%90%88%E9%9B%86;1962769930;3801261222;MUSIC_7098156;;;;3225320734;4206063319;MV_722386;0","nodeId":0,"source":7,"isPoint":"0","artistId":"288942","mutiVer":"0","name":"嚯嚯嚯嚯嚯嚯","pay":"0","newCount":0},{"inFo":"哦漏-洗脑歌曲","albumId":"551684","disName":"洗脑歌曲进来就出不去","extend":"|MUSIC_COUNT=0|","isNew":0,"pic":"http://img3.kwcdn.kuwo.cn/star/upload/4/4/1465179353540_.jpg","sourceId":"%E6%B4%97%E8%84%91%E6%AD%8C%E6%9B%B2;%E5%93%A6%E6%BC%8F;%E3%80%90%E6%AD%8C%E5%8D%95%E3%80%91%E6%BD%AE%E8%A7%86%E9%A2%91;1147558446;2181547398;MUSIC_7071918;;;;3399948393;3292504172;MV_622764;0","nodeId":0,"source":7,"isPoint":"0","artistId":"258684","mutiVer":"0","name":"洗脑歌曲进来就出不去","pay":"0","newCount":0}]},"original":{"cacheTime":"2016-06-07 14:30:00","list":[{"inFo":"","nodeId":0,"source":33,"disName":"酷我音乐调频","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=2|","isNew":0,"name":"酷我音乐调频","pic":"http://img1.kwcdn.kuwo.cn/star/upload/5/5/1396253578389_.jpg","newCount":0,"sourceId":"5"},{"inFo":"","nodeId":0,"source":33,"disName":"吐小曹扒新闻","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=2|","isNew":0,"name":"吐小曹扒新闻","pic":"http://img1.kwcdn.kuwo.cn/star/upload/7/7/1396253281927_.jpg","newCount":0,"sourceId":"1"},{"inFo":"","nodeId":0,"source":33,"disName":"爆笑糗事段子","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=2|","isNew":0,"name":"爆笑糗事段子","pic":"http://img4.kwcdn.kuwo.cn/star/upload/5/5/1400552848597_.jpg","newCount":0,"sourceId":"3"},{"inFo":"","nodeId":0,"source":33,"disName":"灵异事件簿","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=2|","isNew":0,"name":"灵异事件簿","pic":"http://img1.kwcdn.kuwo.cn/star/upload/6/6/1402381366934_.jpg","newCount":0,"sourceId":"13"},{"inFo":"","nodeId":0,"source":33,"disName":"请给我一首歌的时间","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"请给我一首歌的时间","pic":"http://img3.kwcdn.kuwo.cn/star/upload/3/3/1405567427139_.jpg","newCount":0,"sourceId":"15"},{"inFo":"","nodeId":0,"source":33,"disName":"酷我音乐调频","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"酷我音乐调频","pic":"http://img2.kwcdn.kuwo.cn/star/upload/5/5/1396253578389_.jpg","newCount":0,"sourceId":"5"},{"inFo":"","nodeId":0,"source":33,"disName":"吐小曹扒新闻","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"吐小曹扒新闻","pic":"http://img1.kwcdn.kuwo.cn/star/upload/7/7/1396253281927_.jpg","newCount":0,"sourceId":"1"},{"inFo":"","nodeId":0,"source":33,"disName":"爆笑糗事段子","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"爆笑糗事段子","pic":"http://img3.kwcdn.kuwo.cn/star/upload/5/5/1400552848597_.jpg","newCount":0,"sourceId":"3"},{"inFo":"","nodeId":0,"source":33,"disName":"灵异事件簿","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"灵异事件簿","pic":"http://img2.kwcdn.kuwo.cn/star/upload/6/6/1402381366934_.jpg","newCount":0,"sourceId":"13"},{"inFo":"","nodeId":0,"source":33,"disName":"莫萱日记","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"莫萱日记","pic":"http://img3.kwcdn.kuwo.cn/star/upload/12/12/1405570407996_.jpg","newCount":0,"sourceId":"2"},{"inFo":"","nodeId":0,"source":33,"disName":"一个人听","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"一个人听","pic":"http://img4.kwcdn.kuwo.cn/star/upload/8/8/1460602533768_.jpg","newCount":0,"sourceId":"27"},{"inFo":"","nodeId":0,"source":33,"disName":"小曹胡咧咧","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"小曹胡咧咧","pic":"http://img2.kwcdn.kuwo.cn/star/upload/2/2/1427969189298_.jpg","newCount":0,"sourceId":"22"},{"inFo":"","nodeId":0,"source":33,"disName":"小曹胡咧咧","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"小曹胡咧咧","pic":"http://img1.kwcdn.kuwo.cn/star/upload/2/2/1427969189298_.jpg","newCount":0,"sourceId":"22"},{"inFo":"","nodeId":0,"source":33,"disName":"吐槽Talk show","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"吐槽Talk show","pic":"http://img4.kwcdn.kuwo.cn/star/upload/13/13/1460691958157_.jpg","newCount":0,"sourceId":"29"}]},"newDiscShelves":{"cacheTime":"2016-09-09 17:50:00","list":[{"inFo":"贾玲;三块石","nodeId":0,"source":13,"disName":"依兰爱情故事","artistId":"10971","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"依兰爱情故事","pic":"http://img3.kwcdn.kuwo.cn/star/albumcover/300/25/41/1997281419.jpg","artist":"贾玲;三块石","newCount":0,"sourceId":"1349995"},{"inFo":"张芸京","nodeId":0,"source":13,"disName":"失败的高歌","artistId":"5219","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"失败的高歌","pic":"http://img2.kwcdn.kuwo.cn/star/albumcover/120/5/95/4228075837.jpg","artist":"张芸京","newCount":0,"sourceId":"1303284"},{"inFo":"杨洋","nodeId":0,"source":13,"disName":"爱是一个疯字","artistId":"228574","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"爱是一个疯字","pic":"http://img4.kwcdn.kuwo.cn/star/albumcover/120/41/7/2438451804.jpg","artist":"杨洋","newCount":0,"sourceId":"1349845"},{"inFo":"张惠春","nodeId":0,"source":13,"disName":"爱过了又怎样","artistId":"569","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"爱过了又怎样","pic":"http://img1.kwcdn.kuwo.cn/star/albumcover/120/21/82/526441.jpg","artist":"张惠春","newCount":0,"sourceId":"1349713"},{"inFo":"华晨宇","nodeId":0,"source":13,"disName":"消失的昨天","artistId":"125910","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"消失的昨天","pic":"http://img1.kwcdn.kuwo.cn/star/albumcover/120/23/85/340244866.jpg","artist":"华晨宇","newCount":0,"sourceId":"1349808"}]},"focusPicture":{"cacheTime":"2016-06-07 14:30:00","list":[{"inFo":"","nodeId":0,"source":17,"disName":"酷我K1耳机","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"酷我K1耳机","pic":"http://img4.kwcdn.kuwo.cn/star/upload/9/9/1465194956921_.jpg","newCount":0,"sourceId":"http://g.koowo.com/g.real?aid=text_ad_3036&cid=&url=https://detail.tmall.com/item.htm?id=522001391451"},{"inFo":"","nodeId":0,"source":21,"disName":"小美推歌","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"小美推歌","pic":"http://img3.kwcdn.kuwo.cn/star/upload/11/11/1465262090315_.jpg","newCount":0,"sourceId":"http://album.kuwo.cn/album/h/mbox?id=1913"},{"inFo":"","nodeId":0,"source":17,"disName":"周杰伦2016全新数字专辑","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"周杰伦2016全新数字专辑","pic":"http://img2.kwcdn.kuwo.cn/star/upload/15/15/1464761201359_.jpg","newCount":0,"sourceId":"http://g.koowo.com/g.real?aid=text_ad_3442&url=http://vip1.kuwo.cn/fans/fans/pc/presale/index.html"},{"inFo":"","nodeId":0,"source":21,"disName":"酷我音乐调频","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"酷我音乐调频","pic":"http://img4.kwcdn.kuwo.cn/star/upload/7/7/1464964348279_.jpg","newCount":0,"sourceId":"http://album.kuwo.cn/album/h/mbox?id=911"},{"inFo":"","nodeId":0,"source":21,"disName":"史上最炫情歌 最潮方式说爱你","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"史上最炫情歌 最潮方式说爱你","pic":"http://img3.kwcdn.kuwo.cn/star/upload/15/15/1465206461935_.jpg","newCount":0,"sourceId":"http://album.kuwo.cn/album/h/mbox?id=2046"},{"inFo":"","nodeId":0,"source":17,"disName":"酷我秀场 真情点唱","extend":"|XIUOPEN|MUSIC_COUNT=0|","isNew":0,"name":"酷我秀场 真情点唱","pic":"http://img4.kwcdn.kuwo.cn/star/upload/2/2/1462442656146_.jpg","newCount":0,"sourceId":"http://g.koowo.com/g.real?aid=text_ad_2809&url=http://x.kuwo.cn/KuwoLive/OpenLiveRoomLink?from=1001003001"},{"inFo":"","nodeId":0,"source":21,"disName":"忍不住单曲循环的欧美音乐","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"忍不住单曲循环的欧美音乐","pic":"http://img4.kwcdn.kuwo.cn/star/upload/12/12/1465132571868_.jpg","newCount":0,"sourceId":"http://album.kuwo.cn/album/h/mbox?id=2045"},{"inFo":"","nodeId":0,"source":11,"disName":"唐门六道","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"唐门六道","pic":"http://img4.kwcdn.kuwo.cn/star/upload/6/6/1464688187734_.jpg","newCount":0,"sourceId":"http://g.koowo.com/g.real?aid=text_ad_1269&ver=&url=http://game.kuwo.cn/g/st/newdl?dlid=gtmld5&gameid=240&serverid=999&s=2&at=888&ap=998"},{"inFo":"","nodeId":0,"source":21,"disName":"我想和你唱","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"我想和你唱","pic":"http://img4.kwcdn.kuwo.cn/star/upload/11/11/1465058181083_.jpg","newCount":0,"sourceId":"http://album.kuwo.cn/album/h/mbox?id=2031"}]},"playList":{"cacheTime":"2016-06-07 14:30:00","list":[{"inFo":"227首歌曲","nodeId":0,"source":8,"disName":"每日最新单曲","extend":"|MUSIC_COUNT=3|LONGPIC=http://img3.kwcdn.kuwo.cn/star/upload/12/12/1465267024044_.jpg|","isNew":0,"name":"每日最新单曲","pic":"http://img4.kwcdn.kuwo.cn/star/upload/2/2/1465266966546_.jpg","newCount":0,"sourceId":"1082685104"},{"inFo":"63首歌曲","nodeId":0,"source":8,"disName":"【给力】高考必听励志歌曲","extend":null,"isNew":0,"name":"【给力】高考必听励志歌曲","pic":"http://img1.kwcdn.kuwo.cn/star/upload/6/6/1465268284006_.jpg","newCount":0,"sourceId":"1566407592"},{"inFo":"60首歌曲","nodeId":0,"source":8,"disName":"【高潮】秒杀双耳必听欧美金曲","extend":null,"isNew":0,"name":"【高潮】秒杀双耳必听欧美金曲","pic":"http://img1.kwcdn.kuwo.cn/star/upload/8/8/1465268660712_.jpg","newCount":0,"sourceId":"1566407594"},{"inFo":"68首歌曲","nodeId":0,"source":8,"disName":"【碉堡】不朽金曲经典制造","extend":null,"isNew":0,"name":"【碉堡】不朽金曲经典制造","pic":"http://img2.kwcdn.kuwo.cn/star/upload/0/0/1465268766976_.jpg","newCount":0,"sourceId":"1566522857"},{"inFo":"58首歌曲","nodeId":0,"source":8,"disName":"【潮货】中国风打造新时尚","extend":null,"isNew":0,"name":"【潮货】中国风打造新时尚","pic":"http://img2.kwcdn.kuwo.cn/star/upload/3/3/1465184646963_.jpg","newCount":0,"sourceId":"1566051454"}]},"specialColumn":{"cacheTime":"2016-06-07 14:30:00","list":[{"inFo":"","nodeId":0,"source":51,"disName":"那些曾红极一时的组合","extend":"|ORIGINAL_TYPE=1|","isNew":0,"name":"那些曾红极一时的组合","pic":"http://img2.kwcdn.kuwo.cn/star/upload/1/1/1465188525329_.jpg","newCount":0,"sourceId":"3152"},{"inFo":"","nodeId":0,"source":51,"disName":"魔性Vol.46 高考来了 ","extend":"|ORIGINAL_TYPE=1|","isNew":0,"name":"魔性Vol.46 高考来了 ","pic":"http://img2.kwcdn.kuwo.cn/star/upload/5/5/1465119440933_.jpg","newCount":0,"sourceId":"3119"},{"inFo":"","nodeId":0,"source":51,"disName":"6月桃花爆表神曲 ","extend":"|ORIGINAL_TYPE=1|","isNew":0,"name":"6月桃花爆表神曲 ","pic":"http://img3.kwcdn.kuwo.cn/star/upload/1/1/1465113657937_.jpg","newCount":0,"sourceId":"3126"},{"inFo":"","nodeId":0,"source":51,"disName":"娜扎被黑史 ","extend":"|ORIGINAL_TYPE=2|","isNew":0,"name":"娜扎被黑史 ","pic":"http://img3.kwcdn.kuwo.cn/star/upload/14/14/1465011290094_.jpg","newCount":0,"sourceId":"3114"},{"inFo":"","nodeId":0,"source":51,"disName":"【惊喜】回归BOY！我们的EXO！","extend":"|ORIGINAL_TYPE=1|","isNew":0,"name":"【惊喜】回归BOY！我们的EXO！","pic":"http://img4.kwcdn.kuwo.cn/star/upload/2/2/1465095113570_.jpg","newCount":0,"sourceId":"3121"},{"inFo":"","nodeId":0,"source":51,"disName":"污湖四海皆朋友 ","extend":"|ORIGINAL_TYPE=1|","isNew":0,"name":"污湖四海皆朋友 ","pic":"http://img1.kwcdn.kuwo.cn/star/upload/8/8/1464923722360_.jpg","newCount":0,"sourceId":"3104"},{"inFo":"","nodeId":0,"source":51,"disName":"大姨妈之歌","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=2|","isNew":0,"name":"十二星座PK大姨妈之歌","pic":"http://img2.kwcdn.kuwo.cn/star/upload/12/12/1464683287964_.jpg","newCount":0,"sourceId":"3089 "},{"inFo":"","nodeId":0,"source":51,"disName":"陈冠希小三门","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=2|","isNew":0,"name":"陈冠希小三门","pic":"http://img4.kwcdn.kuwo.cn/star/upload/11/11/1464852168107_.jpg","newCount":0,"sourceId":"3111"},{"inFo":"","nodeId":0,"source":51,"disName":"十二星座以毒攻毒的失恋情歌 ","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"十二星座以毒攻毒的失恋情歌 ","pic":"http://img4.kwcdn.kuwo.cn/star/upload/14/14/1464858452878_.jpg","newCount":0,"sourceId":"3113"},{"inFo":"","nodeId":0,"source":51,"disName":"魔性Vol.43 葫芦娃大战蛇精病","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"魔性Vol.43 葫芦娃大战蛇精病","pic":"http://img4.kwcdn.kuwo.cn/star/upload/7/7/1464863799111_.jpg","newCount":0,"sourceId":"3116"},{"inFo":"","nodeId":0,"source":51,"disName":"Tfboys 星座恋人配对专属情歌","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"Tfboys 星座恋人配对专属情歌","pic":"http://img3.kwcdn.kuwo.cn/star/upload/0/0/1464074181728_.jpg","newCount":0,"sourceId":"3017"},{"inFo":"","nodeId":0,"source":51,"disName":"不堪回首的黑历史","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=2|","isNew":0,"name":"不堪回首的黑历史","pic":"http://img4.kwcdn.kuwo.cn/star/upload/4/4/1461302230356_.jpg","newCount":0,"sourceId":"2696"},{"inFo":"","nodeId":0,"source":51,"disName":"【吐槽】你说这外号谁起的？","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"【吐槽】你说这外号谁起的？","pic":"http://img1.kwcdn.kuwo.cn/star/upload/0/0/1461387906432_.jpg","newCount":0,"sourceId":"2712"},{"inFo":"","nodeId":0,"source":51,"disName":"美不美看大腿 ","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=2|","isNew":0,"name":"美不美看大腿 ","pic":"http://img2.kwcdn.kuwo.cn/star/upload/14/14/1462427940206_.jpg","newCount":0,"sourceId":"2855"},{"inFo":"","nodeId":0,"source":51,"disName":"书桓 你在干什么？ ","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=2|","isNew":0,"name":"书桓 你在干什么？ ","pic":"http://img2.kwcdn.kuwo.cn/star/upload/9/9/1463978782297_.jpg","newCount":0,"sourceId":"3012"},{"inFo":"","nodeId":0,"source":51,"disName":"【傲娇】新晋小花谁最红！ ","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"【傲娇】新晋小花谁最红！ ","pic":"http://img2.kwcdn.kuwo.cn/star/upload/9/9/1464324670313_.jpg","newCount":0,"sourceId":"3054"},{"inFo":"","nodeId":0,"source":51,"disName":"眼睛最美男星TOP10 ","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"眼睛最美男星TOP10 ","pic":"http://img1.kwcdn.kuwo.cn/star/upload/0/0/1464065195360_.jpg","newCount":0,"sourceId":"3030"},{"inFo":"","nodeId":0,"source":51,"disName":"【傲娇】滚蛋吧！毕业君！","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"【傲娇】滚蛋吧！毕业君！","pic":"http://img3.kwcdn.kuwo.cn/star/upload/5/5/1463369901109_.jpg","newCount":0,"sourceId":"2917"},{"inFo":"","nodeId":0,"source":51,"disName":"【吐槽】腿短","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=2|","isNew":0,"name":"【吐槽】腿短其实没关系，关键是演技到位","pic":"http://img2.kwcdn.kuwo.cn/star/upload/2/2/1461651195394_.jpg","newCount":0,"sourceId":"2754"},{"inFo":"","nodeId":0,"source":51,"disName":"【傲娇】秀晶","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=2|","isNew":0,"name":"【傲娇】秀晶和东北苏志燮相遇","pic":"http://img2.kwcdn.kuwo.cn/star/upload/5/5/1461640994101_.jpg","newCount":0,"sourceId":"2752"},{"inFo":"","nodeId":0,"source":51,"disName":"【吐槽】长大=换脸？ 时间是把整sha容zhu刀！","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=2|","isNew":0,"name":"【吐槽】长大=换脸？ 时间是把整sha容zhu刀！","pic":"http://img4.kwcdn.kuwo.cn/star/upload/2/2/1461735064978_.jpg","newCount":0,"sourceId":"2768"},{"inFo":"","nodeId":0,"source":51,"disName":"【吐槽】明星由帅变丑是一种怎样的体验","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=2|","isNew":0,"name":"【吐槽】明星由帅变丑是一种怎样的体验","pic":"http://img1.kwcdn.kuwo.cn/star/upload/10/10/1462853871866_.jpg","newCount":0,"sourceId":"2904"},{"inFo":"","nodeId":0,"source":51,"disName":"【吐槽】欢乐颂，就是套路太深！","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"【吐槽】欢乐颂，就是套路太深！","pic":"http://img1.kwcdn.kuwo.cn/star/upload/13/13/1462770194173_.jpg","newCount":0,"sourceId":"2902"},{"inFo":"","nodeId":0,"source":51,"disName":"【吐槽】如果我爱翻白眼，你还会爱我吗？","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"【吐槽】如果我爱翻白眼，你还会爱我吗？","pic":"http://img1.kwcdn.kuwo.cn/star/upload/6/6/1462252036390_.jpg","newCount":0,"sourceId":"2821"},{"inFo":"","nodeId":0,"source":51,"disName":"5月10日十二星座运势","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=2|","isNew":0,"name":"5月10日十二星座运势","pic":"http://img1.kwcdn.kuwo.cn/star/upload/11/11/1462444380363_.jpg","newCount":0,"sourceId":"2802"},{"inFo":"","nodeId":0,"source":51,"disName":"36°鸡汤：《守婚如玉》","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=2|","isNew":0,"name":"36°鸡汤：《守婚如玉》","pic":"http://img3.kwcdn.kuwo.cn/star/upload/11/11/1462113149867_.jpg","newCount":0,"sourceId":"2810"},{"inFo":"","nodeId":0,"source":51,"disName":"韩剧新推：白发公主在诅咒中收获了爱情！","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"韩剧新推：白发公主在诅咒中收获了爱情！","pic":"http://img3.kwcdn.kuwo.cn/star/upload/2/2/1462250386242_.jpg","newCount":0,"sourceId":"2824"},{"inFo":"","nodeId":0,"source":51,"disName":"【魔性】不要过来！！！","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"【魔性】不要过来！！！","pic":"http://img2.kwcdn.kuwo.cn/star/upload/10/10/1462352822186_.jpg","newCount":0,"sourceId":"2822"},{"inFo":"","nodeId":0,"source":51,"disName":"十二星座5月旺桃花之歌","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"十二星座5月旺桃花之歌","pic":"http://img1.kwcdn.kuwo.cn/star/upload/12/12/1462352858700_.jpg","newCount":0,"sourceId":"2846"},{"inFo":"","nodeId":0,"source":51,"disName":"【李易峰生快】拽而有礼 拽而不狂","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"【李易峰生快】拽而有礼 拽而不狂","pic":"http://img2.kwcdn.kuwo.cn/star/upload/7/7/1462340302951_.jpg","newCount":0,"sourceId":"2841"},{"inFo":"","nodeId":0,"source":51,"disName":"“一切尚好”刘润洁民谣音乐会","extend":"|MUSIC_COUNT=0|ORIGINAL_TYPE=1|","isNew":0,"name":"“一切尚好”刘润洁民谣音乐会","pic":"http://img2.kwcdn.kuwo.cn/star/upload/6/6/1462268871238_.jpg","newCount":0,"sourceId":"2830"}]}},"msg":"成功","msgs":null,"status":200}';
	if(indexCache == ''){
		indexCache = defIndexCache;
	}
	if(indexCache){
		try{
			var jsondata = eval('('+indexCache+')');
		}catch(e){
			realShowTimeLog('http://www.kuwo.cn/pc/index/info',0,(new Date().getTime()-startTime),'fromWeb-callCreateIndexListFn-errorCache:'+indexCache,0);
			indexCache = defIndexCache;
			var jsondata = eval('('+indexCache+')');
		}
		getIndexData(true);
		callMainDataFn(jsondata);
		setTimeout(function(){//读取其它频道数据存入缓存
			loadOtherChannel();
		},6000);
	}else{
		getIndexData(false);
	}
}

function getIndexData(flag){
	var url = 'http://www.kuwo.cn/pc/index/info';
	$.ajax({
        url:url,
		dataType:"text",
		type:"get",
		crossDomain:false,
		success:function(data){
			if(data.lastIndexOf('"status":200')<0){
				var errorData = data;
				//数据异常用缓存 无缓存读错误页面
				// realShowTimeLog('http://www.kuwo.cn/pc/index/info',0,(new Date().getTime()-startTime),'fromWeb-getIndexData-errorData:'+data,0);
				data = getDataByCache('indexdatacache');
				var indexCache = data;
				if(!indexCache){
					//发送错误日志
					realShowTimeLog('http://www.kuwo.cn/pc/index/info',0,(new Date().getTime()-startTime),'fromWeb-getIndexData-errorCacheData:'+errorData,0);
					return;
				}
			}
			if(!flag){
				//获取数据进行创建模块
				var jsondata = eval('('+data+')');
				callMainDataFn(jsondata);
				//广告加载
				callAdStart();
				setTimeout(function(){//读取其它频道数据存入缓存
					loadOtherChannel();
				},6000);
			}else{
				var indexCache = getDataByCache('indexdatacache');
				indexCache = indexCache.replace(/"cacheTime":".{19}",/gi,'"cacheTime":"0"');
				var nowdata = data.replace(/"cacheTime":".{19}",/gi,'"cacheTime":"0"');
				if(indexCache != nowdata){
					var jsondata = eval('('+data+')');
					callMainDataFn(jsondata,true);
					//广告加载
					callAdStart();
				}
			}
			var day7 = 604800;//单位是秒
			saveDataToCache('indexdatacache',data,day7);//存缓存
		},
		error:function(){
			indexDomainChange();
		}
    });
}
function indexDomainChange(){
    var someurl = "http://"+hostConfig+"/pc/index/info?newtime="+Math.random()+"&thost=www.kuwo.cn";
    $.ajax({
	    url:someurl,
	    type:"get",
		dataType:"text",
		crossDomain:false,
	    success:function(data){
		    if(data.indexOf('"status":200')<0){
		        loadErrorPage();
			    return;
		    }
		    var jsondata = eval(data);
		    callMainDataFn(jsondata);
	    },
	    error:function(xhr){
		    var httpstatus = xhr.status;
		    if(typeof(httpstatus)=="undefined"){
			    httpstatus = "-1";
		    }
		    var sta = httpstatus.toString();
		    var fx = "http://topmusic.kuwo.cn/today_recommend/mbox2013/config/kuwofx.js?t="+Math.random();
	        $.getScript(fx,function(){
	        	callAdStart();
	        });
		    loadErrorPage();
			realShowTimeLog('http://www.kuwo.cn/pc/index/info',0,(new Date().getTime()-startTime),'fromWeb-indexDomainChange-errorStatus:'+sta,0);
		    return;
	    }
    });
}


function callMainDataFn(jsondata,notSendLog){//创建完成后发送ServiceLevel日志
	try{
		var bannerArr = jsondata.data.focusPicture.list;
		var plArr = jsondata.data.playList.list;
		var hotMvArr = jsondata.data.hotMv.list;
		var huodongArr = jsondata.data.huoDong.list;
		var originalArr = jsondata.data.original.list;
		var hotColumnArr = jsondata.data.specialColumn.list;
		var newAlbumArr = jsondata.data.newDiscShelves.list;
		//设置4个icon
		set_4_icon(plArr[0]);
		// if(!isWc){
		// 	//createindexPlayList(plArr);
		// 	getindexPlayListData();
		// 	createIndexMvList(hotMvArr);
		// }
		createIndexMvList(hotMvArr);
		createHuoDongList(huodongArr);
		createIndexOriginalList(originalArr);
		createhotColumnList(hotColumnArr);	
		createNewAlbumList(newAlbumArr);
		createIndexFocusList(bannerArr);
		//首页加载完毕
	}catch(e){
		getIndexData(true);
		loadErrorPage();
		realShowTimeLog('http://www.kuwo.cn/pc/index/info',0,(new Date().getTime()-startTime),'fromWeb-callMainDataFn-catchMsg:'+e.message,0);
	}
	//差ServiceLevel日志
	if(!notSendLog){//比较缓存和数据时如果二次填充页面 不发此日志
		realShowTimeLog('http://www.kuwo.cn/pc/index/info',1,(new Date().getTime()-startTime),0,0);
	}
	loadImages();
	initJDT();
	centerLoadingEnd();
}

//焦点图
function createIndexFocusList(data){
	// 焦点图图片list模板
	var listModel = loadTemplate('#kw_bannerlist .m_bannerImg');
	// 焦点图btnlist模板
	var btnModel = loadTemplate('#kw_bannerlist .m_bannerBtn');
	
	if(data){
		var count = 0;
		while(count<data.length){
			if(sourceISOK(data[count].source)){
				data.splice(count,1);
			}else{
				data[count].indexnum=count;
				count++;
			}
			
		}
	}else{
		var data = [{"inFo":"","nodeId":0,"source":21,"disName":"隔壁老王推歌","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"隔壁老王推歌","pic":"http://img1.kwcdn.kuwo.cn/star/upload/4/4/1464144658772_.jpg","newCount":0,"sourceId":"http://album.kuwo.cn/album/h/mbox?id=1908"},{"inFo":"","nodeId":0,"source":21,"disName":"一秒上瘾的韩团招牌曲","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"一秒上瘾的韩团招牌曲","pic":"http://img4.kwcdn.kuwo.cn/star/upload/11/11/1464170342363_.jpg","newCount":0,"sourceId":"http://album.kuwo.cn/album/h/mbox?id=2034"},{"inFo":"电视原声","nodeId":0,"source":13,"disName":"亲爱的翻译官 电视剧原声带","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"亲爱的翻译官 电视剧原声带","pic":"http://img2.kwcdn.kuwo.cn/star/upload/4/4/1464055841444_.jpg","newCount":0,"sourceId":"554007"},{"inFo":"","nodeId":0,"source":21,"disName":"酷我音乐调频","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"酷我音乐调频","pic":"http://img3.kwcdn.kuwo.cn/star/upload/2/2/1463724460642_.jpg","newCount":0,"sourceId":"http://album.kuwo.cn/album/h/mbox?id=911"},{"inFo":"","nodeId":0,"source":21,"disName":"2016公告牌音乐大奖","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"2016公告牌音乐大奖","pic":"http://img1.kwcdn.kuwo.cn/star/upload/8/8/1464096873432_.jpg","newCount":0,"sourceId":"http://album.kuwo.cn/album/h/mbox?id=2033"},{"inFo":"","nodeId":0,"source":17,"disName":"酷我秀场 真情点唱","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"酷我秀场 真情点唱","pic":"http://img4.kwcdn.kuwo.cn/star/upload/2/2/1462442656146_.jpg","newCount":0,"sourceId":"http://g.koowo.com/g.real?aid=text_ad_2809&url=http://x.kuwo.cn/KuwoLive/OpenLiveRoomLink?from=1001003001"},{"inFo":"","nodeId":0,"source":21,"disName":"不得不听的激爽运动歌单","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"不得不听的激爽运动歌单","pic":"http://img4.kwcdn.kuwo.cn/star/upload/13/13/1463996511101_.jpg","newCount":0,"sourceId":"http://album.kuwo.cn/album/h/mbox?id=2030"},{"inFo":"","nodeId":0,"source":11,"disName":"武神赵子龙","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"武神赵子龙","pic":"http://img1.kwcdn.kuwo.cn/star/upload/14/14/1462871814958_.jpg","newCount":0,"sourceId":"http://g.koowo.com/g.real?aid=text_ad_1269&ver=&url=http://game.kuwo.cn/g/st/newdl?dlid=gwszzl5&gameid=236&serverid=999&s=2&at=888&ap=998"},{"inFo":"","nodeId":0,"source":21,"disName":"我想和你唱","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"我想和你唱","pic":"http://img2.kwcdn.kuwo.cn/star/upload/6/6/1463849531558_.jpg","newCount":0,"sourceId":"http://album.kuwo.cn/album/h/mbox?id=2031"},{"inFo":"音乐大师课","nodeId":0,"source":13,"disName":"音乐大师课第二季 第十三期","extend":"|MUSIC_COUNT=0|","isNew":0,"name":"音乐大师课第二季 第十三期","pic":"http://img2.kwcdn.kuwo.cn/star/upload/8/8/1463930071448_.jpg","newCount":0,"sourceId":"553926"}];
		var count = 0;
		while(count<data.length){
			if(sourceISOK(data[count].source)){
				data.splice(count,1);
			}else{
				data[count].indexnum=count;
				count++;
			}
			
		}
	}
	var listHtml = drawListTemplate(data, listModel, proIndexFocusData);
	$('#w_focus').html(listHtml);
	
	var btnHtml = drawListTemplate(data, btnModel, proIndexFocusData);
	$('#focus_btn').html(btnHtml);
}

function proIndexFocusData(obj){
	var json = {};
	var source = obj.source;
	var sourceid = obj.sourceId;
	var focussourceid = source==21?getValue(sourceid,"id"):sourceid;
	if(source==21 && sourceid.indexOf("?")>-1){
		sourceid = sourceid+"&from=index";
	}
	extend = obj.extend;
	disname = obj.disName;
	disname = checkSpecialChar(disname,"disname");
	titlename = disname;
	titlename = checkSpecialChar(titlename,"titlename");
	name = obj.name;
	name = checkSpecialChar(name,"name");
	if(source==2)source = 1;
	if(source==7)sourceid = encodeURIComponent(sourceid);
	nodeid = obj.nodeId;
	if(nodeid=="")nodeid = 0;
	var other = "";
	if(source==8||source==12){
	    other = "|psrc=首页->焦点图->|from=index";
	}
	other+="|csrc=曲库->首页->焦点图->"+name;
	var click = commonClickString(new Node(source,sourceid,name,nodeid,extend,other));
	var indexnum = obj.indexnum;
	var classname = '';
	if(indexnum==0){
		classname = 'current';
	}
	var pic = obj.pic;
	if(!pic){
	    pic = "";
	}
	if(pic!=""){
		pic = changeImgDomain(pic);
	}
	json = {
		'source':source,
		'sourceid':sourceid,
		'focussourceid':focussourceid,
		'classname':classname,
		'name':name,
		'titlename':titlename,
		'click':click,
		'indexnum':indexnum,
		'pic':pic
	};
	return json;
}
//焦点图结束

//运营歌单
function createindexPlayList(data){
	var model = loadTemplate('#kw_playlistModel');
	if(data.length == 0){
		$('.recommendPlaylistBox').hide();
	}
	if(data.length>10){
		data.length = 10;
	}
	var htmlStr = drawListTemplate(data, model, proIndexPlayListData);
	$('.kw_rcmPl').html(htmlStr);
	loadImages();
}

function proIndexPlayListData(obj){
	var json = {};
	var name = checkSpecialChar(obj.name,"name");
    var disname = checkSpecialChar(obj.disName,"disname") || checkSpecialChar(name,"disname");
    var titlename = checkSpecialChar(disname,"titlename");
    var pic = obj.pic;
    var new_song_sourceid = 1082685104;
    var csrc = "曲库->首页->个性化推荐->"+name;
    if(obj.sourceId == new_song_sourceid){//新歌速递合并入口
    	var other = '|from=index|psrc=首页->新歌速递->';
    	var ipsrc = '首页->新歌速递->' + disname + '-<PID_'+obj.sourceId+';SEC_-1;POS_-1;DIGEST_8>';
    	var new_song_entrance = 8888;
    	var click = commonClickString(new Node(new_song_entrance,obj.sourceId,name,obj.id,obj.extend,other));
    }else{
    	var other = '|from=index(editor)|psrc=首页->猜你喜欢->';
    	var ipsrc = '首页->猜你喜欢->' + disname + '(editor)-<PID_'+obj.sourceId+';SEC_-1;POS_-1;DIGEST_8>';
    	var click = commonClickString(new Node(obj.source,obj.sourceId,name,obj.id,obj.extend,other));
    }
    var iplay = 'iPlay(arguments[0],8,'+obj.sourceId+',this);return false;';
	pic = changeImgDomain(pic);
	var rnum = getStringKey(obj.extend,'MUSIC_COUNT');
	if(rnum>0){
		rnum = '<span class="r_num">+'+rnum+'</span>';
	}else{
		rnum = '';
	}
	var al_flag = '';
	if(getStringKey(obj.extend,'AL_FLAG')){
		al_flag = '<span class="al_flag">无损</span>';
	}
	var	boxcname = 'kw_pl140';
	var	imgcname = 'kw_pli140';
	var	shadowcname = 'kw_pl140s';
	var	imgstr = `<img class="lazy" src="img/def150.png" data-original="${pic}" onerror="imgOnError(this,150);" />`;
	json={
		'name':name,
		'disname':disname,
		'titlename':titlename,
		'pic':pic,
		'click':click,
		'ipsrc':ipsrc,
		'rnum':rnum,
		'iplay':iplay,
		'al_flag':al_flag,
		'boxcname':boxcname,
		'imgcname':imgcname,
		'shadowcname':shadowcname,
		'imgstr':imgstr,
		'csrc':csrc
	}
	
	return json;
}
//运营歌单结束

//最新mv开始
function createIndexMvList(data){
	var model = loadTemplate('#kw_mvlistModel');
	if(data.length == 0){
		$('.LastMvBox').hide();
	}
	if(data.length>5){
		data.length = 5;
	}
	var htmlStr = drawListTemplate(data, model, proIndexMvData);
	$('.kw_indexMvListBox').html(htmlStr);
}

function proIndexMvData(obj){
	var json = {};
	var name = checkSpecialChar(obj.name,"name");
    var disname = checkSpecialChar(obj.disName,"disname") || checkSpecialChar(name,"disname");
    var titlename = checkSpecialChar(disname,"titlename");
    var info = obj.inFo;
	var pic = obj.pic;
	//var click = 'someMV(this);';
    var psrc = encodeURIComponent('VER=2015;FROM=曲库->首页->最新MV->'+disname);
    var csrc = "曲库->首页->最潮视频->"+name;
    var formats = '';
    var sourceid = obj.sourceId;
    if(obj.sourceidcopy)sourceid = obj.sourceIdcopy;
    var mvs = obj.sourceId.replace(/;/g,"\t");
    var mvinfoArr = [];
    var count = 0;
    mvinfoArr[count++] = mvs;
    mvinfoArr[count++] = psrc;
    mvinfoArr[count++] = formats;
    mvinfoArr[count++] = getMultiVerNum(obj);
    mvinfoArr[count++] = getPointNum(obj);
    mvinfoArr[count++] = getPayNum(obj);
    mvinfoArr[count++] = getArtistID(obj);
    mvinfoArr[count++] = getAlbumID(obj);
    
    var mvinfo = mvinfoArr.join('\t');
    mvinfo = encodeURIComponent(mvinfo);
    MVLISTOBJ[MVLISTOBJ.length] = mvinfo;
    MVLISTOBJECT[MVLISTOBJECT.length] = obj;
    pic = changeImgDomain(pic);
    var isPoint = parseInt(obj.isPoint);
    var barrageIcon = '';
    if(isPoint){
        barrageIcon = '<span class="tm_mv"></span>';
    }
    var imgstr = `<img class="lazy" width="142" height="80" src="img/def140.png" onerror="imgOnError(this,140);" data-original="${pic}">`;
    json = {
    	'name':name,
    	'mvinfo':mvinfo,
    	'mvna':info,
    	'mvinfo':mvinfo,
    	'imgstr':imgstr,
    	'barrageIcon':barrageIcon,
    	'csrc':csrc
    }
    return json;
}
//最新mv结束

//运营活动开始
function createHuoDongList(data){
	var model = loadTemplate('#kw_huodongModel');
	if(data.length == 0){
		$('.musicPeripheryBox').hide();
	}
	if(data.length>5){
		data.length = 5;
	}
	var htmlStr = drawListTemplate(data, model, proIndexHuoDongData);
	$('.musicPeripheryList').html(htmlStr);
}

function proIndexHuoDongData(obj){
	var json = {};
	var name = checkSpecialChar(obj.name,"name");
    var disname = checkSpecialChar(obj.disName,"disname") || checkSpecialChar(name,"disname");
    var titlename = disname;
    titlename = checkSpecialChar(titlename,"titlename");
    obj.sourceId = obj.sourceId.replace("cid=","cid="+getUserID("devid"));
    var click = commonClickString(new Node(obj.source,obj.sourceId,name,obj.id,obj.extend));
    var pic = obj.pic130 || obj.pic;
    if(pic!=""){
	    pic = changeImgDomain(pic);
    }
    var imgstr =`<img width="142" height="142" src="img/def150.png" class="lazy" onerror="imgOnError(this,150);" data-original="${pic}">`;
    json = {
    	'name':name,
    	'disname':disname,
		'titlename':titlename,
		'imgstr':imgstr,
		'click':click
    };
    
    return json;
}
//运营活动结束

//原创开始
function createIndexOriginalList(data){
	//图文数据
	var picArr = [];
	//文字数据
	var txtArr = [];
	for(var i= 0; i<data.length; i++){
		var type=getStringKey(data[i].extend,'ORIGINAL_TYPE');
		if(type == 1){
			picArr.push(data[i]);
		}else{
			txtArr.push(data[i]);
		}
	}
	if(picArr.length>6){
		picArr.length = 6;
	}
	if(picArr.length == 0){
		$('.kw_originalBox').hide();
	}
	//图文list
	var	picModel = loadTemplate('#kw_originalModel');
	var htmlStr = drawListTemplate(picArr, picModel, proIndexOriginalData);
	$('.kw_originalList').html(htmlStr);
}

function proIndexOriginalData(obj){
	var json ={};
	var name = checkSpecialChar(obj.name,"name");
    var disname = checkSpecialChar(obj.disName,"disname") || checkSpecialChar(name,"disname");
    var titlename = disname;
    titlename = checkSpecialChar(titlename,"titlename");
    obj.source = -201;//转换source 进入内容页
    obj.id = obj.sourceId;
    var click = commonClickString(new Node(obj.source,obj.sourceId,name,obj.id,obj.extend));
    var pic = obj.pic130 || obj.pic;
    if(pic!=""){
	    pic = changeImgDomain(pic);
    }
    var	imgstr =`<img width="142" height="142" src="img/def150.png" class="lazy" onerror="imgOnError(this,150);" data-original="${pic}">`;
    json={
    	'name':name,
    	'disname':disname,
		'titlename':titlename,
		'pic':pic,
		'imgstr':imgstr,
		'click':click
    };
    
    return json;
}
//原创结束

//专栏开始
function createhotColumnList(data){
	var picArr = [];
	var txtArr = [];
	
	for(var i=0; i<data.length; i++){
		var type = getStringKey(data[i].extend,'ORIGINAL_TYPE');
		if(type == 1){
			picArr.push(data[i]);
		}else{
			txtArr.push(data[i]);
		}
	}
	if(picArr.length>5){
		picArr.length = 5;
	}
	if(picArr.length == 0){
		$('.hotColumnBox').hide();
	}
	//图文数据
	var picModel = loadTemplate('#kw_huodongModel');
	var htmlStr = drawListTemplate(picArr, picModel, proHotColumnData);
	$('.kw_hotColumnList').html(htmlStr);
}

function proHotColumnData(obj){
	var json ={};
	var name = checkSpecialChar(obj.disName,"name");
    var disname = checkSpecialChar(obj.disName,"disname") || checkSpecialChar(name,"disname");
    var titlename = disname;
    titlename = checkSpecialChar(titlename,"titlename");
    var click = commonClickString(new Node(obj.source,obj.sourceId,name,obj.id,obj.extend));
    var pic = obj.pic;
    if(pic!=""){
	    pic = changeImgDomain(pic);
    }
    var	imgstr =`<img width="142" height="142" src="img/def150.png" class="lazy" onerror="imgOnError(this,150);" data-original="${pic}">`;
    json={
    	'name':name,
    	'disname':disname,
		'titlename':titlename,
		'imgstr':imgstr,
		'click':click
    };
    
    return json;
}
//专栏结束

//新碟开始
function createNewAlbumList(data){
	var model = loadTemplate('#kw_rcmalbumlistModel');
	if(data.length == 0){
		$('.kw_albumList').hide();
	}
	if(data.length>4){
		data.length = 4;
	}
	var html = drawListTemplate(data,model,proNewAlbumData);
	$('.kw_albumList').html(html);
}

function proNewAlbumData(obj){
	var json = {};

	var albumname = checkSpecialChar(obj.name,"name");
    var albumdisname = checkSpecialChar(obj.disName,"disname") || checkSpecialChar(name,"disname");
    var albumtitle = checkSpecialChar(albumdisname,"titlename");
    var pic = obj.pic;
    var infoStr = '';
    var albumid = obj.sourceId;
    var artistid = obj.artistId;
    var artistname = checkSpecialChar(obj.artist,"disname");
    var artisttitle = checkSpecialChar(obj.artist,"titlename");
    var multiplename = albumdisname+'-'+artistname;
    var multipletitle = albumtitle+'-'+artisttitle;
    var datapsrc = "最新专辑->"+albumdisname;
    var csrc = "曲库->首页->新碟上架->"+albumdisname;
    var other = '|from=index';
    var click = commonClickString(new Node(obj.source,albumid,albumname,obj.nodeId,obj.extend,other));
    var artistclick = commonClickString(new Node('4',artistid,artistname,'4','',other));
    var iplay = 'iPlay(arguments[0],13,'+albumid+',this);return false;'
    if(!pic){
        pic = default_img;
    }else{
        pic = changeImgDomain(pic);
    }
	pic = pic.replace(/albumcover\/120/,'albumcover\/180');
    json = {
    	'albumtitle':albumtitle,
    	'albumdisname':albumdisname,
    	'artisttitle':artisttitle,
    	'artistname':artistname,
    	'multiplename':multiplename,
    	'multipletitle':multipletitle,
    	'datapsrc':datapsrc,
    	'pic':pic,
    	'click':click,
    	'artistclick':artistclick,
    	'iplay':iplay,
    	'csrc':csrc
    };
	return json;
}
//新碟结束
//非个性化部分结束

//获取个性化电台数据并创建个性化电台
function getRcmRadioData(){
	var uid = getUserID("uid");
    var kid = getUserID("devid");
    var login = 0;
    if(uid!=0){
        login = 1;
    }
    var url="http://gxh2.kuwo.cn/newradio.nr?type=22&uid="+uid+"&login="+login+"&kid="+kid+"&size=10&ver="+getVersion()+"&is_new=1&time="+Math.random();
    $.ajax({
        url:url,
		dataType:"text",
		type:"get",
		crossDomain:false,
		success:function(radiodata){
			try{
				var radioobj = eval('('+radiodata+')');
			    if(typeof(radioobj)=="object"&&radioobj.length>0){
			    	createIndexRadio(radioobj);
			    	//刷新、进入页面时获取电台状态
					loadRadioStatus();
					if (radioid) {
						initRadioStatus(parseInt(status,10),radioid);
					}else{
                        initRadioStatus(3);
                    }
			    }else{
			    	$('.indexRadioBox').hide();
			    }
			}catch(e){
				$('.indexRadioBox').hide();
			}
		},
		error:function(){
			//隐藏该模块
			$('.indexRadioBox').hide();
		}
    });
}

function createIndexRadio(data){
	//模板样式(注意用用原生获取)
	//解析一次模板
	var model = loadTemplate('#kw_radiolistModel');

	var len =data.length;
	if(len>5)data.length=5;
	
	for(var i=0; i<data.length; i++){
		data[i].indexnum = i;
	}
	//获取数据拼接完成后的html字符串
	var str = drawListTemplate(data, model, proIndexRadioData);
	$('.kw_indexRadio').html(str);
	loadImages();
}


function proIndexRadioData(obj){
	var json = {};
	var name = checkSpecialChar(obj.name,"name");
    var disname = checkSpecialChar(obj.disname,"disname") || checkSpecialChar(name,"disname");
    var titlename = checkSpecialChar(disname,"titlename");
    var pic = obj.pic;
    var index = obj.indexnum+1;
    var radioClass = 'radio_' + obj.sourceid.split(',')[0];
    var id = obj.sourceid.split(',')[0];
    obj.extend = obj.extend+ "|RADIO_PIC=" + pic + "|DIS_NAME=" + disname + "|" ;
    
    var r = Math.ceil(index/5);
    var l = index%5 || 5;
	var pos = r + ',' + l;
	var gps = "2,1";
	var fpage = "首页";
	var dtid = obj.sourceid.split(",")[0];
    
    	var listen = FormatRadioListenersNum(obj.info);    
	var click = commonClickString(new Node(obj.source,obj.sourceid,name,id,obj.extend));
	var log = 'radioLog(\'POSITION:'+pos+'|GPOSITION:'+gps+'|FROMPAGE:'+fpage+'|RADIOID:'+dtid+'|CSRCTAG:'+obj.disname+'\'); ';
	// 图片高斯处理
	pic = 'http://star.kwcdn.kuwo.cn/star/radio/blur/' + dtid + '.jpg?' + GenRadioRandomsufix(6);
	var	imgstr = `<img class="lazy" width="142" height="142" src="img/def150.png" onerror="imgOnError(this,150)"; data-original="${pic}">`;
	json = {
		'name':name,
		'disname':disname,
		'titlename':titlename,
		'imgstr':imgstr,
		'radioClass':radioClass,
		'click':click,
		'log':log,
        	'listnum':listen,
	};
	return json;
}
//个性化电台结束

//个性化歌单开始
function getRcmPlaylistData(){
	try{
		var rcmplcache = getDataByCache('rcmpldata');
		var jsondata = eval('('+jsonStr+')');
		var playlistObj = jsondata.playlist;
		createRcmPlaylist(jsondata);
		loadImages();
	}catch(e){
		var rcmplcache = '';
	}
	var uid = getUserID("uid");
    var kid = getUserID("devid");
    var testurl = 'http://60.28.195.115/rec.s?cmd=rcm_keyword_playlist&uid='+uid+'&devid='+kid+'&platform=pc';
	var url = 'http://rcm.kuwo.cn/rec.s?cmd=rcm_keyword_playlist&uid='+uid+'&devid='+kid+'&platform=pc&t='+Math.random();
	$.ajax({
        url:url,
		dataType:"text",
		type:"get",
		crossDomain:false,
		success:function(jsonStr){
			try{
				var jsondata = eval('('+jsonStr+')');
				// 个性化歌单
				var playlistObj = jsondata.playlist;
				// 个性化搜索关键词
				var keyObj = jsondata.keyword;
			 	if(typeof(playlistObj)=="object" && playlistObj!=null && playlistObj.length>4){
			 		if(jsonStr != rcmplcache){
				 		createRcmPlaylist(jsondata);
				 		saveDataToCache('rcmpldata',jsonStr);
			 		}
			 	}else{
			 		$('.personalizationBox').hide();
			 	}
		 	}catch(e){
		 		$('.personalizationBox').hide();
		 	}
		},
		error:function(){
			$('.personalizationBox').hide();
		}
    });
}


function createRcmPlaylist(data){
	var plArr = data.playlist;
	var txtArr = [];
	var tmpArr = data.keyword.searchlist || [];
	if(plArr.length>10){
		plArr.length = 10;
	}
		
	// txtArr[0]={'source':-11,'sourceid':'rcm_pd','name':'口味发现','id':0,'extend':'','other':'|from=index|psrc=首页->为你推荐->口味发现','indexnum':0};
	// for(var i=0; i<tmpArr.length; i++){
	// 	tmpArr[i].indexnum = i+1;
	// 	txtArr.push(tmpArr[i]);
	// }
	
	//模板样式(注意用用原生获取)
	var plModel = loadTemplate('#kw_playlistModel');
	var str = drawListTemplate(plArr,plModel,proRcmPlData);	
	$('.kw_rcmPl').html(str);
	
	// var txtModel = loadTemplate('#kw_keywordModel');
	// var str = drawListTemplate(txtArr,txtModel,proRcmKeyWordData);
	// $('.personalizationBox .entrance').html(str);
	//$('.personalizationBox .indexTitleBox a').attr('onclick','commonClick({\'source\':\'1001\',\'name\':\'个性化推荐\'});');
	loadImages();
}

function proRcmPlData(obj){
	var json = {};
	
	//处理数据
	var name = checkSpecialChar(obj.name,"name");
    var disname = checkSpecialChar(obj.disname,"disname") || checkSpecialChar(name,"disname");
    var titlename = checkSpecialChar(disname,"titlename");
    var info = obj.info;
    var pic = obj.pic || 'img/def120.png';
    var rcm_type=obj.rcm_type;
    var newreason=obj.newreason;
    var iplay = 'iPlay(arguments[0],8,'+obj.sourceid+',this);return false;';
    var reasonStr='';
	var ipsrc='首页->猜你喜欢->' + disname+'(algorithm)' + '-<PID_'+obj.sourceid+';SEC_-1;POS_-1;DIGEST_8>';
	var csrc = "曲库->首页->个性化推荐->"+name;
	var other = '|from=index(algorithm)|psrc=首页->猜你喜欢->|csrc='+csrc;
	var click = commonClickString(new Node(obj.source,obj.sourceid,name,obj.id,obj.extend,other));
    
	pic = changeImgDomain(pic);
	
	var rcm_class = '';
	var rcm_info_class = '';
	for(var i=0; i<newreason.length; i++){
    	switch(newreason[i].type){
    		case 'txt':
    			reasonStr+=''+newreason[i].desc;
    			break;
    		default:
    			reasonStr+=''+newreason[i].desc;
    			break;
    	}
    }
    var des = '';
	// if(reasonStr!=''){
	// 	if(!isWc){
	// 		var des = '<p class="kw_rcmpldes" title="'+reasonStr+'">'+reasonStr+'</p>';
	// 		rcm_class = 'kw_rcm_pl_box';
	// 		rcm_info_class = 'kw_rcm_pl_info';
	// 	}
	// }
	var al_flag = '';
	if(parseInt(obj.extend)){
		al_flag = '<span class="al_flag">无损</span>';
	}
	var	boxcname = 'kw_pl140';
	var	imgcname = 'kw_pli140';
	var	shadowcname = 'kw_pl140s';
	var	imgstr = `<img class="lazy" src="img/def150.png" data-original="${pic}" onerror="imgOnError(this,150);" />`;
	var playcnt = obj.playcnt||1000;
	if(playcnt>100000)playcnt=parseInt(playcnt/10000)+"万";
	json={
		'name':name,
		'disname':disname,
		'titlename':titlename,
		'pic':pic,
		'click':click,
		'ipsrc':ipsrc,
		'des':des,
		'rcm_class':rcm_class,
		'rcm_info_class':rcm_info_class,
		'iplay':iplay,
		'al_flag':al_flag,
		'boxcname':boxcname,
		'imgcname':imgcname,
		'shadowcname':shadowcname,
		'imgstr':imgstr,
		'csrc':csrc,
		'playcnt':playcnt
	}
	
	return json;
}

function proRcmKeyWordData(obj){
	var json = {};
	var newIcon = '';
	var classname = '';
	if(obj.indexnum==0){
		var name = checkSpecialChar(obj.name,"name");
		var click = commonClickString(new Node(obj.source,obj.sourceid,name,obj.id,obj.extend,obj.other));
		var oDate = new Date();
		var today = ''+oDate.getFullYear()+toDou(oDate.getMonth()+1)+toDou(oDate.getDate());
		var cache = getDataByCache('j_rcm_entrance'+today);
		if(!cache && oDate.getHours()>6){
			newIcon = '<span class="rcm_new"></span>';
			classname = 'rcm j_rcm_entrance';
		}else{
			classname = 'j_rcm_entrance';
		}
	}else{
		var name = checkSpecialChar(obj.query,"name");
		var click = 'web2pcSearch(\''+name+'\')';
	}
	
	var titlename = checkSpecialChar(name,"titlename");
	json = {
		'name':name,
		'titlename':titlename,
		'click':click,
		'newIcon':newIcon,
		'classname':classname
	};
	return json;
}
//个性化歌单结束

//焦点图相关事件
var jdtFocus = 1;
var jdtTimer;
var jdtTotal;
// 焦点图轮播
var initFirst = true;
function initJDT() {
    jdtTotal = $("#w_focus>a").size();
    jdtFocus = 1;
    checkJDTPlay(0);
    beginTimer();
    if(initFirst){
        bindJDT();
        initFirst = false;
    }
    $("#focusImg").mouseenter(function (e){
        $(this).find("i").show();
        $("#focusplay").show();
		e.stopPropagation()
    });
    $("#focusImg").mouseleave(function (){
        $(this).find("i").hide();
        $("#focusplay").hide();
    });
}
function checkJDTPlay(index){
		var firstsource = $("#w_focus>a").eq(index).attr("data-source");
		var firstsourceid = $("#w_focus>a").eq(index).attr("data-sourceid");
		var firstname = $("#w_focus>a").eq(index).attr("data-name");
		
		if (firstsource == 1 || firstsource == 4 || firstsource == 8 || firstsource == 12 || firstsource == 13 || firstsource == 21) {
			$("#focusplay").html('<a data-source="' + firstsource + '" data-sourceid="' + firstsourceid + '" data-name="'+firstname+'" href="javascript:;" hidefocus></a>');
			$("#focusplay").attr("title","直接播放");
		}else{
			$("#focusplay").html("");
			$("#focusplay").attr("title","");
		}
}



function beginTimer(a) {
    clearTimeout(jdtTimer);
    jdtTimer = setTimeout(function () {
        jdtFocus++;
        if (jdtFocus > jdtTotal) {
            jdtFocus = 1;
        }
        gotoJDT();
        beginTimer();
    }, 5000);
}
var lastFocus = 1;
function gotoJDT() {
    $("#w_focus>a").css("display","none");
    $("#w_focus>a").eq(lastFocus-1).css("display","none");
    $("#w_focus>a").eq(jdtFocus - 1).css("display","block").find("img").hide();
    $("#w_focus>a").eq(jdtFocus - 1).find("img").fadeIn(500);
    $("#focus_btn a").eq(jdtFocus - 1).addClass("current").siblings().removeClass("current");
    checkJDTPlay(jdtFocus-1);
}
function bindJDT() {
    $("#lxNext").click(function () {
        jdtFocus++;
        if (jdtFocus > jdtTotal) {
            jdtFocus = 1;
        }
        clearTimeout(jdtTimer);
        gotoJDT();
        $("#focusplay").show();
    });
    $("#lxPre").click(function () {
        jdtFocus--;
        if (jdtFocus == 0 ) {
            jdtFocus = jdtTotal;
        }
        clearTimeout(jdtTimer);
        gotoJDT();
        $("#focusplay").show();
    });
    $("#w_focus>a").live("mouseenter",function () {
        clearTimeout(jdtTimer);
    });
    $("#focus_btn a").live("mouseenter",function () {

        if(jdtFocus == $(this).index() + 1){
            clearTimeout(jdtTimer);
            return;
        }
        jdtFocus = $(this).index() + 1;
        clearTimeout(jdtTimer);
        gotoJDT();
        $("#focusplay").show();
    });
    $("#focus_btn,#w_focus>a,#lxNext,#lxPre").live("mouseleave",function () {
        beginTimer();
    });
}

// 首页焦点图全部播放
var dataCsrc="";
function focusPlay() {
    var source = $("#focusplay a").attr("data-source");
    var sourceid = $("#focusplay a").attr("data-sourceid");
    var name = $("#focusplay a").attr("data-name");

    if (source == 21) {
        iPlayPSRC = '首页->焦点图->精选->' + name;
    } else {
        iPlayPSRC = '首页->焦点图->' + name;
    }
    dataCsrc = "曲库->首页->焦点图->"+name;
    if (source == 21) {
    	dataCsrc = "曲库->首页->焦点图->精选->"+name+"精选集";
        $.getScript(album_url + "album/mbox/commhd?flag=1&id=" + sourceid + "&pn=0&rn="+iplaynum+"&callback=playZhuanTiMusic");
    } else if (source == 1) {
        var url = "http://kbangserver.kuwo.cn/ksong.s?from=pc&fmt=json&type=bang&data=content&id=" + sourceid + "&callback=playBangMusic&pn=0&rn=" + iplaynum;  
        $.getScript(getChargeURL(url));
    } else if (source == 4) {
        var url = search_url + "r.s?stype=artist2music&artistid=" + sourceid + "&pn=0&rn=" + iplaynum + "&callback=playArtistMusic";
        $.getScript(getChargeURL(url));
    } else if (source == 8 || source == 12) {
        var url = "http://nplserver.kuwo.cn/pl.svc?op=getlistinfo&pid=" + sourceid + "&pn=0&rn=" + iplaynum + "&encode=utf-8&keyset=pl2012&identity=kuwo&callback=playGeDanMusic";
        $.getScript(getChargeURL(url));
    } else if (source == 13) {
        var url = search_url + "r.s?stype=albuminfo&albumid=" + sourceid + "&callback=playAlbumMusic&alflac=1";
        $.getScript(getChargeURL(url));
    }
}


//电台部分
var radioid = 0;
var status = '';
function loadRadioStatus() {
	var call = "GetRadioNowPlaying";
    var str = callClient(call);
	radioid = getValue(str,'radioid');
	status = getValue(str,'playstatus');
}

function radioBind(){
	$(".br_pic").live("mouseenter",function(){
		if ($(this).hasClass("on")) return;
		$(this).addClass("on");
		var status = $(this).attr("c-status");
		//if (!parseInt(status,10)) return;
		var someClass = $(this).parent().attr('class');
		var s = someClass.indexOf("radio_");
		var id = someClass.substring(s + 6);
		var stopicon = '';
		var click = '';
		if (status == 1) {
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
			$(this).append(stopicon);
		} else if (status == 2)	{
			var playicons = '<i class="radio_stop"></i>';
			$(this).find(".i_play").hide();
			$(this).append(playicons);
		}
		return false;
	});
}
//电台部分结束

// 口味发现点击事件
function rcmBind(){
	$('.j_rcm_entrance').live('click',function(){
		var oDate = new Date();
		var today = ''+oDate.getFullYear()+toDou(oDate.getMonth()+1)+toDou(oDate.getDate());
		saveDataToCache('j_rcm_entrance'+today,'1',86400);
	});
}
$(window).on('scroll',function(){
	loadImages();
});

//广告相关
// 关闭广告
function closeAD(pos){
    callClientNoReturn("CANCEL_AD?position="+pos);
}
// 跳转到用户页面
function goUser(){
    if(uid==""||uid==0){
		uid = getUserID("uid");
	}
    // var myurl = "http://mboxspace.kuwo.cn/ucm/mbox2013/home_2016.jsp?pageReady=false&uid="+uid;
    // myurl = encodeURIComponent(myurl);
    // callClient("Jump?channel=my&url="+myurl);
    //callClient('JumpToHomePage?vuid=' + uid);
    var url = "http://www.kuwo.cn/pc/my/index?uid="+uid+"&vuid="+uid;
    jumpToOtherUser(url);
}

//加载首页广告
function loadIndexAD(flag){
    var d = new Date();
    var time = d.getYear()+d.getMonth()+d.getDate()+d.getHours()+parseInt((d.getMinutes()/20));
    time = ''+d.getYear()+d.getMonth()+d.getDate()+time;
    if(flag===true){
        time = Math.random();
    }
    $.getScript("http://wa.kuwo.cn/lyrics/img/kwgg/kwgg_457.js?time="+time);
    setTimeout(function(){
        if($("#delay_load_recom_2015_r1 iframe").size()==0){
            $.getScript("http://wa.kuwo.cn/lyrics/img/kwgg/kwgg_457.js?time="+Math.random());
        }
    },5000);
    $.getScript("http://wa.kuwo.cn/lyrics/img/kwgg/kwgg_5.js?time="+time);
	setTimeout(function(){
		if($("#delay_load_top_2 iframe").size()==0){//2通廣告
			$.getScript("http://wa.kuwo.cn/lyrics/img/kwgg/kwgg_5.js?time="+Math.random());
		}
	},5000);
}

// 关闭首页广告
function removeAD(flag){
//  if(flag || removeAdByLocation){
	if(uid==0){
		return;
	}
    if(flag){
       // $(".ad,.gxh2015ad2Box").hide();
       // $(".ad,.gxh2015ad2Box").css("visibility","hidden");
       $(".ad,.ad2Box").hide();
       $(".ad,.ad2Box").css("visibility","hidden");
       $(".vip").show();
       $(".vip").css("visibility","");
	   $("#add_bottom,#open_vip").hide();
    }else{
       $(".vip").hide();
       $(".vip").css("visibility","hidden");
       // $(".ad,.ad2").show(); 
       // $(".ad,.ad2").css("visibility","");
       $(".ad,.ad2Box").show();
       $(".ad,.ad2Box").css("visibility","");
       $("#add_bottom,#open_vip").show();
    }
}

function callAdStart(){
	loadIndexAD();
	//vip、新用户留存去广告、加载广告部分
	if(uid==""||uid==0){
		uid = getUserID("uid");
	}
	if(uid!=""&&uid!=0&&!islogin){
		isVipLogin();
	}else{
		if(!getVip()){
			checkIsRemAd();
		}
	}
	//检查广告加载情况
	setTimeout(function(){
		checkADLoad();
	},10000);
}
//检查广告加载
var adloadtimer;
function checkADLoad(){
    try{
        clearInterval(adloadtimer);
        if(QKOBJ&&QKOBJ.loadadarray&&QKOBJ.loadadarray.length==2){
            var rannum = Math.floor(Math.random()*100);
            if(rannum<QKOBJ.loadadarray[1]){
                adloadtimer = setInterval(function(){
                    loadIndexAD(true);
                },QKOBJ.loadadarray[0]);    
            }
        }    
    }catch(e){}    
//if($('#delay_load_recom_2015_r1').html()==''){
//	loadIndexAD(true);
//}
}
//广告相关结束

//vip相关
// vip用户登录后去广告
function isVipLogin() {
    islogin = true;
    callClientNoReturn("setVipInfo");
}
// 获取登录用户是否是vip
function getVip(){
    return VipObject.isVip;
}
// 设置用户是否是vip
function setVip(flag){
    VipObject.isVip = flag;
}

function setVipInfo(levelinfo) {
    try {
	    if(levelinfo.indexOf(",")>-1){
	        var levelarray = levelinfo.split(",");
	        levelArray = levelarray;
	        var level = levelarray[0];
	        if(level > 0) {
	            setVip(true);
	            islogin = true;
	            showUserInfo('newuser');
	            removeAD(true);
	        } else {
	        	//非北上广去广告
	        	checkIsRemAd();
	        	if(VipObject.isVip){
	        		return;
	        	}
	        	//北上广加载广告
	    		setVip(false);
	        	removeAD(false);
	        }
	    }else{
	        if(levelinfo==0){
	            removeAD(false);
	        }
	    }     
    } catch(e) {
        webLog("vip error:"+e.message)
    }
}

// 登录用户为VIP 显示用户相关信息
function showUserInfo(user) {
    if(VipObject.isVip){
        if(username==""){
            username = getUserID("name");
        }
        if(uid==""||uid==0){
			uid = getUserID("uid");
		}
		$(".v_login").hide();
		$(".all_num,.v_b_name").show();
		if(uid==""||uid==0){
			$(".all_num,.v_b_name").hide();
			$(".v_login").show();
			return;
		}
        if(levelArray.length==4){
            $(".vip .v_b_ulevel").css("background-position","-"+(parseInt(levelArray[2],10)-1)*18+"px 0");
            var vlevel = parseInt(levelArray[1],10);
            $(".vip .v_b_vlevel").removeClass().addClass("v_b_vlevel newVip_"+vlevel);
            if(vlevel==2){
            	$(".vip .v_b_vlevel").on("click",function(){
            		callClientNoReturn("CANCEL_AD");
            	});
            }else{
            	if(callClient("CheckSuperVip")=="1"&&levelArray[3]=="1"){
		    		$(".vip .v_name .musicPackIcon").css("display","inline-block");
		    	}
            	$(".vip .v_b_vlevel").unbind("click");
            }
        }else{
        	$(".vip .v_b_ulevel").css("background-position",'0 0');
        	$(".vip .v_b_vlevel").removeClass().addClass("v_b_vlevel newVip_0");
        }
        if(user=='newuser'){
        	var vlevel = parseInt(levelArray[1],10);
        	if(levelArray[1]=="1"){
        		$(".vip_btn").html('升级为豪华VIP');
        	}else{
        		$(".vip_btn").html('立即续费');
        	}
        	$(".v_level").removeClass('pl75');
        }
        var showName = getUserID('showname');
        if(!showName){
        	$.ajax({
	            url:'http://www.kuwo.cn/api/user/getUserInfo?uid='+uid+'&qq-pf-to=pcqq.c2c',
				dataType:"text",
				type:"get",
				crossDomain:false,
				success:function(datastr){
				    var data = eval('('+datastr+')');
				    if(data.status == 200){
				    	var udata = data['data'];
				    	$(".vip .v_b_name").html(udata.nickname);
				    	$(".ad,ad2Box,#open_vip").hide();
				    	$(".vip").show();
				    	setUserListenCount(uid);
				    }
				},
				error:function(){
					$(".vip .v_b_name").html('');
			    	$(".ad,ad2Box,#open_vip").hide();
			    	$(".vip").show();
			    	setUserListenCount(uid);
				}
	        });
        }else{
        	$(".vip .v_b_name").html(showName);
	    	$(".ad,ad2Box,#open_vip").hide();
	    	$(".vip").show();
        	setUserListenCount(uid);
        }
    }
}
// 设置关于用户信息的听歌数
function setUserListenCount(uid){
	$.ajax({
        url:'http://www.kuwo.cn/api/user/getUserListenCount?uid='+uid+'&qq-pf-to=pcqq.c2c',
		dataType:"text",
		type:"get",
		crossDomain:false,
		success:function(datastr){
		    var data = eval('('+datastr+')');
		    if(data.status == 200){
		    	var listen = data['data']['listen'];
		    	$(".vip .all_num span").html(listen);
		    }
		},
		error:function(){
			$(".vip .all_num span").html('0');
		}
    });
}
//vip相关结束

//新用户留存策略非北上广去广告
function checkIsRemAd(){
	var userLocation = getDataByCache('user_location');
	if(userLocation){
		if(userLocation != 1 && userLocation != 3 && userLocation != 24 && parseInt(userLocation)){
			$(".vip_btn").html('开通VIP');
			if(getUserID("uid") == 0){
				$(".v_level").addClass("pl75");
			}else{
				$(".v_level").removeClass("pl75");
			}
        	setVip(true);
            islogin = true;
            showUserInfo();
            removeAD(true);
            return;
		}else{
			setVip(false);
			removeAD(false);
		}
	}else{
		$.ajax({
            url:"http://ipdomainserver.kuwo.cn/ip_domain",
			dataType:"text",
			type:"get",
			crossDomain:false,
			success:function(udata){
				eval(udata);
		    	removeAdByIp(_ip_domain_);
			}
        });
        return;
	}
}

function removeAdByIp(ipdomain){
        saveDataToCache("user_location",distarray[ipdomain]);
        var userLocation = distarray[ipdomain];
        if(userLocation){
			if(userLocation != 1 && userLocation != 3 && userLocation != 24 && parseInt(userLocation)){
				$(".vip_btn").html('开通VIP');
				if(getUserID("uid") == 0){
					$(".v_level").addClass("pl75");
				}else{
					$(".v_level").addClass("pl15");
				}
				setVip(true);
            	islogin = true;
            	showUserInfo();
            	removeAD(true);
			}else{
				removeAD(false);
			}
		}else{
			removeAD(false);
		}
}
//新用户相关结束

//登录退出相关
// 客户端登录成功后 回调网页方法
function OnLogin(param) {
    var userid = getUserID("uid");
	var sid = getUserID("sid");

    if(userid==0){
		return;
	}else{
		//if(!removeAdByLocation){
			isVipLogin();
		//}
		uid = userid;
		kid = getUserID("devid");
		username = getUserID("name");
		//checkRemoveAd();
		//重新获取个性化数据
		getRcmPlaylistData();
		getRcmRadioData();
	}
}

// 客户端登录后退出 回调
function OnLogout() {
	var userid = getUserID("uid");
	if(userid==0){
		uid = 0;
		kid = 0;
		username = "";
		islogin = false;
		checkIsRemAd();
	}
	//重新获取个性化数据
	getRcmPlaylistData();
	getRcmRadioData();
	removeAD(false);
}
//结束

//  广播电台

/**
 *     跳转界面
 */							
function radio_jumpPage(radioName , radioId ){
	commonClick({'source':'10000','sourceid':'10000','name':'radiopage','id':'10000','goRadioName':radioName,'goradioId':radioId});	
}
	
/**
 *     评论播报
 */		
function radio_Animate(){
	hitListIndex ++;
	if(hitListIndex > radio_slideBoxs.length){
		hitListIndex=0;
		BroadcastSlide.style.transition = "all 0s";
		BroadcastSlide.style.webkitTransition= "all 0s";
		BroadcastSlide.style.transform = "translateY(0px)";
	}else{
		BroadcastSlide.style.transition = "all 1.2s";
		BroadcastSlide.style.webkitTransition= "all 1.2s";
	}
	BroadcastSlide.style.transform = "translateY(-"+ hitListIndex*22 +"px)";
	BroadcastSlide.style.webkitTransform = "translateY(-"+ hitListIndex*22 +"px)";	
}

/**
 *    获取滚动条数数据
 */	
function getRadioStation(){
	var url = "http://www.kuwo.cn/pc/radio/playing";
	$.ajax({
        url: url,
        type: "get",
        dataType: "jsonp",
        jsonp: "jpcallback",
        jsonpCallback: "radio_playing",
    	success: function (data) {
    		var radioPlayingStr='';
    		if(data.data &&  data.status===200 && data.data.value !='失败'){
    			if(data.data.city && data.data.city !=undefined){
    				data.data.province = data.data.city;
    			}
    			if(data.data.list){
	     			for(var i=0,len = data.data.list.length ; i<len ;i++){
radioPlayingStr+='<li><i></i><a onclick="radio_jumpPage(\''+data.data.list[i].radioName+'\',\''+data.data.list[i].radioId +'\')" title=\''+returnSpecialChar(data.data.list[i].name)+'&nbsp;来自&nbsp'+returnSpecialChar(data.data.list[i].radioName) +'\' href="javascript:;"><span >'+returnSpecialCharTwo( data.data.list[i].name )+'</span><span >&nbsp;来自&nbsp;'+returnSpecialCharTwo(data.data.list[i].radioName)+'</span></a></li>';
	    			}   			
	    			$('#BroadcastSlide').html(radioPlayingStr).parent().show();
					$('.radio_locationName').html(data.data.province);
	    				
    			}
    		}
			setTimeout(function(){
				radio_slideBoxs = document.querySelectorAll('#BroadcastSlide li');
				var clonedNode = radio_slideBoxs[0].cloneNode(true);// 克隆节点
					BroadcastSlide.appendChild(clonedNode);
					radio_scrollFn();
					$('#BroadcastSlide li a').on('mouseenter',function(){
						clearInterval(timeSetInterval);
					}).on('mouseleave',function(){
						timeSetInterval = setInterval(radio_Animate,2500);
					})
					$('#BroadcastSlide').on('click',function(){
						window.setTimeout(function(){
							var musicImg = new Image();
							musicImg.src='http://webstat.kuwo.cn/logtj/comm/pc/radio/radioEnterNumber.jpg';
						},300);
					})
			},0)
    	}
	})
}

/**
 *    在网页中显示字符串中的特殊字符
 */
function returnSpecialCharTwo(s){
    s = ''+s;
	return s.replace(/\&amp;/g,"&").replace(/\&nbsp;/g," ").replace(/\&apos;/g,"'").replace(/\&quot;/g,"\"").replace(/\%26apos\%3B/g,"'").replace(/\%26quot\%3B/g,"\"").replace(/\%26amp\%3B/g,"&").replace(/‘/g,'\'').replace(/，/,',').replace(/ /g,'&nbsp;');
}

function radio_scrollFn(){
	var radio_scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
	if(radio_scrollTop + radio_ClientHeight > radio_BoxTop && radio_scrollTop < 1519 ){
		clearInterval(timeSetInterval);
		timeSetInterval = setInterval(radio_Animate,2500);
	}else{
		clearInterval(timeSetInterval);	
	}
}


//加载其它页面数据
function loadOtherChannel(){
	//load radio channel
	var radioChannelUrl = 'http://qukudata.kuwo.cn/q.k?op=query&cont=tree&node=87235&pn=0&rn=100&fmt=json&src=mbox&level=3&sourceset=tag_radio&callback=saveRadioChannelData&extend=gxh&kid='+kid+'&uid='+uid+'&ver='+getVersion()+'&login='+islogin;
	$.getScript(radioChannelUrl);
	var mvChannelUrl = 'http://album.kuwo.cn/album/mv2015?callback=saveMvChannelData';
	$.getScript(mvChannelUrl);
	var classifyChannelUrl = 'http://qukudata.kuwo.cn/q.k?op=query&cont=tree&node=1&pn=0&rn=20&fmt=json&src=mbox&level=3&callback=saveClassifyChannelData';
	$.getScript(classifyChannelUrl);
	var artistChannelUrl = 'http://artistlistinfo.kuwo.cn/mb.slist?stype=artistlist&callback=saveArtistChannelData&category=0&order=hot&pn=0&rn=100';
	$.getScript(artistChannelUrl);
	var bangHotChannelUrl = 'http://kbangserver.kuwo.cn/ksong.s?from=pc&fmt=json&type=bang&data=content&id=16&pn=0&rn=20&callback=saveHotBangChannelData';
	$.getScript(bangHotChannelUrl);
	var bangListChannelUrl = 'http://qukudata.kuwo.cn/q.k?op=query&cont=tree&node=2&pn=0&rn=20&fmt=json&src=mbox&level=2&callback=saveBangChannelData'
	$.getScript(bangListChannelUrl);
	var jxjChannelUrl = 'http://album.kuwo.cn/album/jxjPast?typeId=0&callback=saveJxjChannelData&rn=40&pn=0';
	$.getScript(jxjChannelUrl);
}

function saveBangChannelData(data){
	saveDataToCache('bangList-channel',obj2Str(data),3600)
}
function saveClassifyChannelData(data){
	saveDataToCache('classify-channel',obj2Str(data),3600)
}
function saveHotBangChannelData(data){
	saveDataToCache('bangHot-channel',obj2Str(data),3600)
}
function saveRadioChannelData(data){
	saveDataToCache('radio-channel',obj2Str(data),3600)
}
function saveMvChannelData(data){
	saveDataToCache('mv-channel',obj2Str(data),3600)
}
function saveArtistChannelData(data){
	saveDataToCache('artist-channel',obj2Str(data),3600)
}
function saveJxjChannelData(data){
	saveDataToCache('jxj-channel',obj2Str(data),3600)
}

function go_radio_page(){
	commonClick({'source':'-2','sourceid':'8','name':'1','id':'-2'});
}

function go_rcm_page(){
	commonClick({'source':'-11','sourceid':'rcm_pd','name':'口味发现','id':'0','extend':'','other':'|from=index|psrc=首页->为你推荐->口味发现|csrc=曲库->首页->口味发现'});
}

function go_original_page(){
	commonClick({'source':'33','sourceid':'http://album.kuwo.cn/album/h/mbox?id=911&from=jxfocus','name':'原创电台','id':'87045','other':'|csrc=曲库->首页->口味发现'});
}

function go_channel_mv_page(){
	var channelNode = 'MV';
    var src = 'channel_mv.html?';
    var channelInfo = getChannelInfo("","mv");
    var source = 43;
    var sourceid = 34;
    var param = '{\'source\':\''+source+'\',\'sourceid\':\''+sourceid+'\'}';
    var info = 'source='+source+'&sourceid='+sourceid;
    src = src+info;
	var call = "Jump?channel="+channelNode+"&param="+encodeURIComponent(param) + ";" + encodeURIComponent('url:${netsong}'+src) + ';' + encodeURIComponent('jump:'+channelInfo);
    callClientNoReturn(call);
}

function go_daysong_page(){
	commonClick({'source':'8888','sourceid':'1082685104','name':'每日最新单曲','id':'0','extend':'','other':'|from=index|psrc=首页->新歌速递->'});
}

function go_ukhot_page(){
	commonClick({'source':'1','sourceid':'26','name':'酷我热歌榜','id':'16','extend':'','other':'|psrc=排行榜->|bread=-2,2,排行榜,0|csrc=曲库->排行榜->酷我热歌榜'});
}

function set_4_icon(pldata){
	try{
		var newsongData = pldata || {};
		var oDate = new Date();
		var date = toDou(oDate.getDate());
		var extend = newsongData.extend || '';
		var daysongclick = "commonClick({'source':'8888','sourceid':'1082685104','name':'每日最新单曲','id':'0','extend':'"+extend+"','other':'|from=index|psrc=首页->新歌速递->'});"
		// var radioList = {
		// 	"0":{"nodeid":"0","source":"9","sourceid":"-28688,凌晨,http://img1.kwcdn.kuwo.cn:81/star/tags/201605/1464166108377.jpg,http://img1.kwcdn.kuwo.cn:81/star/tags/201605/1464166120906.jpg,2008-08-08,2016-02-09,4,0~24,1977963,4,1","name":"凌晨","disname":"凌晨","info":"1977963人在听","pic":"http://img2.kwcdn.kuwo.cn/star/radio/blur/-28688.jpg","listen":"1977963","like":"0","tips":"","isnew":"1","newcount":"0","extend":""},
		// 	"1":{"nodeid":"0","source":"9","sourceid":"-28683,清晨,http://img1.kwcdn.kuwo.cn:81/star/tags/201605/1464165603784.jpg,http://img1.kwcdn.kuwo.cn:81/star/tags/201605/1464165612506.jpg,2008-08-08,2015-02-10,4,0~24,1100034,4,1","name":"清晨","disname":"清晨","info":"1100034人在听","pic":"http://img2.kwcdn.kuwo.cn/star/radio/blur/-28683.jpg","listen":"1100034","like":"0","tips":"","isnew":"1","newcount":"0","extend":""},
		// 	"2":{"nodeid":"0","source":"9","sourceid":"-28684,上午,http://img1.kwcdn.kuwo.cn:81/star/tags/201605/1464165694729.jpg,http://img1.kwcdn.kuwo.cn:81/star/tags/201605/1464165702917.jpg,2008-08-08,2016-02-11,4,0~24,1053019,4,1","name":"上午","disname":"上午","info":"1053019人在听","pic":"http://img3.kwcdn.kuwo.cn/star/radio/blur/-28684.jpg","listen":"1053019","like":"0","tips":"","isnew":"1","newcount":"0","extend":""},
		// 	"3":{"nodeid":"0","source":"9","sourceid":"-28685,午后,http://img1.kwcdn.kuwo.cn:81/star/tags/201605/1464165787617.jpg,http://img1.kwcdn.kuwo.cn:81/star/tags/201605/1464165802556.jpg,2008-08-08,2016-01-12,4,0~24,1061733,4,1","name":"午后","disname":"午后","info":"1061733人在听","pic":"http://img3.kwcdn.kuwo.cn/star/radio/blur/-28685.jpg","listen":"1061733","like":"0","tips":"","isnew":"1","newcount":"0","extend":""},
		// 	"4":{"nodeid":"0","source":"9","sourceid":"-28686,黄昏,http://img1.kwcdn.kuwo.cn:81/star/tags/201605/1464165908064.jpg,http://img1.kwcdn.kuwo.cn:81/star/tags/201605/1464165915488.jpg,2008-08-08,2016-02-12,4,0~24,1900921,4,1","name":"黄昏","disname":"黄昏","info":"1900921人在听","pic":"http://img1.kwcdn.kuwo.cn/star/radio/blur/-28686.jpg","listen":"1900921","like":"0","tips":"","isnew":"1","newcount":"0","extend":""},
		// 	"5":{"nodeid":"0","source":"9","sourceid":"-28687,夜晚,http://img1.kwcdn.kuwo.cn:81/star/tags/201605/1464166013825.jpg,http://img1.kwcdn.kuwo.cn:81/star/tags/201605/1464166022676.jpg,2008-08-08,2015-10-07,4,0~24,1343126,4,1","name":"夜晚","disname":"夜晚","info":"1343126人在听","pic":"http://img1.kwcdn.kuwo.cn/star/radio/blur/-28687.jpg","listen":"1343126","like":"0","tips":"","isnew":"1","newcount":"0","extend":""}
		// };
		// var h = oDate.getHours();
		// var radioData = {};
		// if(h<19){
		// 	if(h>=0 && h<5){
		// 		radioData = radioList['0'];
		// 	}else if(h>4 && h<8){
		// 		radioData = radioList['1'];
		// 	}else if(h>7 && h<12){
		// 		radioData = radioList['2'];
		// 	}else if(h>11 && h<17){
		// 		radioData = radioList['3'];
		// 	}else if(h>16 && h<19){
		// 		radioData = radioList['4'];
		// 	}
		// }else if(h==19){
		// 	var min = oDate.getMinutes();
		// 	if(min<=30){
		// 		radioData = radioList['4'];
		// 	}else{
		// 		radioData = radioList['5'];
		// 	}
		// }else{
		// 	radioData = radioList['5'];
		// }
		// var radioname = radioData['disname'];
		// var radioid = radioData['sourceid'].split(',')[0];
		// var sourceid = radioData['sourceid'];
		// var name = radioData['name'];
        var log = "radioLog('POSITION:1,3|GPOSITION:2,1|FROMPAGE:首页|RADIOID:-26711|CSRCTAG:私人FM');"
		var raidoclick = "commonClick({'source':'9','sourceid':'-26711,私人FM,http://img1.kwcdn.kuwo.cn:81/star/tags/201703/1489548619143.jpg,http://img1.kwcdn.kuwo.cn:81/star/tags/201703/1489548642126.jpg,2008-08-08,2014-06-16,4,0~24,907,4,1','name':'私人FM','id':'-26711','extend':'|RADIO_PIC=http://img1.sycdn.kuwo.cn/star/rcm/radio/26711.png|DIS_NAME=私人FM|'})";
		var iconStr = `<li class="recommendList">
							<a href="javascript:;" class="rcm" onclick="go_rcm_page();">${date}</a>
							<a href="javascript:;" class="info rcminfo" onclick="go_rcm_page();">每日歌曲推荐</a>
						</li>
						<li class="recommendList">
							<a href="javascript:;" class="daysong" onclick="${daysongclick}"></a>
							<a href="javascript:;" class="info daysonginfo" onclick="${daysongclick}">每日最新单曲</a>
						</li>
						<li class="recommendList">
							<a href="javascript:;" class="ukhot" onclick="go_ukhot_page();"></a>
							<a href="javascript:;" class="info ukhotinfo" onclick="go_ukhot_page();">酷我热歌榜</a>
						</li>
						<li class="recommendList">
							<a href="javascript:;" class="radio" onclick="${log}${raidoclick}"></a>
							<a href="javascript:;" class="info radioinfo" onclick="${log}${raidoclick}">私人电台</a>
						</li>`;
		$('.recommendListBox').html(iconStr);
	}catch(e){
		$('.recommendBox').hide();
		realTimeLog("MUSICLISTEN_TEST","EMSG:"+e.message);
		// var errorData = JSON.stringify(radioData);
		var min = oDate.getMinutes();
		realTimeLog("MUSICLISTEN_TEST","EDATA:"+h+min+errorData);
	}
}

// 一通广告
var fx = "http://topmusic.kuwo.cn/today_recommend/mbox2013/config/kuwofx.js?t="+Math.random();
//加载全局变量QKOBJ对象
$.getScript(fx,function(){
	callAdStart();
});
// 一通广告 end

