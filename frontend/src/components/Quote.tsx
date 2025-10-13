export const Quote = () => {
  return (
<div className="hidden md:block">
   <div className="h-screen flex justify-center flex-col gap-1 p-5 bg-gray-200">
        <blockquote className="text-2xl font-bold text-gray-900 leading-relaxed p-3">
          "The customer service I received was amazing. Everyone went above and beyond to address my concerns."
        </blockquote>
       <div className="leading-relaxed p-2">
           <h3 className="text-lg font-bold text-gray-700 mb-4 ">John Doe</h3>
           <h4 className="text-md font-normal text-gray-600 mb-4">CEO, Atlassian</h4>
        </div>
    </div>
</div>
   
   
  )
}
