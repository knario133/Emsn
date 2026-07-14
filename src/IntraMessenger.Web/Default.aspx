<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="IntraMessenger.Web.Default" %>

<!DOCTYPE html>
<html lang="es">
<head runat="server">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IntraMessenger - Diagnóstico</title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <h1>IntraMessenger</h1>
            <p>Estado del sistema: <asp:Label ID="lblStatus" runat="server" Text="Inicializando..."></asp:Label></p>
            <p>Modo de Diagnóstico.</p>
        </div>
    </form>
</body>
</html>
