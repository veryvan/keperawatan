<?php
namespace App\Models;
use CodeIgniter\Model;

class PengajuanSertifikasiModel extends Model
{
    protected $table = 'tabel_pengajuan_sertifikasi';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'id_perawat',
        'jenis_sertifikasi',
        'status',
        'tanggal_pengajuan',
        'detail_kompetensi',
        'file_pendukung',
        'form_data',
        'jadwal_ujian',
        'status_ujian',
        'nilai_ujian',
        'durasi_ujian',
        'detail_jawaban_ujian'
    ];
}
