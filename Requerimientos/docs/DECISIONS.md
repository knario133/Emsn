# Decisiones arquitectónicas

## ADR-001 — Plataforma

**Estado:** Aceptada  
**Decisión:** ASP.NET Web Forms sobre .NET Framework 4.8 en IIS.  
**Motivo:** compatibilidad con la infraestructura y experiencia existente.  
**Consecuencia:** build y pruebas completas requieren Windows.

## ADR-002 — Tiempo real

**Estado:** Aceptada  
**Decisión:** ASP.NET SignalR 2.x mediante OWIN.  
**Motivo:** tiempo real compatible con .NET Framework 4.8 y Web Forms.  
**Consecuencia:** mensajes se persisten antes de emitir eventos.

## ADR-003 — Datos

**Estado:** Aceptada  
**Decisión:** SQL Server, ADO.NET y procedimientos almacenados.  
**Motivo:** compatibilidad operativa y control transaccional.  
**Consecuencia:** no se incorpora ORM como fuente principal de acceso.

## ADR-004 — Identidad

**Estado:** Aceptada  
**Decisión:** Windows Authentication con Active Directory local.  
**Motivo:** evitar enrolamiento y reutilizar identidad corporativa.  
**Consecuencia:** la aplicación no almacena contraseñas.

## ADR-005 — Transferencia de archivos

**Estado:** Aceptada  
**Decisión:** WebRTC DataChannel como transporte primario, con SignalR para señalización.  
**Motivo:** transferencia temporal sin almacenamiento permanente.  
**Consecuencia:** puede requerir TURN para redes restrictivas.
