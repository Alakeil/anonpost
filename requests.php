<?php
    $server = '192.168.1.3';
    $port = '3306';
    $username = 'root';
    $password = 'iluvfantasyshitxdxd';
    $dbname = 'anonpost';

    $dsn = "mysql:hostname=$server;dbname=$dbname;port=$port;charset=utf8mb4;";

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new pdo($dsn, $username, $password, $options);
    } catch (\PDOException $e) {
        throw new \PDOException($e->getMessage(), (int)$e->getCode());
    }

    // Handle POST requests
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        // Handle request to store a message
        if (!empty($_POST["message"])) {
            $message = $_POST["message"];

            if ($message !== null && $message !== '') {
                    // After a successful connection to the database, store the message
                $sql = "INSERT INTO posts (message, datetime) VALUES (?, now())";

                $query = $pdo->prepare($sql);
                $query->execute([$message]);

                // After the message is stored in the database, return status code 200
                http_response_code(200);
            } else {
                http_response_code(400);
            }
        }
    // Handle GET requests
    } else if ($_SERVER["REQUEST_METHOD"] === "GET") {
        if (!empty($_GET["type"])) {
            if ($_GET["type"] === "getMessages") {
                $sql = "SELECT * FROM posts";

                $query = $pdo->prepare($sql);
                $query->execute();

                $postNum = 0;
                $postArray = array();
                while ($post = $query->fetch()) {
                    $postArray[$postNum] = array(
                        "message" => htmlspecialchars($post["message"]),
                        "date" => $post["datetime"]
                    );

                    $postNum++;
                }

                $jsonData = json_encode($postArray, JSON_PRETTY_PRINT);
                header('Content-Type: application/json');
                echo $jsonData;
            }
        } else {
            echo "NO BITCH";
        }
    }
?>