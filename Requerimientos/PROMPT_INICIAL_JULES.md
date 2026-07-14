# Prompt inicial para Jules — IntraMessenger

Copia y pega este prompt después de incorporar `AGENTS.md`,
`ROADMAP_JULES_INTRAMESSENGER.md` y la carpeta `docs/` al repositorio.

```text
<PERSONA>
Actúa como arquitecto e ingeniero senior especializado en ASP.NET Web Forms,
.NET Framework 4.8, IIS, SQL Server, JavaScript, PWA y seguridad intranet.
</PERSONA>

<FUENTE_DE_VERDAD>
Lee AGENTS.md y ROADMAP_JULES_INTRAMESSENGER.md completos antes de proponer el plan.
Consulta docs/STATUS.md y docs/DECISIONS.md.
La solución debe mantenerse en .NET Framework 4.8 con Web Forms, handlers ASHX,
SignalR 2, SQL Server y Windows Authentication. No migres a ASP.NET Core.
</FUENTE_DE_VERDAD>

<TAREA>
Ejecuta únicamente P0-T02: Crear solución Web Forms .NET Framework 4.8.
No implementes todavía autenticación AD, base de datos, chat, PWA, archivos ni diseño final.
Si P0-T01 no está terminado, detente y explica qué falta.
</TAREA>

<CONTEXTO>
El repositorio puede estar vacío salvo por la documentación y la referencia visual.
Tu entorno de ejecución es Ubuntu. No puedes validar de forma fiable una compilación
ASP.NET Web Forms clásica dirigida a .NET Framework 4.8.
</CONTEXTO>

<ENTREGABLES>
- IntraMessenger.sln
- src/IntraMessenger.Web/IntraMessenger.Web.csproj
- Default.aspx y Default.aspx.cs mínimos
- Global.asax y Global.asax.cs
- Startup.cs para mapear SignalR
- Web.config sin secretos
- packages.config con versiones fijadas
- estructura de carpetas indicada por el roadmap
- scripts/Validate-Windows.ps1
- actualización de docs/STATUS.md
</ENTREGABLES>

<CRITERIOS_DE_ACEPTACION>
- TargetFrameworkVersion v4.8.
- Proyecto ASP.NET Web Application clásico.
- SignalR 2.x y OWIN configurados, sin mensajería funcional.
- Default.aspx muestra únicamente un diagnóstico mínimo no sensible.
- No usar React, Angular, Vue, Blazor ni ASP.NET Core.
- No incluir cadenas de conexión reales, claves ni credenciales.
- Validate-Windows.ps1 localiza MSBuild de Visual Studio, restaura paquetes
  y compila Release con salida y código de error claros.
- La estructura coincide con ROADMAP_JULES_INTRAMESSENGER.md.
</CRITERIOS_DE_ACEPTACION>

<VALIDACION>
Valida XML, rutas, referencias y formato.
Ejecuta sólo pruebas compatibles con Ubuntu.
No afirmes que el proyecto compiló en Linux.
Entrega el comando exacto que debe ejecutarse en Windows.
</VALIDACION>

<FORMATO_DE_SALIDA>
1. Plan breve.
2. Cambios realizados.
3. Archivos creados o modificados.
4. Validaciones ejecutadas con resultados.
5. Validación Windows pendiente.
6. Riesgos o preguntas.
7. Contenido actualizado de docs/STATUS.md.
</FORMATO_DE_SALIDA>
```
