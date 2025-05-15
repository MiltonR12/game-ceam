import { useState } from "react"
import { ChevronRight, User, BookOpen, Award, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const difficultyLevels = [
  { id: "very-easy", label: "Muy Fácil", color: "bg-green-500" },
  { id: "easy", label: "Fácil", color: "bg-blue-500" },
  { id: "difficult", label: "Difícil", color: "bg-orange-500" },
  { id: "very-difficult", label: "Muy Difícil", color: "bg-red-500" },
]

type IFlashcard = {
  id: string
  question: string
  answer: string
  justification: string
}

type Props = {
  flashcards: IFlashcard[]
}

function FlashcardPage({ flashcards }: Props) {

  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [completedCards, setCompletedCards] = useState<string[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)

  const currentFlashcard = flashcards[currentFlashcardIndex]
  const progress = (completedCards.length / flashcards.length) * 100

  const handleDifficultySelect = (difficultyId: string) => {
    setSelectedDifficulty(difficultyId)

    if (!completedCards.includes(currentFlashcard.id)) {
      setCompletedCards([...completedCards, currentFlashcard.id])
    }

    setShowAnswer(true)

    setTimeout(() => {
      setCurrentFlashcardIndex((prevIndex) => (prevIndex === flashcards.length - 1 ? 0 : prevIndex + 1))
      setShowAnswer(false)
      setSelectedDifficulty(null)
    }, 1500)
  }

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">

        <div className="bg-white rounded-xl shadow-md p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-2 rounded-full">
              <User className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">
                Flashcard: {currentFlashcardIndex + 1}/{flashcards.length}
              </p>
            </div>
          </div>
          <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {completedCards.length} Completadas
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progreso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div key={currentFlashcard.id} >
          <Card className="p-6 mb-6 bg-white shadow-lg border-0 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <h2 className="font-bold text-gray-700">Pregunta {currentFlashcardIndex + 1}</h2>
              </div>
              {completedCards.includes(currentFlashcard.id) && <CheckCircle className="h-5 w-5 text-green-500" />}
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{currentFlashcard.question}</h3>

              {showAnswer ? (
                <div>
                  <div className="bg-purple-50 p-4 rounded-lg mb-3">
                    <p className="font-bold text-purple-800">Respuesta:</p>
                    <p className="text-purple-900">{currentFlashcard.answer}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-bold text-blue-800">Justificación:</p>
                    <p className="text-blue-900">{currentFlashcard.justification}</p>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={toggleAnswer}
                  className="w-full border-dashed border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  Ver respuesta
                </Button>
              )}
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Award className="h-4 w-4 text-purple-600" />
            ¿Qué tan difícil te pareció?
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {difficultyLevels.map((level) => (
              <Button
                key={level.id}
                onClick={() => handleDifficultySelect(level.id)}
                disabled={!!selectedDifficulty}
                className={`${level.color} hover:opacity-90 text-white font-medium flex items-center justify-center gap-1 h-12 transition-all ${selectedDifficulty === level.id ? "ring-4 ring-offset-2" : ""
                  }`}
              >
                {level.label}
                <ChevronRight
                  className={`h-4 w-4 transition-all ${selectedDifficulty === level.id ? "translate-x-1" : ""}`}
                />
              </Button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          Selecciona la dificultad para avanzar a la siguiente pregunta
        </p>
      </div>
    </div>
  )
}

export default FlashcardPage