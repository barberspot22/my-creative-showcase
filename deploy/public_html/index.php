<?php
/**
 * Reverse proxy para o app Node (PM2) em 127.0.0.1:3008.
 * Hostinger shared hosting bloqueia RewriteRule [P] / mod_proxy.
 */
$backend = 'http://127.0.0.1:3008';
$uri = $_SERVER['REQUEST_URI'] ?? '/';
$url = $backend . $uri;

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$body = file_get_contents('php://input');

$headers = [];
foreach ($_SERVER as $key => $value) {
    if (str_starts_with($key, 'HTTP_')) {
        $name = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($key, 5)))));
        if (in_array(strtolower($name), ['host', 'connection', 'content-length'], true)) {
            continue;
        }
        $headers[] = $name . ': ' . $value;
    }
}
if (isset($_SERVER['CONTENT_TYPE'])) {
    $headers[] = 'Content-Type: ' . $_SERVER['CONTENT_TYPE'];
}
$headers[] = 'X-Forwarded-For: ' . ($_SERVER['REMOTE_ADDR'] ?? '');
$headers[] = 'X-Forwarded-Proto: ' . ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http');
$headers[] = 'X-Forwarded-Host: ' . ($_SERVER['HTTP_HOST'] ?? 'gbia.com.br');

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST => $method,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_POSTFIELDS => ($method === 'GET' || $method === 'HEAD') ? null : $body,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER => true,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_TIMEOUT => 120,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
]);

$response = curl_exec($ch);
if ($response === false) {
    http_response_code(502);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Bad Gateway: não foi possível falar com o app Node (PM2).\n";
    echo curl_error($ch);
    exit;
}

$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

$rawHeaders = substr($response, 0, $headerSize);
$rawBody = substr($response, $headerSize);

http_response_code($status);

foreach (explode("\r\n", $rawHeaders) as $line) {
    if ($line === '' || str_starts_with(strtolower($line), 'http/')) {
        continue;
    }
    $lower = strtolower($line);
    if (str_starts_with($lower, 'transfer-encoding:')) continue;
    if (str_starts_with($lower, 'connection:')) continue;
    if (str_starts_with($lower, 'keep-alive:')) continue;
    if (str_starts_with($lower, 'content-length:')) continue;
    header($line, false);
}

echo $rawBody;
