import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import Dashboard from './pages/Dashboard';
import CreateBill from './pages/CreateBill';
import BillDetails from './pages/BillDetails';
import InvitePage from './pages/InvitePage';
import Welcome from './pages/Welcome';
import History from './pages/History';

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateBill />} />
          <Route path="/bill/:billId" element={<BillDetails />} />
          <Route path="/invite/:billId" element={<InvitePage />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
}

export default App;


