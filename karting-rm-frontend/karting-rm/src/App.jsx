import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home.jsx'
import TarifasCliente from './pages/TarifasCliente.jsx'
import Tarifas from './pages/Tarifas.jsx'
import Usuarios from './pages/Usuarios.jsx'
import Resevas1 from './pages/ReservaPage.jsx'
import ResevasAdmin from './pages/ReservaAdmin.jsx'
import EventRack from './pages/EventRack.jsx';
import VerificarUsuarios from './pages/VerificarUsuarios.jsx';
import Reportes from './pages/Reportes.jsx';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fees" element={<Tarifas />} />
          <Route path="/customerfees" element={<TarifasCliente />} />
          <Route path="/users" element={<Usuarios />} />
          <Route path="/createReserva1" element={<Resevas1 />} />
          <Route path="/adminReserva" element={<ResevasAdmin />} />
          <Route path="/rack" element={<EventRack />} />
          <Route path="/checkUsers" element={<VerificarUsuarios />} />
          <Route path="/Reportes" element={<Reportes />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
