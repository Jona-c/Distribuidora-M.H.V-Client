import '../style/Seccion1PagAdmin.css'
import '../style/ModalProducto.css'
import { useState, useRef, type Dispatch, type SetStateAction } from 'react'
import { useProductos } from '../context/ProductosContext'
import Swal from 'sweetalert2'

const CATEGORIAS = ['IMPORTADO-NACIONAL', 'BREMEN', 'WEMBLEY', 'BULON G5', 'PIETRA', 'TORNILLOS ALLEN', 'ARTICULOS DE LIMPIEZA', 'ACCESORIOS DE PILETA', 'LIMPIAFONDO-ACCESORIOS', 'CLORO']

const camposVacios = {
    nombre: '',
    codigo: '',
    precio: '',
    categoria: '',
    en_stock: 'si',
    fecha_actualizacion: new Date().toISOString().slice(0, 10),
}

const Seccion1PagAdmin = ({
    view,
    setView,
    onProductoCreado,
}: {
    view: 'grid' | 'list'
    setView: Dispatch<SetStateAction<'grid' | 'list'>>
    onProductoCreado?: () => void
}) => {
    const { crearProducto } = useProductos()
    const [modalAbierto, setModalAbierto] = useState(false)
    const [campos, setCampos] = useState(camposVacios)
    const [imagenPreview, setImagenPreview] = useState<string | null>(null)
    const [guardando, setGuardando] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleCampo = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCampos(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImagenPreview(URL.createObjectURL(file))
    }

    const handleAbrir = () => {
        setCampos(camposVacios)
        setImagenPreview(null)
        if (fileRef.current) fileRef.current.value = ''
        setModalAbierto(true)
    }

    const handleGuardar = async () => {
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
            await crearProducto(form)
            setModalAbierto(false)
            onProductoCreado?.()
            await Swal.fire({
                title: '¡Producto agregado!',
                text: 'El producto fue creado correctamente.',
                icon: 'success',
                confirmButtonColor: '#2d6a4f',
                timer: 3000,
                timerProgressBar: true,
            })
        } catch {
            Swal.fire({ title: 'Error', text: 'No se pudo crear el producto.', icon: 'error', confirmButtonColor: '#e74c3c' })
        } finally {
            setGuardando(false)
        }
    }

    return (
        <>
            <div className="filter-bar">
                <div className="filter-left">
                    <button type="button" className="add-product-btn" title="Insertar Producto" onClick={handleAbrir}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Insertar Producto
                    </button>
                </div>
                <div className="filter-right">
                    <div className="view-toggle" role="group" aria-label="Vista de productos">
                        <button type="button" className={`view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} aria-pressed={view === 'grid'} title="Ver en cuadrícula">
                            <svg className="view-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>
                        </button>
                        <button type="button" className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} aria-pressed={view === 'list'} title="Ver en lista">
                            <svg className="view-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><rect x="3" y="5" width="4" height="4" rx="1"/></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── MODAL INSERTAR PRODUCTO ── */}
            {modalAbierto && (
                <div className="mp-overlay" onClick={e => { if (e.target === e.currentTarget) setModalAbierto(false) }}>
                    <div className="mp-modal">
                        <div className="mp-header">
                            <h3 className="mp-titulo">➕ Nuevo Producto</h3>
                            <button className="mp-cerrar" onClick={() => setModalAbierto(false)}>✕</button>
                        </div>

                        <div className="mp-body">
                            {/* Imagen */}
                            <div className="mp-imagen-zona" onClick={() => fileRef.current?.click()}>
                                {imagenPreview
                                    ? <img src={imagenPreview} alt="preview" className="mp-imagen-preview" />
                                    : <div className="mp-imagen-placeholder"><span>📷</span><p>Hacer click para subir imagen</p></div>
                                }
                                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImagen} />
                            </div>

                            <div className="mp-campos">
                                <label className="mp-label">Nombre <span className="mp-req">*</span></label>
                                <input className="mp-input" name="nombre" value={campos.nombre} onChange={handleCampo} placeholder="Nombre del producto" />

                                <label className="mp-label">Código <span className="mp-req">*</span></label>
                                <input className="mp-input" name="codigo" value={campos.codigo} onChange={handleCampo} placeholder="Código" />

                                <label className="mp-label">Precio <span className="mp-req">*</span></label>
                                <input className="mp-input" name="precio" type="number" min="0" value={campos.precio} onChange={handleCampo} placeholder="0.00" />

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
                            <button className="mp-btn mp-btn--cancelar" onClick={() => setModalAbierto(false)}>Cancelar</button>
                            <button className="mp-btn mp-btn--guardar" onClick={handleGuardar} disabled={guardando}>
                                {guardando ? 'Guardando...' : '✅ Agregar Producto'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Seccion1PagAdmin