# Arquitectura del portfolio

## Modelo de navegación

El sitio utiliza una única página extensa con navegación por anclas. De esta forma, una persona puede recorrer el perfil completo sin cargar pantallas independientes ni perder el contexto.

Los casos de estudio funcionan como una segunda capa de información: cada tarjeta abre un elemento HTML `dialog` que ocupa casi toda la pantalla y mantiene visible el portfolio como contexto de fondo.

## Organización del contenido

1. **Identidad y presentación.** Nombre, especialidad, disponibilidad, ubicación y resumen profesional.
2. **Trabajo seleccionado.** Cuatro proyectos conceptuales organizados mediante filtros de UX/UI, identidad y producto.
3. **Capacidades.** Servicios, habilidades de trabajo y dominio de herramientas.
4. **Experiencia.** Roles profesionales y aplicaciones concretas del conocimiento.
5. **Formación.** Estudios, certificaciones e intereses.
6. **Contacto.** Acciones directas para correo, LinkedIn y teléfono.

## Sistema visual

La interfaz combina una grilla editorial, bordes rectos, tipografía de alto contraste, azul eléctrico y verde ácido. La iconografía lineal ayuda a clasificar información sin depender de imágenes externas. Cada proyecto posee una composición y una paleta propias para mantener variedad visual.

## Accesibilidad e interacción

- Enlace para saltar al contenido.
- Navegación semántica y encabezados jerárquicos.
- Indicador automático de la sección activa.
- Filtros con estado `aria-pressed`.
- Diálogos nativos compatibles con teclado y tecla `Esc`.
- Restauración del foco al cerrar cada proyecto.
- Estados de foco visibles y soporte para reducción de movimiento.
- Diseño responsive para notebook y celular.

