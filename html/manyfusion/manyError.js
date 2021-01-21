

/**
 * mypeerに対してエラーが発生した場合(ほとんどのエラー)起動するメソッド
 */
mypeer.on('error', function(err){
	if (err.type == "peer-unavailable")		alert(err.type + "相手が不在です。");
	//else if (err.type == "network")			alert(err.type + " : シグナリングサーバに接続できません。");
	else if (err.type == "network")			location.reload();

	else if (err.type == "server-error")		alert(err.type + " : サーバに到達することができません。");
});
