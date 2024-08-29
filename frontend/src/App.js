import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserContextProvider from './context/userContext';

import LogInPage from './pages/LogInPage';
import HomeChatPage from "./pages/HomeChatPage";
import TopNavBar from './components/TopNavBar';
import CreateAccountPage from './pages/CreateAccountPage';
import CreditsPage from './pages/Credits';

import "./css/main.css";
import mhm from "./util/mobileHeightManager.js";

mhm();

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TopNavBar />}>
            <Route index element={<LogInPage />} />
            <Route path="/home" element={<HomeChatPage />} />
            <Route path="/createAccount" element={<CreateAccountPage />} />
            <Route path="/credits" element={<CreditsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
