import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import '@fontsource/chakra-petch/latin-500.css';
import '@fontsource/chakra-petch/latin-600.css';
import '@fontsource/chakra-petch/latin-700.css';
import '@fontsource-variable/dm-sans/opsz.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import '@fontsource/jetbrains-mono/latin-700.css';
import './styles.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
