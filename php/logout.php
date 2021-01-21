<?php

//loginviewの処理分け
//$job = "delete";


//$u_sql = sprintf('DELETE FROM login WHERE u_id = "%s"', $_COOKIE["u_id"]);
//cookie削除
setcookie('u_id',	'', time()-3600,		'/', '153.120.166.104');
setcookie('u_pass',	'', time()-3600,		'/', '153.120.166.104');
setcookie('u_name',	'', time()-3600,		'/', '153.120.166.104');
setcookie('u_hname','', time()-3600,		'/', '153.120.166.104');
setcookie('u_sex',	'', time()-3600,		'/', '153.120.166.104');
setcookie('u_mail',	'', time()-3600,		'/', '153.120.166.104');
setcookie('u_created','', time()-3600,		'/', '153.120.166.104');



for($i = 0; isset($_COOKIE['f_id'.$i]); $i++)
	setcookie('f_id'.$i,'',time()-3600,	'/', '153.120.166.104');

for($i = 0; isset($_COOKIE['f_id_hname'.$i]); $i++)
	setcookie('f_id_hname'.$i,'',time()-3600,		'/', '153.120.166.104');

for($i = 0; isset($_COOKIE['g_id'.$i]); $i++)
	setcookie('g_id'.$i,'',time()-3600,		'/', '153.120.166.104');

for($i = 0; isset($_COOKIE['g_men_hname'.$i]); $i++)
	setcookie('g_men_hname'.$i,'',time()-3600,		'/', '153.120.166.104');

for($i = 0; isset($_COOKIE['g_men_id'.$i]); $i++)
	setcookie('g_men_id'.$i,'',time()-3600,		'/', '153.120.166.104');

//echo $u_sql . '<br>';

include_once 'loginview.php';

?>