Add-Type -AssemblyName System.Drawing

$basePath = "$PSScriptRoot\..\client\public\team-froggers.png"
$sihPath = "$PSScriptRoot\..\client\public\sih-logo.png"
$outPath = "$PSScriptRoot\..\client\public\team-froggers-sih.png"

$base = [System.Drawing.Bitmap]::FromFile($basePath)
$sih = [System.Drawing.Bitmap]::FromFile($sihPath)

$w = $base.Width   # 1024
$h = $base.Height  # 585

# Perfect positioning:
# Open space between Deepu (x ≈ 230) and TEAM FROGGERS text (x ≈ 625)
# Width = 330px leaves 50px buffer on the right and 15px on the left
$sihTargetW = 330
$sihTargetH = [int]($sih.Height * ($sihTargetW / $sih.Width)) # ≈ 246
$sihTargetX = 245
$sihTargetY = 28

Write-Output "Scaling SIH to $sihTargetW x $sihTargetH at ($sihTargetX, $sihTargetY)"

$resizedSih = New-Object System.Drawing.Bitmap($sihTargetW, $sihTargetH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($resizedSih)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($sih, 0, 0, $sihTargetW, $sihTargetH)
$g.Dispose()

$outBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gOut = [System.Drawing.Graphics]::FromImage($outBmp)
$gOut.DrawImage($base, 0, 0, $w, $h)
$gOut.Dispose()

for ($sy = 0; $sy -lt $sihTargetH; $sy++) {
    $targetY = $sihTargetY + $sy
    if ($targetY -ge $h) { continue }

    for ($sx = 0; $sx -lt $sihTargetW; $sx++) {
        $targetX = $sihTargetX + $sx
        if ($targetX -ge $w) { continue }

        $sihPixel = $resizedSih.GetPixel($sx, $sy)
        if ($sihPixel.A -eq 0) { continue }

        $basePixel = $base.GetPixel($targetX, $targetY)

        # Only composite onto white wall so character hair and outlines remain in front
        if ($basePixel.R -ge 240 -and $basePixel.G -ge 240 -and $basePixel.B -ge 240) {
            $alpha = $sihPixel.A / 255.0

            $outR = [int](($sihPixel.R * $alpha) + (255 * (1.0 - $alpha)))
            $outG = [int](($sihPixel.G * $alpha) + (255 * (1.0 - $alpha)))
            $outB = [int](($sihPixel.B * $alpha) + (255 * (1.0 - $alpha)))

            $newColor = [System.Drawing.Color]::FromArgb(255, $outR, $outG, $outB)
            $outBmp.SetPixel($targetX, $targetY, $newColor)
        }
    }
}

$outBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$base.Dispose()
$sih.Dispose()
$resizedSih.Dispose()
$outBmp.Dispose()

Write-Output "Successfully updated $outPath"
