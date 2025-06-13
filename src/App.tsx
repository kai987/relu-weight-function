import { useState } from 'react'
import './App.css'
import { css } from 'styled-system/css';
import WeightLearningExperiment from "src/components/WeightLearningExperiment.tsx";

function App() {
  const [count, setCount] = useState(0)

  return (
      <>
        <WeightLearningExperiment />
        <div className={css({ fontSize: "2xl", fontWeight: 'bold' })}>Hello 🐼!</div>
      </>
  )
}

export default App
