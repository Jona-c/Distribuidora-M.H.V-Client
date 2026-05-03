import HeaderPaginaAdmin from '../components/HeaderPaginaAdmin'
import Seccion1PagAdmin from '../components/Seccion1PagAdmin'
import ContenedorPrincipalPagAdmin from '../components/ContenedorPrincipalPagAdmin'
import { useState, useCallback } from 'react'
import { useProductos } from '../context/ProductosContext'

const PaginaAdmin = () => {
    const [view, setView] = useState<'grid' | 'list'>('grid')
    const [busqueda, setBusqueda] = useState('')
    const { fetchProductos } = useProductos()

    // Cuando se crea un producto nuevo, re-fetch página 1
    const handleProductoCreado = useCallback(() => {
        fetchProductos(1, null, busqueda)
    }, [fetchProductos, busqueda])

    return (
        <div>
            <HeaderPaginaAdmin onBuscar={setBusqueda} />
            <Seccion1PagAdmin
                view={view}
                setView={setView}
                onProductoCreado={handleProductoCreado}
            />
            <ContenedorPrincipalPagAdmin
                vista={view === 'grid' ? 'grilla' : 'lista'}
                busqueda={busqueda}
            />
        </div>
    )
}

export default PaginaAdmin