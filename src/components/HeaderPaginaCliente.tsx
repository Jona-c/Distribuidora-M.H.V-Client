import { useState } from 'react'
import '../style/HeaderPaginaCliente.css'
import LogoDistribuidora from '../assets/logo-distribuidora.png' 
import { useContext } from "react"
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from "../context/AuthContext.tsx"
import { useCarrito } from '../context/CarritoContext'

const HeaderPaginaCliente = ({ onBuscar }: { onBuscar?: (termino: string) => void }) => {
const { user, logout } = useContext(AuthContext);
const { totalItems } = useCarrito();
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const navigate = useNavigate();
  return (
    <>
         <header className="main-header">
        <div className="header-top">
            <a href="/PaginaCliente" className="logo-link">
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
                    <button className="user-panel-btn" onClick={() => { navigate('/InformacionCliente'); setIsPanelOpen(false); }}>Información del cliente</button>
                    <button className="user-panel-btn logout" onClick={logout}>Cerrar Sesion</button>
                </div>

                <button className="cart-button" aria-label="Carrito de compras" onClick={() => navigate('/Carrito')}>
                    🛒
                    {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                </button>
            </div>
        </div>

        <nav className="nav-menu">
            <Link to="/TotalPedidosCliente" className="nav-item">
                <span className="nav-icon">📋</span>
                Pedidos
            </Link>
            <Link to="/CuentaCorrienteCliente" className="nav-item">
                <span className="nav-icon">💳</span>
                Cuenta Corriente
            </Link>
            <Link to="/PaginaCliente" className="nav-item">
                <span className="nav-icon">📖</span>
                Catálogo
            </Link>
            <Link to="/Contacto" className="nav-item">
                <span className="nav-icon">💬</span>
                Contacto
            </Link>
        </nav>
    </header>

    </>
  )
}

export default HeaderPaginaCliente