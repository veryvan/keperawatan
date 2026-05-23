<?php
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
  CURLOPT_POSTFIELDS => array(
    'target' => '08123456789',
    'message' => 'Test'
  ),
  CURLOPT_HTTPHEADER => array(
    "Authorization: $token"
  ),
));
$response = curl_exec($curl);
$error = curl_error($curl);
curl_close($curl);
echo "Response: $response\nError: $error";
