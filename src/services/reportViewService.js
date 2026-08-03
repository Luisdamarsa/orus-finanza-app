/**
 * reportViewService.js
 * Abrir informes en HTML en el navegador (en lugar de descargar PDF)
 */

/**
 * Abrir informe HTML en el navegador
 * @param {string} normalizedFileName - Nombre normalizado (Informe_ORUS_Mensual_Mayo2026)
 * @returns {object} {success: true/false}
 */
export function openReportInBrowser(normalizedFileName) {
  try {
    // Ruta a archivo HTML en /public/informes/
    const htmlPath = `/informes/${normalizedFileName}.html`;

    console.log(`📖 Abriendo informe: ${htmlPath}`);

    // En navegador web: window.open (abre pestaña nueva)
    if (window.Capacitor) {
      // En móvil: Capacitor.Browser.open (abre navegador del sistema)
      window.Capacitor.Plugins.Browser?.open?.({
        url: window.location.origin + htmlPath,
      }).catch(() => {
        console.warn("Capacitor Browser no disponible, usando window.open");
        window.open(htmlPath, "_blank");
      });
    } else {
      // En web: simple window.open
      window.open(htmlPath, "_blank");
    }

    console.log(`✅ Informe abierto: ${normalizedFileName}`);
    return { success: true, filename: normalizedFileName };
  } catch (error) {
    console.error("Error abriendo informe:", error);
    return { success: false, error: error.message };
  }
}
