import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableChip({
  id,
  title,
  onRemove,
}: {
  id: string;
  title: string;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        border: "1px solid #d7dbe7",
        borderRadius: 999,
        background: "#fff",
        whiteSpace: "nowrap",
      }}
    >
      <span {...attributes} {...listeners} style={{ cursor: "grab" }}>⋮⋮</span>
      <span style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
      <button className="btn" style={{ padding: "4px 8px" }} onClick={onRemove}>×</button>
    </div>
  );
}
