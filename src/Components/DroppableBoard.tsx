import React from "react";
import { Droppable, DroppableStateSnapshot } from "react-beautiful-dnd";
import DragabbleCard from "./DragabbleCard.tsx";
import { useForm } from "react-hook-form";
import { IToDo, toDosState, boardOrderState } from "../atoms.tsx";
import { useSetRecoilState } from "recoil";

interface IDroppableBoardProps {
    toDos: IToDo[];
    boardId: string;
}

function DroppableBoard({ toDos, boardId }: IDroppableBoardProps) {
    // 색상 클래스를 결정하는 함수
    const getBackgroundColorClass = (snapshot: DroppableStateSnapshot) => {
        if (snapshot.isDraggingOver) {
            return "bg-slate-500";
        } else if (snapshot.draggingFromThisWith) {
            return "bg-slate-700";
        } else {
            return "bg-transparent";
        }
    };

    const setToDos = useSetRecoilState(toDosState);
    const setBoardOrder = useSetRecoilState(boardOrderState);
    const { register, setValue, handleSubmit } = useForm<{ toDo: IToDo['text'] }>();
    const onValid = ({ toDo }: { toDo: IToDo['text'] }) => {
        if (!toDo) return;
        const newToDo = {
            id: Date.now(),
            text: toDo
        }
        setToDos(allBoards => {
            return {
                ...allBoards,
                [boardId]: [...allBoards[boardId], newToDo]
            }
        });
        setValue("toDo", "");
    }

    const handleDelete = () => {
        setToDos(allBoards => {
            const newBoards = { ...allBoards };
            delete newBoards[boardId];
            return newBoards;
        });
        setBoardOrder(prevOrder => prevOrder.filter(id => id !== boardId));
    };

    return (
        <div className='bg-slate-300 w-full min-w-72 rounded-md min-h-80 flex flex-col py-3'>
            <div className="flex justify-between items-center mb-4 px-3">
                <h2 className="text-xl font-bold text-center">{boardId}</h2>
                <button onClick={handleDelete} className="px-2 py-1 bg-red-500 text-white rounded">삭제</button>
            </div>
            <form onSubmit={handleSubmit(onValid)} className="px-3">
                <input
                    type="text"
                    placeholder={`Add task on ${boardId}`}
                    {...register("toDo", { required: true })}
                    className="w-full px-2"
                />
            </form>
            <Droppable droppableId={boardId} type="TASK">
                {(provided, snapshot) => (
                    <ul
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-grow ${getBackgroundColorClass(snapshot)} transition-colors duration-300 ease-in-out px-3 pt-6`}
                    >
                        {toDos.map((toDo, index) => (
                            <DragabbleCard key={toDo.id} toDoId={toDo.id} toDoText={toDo.text} index={index} />
                        ))}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </div>
    );
}

export default React.memo(DroppableBoard);
