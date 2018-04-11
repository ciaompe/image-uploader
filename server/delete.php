<?php

header('Content-type:application/json;charset=utf-8');

try {

	$filename = ($_GET['file'] != null || $_GET['file'] != '') ? $_GET['file'] : null;
	$filepath = dirname(__DIR__)."/server/files/";

	if ($filename != null) {
		
		if (file_exists($filepath.$filename)) {
			unlink($filepath.$filename);

			echo json_encode([
				'status' => 'success',
				'message' => 'file deleted'
			]);
		} else {
			throw new RuntimeException('File not found.');
		}
	} else {
		throw new RuntimeException('Incorrect file name.');

	}


}catch (RuntimeException $e) {
	// Something went wrong, send the err message as JSON
	http_response_code(400);

	echo json_encode([
		'status' => 'error',
		'message' => $e->getMessage()
	]);
}
