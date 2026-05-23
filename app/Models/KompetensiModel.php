<?php
namespace App\Models;
use CodeIgniter\Model;

class KompetensiModel extends Model
{
    protected $table = 'tabel_kompetensi';
    protected $primaryKey = 'id';
    protected $allowedFields = ['kode_kompetensi', 'nama_kompetensi', 'kategori', 'unit'];
}
