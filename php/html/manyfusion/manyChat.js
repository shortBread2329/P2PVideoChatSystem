
/*#############################

 	manyのクライアント(受信側)コード
 	エラー取得コード

 	11/7にファイル分割を変更
 #############################*/

/**
 * 相手からの接続があった時の処理
 */
mypeer.on('connection', function(conn) {//connはdataconnection型オブジェクト
	conn.on("data",function(data){
		if(conn.label == "chat"){
			document.getElementById("yourid").value = conn.peer;//あいてのID入力ボックスに、相手のIDを強制入力する。
			writeChat("aite", conn.metadata, "<pre>"+ data + "</pre>");
		}else if(conn.label == "file"){
			console.log(data);
			 if (data.constructor === ArrayBuffer) {//ここら辺がまだよくわかってないです。
				 var dataView = new Uint8Array(data);
				 var dataBlob = new Blob([dataView]);//Blob クラスは、File クラスの原型となるクラス
				 var url = window.URL.createObjectURL(dataBlob);
				writeChat("aite", conn.metadata, "<a download='" + conn.metadata + "' target='_blank' href='" + url + "'>" + conn.metadata + "</a>");
			}
		}else if(conn.label == "invite"){//招待された
			if(data == meetinglist) return;

			if(!window.confirm(conn.peer + "さんの会議に参加しますか？"))	return;
			advanceConnect("invited", conn.peer);

			talkReload();
			console.log(data);
			console.log(meetinglist);

			for (var j in data){
				var i = 0;
				for (; i < meetinglist.length; i++)
					if(data[j].id == meetinglist[i].id)	break;

				if(i == meetinglist.length)	inviteMeeting(data[j].id, data[j].name);
			}


		}else if(conn.label == "invited"){//招待を送ってOKされた。
			addMeeting(data[0].id, data[0].name);//相手を追加する。
			for (var i = 0; i < meetinglist.length; i++){
				if((meetinglist[i].id != conn.peer) && (meetinglist[i].id != document.getElementById("myid").textContent)){
					advanceConnect("talkreload", meetinglist[i].id);
				}
			}
			talkReload();

			//document.getElementById("yourid").value = null;
		}else if(conn.label == "talkreload"){//会議の更新
			if(data.length >= meetinglist.length){//会議に追加更新
				for (var j in data){
					var i = 0;
					for (; i < meetinglist.length; i++)
						if(data[j].id == meetinglist[i].id)	break;

					if(i == meetinglist.length)	inviteMeeting(data[j].id, data[j].name);
				}
			}else{//会議から削除更新
				for (var i in meetinglist){
					var j = 0;
					for (; j < data.length; j++)
						if(meetinglist[i].id == data[j].id)	break;

					if(j == data.length){
						document.getElementById("chatlog").innerHTML	+=  "<dt class='sysname'>" + sysname + " ： </dt><dd>会議から" + meetinglist[i].name + "(ID:" + meetinglist[i].id +")さんが退出しました。</dd>";
						meetinglist.splice(i, 1);//削除
						ninzu--;
					}
				}
			}
		}else if(conn.label == "friendAddInvite"){
			console.log("友達の招待がきたよー");

			if(!window.confirm(conn.peer + "さんから友達の招待が来ました。"))	return;

			console.log(data);

			document.getElementById("friend").innerHTML +=
				"<div>" +
				"id : " + data.u_id +
				"<br>hname : " + data.u_hname +
				"</div>";


			advanceConnect("friendAddInvited", data.u_id);


		}else if(conn.label == "friendAddInvited"){
			console.log("友達の招待がOKされたよー");


			console.log(data);

			document.getElementById("friend").innerHTML +=
				"<div>" +
				"id : " + data.u_id +
				"<br>hname : " + data.u_hname +
				"</div>";



		}else if((conn.label == "nextonsei") || (conn.label == "nextvideo")){
			nextlist = data;
		}else if(conn.label == "del"){//メンバーの削除依頼
			console.log("削除依頼を受信しました。1");
			for(var i in meetinglist){
				if(meetinglist[i].id == data){
					console.log("削除依頼を受信しました。2");
					if(i == 0)	writeChat("", myname, "会議から抜けました。");//自分が消された。
					else		writeChat("", myname, "会議から" + meetinglist[i].name + "(ID:" + meetinglist[i].id +")さんが抜けました。");//第三者がけされた。
					meetinglist.splice(i, 1);//削除
					ninzu--;
				}
			}
		}else{
			console.log("mypeer.on('connection', functionでエラーが発生しました。");
			console.log(conn);
		}
	});
	conn.close();
})

/**
 * コネクトをこちらから送信する場合
 * @param mode
 * @param index
 */
function advanceConnect(mode, id, data){
	console.log(mode);
	console.log(id);

	//チャットを送信する
	if(mode == "chat") {
		//該当するすべてに関数を実行
		var dataconn = mypeer.connect(id,{label: mode, metadata:myname});//connectで指定したIDに接続。戻り値はdataconnectionオブジェクト
		dataconn.on("open",function(){//ちゃんと戻ってきて生成に成功した場合
			if(document.getElementById("inchat").value != "")	dataconn.send(document.getElementById("inchat").value);//相手に送る
		})
	//ファイルを送信する
	}else if(mode == "file") {
		var dataconn = mypeer.connect(id,{label: mode, metadata:file.name});
		dataconn.on("open",function(){
			dataconn.send(file);
		})
	//トークの招待する。
	}else if(mode == "invite"){
		var dataconn = mypeer.connect(id,{label:mode,	metadata:myname});//connectで指定したIDに接続。戻り値はdataconnectionオブジェクト
		dataconn.on("open",function(){//ちゃんと戻ってきて生成に成功した場合
			dataconn.send(meetinglist);
			console.log(meetinglist);
		})
	//トークに招待された。
	}else if(mode == "invited") {
		var dataconn = mypeer.connect(id,{label:mode,	metadata:myname});//connectで指定したIDに接続。戻り値はdataconnectionオブジェクト
		dataconn.on("open",function(){//ちゃんと戻ってきて生成に成功した場合
			dataconn.send(meetinglist);
			console.log(meetinglist);
		})

	}else if(mode == "talkreload"){
		var dataconn = mypeer.connect(id,{label:mode,	metadata:myname});//connectで指定したIDに接続。戻り値はdataconnectionオブジェクト
		dataconn.on("open",function(){//ちゃんと戻ってきて生成に成功した場合
			dataconn.send(meetinglist);
			console.log("talkreload");
		})
	//友達の招待する。
	}else if(mode == "friendAddInvite"){
		var dataconn = mypeer.connect(id,{label:mode,	metadata:myname});//connectで指定したIDに接続。戻り値はdataconnectionオブジェクト
		dataconn.on("open",function(){//ちゃんと戻ってきて生成に成功した場合

			var friendBox = {
					u_id : getCookie("u_id"),
					u_name : getCookie("u_name"),
					u_hname : getCookie("u_hname"),
					u_sex : getCookie("u_sex"),
					u_mail : getCookie("u_mail")
			}

			dataconn.send(friendBox);
			console.log("friendAddInvite");
		})
	}
	//友達の招待された。(ダイアログに対してOKを押した。
	else if(mode == "friendAddInvited"){

		console.log("friendAddInvited0");

		var dataconn = mypeer.connect(id,{label:mode,	metadata:myname});//connectで指定したIDに接続。戻り値はdataconnectionオブジェクト
		dataconn.on("open",function(){//ちゃんと戻ってきて生成に成功した場合

			var friendBox = {
					u_id : getCookie("u_id"),
					u_name : getCookie("u_name"),
					u_hname : getCookie("u_hname"),
					u_sex : getCookie("u_sex"),
					u_mail : getCookie("u_mail")
			}

			dataconn.send(friendBox);
			console.log("friendAddInvited");
		})
	}else if(mode == "nextonsei" || mode == "nextvideo"){
		console.log("nextonseiのとこらへん");
		/*
			//var list = meetinglist.slice(0);//コピー
			var list = [];
			for(var i in meetinglist)	list[i] = meetinglist[i].id;

			list.splice(0, 1);//削除
			console.log(list);
			var dataconn = mypeer.connect(list[0],{label:mode,	metadata:myname});//connectで指定したIDに接続。戻り値はdataconnectionオブジェクト
			dataconn.on("open",function(){//ちゃんと戻ってきて生成に成功した場合
				dataconn.send(list);
				console.log("nextコネクト");
				console.log(list);
			});
		*/
	}else if(mode == "del"){
		//if(arguments.length != 3) throw new Error("advanceConnectでエラーが発生しました。モードdel");
		console.log("削除データ送信メソッドにいきました。");
		var dataconn = mypeer.connect(id,{label:mode, metadata:myname});//connectで指定したIDに接続。戻り値はdataconnectionオブジェクト
		dataconn.on("open",function(){//ちゃんと戻ってきて生成に成功した場合
			dataconn.send(data);
			console.log("削除データを送信しました");
		})
	}else{
		console.log("advanceConnectメソッドでエラーが発生しました。");
	}
}
