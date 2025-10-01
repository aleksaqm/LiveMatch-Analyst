import * as React from "react";

export interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
}

let toastCount = 0;
function generateId() {
  toastCount++;
  return toastCount.toString();
}

export function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback((options: Omit<Toast, "id">) => {
    const id = generateId();
    const newToast: Toast = { id, ...options };

    setToasts((prev: Toast[]) => [...prev, newToast]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev: Toast[]) => prev.filter((t: Toast) => t.id !== id));
    }, 5000);

    return id;
  }, []);

  const dismiss = React.useCallback((toastId: string) => {
    setToasts((prev: Toast[]) => prev.filter((t: Toast) => t.id !== toastId));
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
}
