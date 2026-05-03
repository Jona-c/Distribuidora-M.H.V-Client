import { useEffect, useState, useRef } from 'react'
import '../style/ProductosAdmin.css'
import '../style/ModalProducto.css'
import { useProductos } from '../context/ProductosContext'
import type { Producto } from '../context/ProductosContext'
import Swal from 'sweetalert2'

const CATEGORIAS = ['Almacén', 'Bebidas', 'Lácteos', 'Carnes', 'Verdulería', 'Limpieza', 'Otros']

const ProductosAdmin = ({
    vista = 'grilla',
    categoria = null,
    busqueda = '',
}: {
    vista?: 'grilla' | 'lista'
    categoria?: string | null
    busqueda?: string
}) => {
    const { productos, fetchProductos, editarProducto, eliminarProducto, getImagenUrl } = useProductos()
    const [pagina, setPagina] = useState(1)
    const limite = 6

    // ── Modal editar ──
    const [modalEditar, setModalEditar] = useState<Producto | null>(null)
    const [campos, setCampos] = useState<any>({})
    const [imagenPreview, setImagenPreview] = useState<string | null>(null)
    const [guardando, setGuardando] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    useEffect(() => { setPagina(1) }, [categoria, busqueda])

    useEffect(() => {
        fetchProductos(pagina, categoria, busqueda)
    }, [pagina, categoria, busqueda, fetchProductos])

    const formatearFecha = (fecha?: string) =>
        fecha ? new Date(fecha).toLocaleDateString('es-AR') : '–'

    // ── Abrir modal edición ──
    const handleAbrirEditar = (p: Producto) => {
        setModalEditar(p)
        setCampos({
            nombre:              p.nombre ?? '',
            codigo:              p.codigo ?? '',
            precio:              String(p.precio ?? ''),
            categoria:           p.categoria ?? '',
            en_stock:            p.en_stock ? 'si' : 'no',
            fecha_actualizacion: p.fecha_actualizacion ? new Date(p.fecha_actualizacion).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        })
        setImagenPreview(getImagenUrl(p.imagen))
        if (fileRef.current) fileRef.current.value = ''
    }

    const handleCampo = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCampos((prev: any) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setImagenPreview(URL.createObjectURL(file))
    }

    // ── Guardar edición ──
    const handleGuardarEdicion = async () => {
        if (!modalEditar) return
        if (!campos.nombre.trim() || !campos.codigo.trim() || !campos.precio) {
            return Swal.fire({ title: 'Campos incompletos', text: 'Nombre, código y precio son obligatorios.', icon: 'warning', confirmButtonColor: '#2d6a4f' })
        }

        const form = new FormData()
        form.append('nombre', campos.nombre)
        form.append('codigo', campos.codigo)
        form.append('precio', campos.precio)
        form.append('categoria', campos.categoria)
        form.append('en_stock', campos.en_stock === 'si' ? 'true' : 'false')
        form.append('fecha_actualizacion', campos.fecha_actualizacion)
        if (fileRef.current?.files?.[0]) {
            form.append('imagen', fileRef.current.files[0])
        }

        setGuardando(true)
        try {
            await editarProducto(modalEditar._id, form)
            setModalEditar(null)
            await fetchProductos(pagina, categoria, busqueda)
            await Swal.fire({ title: '¡Producto actualizado!', text: 'Los cambios fueron guardados.', icon: 'success', confirmButtonColor: '#2d6a4f', timer: 3000, timerProgressBar: true })
        } catch {
            Swal.fire({ title: 'Error', text: 'No se pudo actualizar el producto.', icon: 'error', confirmButtonColor: '#e74c3c' })
        } finally {
            setGuardando(false)
        }
    }

    // ── Eliminar ──
    const handleEliminar = async (p: Producto) => {
        const result = await Swal.fire({
            title: '¿Eliminar producto?',
            html: `<p style="color:#555">¿Estás seguro que querés eliminar <strong>${p.nombre}</strong>? Esta acción no se puede deshacer.</p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#e74c3c',
            cancelButtonColor: '#6c757d',
        })
        if (!result.isConfirmed) return
        try {
            await eliminarProducto(p._id)
            await Swal.fire({ title: 'Eliminado', text: 'El producto fue eliminado correctamente.', icon: 'success', confirmButtonColor: '#2d6a4f', timer: 2500, timerProgressBar: true })
        } catch {
            Swal.fire({ title: 'Error', text: 'No se pudo eliminar el producto.', icon: 'error', confirmButtonColor: '#e74c3c' })
        }
    }

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
                                <div className="acciones-producto">
                                    <button className="btn-accion btn-editar" title="Editar producto" onClick={() => handleAbrirEditar(p)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                    </button>
                                    <button className="btn-accion btn-eliminar" title="Eliminar producto" onClick={() => handleEliminar(p)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"/>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                            <line x1="10" y1="11" x2="10" y2="17"/>
                                            <line x1="14" y1="11" x2="14" y2="17"/>
                                        </svg>
                                    </button>
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

            {/* ── MODAL EDITAR PRODUCTO ── */}
            {modalEditar && (
                <div className="mp-overlay" onClick={e => { if (e.target === e.currentTarget) setModalEditar(null) }}>
                    <div className="mp-modal">
                        <div className="mp-header">
                            <h3 className="mp-titulo">✏️ Editar Producto</h3>
                            <button className="mp-cerrar" onClick={() => setModalEditar(null)}>✕</button>
                        </div>

                        <div className="mp-body">
                            {/* Imagen */}
                            <div className="mp-imagen-zona" onClick={() => fileRef.current?.click()}>
                                {imagenPreview
                                    ? <img src={imagenPreview} alt="preview" className="mp-imagen-preview" />
                                    : <div className="mp-imagen-placeholder"><span>📷</span><p>Hacer click para cambiar imagen</p></div>
                                }
                                <div className="mp-imagen-overlay-text">Cambiar imagen</div>
                                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImagen} />
                            </div>

                            <div className="mp-campos">
                                <label className="mp-label">Nombre <span className="mp-req">*</span></label>
                                <input className="mp-input" name="nombre" value={campos.nombre} onChange={handleCampo} />

                                <label className="mp-label">Código <span className="mp-req">*</span></label>
                                <input className="mp-input" name="codigo" value={campos.codigo} onChange={handleCampo} />

                                <label className="mp-label">Precio <span className="mp-req">*</span></label>
                                <input className="mp-input" name="precio" type="number" min="0" value={campos.precio} onChange={handleCampo} />

                                <label className="mp-label">Categoría</label>
                                <select className="mp-input" name="categoria" value={campos.categoria} onChange={handleCampo}>
                                    <option value="">Sin categoría</option>
                                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>

                                <label className="mp-label">Fecha de actualización</label>
                                <input className="mp-input" name="fecha_actualizacion" type="date" value={campos.fecha_actualizacion} onChange={handleCampo} />

                                <label className="mp-label">En stock</label>
                                <select className="mp-input" name="en_stock" value={campos.en_stock} onChange={handleCampo}>
                                    <option value="si">Sí</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                        </div>

                        <div className="mp-footer">
                            <button className="mp-btn mp-btn--cancelar" onClick={() => setModalEditar(null)}>Cancelar</button>
                            <button className="mp-btn mp-btn--guardar" onClick={handleGuardarEdicion} disabled={guardando}>
                                {guardando ? 'Guardando...' : '💾 Modificar Producto'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default ProductosAdmin