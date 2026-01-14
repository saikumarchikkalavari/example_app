import React from 'react';
import './App.css';
import NavTabs from './components/NavTabs';
import { Routes, Route, Navigate } from 'react-router-dom';
import TablePage1 from './pages/TablePage1';
import TablePage2 from './pages/TablePage2';
import TablePage3 from './pages/TablePage3';

function App() {
  return (
    <div className="App">
      <NavTabs />
      <Routes>
        <Route path="/" element={<Navigate to="/table1" replace />} />
        <Route path="/table1" element={<TablePage1 />} />
        <Route path="/table2" element={<TablePage2 />} />
        <Route path="/table3" element={<TablePage3 />} />
      </Routes>
    </div>
  );
}

export default App;
