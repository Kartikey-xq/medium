import { motion } from "motion/react";

const quotes = [
  { text: "Information is power.", author: "Sir Francis Bacon" },
  { text: "Content is king.", author: "Bill Gates" },
  { text: "Your story matters.", author: "Seth Godin" },
  { text: "Blogging is sharing, learning, inspiring.", author: "Amit Agarwal" },
  { text: "Speak your mind, change the world.", author: "Malala Yousafzai" },
  { text: "Words can move mountains.", author: "Nelson Mandela" },
  { text: "Write to be understood.", author: "Leo Rosten" },
  { text: "Ideas shape the course of history.", author: "John Maynard Keynes" },
  { text: "Knowledge grows when shared.", author: "Peter Drucker" },
  { text: "Your voice is your superpower.", author: "Oprah Winfrey" },
  { text: "Blogging is a conversation, not a code.", author: "Mike Butcher" },
  { text: "The pen is mightier than the sword.", author: "Edward Bulwer-Lytton" },
  { text: "Share what you know.", author: "Chris Brogan" },
  { text: "Every post is a chance to inspire.", author: "Darren Rowse" },
  { text: "Blogging turns passion into influence.", author: "Brian Clark" },
    { text: "Writing is freedom.", author: "Susan Sontag" },
  { text: "Blogs amplify voices.", author: "Rebecca Blood" },
  { text: "Words ignite change.", author: "Arundhati Roy" },
  { text: "Articles shape opinion.", author: "George Orwell" },
  { text: "Youth write the future.", author: "Malala Yousafzai" },
  { text: "Activism begins with words.", author: "Angela Davis" },
  { text: "Speak truth, spark action.", author: "James Baldwin" },
  { text: "Every post is protest.", author: "Ai Weiwei" },
  { text: "Freedom needs storytellers.", author: "Vaclav Havel" },
  { text: "Blogs democratize knowledge.", author: "Clay Shirky" },
  { text: "Your words are weapons.", author: "Toni Morrison" },
  { text: "Youth voices matter.", author: "Greta Thunberg" },
  { text: "Articles are activism.", author: "Gloria Steinem" },
  { text: "Writing is resistance.", author: "bell hooks" },
  { text: "Blogs build movements.", author: "Howard Rheingold" }
];

export const MotivationalLoader = () => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return (
    <div className="flex items-center justify-center h-auto w-full px-4 select-none">
      <div className="flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-gray-700 mb-2 uppercase"
          style={{ letterSpacing: "0.05em" }}
        >
          "{randomQuote.text}"
        </motion.p>
        <span className="text-sm sm:text-base text-gray-600 font-mono mb-6">
          — {randomQuote.author}
        </span>
        <motion.div
          className="text-3xl font-black text-gray-400"
          initial={{ opacity: 0.5 }}
          animate={{ x: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          ...
        </motion.div>
      </div>
    </div>
  );
};