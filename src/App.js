import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Newspaper from "./Newspaper";
import Newspapers from "./Newspapers";
import './App.css'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/n" element={<Newspapers />} />
                <Route path="/n/:newspaper" element={<Newspaper />} />
                <Route path="/n/:newspaper/:category" element={<Newspaper />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
