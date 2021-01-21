
/*#############################

 	manyのクライアント(受信側)コード
 	エラー取得コード

 	11/7にファイル分割を変更
 #############################*/

/*********************************
 *チャット、ファイル送受信
 *電話
 *ビデオチャット等
 *
 *connectだったりストリーム通信系
 *********************************/
const NVIDEO = 1;
const NAUDIO = 2;

var mediamode = N0;
var myStream;
var succescnt = N0;

var file = null;
var nextlist = [];

/**
 *
 * @param stream
 */
function errorStream(stream){
	window.alert("カメラ、マイクにアクセスできません。\nしっかりささっているか、あるいはブロックしていないか確認してください。");
}

/**
 *
 * @param	stream
 */
function setMyStream(stream){
	myStream = stream;
	switch(mediamode){
	case NVIDEO:		document.getElementById("myvideo").src = URL.createObjectURL(myStream);		break;
	case NAUDIO:		document.getElementById("myaudio").src = URL.createObjectURL(myStream);		break;
	default:							console.log("switchでエラーしました1 : " + mediamode);
	}
	switch(mediamode){
	case NVIDEO://ビデオをこちらからコール
		/*
		for(var i = 1; i < nextlist.length; i++){
			var medicall = mypeer.call(nextlist[i], myStream,{metadata:"video"});//peerへ発信し、media connectionを返します。
			medicall.on("stream", function(stream){document.getElementById("yourvideo" + i).src = URL.createObjectURL(stream)});//コールが帰ってきたら相手のストリームをセットする。
		}
		break;
		*/
		var medicall = [];
		console.log("$each");
		console.log(nextlist);
		jQuery.each(meetinglist,function(i){
			if(meetinglist[i].id == getCookie("u_id"))	return;
			medicall[i] = mypeer.call(meetinglist[i].id, myStream,{metadata:"video"});//peerへ発信し、media connectionを返します。
			medicall[i].on("stream", function(stream){
				console.log(i);
				document.getElementById("yourvideo" + i).src = URL.createObjectURL(stream);
				meetinglist[i].mediaconn = medicall[i];
				console.log("setMyのmediconn代入確認");
				console.log(meetinglist);

			});
			medicall[i].on('close', function(){
				console.log("クローズを認識");
				setudanBotan();
			});

		});
		break;
	case NAUDIO://電話のコール
		var medicall = [];
		console.log("$each");
		console.log(nextlist);
		jQuery.each(meetinglist,function(i){
			if(meetinglist[i].id == getCookie("u_id"))	return;
			medicall[i] = mypeer.call(meetinglist[i].id, myStream,{metadata:"audio"});//peerへ発信し、media connectionを返します。
			medicall[i].on("stream", function(stream){
				console.log(i);
				document.getElementById("youraudio" + i).src = URL.createObjectURL(stream);
				meetinglist[i].mediaconn = medicall[i];
				console.log("setMyのmediconn代入確認");
				console.log(meetinglist);

			});
			medicall[i].on('close', function(){
				console.log("クローズを認識");
				setudanBotan();
			});
		})
		break;
	default:
		console.log("switchでエラーしました : " + mediamode);
	}
}

/**
 * 相手から電話がかかってきたときの通知
 */
mypeer.on('call', function(call){//callはMediaConnection型オブジェクト
	if(window.confirm(call.peer + "がコールしてきました。") == false)	return;

	var yMediCall = call;
	switch(yMediCall.metadata){
	case "video":
		mediamode = NVIDEO;
		display("video");
		/*
		navigator.getUserMedia({audio: true, video: true},function(stream){
			document.getElementById("myvideo").src = URL.createObjectURL(stream);
			yMediCall.answer(stream);
			yMediCall.on("stream",function(stream){
				for(var i = 1; i < meetinglist.length; i++)		if(yMediCall.peer == meetinglist[i].id)	break;
				document.getElementById("yourvideo" + i).src = URL.createObjectURL(stream);
			});
		},errorStream);
		break;
		*/
		navigator.getUserMedia({audio: true, video: true},function(stream){
			myStream = stream;
			document.getElementById("myvideo").src = URL.createObjectURL(stream);
			yMediCall.answer(stream);//自分のストリームを相手に渡す。
			yMediCall.on("stream",function(stream){
				for(var i = 1; i < meetinglist.length; i++)		if(yMediCall.peer == meetinglist[i].id)	break;
				document.getElementById("yourvideo" + i).src = URL.createObjectURL(stream);
				console.log("Medi.on(call)のmediconn代入確認1");
				console.log(meetinglist);
				meetinglist[i].mediaconn = call;

				var medicall;
				medicall = mypeer.call(nextlist[1], myStream,{metadata:"video"});//peerへ発信し、media connectionを返します。
				medicall.on("stream", function(stream){
					var i = 1;
					for(; i < meetinglist.length; i++)		if(nextlist[1] == meetinglist[i].id)	break;
					document.getElementById("yourvideo" + i).src = URL.createObjectURL(stream);
					console.log("Medi.on(call)のmediaconn代入確認");
					meetinglist[i].mediaconn = medicall;
				});

			});
		},errorStream);
		break;
	case "audio":
		mediamode = NAUDIO;
		display("audio");
		navigator.getUserMedia({audio: true, video: false},function(stream){
			myStream = stream;
			document.getElementById("myaudio").src = URL.createObjectURL(stream);
			yMediCall.answer(stream);//自分のストリームを相手に渡す。
			yMediCall.on("stream",function(stream){
				var i = 1
				for(; i < meetinglist.length; i++)		if(yMediCall.peer == meetinglist[i].id)	break;
				document.getElementById("youraudio" + i).src = URL.createObjectURL(stream);
				console.log("Medi.on(call)のmediconn代入確認1");
				console.log(meetinglist);
				meetinglist[i].mediaconn = call;

				var medicall;
				medicall = mypeer.call(nextlist[1], myStream,{metadata:"audio"});//peerへ発信し、media connectionを返します。
				medicall.on("stream", function(stream){
					i = 1;
					for(; i < meetinglist.length; i++)		if(nextlist[1] == meetinglist[i].id)	break;
					document.getElementById("youraudio" + i).src = URL.createObjectURL(stream);
					console.log("Medi.on(call)のmediconn代入確認");
					meetinglist[i].mediaconn = medicall[i];
				});

			});
		},errorStream);
		break;
	}
	console.log("end call event");
	console.log(mypeer);
	call.on('close', function(){
		console.log("クローズを認識");
		setudanBotan();
	});

})


