$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$folder = Join-Path $repoRoot '02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/344_reverse_string'
$buildDir = Join-Path ([System.IO.Path]::GetTempPath()) ('neolearning344-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $buildDir | Out-Null
$env:PATH = 'C:\msys64\mingw64\bin;' + $env:PATH
$env:PYTHONIOENCODING = 'utf-8'

function Invoke-Checked {
    param([string]$Program, [string[]]$Arguments)
    & $Program @Arguments
    if ($LASTEXITCODE -ne 0) { throw "Command failed: $Program $($Arguments -join ' ') (exit $LASTEXITCODE)" }
}

function Invoke-Test {
    param([string]$Program)
    $name = [System.IO.Path]::GetFileNameWithoutExtension($Program)
    $stdout = Join-Path $buildDir ($name + '.log')
    $stderr = Join-Path $buildDir ($name + '.err')
    $process = Start-Process -FilePath $Program -PassThru -WindowStyle Hidden -RedirectStandardOutput $stdout -RedirectStandardError $stderr
    if (-not $process.WaitForExit(15000)) {
        $process.Kill()
        $process.WaitForExit()
        throw "Runtime check exceeded 15 seconds: $Program"
    }
    $process.WaitForExit()
    if (Test-Path -LiteralPath $stdout) { Get-Content -LiteralPath $stdout }
    if (Test-Path -LiteralPath $stderr) { Get-Content -LiteralPath $stderr }
    if ($process.ExitCode -ne 0) { throw "Runtime check failed: $Program (exit $($process.ExitCode))" }
}

if (-not (Test-Path -LiteralPath $folder -PathType Container)) { throw "Missing exercise directory: $folder" }
Set-Location -LiteralPath $repoRoot
$gcc = 'C:/msys64/mingw64/bin/gcc.exe'
$gpp = 'C:/msys64/mingw64/bin/g++.exe'
Invoke-Checked $gcc @('--version')
Invoke-Checked $gpp @('--version')
$cSource = Join-Path $folder '344_reverse_string.c'
$cppSource = Join-Path $folder '344_reverse_string.cpp'
Invoke-Checked $gcc @('-std=c11', '-Wall', '-Wextra', '-Werror', '-pedantic', '-DLOCAL_TEST', $cSource, '-o', (Join-Path $buildDir '344_c_test.exe'))
Invoke-Checked $gpp @('-std=c++17', '-Wall', '-Wextra', '-Werror', '-pedantic', '-DLOCAL_TEST', $cppSource, '-o', (Join-Path $buildDir '344_cpp_test.exe'))
Invoke-Test (Join-Path $buildDir '344_c_test.exe')
Invoke-Test (Join-Path $buildDir '344_cpp_test.exe')

# Compile external callers with LOCAL_TEST absent. Exact function-pointer types
# enforce the judge signatures; the callers also verify a real reversal at runtime.
$cInclude = $cSource.Replace('\', '/')
$cppInclude = $cppSource.Replace('\', '/')
$cWrapper = Join-Path $buildDir 'judge.c'
$cppWrapper = Join-Path $buildDir 'judge.cpp'
@"
#include <stddef.h>
#include <stdlib.h>
#include "$cInclude"
static void (*judgeSignature)(char *, int) = reverseString;
int main(void) {
    char value[] = {'a', 'b', 'c'};
    judgeSignature(value, 3);
    return value[0] == 'c' && value[1] == 'b' && value[2] == 'a' ? 0 : 1;
}
"@ | Set-Content -LiteralPath $cWrapper -Encoding ascii
@"
#include <vector>
#include "$cppInclude"
static void (Solution::*judgeSignature)(std::vector<char>&) = &Solution::reverseString;
int main() {
    std::vector<char> value{'a', 'b', 'c'};
    (Solution().*judgeSignature)(value);
    return value == std::vector<char>{'c', 'b', 'a'} ? 0 : 1;
}
"@ | Set-Content -LiteralPath $cppWrapper -Encoding ascii
Invoke-Checked $gcc @('-std=c11', '-Wall', '-Wextra', '-Werror', '-pedantic', $cWrapper, '-o', (Join-Path $buildDir 'judge_c.exe'))
Invoke-Checked $gpp @('-std=c++17', '-Wall', '-Wextra', '-Werror', '-pedantic', $cppWrapper, '-o', (Join-Path $buildDir 'judge_cpp.exe'))
Invoke-Test (Join-Path $buildDir 'judge_c.exe')
Invoke-Test (Join-Path $buildDir 'judge_cpp.exe')

Invoke-Checked 'D:/ESP-IDF/Espressif/tools/idf-python/3.11.2/python.exe' @('.agents/skills/leetcode-notes/scripts/validate_notes.py', (Join-Path $folder '344_note.md'))
$expected = @('344_reverse_string.c', '344_reverse_string.cpp', '344_note.md')
$actual = @(Get-ChildItem -LiteralPath $folder -File | Select-Object -ExpandProperty Name)
if (@(Compare-Object $expected $actual).Count -ne 0) { throw 'Exercise folder must contain exactly the three specified files.' }
foreach ($name in $expected) {
    $file = Join-Path $folder $name
    if (Select-String -LiteralPath $file -Pattern '[\t ]+$') { throw "Trailing whitespace: $name" }
}
Invoke-Checked 'git' @('-c', 'safe.directory=D:/workspace/NeoLearning', 'diff', '--check', '--', '02_Software/02_Programming-Fundamentals/01_Algorithms-and-Data-Structures/02_practice/03_data_structures/02_contiguous_vs_linked_structures/344_reverse_string')
$manifestPath = Join-Path $PSScriptRoot 'leetcode344-preservation.json'
$preserved = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
foreach ($item in $preserved) {
    if (-not (Test-Path -LiteralPath $item.Path -PathType Leaf)) { throw "Preexisting file missing: $($item.Path)" }
    if ((Get-FileHash -LiteralPath $item.Path -Algorithm SHA256).Hash -ne $item.Hash) {
        throw "Preexisting file changed: $($item.Path)"
    }
}
Write-Output "PASS: $($preserved.Count) preexisting source, note and unrelated dirty files preserved."
Write-Output 'PASS: strict C/C++ LOCAL_TEST builds and executions; judge-mode exact signatures and caller smoke tests.'
Write-Output 'PASS: Cornell validation, exact exercise inventory, whitespace, and scoped diff checks.'
Write-Output "Temporary build artifacts and runtime logs: $buildDir"
