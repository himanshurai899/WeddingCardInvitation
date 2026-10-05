import { useState, useCallback } from 'react';
let _counter = 0;
const uid = () => `toast-${++_counter}`;
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const toast = useCallback(({ message, variant, duration = 3000 }) => {
    const id = uid();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
    return id;
  }, []);
  return { toasts, toast, dismiss };
}
