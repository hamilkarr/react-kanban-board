import React from "react";
import { Draggable } from "react-beautiful-dnd";

interface IDragabbleCardProps {
    toDoId: number;
    toDoText: string;
    index: number;
}

function DragabbleCard({ toDoId, toDoText, index }: IDragabbleCardProps) {
    return (
        <Draggable draggableId={toDoId.toString()} index={index}>
            {(provided, snapshot) => (
                <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white p-2 rounded-md mb-2 ${snapshot.isDragging ? "shadow-lg bg-blue-300" : ""}`}
                >
                    {toDoText}
                </li>
            )}
        </Draggable>
    );
}

export default React.memo(DragabbleCard);
