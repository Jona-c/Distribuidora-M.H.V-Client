import { useEffect, useState } from 'react'
import '../style/ProductosClientes.css'
import { useProductos } from '../context/ProductosContext'
import { useCarrito } from '../context/CarritoContext'

const ProductosClientes = ({
    vista = 'grilla',
    categoria = null,
    busqueda = '',
}: {
    vista?: 'grilla' | 'lista'
    categoria?: string | null
    busqueda?: string
}) => {
    const { productos, fetchProductos, getImagenUrl } = useProductos()
    const [cantidades, setCantidades] = useState<{ [id: string]: number }>({})
    const [pagina, setPagina] = useState(1)
    const limite = 6
    const { agregarAlCarrito } = useCarrito()

    useEffect(() => { setPagina(1) }, [categoria, busqueda])

    useEffect(() => {
        fetchProductos(pagina, categoria, busqueda).then(() => {
            // Inicializar cantidades en 1 para cada producto
            setCantidades(prev => {
                const nuevo = { ...prev }
                productos.forEach(p => { if (!nuevo[p._id]) nuevo[p._id] = 1 })
                return nuevo
            })
        })
    }, [pagina, categoria, busqueda, fetchProductos])

    // Sincronizar cantidades cuando cambia la lista de productos
    useEffect(() => {
        setCantidades(prev => {
            const nuevo = { ...prev }
            productos.forEach(p => { if (!nuevo[p._id]) nuevo[p._id] = 1 })
            return nuevo
        })
    }, [productos])

    const formatearFecha = (fecha?: string) =>
        fecha ? new Date(fecha).toLocaleDateString('es-AR') : '–'

    const aumentar  = (id: string) => setCantidades(prev => ({ ...prev, [id]: (prev[id] || 1) + 1 }))
    const disminuir = (id: string) => setCantidades(prev => ({ ...prev, [id]: Math.max((prev[id] || 1) - 1, 1) }))

    return (
        <main className="seccion-productos">
            <h2 className="titulo-productos">
                {categoria ? `Categoría: ${categoria}` : 'Todos los Productos'}
            </h2>

            <div className={vista === 'grilla' ? 'grid-productos' : 'lista-productos'}>
                {productos.map((p, i) => (
                    <div className="tarjeta-producto" key={p._id || i}>
                        <div className="contenedor-imagen-producto">
                            <img src={getImagenUrl(p.imagen)} alt={p.nombre} className="imagen-producto" />
                            <div className="fecha-actualizacion">{formatearFecha(p.fecha_actualizacion)}</div>
                            <div className={`insignia-stock ${p.en_stock ? 'en-stock' : 'sin-stock'}`}>{p.en_stock ? '✓' : '✕'}</div>
                        </div>
                        <div className="info-producto">
                            <h3 className="nombre-producto">{p.nombre || 'Sin nombre'}</h3>
                            <p className="codigo-producto">Código: {p.codigo || '–'}</p>
                            <div className="pie-producto">
                                <span className="precio-producto">${p.precio || '0.00'}</span>
                                <div className="controles-carrito">
                                    <div className="controles-cantidad">
                                        <button className="btn-cantidad btn-cantidad--decrease" onClick={() => disminuir(p._id)} aria-label="Disminuir">−</button>
                                        <span className="numero-cantidad">{cantidades[p._id] || 1}</span>
                                        <button className="btn-cantidad btn-cantidad--increase" onClick={() => aumentar(p._id)} aria-label="Aumentar">+</button>
                                    </div>
                                    <button className="btn-carrito" onClick={() => agregarAlCarrito(p, cantidades[p._id] || 1)} aria-label="Agregar al carrito">🛒</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="paginacion-productos">
                <button className="btn-paginacion" onClick={() => setPagina(p => Math.max(p - 1, 1))} disabled={pagina === 1}>Anterior</button>
                <span className="pagina-paginacion">{pagina}</span>
                <button className="btn-paginacion btn-paginacion--primario" onClick={() => setPagina(p => p + 1)} disabled={productos.length < limite}>Siguiente</button>
            </div>
        </main>
    )
}

export default ProductosClientes