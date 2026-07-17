import { createContext, useContext, useState } from "react";

/**
 * PopupService.jsx - Servicio centralizado de popups
 *
 * Maneja TODOS los popups de la aplicación:
 * - Crear (verde)
 * - Editar (verde)
 * - Eliminar (rojo)
 *
 * Uso en cualquier componente:
 *   const popup = usePopup();
 *   popup.showCreatePopup('Categoría');
 *   popup.showEditPopup('Perfil');
 *   popup.showDeletePopup('Presupuesto');
 */

// 🆕 Context para el servicio de popups
const PopupContext = createContext();

// 🆕 Provider que wrappea la app
export function PopupProvider({ children }) {
  const [popup, setPopup] = useState(null);

  const showPopup = (message, type) => {
    setPopup({ message, type });
    setTimeout(() => setPopup(null), 2000);
  };

  const showCreatePopup = (resourceName) => {
    showPopup(`${resourceName} creada exitosamente`, 'create');
  };

  const showEditPopup = (resourceName) => {
    showPopup(`${resourceName} actualizada exitosamente`, 'edit');
  };

  const showDeletePopup = (resourceName) => {
    showPopup(`${resourceName} eliminada exitosamente`, 'delete');
  };

  // 🆕 Popup de ERROR (rojo) para acciones que fallan
  const showErrorPopup = (message) => {
    showPopup(message, 'error');
  };

  return (
    <PopupContext.Provider value={{ popup, showCreatePopup, showEditPopup, showDeletePopup, showErrorPopup }}>
      {/* 🆕 Agregar animaciones CSS */}
      <style>{`@keyframes slideInDown { from { transform:translateY(-100%);opacity:0 } to { transform:translateY(0);opacity:1 } }`}</style>

      {children}

      {/* 🆕 Renderizar el popup aquí (nivel global) */}
      {popup && <PopupDisplay popup={popup} />}
    </PopupContext.Provider>
  );
}

// 🆕 Hook para usar el servicio en cualquier componente
export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup debe ser usado dentro de PopupProvider');
  }
  return context;
};

// 🆕 Componente que renderiza el popup
function PopupDisplay({ popup }) {
  const isError = popup.type === 'error';
  const isRed = isError || popup.type === 'delete';
  const bgColor = isRed ? '#EF444433' : '#22C55E33';
  const borderColor = isRed ? '#EF444466' : '#22C55E66';
  const textColor = isRed ? '#DC2626' : '#16A34A';
  const icon = isError ? '⚠️' : '✓';

  return (
    <div
      style={{
        position: "fixed",
        top: 70,
        right: 22,
        maxWidth: 300,
        padding: "12px 16px",
        borderRadius: 8,
        background: bgColor,
        border: `1px solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
        gap: 8,
        animation: "slideInDown 0.3s ease",
        zIndex: 999,
      }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: textColor,
        }}>
        {popup.message}
      </span>
    </div>
  );
}
