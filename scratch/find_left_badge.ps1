Add-Type -AssemblyName System.Drawing

$base = [System.Drawing.Bitmap]::FromFile("C:\Users\rajup\.gemini\antigravity-ide\brain\6040427f-acac-4e41-b6b2-6d24b0aa5d6d\.user_uploaded\media_1789640493651.png")

# Find non-white pixels in the top-left area (x < 250, y < 200)
$minX = 250; $maxX = 0; $minY = 200; $maxY = 0
for ($y = 0; $y -lt 200; $y++) {
    for ($x = 0; $x -lt 250; $x++) {
        $c = $base.GetPixel($x, $y)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Output "Left badge bounds: X=[$minX, $maxX], Y=[$minY, $maxY]"
$base.Dispose()
