'use client'
import { useState } from 'react'
import { SerieEntrenamiento } from '@/types'

interface LogFormProps {
  onAddSerie: (serie: Partial<SerieEntrenamiento>) => Promise<void>;
}

export default function LogForm({ onAddSerie }: LogFormProps) {
  const [peso, setPeso] = useState<number>(23)
  const [reps, setReps] = useState<number>(12)
  const [comentario, setComentario] = useState<string>('')

  const handleSubmit = async () => {
    await onAddSerie({ peso, reps, comentario })
    setComentario('') // Limpiamos el comentario después de guardar
  }

  return (
    <div className="space-y-4 mb-8">
      <div className="flex gap-4">
        {/* Input de Peso */}
        <div className="flex-1 bg-gray-900 rounded-xl p-3 border border-gray-800 text-center">
          <p className="text-[10px] uppercase text-gray-500 font-bold">Kilogramos</p>
          <input type="number" value={peso} onChange={(e) => setPeso(Number(e.target.value))} className="bg-transparent w-full text-center text-2xl font-bold focus:outline-none" />
        </div>
        
        {/* Input de Reps */}
        <div className="flex-1 bg-gray-900 rounded-xl p-3 border border-gray-800 text-center">
          <p className="text-[10px] uppercase text-gray-500 font-bold">Repeticiones</p>
          <input type="number" value={reps} onChange={(e) => setReps(Number(e.target.value))} className="bg-transparent w-full text-center text-2xl font-bold focus:outline-none" />
        </div>

        <button onClick={handleSubmit} className="bg-green-600 px-8 rounded-xl text-4xl font-light">+</button>
      </div>

      {/* Input de Comentario */}
      <input 
        type="text"
        placeholder="Agregar comentario a esta serie..."
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        className="w-full bg-transparent border-b border-gray-800 py-2 text-sm text-green-400 focus:outline-none placeholder:text-gray-600"
      />
    </div>
  )
}