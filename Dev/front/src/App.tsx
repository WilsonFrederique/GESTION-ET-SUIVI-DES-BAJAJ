import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./auth/Login";

import Home from "./pages/PDG/Dashboard/DashboardIndex";
import Header from "./components/Header/Header";
import SidBar from "./components/SidBar/PDG/SidBar";

import ListeFinances from "./pages/PDG/Finances/ListeFinances";

import ListeFlotte from "./pages/PDG/Flotte/ListeFlotte";

import Rapports from "./pages/PDG/Rapports/Rapports";

import Administrations from "./pages/PDG/Administrations/Administrations";

import Utilisateurs from "./pages/PDG/Utilisateurs/Utilisateurs";
import FrmUtilisateurs from "./pages/PDG/Utilisateurs/FrmUtilisateurs";

import Notifications from "./pages/PDG/Notifications/Notifications";

const MyContext = createContext();

export default function App() {
  // Initialisation des états avec localStorage
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem('themeMode');
    return savedTheme !== null ? savedTheme === 'light' : true;
  });

  const [isOpenNav, setIsOpenNav] = useState(() => {
    try {
      const saved = localStorage.getItem('isOpenNav');
      return saved === "true"; // Assure que c’est bien un booléen
    } catch {
      return false;
    }
  });

  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isHideSidebarAndHeader, setIsHideSidebarAndHeader] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Gestion du thème
  useEffect(() => {
    const themeClass = themeMode ? 'light' : 'dark';
    const oppositeClass = themeMode ? 'dark' : 'light';
    
    document.body.classList.remove(oppositeClass);
    document.body.classList.add(themeClass);
    localStorage.setItem('themeMode', themeClass);
  }, [themeMode]);


  // Gestion du resize de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeNav = () => {
    setIsOpenNav(false);
    localStorage.setItem('isOpenNav', "false");
  };
  
  const openNav = () => {
    setIsOpenNav(true);
    localStorage.setItem('isOpenNav', "true");
  };
  
  const toggleNav = () => {
    setIsOpenNav(prev => {
      const newState = !prev;
      localStorage.setItem('isOpenNav', newState.toString());
      return newState;
    });
  };

  const toggleTheme = () => {
    setThemeMode(prev => !prev);
  };

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    isHideSidebarAndHeader,
    setIsHideSidebarAndHeader,
    themeMode,
    setThemeMode: toggleTheme,
    windowWidth,
    isOpenNav,
    setIsOpenNav,
    toggleNav,
    openNav,
    closeNav
  };

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        <Routes>
          {/* Route pour la page connexion sans header et sidebar */}
          {/* <Route path="/" element={<Login />} /> */}
          
          {/* Routes avec layout admin (header et sidebar) */}
          <Route path="/*" element={
            <>
              {isHideSidebarAndHeader !== true && <Header />}

              <div className="main d-flex">
                {isHideSidebarAndHeader !== true && (
                  <>
                    <div 
                      className={`sidebarOverlay d-none ${isOpenNav && 'show'}`} 
                      onClick={closeNav}
                    />
                    <div 
                      className={`sidebarWrapper ${isToggleSidebar ? "toggle" : ""} ${isOpenNav ? 'open' : ''}`}
                    >
                      <SidBar />
                    </div>
                  </>
                )}

                <div className={`content ${isHideSidebarAndHeader && 'full'} ${isToggleSidebar && "toggle"}`}>
                  <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/finances" element={<ListeFinances />} />

                    <Route path="/listeFlotte" element={<ListeFlotte />} />

                    <Route path="/rapports" element={<Rapports />} />

                    <Route path="/administrations" element={<Administrations />} />

                    <Route path="/utilisateurs" element={<Utilisateurs />} />
                    <Route path="/frmUtilisateurs" element={<FrmUtilisateurs />} />
                    <Route path="/utilisateur/:id" element={<FrmUtilisateurs />} />

                    <Route path="/notifications" element={<Notifications />} />
                  </Routes>
                </div>
              </div>
            </>
          } />
        </Routes>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export { MyContext };