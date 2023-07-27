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
import { useNotes } from "@/store/notes";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import clsx from "clsx";

const NOTE_COLORS = [
  "#FBEDCC",
  "#C9E4DE",
  "#C6DEF1",
  "#DBCDF0",
  "#F2C6DE",
  "#F8D9C4",
];

export const Editor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);

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
          "focus:outline-none prose prose-invert prose-headings:mt-0 prose-headings:mb-4 prose-p:!my-0",
      },
    },
  });

  const addNote = useNotes((state) => state.addNote);
  const editingNote = useNotes((state) => state.editingNote);
  const setEditingNote = useNotes((state) => state.setEditingNote);
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
    }
  }, [editingNote, editor?.commands, isOpen]);

  const handleSaveNote = () => {
    const contentRegex = new RegExp("(<h1>(?<title>.+)</h1>(?<content>.+)?)");
    const parsedContent = editor?.getHTML().match(contentRegex)?.groups;

    const title = parsedContent?.title ?? "Untitled";
    const content = parsedContent?.content ?? "";

    addNote({
      title,
      content,
      color: selectedColor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: uuid(),
    });

    handleClose();
  };

  const onOpenChange = (value: boolean) => {
    if (value) {
      setIsOpen(value);
    } else {
      handleClose();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <Button>
          <MdOutlineAdd size={20} />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-brand/10 z-10 backdrop-blur-[3px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-background p-6 w-full max-w-[800px] min-h-[500px] rounded-lg">
          <section className="flex justify-between items-center mb-6">
            <div className="flex gap-6 items-center">
              <div className="flex gap-2 items-center">
                <Button
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  disabled={!editor?.can().chain().focus().toggleBold().run()}
                  className={editor?.isActive("bold") ? "active" : ""}
                >
                  <MdOutlineFormatBold />
                </Button>
                <Button
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  disabled={!editor?.can().chain().focus().toggleItalic().run()}
                  className={editor?.isActive("italic") ? "active" : ""}
                >
                  <MdOutlineFormatItalic />
                </Button>
                <Button
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  disabled={!editor?.can().chain().focus().toggleStrike().run()}
                  className={editor?.isActive("strike") ? "active" : ""}
                >
                  <MdOutlineStrikethroughS />
                </Button>
                <Button
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  disabled={
                    !editor?.can().chain().focus().toggleBulletList().run()
                  }
                  className={editor?.isActive("bulletList") ? "active" : ""}
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
                  className={editor?.isActive("orderedList") ? "active" : ""}
                >
                  <MdFormatListNumbered />
                </Button>
              </div>
              <div className="flex gap-2">
                {NOTE_COLORS.map((color) => (
                  <button
                    onClick={() => setSelectedColor(color)}
                    key={color}
                    className={clsx("w-6 h-6 rounded-full transition-all", {
                      "ring-2 ring-white ring-offset-2 ring-offset-background":
                        selectedColor === color,
                    })}
                    style={{ background: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Button className="hover:bg-red-400">
                <MdDeleteOutline />
              </Button>
              <Button onClick={handleSaveNote} className="hover:bg-green-500">
                <MdOutlineSave />
              </Button>
            </div>
          </section>
          <EditorContent editor={editor} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
