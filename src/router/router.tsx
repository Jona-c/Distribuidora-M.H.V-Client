import { useContext} from "react";
import { Routes, Route} from "react-router-dom";
import PaginaPrincipal from "../pages/PaginaPrincipal.tsx";
import InicioSesion from "../pages/InicioSesion.tsx";
import Registrarse from "../pages/Registrarse.tsx";
import NotFound from "../pages/NotFound.tsx";
import PaginaCliente from "../pages/PaginaCliente.tsx";
import PaginaAdmin from "../pages/PaginaAdmin.tsx";
import Carrito from "../pages/Carrito.tsx";
import InformacionCliente from "../pages/InformacionCliente.tsx";
import UltimosPedidos from "../pages/UltimosPedidos.tsx";
import InformacionAdmin from "../pages/InformacionAdmin.tsx";
import TotalPedidosAdmin from "../pages/TotalPedidosAdmin.tsx";
import TotalPedidosCliente from "../pages/TotalPedidosCliente.tsx";
import CuentaCorrienteAdmin from "../pages/CuentaCorrienteAdmin.tsx";
import CuentaCorrienteCliente from "../pages/CuentaCorrienteCliente.tsx";
import Contacto from "../pages/Contacto.tsx";
import ContactoPaginaPrincipal from "../pages/ContactoPaginaPrincipal.tsx";
import SolicitarPresupuesto from "../pages/SolicitarPresupuesto.tsx";
import ConocerMas from "../pages/ConocerMas.tsx";
import Catalogo from "../pages/Catalogo.tsx";
import{ AuthContext } from "../context/AuthContext.tsx";


//configurar las rutas de la aplicacion para mostrar diferentes componentes segun la ruta actual

const AppRouter = () => {
    const {user} = useContext(AuthContext);

    return (
        <Routes>
            <Route path="/" element={<PaginaPrincipal />} errorElement={<NotFound />} />
            <Route path="/Registrarse" element={<Registrarse />} errorElement={<NotFound />} />
            <Route path="/InicioSesion" element={<InicioSesion />} errorElement={<NotFound />} />
            <Route path="/Contacto" element={<Contacto />} errorElement={<NotFound />} />
            <Route path="/ContactoPaginaPrincipal" element={<ContactoPaginaPrincipal />} errorElement={<NotFound />} />
            <Route path="/SolicitarPresupuesto" element={<SolicitarPresupuesto />} errorElement={<NotFound />} />  
            <Route path="/ConocerMas" element={<ConocerMas />} errorElement={<NotFound />} />
            <Route path="/Catalogo" element={<Catalogo />} errorElement={<NotFound />} />

            {/*Rutas del cliente */}
            {user && user.role === 'client' && (
                <>
                    <Route path="/PaginaCliente" element={<PaginaCliente />} errorElement={<NotFound />} />
                    <Route path="/Carrito" element={<Carrito />} errorElement={<NotFound />} />
                    <Route path="/InformacionCliente" element={<InformacionCliente />} errorElement={<NotFound />} />
                    <Route path="/CuentaCorrienteCliente" element={<CuentaCorrienteCliente />} errorElement={<NotFound />} />
                </>
            )}

            {/*Rutas del administrador */}
            {user && user.role === 'admin' && (
                <>
                    <Route path="/PaginaAdmin" element={<PaginaAdmin />} errorElement={<NotFound />} />
                    <Route path="/UltimosPedidos" element={<UltimosPedidos />} errorElement={<NotFound />} />
                    <Route path="/InformacionAdmin" element={<InformacionAdmin />} errorElement={<NotFound />} />
                    <Route path="/CuentaCorrienteAdmin" element={<CuentaCorrienteAdmin />} errorElement={<NotFound />} />
                </>
            )}
            
            {/* Rutas de pedidos - disponibles para usuarios autenticados */}
            {user && (
                <>
                    <Route path="/TotalPedidosCliente" element={<TotalPedidosCliente />} errorElement={<NotFound />} />
                    <Route path="/TotalPedidosAdmin" element={<TotalPedidosAdmin />} errorElement={<NotFound />} />
                </>
            )}
            
            {/* Ruta catch-all para páginas no encontradas */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};


export default AppRouter;
        