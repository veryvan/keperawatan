<?php
namespace App\Models;
use CodeIgniter\Model;

class JenjangJabatanModel extends Model
{
    protected $table = 'tabel_jenjang_jabatan';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'nama_jenjang',
        'kategori_pendidikan',
        'profesi'
    ];
}
