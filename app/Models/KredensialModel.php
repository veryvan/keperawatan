<?php
namespace App\Models;
use CodeIgniter\Model;

class KredensialModel extends Model
{
    protected $table = 'tabel_kredensial';
    protected $primaryKey = 'id';
    protected $allowedFields = ['id_perawat', 'status', 'tanggal', 'masa_berlaku', 'catatan'];
}
