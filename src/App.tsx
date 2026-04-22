import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './splitview/Layout';
import Chatbot from './pages/Chatbot';
import MarkdownPage from './pages/MarkdownPage';
import SafetyDataSheets from './pages/SafetyDataSheets';
import Form from './pages/Form';
import Sections from './pages/Sections';

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div className="p-4 text-gray-400">Select a page</div>} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="markdown" element={<MarkdownPage />} />
          <Route path="sections" element={<Sections />} />
          <Route path="safety" element={<SafetyDataSheets />} />
          <Route path="form/:id" element={<Form />} />
          <Route path="form" element={<Form />} />
          <Route path="*" element={<div className="p-4 text-gray-400">Page not found</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;