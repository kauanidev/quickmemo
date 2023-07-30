import { Editor } from "../editor";

export const Navbar = () => {
  return (
    <header className="flex justify-between items-center md:px-0 px-4">
      <h1 className="text-3xl font-light">
        <span className="text-brand font-bold">Quick</span>Memo
      </h1>
      <Editor />
    </header>
  );
};
