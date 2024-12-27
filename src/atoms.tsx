import { atom } from "recoil";

export interface IToDo {
    id: number;
    text: string;
}

export interface IToDoState {
    [key: string]: IToDo[];
}

export const toDosState = atom<IToDoState>({
    key: "toDos",
    default: {
        "To Do": [],
        "Doing": [],
        "Done": [],
        "휴지통": []
    },
    effects_UNSTABLE: [
        ({ setSelf, onSet }) => {
            // atom이 초기화될 때 localStorage에서 기존 상태를 가져옵니다.
            const savedValue = localStorage.getItem("toDos");
            if (savedValue) setSelf(JSON.parse(savedValue));

            // atom 값이 변경될 때마다 localStorage에 저장합니다.
            onSet((newValue, _, isReset) => {
                if (isReset) {
                    localStorage.removeItem("toDos");
                } else {
                    localStorage.setItem("toDos", JSON.stringify(newValue));
                }
            });
        },
    ],
});
