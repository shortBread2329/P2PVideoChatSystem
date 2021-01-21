/*#########################
 * manyの初期化処理とログアウトメソッド
 * 小物メソッドもここにあるかも
 */


/**
 * Peerコンストラクタ。
 * idの生成、
 * シグナリングサーバ、STUNサーバへの接続
 */
var mypeer =  new Peer(getCookie("u_id"),{//自分の情報がはいったpeerオブジェクト
	/*シグナリングサーバ*/
		host: "153.120.166.104",
		port: 9000,
		key: 'peerjs',
	/*STUNサーバ*/
		config: { 'iceServers': [{ 'url': 'stun:153.120.166.104:3478' }] },
	/*ライブラリからのログの出力の設定*/
		debug: 3
	});


//ブラウザの判別
if(navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
else	console.log("ブラウザが非対応です。");


const N0 = 0;
var talkChan = N0;//ぼつになるかも
var myname = getCookie("u_hname");
var sysname = "System";
var ninzu = 0;
var meetinglist = [];

/**
 * 会議の最大人数
 * 3人からもっといけるように（チャットのために）するらしい。
 * ちなみにconstはIE非対応らしい
 */
const meetingLimit = 3;

/**
 * 通話の最大人数
 * ここは3人までだと思う
 */
const mediaLimit = 3;

console.log(mypeer);// mypeerで生成されたものをコンソールに出してます
console.log(document.cookie);

/**
 * main
 */
$(document).ready(function() {


	writeMeetingAndFriend();

	/**
	 * ドロップされた場合に起動するメソッド
	 */
	function showFileList(e){
		//オリジナルのイベントデータが欲しい場合originalEventを指定しなければなりません。
		e.originalEvent.preventDefault();//
		//e.preventDefault();//イベントキャンセル(表示orダウンロードのキャンセル
		console.log("ドロップされた");
		file = e.originalEvent.target.files[0] || e.originalEvent.dataTransfer.files[0];	//dataTransferオブジェクト
		console.log(file);

        //document.getElementById("chatlog").innerHTML += file.name + "<br>";//chatlogに出力
		for (var i in meetinglist)		advanceConnect("file", meetinglist[i].id);
		writeChat("zibun", myname, file.name + "を送信しました。");
		document.getElementById("dnddia").value = null;
	};
	var dndbox = $("#dnd");
    $("#dnddia").on('change', showFileList);
    $(dndbox).on('drop', showFileList);
    $(dndbox).on('dragover dragenter', function(e){
        e.preventDefault();
    });

    for(var i = 1; i < meetinglist.length; i++){
	    meetinglist[i].mediaconn.on("close", function(){
	    	//まだ途中
	    	console.log("切断が相手で押されたらしい");
	    });
    }
});

/**
*グループのdivボックス内とフレンドのdivボックス内にクッキーの情報からデータを書き込むメソッド
*/
function writeMeetingAndFriend(){

	var obj = document.getElementById("meeting");
	//参加会議をHTMLに書き込む
	for(var i = 0; ; i++){
		re = new RegExp("g_id" + i);
		if( document.cookie.match(re) ){
			var result = document.cookie.search(re);
			var groupName = getCookie("g_id" + i).split("_")

			//obj.innerHTML += "<p>" + groupName[1] + "<input type='radio' name='radiobox' value='g_id" + i + "' onchange='talkGet()' /></p>";
			//obj.innerHTML += "<input id='g_id" + i + "' type='button' value='" + groupName[1] + "' onclick=\"meetingOrFriendButton('g_id" + i + "')\" />";
			
			obj.innerHTML += "<button id='button_friend' class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect' onclick=\"meetingOrFriendButton('g_id" + i + "')\">" +
			"<i class='material-icons'>person_add</i>" + groupName[1] + "</button>"
			
		}else{
			break;
		}
	}

	obj = document.getElementById("friend");
	//友達をHTMLに書き込む
	for(var i = 0; ; i++){
		re = new RegExp("f_id" + i);
		if( document.cookie.match(re) ){
			//writeChat("system", "system", "f_id" + i + " : " + getCookie("f_id" + i));
			//obj.innerHTML += "<p>" + getCookie("f_id_hname" + i) + "<input type='radio' name='radiobox' value='f_id" + i + "' onchange='talkGet()' /></p>";
			//obj.innerHTML += "<input id='f_id" + i + "' type='button' value='" + getCookie("f_id_hname" + i) + "' onclick=\"meetingOrFriendButton('f_id" + i + "')\" />";
			
			obj.innerHTML += "<button id='button_friend' class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect' onclick=\"meetingOrFriendButton('f_id" + i + "')\"><i class='material-icons'>person_add</i>" + getCookie("f_id_hname" + i) + "</button>"
			
		}else{
			break;
		}
	}

	console.log("writeMeetingAndFriendメソッドはちゃんと終了しました。")
}

/**
 * クッキーの指定要素を取得するメソッド
 * ↓のコピペです。
 * http://www.seta-blog.co.jp/javascript%E3%81%A7cookie%E3%82%92%E6%89%B1%E3%81%86%E3%81%A8%E3%81%8D%E3%81%AB%E4%BE%BF%E5%88%A9%E3%81%AA3%E3%81%A4%E3%81%AE%E9%96%A2%E6%95%B0%E3%82%92%E4%BD%9C%E3%81%A3%E3%81%A6%E3%81%BF%E3%81%BE/
 *
 * @param name	タグの名前を指定
 */
function getCookie(name){
	var rslt = null, tgtCk = name + '=', Cks = document.cookie, pos = Cks.indexOf(tgtCk);
	if(pos != -1){
		var sIndx = pos + tgtCk.length, eIndx = Cks.indexOf(';', sIndx);
	if(eIndx == -1){
		eIndx = Cks.length;
	}
	rslt = decodeURIComponent(Cks.substring(sIndx, eIndx));
	}
	return rslt;
}

/**
 * チャットボックスにログを書き込むメソッド<br>
 * オートスクロールしてくれます。
 *
 * @param tag		nameにつけるclassタグ
 * @param name	メッセージの先頭につける名前
 * @param mes		メッセージ
 */
function writeChat(tag, name, mes){
	var obj = document.getElementById("chatlog");
	obj.innerHTML +=   "<dt class='" + tag +"'>" + name + " ： </dt><dd>" + mes + "</dd>";//chatlogに出力
	obj.scrollTop = document.getElementById("chatlog").scrollHeight;
	talkReload();
}

/**
 * ログアウトメソッド
 */
function logout() {
	//peerjs関連のサーバに切断を通知
	mypeer.destroy();
	location.href='../php/logout.php';
}