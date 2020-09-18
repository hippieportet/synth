<?php
  class Mysql {

    public static function Init(){
      $dsn = 'mysql:dbname=synth;host=localhost;charset=utf8mb4';
      $username = 'root';
      $password = '5845qweR';
      $pdo = new PDO($dsn, $username, $password,
      [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      ]
      );
      return $pdo;
    }

  }
?>
