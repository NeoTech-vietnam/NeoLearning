Attribute VB_Name = "modAxiomaticDesign"
Option Explicit

Public Const MODEL_SHEET As String = "CN-FR-DP"
Public Const MATRIX_SHEET As String = "Design Matrix"
Public Const INFO_SHEET As String = "Information"
Public Const TREE_SHEET As String = "Tree View"
Public Const IMPACT_SHEET As String = "Impact"
Public Const DASHBOARD_SHEET As String = "Dashboard"
Public Const LOG_SHEET As String = "Change Log"
Public Const MAX_MATRIX_ITEMS As Long = 50

Public gBusy As Boolean

Public Sub RefreshAll()
    On Error GoTo Fail
    gBusy = True
    Application.ScreenUpdating = False
    Application.StatusBar = "Refreshing Axiomatic Design workbook..."

    BuildDesignMatrix
    BuildTreeView
    AnalyzeIndependence
    RunConsistencyChecks
    Application.CalculateFull
    UpdateDashboard

CleanExit:
    Application.StatusBar = False
    Application.ScreenUpdating = True
    gBusy = False
    Exit Sub
Fail:
    MsgBox "Refresh stopped: " & Err.Description, vbExclamation, "Axiomatic Design"
    Resume CleanExit
End Sub

Public Sub BuildDesignMatrix()
    Dim wsModel As Worksheet, wsMatrix As Worksheet
    Dim tbl As ListObject, rowItem As ListRow
    Dim frIds() As String, dpIds() As String, secondary() As String
    Dim n As Long, i As Long, j As Long, lastRow As Long, lastCol As Long
    Dim frId As String, dpId As String, statusText As String

    Set wsModel = ThisWorkbook.Worksheets(MODEL_SHEET)
    Set wsMatrix = ThisWorkbook.Worksheets(MATRIX_SHEET)
    Set tbl = wsModel.ListObjects("tblModel")

    For Each rowItem In tbl.ListRows
        statusText = Trim$(CStr(rowItem.Range.Cells(1, 20).Value))
        frId = Trim$(CStr(rowItem.Range.Cells(1, 5).Value))
        dpId = Trim$(CStr(rowItem.Range.Cells(1, 11).Value))
        If frId <> "" And dpId <> "" And LCase$(statusText) <> "retired" And _
           LCase$(statusText) <> "decomposed" Then
            n = n + 1
            If n > MAX_MATRIX_ITEMS Then
                MsgBox "The active model has more than " & MAX_MATRIX_ITEMS & _
                       " FR/DP pairs. Retire, filter, or split the model before rebuilding.", _
                       vbExclamation, "Matrix limit"
                Exit Sub
            End If
            ReDim Preserve frIds(1 To n)
            ReDim Preserve dpIds(1 To n)
            ReDim Preserve secondary(1 To n)
            frIds(n) = frId
            dpIds(n) = dpId
            secondary(n) = Trim$(CStr(rowItem.Range.Cells(1, 14).Value))
        End If
    Next rowItem

    wsMatrix.Range("A5:BD60").ClearContents
    If n = 0 Then Exit Sub

    wsMatrix.Cells(4, 1).Value = "FR \ DP"
    For j = 1 To n
        wsMatrix.Cells(4, j + 1).Value = dpIds(j)
    Next j
    wsMatrix.Cells(4, n + 2).Value = "Principal"
    wsMatrix.Cells(4, n + 3).Value = "Secondary"

    For i = 1 To n
        wsMatrix.Cells(i + 4, 1).Value = frIds(i)
        For j = 1 To n
            If StrComp(dpIds(j), dpIds(i), vbTextCompare) = 0 Then
                wsMatrix.Cells(i + 4, j + 1).Value = "X"
            ElseIf IdInList(dpIds(j), secondary(i)) Then
                wsMatrix.Cells(i + 4, j + 1).Value = ChrW(&H25B3)
            End If
        Next j
        wsMatrix.Cells(i + 4, n + 2).Formula = "=COUNTIFS(" & _
            wsMatrix.Range(wsMatrix.Cells(i + 4, 2), wsMatrix.Cells(i + 4, n + 1)).Address(False, False) & _
            ",""X"")"
        wsMatrix.Cells(i + 4, n + 3).Formula = "=COUNTIFS(" & _
            wsMatrix.Range(wsMatrix.Cells(i + 4, 2), wsMatrix.Cells(i + 4, n + 1)).Address(False, False) & _
            ",CHAR(9651))"
    Next i

    lastRow = n + 4
    lastCol = n + 3
    FormatMatrix wsMatrix, lastRow, lastCol, n
End Sub

Private Sub FormatMatrix(ByVal ws As Worksheet, ByVal lastRow As Long, _
                         ByVal lastCol As Long, ByVal n As Long)
    Dim matrixRange As Range, headerRange As Range
    Set matrixRange = ws.Range(ws.Cells(5, 2), ws.Cells(lastRow, n + 1))
    Set headerRange = ws.Range(ws.Cells(4, 1), ws.Cells(4, lastCol))

    With headerRange
        .Interior.Color = RGB(31, 78, 121)
        .Font.Color = RGB(255, 255, 255)
        .Font.Bold = True
        .HorizontalAlignment = xlCenter
    End With
    With matrixRange
        .HorizontalAlignment = xlCenter
        .VerticalAlignment = xlCenter
        .Borders.Color = RGB(217, 217, 217)
        .Borders.LineStyle = xlContinuous
    End With
    matrixRange.FormatConditions.Delete
    With matrixRange.FormatConditions.Add(Type:=xlCellValue, Operator:=xlEqual, Formula1:="=""X""")
        .Interior.Color = RGB(198, 239, 206)
        .Font.Color = RGB(0, 97, 0)
        .Font.Bold = True
    End With
    With matrixRange.FormatConditions.Add(Type:=xlCellValue, Operator:=xlEqual, Formula1:="=CHAR(9651)")
        .Interior.Color = RGB(255, 235, 156)
        .Font.Color = RGB(156, 101, 0)
    End With
End Sub

Public Sub AnalyzeIndependence()
    Dim ws As Worksheet, wsDash As Worksheet
    Dim n As Long, i As Long, j As Long
    Dim upperCount As Long, lowerCount As Long, secondaryCount As Long
    Dim mark As String, classification As String, sequence As String

    Set ws = ThisWorkbook.Worksheets(MATRIX_SHEET)
    Set wsDash = ThisWorkbook.Worksheets(DASHBOARD_SHEET)
    n = Application.WorksheetFunction.CountA(ws.Range("A5:A54"))

    For i = 1 To n
        For j = 1 To n
            mark = Trim$(CStr(ws.Cells(i + 4, j + 1).Value))
            If mark = ChrW(&H25B3) Or UCase$(mark) = "S" Then
                secondaryCount = secondaryCount + 1
                If j > i Then upperCount = upperCount + 1
                If j < i Then lowerCount = lowerCount + 1
            ElseIf mark = "X" And i <> j Then
                secondaryCount = secondaryCount + 1
                If j > i Then upperCount = upperCount + 1
                If j < i Then lowerCount = lowerCount + 1
            End If
        Next j
    Next i

    If n = 0 Then
        classification = "No active model"
    ElseIf secondaryCount = 0 Then
        classification = "Uncoupled"
    ElseIf upperCount = 0 Or lowerCount = 0 Then
        classification = "Decoupled"
    Else
        classification = "Coupled"
    End If

    sequence = CalculateDesignSequence(ws, n)
    ws.Range("R2").Value = classification
    ws.Range("R3").Value = sequence
    wsDash.Range("B8").Value = classification
    wsDash.Range("B9").Value = sequence
End Sub

Private Function CalculateDesignSequence(ByVal ws As Worksheet, ByVal n As Long) As String
    Dim indegree() As Long, used() As Boolean, labels() As String
    Dim i As Long, j As Long, k As Long, picked As Long, result As String
    Dim mark As String, found As Boolean

    If n = 0 Then Exit Function
    ReDim indegree(1 To n)
    ReDim used(1 To n)
    ReDim labels(1 To n)

    For i = 1 To n
        labels(i) = CStr(ws.Cells(4, i + 1).Value)
        For j = 1 To n
            mark = Trim$(CStr(ws.Cells(i + 4, j + 1).Value))
            If i <> j And (mark = ChrW(&H25B3) Or mark = "X" Or UCase$(mark) = "S") Then
                indegree(i) = indegree(i) + 1
            End If
        Next j
    Next i

    For k = 1 To n
        found = False
        For i = 1 To n
            If Not used(i) And indegree(i) = 0 Then
                picked = i
                found = True
                Exit For
            End If
        Next i
        If Not found Then
            CalculateDesignSequence = "Cycle detected - redesign or decompose"
            Exit Function
        End If

        used(picked) = True
        If result <> "" Then result = result & " -> "
        result = result & labels(picked)

        For i = 1 To n
            If Not used(i) Then
                mark = Trim$(CStr(ws.Cells(i + 4, picked + 1).Value))
                If mark = ChrW(&H25B3) Or mark = "X" Or UCase$(mark) = "S" Then
                    indegree(i) = indegree(i) - 1
                End If
            End If
        Next i
    Next k
    CalculateDesignSequence = result
End Function

Public Sub BuildTreeView()
    Dim wsModel As Worksheet, wsTree As Worksheet, tbl As ListObject
    Dim r As ListRow, outRow As Long, levelValue As Long
    Set wsModel = ThisWorkbook.Worksheets(MODEL_SHEET)
    Set wsTree = ThisWorkbook.Worksheets(TREE_SHEET)
    Set tbl = wsModel.ListObjects("tblModel")

    wsTree.Range("A5:H200").ClearContents
    outRow = 5
    For Each r In tbl.ListRows
        If LCase$(Trim$(CStr(r.Range.Cells(1, 20).Value))) <> "retired" And _
           Trim$(CStr(r.Range.Cells(1, 5).Value)) <> "" Then
            levelValue = Val(r.Range.Cells(1, 1).Value)
            wsTree.Cells(outRow, 1).Value = levelValue
            wsTree.Cells(outRow, 2).Value = r.Range.Cells(1, 5).Value
            wsTree.Cells(outRow, 3).Value = r.Range.Cells(1, 7).Value
            wsTree.Cells(outRow, 4).Value = r.Range.Cells(1, 11).Value
            wsTree.Cells(outRow, 5).Value = r.Range.Cells(1, 13).Value
            wsTree.Cells(outRow, 6).Value = r.Range.Cells(1, 6).Value
            wsTree.Cells(outRow, 7).Value = r.Range.Cells(1, 12).Value
            wsTree.Cells(outRow, 8).Value = r.Range.Cells(1, 20).Value
            wsTree.Cells(outRow, 2).IndentLevel = Application.Min(levelValue, 15)
            wsTree.Cells(outRow, 4).IndentLevel = Application.Min(levelValue, 15)
            outRow = outRow + 1
        End If
    Next r
End Sub

Public Sub AnalyzeSelectedImpact()
    Dim targetId As String
    targetId = Trim$(InputBox("Enter an FR or DP ID, for example FR6 or DP5:", _
                              "Change impact"))
    If targetId = "" Then Exit Sub
    BuildImpactReport targetId
End Sub

Public Sub BuildImpactReport(ByVal targetId As String)
    Dim wsModel As Worksheet, wsImpact As Worksheet, tbl As ListObject
    Dim r As ListRow, outRow As Long, frId As String, dpId As String
    Dim parentFr As String, parentDp As String, secondary As String, reason As String

    Set wsModel = ThisWorkbook.Worksheets(MODEL_SHEET)
    Set wsImpact = ThisWorkbook.Worksheets(IMPACT_SHEET)
    Set tbl = wsModel.ListObjects("tblModel")
    wsImpact.Range("A7:F500").ClearContents
    wsImpact.Range("B4").Value = targetId
    outRow = 7

    For Each r In tbl.ListRows
        frId = Trim$(CStr(r.Range.Cells(1, 5).Value))
        parentFr = Trim$(CStr(r.Range.Cells(1, 6).Value))
        dpId = Trim$(CStr(r.Range.Cells(1, 11).Value))
        parentDp = Trim$(CStr(r.Range.Cells(1, 12).Value))
        secondary = Trim$(CStr(r.Range.Cells(1, 14).Value))
        reason = ""

        If StrComp(frId, targetId, vbTextCompare) = 0 Or _
           StrComp(dpId, targetId, vbTextCompare) = 0 Then reason = "Selected item"
        If StrComp(parentFr, targetId, vbTextCompare) = 0 Or _
           StrComp(parentDp, targetId, vbTextCompare) = 0 Then reason = "Direct child"
        If IdInList(targetId, secondary) Then reason = "Secondary DP interaction"

        If reason <> "" Then
            wsImpact.Cells(outRow, 1).Value = frId
            wsImpact.Cells(outRow, 2).Value = r.Range.Cells(1, 7).Value
            wsImpact.Cells(outRow, 3).Value = dpId
            wsImpact.Cells(outRow, 4).Value = r.Range.Cells(1, 13).Value
            wsImpact.Cells(outRow, 5).Value = reason
            wsImpact.Cells(outRow, 6).Value = "Review requirement, range, interfaces, and verification"
            outRow = outRow + 1
        End If
    Next r

    If outRow = 7 Then
        wsImpact.Cells(7, 1).Value = targetId
        wsImpact.Cells(7, 5).Value = "No direct model references found"
    End If
    wsImpact.Activate
End Sub

Public Sub CreateVersionSnapshot()
    Dim folderPath As String, filePath As String, baseName As String
    If ThisWorkbook.Path = "" Then
        MsgBox "Save the workbook before creating a snapshot.", vbExclamation, "Version snapshot"
        Exit Sub
    End If

    folderPath = ThisWorkbook.Path & Application.PathSeparator & "versions"
    If Dir(folderPath, vbDirectory) = "" Then MkDir folderPath
    baseName = Left$(ThisWorkbook.Name, InStrRev(ThisWorkbook.Name, ".") - 1)
    filePath = folderPath & Application.PathSeparator & baseName & "_" & _
               Format$(Now, "yyyymmdd_hhnnss") & ".xlsm"
    ThisWorkbook.SaveCopyAs filePath
    MsgBox "Snapshot saved:" & vbCrLf & filePath, vbInformation, "Version snapshot"
End Sub

Public Sub UpdateDashboard()
    Dim wsDash As Worksheet, wsChecks As Worksheet
    Set wsDash = ThisWorkbook.Worksheets(DASHBOARD_SHEET)
    Set wsChecks = ThisWorkbook.Worksheets("Checks")
    wsDash.Range("B11").Value = Application.WorksheetFunction.CountIf(wsChecks.Range("A5:A504"), "Error")
    wsDash.Range("B12").Value = Application.WorksheetFunction.CountIf(wsChecks.Range("A5:A504"), "Warning")
    wsDash.Range("B13").Value = ThisWorkbook.Worksheets(LOG_SHEET).Cells( _
        ThisWorkbook.Worksheets(LOG_SHEET).Rows.Count, 1).End(xlUp).Row - 4
End Sub

Public Sub LogWorkbookChange(ByVal Sh As Object, ByVal Target As Range)
    Dim wsLog As Worksheet, nextRow As Long, newText As String
    If gBusy Then Exit Sub
    If Sh.Name = LOG_SHEET Then Exit Sub
    If Intersect(Target, Sh.UsedRange) Is Nothing Then Exit Sub

    On Error GoTo CleanExit
    gBusy = True
    Set wsLog = ThisWorkbook.Worksheets(LOG_SHEET)
    nextRow = wsLog.Cells(wsLog.Rows.Count, 1).End(xlUp).Row + 1
    If nextRow < 5 Then nextRow = 5
    newText = Left$(Target.Cells(1, 1).Text, 250)
    wsLog.Cells(nextRow, 1).Value = Now
    wsLog.Cells(nextRow, 2).Value = Application.UserName
    wsLog.Cells(nextRow, 3).Value = Sh.Name
    wsLog.Cells(nextRow, 4).Value = Target.Address(False, False)
    wsLog.Cells(nextRow, 5).Value = newText
    wsLog.Cells(nextRow, 6).Value = "Review dependent FR/DP items if this is a model input."
CleanExit:
    gBusy = False
End Sub

Public Function IdInList(ByVal searchId As String, ByVal csvList As String) As Boolean
    Dim parts() As String, item As Variant
    If Trim$(searchId) = "" Or Trim$(csvList) = "" Then Exit Function
    parts = Split(Replace(csvList, ";", ","), ",")
    For Each item In parts
        If StrComp(Trim$(CStr(item)), Trim$(searchId), vbTextCompare) = 0 Then
            IdInList = True
            Exit Function
        End If
    Next item
End Function
