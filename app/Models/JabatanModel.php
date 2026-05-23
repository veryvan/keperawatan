<?php
namespace App\Models;
use CodeIgniter\Model;

class JabatanModel extends Model
{
    protected $table = 'tabel_jabatan';
    protected $primaryKey = 'id';
    protected $allowedFields = ['nama_jabatan'];
}
