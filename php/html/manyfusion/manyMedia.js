
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
			if(meetinglist[i].id == document.getElementById("myid").textContent)	return;
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
			if(meetinglist[i].id == document.getElementById("myid").textContent)	return;
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

/**
 * ビデオ通話ボタン(onclickで呼び出される
 */
function videoBotan(){
	if(document.getElementById("video").classList.contains("display"))		return;//すでにビデオモードの場合はリターン
	if(document.getElementById("audio").classList.contains("display"))	return;//すでに通話モードの場合はリターン
	meetinglist.sort(namesort);
	mediamode = NVIDEO;
	succescnt = N0;
	displayAndHide("video");
	meetinglist.sort(namesort);
	if(meetinglist.length > 1){
		advanceConnect("nextvideo");
		navigator.getUserMedia({audio: true, video: true},setMyStream,errorStream);
	}else{
		writeChat("sysname", sysname, "会議にメンバーを追加してください。");
	}

}

/**
 * 音声通話ボタン(onclickで呼び出される
 */
function onseiBotan(){
	if(document.getElementById("video").classList.contains("display"))		return;//すでにビデオモードの場合はリターン
	if(document.getElementById("audio").classList.contains("display"))	return;//すでに通話モードの場合はリターン
	mediamode = NAUDIO;
	succescnt = N0;
	displayAndHide("audio");
	meetinglist.sort(namesort);
	if(meetinglist.length > 1){
		advanceConnect("nextonsei");
		navigator.getUserMedia({audio: true, video: false},setMyStream,errorStream);
	}else{
		writeChat("sysname", sysname, "会議にメンバーを追加してください。");
	}
}

//切断ボタン(onclickで呼び出される
function setudanBotan(){
	if(document.getElementById("video").classList.contains("display")){
		document.getElementById("video").classList.remove("display");
		document.getElementById("video").classList.add("hide");
	}
	if(document.getElementById("audio").classList.contains("display")){
		document.getElementById("audio").classList.remove("display");
		document.getElementById("audio").classList.add("hide");
	}


	if(mediamode != N0){//切断をしていない場合
		mediamode = N0;
		window.alert("切断が起きました。");
		myStream.stop();
		//mypeer.disconnect();
		for(var i in meetinglist){
			if(i == 0) continue;
			console.log(meetinglist[i]);
			meetinglist[i].mediaconn.close();
		}

		if(mypeer.disconnected == true){
			console.log("function setudan");
			console.log(mypeer);
		}

		//yMediCall.close();
		//mypeer.destroy();	//ログアウト用
	}
}
