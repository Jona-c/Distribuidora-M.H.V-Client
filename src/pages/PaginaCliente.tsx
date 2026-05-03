import ContenedorPrincipalPagCliente from "../components/ContenedorPrincipalPagCliente";
import HeaderPaginaCliente from "../components/HeaderPaginaCliente";
import Seccion1PagCliente from "../components/Seccion1PagCliente";
import { useState } from "react";


const PaginaCliente = () => {
	const [view, setView] = useState<'grid' | 'list'>('grid');
	const [busqueda, setBusqueda] = useState('');
	return (
		<>
			<div>
				<HeaderPaginaCliente onBuscar={setBusqueda} />
				<Seccion1PagCliente view={view} setView={setView} />
				<ContenedorPrincipalPagCliente vista={view === 'grid' ? 'grilla' : 'lista'} busqueda={busqueda} />
			</div>
		</>
	);
};

export default PaginaCliente;