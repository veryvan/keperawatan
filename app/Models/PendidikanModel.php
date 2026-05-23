<?php
namespace App\Models;
use CodeIgniter\Model;

class PendidikanModel extends Model
{
    protected $table = 'tabel_pendidikan';
    protected $primaryKey = 'id';
    protected $allowedFields = ['id_perawat', 'pendidikan', 'institusi', 'tahun_lulus'];
}
