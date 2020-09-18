<?php

  define('Bad_Request', 400);

  class RequestData {

    public $Paths;
    public $Post;

    public function __construct(){
      preg_match('|' . dirname($_SERVER['SCRIPT_NAME']) . '/([\w%/]*)|', $_SERVER['REQUEST_URI'], $matches);
      $this->Paths = explode('/', $matches[1]);
      $this->Post = json_decode(file_get_contents('php://input'), true);
    }

    public function GetContentType(){
      return $_SERVER['CONTENT_TYPE'];
    }

    public function GetMethod(){
      return $_SERVER['REQUEST_METHOD'];
    }

    public function GetController(){
      return $this->Paths[0];
    }

    public function GetId(){
      return isset($this->Paths[1]) ? htmlspecialchars($this->Paths[1]) : null;
    }

    public function GetPost(){
      return $this->Post;
    }

    public function CheckRequest(){
      if (strtolower($this->GetContentType()) !== 'application/json') {
        return Bad_Request;
      }
      switch (strtolower($this->GetMethod())){
        case 'get':
        case 'post':
        case 'put':
        case 'delete':
          break;
        default:
         return Bad_Request;
      }
      return 0;
    }

  }
?>
