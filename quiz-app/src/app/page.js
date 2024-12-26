"use client"

import { useRouter } from 'next/navigation';
import Link from 'next/link'

export default function Home() {
  const router = useRouter(); // Use useRouter from next/navigation for App Directory

  const startQuiz = () => {
    router.push('/quiz'); // Use push for navigation
  };

  return (
    <div className="flex flex-col items-center  h-screen">
      <h1 className="text-4xl font-bold">Welcome to the Quiz App</h1>
      <button
        className="mt-5 px-4 py-2 blue text-white rounded"
        onClick={startQuiz}
      >
        Start Quiz
      </button>
    </div>
  );
}
