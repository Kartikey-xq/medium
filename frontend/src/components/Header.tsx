import { FiMenu } from "react-icons/fi";

type HeaderProps = {
  sideBarOpen: boolean;
  setSideBarOpen: (open: boolean) => void;
};

export const Header = ({ sideBarOpen, setSideBarOpen }: HeaderProps) => {
  return (
    <header className="relative w-full bg-gradient-to-r from-gray-50 via-white to-gray-100 border-b border-gray-200 z-10 p-4 sm:p-6 flex items-center gap-3 overflow-hidden">
      {/* Menu Button (visible on small screens) */}
      <button
        onClick={() => setSideBarOpen(!sideBarOpen)}
        className="sm:invisible p-2"
      >
        <FiMenu className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors duration-200" />
      </button>

      {/* Site Name */}
      <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-gray-800 via-gray-600 to-gray-400 text-transparent bg-clip-text select-none">
        Blogify
      </h1>

      {/* Spacer */}
      <div className="w-6 sm:w-8" />
    </header>
  );
};
