
import { useState } from 'react'
import '../style/HeaderCuentaCorrienteAdmin.css'
import LogoDistribuidora from '../assets/logo-distribuidora.png' 
import { useContext } from "react"
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from "../context/AuthContext.tsx"

const HeaderCuentaCorrienteAdmin = ({ onBuscar }: { onBuscar?: (termino: string) => void }) => {
const { user, logout } = useContext(AuthContext);
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const navigate = useNavigate();
  return (
    <>
         <header className="main-header">
        <div className="header-top">
            <a href="/PaginaAdmin" className="logo-link">
        <div className="logo-section">
            <img src={LogoDistribuidora} alt="Distribuidora M.H.V" className="logo-image"/>
        </div>
            </a>

            <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input type="text" className="search-input" placeholder="Buscar productos..." onChange={(e) => onBuscar?.(e.target.value)}/>
            </div>

            <div className="user-actions">
                <div className={`user-name ${isPanelOpen ? 'open' : ''}`} onClick={() => setIsPanelOpen(prev => !prev)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsPanelOpen(prev => !prev); }}>
                    <span>👤</span>
                    <span className="user-name-text">{user ? user.nombre + ' ' + user.apellido : 'Invitado'}</span>
                    <span className={`caret ${isPanelOpen ? 'up' : 'down'}`}>▾</span>
                </div>

                <div className={`user-panel ${isPanelOpen ? 'open' : ''}`}>
                    <button className="user-panel-btn" onClick={() => { navigate('/InformacionAdmin'); setIsPanelOpen(false); }}>Información del Administrador</button>
                    <button className="user-panel-btn logout" onClick={logout}>Cerrar Sesion</button>
                </div>
            </div>
        </div>

        <nav className="nav-menu">
            <Link to="/TotalPedidosAdmin" className="nav-item">
                <span className="nav-icon">📋</span>
                Pedidos
            </Link>
            <Link to="/CuentaCorrienteAdmin" className="nav-item">
                <span className="nav-icon">💳</span>
                Cuenta Corriente
            </Link>
            <Link to="/PaginaAdmin" className="nav-item">
                <span className="nav-icon">📖</span>
                Catálogo
            </Link>
            <Link to="/UltimosPedidos" className="nav-item">
                <span className="nav-icon">📝</span>
                Ultimos Pedidos
            </Link>
        </nav>
    </header>

    </>
  )
}


export default HeaderCuentaCorrienteAdmin