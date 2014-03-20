<?php
error_reporting(E_ALL ^ E_NOTICE);

$file = './counter.txt';
if($_GET['add']){
	file_put_contents($file, 1, FILE_APPEND | LOCK_EX);
}else{
	$count = @strlen(file($file)[0]);
	if(empty($count)){
		$count = 0;
	}
	// echo $_GET['cb'].'('.$count.')';
	echo $count;
}