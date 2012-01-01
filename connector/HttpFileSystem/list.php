<?php

$path = $_POST['path'];

$filenames = array();
foreach(glob("*") as $filename) {
	$filenames[] = array(
		'filename' => $filename
	);
}

echo json_encode($filenames);

?>