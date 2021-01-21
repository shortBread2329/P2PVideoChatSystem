<?php
//必要データの用意
$error ="123";
$send_id = htmlspecialchars($_GET['u_id']);
$send_ad = htmlspecialchars($_GET['u_mail']);
$send_pass = htmlspecialchars($_GET['u_pass']);
$send_name = htmlspecialchars($_GET['u_name']);
$send_hname = htmlspecialchars($_GET['u_hname']);
$send_sex = htmlspecialchars($_GET['u_sex']);

$sql = sprintf('SELECT * FROM user WHERE u_id="%s" AND u_pass="%s"',
		$send_id,
		$send_pass);
//SQLrun
include_once 'test.php';
?>
