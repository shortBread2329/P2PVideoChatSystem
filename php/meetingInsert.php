<?php

/*
*
* 11/16
* 会議に人を追加する
*/

require('dbconnect.php');
error_reporting(E_ALL & ~E_NOTICE);
session_start();

//ここあってるんだろうかGETが心配
//追加する友達
$insertId = $_GET['insertId'];
$groupId = $_GET['g_id'];

//実行するSQL文
$sql = sprintf('SELECT * FROM user WHERE u_id="%s" AND u_pass="%s"', $_COOKIE("u_id"), $_COOKIE("u_pass"));
$record = mysqli_query($db,$sql) or die(mysqli_error($db));
if ($table = mysqli_fetch_assoc($record)) {
	//自分のIDがちゃんとあった
	//グループ検索
	$sql2 = sprintf(	"SELECT g_id FROM group WHERE g_id = %s", $groupId);
	$record2 = mysqli_query($db,$sql2) or die(mysqli_error($db));
	if ($table2 = mysqli_fetch_assoc($record2)) {
		//グループ発見
		//グループにメンバーを追加

		$sql3 = sprintf(	"INSERT INTO grouplist(g_id, u_id) VALUES(%s, %s)", $groupId, $insertId);
		$record3 = mysqli_query($db,$sql2) or die(mysqli_error($db));
		$table3 = mysqli_fetch_assoc($record3);

		echo "g_id=".$table3[g_id]." u_id=".$table3[u_id];
	}
}

?>