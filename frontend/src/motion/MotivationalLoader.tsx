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
  { text: "Blogging turns passion into influence.", author: "Brian Clark" }
];

export const MotivationalLoader = () => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return (
    <div className="flex flex-col items-center justify-center h-screen select-none">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-600 text-center mb-2 uppercase"
        style={{ letterSpacing: '0.05em' }}
      >
        "{randomQuote.text}"
      </motion.p>
      <span className="text-base text-gray-700 font-mono mb-6 text-center">
        — {randomQuote.author}
      </span>
      <motion.div
        className="text-3xl font-black text-gray-500"
        initial={{ opacity: 0.5 }}
        animate={{ x: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        ...
      </motion.div>
    </div>
  );
};