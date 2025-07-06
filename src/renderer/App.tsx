import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './css/App.css';
import Menu from './components/Menu';
import Login from "./pages/Login";
import Chamados from './pages/Chamados';
import Maquinas from './pages/Maquinas';
import { UserProvider } from "./components/UserContext";

function Dashboard() {
  return (
    <>
      <Menu />
      <div className='dash'>

        <div style={{ width: '100%', height: 'calc(83vh - 0px)' }}>
          <webview
            src="https://app.powerbi.com/reportEmbed?reportId=aa3d1a68-8e8d-4e91-ba50-ffd280eae4cf&autoAuth=true&ctid=7aac3b2d-b64e-4b86-9902-e611a0d12ca5"
            style={{ width: "100%", height: "100%" }}
            allowpopups={true}
          />
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/chamados" element={<Chamados />} />
          <Route path="/maquinas" element={<Maquinas />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}
