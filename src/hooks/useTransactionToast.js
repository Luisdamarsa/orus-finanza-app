import { useState, useRef, useCallback } from "react";

/**
 * useTransactionToast — estado del tag transitorio de nueva transacción.
 *
 * showTransactionToast(data) muestra el tag y lo limpia solo tras `duration` ms.
 *   const { toast, showTransactionToast } = useTransactionToast();
 *   showTransactionToast({ isIncome, pillarId, categoryId, amount });
 */
export function useTransactionToast(duration = 1500) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const showTransactionToast = useCallback((data) => {
    setToast({ ...data, key: Date.now() });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), duration);
  }, [duration]);

  return { toast, showTransactionToast };
}
