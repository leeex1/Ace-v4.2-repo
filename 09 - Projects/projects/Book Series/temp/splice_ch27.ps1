$ErrorActionPreference = "Stop"
$book = "C:\Users\Admin\Quillan-Ronin\Book Series\Book 3 - Battle Grandeur.md"
$out  = "C:\Users\Admin\Quillan-Ronin\Book Series\temp\ch27_expanded.md"
$lines = [System.IO.File]::ReadAllLines($book)
$ch = $lines[6188..6351]
$addA = [System.IO.File]::ReadAllLines("C:\Users\Admin\Quillan-Ronin\Book Series\temp\addA.md")
$addB = [System.IO.File]::ReadAllLines("C:\Users\Admin\Quillan-Ronin\Book Series\temp\addB.md")
$addC = [System.IO.File]::ReadAllLines("C:\Users\Admin\Quillan-Ronin\Book Series\temp\addC.md")
$outLines = New-Object System.Collections.Generic.List[string]
$counts = @{ A = 0; B = 0; C = 0 }
foreach ($line in $ch) {
  if ($line.Trim() -eq '"I know what they said."') {
    $outLines.Add($line); $outLines.Add("")
    foreach ($a in $addA) { $outLines.Add($a) }
    $counts.A++
    continue
  }
  if ($line -like 'Down in the courtyard*') {
    foreach ($b in $addB) { $outLines.Add($b) }
    $outLines.Add(""); $outLines.Add($line)
    $counts.B++
    continue
  }
  if ($line -like '"Then we prepare for what comes next*') {
    foreach ($c in $addC) { $outLines.Add($c) }
    $outLines.Add(""); $outLines.Add($line)
    $counts.C++
    continue
  }
  $outLines.Add($line)
}
[System.IO.File]::WriteAllLines($out, $outLines, [System.Text.Encoding]::UTF8)
$words = 0
foreach ($l in $outLines) { if ($l.Trim() -ne "") { $words += ($l -split '\s+').Count } }
Write-Output ("anchors A={0} B={1} C={2} totalLines={3} wordCount={4}" -f $counts.A, $counts.B, $counts.C, $outLines.Count, $words)