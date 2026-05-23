<?php
namespace App\Controllers\Api;
use CodeIgniter\Controller;
use CodeIgniter\API\ResponseTrait;
use App\Models\PengajuanSertifikasiModel;
use App\Models\SoalModel;

class Ujian extends Controller {
    use ResponseTrait;

    private function getRequestData() {
        $contentType = $this->request->getHeaderLine('Content-Type');
        if (strpos($contentType, 'application/json') !== false) {
            try {
                return $this->request->getJSON(true) ?? [];
            } catch (\Exception $e) {
                return [];
            }
        }
        $data = $this->request->getPost();
        if (empty($data)) $data = $this->request->getRawInput();
        return $data ?? [];
    }

    // POST /api/ujian/set-jadwal
    public function setJadwal() {
        $json = $this->getRequestData();
        if (!isset($json['id_pengajuan']) || !isset($json['jadwal_ujian'])) {
            return $this->fail('Parameter id_pengajuan dan jadwal_ujian diperlukan.', 400);
        }

        $pengajuanModel = new PengajuanSertifikasiModel();
        $pengajuan = $pengajuanModel->find($json['id_pengajuan']);
        if (!$pengajuan) {
            return $this->fail('Pengajuan tidak ditemukan.', 404);
        }
        
        $durasi = isset($json['durasi_ujian']) ? (int)$json['durasi_ujian'] : 120;

        $pengajuanModel->update($pengajuan['id'], [
            'jadwal_ujian' => $json['jadwal_ujian'],
            'durasi_ujian' => $durasi,
            'status_ujian' => 'Belum'
        ]);

        return $this->respond([
            'success' => true,
            'message' => 'Jadwal ujian berhasil ditetapkan.'
        ]);
    }

    // GET /api/ujian/soal/:id_pengajuan
    public function getSoal($id_pengajuan) {
        $pengajuanModel = new PengajuanSertifikasiModel();
        $pengajuan = $pengajuanModel->find($id_pengajuan);
        if (!$pengajuan) return $this->fail('Pengajuan tidak ditemukan.', 404);

        $perawatModel = new \App\Models\PerawatModel();
        $perawat = $perawatModel->find($pengajuan['id_perawat']);
        $kategori_pendidikan = 'S1 Ners';
        if ($perawat && (stripos($perawat['pendidikan_terakhir'], 'DIII') !== false || stripos($perawat['pendidikan_terakhir'], 'D3') !== false)) {
            $kategori_pendidikan = 'D3';
        }

        if ($pengajuan['status'] !== 'Approved') {
            return $this->fail('Pengajuan belum disetujui (Approved). Ujian tidak dapat dimulai.', 403);
        }

        if (empty($pengajuan['jadwal_ujian'])) {
            return $this->fail('Jadwal ujian belum ditetapkan oleh admin.', 403);
        }

        $jadwal = strtotime($pengajuan['jadwal_ujian']);
        if (time() < $jadwal) {
            return $this->fail('Waktu ujian belum tiba. Jadwal: ' . $pengajuan['jadwal_ujian'], 403);
        }

        if ($pengajuan['status_ujian'] === 'Selesai') {
            return $this->fail('Ujian sudah selesai. Anda tidak dapat mengakses soal lagi.', 403);
        }
        
        // Update status to 'Sedang Dikerjakan' if not already
        if ($pengajuan['status_ujian'] !== 'Sedang Dikerjakan') {
            $pengajuanModel->update($pengajuan['id'], ['status_ujian' => 'Sedang Dikerjakan']);
        }

        $soalModel = new SoalModel();
        // Fetch questions based on education level
        $soal = $soalModel->where('pendidikan_soal', $kategori_pendidikan)->orderBy('id_soal', 'ASC')->findAll();

        // REMOVE ANSWER KEYS!
        $safeSoal = array_map(function($s) {
            unset($s['jawaban_benar']);
            return $s;
        }, $soal);

        return $this->respond([
            'success' => true,
            'soal' => $safeSoal,
            'durasi' => $pengajuan['durasi_ujian'] // in minutes
        ]);
    }

    // POST /api/ujian/submit/:id_pengajuan
    public function submit($id_pengajuan) {
        $json = $this->getRequestData();
        if (!isset($json['jawaban']) || !is_array($json['jawaban'])) {
            return $this->fail('Format jawaban tidak valid.', 400);
        }

        $pengajuanModel = new PengajuanSertifikasiModel();
        $pengajuan = $pengajuanModel->find($id_pengajuan);
        if (!$pengajuan) return $this->fail('Pengajuan tidak ditemukan.', 404);

        $perawatModel = new \App\Models\PerawatModel();
        $perawat = $perawatModel->find($pengajuan['id_perawat']);
        $kategori_pendidikan = 'S1 Ners';
        if ($perawat && (stripos($perawat['pendidikan_terakhir'], 'DIII') !== false || stripos($perawat['pendidikan_terakhir'], 'D3') !== false)) {
            $kategori_pendidikan = 'D3';
        }

        if ($pengajuan['status_ujian'] === 'Selesai') {
            return $this->fail('Ujian sudah selesai dan disubmit sebelumnya.', 403);
        }

        $soalModel = new SoalModel();
        $semuaSoal = $soalModel->where('pendidikan_soal', $kategori_pendidikan)->findAll();
        
        $kunciJawaban = [];
        foreach ($semuaSoal as $s) {
            $kunciJawaban[$s['id_soal']] = trim(strtoupper($s['jawaban_benar']));
        }

        $jawabanUser = $json['jawaban']; // associative array [id_soal => "A", id_soal2 => "B"]
        $benar = 0;
        $total = count($kunciJawaban);

        if ($total == 0) {
            return $this->fail('Tidak ada data soal di server.', 500);
        }

        foreach ($jawabanUser as $id_soal => $jawab) {
            if (isset($kunciJawaban[$id_soal]) && trim(strtoupper($jawab)) === $kunciJawaban[$id_soal]) {
                $benar++;
            }
        }

        // Calculate score out of 100
        $nilai = ($benar / $total) * 100;

        // Update DB
        $pengajuanModel->update($pengajuan['id'], [
            'status_ujian' => 'Selesai',
            'nilai_ujian' => $nilai,
            'detail_jawaban_ujian' => json_encode($jawabanUser)
        ]);

        return $this->respond([
            'success' => true,
            'message' => 'Ujian berhasil disubmit.',
            'nilai' => round($nilai, 2),
            'benar' => $benar,
            'total' => $total
        ]);
    }

    // GET /api/ujian/hasil/:id_pengajuan
    public function hasil($id_pengajuan) {
        $pengajuanModel = new PengajuanSertifikasiModel();
        $pengajuan = $pengajuanModel->find($id_pengajuan);
        if (!$pengajuan) return $this->fail('Pengajuan tidak ditemukan.', 404);

        $perawatModel = new \App\Models\PerawatModel();
        $perawat = $perawatModel->find($pengajuan['id_perawat']);
        $kategori_pendidikan = 'S1 Ners';
        if ($perawat && (stripos($perawat['pendidikan_terakhir'], 'DIII') !== false || stripos($perawat['pendidikan_terakhir'], 'D3') !== false)) {
            $kategori_pendidikan = 'D3';
        }

        if ($pengajuan['status_ujian'] !== 'Selesai') {
            return $this->fail('Ujian belum selesai.', 400);
        }

        $soalModel = new SoalModel();
        $soal = $soalModel->where('pendidikan_soal', $kategori_pendidikan)->orderBy('id_soal', 'ASC')->findAll();
        $jawabanUser = [];
        if (!empty($pengajuan['detail_jawaban_ujian'])) {
            $jawabanUser = json_decode($pengajuan['detail_jawaban_ujian'], true);
        }

        return $this->respond([
            'success' => true,
            'soal' => $soal, // includes jawaban_benar since this is for admin
            'jawaban_user' => $jawabanUser,
            'nilai' => $pengajuan['nilai_ujian']
        ]);
    }

    // POST /api/ujian/reset/:id_pengajuan
    public function reset($id_pengajuan) {
        $pengajuanModel = new PengajuanSertifikasiModel();
        $pengajuan = $pengajuanModel->find($id_pengajuan);
        if (!$pengajuan) return $this->fail('Pengajuan tidak ditemukan.', 404);

        // Reset the exam data
        $pengajuanModel->update($pengajuan['id'], [
            'status_ujian' => 'Belum',
            'nilai_ujian' => 0,
            'detail_jawaban_ujian' => null
        ]);

        return $this->respond([
            'success' => true,
            'message' => 'Ujian berhasil di-reset. Peserta dapat mengulangi ujian sesuai jadwal yang ditentukan.'
        ]);
    }
}
