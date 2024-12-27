import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import { toDosState, boardOrderState } from './atoms.tsx';
import DroppableBoard from './Components/DroppableBoard.tsx';
import TrashBoard from './Components/TrashBoard.tsx';
import { Draggable, Droppable } from "react-beautiful-dnd";

function App() {
    const [toDos, setToDos] = useRecoilState(toDosState);
    const [boardOrder, setBoardOrder] = useRecoilState(boardOrderState);
    const [newBoard, setNewBoard] = useState("");

    useEffect(() => {
        if (boardOrder.length === 0) {
            setBoardOrder(Object.keys(toDos).filter(boardId => boardId !== "휴지통"));
        }
    }, [boardOrder, toDos, setBoardOrder]);

    const addBoard = () => {
        if (newBoard.trim() === "" || toDos[newBoard]) return;
        setToDos((allBoards) => ({
            ...allBoards,
            [newBoard]: []
        }));
        setBoardOrder((prevOrder) => [...prevOrder, newBoard]);
        setNewBoard("");
    };

    const onDragEnd = (info: DropResult) => {
        const { type, destination, source } = info;
        console.log(info);
        if (!destination) return;

        if (type === "BOARD") {
            if (destination.index === source.index) return;
            if (destination.droppableId === "휴지통") {
                setToDos((allBoards) => {
                    const sourceBoard = [...allBoards[source.droppableId]];
                    sourceBoard.splice(source.index, 1);
                    return {
                        ...allBoards,
                        [source.droppableId]: sourceBoard,
                    };
                });
            }
                
            setBoardOrder((prevOrder) => {
                const newOrder = Array.from(prevOrder);
                const [movedBoard] = newOrder.splice(source.index, 1);
                newOrder.splice(destination.index, 0, movedBoard);
                return newOrder;
            });
        } else if (type === "TASK") {
            const { destination, source } = info;
            if (!destination) return;
            if (destination.droppableId === source.droppableId) {
                // 같은 보드 내에서 이동
                setToDos((allBoards) => {
                    const boardCopy = [...allBoards[source.droppableId]];
                    const taskObj = boardCopy[source.index];
                    boardCopy.splice(source.index, 1);
                    boardCopy.splice(destination.index, 0, taskObj);
                    return {
                        ...allBoards,
                        [source.droppableId]: boardCopy
                    }
                });
            } else {
                if (destination.droppableId === "휴지통") {
                    setToDos((allBoards) => {
                        const sourceBoard = [...allBoards[source.droppableId]];
                        sourceBoard.splice(source.index, 1);
                        return {
                            ...allBoards,
                            [source.droppableId]: sourceBoard,
                        };
                    });
                } else {
                    setToDos((allBoards) => {
                        const sourceBoard = [...allBoards[source.droppableId]];
                        const taskObj = sourceBoard[source.index];
                        const destinationBoard = [...allBoards[destination.droppableId]];
                        sourceBoard.splice(source.index, 1);
                        destinationBoard.splice(destination.index, 0, taskObj);
                        return {
                            ...allBoards,
                            [source.droppableId]: sourceBoard,
                            [destination.droppableId]: destinationBoard,
                        };
                    });
                }
            }
        }
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="boards" type="BOARD" direction="horizontal">
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className='w-full h-screen bg-blue-500 flex flex-col justify-center items-center'
                    >
                        <div className='my-4 flex flex-row items-center gap-1 w-2/3'>
                            <input 
                                type="text" 
                                value={newBoard} 
                                onChange={(e) => setNewBoard(e.target.value)} 
                                placeholder="새 보드 이름" 
                                className="px-2 py-1 mr-2"
                            />
                            <button onClick={addBoard} className="mr-auto px-4 py-1 bg-green-500 text-white rounded">추가</button>
                            <TrashBoard />
                        </div>
                        <div className='flex flex-row gap-6 w-4/5 mb-8 overflow-x-auto'>
                            {boardOrder.map((boardId, index) => (
                                <Draggable key={boardId} draggableId={boardId} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <DroppableBoard boardId={boardId} toDos={toDos[boardId]} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default App;
