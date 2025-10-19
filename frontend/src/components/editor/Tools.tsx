import { Bold, Underline } from "lucide-react";
import { Quote, List, ListOrdered } from "lucide-react";
import { TextItalic,  Image } from "phosphor-react";

export const Tools = () => {
  return (
    <div className="w-full p-1 border-r border-gray-400 shadow-sm rounded-xl bg-white p-2 h-fit mt-2" >
      <div className="flex justify-center sm:justify-start">
              <h3 className=" p-1 text-sm font-medium text-gray-700 mb-1 ">Editing Tools</h3>
      </div>

      <div className="flex flex-row gap-3 sm:gap-2 justify-center sm:justify-start">

        <button
          aria-label="Bold"
          className="p-1  bg-gray-200 rounded hover:bg-gray-300 transition flex items-center justify-center"
        >
          <Bold className="w-2 h-2 sm:w-4 sm:h-4 " />
        </button>

        <button
          aria-label="Italic"
          className="p-1  bg-gray-200 rounded hover:bg-gray-300 transition flex items-center justify-center"
        >
          <TextItalic className="w-2 h-2 sm:w-4 sm:h-4 " weight="bold" />
        </button>

        <button
          aria-label="Underline"
          className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition flex items-center justify-center"
        >
          <Underline className="w-2 h-2 sm:w-4 sm:h-4" />
        </button>
        <button
          aria-label="Insert image"
          className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition flex items-center justify-center"
        >
          <Image className="w-2 h-2 sm:w-4 sm:h-4 " weight="bold" />
        </button>
         <button
    aria-label="Blockquote"
    className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition flex items-center justify-center"
  >
    <Quote className="w-2 h-2 sm:w-4 sm:h-4" />
  </button>

  <button
    aria-label="Unordered list"
    className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition flex items-center justify-center"
  >
    <List className="w-3 h-3 sm:w-4 sm:h-4" />
  </button>

  <button
    aria-label="Ordered list"
    className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition flex items-center justify-center"
  >
    <ListOrdered className="w-3 h-3 sm:w-4 sm:h-4" />
  </button>
      </div>
    </div>
  );
};