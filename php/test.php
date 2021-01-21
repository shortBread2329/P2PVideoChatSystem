<?php
require('dbconnect.php');
	error_reporting(E_ALL & ~E_NOTICE);
	session_start();

	// ログインの処理

	$record = mysqli_query($db,$sql) or die(mysqli_error($db));
	if ($table = mysqli_fetch_assoc($record)) {
		// ログインのSQL文成功
		// ログイン情報を記録する


		// ログイン成功
		// ユーザ情報を記録する
		//第4引数はクッキーが有効になるディレクトリの指定
		setcookie('u_id',			$table['u_id'],				time()+60*60*24*14,		'/', '153.120.166.104');
		setcookie('u_pass',		$table['u_pass'],			time()+60*60*24*14,		'/', '153.120.166.104');
		setcookie('u_name',	$table['u_name'],		time()+60*60*24*14,		'/', '153.120.166.104');
		setcookie('u_hname',	$table['u_hname'],		time()+60*60*24*14,		'/', '153.120.166.104');
		setcookie('u_sex',		$table['u_sex'],			time()+60*60*24*14,		'/', '153.120.166.104');
		setcookie('u_mail',		$table['u_mail'],			time()+60*60*24*14,		'/', '153.120.166.104');
		setcookie('u_created',	$table['u_created'],	time()+60*60*24*14,		'/', '153.120.166.104');

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
		//}

		$_SESSION['key'] = $_POST['u_id'];

		//ログインデータ保持
		if ($_SESSION['key']){
			//include_once 'u_login.php';
		}

		header('Location: ../html/index.html');
		exit;

	//なにこれ
	}elseif (!empty( $_POST[u_name] ) ){
		echo "insert Success" . "<br>";
		header('Location: ../html/login.html');

	//SQL失敗
	}else {
		echo "not found" . "<br>";
		//追加処理


		//header('Location: ../html/index.html');
		exit();
	}


	//DB切断必要?
	mysql_close($db) or die("MySQL切断に失敗しました。");
?>