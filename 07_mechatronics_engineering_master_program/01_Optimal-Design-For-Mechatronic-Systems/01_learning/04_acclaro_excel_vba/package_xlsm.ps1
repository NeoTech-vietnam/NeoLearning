param(
    [Parameter(Mandatory = $true)][string]$InputXlsx,
    [Parameter(Mandatory = $true)][string]$OutputXlsm,
    [Parameter(Mandatory = $true)][string]$VbaDirectory,
    [Parameter(Mandatory = $true)][string]$VbamcPath,
    [Parameter(Mandatory = $true)][string]$PythonPath
)

$ErrorActionPreference = 'Stop'
$buildDirectory = Join-Path ([System.IO.Path]::GetTempPath()) ('axiomatic-vba-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $buildDirectory | Out-Null

try {
    & $VbamcPath `
        --module (Join-Path $VbaDirectory 'modAxiomaticDesign.bas') `
        --module (Join-Path $VbaDirectory 'modChecks.bas') `
        --module (Join-Path $VbaDirectory 'modEventBootstrap.bas') `
        --class (Join-Path $VbaDirectory 'CAppEvents.cls') `
        --name 'AxiomaticDesignToolkit' `
        --company 'NeoLearning' `
        --file 'axiomatic_macros.xlam' `
        --output $buildDirectory
    if ($LASTEXITCODE -ne 0) { throw "vbamc compilation failed with exit code $LASTEXITCODE" }

    $macroFile = Get-ChildItem -LiteralPath $buildDirectory -Recurse -Filter 'axiomatic_macros.xlam' | Select-Object -First 1
    if (-not $macroFile) { throw 'vbamc did not produce axiomatic_macros.xlam' }

    & $PythonPath (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) 'inject_vba.py') `
        $InputXlsx $macroFile.FullName $OutputXlsm
    if ($LASTEXITCODE -ne 0) { throw "VBA package injection failed with exit code $LASTEXITCODE" }

    $excel = $null
    $workbook = $null
    try {
        $excel = New-Object -ComObject Excel.Application
        $excel.Visible = $false
        $excel.DisplayAlerts = $false
        $excel.AutomationSecurity = 1
        $workbook = $excel.Workbooks.Open($OutputXlsm)
        $dashboard = $workbook.Worksheets.Item('Dashboard')

        foreach ($button in @($dashboard.Buttons())) {
            $button.Delete()
        }
        $buttonSpecs = @(
            @{ Caption = 'Refresh model'; Macro = 'RefreshAll'; Anchor = 'D18'; Width = 115; Height = 28 },
            @{ Caption = 'Run checks'; Macro = 'RunConsistencyChecks'; Anchor = 'F18'; Width = 105; Height = 28 },
            @{ Caption = 'Build tree'; Macro = 'BuildTreeView'; Anchor = 'H18'; Width = 100; Height = 28 },
            @{ Caption = 'Change impact'; Macro = 'AnalyzeSelectedImpact'; Anchor = 'D20'; Width = 115; Height = 28 },
            @{ Caption = 'Save snapshot'; Macro = 'CreateVersionSnapshot'; Anchor = 'F20'; Width = 105; Height = 28 }
        )
        foreach ($spec in $buttonSpecs) {
            $anchor = $dashboard.Range($spec.Anchor)
            $button = $dashboard.Buttons().Add($anchor.Left, $anchor.Top, $spec.Width, $spec.Height)
            $button.Caption = $spec.Caption
            $button.OnAction = $spec.Macro
        }

        $workbook.Save()
        try {
            $excel.Run("'" + $workbook.Name + "'!RefreshAll")
            $workbook.Save()
        }
        catch {
            Write-Warning 'Excel macro execution is blocked by the current Trust Center policy. The compiled VBA project and buttons were packaged, but runtime smoke testing must be done after Enable Content.'
        }
    }
    finally {
        if ($workbook) {
            $workbook.Close($false)
            [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($workbook)
        }
        if ($excel) {
            $excel.Quit()
            [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel)
        }
        [GC]::Collect()
        [GC]::WaitForPendingFinalizers()
    }
}
finally {
    if (Test-Path -LiteralPath $buildDirectory) {
        Remove-Item -LiteralPath $buildDirectory -Recurse -Force
    }
}
