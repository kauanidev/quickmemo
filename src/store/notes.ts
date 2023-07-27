import { create } from "zustand";

export type INote = {
  title: string;
  content: string;
  color: string;
  id: string;
  createdAt: string;
  updatedAt: string;
};

type Store = {
  notes: INote[];
  editingNote: INote | null;
  addNote: (note: INote) => void;
  setEditingNote: (note: INote | null) => void;
};

export const useNotes = create<Store>()((set) => ({
  notes: [],
  editingNote: null,
  addNote: (note: INote) => set((state) => ({ notes: [...state.notes, note] })),
  setEditingNote: (note: INote | null) =>
    set((state) => ({ editingNote: note })),
}));
