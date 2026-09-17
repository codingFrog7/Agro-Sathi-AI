Add-Type -AssemblyName System.Drawing

$srcOriginal = "C:\Users\rajup\.gemini\antigravity-ide\brain\6040427f-acac-4e41-b6b2-6d24b0aa5d6d\.user_uploaded\media_1789640493651.png"
$sihPath = "$PSScriptRoot\..\client\public\sih-logo.png"
$outPath = "$PSScriptRoot\..\client\public\team-froggers.png"

$base = [System.Drawing.Bitmap]::FromFile($srcOriginal)
$sih = [System.Drawing.Bitmap]::FromFile($sihPath)

$w = $base.Width   # 1024
$h = $base.Height  # 585

# 1. Create a clean output canvas and copy original
$outBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gOut = [System.Drawing.Graphics]::FromImage($outBmp)
$gOut.DrawImage($base, 0, 0, $w, $h)

# 2. Erase the left "TEAM FROGGERS" circular badge (X: 65 to 170, Y: 45 to 150)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
$gOut.FillRectangle($brush, 60, 40, 120, 120)

# 3. Crop SIH logo tightly to content (Bulb + SMART INDIA HACKATHON)
# In sih-logo.png:
# Bulb is from X ≈ 45, Y ≈ 180 to Y ≈ 435. Text SMART INDIA HACKATHON is X: ~410 to ~955, Y: ~230 to ~430.
# Tight bounding box: X = 45, Y = 180, W = 910, H = 255
$cropRect = New-Object System.Drawing.Rectangle(45, 180, 910, 255)
$croppedSih = $sih.Clone($cropRect, $sih.PixelFormat)

# 4. Target dimensions on top-left of team-froggers
# Top-left available area: X ≈ 50 to 280, Y ≈ 55 to 150
$targetW = 230
$targetH = [int](255 * ($targetW / 910)) # ≈ 64px
$targetX = 55
$targetY = 65

Write-Output "Placing SIH logo ($targetW x $targetH) at ($targetX, $targetY)"

$gOut.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gOut.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gOut.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$gOut.DrawImage($croppedSih, $targetX, $targetY, $targetW, $targetH)

$gOut.Dispose()
$brush.Dispose()
$croppedSih.Dispose()
$base.Dispose()
$sih.Dispose()

# Save to destination
$outBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$outBmp.Dispose()

# Also copy to src/assets
Copy-Item $outPath "$PSScriptRoot\..\client\src\assets\team-froggers.png" -Force

Write-Output "Successfully updated team-froggers.png with SIH logo replacing the left badge"
