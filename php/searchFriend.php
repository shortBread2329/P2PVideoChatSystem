
<?php
require 'dbconnect.php';
error_reporting(E_ALL & E_NOTICE);
session_start();

//繰り返しですべてを呼び出す
//dbに対してsql文を実行する
$searchid = $_POST["user_id"];

if(($searchid == '') || ($searchid == $_COOKIE['u_id'])){
	setcookie('searchFriendId', '',	time()-3600,	'/', '153.120.166.104');
	setcookie('searchFriendName', '',	time()-3600,	'/', '153.120.166.104');
	header('Location: ../html/index.html');
	exit;
}

/**
 * mysqli_fetch_assoc
 * 結果の行を連想配列で取得する
*/

	//フレンドIDをもとにニックネームを取得
	//完全一致の場合
$fdata = mysqli_query($db,"SELECT * FROM user WHERE u_id='$searchid'");
if ($data = mysqli_fetch_assoc($fdata)){

	echo "検索が1ヒット";
	setcookie('searchFriendId', $data['u_id'],	time()+60*60*24*14,		'/', '153.120.166.104');
	setcookie('searchFriendName', $data['u_hname'],	time()+60*60*24*14,		'/', '153.120.166.104');

	//ニックネーム表示
	//echo 'ニックネーム：'.$data['u_hname']."<br /><br />";
}else{
	echo "検索が0ヒットなのでキャッシュ消すます";
	setcookie('searchFriendId', '',	time()-3600,	'/', '153.120.166.104');
	setcookie('searchFriendName', '',	time()-3600,	'/', '153.120.166.104');
}

//requireだとPOSTが送信できるんだってさ
//require '../html/index.html';
header('Location: ../html/index.html');
exit;
?>
