import { create } from 'zustand';

export const useStore = create((set) => ({
    showModal: false,
    modalText: '',
    modalLoading: false,
    noModalBtn: false,
    modalHandler: () => {},
    setModalHandler: (value) =>
        set(() => ({
            modalHandler: value.func,
            modalText: value.text,
            showModal: true,
        })),
    closeModal: () =>
        set(() => ({
            showModal: false,
            noModalBtn: false,
            modalLoading: false,
        })),
    setValue: (key, value) =>
        set(() => ({
            [key]: value,
        })),
}));
