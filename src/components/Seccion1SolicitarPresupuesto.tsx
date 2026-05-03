import '../style/Seccion1SolicitarPresupuesto.css'
import { Link } from 'react-router-dom'

function Seccion1SolicitarPresupuesto() {
  return (
    <>
      <section className="cta-section">
          <Link to="/ContactoPaginaPrincipal" className="cta-btn btn-contact">
              <span className="icon">📞</span>
              Contacto
          </Link>
          <Link to="/Catalogo" className="cta-btn btn-quote">
              <span className="icon">📖</span>
              Ver Catalogo
          </Link>
      </section>
    </>
  )
}
export default Seccion1SolicitarPresupuesto