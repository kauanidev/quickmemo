import { INote, useNotes } from "@/store/notes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type NoteProps = {
  note: INote;
};

export const Note = ({ note }: NoteProps) => {
  const formattedDate = format(new Date(note.createdAt), "dd MMM, yyyy", {
    locale: ptBR,
  });

  const setEditingNote = useNotes((state) => state.setEditingNote);

  return (
    <div
      onClick={() => setEditingNote(note)}
      className="p-4 rounded-lg h-[200px] flex flex-col justify-between cursor-pointer"
      style={{ background: note.color }}
    >
      <p className="text-2xl font-medium line-clamp-4 text-surface">
        {note.title}
      </p>
      <span className="text-xs text-text-secondary">{formattedDate}</span>
    </div>
  );
};
