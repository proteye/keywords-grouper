<?php
$f = fopen('php://input', 'r');
$data = stream_get_contents($f);
fclose($f);

if ($data) {
    $json = json_decode($data, true);
    $filename = $json['name'];
    if (!is_dir('../projects')) {
        mkdir('../projects', 0755);
    }
    file_put_contents('../projects/' . $filename . '.json', json_encode($json['project']));

    header('Content-Disposition: attachment');
    echo $filename . '.json';
    return true;
}

return false;
