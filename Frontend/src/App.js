
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import AppLayout from "./Components/AppLayout";
import ProtectedRoute from "./Components/ProtectedRoute";
import Sample from "./Sample";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sample" element={<Sample />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />

            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
