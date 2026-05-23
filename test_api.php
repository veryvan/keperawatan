<?php
// test_api.php
function sendRequest($url, $data = null) {
    $options = [
        'http' => [
            'header'  => "Content-type: application/json\r\n",
            'method'  => $data ? 'POST' : 'GET',
            'content' => $data ? json_encode($data) : null,
            'ignore_errors' => true // to get response even if 400/401/404
        ]
    ];
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    return json_decode($result, true) ?? $result;
}

$baseUrl = 'http://localhost/keperawatan/public/api';

echo "1. Testing Registration (New User)...\n";
$regData = [
    'username' => 'newnurse1',
    'password' => 'secret123',
    'nama' => 'Test Nurse 1'
];
$res = sendRequest("$baseUrl/register", $regData);
print_r($res);

echo "\n2. Testing Registration (Duplicate Username)...\n";
$res = sendRequest("$baseUrl/register", $regData);
print_r($res);

echo "\n3. Testing Login (Trigger OTP)...\n";
$loginData = [
    'username' => 'admin', // use an existing user to ensure status=A, wait, newnurse1 has status=N
    'password' => 'admin123'
];
$res = sendRequest("$baseUrl/login", $loginData);
print_r($res);

if (isset($res['require_otp']) && $res['require_otp']) {
    $otp = $res['dev_otp'];
    echo "\n4. Testing OTP Verification ($otp)...\n";
    $verifyData = [
        'username' => 'admin',
        'otp' => $otp
    ];
    $res2 = sendRequest("$baseUrl/login/verify-otp", $verifyData);
    print_r($res2);
} else {
    echo "OTP not requested. Login failed?\n";
}
