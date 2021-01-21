
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>会員登録</title>
</head>

<body>
<!--
<form action="grouptest.php" method="post">
<input type="text" name="id"/>
<input type="submit" value="検索"/>
</form>
-->

<form action="grouptest.php" method="post">
<p>新規グループ名</p>
<!--<input type="text" name="gname" value=""/>-->

</form>
<?php// echo htmlspecialchars($_POST['gname'], ENT_QUOTES, 'UTF-8'); ?>

<?php
require 'dbconnect.php';
error_reporting(E_ALL & E_NOTICE);

//テーブルがuserで
//一行を呼び出す
 /*$sdate = mysqli_query($db, 'SELECT * FROM user');
 $data  = mysqli_fetch_assoc($sdate);
 echo   $data['u_pass'];*/


//繰り返しですべてを呼び出す
//dbに対してsql文を実行する

//$schid = $_POST["id"];

//フレンドのIDを取得
//$sdata = mysqli_query($db, "SELECT * FROM friend WHERE u_id='$schid'" );
$sdata = mysqli_query($db, "SELECT * FROM friend WHERE u_id=123" );
/**
 * mysqli_fetch_assoc
 * 結果の行を連想配列で取得する
*/
$sql = 'SELECT COUNT(*) as cnt FROM fgroup';
$rs = mysqli_query($db,$sql);
$row = mysqli_fetch_assoc($rs);
$count = $row['cnt'];
echo $count;


while($data = mysqli_fetch_assoc($sdata)){
	//フレンドIDをもとにニックネームを取得
	$fdata = mysqli_query($db,"SELECT * FROM user WHERE u_id='$data[f_id]'");
	while ($data = mysqli_fetch_assoc($fdata)){
	//ニックネーム表示
	//チェックボックスにチェックを入れたフレンドのu_idをポストに格納
	echo "<form action='' method='post'><input type='checkbox' name='gid[]' value='$data[u_id]'>
		".$data['u_hname']."<br /><br />";
	}
}

echo "<input type='text' name='gname' value=''/>";
echo"<input type='submit' name='create' value='招待する' />";

echo $id;

if(isset($_POST['create'])) {
$name = $_POST['gname'];
$id   =  $_POST["gid"];
 	/*
 	 * 何かの登録処理を行う
 	 */

 	// 招待するボタンがクリックされた場合


 	$sql = sprintf("INSERT INTO fgroup(g_id,g_name) VALUES('%d','%s')",$count+1,$name);
 	//echo  $sql;
 	mysqli_query($db,$sql) or die(mysql_error());

 	foreach ($id as $fuser){
 		$sql = sprintf("INSERT INTO joingroup(g_id,u_id) VALUES('%d','%s')",$count+1,$fuser);
 	//echo  $sql;
 	mysqli_query($db,$sql) or die(mysql_error());

 	}
	$sql = sprintf("INSERT INTO joingroup(g_id,u_id) VALUES('%d','123')",$count+1);
 	//echo  $sql;
 	mysqli_query($db,$sql) or die(mysql_error());
 	unset($_POST);
 }

?>
</body>
</html>



