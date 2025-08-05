import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface DroppableEditorZoneProps {
  children: React.ReactNode;
}

export const DroppableEditorZone: React.FC<DroppableEditorZoneProps> = ({
  children,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "editor-drop-zone",
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 overflow-auto bg-muted ${
        isOver ? "bg-blue-50 border-2 border-blue-300 border-dashed" : ""
      }`}
    >
      {children}
    </div>
  );
};