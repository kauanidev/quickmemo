import { Navbar } from "@/components/navbar";
import { NotesGrid } from "@/components/notes-grid";

export default function Home() {
  return (
    <main className="w-full max-w-[830px] mx-auto mt-10">
      <Navbar />
      <NotesGrid />
    </main>
  );
}
