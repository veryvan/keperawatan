<?php
$file = isset($argv[1]) ? $argv[1] : 'frontend/src/App.jsx';
$query = isset($argv[2]) ? $argv[2] : '';

if (!file_exists($file)) {
    die("File not found: $file\n");
}

$lines = file($file);
foreach ($lines as $i => $line) {
    if (stripos($line, $query) !== false) {
        echo ($i + 1) . ": " . trim($line) . "\n";
    }
}
