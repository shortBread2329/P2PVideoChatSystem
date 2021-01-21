<?php

/*
*
* 11/16
* からの会議を作成する
*
* 11/16
* 完成
* 正常動作をしています。
*/

require('dbconnect.php');
error_reporting(E_ALL & ~E_NOTICE);
session_start();

//ここあってるんだろうかGETが心配
//追加する友達
$insertId = $_POST['group_name'];
if(($insertId == "") || ($insertId == NULL)){
	header('Location: ../html/index.html');
	exit;
}
echo $insertId;
echo "わはー<br>";
//実行するSQL文
$sql = sprintf('SELECT * FROM user WHERE u_id="%s" AND u_pass="%s"', $_COOKIE["u_id"], $_COOKIE["u_pass"]);
$record = mysqli_query($db,$sql) or die(mysqli_error($db));
if ($table = mysqli_fetch_assoc($record)) {
	//自分のIDがちゃんとあった

	echo "IDとPWは大丈夫<br>";

	//INSERT文のSQL
	$sql2 = sprintf("SELECT MAX(g_id) AS maxid FROM fgroup");
	$record2 = mysqli_query($db,$sql2) or die(mysqli_error($db));
	if ($table2 = mysqli_fetch_assoc($record2)) {

		echo "g_idの最大値は".$table2['maxid']."<br>";
		echo (int)$table2["maxid"] + 1;
		echo "<br>";

		//INSERT文
		$sql3 = sprintf("INSERT INTO fgroup(g_id, g_name) VALUES(%d, '%s')", (int)$table2["maxid"] + 1, $insertId);
		$record3 = mysqli_query($db,$sql3) or die(mysqli_error($db));
		$table3 = mysqli_fetch_assoc($record3);

		//自分をグループに参加させる
		$sql3 = sprintf("INSERT INTO joingroup(g_id, u_id) VALUES(%d, '%s')", (int)$table2["maxid"] + 1, $_COOKIE["u_id"]);
		$record3 = mysqli_query($db,$sql3) or die(mysqli_error($db));
		$table3 = mysqli_fetch_assoc($record3);

		//グループ情報を取得するのSQL文
		$groupSql =  sprintf('SELECT G1.g_id, fgroup.g_name, G2.u_id
				FROM joingroup AS G1
				INNER JOIN fgroup
				ON G1.g_id = fgroup.g_id
				INNER JOIN joingroup AS G2
				ON fgroup.g_id = G2.g_id
				WHERE G1.u_id="%s"',
				$table['u_id']) or die(mysqli_error($db));
		$record2 = mysqli_query($db,$groupSql);
		$table2 = mysqli_fetch_assoc($record2);

		$i = 0;
		$mem = "";
		while ($table2 != NULL){

			//g_nameが被っている場合はキャッシュに書き込まないようにcontinue
			if($mem == $table2['g_name']){
				$table2 = mysqli_fetch_assoc($record2);
				continue;
			}

			//g_menをキャッシュ
			$mem = $table2['g_name'];

			//グループIDとグループネームをキャッシュに書き込み
			setcookie('g_id'.$i,	$table2['g_id']."_".$table2['g_name'],	time()+60*60*24*14,		'/', '153.120.166.104');
			$table2 = mysqli_fetch_assoc($record2);
			$i++;
		}

		//もう1回グループ情報を取得するSQLを書いて、やりなおす。（キャッシュに同時に書き込めないため
		//ちなみに少し違う
		$groupSql =  sprintf('SELECT G1.g_id, fgroup.g_name, G2.u_id, user.u_hname
				FROM joingroup AS G1
				INNER JOIN fgroup
				ON G1.g_id = fgroup.g_id
				INNER JOIN joingroup AS G2
				ON fgroup.g_id = G2.g_id
				INNER JOIN user
				ON G2.u_id = user.u_id
				WHERE G1.u_id="%s"',
				$table['u_id']) or die(mysqli_error($db));
		$record2 = mysqli_query($db,$groupSql);
		$table2 = mysqli_fetch_assoc($record2);

		$i = 0;
		while ($table2 != NULL){
			//グループメンバーのIDをキャッシュに書き込む
			setcookie('g_men_id'.$i,	$table2['g_id']."_".$table2['u_id'],	time()+60*60*24*14, '/', '153.120.166.104');

			//グループメンバーのハンドルネームをキャッシュに書き込む
			setcookie('g_men_hname'.$i,	$table2['u_hname'],	time()+60*60*24*14,		'/', '153.120.166.104');

			$table2 = mysqli_fetch_assoc($record2);
			$i++;
		}
	}
	header('Location: ../html/index.html');
	exit;
}
?>