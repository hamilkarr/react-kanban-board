import { atom, selector } from "recoil";

export const minutesState = atom<number>({
    key: 'minutes',
    default: 0,
});

export const hoursSelector = selector<number>({
    key: 'hours',
    get: ({ get }) => {
        const minutes = get(minutesState);
        return Number((minutes / 60).toFixed(2));
    },
    set: ({ set }, newValue) => {
        const minutes = Number(newValue) * 60;
        set(minutesState, minutes);
    }   
});
