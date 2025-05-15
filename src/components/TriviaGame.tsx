import { useEffect, useState } from "react"
import FlashcardPage from "./FlashcardPage"
import CasoClinicoPage from "./CasoClinicoPage";
import ExamenPage from "./ExamenPage";

type IFlashcard = {
  id: string;
  question: string;
  answer: string;
  justification: string;
}

const url = "http://localhost:4000/api/question/telegram"

function TriviaGame() {

  const [flashcards, setFlashcards] = useState<IFlashcard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [typeGame, setTypeGame] = useState("")

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const typeGame = urlParams.get("type_game")
    setTypeGame(typeGame || "")
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setFlashcards(data.data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
      })

  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
        <p className="text-gray-700">Cargando...</p>
      </div>
    )
  }

  if (typeGame === "flashcard") return <FlashcardPage flashcards={flashcards} />
  if (typeGame === "caso") return <CasoClinicoPage />
  if (typeGame === "examen") return <ExamenPage />

  return (
    <div>
      No se encontró el ID de usuario de Telegram en la URL.
    </div>
  )

}

export default TriviaGame
