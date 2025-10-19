export const TypingArea = ()=>{
    return <div className=" mt-1 w-full h-full border-2 border-gray-300 rounded-xl bg-white shadow-sm flex flex-col">
        <div className=" flex flex-col gap-2 p-4">
            <input className="border-b placeholder:text-gray-700" type="text" placeholder="title"></input>
            <input className="border-b placeholder:text-gray-700" type="text" placeholder="Description"></input>
            <textarea className=" resize-none h-96 placeholder:text-gray-700" placeholder="Start writing your blog..."></textarea>
        </div>
    </div>
} 