<?php
//******************************************************************************************
//$dbはテストのテーブルやキーを変更するためここに記述しています。
//『require('dbconnect.php');』とPHP内に記述すれば繋がります。
//mysqli_connect(ホスト名,ユーザー名,パスワード,DB名)
$u_db = mysqli_connect('mysql','root','password','test') or die(mysqli_connect_error());
//文字コード
mysqli_set_charset($u_db,'utf8');
//******************************************************************************************

/*
echo "5131" . '<br>';
//テーブルの指定
$recordSet = mysqli_query($u_db,$u_sql);
echo "5131" . '<br>';
if($job == "insert"){
	echo '<script type="text/javascript"console.log("jobの中身はinsert");</script>';
	if ($recordSet == true){
		echo "ログインユーザ挿入完了" . "<br>";
			if($table = mysqli_fetch_assoc($recordSet)) {
					// ログイン成功
					// ログイン情報を記録する

					echo "ログイン成功 suss". "</br>";

					setcookie('time_id' , $table['u_id'] , time() + 60);
			}
	}elseif ($recordSet == false){
		echo "すでに情報が存在" . '<br>';
	}
}else {
	if ($recordSet == true){
		setcookie("u_id", "", time() - 1800);
		header('Location: ../html/start.html');
	}elseif ($recordSet == false){
		echo "4545why" . '<br>';
	}
}
*/
header('Location: ../html/start.html');
exit;
?>