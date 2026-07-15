# Estado del proyecto

- **Proyecto:** IntraMessenger
- **Fase actual:** P1 — Identidad, base de datos y shell PWA
- **Última actualización:** 2026-07-14
- **Última tarea terminada:** P1-T04 — Shell visual responsive
- **Tarea en curso:** Ninguna
- **Siguiente tarea:** P1-T01 — Script de creación de base de datos
- **Bloqueos conocidos:** ninguno para P1-T04; las futuras validaciones .NET Framework continúan requiriendo Windows/Visual Studio.
- **Decisiones pendientes:** nombre comercial, versiones de servidor/SQL y políticas de red.

## Regla

Actualizar este archivo al terminar cada tarea. No marcar una tarea como finalizada sin sus criterios de aceptación y la validación Windows correspondiente cuando aplique.

- **Validación P0-T04:** compilación Windows con 0 advertencias y 0 errores; pruebas HTTP con 69 aprobadas y 0 fallidas.
- **Validación P1-T04:** `npm ci` completado; lint, 11 pruebas frontend y build aprobados; MSBuild Release en Windows con 0 advertencias y 0 errores; revisión visual e interacciones aprobadas en navegador integrado a 1440x900, 900x1100 y 390x844, sin scroll horizontal ni errores de consola. Corregida y verificada la separación entre hora y favorito en escritorio, conservando la disposición móvil; la cabecera y el análisis de contacto incluyen señal local, menú informativo, favoritos sincronizados y señalización explícita de demostración. `npm run check` conserva una incidencia de formato preexistente en cuatro archivos fuera del alcance de P1-T04.
