Add-Type -AssemblyName System.Drawing

$sih = [System.Drawing.Bitmap]::FromFile("$PSScriptRoot\..\client\public\sih-logo.png")
Write-Output "SIH png size: $($sih.Width) x $($sih.Height)"

# Find bounding box of all non-transparent pixels in sih-logo.png
$minX = $sih.Width; $maxX = 0; $minY = $sih.Height; $maxY = 0

for ($y = 0; $y -lt $sih.Height; $y++) {
    for ($x = 0; $x -lt $sih.Width; $x++) {
        $pixel = $sih.GetPixel($x, $y)
        if ($pixel.A -gt 20) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Output "Full non-transparent bounds: X=[$minX, $maxX] (W=$($maxX-$minX)), Y=[$minY, $maxY] (H=$($maxY-$minY))"
$sih.Dispose()
