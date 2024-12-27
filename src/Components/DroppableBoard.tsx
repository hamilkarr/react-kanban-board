import React from "react";
import { Droppable, DroppableStateSnapshot } from "react-beautiful-dnd";
import DragabbleCard from "./DragabbleCard.tsx";
import { useForm } from "react-hook-form";
import { IToDo, IToDoState, toDosState } from "../atoms.tsx";
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

    return (
        <div className='bg-slate-300 w-full rounded-md min-h-80 flex flex-col py-3'>
            <h2 className="text-xl font-bold mb-4 text-center">{boardId}</h2>
            <form onSubmit={handleSubmit(onValid)} className="px-3">
                <input 
                    type="text"
                    placeholder={`Add task on ${boardId}`} 
                    {...register("toDo", { required: true })}
                    className="w-full px-2"
                />
            </form>
            <Droppable droppableId={boardId}>
                {(provided, snapshot) => (
                    <ul
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        // 분리된 함수 getBackgroundColorClass를 이용해 클래스 지정
                        className={`flex-grow ${getBackgroundColorClass(snapshot)} transition-colors duration-300 ease-in-out px-3 pt-3`}
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
