<?php

$path = $_POST['path'];

$filenames = array();
foreach(glob("*") as $filename) {
	$filenames[] = array(
		'filename' => $filename,
		'type' => is_dir($filename) ? 'directory' : 'file'
	);
}

echo json_encode($filenames);

?>