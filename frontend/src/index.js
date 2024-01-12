import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ChakraProvider } from '@chakra-ui/react'
import Routes from './routes';
import reportWebVitals from './reportWebVitals';
import Footer from './components/Footer';
import NavBar from './components/Navbar';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  // rendering the ChakraProvider component which wraps around the entire application
  <ChakraProvider >
     {/* rendering the command component */}
    <NavBar />
    <Routes />
    <Footer />
  </ChakraProvider>
);

reportWebVitals();
