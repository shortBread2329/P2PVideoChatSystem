
/*#############################

 	manyのボタンイベントコードや
 	表示系コード

	11/7にファイル分割を変更
 #############################*/

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


var searchid="";
function getSearchId(){
	searchid = document.getElementById("friend_txt").value;
}
/**
 * 友達追加ボタン
 */
function friendBotan(){
	document.getElementById("searchFriendResult").innerHTML = "";
	if(displayAndHide("form_friend") == "display"){
		hide("form_meeting");
	};
	//if(document.getElementById("yourid").value == "") return;

	//まず直接アクセスしにいってみる（p2pでとってこれるならこれで終わりにしたい。
	//advanceConnect("friendAddInvite", document.getElementById("yourid").value);

	//無理だった場合にDBにいってみる。（これがないとログアウトの友達に招待が送れない。

}

function friendAddBotan(){
	location.href='../php/friendInsert.php';
}

function meetingBotan(){
	if(displayAndHide("form_meeting") == "display"){
		hide("form_friend");
	};
}

function muteBotan(){
	alert("未実施です");
	console.log("未実施です");
}


/**
 * 友達の削除ボタン
 * できてないまま
 */
function friendDelBotan(){
	if(document.getElementById("yourid").value == "") return;
}


/**
 *チャット送信ボタンを押したときに起動するメソッド
 */
function talkAddBotan(){
	if(document.getElementById("yourid").value == "") return;
	if(ninzu >= meetingLimit){
		document.getElementById("chatlog").innerHTML += "<p class='system'>無料機能では3人まで利用可能です。</p>";
		return;
	}

	for(var i in meetinglist)		if(document.getElementById("yourid").value == meetinglist[i].id)	return;//同じIDの人を追加しようとしたらりたーん
	advanceConnect("invite", document.getElementById("yourid").value);

	talkReload();
}

/**
 *会議に追加ボタンを押したときに起動するメソッド
 * @param id			必須
 * @param name	なにこれ
 */
function addMeeting(id,name){
	for(i in meetinglist)	if(id == meetinglist[i].id){
		window.alert("同じ人を追加しようとしました。");
		return;//同じIDの人を追加しようとしたらりたーん
	}
	//document.getElementById("friend").innerHTML	+= "<div class='talkname'>" + name + "</div>" + "<div class='talkid'>" + id + "</div>";//あとでなおせ
	writeChat("system", sysname, "会議に" + name + "(ID:" + id +")さんを追加しました。");
	meetinglist[ninzu] = {id:id, name:name, mediaconn:undefined};
	ninzu++;
	meetinglist.sort(namesort);

	talkReload();

}

/**
 * 会議に招待されたときに起動するメソッド
 * @param id			必須
 * @param name	なにこれ
 */
function inviteMeeting(id,name){
	for(i in meetinglist)	if(id == meetinglist[i].id)	return;//同じIDの人を追加しようとしたらリターン
	document.getElementById("meeting").innerHTML	+= "<div class='talkname'>" + name + "</div>" + "<div class='talkid'>" + id + "</div>";//あとでなおせ
	writeChat("system", sysname, "会議に" + name + "(ID:" + id +")さんが追加されました。");
	meetinglist[ninzu] = {id:id, name:name, mediaconn:undefined};
	ninzu++;
	meetinglist.sort(namesort);

	talkReload();

}

/**
 * 会議から自分だけ抜けるときに起動するメソッド
 */
function talkDelBotan(){
	if(ninzu <= 0)	return;
	if(document.getElementById("yourid").value == "")	{
		if(window.alert("削除したいidをyouridに入力して削除を押してください。"))	return;
	}

	var delid = document .getElementById("yourid").value;

	for(var i in meetinglist)	advanceConnect("del", meetinglist[id].id, delid);

	for(var i in meetinglist){
		if(meetinglist[i].id == delid){
			writeChat("", myname, "会議から" + meetinglist[i].name + "(ID:" + delid +")さんを削除しました。");
			meetinglist.splice(i, 1);//削除
			ninzu--;
			break;
		}
	}

	talkReload();

	console.log("削除のテスト。");
	console.log(meetinglist);
	console.log(delid);
}

/**
 * 会議から抜けるボタンが押されたときに起動するメソッド
 */
function talkExitBotan(){

	for(var i in meetinglist){
		if(i != 0)advanceConnect("del", meetinglist[i].id , meetinglist[0].id);
	}

	for(var i in meetinglist){
		if(document.getElementById("myid").innerHTML != meetinglist[i].id){
			console.log("spliceしました。");
			meetinglist.splice(i, 1);//削除
			ninzu--;
			break;
		}
	}

	console.log("splice結果");
	console.log(meetinglist);

	talkReload();

}

/**
 * チャット送信ボタン(onclickで呼び出される
 */
function chatBotan(){
	//getMyName();

	console.log(meetinglist);
	for (var i in meetinglist)	advanceConnect("chat", meetinglist[i].id);

	writeChat(myname, document.getElementById("chat_me").value);
}

//mainbox1
function homeBotan(){
	display("main-box1");
	hide("main-box2");
	hide("main-box3");
	hide("main-box4");
}

//mainbox2
function setteiBotan(){
	hide("main-box1");
	display("main-box2");
	hide("main-box3");
	hide("main-box4");
}
//mainbox3
function profBotan(){
	hide("main-box1");
	hide("main-box2");
	display("main-box3");
	hide("main-box4");
}
//mainbox4
function taikaiBotan(){
	hide("main-box1");
	hide("main-box2");
	hide("main-box3");
	display("main-box4");
}

/**
 * 会議更新メソッド
 */
function talkReload() {
	/*
	 * とりあえずコメントにしたけど絶対戻すこと
	if(meetinglist.length < 1) {document.getElementById("meeting").innerHTML = "<dt>友達またはトークを選択してください。</dt>";}
	else{
		document.getElementById("meeting").innerHTML = "<dt>メンバー一覧</dt>";
		for(var i in meetinglist)
			if(i != 0) document.getElementById("meeting").innerHTML += "<dd>・" + meetinglist[i].name + "</dd>";//<dd>" + meetinglist[i].id + "</dd>
	}
	*/
}

/**
 * エレメントに対して表示中のものは非表示に、非表示中のものは表示するメソッド
 * @param element	エレメントに指定したid
 */
function displayAndHide(element){
	var elem = document.getElementById(element).classList;
	if(elem.contains("hide") == true){
		elem.remove("hide");
		elem.add("display");
		return "display";

	}else if (elem.contains("display") == true){
		elem.remove("display");
		elem.add("hide");
		return "hide";
	}
	console.log(element + "　hide:" + elem.contains("hide") + "　display:" + elem.contains("display"));
}

//表示
function display(element){
	var elem = document.getElementById(element).classList;
	elem.remove("hide");
	elem.add("display");
}
//非表示
function hide(element){
	var elem = document.getElementById(element).classList;
	elem.remove("display");
	elem.add("hide");
}

/**
 * 自分の名前を取得するメソッド
 * なにこれ
 */
function getMyName(){//mynameボックスの入力から名前を取得
	myname = document.getElementById("myname").value;
	if(myname == "" || myname == null)	myname = "no_name";
}

/**
 *<p> meetinglistに対して自分のidのものを上に、その他をidの昇順にするsort用引数に使用するメソッド</p>
 *
 * <p>friednlist.sort()の引数として使用してください。</p>
 *
 * @param a	左の要素のインデックス番号
 * @param b	右の要素のインデックス番号
 * @returns {Number}	-1は入れ替えないフラグ。1なら入れ替えるフラグという意味で返す。
 */
function namesort(a,b){
	var aid = a["id"];
	var bid = b["id"];
	if( aid < bid || aid == getCookie("u_id") ) return -1;
	if( aid > bid || bid == getCookie("u_id") ) return 1;
	return 0;
}


/**
 * ラジオボックスが切り替わった際に呼び出されるメソッド
 * 現在のラジオボックスの状態を読み取り、
 * 話し相手を表示する。
 */
/*
function talkGet(){
	var radioList = document.getElementsByName("radiobox");
	for(var i=0; i<radioList.length; i++){
		if (radioList[i].checked) {
			console.log(radioList[i].value + "が選択されました");
			meetingListInit();
			if(radioList[i].value.match(/^f_id/)){
				meetinglist[ninzu] = {	id:getCookie(radioList[i].value),
													name:getCookie((radioList[i].value).substring(0,4) +"_hname" + (radioList[i].value).substring(4,radioList[i].value.length)),
													mediaconn:undefined};
				ninzu++;
			}else if(radioList[i].value.match(/^g_id/)){

				//groupid[0] が、DB上のg_idが戻る。
				var groupid = getCookie("g_id" + i).split("_");

				for(j=0; ; j++ ){
					var re = new RegExp("g_men_id" + j);
					if( document.cookie.match(re) ){
						re = new RegExp("^" + groupid[0] + "_");
						if(getCookie("g_men_id" + j).match(re)){
							//getCookie("g_men_hname" + j)
							var memberId = getCookie("g_men_id"+j).split("_");
							if(memberId[1] == getCookie("u_id"))	continue;
							meetinglist[ninzu] = {	id:memberId[1],
																name:getCookie("g_men_hname"+j),
																mediaconn:undefined};
							ninzu++;
						}
					}else{
						break;
					}

				}
			}
			console.log(meetinglist);
			talkReload();
			break;
		}
	}
}
*/


/**
 * マテリアルデザイン用
 * ラジオボックスをやめてBUTTONにしよう。
 */
function meetingOrFriendButton(id) {
	console.log("id : " + id);

	meetingListInit();
	if( id.match(/^f_id[0-9]+$/) ){
		//meetinglistに選択された友達を追加
		meetinglist[ninzu] = {	id:getCookie(id),	name:getCookie("f_id_hname" + id.substring(4)),mediaconn:undefined};

		//HTMLに名前とIDを記述
		document.getElementById("your_name").innerHTML = meetinglist[ninzu].name;
		document.getElementById("your_id").innerHTML = meetinglist[ninzu].id;

		ninzu++;

	}else if(id.match(/^g_id[0-9]+$/)){

		//groupid[0] が、DB上のg_idが戻る。
		var groupid = getCookie(id).split("_");

		document.getElementById("your_name").innerHTML = "";
		document.getElementById("your_id").innerHTML = "";

		for(var j=0; ; j++ ){
			var re = new RegExp("g_men_id" + j);
			if( document.cookie.match(re) ){
				re = new RegExp("^" + groupid[0] + "_");
				if(getCookie("g_men_id" + j).match(re)){
					//getCookie("g_men_hname" + j)
					var memberId = getCookie("g_men_id"+j).split("_");
					if(memberId[1] == getCookie("u_id"))	continue;
					meetinglist[ninzu] = {	id:memberId[1],
														name:getCookie("g_men_hname"+j),
														mediaconn:undefined};
					//HTMLに名前とIDを記述
					document.getElementById("your_name").innerHTML += meetinglist[ninzu].name + "<br>";
					document.getElementById("your_id").innerHTML += meetinglist[ninzu].id + "<br>";

					ninzu++;
				}
			}else{
				break;
			}
		}

	}else{
		console.log("elseに行きました正規表現失敗");
	}

	console.log(meetinglist);
}


/**
*グループのdivボックス内とフレンドのdivボックス内にクッキーの情報からデータを書き込むメソッド
*/
function writeMeetingAndFriend(){
	var obj = document.getElementById("searchFriendResult");
	if( (document.cookie.match(new RegExp("searchFriendId"))) && (getFromCookie("searchFriendId") != "") ){
		//obj.innerHTML =getCookie("searchFriendResult");
		obj.innerHTML =
		"<form id='form_meeting' class='mdl-textfield mdl-js-textfield mdl-textfield--floating-label' name='friendAddFm' action='../php/friendInsert.php' method='POST'>" +
	 	//"<input name='group_name' id='group_txt' class='mdl-textfield__input'  type='text' maxlength='20' id='f_id' />" +
		"<input type='text' name='searchid' class='hide' value='" + getFromCookie("searchFriendId") + "' />" +
		"<label id='addFriendname'>" + getFromCookie("searchFriendId") + "<br>" + getFromCookie("searchFriendName") + " さん</label>" +
		"<input type='submit' value='追加'/>" +
		"</form>";

		/*
		"<form>" +
		"<button id='button_mic' class='mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect' title='追加' onclick=\"friendAddBotan('" + searchid + "')\" >" +
		"<i class='material-icons'>person_add</i></button>" +
		"</form>";
		*/

		display("form_friend");
	}

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
			"<i class='material-icons'>people</i>" + groupName[1] + "</button>"

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

			obj.innerHTML += "<button id='button_friend' class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect' onclick=\"meetingOrFriendButton('f_id" + i + "')\">" +
								/*"<label class='mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect' for='checkbox-2'>" +
								  "<input type='checkbox' id='checkbox-2' class='mdl-checkbox__input'>" +
								"</label>" +*/
					"<i class='material-icons'>person</i>" + getCookie('f_id_hname' + i) +
					"</button>";

		}else{
			break;
		}
	}

	console.log("writeMeetingAndFriendメソッドはちゃんと終了しました。")
}