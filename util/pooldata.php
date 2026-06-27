<?php
header('Content-Type: application/json; charset=UTF-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
  'https://www.sporttrip.ch',
  'https://mhueni.github.io',
  'http://localhost',
  'http://localhost:8080',
  'http://127.0.0.1',
  'http://127.0.0.1:8080',
];
if (in_array($origin, $allowed, true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
}

$url = 'https://www.stadt-zuerich.ch/stzh/bathdatadownload';

$ctx = stream_context_create([
  'http' => [
    'method' => 'GET',
    'timeout' => 15,
    'user_agent' => 'Mozilla/5.0 (compatible; mhueni.ch)',
  ],
  'ssl' => [
    'verify_peer' => true,
    'verify_peer_name' => true,
  ],
]);

$xml = @file_get_contents($url, false, $ctx);

if ($xml === false) {
  http_response_code(502);
  echo json_encode(['error' => 'Failed to fetch bath data']);
  exit;
}

$sxe = simplexml_load_string($xml);
$baths = [];

if ($sxe && isset($sxe->baths->bath)) {
  foreach ($sxe->baths->bath as $bath) {
    $baths[] = [
      'poiid'              => (string)$bath->poiid,
      'title'              => (string)$bath->title,
      'temperatureWater'   => (string)$bath->temperatureWater,
      'openClosedTextPlain'=> (string)$bath->openClosedTextPlain,
      'dateModified'       => (string)$bath->dateModified,
    ];
  }
}

echo json_encode(['baths' => $baths], JSON_UNESCAPED_UNICODE);
