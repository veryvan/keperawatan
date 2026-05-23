<?php
namespace App\Models;
use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table = 'tabel_user';
    protected $primaryKey = 'id';
    protected $allowedFields = ['username', 'password', 'nama', 'role', 'status', 'no_hp', 'is_hp_validated', 'otp_code', 'otp_expires_at'];

    protected $beforeInsert = ['hashPassword'];
    protected $beforeUpdate = ['hashPassword'];

    protected function hashPassword(array $data)
    {
        if (isset($data['data']['password']) && !empty($data['data']['password'])) {
            if (strpos($data['data']['password'], '$2y$') !== 0) {
                $data['data']['password'] = password_hash($data['data']['password'], PASSWORD_BCRYPT);
            }
        } else {
            if (isset($data['data']['password'])) {
                unset($data['data']['password']);
            }
        }
        return $data;
    }
}
