/**
 * Icons.jsx - Iconos reutilizables centralizados
 *
 * Todos los iconos están aquí para mantener consistencia visual
 * y facilitar cambios globales
 */

/**
 * Icono de Checkmark (✓) - Usado para guardar
 * Tamaño: 22x22, Color: blanco
 */
export const CheckmarkIcon = ({ width = 22, height = 22, color = "white", strokeWidth = 3 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * Icono de Papelera/Eliminar
 * Tamaño flexible, Color flexible
 * Este es el icono estándar para eliminar (categorías, cuenta, etc.)
 */
export const TrashIcon = ({ width = 22, height = 22, color = "white", strokeWidth = 2.5 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

/**
 * Icono de Flecha Atrás
 * Usado en headers de navegación
 */
export const BackArrowIcon = ({ width = 15, height = 15, color = "#C4C2E0", strokeWidth = 2.5 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

/**
 * Icono de Copiar (dos papeles superpuestos)
 * Usado para copiar texto al portapapeles
 */
export const CopyIcon = ({ width = 16, height = 16, color = "#7B7A99", strokeWidth = 2 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
