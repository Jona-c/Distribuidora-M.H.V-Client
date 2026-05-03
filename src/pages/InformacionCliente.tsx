
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.tsx";
import "../style/InformacionCliente.css";
import HeaderPaginaCliente from "../components/HeaderPaginaCliente.tsx";

const InformacionCliente = () => {
    const { user } = useContext(AuthContext);

    return (
        <>
        <HeaderPaginaCliente/>
        
        <div className="mx-2 d-flex flex-column align-items-center info-page">
        <h3 className="perfil-title">Mi Perfil</h3>
        <div className="perfil-card">
            <p><strong>Nombre:</strong> <span className="">{user.nombre} {user.apellido}</span></p>
            {user.telefono && <p><strong>Telefono:</strong> {user.telefono}</p>}
            {user.razon_social && <p><strong>Razón social:</strong> {user.razon_social}</p>}
            {user.direccion && <p><strong>Dirección:</strong> {user.direccion}</p>}
            {user.localidad && <p><strong>Localidad:</strong> {user.localidad}</p>}
            {user.provincia && <p><strong>Provincia:</strong> {user.provincia}</p>}
            {user.cuit && <p><strong>CUIT:</strong> {user.cuit}</p>}
            {user.condicion_IVA && <p><strong>Condición IVA:</strong> {user.condicion_IVA}</p>}
            {user.email && <p><strong>Email:</strong> <span className="">{user.email}</span></p>}
        </div>
        <div className="d-flex justify-content-center mt-3">
            <button className="btn-change-password">Cambiar la contraseña</button>
        </div>
        </div>
        </>
    );
};

export default InformacionCliente;