/**
 * reportDownloadService.js
 * Descargar PDFs desde la nueva estructura de carpetas
 * /informes-anuales/output/Informe_XXX/report.pdf
 */

/**
 * Descargar informe como PDF
 * @param {string} reportId - ID del reporte
 * @param {string} normalizedFileName - Nombre normalizado (Informe_ORUS_Mensual_Mayo2026)
 */
export async function downloadReportFromFile(reportId, normalizedFileName) {
  try {
    // Ruta: /informes-anuales/Informe_XXX/report.pdf
    const pdfPath = `/informes-anuales/${normalizedFileName}/report.pdf`;

    // Fetch PDF
    const response = await fetch(pdfPath);
    if (!response.ok) {
      throw new Error(`PDF no encontrado: ${pdfPath}`);
    }

    const blob = await response.blob();

    // Descargar
    const filename = `${normalizedFileName}.pdf`;
    downloadBlob(blob, filename);

    return { success: true, filename };
  } catch (error) {
    console.error('Error descargando PDF:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Utilidad para descargar un Blob
 * @param {Blob} blob - Contenido a descargar
 * @param {string} filename - Nombre del archivo
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
