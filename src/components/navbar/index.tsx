import { Editor } from "../editor";

export const Navbar = () => {
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-3xl font-light">
        <span className="text-brand font-bold">Quick</span>Memo
      </h1>
      <Editor />
    </header>
  );
};
