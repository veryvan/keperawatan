<?php

namespace App\Models;

use CodeIgniter\Model;

class GrupModel extends Model
{
    protected $table = 'tabel_grup';
    protected $primaryKey = 'id_grup';
    protected $allowedFields = ['nama_grup'];
    protected $returnType = 'array';
}
