import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
                    <RoutesComponent/>
        </BrowserRouter>
    );
}

function RoutesComponent() {
    return (
        <Routes>
        </Routes>
    );
}

export default App;