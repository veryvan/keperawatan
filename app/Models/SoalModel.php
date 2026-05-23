<?php
namespace App\Models;
use CodeIgniter\Model;

class SoalModel extends Model
{
    protected $table = 'tabel_soal';
    protected $primaryKey = 'id_soal';
    protected $allowedFields = [
        'id_kompetensi',
        'pertanyaan',
        'opsi_a',
        'opsi_b',
        'opsi_c',
        'opsi_d',
        'opsi_e',
        'jawaban_benar',
        'pendidikan_soal'
    ];
}
