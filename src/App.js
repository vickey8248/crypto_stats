import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { BrowserRouter,  Route,  Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;