<?php
  class Temperament {

    public function Execute($method, $id, $post){
      $pdo = Mysql::Init();
      switch (strtolower($method)) {
        case 'post':
          return $this->Create($pdo, $post);
        case 'get':
          return $this->Read($pdo, $id);
        case 'put':
          return $this->Update($pdo, $id, $post);
        case 'delete';
          return $this->Delete($pdo, $id);
        default:
          return null;
      }
    }

    public function Create($pdo, $post){
      $stmt = $pdo->prepare('INSERT INTO Temperament VALUES(:id, :name, :value)');
      $stmt->execute(array(':id' => null, ':name' => $post['name'], ':value' => $post['value']));
      return array('status' => 'OK');
    }

    public function Read($pdo, $id){
      if ($id === null){
        $stmt = $pdo->prepare('SELECT * FROM Temperament');
        $stmt->execute();
      } else {
        $stmt = $pdo->prepare('SELECT * FROM Temperament WHERE id = :id');
        $stmt->execute(array(':id' => $id));
      }
      $rows = $stmt->fetchAll();
      return $rows;
    }

    public function Update($pdo, $id, $post){
      $stmt = $pdo->prepare('UPDATE Temperament SET name = :name, value = :value WHERE id = :id');
      $stmt->execute(array(':id' => $id, ':name' => $post['name'], ':value' => $post['value']));
      return array('status' => 'OK');
    }

    public function Delete($pdo, $id){
      $stmt = $pdo->prepare('DELETE FROM Temperament WHERE id = :id');
      $stmt->execute(array(':id' => $id));
      return array('status' => 'OK');
    }

  }
?>
