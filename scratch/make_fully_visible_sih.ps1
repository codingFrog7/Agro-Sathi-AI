Add-Type -AssemblyName System.Drawing

$srcOriginal = "C:\Users\rajup\.gemini\antigravity-ide\brain\6040427f-acac-4e41-b6b2-6d24b0aa5d6d\.user_uploaded\media_1789640493651.png"
$sihPath = "$PSScriptRoot\..\client\public\sih-logo.png"
$outPath = "$PSScriptRoot\..\client\public\team-froggers.png"

$base = [System.Drawing.Bitmap]::FromFile($srcOriginal)
$sih = [System.Drawing.Bitmap]::FromFile($sihPath)

$w = $base.Width   # 1024
$h = $base.Height  # 585

# Create 32-bit ARGB canvas from original
$outBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gOut = [System.Drawing.Graphics]::FromImage($outBmp)
$gOut.DrawImage($base, 0, 0, $w, $h)

# 1. Clear the entire top-left badge area with pure white (X: 30 to 250, Y: 20 to 180)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
$gOut.FillRectangle($brush, 30, 20, 220, 160)

# 2. Crop FULL SIH logo including COMPLETE bulb, socket, "SIH" text and "SMART INDIA HACKATHON"
# Bounds: X=44, Y=180, W=916, H=392
$cropRect = New-Object System.Drawing.Rectangle(44, 180, 916, 392)
$croppedSih = $sih.Clone($cropRect, $sih.PixelFormat)

# 3. Target size and position
# Width = 295px, Height = 126px
$targetW = 295
$targetH = [int](392 * ($targetW / 916)) # ≈ 126px
$targetX = 42
$targetY = 32

Write-Output "Placing FULL SIH Logo with bulb, SIH acronym & text: $targetW x $targetH at ($targetX, $targetY)"

$gOut.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gOut.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gOut.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$gOut.DrawImage($croppedSih, $targetX, $targetY, $targetW, $targetH)

$gOut.Dispose()
$brush.Dispose()
$croppedSih.Dispose()
$base.Dispose()
$sih.Dispose()

# Save
$outBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$outBmp.Dispose()

# Also copy to src/assets
Copy-Item $outPath "$PSScriptRoot\..\client\src\assets\team-froggers.png" -Force

Write-Output "Successfully generated complete, fully visible SIH logo on team-froggers.png"
