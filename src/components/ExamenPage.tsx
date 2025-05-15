import { useState, useEffect } from "react"
import { CheckCircle, XCircle, HelpCircle, User, BookOpen, ChevronLeft, ChevronRight, Award } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Tipos para los exámenes
type Opcion = {
  id: string
  texto: string
}

type Pregunta = {
  id: string
  texto: string
  opciones: Opcion[]
  respuestaCorrecta: string
  justificacion: string
}

type Examen = {
  id: string
  titulo: string
  descripcion: string
  categoria: string
  nivel: "básico" | "intermedio" | "avanzado"
  preguntas: Pregunta[]
}

// Datos de ejemplo para exámenes
const examenes: Examen[] = [
  {
    id: "examen1",
    titulo: "Fundamentos de Anatomía",
    descripcion: "Examen sobre conceptos básicos de anatomía humana. Incluye preguntas sobre sistemas corporales principales.",
    categoria: "Medicina",
    nivel: "básico",
    preguntas: [
      {
        id: "p1e1",
        texto: "¿Cuál de los siguientes huesos NO pertenece al esqueleto axial?",
        opciones: [
          { id: "a", texto: "Vértebras" },
          { id: "b", texto: "Húmero" },
          { id: "c", texto: "Costillas" },
          { id: "d", texto: "Esternón" },
        ],
        respuestaCorrecta: "b",
        justificacion:
          "El húmero es un hueso largo que forma parte del esqueleto apendicular, específicamente del miembro superior. El esqueleto axial está formado por los huesos del cráneo, columna vertebral (vértebras), costillas y esternón.",
      },
      {
        id: "p2e1",
        texto: "¿Cuál es la principal función del sistema linfático?",
        opciones: [
          { id: "a", texto: "Transportar oxígeno a los tejidos" },
          { id: "b", texto: "Filtrar la sangre y eliminar toxinas" },
          { id: "c", texto: "Defender al organismo contra infecciones" },
          { id: "d", texto: "Regular la temperatura corporal" },
        ],
        respuestaCorrecta: "c",
        justificacion:
          "La principal función del sistema linfático es defender al organismo contra infecciones. Este sistema forma parte del sistema inmunitario y ayuda a combatir bacterias, virus y otros microorganismos. También drena el exceso de líquido de los tejidos y transporta grasas desde el intestino.",
      },
      {
        id: "p3e1",
        texto: "¿Qué estructura conecta los músculos a los huesos?",
        opciones: [
          { id: "a", texto: "Ligamentos" },
          { id: "b", texto: "Tendones" },
          { id: "c", texto: "Cartílagos" },
          { id: "d", texto: "Fascias" },
        ],
        respuestaCorrecta: "b",
        justificacion:
          "Los tendones son estructuras de tejido conectivo fibroso que conectan los músculos a los huesos. Los ligamentos, en cambio, conectan huesos entre sí. El cartílago es un tejido conectivo flexible que recubre las superficies articulares, y las fascias son membranas fibrosas que envuelven músculos y grupos musculares.",
      },
      {
        id: "p4e1",
        texto: "¿Cuál de las siguientes NO es una función del hígado?",
        opciones: [
          { id: "a", texto: "Producción de bilis" },
          { id: "b", texto: "Almacenamiento de glucógeno" },
          { id: "c", texto: "Producción de insulina" },
          { id: "d", texto: "Desintoxicación de sustancias nocivas" },
        ],
        respuestaCorrecta: "c",
        justificacion:
          "La producción de insulina NO es una función del hígado, sino del páncreas, específicamente de las células beta de los islotes de Langerhans. El hígado produce bilis, almacena glucógeno, desintoxica sustancias nocivas, sintetiza proteínas plasmáticas y participa en el metabolismo de nutrientes.",
      },
      {
        id: "p5e1",
        texto: "¿Qué válvula cardíaca separa el ventrículo izquierdo de la aorta?",
        opciones: [
          { id: "a", texto: "Válvula tricúspide" },
          { id: "b", texto: "Válvula mitral" },
          { id: "c", texto: "Válvula pulmonar" },
          { id: "d", texto: "Válvula aórtica" },
        ],
        respuestaCorrecta: "d",
        justificacion:
          "La válvula aórtica separa el ventrículo izquierdo de la aorta. La válvula tricúspide separa la aurícula derecha del ventrículo derecho, la válvula mitral (o bicúspide) separa la aurícula izquierda del ventrículo izquierdo, y la válvula pulmonar separa el ventrículo derecho de la arteria pulmonar.",
      },
    ],
  },
  {
    id: "examen2",
    titulo: "Programación en JavaScript",
    descripcion: "Examen sobre conceptos fundamentales de JavaScript y programación web.",
    categoria: "Informática",
    nivel: "intermedio",
    preguntas: [
      {
        id: "p1e2",
        texto: "¿Cuál es el resultado de la siguiente expresión? \n3 + 2 + '7'",
        opciones: [
          { id: "a", texto: "12" },
          { id: "b", texto: "57" },
          { id: "c", texto: "327" },
          { id: "d", texto: "Error" },
        ],
        respuestaCorrecta: "b",
        justificacion:
          "El resultado es '57'. JavaScript evalúa las expresiones de izquierda a derecha. Primero suma 3 + 2 = 5, y luego concatena el resultado con el string '7', resultando en '57'. Esto ocurre porque cuando un operador + encuentra un string, convierte el otro operando a string y realiza una concatenación.",
      },
      {
        id: "p2e2",
        texto: "¿Qué método se utiliza para añadir un elemento al final de un array en JavaScript?",
        opciones: [
          { id: "a", texto: "push()" },
          { id: "b", texto: "pop()" },
          { id: "c", texto: "shift()" },
          { id: "d", texto: "unshift()" },
        ],
        respuestaCorrecta: "a",
        justificacion:
          "El método push() añade uno o más elementos al final de un array y devuelve la nueva longitud del array. Por ejemplo: let arr = [1, 2]; arr.push(3); // arr ahora es [1, 2, 3]. Los otros métodos tienen diferentes funciones: pop() elimina el último elemento, shift() elimina el primer elemento, y unshift() añade elementos al principio del array.",
      },
      {
        id: "p3e2",
        texto: "¿Cuál es la forma correcta de declarar una función flecha (arrow function) en JavaScript?",
        opciones: [
          { id: "a", texto: "function() => {}" },
          { id: "b", texto: "const func = function() {}" },
          { id: "c", texto: "const func = () => {}" },
          { id: "d", texto: "function func() => {}" },
        ],
        respuestaCorrecta: "c",
        justificacion:
          "La forma correcta de declarar una función flecha es 'const func = () => {}'. Las funciones flecha fueron introducidas en ES6 y proporcionan una sintaxis más concisa para escribir funciones. No tienen su propio 'this', 'arguments', 'super' o 'new.target', y no pueden ser usadas como constructores.",
      },
      {
        id: "p4e2",
        texto: "¿Qué método se utiliza para convertir un objeto JavaScript a una cadena JSON?",
        opciones: [
          { id: "a", texto: "JSON.parse()" },
          { id: "b", texto: "JSON.stringify()" },
          { id: "c", texto: "JSON.toObject()" },
          { id: "d", texto: "JSON.toString()" },
        ],
        respuestaCorrecta: "b",
        justificacion:
          "JSON.stringify() convierte un objeto JavaScript a una cadena JSON. Por ejemplo: const obj = {name: 'John', age: 30}; const jsonStr = JSON.stringify(obj); // jsonStr será '{\"name\":\"John\",\"age\":30}'. JSON.parse() hace lo contrario, convierte una cadena JSON a un objeto JavaScript.",
      },
      {
        id: "p5e2",
        texto: "¿Cuál es el operador para comprobar igualdad estricta en JavaScript?",
        opciones: [
          { id: "a", texto: "==" },
          { id: "b", texto: "===" },
          { id: "c", texto: "=" },
          { id: "d", texto: "!==" },
        ],
        respuestaCorrecta: "b",
        justificacion:
          "El operador === comprueba igualdad estricta, lo que significa que compara tanto el valor como el tipo de datos. Por ejemplo, 5 === '5' es false porque aunque los valores son iguales, los tipos son diferentes (número vs string). El operador == comprueba igualdad pero con conversión de tipos, = es para asignación, y !== es el operador de desigualdad estricta.",
      },
    ],
  },
  {
    id: "examen3",
    titulo: "Historia Universal",
    descripcion: "Examen sobre eventos históricos importantes y civilizaciones antiguas.",
    categoria: "Historia",
    nivel: "avanzado",
    preguntas: [
      {
        id: "p1e3",
        texto: "¿Qué evento marcó el inicio de la Primera Guerra Mundial?",
        opciones: [
          { id: "a", texto: "La invasión de Polonia por Alemania" },
          { id: "b", texto: "El asesinato del archiduque Francisco Fernando" },
          { id: "c", texto: "El hundimiento del Lusitania" },
          { id: "d", texto: "La Revolución Rusa" },
        ],
        respuestaCorrecta: "b",
        justificacion:
          "El asesinato del archiduque Francisco Fernando de Austria, heredero al trono austro-húngaro, y su esposa Sofía en Sarajevo el 28 de junio de 1914 por el nacionalista serbio Gavrilo Princip, fue el detonante que llevó al inicio de la Primera Guerra Mundial. Este evento desencadenó una serie de alianzas y declaraciones de guerra que involucraron a las principales potencias europeas.",
      },
      {
        id: "p2e3",
        texto: "¿Cuál de las siguientes civilizaciones NO pertenece a Mesoamérica?",
        opciones: [
          { id: "a", texto: "Maya" },
          { id: "b", texto: "Azteca" },
          { id: "c", texto: "Inca" },
          { id: "d", texto: "Olmeca" },
        ],
        respuestaCorrecta: "c",
        justificacion:
          "La civilización Inca no pertenece a Mesoamérica, sino a la región andina de Sudamérica, principalmente en los territorios actuales de Perú, Ecuador, Bolivia y partes de Colombia, Chile y Argentina. Las civilizaciones Maya, Azteca y Olmeca sí son mesoamericanas, desarrollándose en lo que hoy es México y parte de Centroamérica.",
      },
      {
        id: "p3e3",
        texto: "¿Quién fue el primer emperador de China que unificó el país?",
        opciones: [
          { id: "a", texto: "Confucio" },
          { id: "b", texto: "Sun Tzu" },
          { id: "c", texto: "Qin Shi Huang" },
          { id: "d", texto: "Kublai Khan" },
        ],
        respuestaCorrecta: "c",
        justificacion:
          "Qin Shi Huang (259-210 a.C.) fue el primer emperador de la China unificada. Gobernó como rey del estado de Qin del 246 al 221 a.C., y luego como el Primer Emperador de la dinastía Qin del 221 al 210 a.C. Unificó China tras conquistar a los demás estados combatientes, implementó reformas legales, estandarizó la escritura, la moneda y las medidas, y ordenó la construcción de la Gran Muralla China y del Ejército de Terracota.",
      },
      {
        id: "p4e3",
        texto: "¿Cuál fue la capital del Imperio Bizantino?",
        opciones: [
          { id: "a", texto: "Roma" },
          { id: "b", texto: "Atenas" },
          { id: "c", texto: "Constantinopla" },
          { id: "d", texto: "Alejandría" },
        ],
        respuestaCorrecta: "c",
        justificacion:
          "Constantinopla (actual Estambul, Turquía) fue la capital del Imperio Bizantino desde su fundación en el 330 d.C. por el emperador romano Constantino I hasta su caída ante el Imperio Otomano en 1453. Originalmente llamada Bizancio, fue renombrada como Nova Roma (Nueva Roma) y luego como Constantinopla en honor a su fundador. Era una ciudad estratégicamente ubicada entre Europa y Asia, y fue un importante centro cultural, religioso y comercial durante más de mil años.",
      },
      {
        id: "p5e3",
        texto: "¿Qué tratado puso fin a la Primera Guerra Mundial?",
        opciones: [
          { id: "a", texto: "Tratado de Versalles" },
          { id: "b", texto: "Tratado de Tordesillas" },
          { id: "c", texto: "Tratado de Westfalia" },
          { id: "d", texto: "Tratado de Utrecht" },
        ],
        respuestaCorrecta: "a",
        justificacion:
          "El Tratado de Versalles, firmado el 28 de junio de 1919, puso fin oficialmente a la Primera Guerra Mundial. Fue firmado entre Alemania y las potencias aliadas (principalmente Francia, Reino Unido, Italia y Estados Unidos) en el Palacio de Versalles, cerca de París. El tratado estableció duras condiciones para Alemania, incluyendo importantes pérdidas territoriales, limitaciones militares y el pago de cuantiosas reparaciones de guerra, lo que contribuyó al resentimiento alemán que posteriormente facilitaría el ascenso del nazismo.",
      },
    ],
  },
]

function ExamenPage() {
  const [telegram, setTelegram] = useState({
    id: "",
    id_examen: "",
  })

  const [currentExamenIndex, setCurrentExamenIndex] = useState(0)
  const [currentPreguntaIndex, setCurrentPreguntaIndex] = useState(0)
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState<Record<string, string>>({})
  const [mostrarRespuestas, setMostrarRespuestas] = useState<Record<string, boolean>>({})
  const [examenesCompletados, setExamenesCompletados] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tgUserId = urlParams.get("tg_user_id")
    const id_examen = urlParams.get("id_examen")

    if (tgUserId) {
      setTelegram({
        id: tgUserId,
        id_examen: id_examen || "",
      })
    } else {
      console.error("No se encontró el ID de usuario de Telegram en la URL.")
      // Para propósitos de demostración, establecemos un ID de ejemplo
      setTelegram({
        id: "user123456",
        id_examen: "examen1",
      })
    }

    // Inicializar el examen actual si se proporciona en la URL
    if (id_examen) {
      const examenIndex = examenes.findIndex((examen) => examen.id === id_examen)
      if (examenIndex !== -1) {
        setCurrentExamenIndex(examenIndex)
      }
    }
  }, [])

  const currentExamen = examenes[currentExamenIndex]
  const currentPregunta = currentExamen.preguntas[currentPreguntaIndex]
  const progress = (Object.values(examenesCompletados).filter(Boolean).length / examenes.length) * 100

  const seleccionarRespuesta = (preguntaId: string, opcionId: string) => {
    setRespuestasSeleccionadas((prev) => ({
      ...prev,
      [preguntaId]: opcionId,
    }))
  }

  const toggleMostrarRespuesta = (preguntaId: string) => {
    setMostrarRespuestas((prev) => ({
      ...prev,
      [preguntaId]: !prev[preguntaId],
    }))
  }

  const irSiguientePregunta = () => {
    if (currentPreguntaIndex < currentExamen.preguntas.length - 1) {
      setCurrentPreguntaIndex(currentPreguntaIndex + 1)
    } else {
      // Si es la última pregunta, marcar el examen como completado
      if (todasPreguntasRespondidas()) {
        setExamenesCompletados((prev) => ({
          ...prev,
          [currentExamen.id]: true,
        }))
      }
    }
  }

  const irPreguntaAnterior = () => {
    if (currentPreguntaIndex > 0) {
      setCurrentPreguntaIndex(currentPreguntaIndex - 1)
    }
  }

  const irSiguienteExamen = () => {
    if (currentExamenIndex < examenes.length - 1) {
      setCurrentExamenIndex(currentExamenIndex + 1)
      setCurrentPreguntaIndex(0)
    } else {
      // Volver al primer examen si estamos en el último
      setCurrentExamenIndex(0)
      setCurrentPreguntaIndex(0)
    }
  }

  const irExamenAnterior = () => {
    if (currentExamenIndex > 0) {
      setCurrentExamenIndex(currentExamenIndex - 1)
      setCurrentPreguntaIndex(0)
    } else {
      // Ir al último examen si estamos en el primero
      setCurrentExamenIndex(examenes.length - 1)
      setCurrentPreguntaIndex(0)
    }
  }

  const todasPreguntasRespondidas = () => {
    return currentExamen.preguntas.every((pregunta) => respuestasSeleccionadas[pregunta.id])
  }

  const calcularPuntuacion = () => {
    let correctas = 0
    currentExamen.preguntas.forEach((pregunta) => {
      if (respuestasSeleccionadas[pregunta.id] === pregunta.respuestaCorrecta) {
        correctas++
      }
    })
    return {
      correctas,
      total: currentExamen.preguntas.length,
      porcentaje: Math.round((correctas / currentExamen.preguntas.length) * 100),
    }
  }

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "básico":
        return "bg-green-100 text-green-800"
      case "intermedio":
        return "bg-blue-100 text-blue-800"
      case "avanzado":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const esRespuestaCorrecta = (preguntaId: string, opcionId: string) => {
    const pregunta = currentExamen.preguntas.find((p) => p.id === preguntaId)
    return pregunta && pregunta.respuestaCorrecta === opcionId
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Cabecera con información del usuario */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 p-2 rounded-full">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Usuario ID: {telegram.id.substring(0, 8)}...</p>
              <p className="text-xs text-gray-500">
                Examen: {currentExamenIndex + 1}/{examenes.length}
              </p>
            </div>
          </div>
          <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {Object.values(examenesCompletados).filter(Boolean).length} Completados
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

        {/* Información del examen */}
        <Card className="p-6 mb-6 bg-white shadow-lg border-0 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <h2 className="font-bold text-gray-700">Examen {currentExamenIndex + 1}</h2>
            </div>
            {examenesCompletados[currentExamen.id] && <CheckCircle className="h-5 w-5 text-green-500" />}
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">{currentExamen.titulo}</h3>

          <div className="flex gap-2 mb-4">
            <Badge variant="outline" className="bg-gray-100">
              {currentExamen.categoria}
            </Badge>
            <Badge variant="outline" className={getNivelColor(currentExamen.nivel)}>
              {currentExamen.nivel.charAt(0).toUpperCase() + currentExamen.nivel.slice(1)}
            </Badge>
          </div>

          <p className="text-gray-600 mb-4">{currentExamen.descripcion}</p>

          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Pregunta {currentPreguntaIndex + 1} de {currentExamen.preguntas.length}
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={irPreguntaAnterior}
                disabled={currentPreguntaIndex === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={irSiguientePregunta}
                disabled={currentPreguntaIndex === currentExamen.preguntas.length - 1}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Progress
            value={((currentPreguntaIndex + 1) / currentExamen.preguntas.length) * 100}
            className="h-1 mb-6"
          />

          {/* Pregunta actual */}
          <div className="mb-6">
            <div className="bg-indigo-50 p-4 rounded-lg mb-4">
              <p className="font-medium text-gray-800">{currentPregunta.texto}</p>
            </div>

            <RadioGroup
              value={respuestasSeleccionadas[currentPregunta.id] || ""}
              onValueChange={(value) => seleccionarRespuesta(currentPregunta.id, value)}
              className="space-y-3"
            >
              {currentPregunta.opciones.map((opcion) => (
                <div
                  key={opcion.id}
                  className={`flex items-center space-x-2 border p-3 rounded-lg ${
                    mostrarRespuestas[currentPregunta.id]
                      ? esRespuestaCorrecta(currentPregunta.id, opcion.id)
                        ? "bg-green-50 border-green-200"
                        : respuestasSeleccionadas[currentPregunta.id] === opcion.id
                        ? "bg-red-50 border-red-200"
                        : "border-gray-200"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <RadioGroupItem
                    value={opcion.id}
                    id={`${currentPregunta.id}-${opcion.id}`}
                    disabled={mostrarRespuestas[currentPregunta.id]}
                  />
                  <Label
                    htmlFor={`${currentPregunta.id}-${opcion.id}`}
                    className="flex-grow cursor-pointer text-gray-700"
                  >
                    {opcion.texto}
                  </Label>
                  {mostrarRespuestas[currentPregunta.id] && (
                    <>
                      {esRespuestaCorrecta(currentPregunta.id, opcion.id) ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : respuestasSeleccionadas[currentPregunta.id] === opcion.id ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : null}
                    </>
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Botón para mostrar respuesta */}
          {respuestasSeleccionadas[currentPregunta.id] && !mostrarRespuestas[currentPregunta.id] && (
            <Button
              variant="outline"
              onClick={() => toggleMostrarRespuesta(currentPregunta.id)}
              className="w-full mb-4 border-dashed border-indigo-300 text-indigo-700 hover:bg-indigo-50"
            >
              Verificar respuesta
            </Button>
          )}

          {/* Justificación */}
          {mostrarRespuestas[currentPregunta.id] && (
            <div className="bg-amber-50 p-4 rounded-lg mb-4 border border-amber-200">
              <div className="flex items-start gap-2">
                <HelpCircle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-800 mb-1">Justificación:</p>
                  <p className="text-gray-700">{currentPregunta.justificacion}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navegación entre preguntas */}
          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              onClick={irPreguntaAnterior}
              disabled={currentPreguntaIndex === 0}
              className="flex-1 flex items-center justify-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            {currentPreguntaIndex === currentExamen.preguntas.length - 1 ? (
              <Button
                onClick={irSiguienteExamen}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={!todasPreguntasRespondidas()}
              >
                Siguiente examen
              </Button>
            ) : (
              <Button
                onClick={irSiguientePregunta}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1"
                disabled={!respuestasSeleccionadas[currentPregunta.id]}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>

        {/* Resumen del examen */}
        {todasPreguntasRespondidas() && (
          <Card className="p-6 mb-6 bg-white shadow-lg border-0 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-gray-800">Resumen del examen</h3>
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Preguntas correctas:</span>
              <span className="font-medium text-gray-800">
                {calcularPuntuacion().correctas} de {calcularPuntuacion().total}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Puntuación</span>
                <span>{calcularPuntuacion().porcentaje}%</span>
              </div>
              <Progress
                value={calcularPuntuacion().porcentaje}
                className="h-2"
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={irExamenAnterior} className="flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Examen anterior
              </Button>
              <Button onClick={irSiguienteExamen} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Siguiente examen
              </Button>
            </div>
          </Card>
        )}

        {/* Información adicional */}
        <p className="text-center text-xs text-gray-500">
          Responde todas las preguntas para completar el examen
        </p>
      </div>
    </div>
  )
}

export default ExamenPage
