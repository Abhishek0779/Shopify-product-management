import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProductPage from "./pages/ProductPage";
import AddProductPage from "./pages/AddProductPage";

export default function App() {
    return (
        <BrowserRouter>
            {/* The Routes component is used to define different routes for different pages */}
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="Login" element={<LoginPage />} />
                <Route path="Signup" element={<SignupPage />} />
                <Route path="product/:id" element={<ProductPage />} />
                <Route path="product/add" element={<AddProductPage />} />
            </Routes>
        </BrowserRouter>
    );
}
