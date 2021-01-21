<?php

/*
*村上篤
* 11/16
* 友達追加の際に呼び出されるphp文
* ログインできたらすぐINSERT文
* こんな感じでいいかね
*/

require('dbconnect.php');
error_reporting(E_ALL & ~E_NOTICE);
session_start();

//ここあってるんだろうかGETが心配
$friendid = $_POST['searchid'];
echo "POSTの値は".$friendid."ですね。<br>";

//実行するSQL文
$sql = sprintf("SELECT * FROM user WHERE u_id='%s' AND u_pass='%s'", $_COOKIE["u_id"], $_COOKIE["u_pass"]);
$record = mysqli_query($db,$sql) or die(mysqli_error($db));
if ($table = mysqli_fetch_assoc($record)) {

	//自分のIDがちゃんとあった
	//INSERT文のSQL
	$sql2 = sprintf(	"INSERT INTO friend( u_id, f_id)
						VALUES('%s', '%s'),('%s', '%s')",
						$table['u_id'], $friendid, $friendid, $table['u_id']);
	mysqli_query($db,$sql2) or die(mysqli_error($db));

	//フレンド情報の取得
	$record = mysqli_query($db,sprintf('
				SELECT f_id, u_hname
				FROM friend
				INNER JOIN user
				ON friend.f_id = user.u_id
				WHERE friend.u_id="%s"', $table['u_id'])) or die(mysqli_error($db));
	$table = mysqli_fetch_assoc($record);
	$i = 0;

	while ($table != NULL){
		//フレンドのIDをキャッシュに書き込む
		setcookie('f_id'.$i, $table['f_id'],	time()+60*60*24*14,		'/', '153.120.166.104');
		//フレンドのハンドルネームをキャッシュに書き込む
		setcookie('f_id_hname'.$i, $table['u_hname'],	time()+60*60*24*14,		'/', '153.120.166.104');
		//結果をもう一行読み込み
		$table = mysqli_fetch_assoc($record);
		$i++;
	}
	echo "成功";

	header('Location: ../html/index.html');
	exit;
}

?>