<?php
namespace App\Models;
use CodeIgniter\Model;

class SertifikatModel extends Model
{
    protected $table = 'tabel_sertifikat';
    protected $primaryKey = 'id';
    protected $allowedFields = ['id_perawat', 'nama_sertifikat', 'nomor', 'tgl_terbit', 'tgl_expired', 'file'];
}
