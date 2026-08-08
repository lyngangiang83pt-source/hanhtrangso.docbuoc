# ====================================================================
# HIGH-PERFORMANCE POWERSHELL HTTP SERVER (server.ps1)
# Serves Static Files & Mock API on http://localhost:3000
# ====================================================================

$port = 3000
$publicDir = Join-Path $PSScriptRoot "public"

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:" + $port + "/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "====================================================================" -ForegroundColor Cyan
    Write-Host "SERVER HANH TRINH SO - THCS PHU BINH DA KHOI DONG THANH CONG!" -ForegroundColor Green
    Write-Host "Xem tai: http://localhost:$port" -ForegroundColor Yellow
    Write-Host "====================================================================" -ForegroundColor Cyan
} catch {
    Write-Host ("Loi khi mo cong " + $port + ": " + $_.Exception.Message) -ForegroundColor Red
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.AbsolutePath
        if ($path -eq "/" -or [string]::IsNullOrWhiteSpace($path)) {
            $path = "/index.html"
        }

        # Handle API health check
        if ($path.StartsWith("/api/health")) {
            $jsonStr = '{"status":"ok","system":"HanhTrinhSo"}'
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.OutputStream.Close()
            continue
        }

        # Resolve local file
        $relative = $path.TrimStart('/')
        $localFile = [System.IO.Path]::Combine($publicDir, $relative)

        if ([System.IO.File]::Exists($localFile)) {
            $ext = [System.IO.Path]::GetExtension($localFile).ToLower()
            $cType = "application/octet-stream"
            if ($mimeTypes.ContainsKey($ext)) {
                $cType = $mimeTypes[$ext]
            }

            $bytes = [System.IO.File]::ReadAllBytes($localFile)
            $response.ContentType = $cType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found</h1>")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # ignore client disconnects
    }
}
