import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState("encurtar")

  return (
    <>
      <header className="header">
        <div className="header-content">
          <span className="header-logo">Encurta</span>

          <nav className="header-nav">
            <button
              type="button"
              className={`header-nav-item ${activeTab === 'encurtar' ? 'header-nav-item--active' : ''}`}
              onClick={() => setActiveTab('encurtar')}
            >
              Encurtar
            </button>

            <button
              type="button"
              className={`header-nav-item ${activeTab === 'meus-links' ? 'header-nav-item--active' : ''}`}
              onClick={() => setActiveTab('meus-links')}
            >
              meus links
            </button>
          </nav>
        </div >
      </header >

      <main className="main-content">
      <Outlet />
      </main>
    </>
  )
}

export default App
