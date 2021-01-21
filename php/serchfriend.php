<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>フレンド検索</title>
</head>

<body>
<form action="serchfriend.php" method="post">
<input type="text" name="id"/>
<input type="submit" value="検索"/>
</form>

<?php
require 'dbconnect.php';
error_reporting(E_ALL & E_NOTICE);

//繰り返しですべてを呼び出す
//dbに対してsql文を実行する
$schid = $_POST["id"];

/**
 * mysqli_fetch_assoc
 * 結果の行を連想配列で取得する
*/

	//フレンドIDをもとにニックネームを取得
$fdata = mysqli_query($db,"SELECT * FROM user WHERE u_id='$schid'");
while ($data = mysqli_fetch_assoc($fdata)){
	//ニックネーム表示
	echo 'ニックネーム：'.$data['u_hname']."<br /><br />";
	}
?>

</body>
</html>
