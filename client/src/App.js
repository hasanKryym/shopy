import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserStatus } from "./context/User/UserContext";
import Home from "./pages/Home/Home";
import Login from "./pages/Login-register/Login";
import Register from "./pages/Login-register/Register";
import Profile from "./pages/Profile/Profile";
import Products from "./pages/Products/Products";
import Cart from "./pages/cart/Cart";
import { CartProvider } from "./context/Cart/CartContext";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Contact from "./pages/Contact/Contact";

function App() {
  return (
    <>
      <UserStatus>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/products/:recommendedFor" element={<Products />} />
              <Route path="/products" element={<Products />} />
              <Route
                path="/products/details/:id"
                element={<ProductDetails />}
              />
              <Route path="/cart" element={<Cart />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Router>
          <ToastContainer />
          {/* <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <ToastContainer /> */}
        </CartProvider>
      </UserStatus>
    </>
  );
}

export default App;
