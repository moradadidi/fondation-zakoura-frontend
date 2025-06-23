
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import './App.css'


function App() {
  

  return (
    <Routes >
        <Route path='/' element={<MainLayout />} >
            
        </Route>
    </Routes>
  )
}

export default App
