import { atom } from "recoil";
import {recoilPersist} from "recoil-persist";

export interface ITodo {
    id: number;
    text: string;
}

interface IToDoState {
    [key: string]: ITodo[];
}

const {persistAtom} = recoilPersist({
    key: "toDoPersist",
    storage: localStorage
})

export const toDoState = atom<IToDoState>({
    key: "toDo",
    default: {
        "To Do": [{id:1, text:"프로젝트 정리"}, {id:2, text:"책 읽기"}, {id:3, text:"런닝"}],
        Doing: [{id:4, text:"공부하기"}, {id:5, text:"집안일 하기"}],
        Done: [{id:6, text:"React Study"}, {id:7, text:"TypeScript Study"}],
    },
    // effects_UNSTABLE: [persistAtom]
});