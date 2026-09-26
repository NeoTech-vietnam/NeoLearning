Attribute VB_Name = "modChecks"
Option Explicit

Public Sub RunConsistencyChecks()
    Dim wsModel As Worksheet, wsConstraints As Worksheet, wsChecks As Worksheet
    Dim model As ListObject, constraints As ListObject, r As ListRow
    Dim seenFr As Object, seenDp As Object, seenCn As Object, seenConstraint As Object
    Dim outRow As Long, frId As String, dpId As String, cnId As String
    Dim parentFr As String, parentDp As String, statusText As String
    Dim secondary As String, item As Variant

    Set wsModel = ThisWorkbook.Worksheets(MODEL_SHEET)
    Set wsConstraints = ThisWorkbook.Worksheets("Constraints")
    Set wsChecks = ThisWorkbook.Worksheets("Checks")
    Set model = wsModel.ListObjects("tblModel")
    Set constraints = wsConstraints.ListObjects("tblConstraints")
    Set seenFr = CreateObject("Scripting.Dictionary")
    Set seenDp = CreateObject("Scripting.Dictionary")
    Set seenCn = CreateObject("Scripting.Dictionary")
    Set seenConstraint = CreateObject("Scripting.Dictionary")
    seenFr.CompareMode = vbTextCompare
    seenDp.CompareMode = vbTextCompare
    seenCn.CompareMode = vbTextCompare
    seenConstraint.CompareMode = vbTextCompare

    wsChecks.Range("A5:E504").ClearContents
    outRow = 5

    For Each r In model.ListRows
        statusText = LCase$(Trim$(CStr(r.Range.Cells(1, 20).Value)))
        cnId = Trim$(CStr(r.Range.Cells(1, 2).Value))
        frId = Trim$(CStr(r.Range.Cells(1, 5).Value))
        dpId = Trim$(CStr(r.Range.Cells(1, 11).Value))
        If statusText <> "retired" And (cnId <> "" Or frId <> "" Or dpId <> "") Then
            If cnId <> "" Then seenCn(cnId) = True
            If frId <> "" Then
                If seenFr.Exists(frId) Then AddCheck wsChecks, outRow, "Error", frId, "Duplicate FR ID", "Use one row per FR ID"
                seenFr(frId) = True
            End If
            If dpId <> "" Then
                If seenDp.Exists(dpId) Then AddCheck wsChecks, outRow, "Error", dpId, "Duplicate DP ID", "Use one row per DP ID"
                seenDp(dpId) = True
            End If
        End If
    Next r

    For Each r In constraints.ListRows
        item = Trim$(CStr(r.Range.Cells(1, 1).Value))
        If item <> "" Then
            If seenConstraint.Exists(item) Then AddCheck wsChecks, outRow, "Error", CStr(item), "Duplicate constraint ID", "Use a unique constraint ID"
            seenConstraint(item) = True
        End If
    Next r

    For Each r In model.ListRows
        statusText = LCase$(Trim$(CStr(r.Range.Cells(1, 20).Value)))
        cnId = Trim$(CStr(r.Range.Cells(1, 2).Value))
        frId = Trim$(CStr(r.Range.Cells(1, 5).Value))
        dpId = Trim$(CStr(r.Range.Cells(1, 11).Value))
        If statusText <> "retired" And (cnId <> "" Or frId <> "" Or dpId <> "") Then
            parentFr = Trim$(CStr(r.Range.Cells(1, 6).Value))
            parentDp = Trim$(CStr(r.Range.Cells(1, 12).Value))
            secondary = Trim$(CStr(r.Range.Cells(1, 14).Value))

            If frId = "" Then AddCheck wsChecks, outRow, "Error", "Model row " & r.Index, "Missing FR ID", "Enter a stable FR ID"
            If Trim$(CStr(r.Range.Cells(1, 7).Value)) = "" Then AddCheck wsChecks, outRow, "Error", frId, "Missing FR definition", "Describe what must be achieved"
            If dpId = "" Then AddCheck wsChecks, outRow, "Error", frId, "Missing principal DP ID", "Assign one principal DP"
            If Trim$(CStr(r.Range.Cells(1, 13).Value)) = "" Then AddCheck wsChecks, outRow, "Error", dpId, "Missing DP definition", "Describe the proposed design parameter"
            If parentFr <> "" And Not seenFr.Exists(parentFr) Then AddCheck wsChecks, outRow, "Error", frId, "Parent FR not found: " & parentFr, "Correct the parent link"
            If parentDp <> "" And Not seenDp.Exists(parentDp) Then AddCheck wsChecks, outRow, "Error", dpId, "Parent DP not found: " & parentDp, "Correct the parent link"

            CheckRange wsChecks, outRow, frId, "Design range", r.Range.Cells(1, 8).Value, r.Range.Cells(1, 9).Value
            CheckRange wsChecks, outRow, frId, "System range", r.Range.Cells(1, 15).Value, r.Range.Cells(1, 16).Value
            CheckSecondaryIds wsChecks, outRow, frId, secondary, seenDp
            CheckConstraintIds wsChecks, outRow, frId, CStr(r.Range.Cells(1, 17).Value), seenConstraint
        End If
    Next r

    If outRow = 5 Then
        AddCheck wsChecks, outRow, "OK", "Workbook", "No consistency issues found", "Run checks after model changes"
    End If
End Sub

Private Sub CheckRange(ByVal ws As Worksheet, ByRef outRow As Long, ByVal itemId As String, _
                       ByVal rangeName As String, ByVal lowValue As Variant, ByVal highValue As Variant)
    Dim lowBlank As Boolean, highBlank As Boolean
    lowBlank = Len(Trim$(CStr(lowValue))) = 0
    highBlank = Len(Trim$(CStr(highValue))) = 0
    If lowBlank And highBlank Then Exit Sub
    If lowBlank Xor highBlank Then
        AddCheck ws, outRow, "Warning", itemId, rangeName & " is incomplete", "Enter both limits or leave both TBC"
    ElseIf Not IsNumeric(lowValue) Or Not IsNumeric(highValue) Then
        AddCheck ws, outRow, "Error", itemId, rangeName & " contains a nonnumeric limit", "Enter numeric limits"
    Else
        If CDbl(lowValue) >= CDbl(highValue) Then
            AddCheck ws, outRow, "Error", itemId, rangeName & " lower limit is not below upper limit", "Correct the limits"
        End If
    End If
End Sub

Private Sub CheckSecondaryIds(ByVal ws As Worksheet, ByRef outRow As Long, ByVal frId As String, _
                              ByVal csvList As String, ByVal known As Object)
    Dim parts() As String, item As Variant, clean As String
    If Trim$(csvList) = "" Then Exit Sub
    parts = Split(Replace(csvList, ";", ","), ",")
    For Each item In parts
        clean = Trim$(CStr(item))
        If clean <> "" And Not known.Exists(clean) Then
            AddCheck ws, outRow, "Error", frId, "Secondary DP not found: " & clean, "Correct or add the DP ID"
        End If
    Next item
End Sub

Private Sub CheckConstraintIds(ByVal ws As Worksheet, ByRef outRow As Long, ByVal frId As String, _
                               ByVal csvList As String, ByVal known As Object)
    Dim parts() As String, item As Variant, clean As String
    If Trim$(csvList) = "" Then Exit Sub
    parts = Split(Replace(csvList, ";", ","), ",")
    For Each item In parts
        clean = Trim$(CStr(item))
        If clean <> "" And Not known.Exists(clean) Then
            AddCheck ws, outRow, "Warning", frId, "Constraint not found: " & clean, "Correct or add the constraint ID"
        End If
    Next item
End Sub

Private Sub AddCheck(ByVal ws As Worksheet, ByRef outRow As Long, ByVal severity As String, _
                     ByVal itemId As String, ByVal issue As String, ByVal actionText As String)
    ws.Cells(outRow, 1).Value = severity
    ws.Cells(outRow, 2).Value = itemId
    ws.Cells(outRow, 3).Value = issue
    ws.Cells(outRow, 4).Value = actionText
    ws.Cells(outRow, 5).Value = Now
    outRow = outRow + 1
End Sub
