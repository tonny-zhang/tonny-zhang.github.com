<?php
header("Access-Control-Allow-Origin: http://github.zk.com");
header("Access-Control-Expose-Headers: FooBar");
echo json_encode(array('name'=>'hello from data.php'));