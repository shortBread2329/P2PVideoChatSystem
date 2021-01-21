
/*#############################

 	manyのボタンイベントコードや
 	表示系コード

	11/7にファイル分割を変更
 #############################*/


/**
 *id生成に成功したときに起動するメソッド
 *自分の情報を会議リストとHTMLに書き込む
 */
mypeer.on('open', function(id){
	document.getElementById("myid").textContent= id;//生成されたIDをhtmlに出力
	document.getElementById("myname").textContent = getCookie("u_name");

	myname = getCookie("u_name");

	meetingListInit();

	console.log(id);//コンソールを見てください

});

/**
 * 友達追加ボタン
 */
function friendAddBotan(){
	if(document.getElementById("yourid").value == "") return;

	//まず直接アクセスしにいってみる（p2pでとってこれるならこれで終わりにしたい。
	advanceConnect("friendAddInvite", document.getElementById("yourid").value);

	//無理だった場合にDBにいってみる。（これがないとログアウトの友達に招待が送れない。

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

	writeChat("zibun", myname, "<pre>" + document.getElementById("inchat").value + "</pre>");
	//document.getElementById("inchat").value = null;//textarea内を一回からっぽにする
}

/**
 * 会議更新メソッド
 */
function talkReload() {
	if(meetinglist.length < 1) {document.getElementById("meeting").innerHTML = "<dt>友達またはトークを選択してください。</dt>";}
	else{
		document.getElementById("meeting").innerHTML = "<dt>メンバー一覧</dt>";
		for(var i in meetinglist)
			if(i != 0) document.getElementById("meeting").innerHTML += "<dd>・" + meetinglist[i].name + "</dd>";//<dd>" + meetinglist[i].id + "</dd>
	}
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
	}else if (elem.contains("display") == true){
		elem.remove("display");
		elem.add("hide");
	}
	console.log(element + "　hide:" + elem.contains("hide") + "　display:" + elem.contains("display"));
}

function display(element){
	var elem = document.getElementById(element).classList;
	elem.remove("hide");
	elem.add("display");
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
	if( aid < bid || aid == document.getElementById("myid").textContent ) return -1;
	if( aid > bid || bid == document.getElementById("myid").textContent ) return 1;
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
	console.log("ボタン押せたよ");
	console.log("id : " + id);

	var re = new RegExp("f_id[0-9]+");
	if( document.cookie.match(re) ){
		document.getElementById("your_name").innerHTML = getCookie("f_id_hname" + id.substring(4));
		document.getElementById("your_id").innerHTML = getCookie(id);
	}else{
		console.log("elseに行きました正規表現失敗");
		return;
	}

}

/**
 * 会議の初期化処理
 */
function meetingListInit(){
	ninzu = 0;
	meetinglist = [];
	meetinglist[ninzu] = {id:getCookie("u_id"), name:getCookie("u_hname"), mediaconn:undefined};
	ninzu++;
}
