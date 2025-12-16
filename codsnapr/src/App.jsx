import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Editor from './Editor';
import About from './About';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default App;