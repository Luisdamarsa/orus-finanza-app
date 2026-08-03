Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

source = "Codigo"
dest = "prod-v10.7.7"
basePath = fso.GetParentFolderName(WScript.ScriptFullName)

srcPath = fso.BuildPath(basePath, source)
destPath = fso.BuildPath(basePath, dest)

If fso.FolderExists(destPath) Then
  fso.DeleteFolder destPath
End If

fso.CopyFolder srcPath, destPath

MsgBox "✅ Guardado: prod-v10.7.7", 0, "ORUS"
