Add-Type -AssemblyName System.Drawing
$imagePath = 'c:\Users\MSI\Desktop\theses\Mobile-App-BS\assets\images\logo.png'
$bmp = [System.Drawing.Bitmap]::FromFile($imagePath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)
$graphics = [System.Drawing.Graphics]::FromImage($newBmp)
$graphics.DrawImage($bmp, 0, 0, $bmp.Width, $bmp.Height)
$bmp.Dispose()
for ($x = 0; $x -lt $newBmp.Width; $x++) {
    for ($y = 0; $y -lt $newBmp.Height; $y++) {
        $pixel = $newBmp.GetPixel($x, $y)
        if ($pixel.R -gt 230 -and $pixel.G -gt 230 -and $pixel.B -gt 230) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        }
    }
}
$newBmp.Save($imagePath, [System.Drawing.Imaging.ImageFormat]::Png)
$newBmp.Dispose()
$graphics.Dispose()
Write-Host 'Background removed'
