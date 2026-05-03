import HeaderCarrito from "../components/HeaderCarrito";
import { useState } from "react";
import Seccion1Carrito from "../components/Seccion1Carrito";


const Carrito = () => {
	const [busqueda, setBusqueda] = useState('');
	return (
    	<>
			<div>
				<HeaderCarrito onBuscar={setBusqueda} />
                <Seccion1Carrito />
			</div>
    	</>
	);
};

export default Carrito;