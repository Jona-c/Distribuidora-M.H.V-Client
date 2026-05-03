import '../style/FooterPrincipal.css'
import lusqtoff from '../assets/lusqtoff.png'
import blackdecker from '../assets/black&decker.png'
import crossmaster from '../assets/crossmaster.png'
import wembley from '../assets/wembley.png'
import trecem from '../assets/3m.png'
import bremen from '../assets/bremen.png'
import bosch from '../assets/bosch.png'
import dewalt from '../assets/dewalt.png'


function FooterPrincipal() {
  return (
    <>
      <section className="brands-section">
        <h2 className="brands-title">Marcas de Confianza</h2>
        
        <div className="brands-container">
            <div className="brands-track">
                 {/* Primeras 8 marcas */}
                <div className="brand-card">
                    <img src={lusqtoff} alt="lusqtoff" className="brand-logo"/>
                </div>
                <div className="brand-card">
                    <img src={blackdecker} alt="blackdecker" className="brand-logo"/>
                </div>
                <div className="brand-card">
                    <img src={crossmaster} alt="crossmaster" className="brand-logo"/>
                </div>
                <div className="brand-card">
                    <img src={wembley} alt="wembley" className="brand-logo"/>
                </div>
                <div className="brand-card">
                    <img src={trecem} alt="3m" className="brand-logo"/>
                </div>
                <div className="brand-card">
                <img src={bremen} alt="bremen" className="brand-logo"/>
                </div>
                <div className="brand-card">
                    <img src={bosch} alt="bosch" className="brand-logo"/>
                </div>
                <div className="brand-card">
                    <img src={dewalt} alt="dewalt" className="brand-logo"/>
                </div>
                
                {/* Segundo set de marcas (duplicado para efecto de carrusel) */}
               <div className="brand-card">
                    <img src={lusqtoff} alt="lusqtoff" className="brand-logo"/>
                </div>
                <div className="brand-card">
                    <img src={blackdecker} alt="blackdecker" className="brand-logo"/>
                </div>
                <div className="brand-card">
                    <img src={crossmaster} alt="crossmaster" className="brand-logo"/>
                </div>
                <div className="brand-card">
                    <img src={wembley} alt="wembley" className="brand-logo"/>
                </div>
                <div className="brand-card">
                    <img src={trecem} alt="3m" className="brand-logo"/>
                </div>
                <div className="brand-card">
                <img src={bremen} alt="bremen" className="brand-logo"/>
                </div>
                <div className="brand-card">
                    <img src={bosch} alt="bosch" className="brand-logo"/>
                </div>
                <div className="brand-card">
                    <img src={dewalt} alt="dewalt" className="brand-logo"/>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default FooterPrincipal