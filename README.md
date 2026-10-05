# Fantasy Control · edición GitHub Pages

Esta edición se ejecuta íntegramente en el navegador. No necesita Python, Node, terminal ni servidor propio. Puede publicarse en GitHub Pages.

## Publicar desde el navegador

1. Descomprime `Fantasy_GitHub_Pages.zip`.
2. En https://github.com/new crea un repositorio llamado `fantasy-control`. Si usas GitHub Free, elige **Public**. Marca **Add README** para iniciar la rama.
3. En el repositorio abre **Add file → Upload files**.
4. Arrastra **el contenido de la carpeta descomprimida**, incluidos `index.html`, `styles.css`, `favicon.svg` y la carpeta `js`. No subas solo el ZIP ni una carpeta contenedora: `index.html` debe quedar en la raíz del repositorio.
5. Guarda los cambios en la rama `main` con **Commit changes**. Si la interfaz propone un pull request, complétalo y fusiónalo en `main`.
6. Abre **Settings → Pages**. En **Build and deployment → Source**, selecciona **Deploy from a branch**.
7. En **Branch**, selecciona **main** y **/(root)**. Pulsa **Save**.
8. Espera a la publicación. GitHub indica que los cambios pueden tardar hasta 10 minutos. En esa misma pantalla aparecerá **Visit site**.
9. Abre el enlace y pulsa **Probar modo demo**.

Sube todos los archivos respetando la estructura de carpetas. No abras `index.html` mediante doble clic: los módulos JavaScript deben servirse por HTTPS desde GitHub Pages.

## Probar la aplicación

- Mi liga: clasificación general, selector y resumen de cuentas.
- Mi equipo: alineación y plantilla ficticia.
- Mercado: consulta de jugadores de ejemplo.
- Jornadas: elige J8 y confirma. Javier 3 €, Luis 2 €, Adrián 1 €.
- Deudas y pagos: registra pagos parciales o completos; Pagado aparece en verde.
- Recarga la página: las cuentas se conservan en ese navegador.
- Conexión: puedes importar `ejemplo-importacion.json` o añadir una jornada de respaldo. Todo el archivo de ejemplo contiene datos ficticios.

Las pruebas de reglas verifican el cálculo 3/2/1, duplicados, pagos parciales y completos, rechazo de sobrepagos, empates, jornadas no finalizadas, validación, aislamiento de demo/importación y conservación de la estructura guardada. No se ha verificado la publicación en tu repositorio ni realizado una prueba visual en un navegador.

## Qué funciona y qué está pendiente

| Función | Estado |
|---|---|
| Demo, equipo, mercado y clasificación | Funciona en GitHub Pages, con datos ficticios |
| Confirmación de jornadas y deuda 3/2/1 | Funciona sobre datos de demo o importación |
| Pagos, saldos e historial | Funciona y se guarda en ese navegador |
| Importar y añadir jornada de respaldo | Funciona |
| Ver el mismo registro desde varios dispositivos | Pendiente de backend online |
| Conectar LALIGA y sincronizar automáticamente | Pendiente de acceso autorizado y backend |

## Dónde se guardan los datos

En IndexedDB del navegador, separados por ruta del proyecto. No se suben a GitHub ni se comparten con otras personas. No hay contraseñas ni tokens de LALIGA. No uses los datos de la demo como resultados reales.

**Esta es una prueba con almacenamiento por dispositivo.** El navegador puede borrar sus datos, por ejemplo al limpiar el sitio, finalizar ciertas sesiones privadas o aplicar políticas del equipo de trabajo. Si IndexedDB está bloqueado, la aplicación muestra un error y no simula que ha guardado. La opción **Descargar registro** entrega un JSON consultable con la clasificación, penalizaciones y pagos. Importar ese JSON recupera la clasificación, pero no reinserta el libro de pagos o deuda; no es todavía una restauración completa.

La página y su código publicados son públicos; las cuentas que registres permanecen en tu navegador. No subas a un repositorio público exportaciones de tu liga ni datos privados.

## Conexión con LALIGA

El botón muestra honestamente que la integración está pendiente. No reutiliza el cliente OAuth de la aplicación oficial ni solicita contraseña. La aplicación no realiza peticiones a endpoints privados de LALIGA.

Para usar la cuenta real y compartir las mismas cuentas entre PC e iPhone, habrá que conectar un backend online. Ese backend se ejecutará fuera de tu PC de trabajo: seguirás entrando mediante un enlace sin instalar Python.

## Documentación oficial de GitHub

- Crear y publicar Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- Configurar la rama: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Subir archivos desde la web: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
