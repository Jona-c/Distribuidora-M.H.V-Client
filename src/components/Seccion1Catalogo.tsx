import '../style/Seccion1Catalogo.css'
import { Link } from 'react-router-dom'

function Seccion1Catalogo() {
  return (
    <>
      <section className="cta-section">
          <Link to="/ContactoPaginaPrincipal" className="cta-btn btn-contact">
              <span className="icon">📞</span>
              Contacto
          </Link>
          <Link to="/SolicitarPresupuesto" className="cta-btn btn-quote">
              <span className="icon">📄</span>
              Solicitar Presupuesto
          </Link>
      </section>
    </>
  )
}
export default Seccion1Catalogo