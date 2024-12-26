"use client"

import { useState, useEffect } from "react";
import '../globals.css';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerCorrect, setAnswerCorrect] = useState(null);
  const [timer, setTimer] = useState(10); // 10 seconds per question
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Shuffle the answers so the correct answer isn't always in the same place
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Fetch questions from the API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
        if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
        const data = await response.json();
        if (data.response_code !== 0) throw new Error("Invalid response from API");
  
        const processedQuestions = data.results.map((question) => ({
          ...question,
          shuffledAnswers: shuffleArray([
            ...question.incorrect_answers,
            question.correct_answer,
          ]),
        }));
  
        setQuestions(processedQuestions);
        setLoading(false);
      } catch (error) {
        setError(`Error: ${error.message}`);
        setLoading(false);
      }
    };
  
    fetchQuestions();
  }, []);
  


  // Timer functionality
  useEffect(() => {
    if (isTimerActive && timer > 0) {
      const timerInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timerInterval);
    } else if (timer === 0) {
      handleNextQuestion(); // Move to next question when time runs out
    }
  }, [timer, isTimerActive]);

  // Handle answer selection
  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].correct_answer;
    setAnswerCorrect(isCorrect);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setIsTimerActive(false); // Stop the timer once the answer is selected
    setTimeout(handleNextQuestion, 1000); // Wait 1 second before moving to next question
  };

  // Move to next question
  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1);
    setSelectedAnswer(null);
    setAnswerCorrect(null);
    setTimer(10); // Reset the timer
    setIsTimerActive(true); // Restart the timer for next question
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (currentQuestion >= questions.length) {
    return (
      <div className="center">
        <h2>Quiz Completed!</h2>
        <p>Your score: {score} out of {questions.length}</p>
      </div>
    );
  }

  const currentQuiz = questions[currentQuestion];

  return (
    <div className="flex flex-col center container">
       <div className="right text-red-700"><p>Time remaining: {timer}s</p></div>
       <div className="flex flex-col center container">
      <h1 className="text-2xl font-bold">Quiz</h1>
      <div className="mt-5">
        {/* Use dangerouslySetInnerHTML to properly render HTML entities */}
        <h2 dangerouslySetInnerHTML={{ __html: currentQuiz.question }}></h2>
       

        <div className="flex flex-col mt-3">
  {currentQuiz.shuffledAnswers.map((answer, index) => (
    <button
      key={index}
      className={`mb-2 px-4 py-2 rounded ${
        selectedAnswer === answer
          ? answer === currentQuiz.correct_answer
            ? "bg-green-500"
            : "bg-red-500"
          : "bg-gray-200"
      }`}
      onClick={() => handleAnswer(answer)}
      disabled={selectedAnswer !== null} // Disable after selection
    >
      {answer}
    </button>
  ))}
</div>


        {selectedAnswer && (
          <div className="mt-3">
            {answerCorrect ? (
              <p className="text-green-500">Correct!</p>
            ) : (
              <p className="text-red-500">Incorrect! The correct answer is: {currentQuiz.correct_answer}</p>
            )}
          </div>
        )}
      </div>
    </div></div>
  );
}
