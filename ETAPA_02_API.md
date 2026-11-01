# Etapa 02 · API funcional

## Objetivo

Convertir la estructura visual del portfolio en un sistema editable, manteniendo la experiencia pública de una sola página y agregando un archivo de trabajos. La misma interfaz funciona en local y en Vercel con persistencia productiva.

## Decisiones principales

### Persistencia intercambiable

En local, `data/portfolio.json` funciona como fuente de verdad y las mutaciones usan reemplazo atómico. En Vercel, la capa de almacenamiento lee y escribe `portfolio-data/portfolio.json` en Blob, con control de versión mediante `etag` para evitar que dos sesiones pisen cambios simultáneos. Si todavía no existe una copia remota, el primer cambio parte del JSON incluido en el despliegue y crea la base persistente.

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

| Tipo | Formatos | Límite | Destino local / Vercel Blob |
|---|---|---:|---|
| Imagen | JPG, PNG, WebP, GIF, SVG | 4 MB | `public/uploads/images` / `uploads/images` |
| Documento | PDF | 4 MB | `public/uploads/pdfs` / `uploads/pdfs` |

Los nombres se normalizan y reciben un identificador aleatorio para evitar colisiones. Eliminar una ficha no elimina automáticamente sus archivos: esta decisión evita borrar documentos compartidos o perder material por error. La limpieza de archivos huérfanos deberá incorporarse con una vista de revisión en una etapa posterior.

## Seguridad

- En local, las escrituras están habilitadas sin clave para facilitar el desarrollo; `.env` permite probar el acceso protegido.
- En producción, la API bloquea la administración si falta `PORTFOLIO_ADMIN_KEY`.
- La pantalla `/admin/login` valida la clave y crea una cookie de sesión `HttpOnly`, `SameSite=Strict` y `Secure` en producción.
- Los `GET` privados y todas las mutaciones del panel exigen una sesión válida; `/api/portfolio` sigue siendo público y filtrado.
- La clave nunca se incluye en el repositorio ni se expone al JavaScript del panel.
- Vercel Blob debe estar conectado antes de escribir en producción.

Para un portfolio personal, la sesión firmada y `SameSite=Strict` ofrecen una barrera proporcionada. Si el panel creciera a varios usuarios, convendría migrar a identidades individuales, roles, limitación de intentos, auditoría y backups programados.

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

Mejorar la interfaz pública sin cambiar los contratos de la API. Si el volumen de información o la cantidad de editores aumenta, la capa de persistencia puede migrarse de Blob a SQL sin reescribir los formularios.
