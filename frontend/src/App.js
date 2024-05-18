import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LogIn from "./pages/LogIn";
import TopNavBar from './components/TopNavBar';
import CreateAccountPage from './pages/CreateAccountPage';

import "./css/main.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TopNavBar />}>
          <Route index element={<LogIn />} />
          <Route path="/createAccount" element={<CreateAccountPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
