<?php
namespace App\Models;
use CodeIgniter\Model;

class PelatihanModel extends Model
{
    protected $table = 'tabel_pelatihan';
    protected $primaryKey = 'id';
    protected $allowedFields = ['id_perawat', 'nama_pelatihan', 'penyelenggara', 'tanggal_mulai', 'tanggal_selesai', 'jumlah_jam', 'no_sertifikat', 'file'];
}
