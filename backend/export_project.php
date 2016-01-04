<?php
$f = fopen('php://input', 'r');
$data = stream_get_contents($f);
fclose($f);

if ($data) {
    $json = json_decode($data, true);
    $filename = $json['name'];
    $filepath = '../projects/' . $filename . '.json';
    $project = json_decode(file_get_contents($filepath), true);
    $fp = fopen('../projects/' . $filename . '.csv', 'w');
    foreach ($project['groups'] as $group) {
        fputcsv($fp, [$group['phrase']], ';');
        foreach ($group['items'] as $item) {
            $arr = ['', $item['phrase']];
            if (isset($item['freq'])) {
                $arr = ['', $item['phrase'], $item['freq']];
            }
            if (isset($item['competition'])) {
                $arr = ['', $item['phrase'], $item['freq'], $item['competition']];
            }
            fputcsv($fp, $arr, ';');
        }
    }
    fclose($fp);

    echo $filename . '.csv';
    return true;
}

return false;
