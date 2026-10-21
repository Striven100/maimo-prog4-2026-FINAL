# Estructura inicial

La versión separa cuatro responsabilidades:

1. Astro construye rutas, layouts y componentes semánticos.
2. `page.js` coordina los módulos del navegador.
3. Los controladores de `scripts/pages/` resuelven comportamientos por página.
4. El back expone un contrato estable aunque sus colecciones estén vacías.

Esta división permite añadir datos en la etapa 02, ampliar interacciones en la etapa 03 y aplicar la identidad definitiva en la etapa 04 sin reemplazar los fundamentos.
