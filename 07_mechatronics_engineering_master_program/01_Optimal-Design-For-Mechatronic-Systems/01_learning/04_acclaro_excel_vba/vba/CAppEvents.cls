Option Explicit

Public WithEvents App As Application

Private Sub App_SheetChange(ByVal Sh As Object, ByVal Target As Range)
    If modAxiomaticDesign.gBusy Then Exit Sub
    If Sh.Parent.Name <> ThisWorkbook.Name Then Exit Sub
    If Sh.Name = "CN-FR-DP" Or Sh.Name = "Constraints" Or _
       Sh.Name = "Design Matrix" Or Sh.Name = "Information" Then
        modAxiomaticDesign.LogWorkbookChange Sh, Target
    End If
End Sub
