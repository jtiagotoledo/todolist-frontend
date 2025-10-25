import './App.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [textTarefa, setTextTarefa] = useState('')
  const [tarefas, setTarefas] = useState([])

  // Carregar tarefas ao iniciar o app
  useEffect(() => {
    async function carregarTarefas() {
      try {
        const resposta = await axios.get('http://192.168.15.7:3000/tarefas')
        setTarefas(resposta.data) // assume que backend retorna array de tarefas
      } catch (erro) {
        console.error('Erro ao carregar tarefas:', erro)
      }
    }
    carregarTarefas()
  }, [])

  async function addTarefa() {
  if (textTarefa.trim() === '') return

  try {
    const resposta = await axios.post('http://192.168.15.7:3000/tarefas', {
      titulo: textTarefa,
      concluida: false  
    })
    setTarefas([...tarefas, resposta.data])
    setTextTarefa('')
  } catch (erro) {
    console.error('Erro ao adicionar tarefa:', erro)
  }
}

  async function toggleConcluida(id) {
    try {
      const resposta = await axios.put(`http://192.168.15.7:3000/tarefas/${id}/toggle`);
      const tarefaAtualizada = resposta.data;
      setTarefas(tarefas.map(t => t._id === id ? tarefaAtualizada : t));
    } catch (erro) {
      console.error('Erro ao alternar tarefa:', erro);
    }
  }

  async function deleteTarefa(id) {
    try {
      await axios.delete(`http://192.168.15.7:3000/tarefas/${id}`)
      setTarefas(tarefas.filter(t => t._id !== id))
    } catch (erro) {
      console.error('Erro ao excluir tarefa:', erro)
    }
  }

  return (
    <div className='container'>
      <h1>Todo List</h1>
      <div className="input-area">
        <input
          type="text"
          placeholder="Digite uma tarefa..."
          value={textTarefa}
          onChange={(e) => setTextTarefa(e.target.value)}
        />
        <button onClick={addTarefa}>Adicionar</button>
      </div>

      <ul>
        {tarefas.map((tarefa) => (
          <li key={tarefa._id}>
            <input
              type="checkbox"
              checked={tarefa.concluida}
              onChange={() => toggleConcluida(tarefa._id)}
            />
            <span className={tarefa.concluida ? 'concluida' : ''}>
              {tarefa.titulo}
            </span>
            <button
              className="delete-btn"
              onClick={() => deleteTarefa(tarefa._id)}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
