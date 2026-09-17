Add-Type -AssemblyName System.Drawing

$srcPath = "$PSScriptRoot\..\client\public\sih-logo.jpg"
$destPath = "$PSScriptRoot\..\client\public\sih-logo.png"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$width = $src.Width
$height = $src.Height

# Create 32-bit ARGB bitmap
$dest = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Lock bits for fast processing
$srcRect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$srcData = $src.LockBits($srcRect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$destData = $dest.LockBits($srcRect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$srcStride = $srcData.Stride
$destStride = $destData.Stride

$srcBytes = New-Object byte[] ($srcStride * $height)
$destBytes = New-Object byte[] ($destStride * $height)

[System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $srcBytes, 0, $srcBytes.Length)

# Process pixels
for ($y = 0; $y -lt $height; $y++) {
    $srcRow = $y * $srcStride
    $destRow = $y * $destStride

    for ($x = 0; $x -lt $width; $x++) {
        $srcIdx = $srcRow + ($x * 3)
        $destIdx = $destRow + ($x * 4)

        $b = $srcBytes[$srcIdx]
        $g = $srcBytes[$srcIdx + 1]
        $r = $srcBytes[$srcIdx + 2]

        # Check if this pixel is in the "2022" region (x > 500 and y > 440)
        if ($x -gt 500 -and $y -gt 440) {
            # Clear 2022 to completely transparent
            $destBytes[$destIdx] = 0
            $destBytes[$destIdx + 1] = 0
            $destBytes[$destIdx + 2] = 0
            $destBytes[$destIdx + 3] = 0
            continue
        }

        # Calculate luminance/distance from white
        $dist = [Math]::Sqrt([Math]::Pow(255 - $r, 2) + [Math]::Pow(255 - $g, 2) + [Math]::Pow(255 - $b, 2))

        if ($dist -lt 15) {
            # Pure white -> transparent
            $destBytes[$destIdx] = 0
            $destBytes[$destIdx + 1] = 0
            $destBytes[$destIdx + 2] = 0
            $destBytes[$destIdx + 3] = 0
        } elseif ($dist -lt 50) {
            # Anti-aliased border
            $alpha = [byte]([Math]::Min(255, ($dist - 15) / 35.0 * 255.0))
            $destBytes[$destIdx] = $b
            $destBytes[$destIdx + 1] = $g
            $destBytes[$destIdx + 2] = $r
            $destBytes[$destIdx + 3] = $alpha
        } else {
            # Solid artwork pixel
            $destBytes[$destIdx] = $b
            $destBytes[$destIdx + 1] = $g
            $destBytes[$destIdx + 2] = $r
            $destBytes[$destIdx + 3] = 255
        }
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($destBytes, 0, $destData.Scan0, $destBytes.Length)

$src.UnlockBits($srcData)
$dest.UnlockBits($destData)

# Save to destination
$dest.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$src.Dispose()
$dest.Dispose()

Write-Output "Successfully saved transparent $destPath"
