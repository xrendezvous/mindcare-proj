import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CreateAccount from "./pages/CreateAccount";
import AllTherapistsPage from "./pages/AllTherapistsPage";
import UserPage from "./pages/UserPage";
import TherUserPage from "./pages/TherUserPage";

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
            {/*<Route path="/login" element={<LoginPage/>}/>*/}
            <Route path="/forgot-password" element={<ResetPasswordPage/>}/>
            <Route path="/create-account" element={<CreateAccount/>}/>
            <Route path="/all-therapists" element={<AllTherapistsPage/>}/>
            <Route path="/my-account/:id" element={<UserPage/>}/>
            <Route path="/my-doc-account/:id" element={<TherUserPage/>}/>
            {/*<Route path="/" element={<Navigate to="/login"/>}/>*/}
        </Routes>
    );
}

export default App;