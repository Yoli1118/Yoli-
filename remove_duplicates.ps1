$file = 'c:\Users\yoooo\Desktop\RESUME\index.html'
$lines = Get-Content $file
$before = $lines[0..1264]
$after = $lines[1661..($lines.Length-1)]
$newContent = $before + $after
$newContent | Set-Content $file