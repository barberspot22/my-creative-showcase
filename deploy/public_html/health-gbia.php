<?php
/**
 * Endpoint leve para Cron do hPanel (Hostinger).
 * Agende a cada 5 min: curl -fsS https://gbia.com.br/health-gbia.php?k=TOKEN
 *
 * Defina o token em apps/gbia/.env como GBIA_HEALTH_TOKEN=...
 * (fallback abaixo só se o .env não estiver legível pelo PHP).
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$envFile = '/home/u465383396/apps/gbia/.env';
$token = 'gbia-health-2026';
if (is_readable($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) continue;
        if (str_starts_with($line, 'GBIA_HEALTH_TOKEN=')) {
            $token = trim(substr($line, strlen('GBIA_HEALTH_TOKEN=')), " \t\"'");
            break;
        }
    }
}

$given = $_GET['k'] ?? '';
if (!hash_equals($token, (string) $given)) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'forbidden']);
    exit;
}

$keep = '/home/u465383396/bin/keep-gbia-alive.sh';
$aliveBefore = @fsockopen('127.0.0.1', 3008, $errno, $errstr, 1.5);
if (is_resource($aliveBefore)) {
    fclose($aliveBefore);
    echo json_encode(['ok' => true, 'status' => 'up']);
    exit;
}

if (is_file($keep) && function_exists('exec')) {
    @exec('bash ' . escapeshellarg($keep) . ' >>/tmp/gbia-keep-alive.log 2>&1');
}

$aliveAfter = @fsockopen('127.0.0.1', 3008, $errno, $errstr, 2.0);
if (is_resource($aliveAfter)) {
    fclose($aliveAfter);
    echo json_encode(['ok' => true, 'status' => 'revived']);
    exit;
}

http_response_code(503);
echo json_encode(['ok' => false, 'status' => 'down', 'error' => $errstr ?: 'port 3008 closed']);
