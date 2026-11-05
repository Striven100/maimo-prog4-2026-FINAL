# Etapa 03 · experiencia editorial y editor completo

## Objetivo

Esta etapa transforma la base funcional del portfolio en una experiencia profesional, reconocible y preparada para crecer. La información sigue siendo administrable desde la API, pero ahora la presentación tiene una dirección editorial propia: tipografía de gran escala, grilla visible, contrastes controlados y colores de acento definidos por proyecto.

## Experiencia pública

- Portada de una sola página con navegación fija, indicador de progreso y estados activos por sección.
- Presentación personal con retrato opcional, especialidades y accesos directos a los bloques principales.
- Fila de proyectos filtrable con galerías automáticas y pausa cuando el usuario interactúa.
- Ventanas de detalle accesibles con desafío, proceso, resultado, rol, herramientas, entregables, enlaces y PDF.
- Apertura directa de un proyecto mediante su hash y navegación de imágenes con las flechas del teclado.
- Archivo completo en `/trabajos` y páginas individuales en `/trabajos/[slug]`.
- Animaciones progresivas que respetan `prefers-reduced-motion`.

## Editor

El panel `/admin` permite administrar:

1. Narrativa global, títulos de sección, especialidades, llamado a contacto y pie de página.
2. Proyectos, incluidos año, color de acento, estado, visibilidad y orden.
3. Portada, galería y PDF de cada proyecto; los archivos existentes se pueden reordenar, describir o quitar.
4. Experiencia laboral con formato estructurado.
5. Skills, herramientas, servicios, certificaciones, educación e intereses.
6. Perfil, retrato y canales de contacto.

Las escrituras se protegen con una sesión firmada. En desarrollo se usa `data/portfolio.json`; en Vercel se utiliza Blob para que los cambios y archivos sobrevivan nuevos despliegues.

## Criterios de interfaz

- Jerarquía basada en escala y contraste, no en tarjetas redondeadas repetidas.
- Componentes rectangulares, bordes finos y cambios de fondo para separar funciones.
- Colores de acento por caso, manteniendo una base neutra común.
- Estados de foco visibles, etiquetas explícitas y textos alternativos editables.
- Diseño responsive con reflujo de grillas, navegación móvil y controles táctiles.

## Verificación

Antes de publicar se ejecutan `astro check` y `astro build`, se prueban la apertura y el cierre de diálogos, la navegación de galerías, los formularios del editor y las rutas CRUD. En producción también se valida que Vercel Blob y `PORTFOLIO_ADMIN_KEY` estén conectados al despliegue.
