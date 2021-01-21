<?php
	if ($_COOKIE["u_id"] == ""){
		header('Location: ../html/login.html');
	}else {
		header('Location: ../html/index.html');
	}
?>