import '../style/HeroSesionPrincipal.css'
import { Link } from 'react-router-dom';

function HeroSesionPrincipal() {
    return(
        <section className="hero-section">
            <div className="hero-background"></div>
            <div className="hero-overlay"></div>
            
            <div className="hero-content">
                <h1 className="hero-title">Bienvenido a</h1>
                <h2 className="hero-brand">Distribuidora <span className="hero-brand-title">M.H.V</span></h2>
                <p className="hero-description">
                    Distribución y venta al público de artículos de ferretería
                </p>
                
                <div className="hero-buttons">
                    <Link to="/Catalogo" className="btn btn-primary">
                        <span className="btn-icon">📖</span>
                        Ver Catálogo
                    </Link>
                    <Link to="/ConocerMas" className="btn btn-secondary">
                        Conocer Más
                    </Link>
                </div>
            </div>
        </section>

    )
}

export default HeroSesionPrincipal
