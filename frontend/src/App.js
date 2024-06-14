import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserContextProvider from './context/userContext';

import LogInPage from './pages/LogInPage';
import HomeChatPage from "./pages/HomeChatPage";
import TopNavBar from './components/TopNavBar';
import CreateAccountPage from './pages/CreateAccountPage';

import "./css/main.css";

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TopNavBar />}>
            <Route index element={<LogInPage />} />
            <Route path="/home" element={<HomeChatPage />} />
            <Route path="/createAccount" element={<CreateAccountPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
