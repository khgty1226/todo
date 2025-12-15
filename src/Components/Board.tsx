import { useForm } from "react-hook-form";
import { Droppable } from "@hello-pangea/dnd";
import styled from "styled-components";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
import DraggableCard from "./DraggableCard";
import {IDroppableAreaProps} from "../App";

const Wrapper = styled.div`
  width: 300px;
  padding-top: 15px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 0.3rem 0.6rem;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 15px;
  font-size: 14px;
`;

const Area = styled.div<IDroppableAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
        ? "rgba(227, 227, 227, 0.2)"
        : props.isDraggingFromThis
            ? "rgba(66,70,73, 0.1)"
            : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
  input {
    font-size: 12px;
    border: 0;
    background-color: rgb(63, 68, 72);
    color: white;
    width: 80%;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    margin: 0 auto;
    &::placeholder {
        color: lightgray;
    }
  }
`;

interface IBoardProps {
    toDos: ITodo[];
    boardId: string;
}

interface IForm {
    toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
    const setToDos = useSetRecoilState(toDoState);
    const { register, setValue, handleSubmit } = useForm<IForm>();
    const onValid = ({ toDo }: IForm) => {
        const newToDo = {
            id: Date.now(),
            text: toDo,
        };
        setToDos((allBoards) => {
            return {
                ...allBoards,
                [boardId]: [newToDo, ...allBoards[boardId]],
            };
        });
        setValue("toDo", "");
    };
    return (
        <Wrapper>
            <Title>{boardId}</Title>
            <Form onSubmit={handleSubmit(onValid)}>
                <input
                    {...register("toDo", { required: true })}
                    type="text"
                    placeholder={`Add task on ${boardId}`}
                />
            </Form>
            <Droppable droppableId={boardId}>
                {(magic, info) => (
                    <Area
                        isDraggingOver={info.isDraggingOver}
                        isDraggingFromThis={Boolean(info.draggingFromThisWith)}
                        ref={magic.innerRef}
                        {...magic.droppableProps}
                    >
                        {toDos.map((toDo, index) => (
                            <DraggableCard
                                key={toDo.id}
                                index={index}
                                toDoId={toDo.id}
                                toDoText={toDo.text}
                            />
                        ))}
                        {magic.placeholder}
                    </Area>
                )}
            </Droppable>
        </Wrapper>
    );
}
export default Board;
// 코드 챌린지
// 1. Input 버튼 꾸미기
// 2. To-do 삭제 버튼 ( 쓰레기통 )
// 3. To-Do는 localStorage 보관
// 4. Board를 Draggable 하게 만들기 (** Bonus)
// 5. Board 생성하는 Form 개발 (Atom으로 추적해야할 것)