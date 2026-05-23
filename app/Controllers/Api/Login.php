<?php
namespace App\Controllers\Api;
use CodeIgniter\Controller;
use CodeIgniter\API\ResponseTrait;
use App\Models\UserModel;

class Login extends Controller {
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

    public function index() {
        $json = $this->getRequestData();
        if (!$json || !isset($json['username']) || !isset($json['password'])) {
            return $this->fail('Username dan password harus diisi.', 400);
        }

        $userModel = new UserModel();
        $user = $userModel->where('username', $json['username'])
                          ->where('status', 'A')
                          ->first();

        if (!$user || !password_verify($json['password'], $user['password'])) {
            return $this->fail('Username atau password salah atau akun dinonaktifkan.', 401);
        }

        // Generate OTP
        $otp = sprintf('%06d', mt_rand(0, 999999));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+5 minutes'));

        $updateData = [
            'otp_code' => $otp,
            'otp_expires_at' => $expiresAt
        ];
        $userModel->update($user['id'], $updateData);

        // Send OTP via Fonnte WhatsApp API if HP is validated
        if (!empty($user['is_hp_validated']) && $user['is_hp_validated'] == 1 && !empty($user['no_hp'])) {
            $token = 'TPzFmvYRqod3SmbBm2fT';
            $target = $user['no_hp'];
            
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
                'target' => $target,
                'message' => "Halo *{$user['nama']}*,\n\nKode OTP Anda untuk login ke Sistem Keperawatan adalah:\n\n*{$otp}*\n\nKode ini berlaku selama 5 menit. Jangan berikan kode ini kepada siapa pun.\n\nSIM KOMKEP RSLH"
              ),
              CURLOPT_HTTPHEADER => array(
                "Authorization: $token"
              ),
            ));
            
            curl_exec($curl);
            curl_close($curl);
            
            return $this->respond([
                'success' => true,
                'require_otp' => true,
                'message' => 'OTP telah dikirim ke WhatsApp Anda (berlaku 5 menit).'
            ]);
        }

        return $this->respond([
            'success' => true,
            'require_otp' => true,
            'message' => 'OTP telah dibuat (berlaku 5 menit).',
            'dev_otp' => $otp // Note: Displayed here for testing purposes
        ]);
    }

    public function verifyOtp() {
        $json = $this->getRequestData();
        if (!$json || !isset($json['username']) || !isset($json['otp'])) {
            return $this->fail('Username dan OTP harus diisi.', 400);
        }

        $userModel = new UserModel();
        $user = $userModel->where('username', $json['username'])
                          ->where('status', 'A')
                          ->first();

        if (!$user) {
            return $this->fail('Akun tidak ditemukan atau tidak aktif.', 404);
        }

        if (empty($user['otp_code']) || $user['otp_code'] !== $json['otp']) {
            return $this->fail('OTP salah.', 400);
        }

        if (strtotime($user['otp_expires_at']) < time()) {
            return $this->fail('OTP sudah kedaluwarsa.', 400);
        }

        // Clear OTP
        $userModel->update($user['id'], [
            'otp_code' => null,
            'otp_expires_at' => null
        ]);

        unset($user['password']);
        return $this->respond([
            'success' => true,
            'message' => 'Login berhasil.',
            'user'    => $user
        ]);
    }

    public function forgotPasswordOtp() {
        $json = $this->getRequestData();
        if (empty($json['username'])) {
            return $this->fail('Username harus diisi.', 400);
        }

        $userModel = new UserModel();
        $user = $userModel->where('username', $json['username'])->first();

        if (!$user || empty($user['no_hp'])) {
            return $this->fail('Akun tidak ditemukan atau tidak memiliki nomor HP terdaftar.', 404);
        }

        $otp = sprintf('%06d', mt_rand(0, 999999));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+5 minutes'));

        $userModel->update($user['id'], [
            'otp_code' => $otp,
            'otp_expires_at' => $expiresAt
        ]);

        $token = 'TPzFmvYRqod3SmbBm2fT';
        $target = $user['no_hp'];
        
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
            'target' => $target,
            'message' => "Halo *{$user['nama']}*,\n\nKode OTP Anda untuk mereset password adalah:\n\n*{$otp}*\n\nKode ini berlaku selama 5 menit. Jangan berikan kode ini kepada siapa pun.\n\nSIM KOMKEP RSLH"
            ),
            CURLOPT_HTTPHEADER => array(
            "Authorization: $token"
            ),
        ));
        
        curl_exec($curl);
        curl_close($curl);

        return $this->respond([
            'success' => true,
            'message' => 'OTP untuk reset password telah dikirim ke WhatsApp Anda.',
            'dev_otp' => $otp // Testing purposes
        ]);
    }

    public function resetPassword() {
        $json = $this->getRequestData();
        if (empty($json['username']) || empty($json['otp']) || empty($json['new_password'])) {
            return $this->fail('Data tidak lengkap.', 400);
        }

        $userModel = new UserModel();
        $user = $userModel->where('username', $json['username'])->first();

        if (!$user) {
            return $this->fail('Akun tidak ditemukan.', 404);
        }

        if (empty($user['otp_code']) || $user['otp_code'] !== $json['otp']) {
            return $this->fail('OTP salah.', 400);
        }

        if (strtotime($user['otp_expires_at']) < time()) {
            return $this->fail('OTP sudah kedaluwarsa.', 400);
        }

        // Reset password
        $userModel->update($user['id'], [
            'password' => $json['new_password'], // Model will auto hash it because of beforeUpdate hook or password hashing logic in Model
            'otp_code' => null,
            'otp_expires_at' => null
        ]);

        return $this->respond([
            'success' => true,
            'message' => 'Password berhasil diubah. Silakan login dengan password baru.'
        ]);
    }
}
