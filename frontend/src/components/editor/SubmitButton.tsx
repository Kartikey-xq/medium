import { Eye } from "lucide-react";

export const SubmitButton = () => {
  return (
    <div className="flex flex-row gap-4 mt-4 w-full justify-end">
      {/* Publish button */}
      <button className="p-1 w-fit bg-blue-600 text-white text-xs py-1  hover:bg-blue-700 transition">
        Publish
      </button>

      {/* Preview button with icon */}
      <button className="w-auto flex items-center gap-2 bg-gray-100 text-gray-700 text-xs rounded-xl hover:bg-gray-200 transition">
        <Eye className="w-5 h-3" />
      </button>
    </div>
  );
};
