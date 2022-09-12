import "./App.css";
import PrivateRoute from "./context/PrivateRoute";
import PublicRoute from "./context/PublicRoute";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import { RiCloudOffLine } from 'react-icons/ri'
import Login from "./pages/Login";
import LoadingScreen from "./pages/components/LoadingScreen";
import Account from "./pages/Account";
import FarmerHome from "./pages/farmer/FarmerHome";
import Schemes from "./pages/farmer/Schemes";
import Cart from "./pages/farmer/Cart";
import SearchResult from "./pages/farmer/SearchResult";
import Predict from "./pages/farmer/Predict";
import Product from "./pages/farmer/Product";
import MarketPrice from "./pages/farmer/MarketPrice";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import en from "./translations/en";
import kn from "./translations/kn";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    kn: { translation: kn },
  },
  lng: "en",
  fallbacklng: "en",
  interpolation: { escapeValue: false },
});

function App() {
  const [status, setStatus] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    var userLang = localStorage.getItem("lang");
    i18n.changeLanguage(userLang);

    window.addEventListener("online", () => setStatus(true));
    window.addEventListener("offline", () => setStatus(false));
  }, []);
  
  return (
    <div className="App">
      {status ? (
        <div>
          <ToastContainer
            position="top-center"
            autoClose={2500}
            theme="dark"
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <Router>
          <AuthProvider>
            <LoadingScreen />
            <Routes>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
              <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>}/>
              <Route path="/product/:id" element={<PrivateRoute><Product /></PrivateRoute>}/>
              <Route path="/marketPrice" element={<PrivateRoute><MarketPrice /></PrivateRoute>}/>
              <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>}/>
              <Route path="/search" element={<PrivateRoute><SearchResult /></PrivateRoute>}/>
              <Route path="/predict" element={<PrivateRoute><Predict /></PrivateRoute>}/>
              <Route path="/info" element={<PrivateRoute><Schemes /></PrivateRoute>}/>
              {/* <Route path="/payment" element={<PrivateRoute><StripeContainer /></PrivateRoute>}/> */}
              <Route path="/" element={<PrivateRoute><FarmerHome /></PrivateRoute>}/>
            </Routes>
          </AuthProvider>
          </Router>
        </div>
      ) : (
        <div className="offline"><RiCloudOffLine size="5em"/><p>{t("No Internet Connection.")}</p></div>
      )}
    </div>
  );
}

export default App;
