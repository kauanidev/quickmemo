import { Navbar } from "@/components/navbar";
import dynamic from "next/dynamic";
import Head from "next/head";

const NotesGrid = dynamic(() => import("@/components/notes-grid"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="w-full max-w-[830px] mx-auto mt-10">
      <Head>
        <title>QuickMemo | Notas rápidas</title>
      </Head>
      <Navbar />
      <NotesGrid />
    </main>
  );
}
