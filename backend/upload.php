<?php
if (!is_dir('../json')) {
    mkdir('../json', 0755);
}
$filename = substr($_FILES['file']['name'], 0, strrpos($_FILES['file']['name'], '.')) . '.json';
if ($_POST['type'] == 'keywords') {
    $filepath = '../json/' . $filename;
    if (preg_match('/\.csv/i', $_FILES['file']['name'])) {
        $keywords = [];
        $phrase = $freq = $competition = false;
        $fp = fopen($_FILES['file']['tmp_name'], 'r');
        $data = fgetcsv($fp, 1024, ";");
        foreach ($data as $key => $val) {
            if (preg_match('/Phrase/i', $val) || preg_match('/Фраза/i', $val)) {
                $phrase = $key;
            } elseif (preg_match('/Freq/i', $val) || preg_match('/Частота/i', $val)) {
                $freq = $key;
            } elseif (preg_match('/Конкуренция/i', $val)) {
                $competition = $key;
            }
        }
        $i = 0;
        while (($data = fgetcsv($fp, 1024, ";")) !== FALSE) {
            $keyword = ['id' => (int)$i, 'phrase' => $data[$phrase]];
            if ($freq !== false) {
                $keyword['freq'] = (int)$data[$freq];
            }
            if ($competition !== false) {
                $keyword['competition'] = (int)$data[$competition];
            }
            $keywords[$i++] = $keyword;
        }
        fclose($fp);
        file_put_contents($filepath, json_encode($keywords));
    } else {
        move_uploaded_file($_FILES['file']['tmp_name'], $filepath);
    }
    echo $filename;
    return true;
} elseif ($_POST['type'] == 'project') {
    $filepath = '../projects/' . $filename;
    move_uploaded_file($_FILES['file']['tmp_name'], $filepath);
    echo $filename;
    return true;
} else {
    return false;
}
