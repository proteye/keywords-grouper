<?php
$filename = $_GET['filename'];
if ($filename) {
    header('Content-Disposition: attachment; filename=' . $filename);
    echo file_get_contents('../projects/' . $filename);
    return true;
}

return false;
