<?php
namespace App\Controllers\Api;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class User extends ResourceController {
    use ResponseTrait;
    protected $modelName = 'App\Models\UserModel';
    protected $format    = 'json';

    public function index() { 
        $users = $this->model->findAll();
        $db = \Config\Database::connect();
        $perawatList = $db->table('tabel_perawat')->where('id_user IS NOT NULL')->get()->getResultArray();
        $perawatMap = [];
        foreach ($perawatList as $p) {
            $perawatMap[$p['id_user']] = $p['id_perawat'];
        }

        foreach ($users as &$u) {
            unset($u['password']);
            $u['id_perawat'] = $perawatMap[$u['id']] ?? '';
        }
        return $this->respond($users); 
    }

    public function show($id = null) { 
        $data = $this->model->find($id); 
        if ($data) {
            unset($data['password']);
            return $this->respond($data);
        }
        return $this->failNotFound(); 
    }

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

    public function create() {
        $data = $this->getRequestData();
        if ($this->model->insert($data)) {
            $insertedId = $this->model->getInsertID();
            $user = $this->model->find($insertedId);
            unset($user['password']);

            if (!empty($data['id_perawat'])) {
                $db = \Config\Database::connect();
                $db->table('tabel_perawat')->where('id_perawat', $data['id_perawat'])->update(['id_user' => $insertedId]);
            }

            return $this->respondCreated($user);
        }
        return $this->fail($this->model->errors());
    }

    public function update($id = null) {
        $data = $this->getRequestData();
        if (isset($data['password']) && empty($data['password'])) {
            unset($data['password']);
        }
        if ($this->model->update($id, $data)) {
            $user = $this->model->find($id);
            unset($user['password']);

            if (isset($data['id_perawat'])) {
                $db = \Config\Database::connect();
                $db->table('tabel_perawat')->where('id_user', $id)->update(['id_user' => null]);
                if (!empty($data['id_perawat'])) {
                    $db->table('tabel_perawat')->where('id_perawat', $data['id_perawat'])->update(['id_user' => $id]);
                }
            }

            return $this->respond($user, 200);
        }
        return $this->fail($this->model->errors());
    }

    public function delete($id = null) {
        $user = $this->model->find($id);
        if ($user && $user['username'] === 'admin') {
            return $this->fail('Akun admin utama tidak dapat dihapus.', 400);
        }
        return $this->model->delete($id) ? $this->respondDeleted(['id' => $id]) : $this->failNotFound();
    }

    public function ubahPassword() {
        $json = $this->getRequestData();
        if (!$json || !isset($json['id_user']) || !isset($json['old_password']) || !isset($json['new_password'])) {
            return $this->fail('Data tidak lengkap.', 400);
        }

        $user = $this->model->find($json['id_user']);
        if (!$user) {
            return $this->failNotFound('User tidak ditemukan.');
        }

        if (!password_verify($json['old_password'], $user['password'])) {
            return $this->fail('Password lama salah.', 400);
        }

        if ($this->model->update($user['id'], ['password' => $json['new_password']])) {
            return $this->respond(['success' => true, 'message' => 'Password berhasil diubah.']);
        }
        return $this->fail('Gagal mengubah password.', 500);
    }

    public function sendOtpHp() {
        $json = $this->getRequestData();
        if (!$json || !isset($json['id_user']) || !isset($json['no_hp'])) {
            return $this->fail('ID User dan No HP harus diisi.', 400);
        }

        $user = $this->model->find($json['id_user']);
        if (!$user) {
            return $this->failNotFound('User tidak ditemukan.');
        }

        $otp = sprintf('%06d', mt_rand(0, 999999));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+5 minutes'));

        $this->model->update($user['id'], [
            'no_hp' => $json['no_hp'],
            'is_hp_validated' => 0,
            'otp_code' => $otp,
            'otp_expires_at' => $expiresAt
        ]);

        // Send OTP via Fonnte
        $token = 'TPzFmvYRqod3SmbBm2fT';
        $curl = curl_init();
        curl_setopt_array($curl, array(
          CURLOPT_URL => 'https://api.fonnte.com/send',
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'POST',
          CURLOPT_SSL_VERIFYPEER => false,
          CURLOPT_POSTFIELDS => array(
            'target' => $json['no_hp'],
            'message' => "Halo *{$user['nama']}*,\n\nKode OTP Anda untuk validasi nomor WhatsApp adalah:\n\n*{$otp}*\n\nKode ini berlaku selama 5 menit.\n\nSIM KOMKEP RSLH"
          ),
          CURLOPT_HTTPHEADER => array(
            "Authorization: $token"
          ),
        ));
        
        $response = curl_exec($curl);
        curl_close($curl);

        return $this->respond([
            'success' => true,
            'message' => 'OTP validasi telah dikirim ke WhatsApp Anda.',
            'dev_otp' => $otp
        ]);
    }

    public function verifyOtpHp() {
        $json = $this->getRequestData();
        if (!$json || !isset($json['id_user']) || !isset($json['otp'])) {
            return $this->fail('ID User dan OTP harus diisi.', 400);
        }

        $user = $this->model->find($json['id_user']);
        if (!$user) {
            return $this->failNotFound('User tidak ditemukan.');
        }

        if (empty($user['otp_code']) || $user['otp_code'] !== $json['otp']) {
            return $this->fail('OTP salah.', 400);
        }

        if (strtotime($user['otp_expires_at']) < time()) {
            return $this->fail('OTP sudah kedaluwarsa.', 400);
        }

        $this->model->update($user['id'], [
            'is_hp_validated' => 1,
            'otp_code' => null,
            'otp_expires_at' => null
        ]);

        return $this->respond([
            'success' => true,
            'message' => 'Nomor WhatsApp berhasil divalidasi.'
        ]);
    }
}
