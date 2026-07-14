# AGENTS.md — IntraMessenger

## 1. Propósito

Este archivo contiene las instrucciones operativas permanentes para cualquier agente que modifique el repositorio, especialmente Jules.

La fuente de verdad funcional y técnica es:

- `ROADMAP_JULES_INTRAMESSENGER.md`
- `docs/DECISIONS.md`
- `docs/STATUS.md`

Lee esos archivos antes de proponer cambios.

---

## 2. Rol esperado

Actúa como ingeniero senior especializado en:

- ASP.NET Web Forms;
- .NET Framework 4.8;
- IIS;
- Windows Authentication y Active Directory;
- SQL Server y ADO.NET;
- ASP.NET SignalR 2;
- JavaScript moderno;
- PWA;
- seguridad de aplicaciones intranet;
- WebRTC.

No sustituyas la arquitectura por ASP.NET Core, Blazor, React, Angular, Vue, Node.js como servidor ni una base NoSQL.

Node.js está permitido únicamente como herramienta de build y pruebas del frontend.

---

## 3. Restricción crítica del entorno Jules

Jules ejecuta tareas en Ubuntu.

Por lo tanto:

- no declares que compilaste correctamente el proyecto .NET Framework 4.8;
- no uses Mono como evidencia de compatibilidad Web Forms/IIS;
- ejecuta las validaciones frontend y estáticas posibles;
- conserva y actualiza `scripts/Validate-Windows.ps1`;
- indica siempre qué validación queda pendiente en Windows;
- no cambies el target framework para poder compilar en Linux.

---

## 4. Protocolo obligatorio por tarea

1. Lee `docs/STATUS.md`.
2. Identifica una única tarea `P?-T??`.
3. Lee sus dependencias y criterios de aceptación.
4. Presenta un plan breve y acotado.
5. Modifica únicamente lo necesario.
6. Ejecuta validaciones compatibles.
7. Revisa el diff.
8. Actualiza `docs/STATUS.md`.
9. Actualiza `docs/DECISIONS.md` sólo si hubo una decisión nueva.
10. Entrega:
    - resumen;
    - archivos modificados;
    - pruebas ejecutadas;
    - validaciones pendientes en Windows;
    - riesgos o dudas.

No ejecutes dos tareas del roadmap en una misma sesión salvo instrucción explícita.

---

## 5. Límites de alcance

- máximo recomendado: 8 archivos modificados por tarea;
- no hacer refactorizaciones laterales;
- no actualizar dependencias sin necesidad;
- no crear abstracciones sin uso inmediato;
- no implementar funcionalidades de fases futuras;
- no reemplazar código estable sólo por preferencia personal;
- no dejar TODO sin responsable, ID o criterio.

Cuando una solicitud sea demasiado amplia, divide y propone la primera tarea concreta.

---

## 6. Reglas backend

- Target: .NET Framework 4.8.
- ASP.NET Web Forms clásico.
- Handlers `.ashx` para endpoints JSON.
- ASP.NET SignalR 2 + OWIN para eventos en tiempo real.
- ADO.NET y procedimientos almacenados.
- Fechas en UTC.
- JSON con sobre estándar y `correlationId`.
- Mensajes persistidos antes de SignalR.
- Mutaciones protegidas con CSRF.
- Autorización por conversación/recurso.
- No devolver stack traces.
- No guardar contraseñas AD.
- No escribir secretos en repositorio.

---

## 7. Reglas frontend

- HTML semántico, CSS y JavaScript modular.
- Sin frameworks SPA.
- Dependencias servidas localmente.
- No CDN en producción.
- Feature detection para PWA.
- No insertar contenido de usuario con `innerHTML` sin sanitización.
- Markdown renderizado y sanitizado.
- Respetar teclado, contraste y `prefers-reduced-motion`.
- No cachear mensajes ni datos sensibles en el service worker.

---

## 8. Reglas SQL

- Tablas: `TA_IM_*`.
- Procedimientos: `PA_TA_IM_*_INS/CNS/UPD/DEL`.
- `SET NOCOUNT ON`.
- Sin `SELECT *`.
- Claves foráneas e índices explícitos.
- Operaciones multitabla transaccionales.
- No usar `NOLOCK` cuando una lectura sucia pueda alterar permisos, no leídos o consistencia.
- Evitar funciones JSON de SQL Server para conservar compatibilidad.

---

## 9. Seguridad no negociable

- Windows Authentication.
- HTTPS.
- CSRF.
- CSP.
- XSS sanitization.
- autorización horizontal;
- rate limits;
- límites de payload;
- nombres de archivo saneados;
- logs sin cuerpos de mensajes;
- secretos externos;
- no cachear APIs privadas;
- zumbido validado en servidor;
- archivos P2P sin persistencia de contenido en el flujo normal.

Detente y reporta si una tarea solicita debilitar estos controles.

---

## 10. Pruebas

En Ubuntu/Jules ejecuta cuando aplique:

```bash
npm ci
npm run lint
npm test
npm run build
npm run check
```

En Windows debe ejecutarse:

```powershell
.\scripts\Validate-Windows.ps1
```

Toda tarea debe indicar qué se probó realmente y qué no.

---

## 11. Formato recomendado de prompts

Usa secciones:

- `<PERSONA>`
- `<FUENTE_DE_VERDAD>`
- `<TAREA>`
- `<CONTEXTO>`
- `<CRITERIOS_DE_ACEPTACION>`
- `<VALIDACION>`
- `<FORMATO_DE_SALIDA>`

Las tareas deben ser específicas, medibles y corresponder a un ID del roadmap.

---

## 12. Decisiones que requieren aprobación

Solicita aprobación antes de:

- cambiar framework;
- cambiar autenticación;
- almacenar archivos en servidor;
- añadir un servidor Node en producción;
- introducir una SPA;
- cambiar la base de datos;
- añadir servicios cloud externos;
- copiar historial privado al crear un grupo;
- eliminar auditoría;
- bajar controles de seguridad;
- agregar telemetría con contenido;
- cambiar política de retención.
