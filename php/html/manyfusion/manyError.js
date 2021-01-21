

/**
 * mypeerに対してエラーが発生した場合(ほとんどのエラー)起動するメソッド
 */
mypeer.on('error', function(err){
	window.alert("mypeerでエラーが発生しました");
	if (err.type == "peer-unavailable")		console.log("ERRORTYPE:" + err.type + " : 入力されたIDは存在しません。再入力してください。");
	else if (err.type == "network")			console.log("ERRORTYPE:" + err.type + " : シグナリングサーバに接続できません。");
	else if (err.type == "server-error")		console.log("ERRORTYPE:" + err.type + " : サーバに到達することができません。");
});
