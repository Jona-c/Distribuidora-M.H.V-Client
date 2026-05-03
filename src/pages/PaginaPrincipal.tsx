
import HeaderPrincipal from "../components/HeaderPrincipal"
import Seccion1PagPrincipal from "../components/Seccion1PagPrincipal"
import HeroSesionPrincipal from "../components/HeroSesionPrincipal"
import FooterPrincipal from "../components/FooterPrincipal"

const PaginaPrincipal = () => {
    return (
        <>
            <div>
                <HeaderPrincipal />
                <Seccion1PagPrincipal/>
                <HeroSesionPrincipal/>
                <FooterPrincipal/>
            </div>
        </>
    )
}

export default PaginaPrincipal