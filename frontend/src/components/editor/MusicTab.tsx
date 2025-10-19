import { Music, Play, SkipBack, SkipForward } from "lucide-react";

export const MusicTab = () => {
  return (
    <div className="w-full p-2 border-r border-gray-400 shadow-sm rounded-xl bg-white p-2 h-fit">
      <div className=" sm:flex flex-row sm:justify-between items-center">
        <div className="justify-center sm:justify-start w-full sm:w-1/2 inline-flex gap-2 items-center transition rounded">
          <Music className="text-black  w-3 h-3" />
          <p className="text-xs font-medium text-gray-700 align-center truncate">
            track : "Lofi Beats to Relax"
          </p>
        </div>

        <div className="flex gap-1 items-center w-full sm:w-1/2 justify-center sm:justify-end mt-2 sm:mt-0">
          <button
            aria-label="Previous"
            className="p-1 md:p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
          >
            <SkipBack className="text-black  w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <button
            aria-label="Play"
            className="p-1 md:p-2 rounded-full bg-gray-600 hover:bg-gray-700 shadow transition"
          >
            <Play className="text-white  w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <button
            aria-label="Next"
            className="p-1 md:p-2  rounded-full bg-white shadow hover:bg-gray-100 transition"
          >
            <SkipForward className="text-black w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};