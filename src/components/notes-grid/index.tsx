import { useNotes } from "@/store/notes";
import { Note } from "./note";

export const NotesGrid = () => {
  const notes = useNotes((state) => state.notes);

  return (
    <section className="mt-10 grid grid-cols-4 gap-[10px]">
      {notes.map((note) => (
        <Note note={note} key={note.id} />
      ))}
    </section>
  );
};
