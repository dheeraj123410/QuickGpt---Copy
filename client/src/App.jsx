
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatBox from "./components/ChatBox";
import Community from "./pages/Community";
import Credits from "./pages/Credits";
import { Routes, Route, useLocation } from "react-router-dom";
import { assets } from "./assets/assets";
import './assets/prism.css' 
import Loading from "./pages/Loading";
import { useAppContext } from "./context/AppContext";
import Login from "./pages/Login";

const App = () => {
  const {user} = useAppContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {pathname} = useLocation()
  if(pathname==='/loading') return <Loading/>
  

  return (
    <>
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          alt="menu"
          className="absolute top-3 left-3 w-8 cursor-pointer md:hidden not-dark:invert"
          onClick={() => setIsMenuOpen(true)}
        />
      )}
      {user ? (
         <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
        <div className="flex h-screen w-screen">
          <Sidebar
            isMenuOpen={isMenuOpen}
            setMenuOpen={setIsMenuOpen}
          />

          <Routes>
            <Route path="/" element={<ChatBox />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </div>
      </div>
      ) : (
        <div className="bg-gradient-to-b from -[#242124] to-[#000000] flex items-center justify-center h-screen w-screen"> <Login/>  </div>
      )}

     
    </>
  );
};

export default App;


/*import React from 'react'
import Sidebar from './components/Sidebar'
import ChatBox from './components/ChatBox'
import Community from './pages/Community'
import { Routes, Route } from "react-router-dom";
import Credits from './pages/Credits'

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <>
    {!isMenuOpen && <img src ={assets.menu_icon} className='absolute top-3 left-3 w-8 cursor-pointer md:hidden not-dark:invert  ' onClick={()=>{
      setIsMenuOpen(true)
    }} />}
   
   <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>
      <div className='flex h-screen w-screen'>
            <Sidebar isMenuOpen={isMenuOpen} setMenuOpen={setIsMenuOpen} />
           
    <Routes>
      <Route path='/' element={<ChatBox/>}  />
            <Route path='/credits' element={<Credits/>}  />
      <Route path='/community' element={<Community/>}  /> 


    </Routes>

      </div>

    </div>

      
    </>
  )
}

export default App

*/