<?php

namespace App\Models;

use CodeIgniter\Model;

class PerawatModel extends Model
{
    protected $table            = 'tabel_perawat';
    protected $primaryKey       = 'id_perawat';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'nip', 'nik', 'nama', 'tempat_lahir', 'tanggal_lahir', 'jk',
        'alamat', 'hp', 'email', 'profesi', 'unit_kerja', 'jabatan', 'status',
        'foto', 'file_str', 'file_sip',
        'no_str', 'masa_berlaku_str', 'no_sip', 'masa_berlaku_sip',
        'pendidikan_terakhir', 'no_ijazah', 'grup', 'id_user'
    ];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;
}
