$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$folder = Join-Path $repoRoot '02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/141_linked_list_cycle'
$buildDir = Join-Path ([System.IO.Path]::GetTempPath()) ('neolearning141-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $buildDir | Out-Null
$env:PATH = 'C:\msys64\mingw64\bin;' + $env:PATH
$env:PYTHONIOENCODING = 'utf-8'

function Invoke-Checked {
    param([string]$Program, [string[]]$Arguments)
    & $Program @Arguments
    if ($LASTEXITCODE -ne 0) { throw "Command failed: $Program (exit $LASTEXITCODE)" }
}

function Invoke-Test {
    param([string]$Program)
    $stdout = Join-Path $buildDir ([System.IO.Path]::GetFileName($Program) + '.log')
    $stderr = $stdout + '.err'
    $process = Start-Process -FilePath $Program -PassThru -WindowStyle Hidden -RedirectStandardOutput $stdout -RedirectStandardError $stderr
    if (-not $process.WaitForExit(15000)) {
        $process.Kill()
        throw "Runtime check exceeded 15 seconds: $Program"
    }
    $process.WaitForExit()
    Get-Content -LiteralPath $stdout
    Get-Content -LiteralPath $stderr
    if ($process.ExitCode -ne 0) { throw "Runtime check failed: $Program (exit $($process.ExitCode))" }
}

Set-Location -LiteralPath $repoRoot
Invoke-Checked 'C:/msys64/mingw64/bin/gcc.exe' @('--version')
Invoke-Checked 'C:/msys64/mingw64/bin/g++.exe' @('--version')
$cSource = Join-Path $folder '141_linked_list_cycle.c'
$cppSource = Join-Path $folder '141_linked_list_cycle.cpp'
Invoke-Checked 'C:/msys64/mingw64/bin/gcc.exe' @('-std=c11', '-Wall', '-Wextra', '-Werror', '-pedantic', '-DLOCAL_TEST', $cSource, '-o', (Join-Path $buildDir '141_c_test.exe'))
Invoke-Checked 'C:/msys64/mingw64/bin/g++.exe' @('-std=c++17', '-Wall', '-Wextra', '-Werror', '-pedantic', '-DLOCAL_TEST', $cppSource, '-o', (Join-Path $buildDir '141_cpp_test.exe'))
Invoke-Test (Join-Path $buildDir '141_c_test.exe')
Invoke-Test (Join-Path $buildDir '141_cpp_test.exe')

$cInclude = $cSource.Replace('\', '/')
$cppInclude = $cppSource.Replace('\', '/')
$cWrapper = Join-Path $buildDir 'judge.c'
$cppWrapper = Join-Path $buildDir 'judge.cpp'
@"
#include <stdbool.h>
struct ListNode { int val; struct ListNode *next; };
#include "$cInclude"
bool judgeCall(struct ListNode *head) { return hasCycle(head); }
"@ | Set-Content -LiteralPath $cWrapper -Encoding ascii
@"
struct ListNode { int val; ListNode *next; };
#include "$cppInclude"
bool judgeCall(ListNode *head) { return Solution().hasCycle(head); }
"@ | Set-Content -LiteralPath $cppWrapper -Encoding ascii
Invoke-Checked 'C:/msys64/mingw64/bin/gcc.exe' @('-std=c11', '-Wall', '-Wextra', '-Werror', '-pedantic', '-c', $cWrapper, '-o', (Join-Path $buildDir 'judge_c.o'))
Invoke-Checked 'C:/msys64/mingw64/bin/g++.exe' @('-std=c++17', '-Wall', '-Wextra', '-Werror', '-pedantic', '-c', $cppWrapper, '-o', (Join-Path $buildDir 'judge_cpp.o'))
Invoke-Checked 'D:/ESP-IDF/Espressif/tools/idf-python/3.11.2/python.exe' @('.agents/skills/leetcode-notes/scripts/validate_notes.py', (Join-Path $folder '141_note.md'))

$expected = @('141_linked_list_cycle.c', '141_linked_list_cycle.cpp', '141_note.md')
$actual = @(Get-ChildItem -LiteralPath $folder -File | Select-Object -ExpandProperty Name)
if (@(Compare-Object $expected $actual).Count -ne 0) { throw 'Exercise folder must contain exactly the three specified files.' }
foreach ($name in $expected) {
    $file = Join-Path $folder $name
    if (Select-String -LiteralPath $file -Pattern '[\t ]+$') { throw "Trailing whitespace: $name" }
}
Invoke-Checked 'git' @('-c', 'safe.directory=D:/workspace/NeoLearning', 'diff', '--check')
$preserved = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'leetcode141-preservation.json') -Raw | ConvertFrom-Json
foreach ($item in $preserved) {
    if ((Get-FileHash -LiteralPath $item.Path -Algorithm SHA256).Hash -ne $item.Hash) {
        throw "Preexisting file changed: $($item.Path)"
    }
}
Write-Output "PASS: $($preserved.Count) preexisting source, note and unrelated dirty files preserved."
Write-Output 'PASS: strict C/C++ runtime checks, judge interfaces, Cornell validation, three-file inventory and whitespace.'
Write-Output "Temporary build artifacts: $buildDir"
