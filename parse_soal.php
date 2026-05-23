<?php
$conn = new mysqli('localhost', 'root', '', 'keperawatan');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Clear existing
$conn->query("TRUNCATE TABLE tabel_soal");

$file = fopen("SOAL.md", "r");
if (!$file) {
    die("Failed to open SOAL.md");
}

$current_question = '';
$options = [];
$correct_answer = '';
$kompetensi = '';

$kompetensi_mapping = [
    'Komunikasi Terapeutik & Etika Profesi' => 'KD-01',
    'Pencegahan dan Pengendalian Infeksi' => 'KD-11',
    'Pemenuhan Kebutuhan Oksigenasi' => 'KD-06',
    'Pemenuhan Kebutuhan Cairan dan Elektrolit' => 'KD-07',
    'Pemenuhan Kebutuhan Nutrisi dan Eliminasi' => 'KD-10', // Or KD-09/KD-10
    'Perawatan Luka Dasar' => 'KD-05',
    'Pemberian Obat Aman' => 'KD-08',
    'Manajemen Nyeri' => 'KD-04', // Fallback?
    'Mobilisasi dan Keselamatan' => 'KD-12',
    'Pemantauan Tanda-Tanda Vital' => 'KD-03',
    'Resusitasi Jantung Paru' => 'KD-04',
    'Dokumentasi Asuhan' => 'KD-04'
];

$stmt = $conn->prepare("INSERT INTO tabel_soal (id_kompetensi, pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, opsi_e, jawaban_benar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

$state = 'seek'; // seek, read_question, read_options
$q_buffer = '';

function saveQuestion($stmt, &$kompetensi, &$q_buffer, &$options, &$correct_answer) {
    if (trim($q_buffer) != '' && count($options) >= 2) {
        $a = $options['A'] ?? '';
        $b = $options['B'] ?? '';
        $c = $options['C'] ?? '';
        $d = $options['D'] ?? '';
        $e = $options['E'] ?? '';
        $stmt->bind_param("ssssssss", $kompetensi, trim($q_buffer), $a, $b, $c, $d, $e, $correct_answer);
        $stmt->execute();
    }
    $q_buffer = '';
    $options = [];
    $correct_answer = '';
}

while (($line = fgets($file)) !== false) {
    $t_line = trim($line);
    if (empty($t_line)) continue;
    
    // Check for Kompetensi header
    if (preg_match('/^##.*\sKompetensi\s\d+:\s*(.*?)\s*\(/i', $t_line, $matches)) {
        $title = $matches[1];
        $kompetensi = 'KD-00'; // default
        foreach ($kompetensi_mapping as $key => $kd) {
            if (stripos($title, $key) !== false) {
                $kompetensi = $kd;
                break;
            }
        }
        continue;
    }
    
    // Check for new question (number. text)
    if (preg_match('/^(\d+)\.\s+(.*)$/', $t_line, $matches)) {
        saveQuestion($stmt, $kompetensi, $q_buffer, $options, $correct_answer);
        $q_buffer = $matches[2];
        $state = 'read_question';
        continue;
    }
    
    // Check for options: - A. text or - **A. text** or `o` A. text
    // Need a robust regex for this
    if (preg_match('/^(?:-\s*)?(?:`o`\s*)?(?:\*\*)?([A-E])\.\s+(.*?)(?:\*\*)?$/i', $t_line, $matches)) {
        $opt_letter = strtoupper($matches[1]);
        $opt_text = $matches[2];
        
        // is it the correct answer?
        if (strpos($t_line, '**') !== false) {
            $correct_answer = $opt_letter;
            // clean up any trailing ** in opt_text just in case
            $opt_text = str_replace('**', '', $opt_text);
        }
        $options[$opt_letter] = trim($opt_text);
        $state = 'read_options';
        continue;
    }
    
    // Append to question or option
    if ($state == 'read_question') {
        $q_buffer .= " " . $t_line;
    } else if ($state == 'read_options') {
        // sometimes options are multiline or just skipped
    }
}

// save last question
saveQuestion($stmt, $kompetensi, $q_buffer, $options, $correct_answer);

fclose($file);
$conn->close();
echo "Questions parsed and saved.";
?>
