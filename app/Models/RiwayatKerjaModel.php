<?php
namespace App\Models;
use CodeIgniter\Model;

class RiwayatKerjaModel extends Model
{
    protected $table = 'tabel_riwayat_kerja';
    protected $primaryKey = 'id';
    protected $allowedFields = ['id_perawat', 'posisi', 'instansi', 'tahun_masuk', 'tahun_keluar', 'deskripsi'];
}
