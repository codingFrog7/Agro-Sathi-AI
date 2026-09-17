Add-Type -AssemblyName System.Drawing

$srcPath = "$PSScriptRoot\..\client\public\team-froggers.png"
$destPath = "$PSScriptRoot\..\client\public\team-froggers-transparent.png"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$width = $src.Width
$height = $src.Height

# Create 32-bit ARGB
$dest = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Lock bits
$srcRect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$srcData = $src.LockBits($srcRect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$destData = $dest.LockBits($srcRect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$bytesCount = $srcData.Stride * $height
$bytes = New-Object byte[] $bytesCount
[System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $bytes, 0, $bytesCount)

# Visited array for BFS flood fill
$visited = New-Object bool[] ($width * $height)
$queue = New-Object System.Collections.Generic.Queue[int]

# Start BFS from (0,0), (width-1, 0), etc.
$queue.Enqueue(0)
$visited[0] = $true

function IsBgWhite($idx) {
    $b = $bytes[$idx]
    $g = $bytes[$idx + 1]
    $r = $bytes[$idx + 2]
    return ($r -ge 245 -and $g -ge 245 -and $b -ge 245)
}

while ($queue.Count -gt 0) {
    $curr = $queue.Dequeue()
    $cx = $curr % $width
    $cy = [int]($curr / $width)

    # Mark as transparent
    $byteIdx = ($cy * $srcData.Stride) + ($cx * 4)
    $bytes[$byteIdx + 3] = 0 # Alpha = 0

    # 4 neighbors
    $neighbors = @(
        @($cx + 1, $cy),
        @($cx - 1, $cy),
        @($cx, $cy + 1),
        @($cx, $cy - 1)
    )

    foreach ($n in $neighbors) {
        $nx = $n[0]
        $ny = $n[1]
        if ($nx -ge 0 -and $nx -lt $width -and $ny -ge 0 -and $ny -lt $height) {
            $nIdx = ($ny * $width) + $nx
            if (-not $visited[$nIdx]) {
                $visited[$nIdx] = $true
                $nByteIdx = ($ny * $srcData.Stride) + ($nx * 4)
                if (IsBgWhite($nByteIdx)) {
                    $queue.Enqueue($nIdx)
                }
            }
        }
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $destData.Scan0, $bytesCount)

$src.UnlockBits($srcData)
$dest.UnlockBits($destData)

$dest.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$src.Dispose()
$dest.Dispose()

Write-Output "Successfully created $destPath"
