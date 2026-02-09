import { useEffect } from "react";

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.35)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 50,
      }}
      onMouseDown={onClose}
    >
      <div
        className="card"
        style={{ width: "min(900px, 100%)", maxHeight: "85vh", overflow: "auto", padding: 16 }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <b>{title || ""}</b>
          <button className="btn" onClick={onClose}>Закрыть</button>
        </div>
        <hr />
        {children}
        {footer && (
          <>
            <hr />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>{footer}</div>
          </>
        )}
      </div>
    </div>
  );
}
