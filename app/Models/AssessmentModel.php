<?php
namespace App\Models;
use CodeIgniter\Model;

class AssessmentModel extends Model
{
    protected $table = 'tabel_assessment';
    protected $primaryKey = 'id';
    protected $allowedFields = ['id_perawat', 'id_kompetensi', 'asesor', 'nilai', 'status', 'catatan', 'tanggal'];
}
