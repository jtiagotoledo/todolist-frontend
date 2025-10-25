import './App.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {

  const [textTarefa, setTextTarefa] = useState('')
  const [tarefas, setTarefas] = useState([])

  useEffect(() => {
    async function carregarTarefas() {
      try {
        const resposta = await axios.get('http://localhost:3000/tarefas')
        console.log(resposta.data);
        
        setTarefas(resposta.data) // backend deve retornar um array de tarefas
      } catch (erro) {
        console.error('Erro ao carregar tarefas:', erro)
      }
    }

    carregarTarefas()
  }, [])

  async function addTarefa() {
    if (textTarefa.trim() === '') return 

    try {
      const resposta = await axios.post('http://localhost:3000/tarefas', {
        titulo: textTarefa,
        concluida: false
      })
      console.log('resposta', resposta);
      
      setTarefas([...tarefas, resposta.data.dados]) // adiciona a nova tarefa vinda do backend
      setTextTarefa('')
    } catch (erro) {
      console.error('Erro ao adicionar tarefa:', erro)
    }
  }

  async function toggleConcluida(index) {
  const tarefa = tarefas[index]
  const novasTarefas = [...tarefas]
  novasTarefas[index].concluida = !tarefa.concluida
  setTarefas(novasTarefas)

  try {
    await axios.put(`http://localhost:3000/tarefas/${tarefa._id}`, {
      concluida: novasTarefas[index].concluida
    })
    console.log('Tarefa atualizada no backend!')
  } catch (erro) {
    console.error('Erro ao atualizar tarefa no backend:', erro)
  }
}

  return (
    <div className='container'>
      <h1>Todo List da Elaine</h1>
      <br></br>
      <div className="input-area">
        <input
          type="text"
          placeholder="Digite uma tarefa..."
          value={textTarefa}
          onChange={(e) => setTextTarefa(e.target.value)}
        />
        <button onClick={addTarefa}>Adicionar</button>
        <ul>
        {tarefas.map((tarefa, index) => (
          <li key={index}>
            <input 
              type="checkbox" 
              checked={tarefa.concluida}
              onChange={() => toggleConcluida(index)}
            />
            <span className={tarefa.concluida ? 'concluida' : ''}>
              {tarefa.titulo}
            </span>
          </li>
        ))}
      </ul>
      </div>
    </div>
  )
}

export default App
