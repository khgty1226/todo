import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";
import DeleteBox from "./Components/DeleteBox";

const Wrapper = styled.div`
  display: flex;
  width: 900px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
    flex-direction: column;
  height: 100vh;
`;

const Boards = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    gap: 10px;
`;

const Title = styled.div`
    margin-bottom: 40px;
    font-size: 24px;
    font-weight: bold;
`;

export interface IDroppableAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // same board movement.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (destination.droppableId !== source.droppableId) {
      // cross board movement
      if(destination?.droppableId === "delete"){
        // delete board
        setToDos((allBoards) => {
          const boardCopy = [...allBoards[source.droppableId]];
          boardCopy.splice(source.index, 1);
          return {
            ...allBoards,
            [source.droppableId]: boardCopy
          }
        })
      }else{
        // move board
        setToDos((allBoards) => {
          const sourceBoard = [...allBoards[source.droppableId]];
          const taskObj = sourceBoard[source.index];
          const destinationBoard = [...allBoards[destination.droppableId]];
          sourceBoard.splice(source.index, 1);
          destinationBoard.splice(destination?.index, 0, taskObj);
          return {
            ...allBoards,
            [source.droppableId]: sourceBoard,
            [destination.droppableId]: destinationBoard,
          };
        });
      }
    }
  };
  return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Title>
            To Do App
          </Title>
          <Boards>
            {Object.keys(toDos).map((boardId) => (
                <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
            ))}
          </Boards>
          <DeleteBox/>
        </Wrapper>
      </DragDropContext>
  );
}

export default App;