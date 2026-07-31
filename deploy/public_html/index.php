<?php
/**
 * Reverse proxy para o app Node (PM2) em 127.0.0.1:3008.
 * Hostinger shared hosting bloqueia RewriteRule [P] / mod_proxy.
 * Se o Node estiver morto, tenta auto-recuperar via keep-gbia-alive.sh e refaz 1x.
 */
$backend = 'http://127.0.0.1:3008';
$uri = $_SERVER['REQUEST_URI'] ?? '/';
$url = $backend . $uri;
$keepAlive = '/home/u465383396/bin/keep-gbia-alive.sh';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$body = file_get_contents('php://input');

$headers = [];
foreach ($_SERVER as $key => $value) {
    if (str_starts_with($key, 'HTTP_')) {
        $name = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($key, 5)))));
        if (in_array(strtolower($name), ['host', 'connection', 'content-length', 'content-type', 'authorization'], true)) {
            continue;
        }
        $headers[] = $name . ': ' . $value;
    }
}

// GET/HEAD + Content-Type form/urlencoded faz o TanStack Start estourar
// "Invariant failed" em handleServerAction. Só encaminha Content-Type com body.
if (
    isset($_SERVER['CONTENT_TYPE'])
    && $_SERVER['CONTENT_TYPE'] !== ''
    && !in_array($method, ['GET', 'HEAD'], true)
) {
    $headers[] = 'Content-Type: ' . $_SERVER['CONTENT_TYPE'];
}

// Authorization costuma ser removido pelo Apache/CGI — recupera de vários lugares.
$auth = $_SERVER['HTTP_AUTHORIZATION']
    ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
    ?? ($_SERVER['Authorization'] ?? null);
if (!$auth && function_exists('apache_request_headers')) {
    foreach (apache_request_headers() as $k => $v) {
        if (strcasecmp($k, 'Authorization') === 0) {
            $auth = $v;
            break;
        }
    }
}
if ($auth) {
    $headers[] = 'Authorization: ' . $auth;
}

$headers[] = 'X-Forwarded-For: ' . ($_SERVER['REMOTE_ADDR'] ?? '');
$headers[] = 'X-Forwarded-Proto: ' . ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http');
$headers[] = 'X-Forwarded-Host: ' . ($_SERVER['HTTP_HOST'] ?? 'gbia.com.br');

/**
 * @return array{ok:bool,response:?string,error:string,ch:?\CurlHandle}
 */
function gbia_proxy_once(string $url, string $method, array $headers, $body): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_POSTFIELDS => ($method === 'GET' || $method === 'HEAD') ? null : $body,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_TIMEOUT => 120,
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    ]);
    $response = curl_exec($ch);
    if ($response === false) {
        $err = curl_error($ch);
        curl_close($ch);
        return ['ok' => false, 'response' => null, 'error' => $err, 'ch' => null];
    }
    return ['ok' => true, 'response' => $response, 'error' => '', 'ch' => $ch];
}

function gbia_try_revive(string $keepAlive): void
{
    if (!is_file($keepAlive)) {
        return;
    }
    // Dispara revive em background (não bloqueia se o shell permitir &)
    $cmd = 'bash ' . escapeshellarg($keepAlive) . ' >>/tmp/gbia-keep-alive.log 2>&1';
    if (function_exists('exec')) {
        @exec($cmd);
    } elseif (function_exists('shell_exec')) {
        @shell_exec($cmd);
    } elseif (function_exists('passthru')) {
        @passthru($cmd);
    }
    // Aguarda o Node subir (keep-alive já espera internamente; aqui dá margem)
    usleep(1800000);
}

$result = gbia_proxy_once($url, $method, $headers, $body);
if (!$result['ok']) {
    gbia_try_revive($keepAlive);
    $result = gbia_proxy_once($url, $method, $headers, $body);
}

if (!$result['ok']) {
    http_response_code(502);
    header('Content-Type: text/plain; charset=utf-8');
    header('Retry-After: 3');
    echo "Bad Gateway: não foi possível falar com o app Node (PM2).\n";
    echo $result['error'];
    exit;
}

$ch = $result['ch'];
$response = $result['response'];
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
