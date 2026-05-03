import HeaderUltimosPedidos from "../components/HeaderUltimosPedidos";
import Seccion1UltimosPedidos from "../components/Seccion1UltimosPedidos";
import { useState } from "react";


const UltimosPedidos = () => {
	const [busqueda, setBusqueda] = useState('');
	return (
    	<>
			<div>
				<HeaderUltimosPedidos onBuscar={setBusqueda} />
				<Seccion1UltimosPedidos />
			</div>
    	</>
	);
};

export default UltimosPedidos;