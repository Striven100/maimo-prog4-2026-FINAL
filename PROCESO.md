# Proceso del portfolio

## 1. Problema de comunicación

El portfolio original concentraba información valiosa en Notion, pero la lectura dependía de páginas separadas y de una estructura pensada como base de datos. El objetivo fue convertir ese material en una experiencia web con una identidad propia que permitiera comprender rápidamente:

1. quién es Tobías;
2. qué tipo de problemas puede resolver;
3. cómo trabaja;
4. qué proyectos y experiencias respaldan ese perfil;
5. cómo contactarlo.

## 2. Alternativas exploradas

### Réplica de Notion

Se consideró conservar una navegación por categorías y páginas. Se descartó como dirección principal porque repetía el problema de fragmentación y ofrecía poca diferenciación visual.

### Portfolio clásico por páginas

Se evaluó una portada breve con una página por sección. Era clara, pero obligaba a navegar demasiado para conocer el perfil completo.

### Portada editorial con capas de detalle

Fue la alternativa elegida. La página principal concentra la información esencial; los diálogos permiten profundizar sin perder el contexto y las rutas individuales siguen disponibles para compartir proyectos.

## 3. Evolución por etapas

### Etapa 01 · bases

- Estructura Astro, navegación y categorías vacías.
- Primer esquema responsive.
- Separación entre layout, páginas y componentes.

### Etapa 02 · fuente dinámica

- API CRUD para proyectos, experiencias y datos complementarios.
- Formularios estructurados y carga de imágenes/PDF.
- Archivo completo y páginas por slug.
- Persistencia local y luego Vercel Blob.

### Etapa 03 · experiencia editorial

- Identidad visual, portada de una sola página y grilla visible.
- Rail de proyectos, filtros, galerías y diálogos.
- Panel de administración completo y sesión protegida.
- Transiciones y reducción de movimiento.

### Etapa 04 · entrega final

- Incorporación de NARA+, ABASTO y FRECUENCIA en celular, notebook y PDF.
- Selector interactivo para recorrer páginas largas.
- Dossier personal y ventanas de detalle de experiencia.
- Animación de cierre, ajustes de jerarquía, icono y metadatos.
- Migración no destructiva desde la base productiva anterior.
- Validación automática de contenido y documentación de examen.

## 4. Decisiones visuales

- Se evitó repetir tarjetas redondeadas: la jerarquía usa líneas, escala, contraste y cambios de fondo.
- Se combinó una sans de sistema para información funcional con una serif editorial para acentos.
- El azul funciona como identidad personal; cada caso agrega su propio color.
- Las animaciones son breves y funcionales: explican entrada, salida, selección o cambio de estado.
- Las páginas extensas se presentan dentro de un viewport controlado para poder compararlas sin abandonar el caso.

## 5. Pruebas realizadas

- `npm run validate:content`: IDs, slugs, campos esenciales y archivos.
- `astro check`: tipado y plantillas.
- `astro build`: salida de servidor y adaptador de Vercel.
- Revisión visual de portada, dossier, archivo y caso NARA+ en notebook.
- Pruebas de apertura/cierre, restauración de foco, hash, pestañas y cambio celular/notebook.
- Revisión de breakpoints 1120, 840, 760, 600 y 560 px en CSS; reflujo específico para celular.
- Verificación de `prefers-reduced-motion` y controles de teclado.

## 6. Dificultades y soluciones

### Persistencia en Vercel

El filesystem de una función no conserva cambios. Se reemplazó la escritura directa por Vercel Blob y se mantuvo JSON local como alternativa de desarrollo.

### Proteger el editor

Exponer rutas CRUD permitía modificar el portfolio sin control. Se incorporó una sesión firmada en cookie `HttpOnly`, `SameSite=Strict` y una clave guardada sólo en variables de entorno.

### Conservar cambios de la etapa anterior

La base productiva vive fuera del repositorio. La etapa 04 compara versiones de esquema, agrega proyectos faltantes y actualiza sólo los recursos curados de NARA+, preservando textos personales ya editados.

### Páginas de proyecto muy extensas

Mostrar las capturas completas en una tarjeta las volvía ilegibles. Se creó un visor con pestañas, ancho específico por dispositivo y scroll interno, acompañado por el PDF original.

## 7. Uso de IA

La IA se utilizó para:

- proponer alternativas de arquitectura y jerarquía;
- redactar primeras versiones de textos de interfaz y documentación;
- detectar requisitos faltantes de la consigna;
- implementar y revisar componentes, estilos, API y migración;
- preparar casos de prueba y detectar fallos de composición.

Las respuestas no se incorporaron de forma automática. Se adaptaron a la identidad definida, al contenido real disponible y a la arquitectura del proyecto. Se descartaron propuestas que agregaban funciones innecesarias, repetían patrones visuales o inventaban datos personales.

Problemas y límites observados:

- la IA no puede validar por sí sola la veracidad de experiencias no documentadas;
- los textos generados pueden sonar genéricos y requieren edición;
- una solución técnicamente válida puede no respetar la intención visual;
- la revisión automática no reemplaza la prueba manual ni la explicación del autor.

Decisiones tomadas por Tobías:

- concentrar la experiencia en una sola portada;
- priorizar ventanas emergentes y organización por categorías;
- mantener un editor completo en la página publicada;
- seleccionar el tono profesional y la variedad visual de los casos;
- aportar el contenido personal, los proyectos y las páginas finales.

## 8. Pendientes y mejoras posibles

- Traducir el portfolio al inglés.
- Generar miniaturas optimizadas desde el editor.
- Agregar pruebas end-to-end automatizadas.
- Incorporar analítica sin cookies para conocer recorridos frecuentes.
- Añadir más evidencia de investigación y validación en proyectos futuros.
