/*#########################
 * manyの初期化処理とログアウトメソッド
 * 小物メソッドもここにあるかも
 */


const N0 = 0;
var talkChan = N0;//ぼつになるかも
var myname;
var ninzu = 0;
var meetinglist = [];
var cookieLog = {
		u_id : getFromCookie("u_id"),
		u_pass : getFromCookie("u_pass"),
		u_name : getFromCookie("u_name"),
		u_hname : getFromCookie("u_hname"),
		u_sex : getFromCookie("u_sex"),
		u_mail : getFromCookie("u_mail"),
		u_created : getFromCookie("u_created"),
};
//ログイン処理
var mypeer =  login();
var file = null;

/**
 * ログインメソッド
 * @returns {Peer}	発行されたPeerオブジェクトを返す。
 */
function login(){
	//他の変数の初期化処理
	if(CookieInit() == true){
		meetingListInit();
		myname = getCookie("u_hname");
		/**
		 * Peerコンストラクタ。
		 * idの生成、
		 * シグナリングサーバ、STUNサーバへの接続
		 */
		return new Peer(getFromCookie("u_id"),{//自分の情報がはいったpeerオブジェクト
		/*シグナリングサーバ*/
			host: "153.120.166.104",
			port: 9000,
			key: 'peerjs',
		/*STUNサーバ*/
			config: { 'iceServers': [{ 'url': 'stun:153.120.166.104:3478' }] },
		/*ライブラリからのログの出力の設定*/
			debug: 3
		});
	}
}

//ブラウザの判別
if(navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
else	console.log("ブラウザが非対応です。");

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

/**
 *id生成に成功したときに起動するメソッド
 *自分の情報を会議リストとHTMLに書き込む
 *他イベント待機
 *mainメソッドみたいになっている。
 */
mypeer.on('open', function(id){
	if((getCookie("u_id") == "") || (getCookie("u_id") == null)){
		if(alert("ログインされていません。"))	location.href='start.html';
	}else if(
			//他もいつかかけ未完成です
			(getCookie("u_id") == "") || (getCookie("u_id") == null) ||
			(getCookie("u_pass") == "") || (getCookie("u_pass") == null) ||
			(getCookie("u_name") == "") || (getCookie("u_name") == null) ||
			(getCookie("u_hname") == "") || (getCookie("u_hname") == null)) {

		if(alert("正しくログインできませんでした。"))	location.href='start.html';
	}
	document.getElementById("myname").innerHTML = " ID :" + getCookie("u_id") + "　　NAME:" + getCookie("u_hname");

	//書き込み処理
	writeMeetingAndFriend();
	/**
	 * ドロップされた場合に起動するメソッド
	 */
	var showFileList = function(e){
		//オリジナルのイベントデータが欲しい場合originalEventを指定しなければなりません。
		e.originalEvent.preventDefault();//
		//e.preventDefault();//イベントキャンセル(表示orダウンロードのキャンセル
		console.log("ドロップされた");
		file = e.originalEvent.target.files[0] || e.originalEvent.dataTransfer.files[0];	//dataTransferオブジェクト
		console.log(file);

	    //document.getElementById("chatlog").innerHTML += file.name + "<br>";//chatlogに出力
		for (var i in meetinglist)		advanceConnect("file", meetinglist[i].id);
		writeChat(myname, file.name + "を送信しました。");
	};

	var dndbox = $("#button_file");
	//showFileListはmanyChat.jsソースの中にあります。
    $(dndbox).on('change', showFileList);
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
	console.log(id);//コンソールを見てください
	console.log(mypeer);// mypeerで生成されたものをコンソールに出してます
	console.log(document.cookie);



});

/**
 * 会議の初期化処理
 */
function meetingListInit(){
	ninzu = 0;
	meetinglist = [];
	meetinglist[ninzu] = {id:getCookie("u_id"), name:getCookie("u_hname"), mediaconn:undefined};
	ninzu++;
}


function CookieInit() {
	var i;
	for(i = 0; document.cookie.match(new RegExp("f_id" + i)); i++)						cookieLog["f_id"+i]							= getFromCookie("f_id" + i);
	for(i = 0; document.cookie.match(new RegExp("f_id_hname" + i)); i++)			cookieLog["f_id_hname"+i]			= getFromCookie("f_id_hname" + i);
	for(i = 0; document.cookie.match(new RegExp("g_id" + i)); i++)						cookieLog["g_id" + i]						= getFromCookie("g_id" + i);
	for(i = 0; document.cookie.match(new RegExp("g_men_hname" + i)); i++)		cookieLog["g_men_hname" + i]		= getFromCookie("g_men_hname" + i);
	for(i = 0; document.cookie.match(new RegExp("g_men_id" + i)); i++)				cookieLog["g_men_id" + i]				= getFromCookie("g_men_id" + i);
	console.log(cookieLog);

	return true;

}
/**
 * cookieLogからコピーしてあるcookieを取得
 * @param name
 */
function getCookie(name){
	console.log(name);
	return cookieLog[name];
}
/**
 * クッキーの指定要素を取得するメソッド
 * ↓のコピペです。
 * http://www.seta-blog.co.jp/javascript%E3%81%A7cookie%E3%82%92%E6%89%B1%E3%81%86%E3%81%A8%E3%81%8D%E3%81%AB%E4%BE%BF%E5%88%A9%E3%81%AA3%E3%81%A4%E3%81%AE%E9%96%A2%E6%95%B0%E3%82%92%E4%BD%9C%E3%81%A3%E3%81%A6%E3%81%BF%E3%81%BE/
 *
 * @param name	タグの名前を指定
 */
function getFromCookie(name){
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
function writeChat(name, mes){
	var obj = document.getElementById("chat_log");
	obj.innerHTML += name + "：" + mes + "\n";//chatlogに出力
	obj.scrollTop = document.getElementById("chat_log").scrollHeight;
	talkReload();
}

/**
 * ログアウトメソッド
 */
function logout() {
	/*
	document.cookie = "u_id=''";
	document.cookie = "u_pass=''";
	document.cookie = "u_name=''";
	document.cookie = "u_hname=''";
	document.cookie = "u_sex=''";
	document.cookie = "u_mail=''";
	document.cookie = "u_created=''";

	var i;
	for(i = 0; document.cookie.match(new RegExp("f_id" + i)); i++)					document.cookie = "f_id" + i + "=''";
	for(i = 0; document.cookie.match(new RegExp("f_id_hname" + i)); i++)		document.cookie = "f_id_hname" + i + "=''";
	for(i = 0; document.cookie.match(new RegExp("g_id" + i)); i++)					document.cookie = "g_id" + i + "=''";
	for(i = 0; document.cookie.match(new RegExp("g_men_hname" + i)); i++)	document.cookie = "g_men_hname" + i + "=''";
	for(i = 0; document.cookie.match(new RegExp("g_men_id" + i)); i++)			document.cookie = "g_men_id" + i + "=''";
	*/

	//peerjs関連のサーバに切断を通知
	mypeer.destroy();
	location.href='../php/logout.php';
}