<?php
echo "you login 01". "</br>";
	@session_start();

	echo "you login 02". "</br>";

	if (!empty($_POST)) {
		// ログインの処理

		echo "you login 03". "</br>";

			echo "u_login " . $_SESSION['key']. "</br>";

			$l_uer = $_SESSION['key'];
			$today  = date("Y/m/d");
			$totime = date("H:i:s");

			$job = "insert";
			//SQL
			$u_sql = sprintf('INSERT INTO login (u_id, createdate, createtime)
							VALUES("%s", "%s", "%s")',
					$l_uer,
					$today,
					$totime);
			echo $u_sql. "</br>";

			include_once 'loginview.php';
	}
	 mysql_close($db) or die("MySQL切断に失敗しました。@u_login.php");
?>