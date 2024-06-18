import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Stacer from './Stacer'
import Simulation from './Simulation'
import {Routes,Route,BrowserRouter} from "react-router-dom"


function App() {


  return (
   <>
   {/* <Stacer></Stacer> */}

   <BrowserRouter>
   <Routes>
<Route path='/' element={<Stacer></Stacer>}></Route>
<Route path='/simulation' element={<Simulation></Simulation>}></Route>
   </Routes>
   </BrowserRouter>

   </>
  )
}

export default App
