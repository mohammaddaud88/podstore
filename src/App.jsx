import { useState } from 'react'
import './App.css'
import Home from './components/Home.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <Home />
        </div>
      </div>
    </div>
  )
}

export default App
