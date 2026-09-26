Attribute VB_Name = "modEventBootstrap"
Option Explicit

Public gAppEvents As CAppEvents

Public Sub Auto_Open()
    On Error Resume Next
    Set gAppEvents = New CAppEvents
    Set gAppEvents.App = Application
    modAxiomaticDesign.RefreshAll
    ThisWorkbook.Worksheets("Dashboard").Activate
End Sub

Public Sub Auto_Close()
    Set gAppEvents = Nothing
End Sub

