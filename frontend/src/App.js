import logo from './logo.svg';
import './App.css';
// import Header from './components/header';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './components/Usermanagement/Register'
import RegisterQuestionAnswer from './components/Usermanagement/RegisterQuestionAnswer';
import LoginQuestionAnswer from './components/Usermanagement/LoginQuestionAnswer'
import Login from './components/Usermanagement/Login'
import Cipher from './components/Usermanagement/Cipher';
import InputCipher from './components/Usermanagement/InputCipher';

function App() {
  return (
    <div className='App'>
    <Router>
            <Routes>
                <Route exact path="/LoginQuestionAnswer" element={<LoginQuestionAnswer />} />
                <Route exact path="/RegisterQuestionAnswer" element={<RegisterQuestionAnswer />} />
                <Route exact path="/Login" element={<Login />} />
                <Route exact path="/Register" element={<Register />} />
                <Route exact path="/Cipher" element={<Cipher />} />
                <Route exact path="/InputCipher" element={<InputCipher />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
