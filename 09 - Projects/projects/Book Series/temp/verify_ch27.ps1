$ErrorActionPreference = "Stop"
$book = "C:\Users\Admin\Quillan-Ronin\Book Series\Book 3 - Battle Grandeur.md"
$out  = "C:\Users\Admin\Quillan-Ronin\Book Series\temp\ch27_expanded.md"
$orig = [System.IO.File]::ReadAllLines($book)[6188..6351]
$new  = [System.IO.File]::ReadAllLines($out)
$j = 0; $missing = @()
foreach ($l in $orig) {
  $found = $false
  for (; $j -lt $new.Count; $j++) { if ($new[$j] -eq $l) { $found = $true; $j++; break } }
  if (-not $found) { $missing += $l }
}
Write-Output ("originalLines={0} preservedInOrder={1} missing={2}" -f $orig.Count, ($orig.Count - $missing.Count), $missing.Count)
Write-Output ("outStart=[" + $new[0] + "]")
Write-Output ("outEnd=[" + $new[$new.Count-1] + "]")
$words = 0; foreach ($l in $new) { if ($l.Trim() -ne "") { $words += ($l -split '\s+').Count } }
Write-Output ("finalWordCount={0}" -f $words)