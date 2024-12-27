import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import { toDosState } from './atoms.tsx';
import DroppableBoard from './Components/DroppableBoard.tsx';
import TrashBoard from './Components/TrashBoard.tsx';

function App() {
    const [toDos, setToDos] = useRecoilState(toDosState);
    const onDragEnd = (info: DropResult) => {
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

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className='w-full h-screen bg-blue-500 flex flex-col justify-center items-center'>
                <div className='grid grid-cols-3 gap-6 w-4/5'>
                    {Object.keys(toDos).map((boardId) => (
                        boardId !== "휴지통" ? (
                            <DroppableBoard key={boardId} boardId={boardId} toDos={toDos[boardId]} />
                        ) : null
                    ))}
                </div>
                <TrashBoard />
            </div>
        </DragDropContext>
    );
}

export default App;
