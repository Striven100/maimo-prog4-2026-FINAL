# Etapa 02 · API funcional

## Objetivo

Convertir la estructura visual del portfolio en un sistema editable, manteniendo la experiencia pública de una sola página y agregando un archivo de trabajos. Esta etapa prioriza el uso local y deja explícito el camino para migrar a infraestructura productiva.

## Decisiones principales

### Base JSON legible

`data/portfolio.json` funciona como fuente única de verdad. Puede versionarse, revisarse y migrarse con facilidad. El repositorio usa una cola de mutaciones y reemplazo atómico: primero escribe un archivo temporal y después lo renombra, evitando escrituras parciales.

### API separada de la interfaz

Los formularios no modifican el JSON directamente. Envían datos a rutas de API que:

1. comprueban permisos;
2. validan campos obligatorios;
3. normalizan booleanos, números y listas;
4. validan archivos y tamaños;
5. escriben el registro;
6. devuelven una respuesta JSON uniforme.

### Proyectos como contenido visual

Cada proyecto puede guardar:

- identificación, categoría, tipo, estado y orden;
- resumen, descripción, rol, desafío, proceso y resultado;
- herramientas y etiquetas;
- portada y galería con descripciones alternativas;
- múltiples PDF;
- enlaces al sitio publicado, repositorio y caso externo;
- estados `featured` y `visible`.

La portada usa `featured` para construir la fila seleccionada. `/trabajos` usa todos los proyectos visibles y cada slug genera una página de detalle.

### Experiencia con estructura de selección laboral

El formulario divide la experiencia en bloques fáciles de completar y reutilizar: puesto, empresa, tipo de empleo, modalidad, ubicación, fechas, trabajo actual, resumen, responsabilidades, logros, habilidades y web de la empresa. Esta estructura evita un único campo narrativo difícil de escanear o procesar.

### Gestión secundaria proporcional

Skills, herramientas, servicios, certificados, educación e intereses usan formularios compactos con el mismo CRUD. Perfil y contacto son objetos únicos y se actualizan mediante `PUT`.

## Contratos de respuesta

Respuesta correcta:

```json
{
  "ok": true,
  "data": {}
}
```

Respuesta de error:

```json
{
  "ok": false,
  "error": "Mensaje comprensible",
  "details": {
    "field": "campo"
  }
}
```

## Carga de archivos

| Tipo | Formatos | Límite | Destino local |
|---|---|---:|---|
| Imagen | JPG, PNG, WebP, GIF, SVG | 8 MB | `public/uploads/images` |
| Documento | PDF | 15 MB | `public/uploads/pdfs` |

Los nombres se normalizan y reciben un identificador aleatorio para evitar colisiones. Eliminar una ficha no elimina automáticamente sus archivos: esta decisión evita borrar documentos compartidos o perder material por error. La limpieza de archivos huérfanos deberá incorporarse con una vista de revisión en una etapa posterior.

## Seguridad

- En local, las escrituras están habilitadas para facilitar el desarrollo.
- Si existe `PORTFOLIO_ADMIN_KEY`, toda escritura exige el header `x-admin-key`.
- En producción, la API bloquea escrituras si la variable no está configurada.
- El panel guarda la clave solo en `sessionStorage`, nunca en el repositorio.

Antes de publicar un panel editable se necesita autenticación real, protección CSRF, limitación de intentos, logs de auditoría y una política de backups.

## Pruebas ejecutadas

- Compilación y chequeo de tipos con Astro.
- Lectura de `/api/health` y conteos.
- Crear, editar y eliminar una experiencia temporal.
- Crear un proyecto temporal con portada, galería y PDF.
- Editar el proyecto preservando los archivos existentes.
- Eliminar el proyecto y limpiar los archivos de prueba.
- Crear y eliminar un skill temporal.
- Comprobar que la base regresara a sus conteos originales.
- Revisión visual de portada, panel, archivo y detalle de proyecto.

## Próxima etapa recomendada

Migrar el repositorio local a una base SQL y las cargas a almacenamiento de objetos, añadir autenticación y conservar la misma API pública. Gracias a la separación actual, la interfaz y los formularios pueden mantenerse mientras cambia la capa de persistencia.
