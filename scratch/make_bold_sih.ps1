Add-Type -AssemblyName System.Drawing

$srcOriginal = "C:\Users\rajup\.gemini\antigravity-ide\brain\6040427f-acac-4e41-b6b2-6d24b0aa5d6d\.user_uploaded\media_1789640493651.png"
$sihPath = "$PSScriptRoot\..\client\public\sih-logo.png"
$outPath = "$PSScriptRoot\..\client\public\team-froggers.png"

$base = [System.Drawing.Bitmap]::FromFile($srcOriginal)
$sih = [System.Drawing.Bitmap]::FromFile($sihPath)

$w = $base.Width   # 1024
$h = $base.Height  # 585

# Create 32-bit ARGB canvas
$outBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gOut = [System.Drawing.Graphics]::FromImage($outBmp)
$gOut.DrawImage($base, 0, 0, $w, $h)

# 1. Clean the entire top-left quadrant of old badges (X: 40 to 220, Y: 30 to 180)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
$gOut.FillRectangle($brush, 40, 30, 200, 150)

# 2. Crop SIH tightly to artwork (Bulb + SMART INDIA HACKATHON)
# In sih-logo.png: X: 45 to 955 (width 910), Y: 180 to 435 (height 255)
$cropRect = New-Object System.Drawing.Rectangle(45, 180, 910, 255)
$croppedSih = $sih.Clone($cropRect, $sih.PixelFormat)

# Make SIH significantly larger and bolder!
# Target size: 340px width x 95px height! (Much bigger and fully readable)
$targetW = 340
$targetH = [int](255 * ($targetW / 910)) # ≈ 95px
$targetX = 45
$targetY = 48

Write-Output "Drawing Large Vibrant SIH Logo ($targetW x $targetH) at ($targetX, $targetY)"

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

# Copy to src/assets
Copy-Item $outPath "$PSScriptRoot\..\client\src\assets\team-froggers.png" -Force

Write-Output "Successfully updated with large, fully visible SIH logo!"
