<?php
namespace App\Controllers\Api;

use CodeIgniter\Controller;
use CodeIgniter\API\ResponseTrait;
use App\Models\UserModel;
use App\Models\PerawatModel;

class Register extends Controller {
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
        if (empty($data)) {
            $data = $this->request->getRawInput();
        }
        return $data ?? [];
    }

    public function checkNik() {
        $data = $this->getRequestData();
        if (empty($data['nik'])) {
            return $this->fail('NIK harus diisi.', 400);
        }

        $nikClean = str_replace(' ', '', $data['nik']);

        $perawatModel = new PerawatModel();
        // Cek apakah NIK (setelah dihapus spasinya) sudah ada
        $existing = $perawatModel->where("REPLACE(nik, ' ', '') =", $nikClean)->first();

        if ($existing) {
            return $this->respond(['exists' => true, 'message' => 'NIK sudah terdaftar.']);
        }

        return $this->respond(['exists' => false, 'message' => 'NIK tersedia.']);
    }

    public function index() {
        $data = $this->getRequestData();

        // 1. Validation
        if (!isset($data['username']) || !isset($data['password']) || !isset($data['nama']) || !isset($data['nik'])) {
            return $this->fail('Data wajib (username, password, nama, nik) harus diisi.', 400);
        }

        $userModel = new UserModel();
        $perawatModel = new PerawatModel();

        // Check unique username
        $existingUser = $userModel->where('username', $data['username'])->first();
        if ($existingUser) {
            return $this->fail('Username sudah digunakan.', 400);
        }

        // Check unique NIK again just in case
        $nikClean = str_replace(' ', '', $data['nik']);
        $existingPerawat = $perawatModel->where("REPLACE(nik, ' ', '') =", $nikClean)->first();
        if ($existingPerawat) {
            return $this->fail('NIK sudah terdaftar.', 400);
        }

        $db = \Config\Database::connect();
        $db->transStart();

        // 2. Create User (Opsi A: Status 'N' menunggu verifikasi)
        $userData = [
            'username' => $data['username'],
            'password' => $data['password'],
            'nama'     => $data['nama'],
            'role'     => 'Perawat',
            'status'   => 'N',
            'no_hp'    => $data['hp'] ?? null
        ];

        $userModel->insert($userData);
        $userId = $userModel->getInsertID();

        // 3. Create Perawat
        $perawatData = [
            'nik'                 => $data['nik'],
            'nip'                 => $data['nip'] ?? '',
            'nama'                => $data['nama'],
            'tempat_lahir'        => $data['tempat_lahir'] ?? null,
            'tanggal_lahir'       => $data['tanggal_lahir'] ?? null,
            'jk'                  => $data['jk'] ?? null,
            'alamat'              => $data['alamat'] ?? null,
            'hp'                  => $data['hp'] ?? null,
            'email'               => $data['email'] ?? null,
            'profesi'             => $data['profesi'] ?? null,
            'unit_kerja'          => $data['unit_kerja'] ?? null,
            'pendidikan_terakhir' => $data['pendidikan_terakhir'] ?? null,
            'status'              => 'N', // Non-aktif/Pending
            'id_user'             => $userId
        ];
        
        $perawatModel->insert($perawatData);

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->fail('Gagal mendaftar, terjadi kesalahan sistem.', 500);
        }

        return $this->respondCreated([
            'success' => true,
            'message' => 'Data berhasil disimpan. Silakan tunggu verifikasi oleh Admin agar akun dapat digunakan.'
        ]);
    }

    public function checkNikExisting() {
        $data = $this->getRequestData();
        if (empty($data['nik'])) {
            return $this->fail('NIK harus diisi.', 400);
        }

        $nikClean = str_replace(' ', '', $data['nik']);

        $perawatModel = new PerawatModel();
        $existing = $perawatModel->where("REPLACE(nik, ' ', '') =", $nikClean)->first();

        if (!$existing) {
            return $this->respond(['exists' => false, 'message' => 'Pegawai dengan NIK tersebut tidak ditemukan. Hubungi Admin.']);
        }

        if (!empty($existing['id_user'])) {
            return $this->respond(['exists' => true, 'has_account' => true, 'message' => 'Pegawai dengan NIK tersebut sudah memiliki akun login.']);
        }

        return $this->respond(['exists' => true, 'has_account' => false, 'id_perawat' => $existing['id_perawat'], 'nama' => $existing['nama']]);
    }

    public function createAccount() {
        $data = $this->getRequestData();
        if (empty($data['id_perawat']) || empty($data['username']) || empty($data['password']) || empty($data['hp'])) {
            return $this->fail('Data wajib tidak lengkap.', 400);
        }

        $userModel = new UserModel();
        $perawatModel = new PerawatModel();

        // Cek username
        $existingUser = $userModel->where('username', $data['username'])->first();
        if ($existingUser) {
            return $this->fail('Username sudah digunakan.', 400);
        }

        $perawat = $perawatModel->find($data['id_perawat']);
        if (!$perawat) {
            return $this->fail('Data perawat tidak ditemukan.', 404);
        }

        if (!empty($perawat['id_user'])) {
            return $this->fail('Data perawat ini sudah tertaut dengan akun login.', 400);
        }

        $db = \Config\Database::connect();
        $db->transStart();

        $userData = [
            'username' => $data['username'],
            'password' => $data['password'],
            'nama'     => $perawat['nama'], // ambil dari data perawat
            'role'     => 'Perawat',
            'status'   => 'A', // Langsung aktif karena pegawainya sudah terdaftar di DB
            'no_hp'    => $data['hp']
        ];

        $userModel->insert($userData);
        $userId = $userModel->getInsertID();

        // Tautkan id_user
        $perawatModel->update($perawat['id_perawat'], ['id_user' => $userId, 'hp' => $data['hp']]);

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->fail('Gagal membuat akun, terjadi kesalahan sistem.', 500);
        }

        return $this->respondCreated([
            'success' => true,
            'message' => 'Akun berhasil dibuat. Anda sekarang dapat login.'
        ]);
    }
}
