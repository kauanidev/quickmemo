import { useNotes } from "@/store/notes";
import { Note } from "./note";

const NotesGrid = () => {
  const notes = useNotes((state) => state.notes);

  return (
    <section className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[10px]">
      {notes.map((note) => (
        <Note note={note} key={note.id} />
      ))}
    </section>
  );
};

export default NotesGrid;
