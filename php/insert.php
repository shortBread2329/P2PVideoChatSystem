<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>

<?php
echo "you" . "</br>";
//必要データの用意
$error ="123";
$send_id = htmlspecialchars($_POST['u_id']);
$send_ad = htmlspecialchars($_POST['u_mail']);
$send_pass = htmlspecialchars($_POST['u_pass']);
$send_name = htmlspecialchars($_POST['u_name']);
$send_hname = htmlspecialchars($_POST['u_hname']);
if (htmlspecialchars($_POST['u_sex']) == 1){
	$send_sex = "男";
}else {
	$send_sex = "女";
}
$send_birth = htmlspecialchars($_POST['u_birth'])."-". $_POST["u_month"]. "-". $_POST["u_day"];
echo  $send_birth . '<br/>';
			$sql = sprintf('INSERT INTO user (u_id, u_pass, u_name, u_hname, u_sex, u_mail, birth_day)
							VALUES("%s", "%s", "%s", "%s", "%s", "%s", "%s")',
					$send_id,
					$_POST['u_pass'],
					$_POST['u_name'],
					$_POST['u_hname'],
					$send_sex,
					$_POST['u_mail'],
					$send_birth);

echo $sql. "</br>";
include_once 'test.php';
?>
</body>