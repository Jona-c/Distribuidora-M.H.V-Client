import { useState, useEffect } from 'react'
import '../style/HeroCatalogo.css'
import { useProductos } from '../context/ProductosContext'

// ── Mismas categorías que ContenedorPrincipalPagCliente ──
import importadoNacional    from '../assets/importado-nacional.png'
import bremen               from '../assets/bremen.png'
import wembley              from '../assets/wembley.png'
import pietra               from '../assets/pietra.png'
import tornillosAllen       from '../assets/tornillosAllen.png'
import articulosDeLimpieza  from '../assets/articulos de limpieza.png'
import accesoriosDePileta   from '../assets/accesorios de pileta.png'
import limpiafondoAccesorios from '../assets/limpiafondos.png'
import cloro                from '../assets/cloro.png'
import bulong5              from '../assets/bulon g5.png'

const categorias = [
    { nombre: 'IMPORTADO-NACIONAL',     imagen: importadoNacional },
    { nombre: 'BREMEN',                  imagen: bremen },
    { nombre: 'WEMBLEY',                 imagen: wembley },
    { nombre: 'BULON G5',               imagen: bulong5 },
    { nombre: 'PIETRA',                  imagen: pietra },
    { nombre: 'TORNILLOS ALLEN',         imagen: tornillosAllen },
    { nombre: 'ARTICULOS DE LIMPIEZA',   imagen: articulosDeLimpieza },
    { nombre: 'ACCESORIOS DE PILETA',    imagen: accesoriosDePileta },
    { nombre: 'LIMPIAFONDO-ACCESORIOS',  imagen: limpiafondoAccesorios },
    { nombre: 'CLORO',                   imagen: cloro },
]

const LIMITE = 6

const HeroCatalogo = () => {
    const { productos, fetchProductos, getImagenUrl } = useProductos()

    const [collapsed, setCollapsed]           = useState(false)
    const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null)
    const [pagina, setPagina]                 = useState(1)

    // Reset página al cambiar categoría
    useEffect(() => { setPagina(1) }, [categoriaActiva])

    useEffect(() => {
        fetchProductos(pagina, categoriaActiva, '')
    }, [pagina, categoriaActiva, fetchProductos])

    const handleCategoria = (nombre: string) =>
        setCategoriaActiva(prev => prev === nombre ? null : nombre)

    const formatearFecha = (fecha?: string) =>
        fecha ? new Date(fecha).toLocaleDateString('es-AR') : '–'

    return (
        <div className="hc-container">

            {/* ── SIDEBAR ── */}
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} aria-expanded={!collapsed}>
                <div className="sidebar-header" role="toolbar">
                    <h3 className="sidebar-title">Categorías</h3>
                    <button
                        type="button"
                        className={`toggle-button ${collapsed ? 'collapsed' : ''}`}
                        onClick={() => setCollapsed(prev => !prev)}
                        aria-label={collapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
                        aria-pressed={collapsed}
                    >
                        <span className="arrow" aria-hidden="true">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </button>
                </div>

                <ul className="category-list">
                    {categorias.map(cat => (
                        <li
                            key={cat.nombre}
                            className={`category-item ${categoriaActiva === cat.nombre ? 'activa' : ''}`}
                            onClick={() => handleCategoria(cat.nombre)}
                        >
                            <img src={cat.imagen} alt={cat.nombre} className="brand-logo1" />
                            <span className="category-name">{cat.nombre}</span>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* ── PRODUCTOS ── */}
            <main className="seccion-productos">
                <h2 className="titulo-productos">
                    {categoriaActiva ? `Categoría: ${categoriaActiva}` : 'Todos los Productos'}
                </h2>

                <div className="grid-productos">
                    {productos.map((p, i) => (
                        <div className="tarjeta-producto" key={p._id || i}>
                            <div className="contenedor-imagen-producto">
                                <img
                                    src={getImagenUrl(p.imagen)}
                                    alt={p.nombre}
                                    className="imagen-producto"
                                />
                                <div className="fecha-actualizacion">{formatearFecha(p.fecha_actualizacion)}</div>
                                <div className={`insignia-stock ${p.en_stock ? 'en-stock' : 'sin-stock'}`}>
                                    {p.en_stock ? '✓' : '✕'}
                                </div>
                            </div>
                            <div className="info-producto">
                                <h3 className="nombre-producto">{p.nombre || 'Sin nombre'}</h3>
                                <p className="codigo-producto">Código: {p.codigo || '–'}</p>
                                <div className="pie-producto">
                                    {/* Precio reemplazado por "Consultar" */}
                                    <span className="hc-precio-consultar">Consultar</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Paginación */}
                <div className="paginacion-productos">
                    <button
                        className="btn-paginacion"
                        onClick={() => setPagina(p => Math.max(p - 1, 1))}
                        disabled={pagina === 1}
                    >
                        Anterior
                    </button>
                    <span className="pagina-paginacion">{pagina}</span>
                    <button
                        className="btn-paginacion btn-paginacion--primario"
                        onClick={() => setPagina(p => p + 1)}
                        disabled={productos.length < LIMITE}
                    >
                        Siguiente
                    </button>
                </div>
            </main>

        </div>
    )
}

export default HeroCatalogo