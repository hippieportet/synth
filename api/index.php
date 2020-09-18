<?php

  define('SYSDIR', './sys/');
  define('APIDIR', './api/');

  require_once SYSDIR . 'RequestData.php';
  require_once SYSDIR . 'Mysql.php';

  $request = new RequestData();

  $statusCode = $request->CheckRequest();
  if ($statusCode !== 0){
    http_response_code($statusCode);
    exit;
  }

  $controller = $request->GetController();
  require_once APIDIR . $controller . '.php';
  $apiClass = new $controller;
  $response = $apiClass->Execute($request->GetMethod(), $request->GetId(), $request->GetPost());

  header('Content-Type: application/json; charset=utf-8');
  http_response_code(200);
  echo json_encode($response);
  exit;

?>
