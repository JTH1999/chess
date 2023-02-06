import "./App.css";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Redirect,
} from "react-router-dom";

import Home from "./Pages/Home";
import PlayOnline from "./Pages/PlayOnline";
import VsComputer from "./Pages/VsComputer";
import LocalMatch from "./Pages/LocalMatch";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/local-match" element={<LocalMatch />} />
                    <Route path="/vs-computer" element={<VsComputer />} />
                    <Route path="/play-online" element={<PlayOnline />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
