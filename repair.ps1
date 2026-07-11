$appPath = "c:\Users\digit\OneDrive\ドキュメント\Antigravity\app.js"
$headerPath = "c:\Users\digit\OneDrive\ドキュメント\Antigravity\new_header.js"

# ファイルが存在することを確認
if ((Test-Path $appPath) -and (Test-Path $headerPath)) {
    # UTF8で読み込む
    $appContent = Get-Content -Path $appPath -Encoding utf8
    $headerContent = Get-Content -Path $headerPath -Raw -Encoding utf8

    # TIME & CLOCK UTILITIES のブロックを探す
    $index = -1
    for ($i = 0; $i -lt $appContent.Length; $i++) {
        if ($appContent[$i] -match "TIME & CLOCK UTILITIES") {
            $index = $i - 1
            break
        }
    }

    if ($index -gt 0) {
        $remaining = $appContent[$index..($appContent.Length - 1)] -join "`r`n"
        $newContent = $headerContent.Trim() + "`r`n`r`n" + $remaining
        
        # app.js に UTF8 (BOMなし) で書き出し
        [System.IO.File]::WriteAllText($appPath, $newContent, [System.Text.Encoding]::UTF8)
        Write-Output "Successfully merged app.js via PowerShell script!"
        
        # 一時ファイルの削除
        Remove-Item -Path $headerPath -Force
    } else {
        Write-Error "Could not locate TIME & CLOCK UTILITIES!"
    }
} else {
    Write-Error "Required files do not exist!"
}
