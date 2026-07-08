<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$baseDir = __DIR__;
$storeFile = $baseDir . '/production-store.json';
$uploadDir = $baseDir . '/uploads/production';

function default_store(): array {
  return ['state' => new stdClass(), 'customOps' => []];
}

function read_store(string $storeFile): array {
  if (!file_exists($storeFile)) {
    return default_store();
  }
  $raw = file_get_contents($storeFile);
  $data = json_decode($raw ?: '', true);
  if (!is_array($data)) {
    return default_store();
  }
  if (!array_key_exists('state', $data) || !is_array($data['state'])) {
    $data['state'] = [];
  }
  if (!array_key_exists('customOps', $data) || !is_array($data['customOps'])) {
    $data['customOps'] = [];
  }
  return $data;
}

function write_store(string $storeFile, array $data): void {
  if (!is_dir(dirname($storeFile))) {
    mkdir(dirname($storeFile), 0775, true);
  }
  file_put_contents($storeFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

function json_body(): array {
  $raw = file_get_contents('php://input');
  $data = json_decode($raw ?: '', true);
  return is_array($data) ? $data : [];
}

function clean_name(string $value): string {
  $value = preg_replace('/[^a-zA-Z0-9._-]+/', '-', $value);
  return trim($value ?: 'archivo', '-');
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  echo json_encode(read_store($storeFile));
  exit;
}

$store = read_store($storeFile);
$action = $_POST['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'uploadDelivery') {
  $opId = clean_name($_POST['opId'] ?? 'OP');
  $notes = trim((string)($_POST['notes'] ?? ''));
  $files = [];

  if (!is_dir($uploadDir . '/' . $opId)) {
    mkdir($uploadDir . '/' . $opId, 0775, true);
  }

  foreach ($_FILES['files']['name'] ?? [] as $index => $name) {
    if (!isset($_FILES['files']['tmp_name'][$index]) || $_FILES['files']['error'][$index] !== UPLOAD_ERR_OK) {
      continue;
    }
    $safeName = time() . '-' . $index . '-' . clean_name((string)$name);
    $target = $uploadDir . '/' . $opId . '/' . $safeName;
    if (move_uploaded_file($_FILES['files']['tmp_name'][$index], $target)) {
      $files[] = [
        'name' => (string)$name,
        'type' => (string)($_FILES['files']['type'][$index] ?? ''),
        'data' => 'api/uploads/production/' . rawurlencode($opId) . '/' . rawurlencode($safeName),
        'uploadedAt' => gmdate('c')
      ];
    }
  }

  if (!isset($store['state'][$opId]) || !is_array($store['state'][$opId])) {
    $store['state'][$opId] = [];
  }
  if (!isset($store['state'][$opId]['deliveries']) || !is_array($store['state'][$opId]['deliveries'])) {
    $store['state'][$opId]['deliveries'] = [];
  }

  $store['state'][$opId]['deliveries'][] = [
    'notes' => $notes,
    'files' => $files,
    'status' => 'Pendiente de revision',
    'createdAt' => gmdate('c'),
    'approvalNote' => ''
  ];
  $store['state'][$opId]['status'] = 'Enviado a aprobacion';
  write_store($storeFile, $store);
  echo json_encode($store);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $body = json_body();
  $action = $body['action'] ?? '';

  if ($action === 'writeState' && isset($body['state']) && is_array($body['state'])) {
    $store['state'] = $body['state'];
    write_store($storeFile, $store);
    echo json_encode($store);
    exit;
  }

  if ($action === 'writeCustomOps' && isset($body['customOps']) && is_array($body['customOps'])) {
    $store['customOps'] = $body['customOps'];
    write_store($storeFile, $store);
    echo json_encode($store);
    exit;
  }
}

http_response_code(400);
echo json_encode(['error' => 'Solicitud invalida']);
