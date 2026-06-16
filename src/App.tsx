import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './splitview/Layout';
import Form from './pages/Form';
import Buttons from './pages/Buttons';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div className="p-4 text-gray-400">Select a page</div>} />
          <Route path="form/:id" element={<Form />} />
          <Route path="form" element={<Form />} />
          <Route path="buttons" element={<Buttons />} />
          <Route path="fullview" element={<div className="p-4 text-gray-400">Full view page</div>} />
          <Route path="*" element={<div className="p-4 text-gray-400">Page not found</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
