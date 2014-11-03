<?php
ini_set('date.timezone','Asia/Shanghai');
$isHaveError = false;
if(isset($_POST) && isset($_POST['username']) && isset($_POST['tel']) && isset($_POST['email']) && isset($_POST['content'])){
	$username = $_POST['username'];
	$tel = $_POST['tel'];
	$email = $_POST['email'];
	$content = $_POST['content'];

	if(!preg_match("/^[a-z0-9]([a-z0-9\.]*[-_]?[a-z0-9\.]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i", $email) ||
	   !preg_match("/^(\+86-)?1[3|5|7|8|][0-9]{9}$|^(\d{3,4}-)?\d{7,8}$/", $tel)){
		$isHaveError = true;
	}else{
		$maxfilesize = 1024*3;//3M
		$savefilename = './log/feedback.log';
		if(file_exists($savefilename)){
			$filesize = abs(filesize($savefilename));
			if($filesize >= $maxfilesize){
				$lognum = 0;
				if (false != ($handle = opendir ( './log' ))) {
					while ( false !== ($file = readdir ( $handle )) ) {
						if ($file != "." && $file != ".." && strpos($file,"feedback") > -1) {
							$lognum++;
						}
					}
				}
				rename($savefilename,$savefilename.$lognum);
			}
		}
		$data = array();
		$data['username'] = htmlspecialchars($username);
		$data['tel'] = htmlspecialchars($username);
		$data['email'] = htmlspecialchars($email);
		$data['content'] = htmlspecialchars($content);
		$save_content = date("Y-m-d H:i:s")." ".json_encode($data)."\n\r";
		file_put_contents($savefilename, $save_content , FILE_APPEND);
	}
}
echo $isHaveError?0:1;