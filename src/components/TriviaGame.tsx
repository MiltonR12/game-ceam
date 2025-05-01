import { useState, useEffect } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
          };
        };
        sendData: (data: string) => void;
        expand: () => void;
        enableClosingConfirmation: () => void;
        close: () => void;
        ready: () => void;
        MainButton: {
          setText: (text: string) => void;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        themeParams: {
          bg_color: string;
          text_color: string;
          button_color: string;
          button_text_color: string;
        };
        platform: string;
        isExpanded: boolean;
        version: string;
      };
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
  const [userData, setUserData] = useState<{ id?: number, name?: string }>({});

  useEffect(() => {
    const initWebApp = async () => {
      if (!window.Telegram?.WebApp) {
        console.warn('WebApp de Telegram no detectada - Modo desarrollo');
        setUserData({ id: 12345, name: 'Usuario de prueba' });
        return;
      }
  
      const tg = window.Telegram.WebApp;
      
      // 1. Mostrar datos de depuración
      const debugInfo = {
        initData: tg.initData,
        initDataUnsafe: tg.initDataUnsafe,
        platform: tg.platform,
        version: tg.version,
        themeParams: tg.themeParams
      };
      
      console.log('Telegram WebApp Debug:', debugInfo);
      document.getElementById('debug-info')!.innerText = JSON.stringify(debugInfo, null, 2);
  
      // 2. Configurar WebApp
      tg.expand();
      tg.enableClosingConfirmation();
      tg.ready();
  
      // 3. Obtener usuario
      if (tg.initDataUnsafe?.user) {
        const user = tg.initDataUnsafe.user;
        setUserData({
          id: user.id,
          name: [user.first_name, user.last_name].filter(Boolean).join(' ') || `User${user.id}`
        });
      } else {
        console.error('Datos de usuario no disponibles');
      }
  
      // 4. Configurar botón de cierre
      tg.MainButton.setText('Cerrar Juego');
      tg.MainButton.show();
      tg.MainButton.onClick(() => tg.close());
    };
  
    initWebApp();
  }, []);

  const sendScoreToTelegram = async (newScore: number) => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      try {
        const data = {
          action: 'update_score',
          userId: userData.id || tg.initDataUnsafe?.user?.id,
          score: newScore,
          timestamp: Date.now(),
          // Datos adicionales para depuración
          platform: tg.platform,
          initData: tg.initData ? 'present' : 'missing'
        };
  
        console.log('Enviando datos:', data);
        
        // Opción 1: Envío directo a través de WebApp
        tg.sendData(JSON.stringify(data));
        
        // Opción 2: Envío alternativo vía fetch
        if (!tg.initData) {
          console.warn('Enviando por fallback HTTP');
          await fetch('https://tu-api.com/save-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
        }
  
        setTimeout(() => tg.close(), 2000);
        
      } catch (error) {
        console.error('Error al enviar:', error);
      }
    } else {
      console.log('Modo desarrollo - Puntuación:', newScore);
    }
  };

  const checkAnswer = (selectedIndex: number) => {
    const isAnswerCorrect = selectedIndex === currentQuestion.correctIndex;
    const newScore = isAnswerCorrect ? score + 100 : score;

    setScore(newScore);
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      sendScoreToTelegram(newScore);
    }
  };

  return (
    <div style={styles.container}>
      {userData.id && (
        <div style={styles.userBadge}>
          Jugando como: {userData.name || `Usuario ${userData.id}`}
        </div>
      )}

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
            disabled={isCorrect !== null}
          >
            {option}
          </button>
        ))}
      </div>
      <div style={styles.score}>Puntuación: {score}</div>
      {isCorrect !== null && (
        <div style={{
          ...styles.feedback,
          color: isCorrect ? '#4CAF50' : '#f44336'
        }}>
          {isCorrect ? "¡Correcto! 🎉" : "Incorrecto 😢"}
          <button
            style={styles.nextButton}
            onClick={() => {
              setIsCorrect(null);
              // Aquí podrías cargar una nueva pregunta
            }}
          >
            Continuar
          </button>
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
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  userBadge: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "8px 12px",
    borderRadius: "20px",
    fontSize: "0.9em",
    marginBottom: "20px",
    display: "inline-block"
  },
  question: {
    color: "#2c3e50",
    textAlign: "center" as const,
    marginBottom: "30px",
    fontSize: "1.4em"
  },
  optionsContainer: {
    display: "grid",
    gap: "15px",
    gridTemplateColumns: "1fr 1fr",
  },
  optionButton: {
    padding: "15px",
    border: "none",
    borderRadius: "12px",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s",
    fontSize: "1em",
    fontWeight: "bold",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    ':hover': {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)"
    },
    ':disabled': {
      opacity: 0.7,
      transform: 'none !important'
    }
  },
  score: {
    textAlign: "center" as const,
    marginTop: "25px",
    fontWeight: "bold",
    fontSize: "1.2em",
    color: "#2c3e50"
  },
  feedback: {
    textAlign: "center" as const,
    marginTop: "20px",
    fontSize: "1.3em",
    fontWeight: "bold",
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: "#f8f9fa"
  },
  nextButton: {
    display: "block",
    margin: "15px auto 0",
    padding: "10px 25px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1em",
    transition: "background-color 0.3s",
    ':hover': {
      backgroundColor: "#0056b3"
    }
  }
};

export default TriviaGame;