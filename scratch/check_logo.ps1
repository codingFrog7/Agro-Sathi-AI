Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile("$PSScriptRoot\..\client\public\sih-logo.jpg")
Write-Output "Image Dimensions: $($img.Width) x $($img.Height)"

# Check bounding box of non-white pixels
$minX = $img.Width; $maxX = 0; $minY = $img.Height; $maxY = 0
for ($y = 0; $y -lt $img.Height; $y += 5) {
    for ($x = 0; $x -lt $img.Width; $x += 5) {
        $c = $img.GetPixel($x, $y)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}
Write-Output "Non-white bounding box: X=[$minX, $maxX], Y=[$minY, $maxY]"
$img.Dispose()
