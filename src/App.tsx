import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './pages/Layout';
import Register from './pages/Register';
import Awards from './pages/Awards';
import DeliveryRequests from './pages/DeliveryRequests';
import Admins from './pages/Admins';
import Employees from './pages/Employees';
import Freelancers from './pages/Freelancers';
import Teams from './pages/Teams';
import Requests from './pages/Requests';
import FreelancerHours from './pages/FreelancerHours';
import Vehicles from './pages/Vehicles';

function App() {

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/cadastrar" element={<Register />} />
          <Route path="/pedidos-mudanca" element={<DeliveryRequests />} />
          <Route path="/premiacoes" element={<Awards />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/funcionarios" element={<Employees />} />
          <Route path="/autonomos" element={<Freelancers />} />
          <Route path="/equipes" element={<Teams />} />
          <Route path="/pedidos" element={<Requests />} />
          <Route path="/horas" element={<FreelancerHours />} />
          <Route path="/veiculos" element={<Vehicles />} />
        </Route>
      </Routes>
    </>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default App
