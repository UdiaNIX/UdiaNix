<?php
// Permitir requisições de qualquer origem durante o desenvolvimento
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Se for uma requisição OPTIONS, retornar apenas os headers
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar método da requisição
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit();
}

// Configurações do bot
$botToken = '7884072667:AAE1VROePuTbFDs9fe15myUhbmD6oh50llg';
$chatId = '1061417621';

try {
    // Ler o corpo da requisição
    $rawInput = file_get_contents('php://input');
    
    // Se não houver dados, tentar $_POST
    if (empty($rawInput) && !empty($_POST)) {
        $data = $_POST;
    } else {
        $data = json_decode($rawInput, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Formato de dados inválido');
        }
    }
    
    // Validar campos obrigatórios
    if (empty($data['name']) || empty($data['email']) || 
        empty($data['phone']) || empty($data['message'])) {
        throw new Exception('Todos os campos são obrigatórios');
    }
    
    // Sanitizar e validar dados
    $name = strip_tags(trim($data['name']));
    $email = filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL);
    $phone = strip_tags(trim($data['phone']));
    $message = strip_tags(trim($data['message']));
    
    if (!$email) {
        throw new Exception('Email inválido');
    }
    
    // Montar mensagem
    $text = "📬 Nova Mensagem do Site\n\n";
    $text .= "Nome: $name\n";
    $text .= "Email: $email\n";
    $text .= "Telefone: $phone\n";
    $text .= "Mensagem: $message";
    
    // Preparar requisição para o Telegram
    $telegramData = [
        'chat_id' => $chatId,
        'text' => $text,
        'parse_mode' => 'HTML'
    ];
    
    // Inicializar CURL
    $ch = curl_init("https://api.telegram.org/bot$botToken/sendMessage");
    
    if ($ch === false) {
        throw new Exception('Falha ao inicializar CURL');
    }
    
    // Configurar CURL
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $telegramData,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_HTTPHEADER => ['Content-Type: multipart/form-data']
    ]);
    
    // Executar requisição
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    // Verificar erros do CURL
    if (curl_errno($ch)) {
        throw new Exception('Erro na conexão: ' . curl_error($ch));
    }
    
    curl_close($ch);
    
    // Verificar resposta do Telegram
    if ($httpCode !== 200) {
        throw new Exception('Erro ao enviar mensagem');
    }
    
    $responseData = json_decode($response, true);
    
    if (!isset($responseData['ok']) || !$responseData['ok']) {
        throw new Exception('Falha no envio da mensagem');
    }
    
    // Retornar sucesso
    echo json_encode([
        'success' => true,
        'message' => 'Mensagem enviada com sucesso'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?> 