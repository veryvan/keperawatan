<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api', ['namespace' => 'App\Controllers\Api'], static function ($routes) {
    $routes->post('login', 'Login::index');
    $routes->post('login/verify-otp', 'Login::verifyOtp');
    $routes->post('auth/forgot-password-otp', 'Login::forgotPasswordOtp');
    $routes->post('auth/reset-password', 'Login::resetPassword');
    $routes->post('register/check-nik', 'Register::checkNik');
    $routes->post('register/check-nik-existing', 'Register::checkNikExisting');
    $routes->post('register/create-account', 'Register::createAccount');
    $routes->post('register', 'Register::index');
    $routes->post('user/ubah-password', 'User::ubahPassword');
    $routes->post('user/send-otp-hp', 'User::sendOtpHp');
    $routes->post('user/verify-otp-hp', 'User::verifyOtpHp');
    $routes->resource('user');
    $routes->resource('perawat');
    $routes->resource('pendidikan');
    $routes->resource('sertifikat');
    $routes->resource('assessment');
    $routes->resource('kredensial');
    $routes->resource('kompetensi');
    $routes->resource('unit_kerja', ['controller' => 'UnitKerja']);
    $routes->resource('jabatan', ['controller' => 'Jabatan']);
    $routes->resource('riwayat_kerja', ['controller' => 'RiwayatKerja']);
    $routes->resource('pengajuan_sertifikasi', ['controller' => 'PengajuanSertifikasi']);
    $routes->resource('jenjang_jabatan', ['controller' => 'JenjangJabatan']);
    $routes->resource('grup');
    $routes->resource('pelatihan', ['controller' => 'Pelatihan']);
    
    // Ujian Kompetensi
    $routes->post('ujian/set-jadwal', 'Ujian::setJadwal');
    $routes->get('ujian/soal/(:num)', 'Ujian::getSoal/$1');
    $routes->post('ujian/submit/(:num)', 'Ujian::submit/$1');
    $routes->get('ujian/hasil/(:num)', 'Ujian::hasil/$1');
    $routes->post('ujian/reset/(:num)', 'Ujian::reset/$1');
});

$routes->options('(:any)', static function () {});
