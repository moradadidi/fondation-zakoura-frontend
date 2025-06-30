
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import './App.css'
import PartnersList from './pages/PartnersList';


function App() {
  

  return (
   // ...existing code...
<Routes>
  <Route path='/' element={<MainLayout />}>
    <Route index element={<div />} /> {/* Or your home page */}
    <Route path='partenariat/partenaires' element={<PartnersList />} />
  </Route>
</Routes>
  )
}

export default App
