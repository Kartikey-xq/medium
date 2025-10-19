export const Tags = ()=>{
    return <div className=" mt-1 w-full h-full border-2 border-gray-300 rounded-xl bg-white shadow-sm flex flex-col">
        <div className=" flex flex-col gap-2 p-4">
            <input className="border-b placeholder:text-xs placeholder:text-gray-700" type="text" placeholder="Add tags separated by commas"></input>
        </div>
    </div>
}