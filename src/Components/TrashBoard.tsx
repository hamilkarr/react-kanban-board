import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { useRecoilValue } from "recoil";
import { toDosState } from "../atoms.tsx";

function TrashBoard() {
    const toDos = useRecoilValue(toDosState);

    return (
        <Droppable droppableId="휴지통" type="TASK">
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-red-300 rounded-md w-80 h-40 flex flex-col py-3 ${
                        snapshot.isDraggingOver ? "bg-red-500" : "bg-red-300"
                    }`}
                >
                    <h2 className="text-xl font-bold mb-4 text-center">휴지통</h2>
                    <ul className="px-3 pt-3">
                        {toDos["휴지통"].map((toDo, index) => (
                            <li key={toDo.id} className="bg-red-100 p-2 rounded-md mb-2 flex justify-between items-center">
                                {toDo.text}

                            </li>
                        ))}
                        {provided.placeholder}
                    </ul>
                </div>
            )}
        </Droppable>
    );
}

export default React.memo(TrashBoard);
