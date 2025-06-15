import './App.css'
import { css } from 'styled-system/css';
import WeightLearningExperiment from "src/components/WeightLearningExperiment.tsx";

function App() {

  return (
      <>
        <WeightLearningExperiment />
        <div className={css({ fontSize: "2xl", fontWeight: 'bold' })}>Hello 🐼!</div>
      </>
  )
}

export default App
