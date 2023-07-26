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

export const Editor = () => {
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

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>
          <MdOutlineAdd size={20} />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-brand/10 z-10 backdrop-blur-[3px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-background p-6 w-full max-w-[800px] min-h-[500px] rounded-lg">
          <section className="flex justify-between items-center mb-6">
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
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
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
            <div className="flex gap-2 items-center">
              <Button className="hover:bg-red-400">
                <MdDeleteOutline />
              </Button>
              <Button className="hover:bg-green-500">
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
