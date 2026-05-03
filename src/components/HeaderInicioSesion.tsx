import '../style/HeaderInicioSesion.css'
import LogoDistribuidora from '../assets/logo-distribuidora.png'

const HeaderInicioSesion = () => {
  return (
    <>
        <header className="header">
            <a href="/" className="logo-link">
                <div className="logo-section">
                    <img src={LogoDistribuidora} alt="Distribuidora M.H.V" className="logo-image"/>
                </div>
            </a>

                <div className="search-section">
                    <span className="search-icon">🔍</span>
                    <input type="text" className="search-input" placeholder="Buscar productos..."/>
                </div>

            <div className="auth-buttons">
                    <a href="/Registrarse">
                        <button className="btn-register">Registrarse</button>
                    </a>
                    <a href="/InicioSesion">
                        <button className="btn-login">Iniciar Sesión</button>
                    </a>    
                </div>
        </header>
    </>
  )
}

export default HeaderInicioSesion