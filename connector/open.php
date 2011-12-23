<?php

$path = $_POST['path'];

$content = file_get_contents($path);

echo json_encode(array(
	'success' => true,
	'content' => $content
));

?>