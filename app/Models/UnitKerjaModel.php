<?php
namespace App\Models;
use CodeIgniter\Model;

class UnitKerjaModel extends Model
{
    protected $table = 'tabel_unit_kerja';
    protected $primaryKey = 'id';
    protected $allowedFields = ['nama_unit'];
}
