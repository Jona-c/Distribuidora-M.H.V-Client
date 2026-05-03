import { Link } from 'react-router-dom'
import '../style/Seccion1ContactoPaginaPrincipal.css'

const Seccion1ContactoPaginaPrincipal = () => {
  return (
    <div className="seccion1-contacto">
      <div className="contacto-container">
        <div className="contacto-layout">
          {/* Aside izquierdo */}
          <aside className="contacto-aside">
            <Link to="/Catalogo" className="aside-btn catalogo-btn">
              <span className="btn-icon">📦</span>
              Ver Catálogo
            </Link>
            <Link to="/SolicitarPresupuesto" className="aside-btn presupuesto-btn">
              <span className="btn-icon">📋</span>
              Solicitar Presupuesto
            </Link>
          </aside>

          {/* Contenido derecho */}
          <div className="contacto-derecha">
            {/* Títulos y información de contacto */}
            <div className="info-blocks">
              <div className="info-block">
                <h2 className="info-titulo">Información del Contacto</h2>
                <div className="info-item">
                  <span className="info-icon">📞</span>
                  <span className="info-texto">+54 ______________</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">✉️</span>
                  <span className="info-texto">Mhv.distribuidora@yahoo.com</span>
                </div>
              </div>
              <div className="info-block">
                <h2 className="info-titulo">Dirección y Horarios</h2>
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <span className="info-texto">Av. Echeverria 421, Chivilvoy</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">🕐</span>
                  <span className="info-texto">Lun - Vie: 8:00 a 12:00 y 14:30 a 19:00</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">🕐</span>
                  <span className="info-texto">Sáb: 8:00 a 12:30 y 15:00 a 19:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa de ubicación - separado para ocupar todo el ancho */}
        <div className="mapa-seccion">
          <div className="mapa-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.016887886509!2d-58.38156542479145!3d-34.60373887295756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4aa9f0d6d1e0d1b%3A0x1c1b0d0d1e0d1e0d!2sBuenos%20Aires%2C%20CABA!5e0!3m2!1ses!2sar!4v1700000000000!5m2!1ses!2sar"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación del negocio"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Seccion1ContactoPaginaPrincipal
