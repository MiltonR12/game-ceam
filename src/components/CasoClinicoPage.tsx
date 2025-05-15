import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Stethoscope, HelpCircle, CheckCircle, User, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Tipos para los casos clínicos
type Pregunta = {
  id: string
  texto: string
  respuesta: string
}

type CasoClinico = {
  id: string
  titulo: string
  descripcion: string
  paciente: {
    edad: number
    sexo: string
    antecedentes?: string
  }
  preguntas: Pregunta[]
}

// Datos de ejemplo para casos clínicos
const casosClinicos: CasoClinico[] = [
  {
    id: "caso1",
    titulo: "Dolor abdominal agudo",
    descripcion:
      "Paciente que acude a urgencias por dolor abdominal intenso en fosa ilíaca derecha de 24 horas de evolución. " +
      "Inicialmente el dolor era periumbilical y posteriormente se localizó en FID. Presenta náuseas, vómitos y fiebre de 38.2°C. " +
      "En la exploración física se observa dolor a la palpación en FID con signo de Blumberg positivo. " +
      "Analítica: leucocitosis (15,000/μL) con neutrofilia (85%).",
    paciente: {
      edad: 22,
      sexo: "masculino",
      antecedentes: "Sin antecedentes médicos relevantes. No alergias conocidas.",
    },
    preguntas: [
      {
        id: "p1c1",
        texto: "¿Cuál es el diagnóstico más probable?",
        respuesta:
          "Apendicitis aguda. El cuadro clínico es característico: dolor que inicia en región periumbilical y migra a fosa ilíaca derecha, acompañado de náuseas, vómitos y fiebre. Los hallazgos exploratorios (Blumberg positivo) y analíticos (leucocitosis con neutrofilia) apoyan este diagnóstico.",
      },
      {
        id: "p2c1",
        texto: "¿Qué prueba de imagen sería más adecuada para confirmar el diagnóstico?",
        respuesta:
          "Ecografía abdominal como primera opción por su disponibilidad, ausencia de radiación y buena sensibilidad. Si los resultados no son concluyentes, se podría realizar una TC abdominal con contraste, que tiene mayor sensibilidad y especificidad.",
      },
      {
        id: "p3c1",
        texto: "¿Cuál es el tratamiento de elección?",
        respuesta:
          "Apendicectomía, que puede realizarse por vía laparoscópica o abierta. Previamente se debe estabilizar al paciente con fluidoterapia y antibióticos intravenosos de amplio espectro.",
      },
    ],
  },
  {
    id: "caso2",
    titulo: "Disnea progresiva",
    descripcion:
      "Paciente con disnea de esfuerzo progresiva de 6 meses de evolución, que ahora aparece con mínimos esfuerzos. " +
      "Refiere ortopnea (2 almohadas) y episodios de disnea paroxística nocturna. " +
      "Presenta edemas en miembros inferiores y aumento de 4 kg de peso en el último mes. " +
      "En la exploración se auscultan crepitantes bibasales y un soplo sistólico en foco mitral. " +
      "Presenta ingurgitación yugular y hepatomegalia.",
    paciente: {
      edad: 68,
      sexo: "femenino",
      antecedentes: "Hipertensión arterial de 15 años de evolución. Infarto de miocardio hace 5 años.",
    },
    preguntas: [
      {
        id: "p1c2",
        texto: "¿Cuál es el diagnóstico más probable?",
        respuesta:
          "Insuficiencia cardíaca congestiva. Los síntomas y signos (disnea progresiva, ortopnea, disnea paroxística nocturna, edemas, aumento de peso) junto con los hallazgos exploratorios (crepitantes bibasales, soplo mitral, ingurgitación yugular y hepatomegalia) son característicos de insuficiencia cardíaca.",
      },
      {
        id: "p2c2",
        texto: "¿Qué pruebas complementarias solicitaría?",
        respuesta:
          "Electrocardiograma, radiografía de tórax, analítica con biomarcadores cardíacos (BNP o NT-proBNP) y función renal, y ecocardiograma para valorar la función ventricular y posibles valvulopatías.",
      },
      {
        id: "p3c2",
        texto: "¿Cuál sería el abordaje terapéutico inicial?",
        respuesta:
          "Tratamiento diurético para reducir la congestión, IECA o ARA-II para reducir la postcarga, betabloqueantes (una vez estabilizado el paciente) y antagonistas de la aldosterona. Restricción de sodio y líquidos. Valorar digoxina si hay fibrilación auricular asociada.",
      },
    ],
  },
  {
    id: "caso3",
    titulo: "Cefalea intensa súbita",
    descripcion:
      "Paciente que acude a urgencias por cefalea intensa de inicio súbito ('la peor cefalea de su vida') mientras realizaba ejercicio. " +
      "La cefalea se acompaña de náuseas, vómitos y fotofobia. " +
      "En la exploración presenta rigidez de nuca y signo de Kernig positivo. " +
      "Escala de Glasgow 14 (apertura ocular 4, respuesta verbal 4, respuesta motora 6). " +
      "TA: 170/95 mmHg, FC: 88 lpm.",
    paciente: {
      edad: 45,
      sexo: "femenino",
      antecedentes: "Hipertensión arterial mal controlada. Fumadora de 20 cigarrillos/día.",
    },
    preguntas: [
      {
        id: "p1c3",
        texto: "¿Cuál es el diagnóstico de sospecha?",
        respuesta:
          "Hemorragia subaracnoidea. La presentación clínica con cefalea súbita e intensa ('la peor de su vida'), desencadenada por ejercicio, junto con signos meníngeos (rigidez de nuca, Kernig positivo) y los factores de riesgo (hipertensión, tabaquismo) son muy sugestivos de esta patología.",
      },
      {
        id: "p2c3",
        texto: "¿Qué prueba diagnóstica solicitaría de forma urgente?",
        respuesta:
          "TC craneal sin contraste como primera prueba por su alta sensibilidad en las primeras 24 horas. Si es negativa y la sospecha clínica es alta, se debe realizar una punción lumbar para detectar xantocromía en el líquido cefalorraquídeo.",
      },
      {
        id: "p3c3",
        texto: "¿Cuál es la causa más frecuente de esta patología?",
        respuesta:
          "Rotura de un aneurisma cerebral, que representa aproximadamente el 85% de los casos de hemorragia subaracnoidea no traumática. Otras causas menos frecuentes incluyen malformaciones arteriovenosas, vasculitis y trastornos de la coagulación.",
      },
    ],
  },
  {
    id: "caso4",
    titulo: "Poliuria y polidipsia",
    descripcion:
      "Paciente que consulta por aumento de la frecuencia miccional y sed intensa de 2 meses de evolución. " +
      "Refiere que orina aproximadamente 4-5 litros al día y tiene que levantarse varias veces por la noche para orinar. " +
      "Ha perdido 5 kg de peso a pesar de que su apetito ha aumentado. " +
      "También refiere fatiga, visión borrosa ocasional y hormigueo en manos y pies.",
    paciente: {
      edad: 52,
      sexo: "masculino",
      antecedentes: "Obesidad (IMC 32). Padre y hermana con diabetes mellitus tipo 2.",
    },
    preguntas: [
      {
        id: "p1c4",
        texto: "¿Cuál es el diagnóstico más probable?",
        respuesta:
          "Diabetes mellitus tipo 2. Los síntomas cardinales (poliuria, polidipsia, polifagia con pérdida de peso) junto con los síntomas de neuropatía periférica (hormigueo en manos y pies) y los factores de riesgo (obesidad, antecedentes familiares) son muy sugestivos de diabetes mellitus tipo 2.",
      },
      {
        id: "p2c4",
        texto: "¿Qué pruebas solicitaría para confirmar el diagnóstico?",
        respuesta:
          "Glucemia en ayunas, hemoglobina glicosilada (HbA1c), test de tolerancia oral a la glucosa si fuera necesario. También analítica completa con perfil lipídico, función renal y hepática, y análisis de orina para detectar glucosuria y microalbuminuria.",
      },
      {
        id: "p3c4",
        texto: "¿Cuál sería el abordaje terapéutico inicial?",
        respuesta:
          "Modificación del estilo de vida (dieta, ejercicio, pérdida de peso) y metformina como fármaco de primera línea. Educación diabetológica, automonitorización de glucemia y revisión periódica para detectar complicaciones. Según el control metabólico, podría ser necesario añadir otros antidiabéticos orales o insulina.",
      },
    ],
  },
]

function CasoClinicoPage() {
  const [telegram, setTelegram] = useState({
    id: "",
    id_caso: "",
  })

  const [currentCasoIndex, setCurrentCasoIndex] = useState(0)
  const [preguntasVisibles, setPreguntasVisibles] = useState<Record<string, boolean>>({})
  const [respuestasVisibles, setRespuestasVisibles] = useState<Record<string, boolean>>({})
  const [casoCompletado, setCasoCompletado] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tgUserId = urlParams.get("tg_user_id")
    const id_caso = urlParams.get("id_caso")

    if (tgUserId) {
      setTelegram({
        id: tgUserId,
        id_caso: id_caso || "",
      })
    } else {
      console.error("No se encontró el ID de usuario de Telegram en la URL.")
      // Para propósitos de demostración, establecemos un ID de ejemplo
      setTelegram({
        id: "user123456",
        id_caso: "caso1",
      })
    }

    // Inicializar el caso actual si se proporciona en la URL
    if (id_caso) {
      const casoIndex = casosClinicos.findIndex((caso) => caso.id === id_caso)
      if (casoIndex !== -1) {
        setCurrentCasoIndex(casoIndex)
      }
    }
  }, [])

  const currentCaso = casosClinicos[currentCasoIndex]
  const progress = (Object.values(casoCompletado).filter(Boolean).length / casosClinicos.length) * 100

  const togglePregunta = (preguntaId: string) => {
    setPreguntasVisibles((prev) => ({
      ...prev,
      [preguntaId]: !prev[preguntaId],
    }))
  }

  const toggleRespuesta = (preguntaId: string) => {
    setRespuestasVisibles((prev) => ({
      ...prev,
      [preguntaId]: !prev[preguntaId],
    }))
  }

  const marcarCasoCompletado = () => {
    setCasoCompletado((prev) => ({
      ...prev,
      [currentCaso.id]: true,
    }))
  }

  const irAlSiguienteCaso = () => {
    if (currentCasoIndex < casosClinicos.length - 1) {
      setCurrentCasoIndex(currentCasoIndex + 1)
    } else {
      setCurrentCasoIndex(0) // Volver al primer caso si estamos en el último
    }
  }

  const irAlCasoAnterior = () => {
    if (currentCasoIndex > 0) {
      setCurrentCasoIndex(currentCasoIndex - 1)
    } else {
      setCurrentCasoIndex(casosClinicos.length - 1) // Ir al último caso si estamos en el primero
    }
  }

  const todasLasRespuestasVisibles = currentCaso.preguntas.every((pregunta) => respuestasVisibles[pregunta.id])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Cabecera con información del usuario */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Usuario ID: {telegram.id.substring(0, 8)}...</p>
              <p className="text-xs text-gray-500">
                Caso: {currentCasoIndex + 1}/{casosClinicos.length}
              </p>
            </div>
          </div>
          <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {Object.values(casoCompletado).filter(Boolean).length} Completados
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progreso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Tarjeta del caso clínico */}
        <Card className="p-6 mb-6 bg-white shadow-lg border-0 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold text-gray-700">Caso Clínico {currentCasoIndex + 1}</h2>
            </div>
            {casoCompletado[currentCaso.id] && <CheckCircle className="h-5 w-5 text-green-500" />}
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-3">{currentCaso.titulo}</h3>

          <Tabs defaultValue="descripcion" className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="descripcion">Descripción</TabsTrigger>
              <TabsTrigger value="paciente">Datos del Paciente</TabsTrigger>
            </TabsList>
            <TabsContent value="descripcion" className="mt-3">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">{currentCaso.descripcion}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="paciente" className="mt-3">
              <div className="bg-teal-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Edad:</span> {currentCaso.paciente.edad} años
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Sexo:</span> {currentCaso.paciente.sexo}
                </p>
                {currentCaso.paciente.antecedentes && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Antecedentes:</span> {currentCaso.paciente.antecedentes}
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              Preguntas
            </h4>

            <div className="space-y-4">
              {currentCaso.preguntas.map((pregunta) => (
                <div key={pregunta.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => togglePregunta(pregunta.id)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-800">{pregunta.texto}</span>
                    <ChevronRight
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        preguntasVisibles[pregunta.id] ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {preguntasVisibles[pregunta.id] && (
                    <div className="p-3 border-t border-gray-200">
                      {respuestasVisibles[pregunta.id] ? (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-gray-800">{pregunta.respuesta}</p>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => toggleRespuesta(pregunta.id)}
                          className="w-full border-dashed border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          Ver respuesta
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              onClick={irAlCasoAnterior}
              className="flex-1 flex items-center justify-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            {todasLasRespuestasVisibles && !casoCompletado[currentCaso.id] ? (
              <Button onClick={marcarCasoCompletado} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                Completar caso
              </Button>
            ) : (
              <Button
                onClick={irAlSiguienteCaso}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>

        {/* Información adicional */}
        <p className="text-center text-xs text-gray-500">
          Revisa todas las preguntas y respuestas para completar el caso clínico
        </p>
      </div>
    </div>
  )
}

export default CasoClinicoPage
