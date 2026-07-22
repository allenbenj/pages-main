$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($null -eq $userPath) { $userPath = "" }
$toAdd = @("C:\Program Files\Tesseract-OCR", "C:\Python314\Scripts")
$newPath = $userPath
$added = @()
foreach ($p in $toAdd) {
  if ($userPath -notlike "*$p*") {
    $newPath = if ($newPath.Length -gt 0) { "$newPath;$p" } else { $p }
    $added += $p
  }
}
if ($added.Count -gt 0) {
  [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
  Write-Output "ADDED: $($added -join ', ')"
} else {
  Write-Output "ALREADY PRESENT: nothing to add"
}
Write-Output "--- User PATH now ---"
[Environment]::GetEnvironmentVariable("Path", "User")
