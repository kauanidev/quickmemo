import { persist } from "zustand/middleware";
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
  editNote: (id: string, note: INote) => void;
  setEditingNote: (note: INote | null) => void;
  deleteNote: (id: string) => void;
};

export const useNotes = create<Store>(
  persist(
    (set) => ({
      notes: [],
      editingNote: null,
      addNote: (note: INote) =>
        set((state) => ({ notes: [...state.notes, note] })),
      editNote: (id: string, note: INote) =>
        set((state) => ({
          notes: state.notes.map((currentNote) => {
            if (currentNote.id === id) {
              return {
                ...note,
                updatedAt: new Date().toISOString(),
              };
            }
            return currentNote;
          }),
        })),
      setEditingNote: (note: INote | null) =>
        set((state) => ({ editingNote: note })),
      deleteNote: (id: string) =>
        set((state) => ({
          notes: state.notes.filter((note) => {
            return note.id !== id;
          }),
        })),
    }),
    { name: "quick-memo:notes" }
  )
);
