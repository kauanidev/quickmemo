import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../button";
import {
  MdOutlineAdd,
  MdOutlineFormatBold,
  MdOutlineFormatItalic,
  MdOutlineStrikethroughS,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdDeleteOutline,
  MdOutlineSave,
} from "react-icons/md";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Document from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";
import { INote, useNotes } from "@/store/notes";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import clsx from "clsx";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "react-hot-toast";

const NOTE_COLORS = [
  "#FF9AA2",
  "#FFB7B2",
  "#FFDAC1",
  "#E2F0CB",
  "#B5EAD7",
  "#C7CEEA",
];

export const Editor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);
  const [initialEditingContent, setInitialEditingContent] =
    useState<INote | null>(null);

  const editor = useEditor({
    extensions: [
      Document.extend({
        content: "heading block*",
      }),
      StarterKit.configure({
        document: false,
      }),
      BulletList.configure({ HTMLAttributes: { class: "list-disc pl-10" } }),
      OrderedList.configure({
        HTMLAttributes: { class: "list-decimal pl-10" },
      }),
      Placeholder.configure({
        placeholder: "Escreva um título...",
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-text-secondary/20 before:h-0 before:float-left before:pointer-events-none",
      }),
    ],
    content: "",
    autofocus: "end",
    editorProps: {
      attributes: {
        class:
          "focus:outline-none prose prose-invert prose-headings:text-2xl sm:prose-headings:text-4xl prose-headings:mt-0 prose-headings:mb-4 prose-p:!my-0 !max-w-full max-h-[70vh] md:max-h-[60vh] overflow-y-auto pr-4",
      },
    },
  });

  const addNote = useNotes((state) => state.addNote);
  const editNote = useNotes((state) => state.editNote);
  const deleteNote = useNotes((state) => state.deleteNote);
  const editingNote = useNotes((state) => state.editingNote);
  const setEditingNote = useNotes((state) => state.setEditingNote);
  const isEditing = !!editingNote;

  const handleClose = () => {
    setIsOpen(false);
    setSelectedColor(NOTE_COLORS[0]);
    editor?.commands.setContent("");
    setEditingNote(null);
  };

  useEffect(() => {
    if (editingNote && !isOpen) {
      setIsOpen(true);
      editor?.commands.setContent(
        `<h1>${editingNote.title}</h1>${editingNote.content}`
      );
      setSelectedColor(editingNote.color);
      setInitialEditingContent(editingNote);
    }
  }, [editingNote, editor?.commands, isOpen]);

  const handleSaveNote = () => {
    const contentRegex = new RegExp("(<h1>(?<title>.+)</h1>(?<content>.+)?)");
    const parsedContent = editor?.getHTML().match(contentRegex)?.groups;

    if (!parsedContent?.title || !parsedContent?.content) {
      toast.error("Adicione título e conteúdo à sua nota para salvar");
      return;
    }

    const title = parsedContent?.title ?? "Untitled";
    const content = parsedContent?.content ?? "";
    console.log(title, content);
    if (isEditing) {
      editNote(editingNote.id, {
        ...editingNote,
        title,
        content,
        color: selectedColor,
      });

      if (
        `<h1>${title}</h1>${content}` !==
        `<h1>${initialEditingContent?.title}</h1>${initialEditingContent?.content}`
      ) {
        toast.success("Nota editada com sucesso");
      }
    } else {
      addNote({
        title,
        content,
        color: selectedColor,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        id: uuid(),
      });
      toast.success("Nota criada com sucesso");
    }

    handleClose();
  };

  const handleDeleteNote = () => {
    if (!editingNote) return;
    deleteNote(editingNote.id);
    toast.success("Nota deletada com sucesso");

    handleClose();
  };

  const onOpenChange = (value: boolean) => {
    if (value) {
      setIsOpen(value);
    } else {
      if (isEditing) {
        handleSaveNote();
        return;
      }
      handleClose();
    }
  };

  const lastUpdateDate = useMemo(() => {
    if (!isEditing) return "";
    return format(
      new Date(editingNote.updatedAt),
      "dd 'de' MMMM 'de' yyyy HH:mm",
      {
        locale: ptBR,
      }
    );
  }, [editingNote?.updatedAt, isEditing]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <Button>
          <MdOutlineAdd size={20} />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-brand/10 z-10 backdrop-blur-[3px]" />
        <Dialog.Content className="flex flex-col fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-background p-6 w-full max-w-[850px] min-h-[90vh] md:min-h-[550px] rounded-lg">
          <section className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="flex gap-2 w-full items-center">
              {NOTE_COLORS.map((color) => (
                <button
                  onClick={() => setSelectedColor(color)}
                  key={color}
                  className={clsx("flex-1 h-8 rounded-lg transition-all", {
                    "ring-2 ring-white ring-offset-2 ring-offset-background":
                      selectedColor === color,
                  })}
                  style={{ background: color }}
                />
              ))}
            </div>
            <div className="flex gap-2 items-center w-full [&_svg]:w-6 [&_svg]:h-6">
              <Button
                onClick={() => editor?.chain().focus().toggleBold().run()}
                disabled={!editor?.can().chain().focus().toggleBold().run()}
                className={
                  editor?.isActive("bold") ? "active flex-1" : "flex-1"
                }
              >
                <MdOutlineFormatBold />
              </Button>
              <Button
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                disabled={!editor?.can().chain().focus().toggleItalic().run()}
                className={
                  editor?.isActive("italic") ? "active flex-1" : "flex-1"
                }
              >
                <MdOutlineFormatItalic />
              </Button>
              <Button
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                disabled={!editor?.can().chain().focus().toggleStrike().run()}
                className={
                  editor?.isActive("strike") ? "active flex-1" : "flex-1"
                }
              >
                <MdOutlineStrikethroughS />
              </Button>
              <Button
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                disabled={
                  !editor?.can().chain().focus().toggleBulletList().run()
                }
                className={
                  editor?.isActive("bulletList") ? "active flex-1" : "flex-1"
                }
              >
                <MdFormatListBulleted />
              </Button>
              <Button
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                disabled={
                  !editor?.can().chain().focus().toggleOrderedList().run()
                }
                className={
                  editor?.isActive("orderedList") ? "active flex-1" : "flex-1"
                }
              >
                <MdFormatListNumbered />
              </Button>
            </div>
          </section>
          <EditorContent editor={editor} />
          <div className="flex items-center justify-between mt-auto">
            {isEditing && (
              <p className="text-xs text-text-secondary">{lastUpdateDate}</p>
            )}
            <div className="flex gap-2 items-center ml-auto">
              {isEditing && (
                <Button
                  onClick={handleDeleteNote}
                  className="hover:bg-red-400 px-6 text-xl"
                >
                  <MdDeleteOutline />
                </Button>
              )}
              <Button
                onClick={handleSaveNote}
                className="hover:bg-green-500 px-6 text-xl"
              >
                <MdOutlineSave />
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
