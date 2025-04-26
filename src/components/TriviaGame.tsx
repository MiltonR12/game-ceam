import { useState } from "react";

declare global {
  interface Window {
    TelegramGameProxy?: {
      receiveEvent: (event: string, data: unknown) => void;
    };
  }
}

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

const TriviaGame = () => {

  const [currentQuestion] = useState<Question>({
    question: "¿Cuál es la capital de Canadá?",
    options: ["Toronto", "Ottawa", "Montreal", "Vancouver"],
    correctIndex: 1,
  });

  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const checkAnswer = (selectedIndex: number) => {
    if (selectedIndex === currentQuestion.correctIndex) {
      setScore(score + 100);
      setIsCorrect(true);
      // Enviar puntuación a Telegram
      if (window.TelegramGameProxy) {
        window.TelegramGameProxy.receiveEvent("share_score", { score: score + 100 });
      }
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.question}>{currentQuestion.question}</h2>
      <div style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            style={{
              ...styles.optionButton,
              backgroundColor: isCorrect !== null 
                ? index === currentQuestion.correctIndex 
                  ? "#4CAF50" 
                  : "#f44336"
                : "#007bff",
            }}
            onClick={() => checkAnswer(index)}
          >
            {option}
          </button>
        ))}
      </div>
      <div style={styles.score}>Puntuación: {score}</div>
      {isCorrect !== null && (
        <div style={styles.feedback}>
          {isCorrect ? "¡Correcto! 🎉" : "Incorrecto 😢"}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "500px",
    margin: "0 auto",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
  },
  question: {
    color: "#2c3e50",
    textAlign: "center" as const,
    marginBottom: "30px",
  },
  optionsContainer: {
    display: "grid",
    gap: "10px",
  },
  optionButton: {
    padding: "15px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  score: {
    textAlign: "center" as const,
    marginTop: "20px",
    fontWeight: "bold",
  },
  feedback: {
    textAlign: "center" as const,
    marginTop: "10px",
    fontSize: "1.2em",
  },
};

export default TriviaGame;