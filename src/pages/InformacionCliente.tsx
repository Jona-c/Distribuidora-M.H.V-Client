import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext.tsx'
import '../style/InformacionCliente.css'
import '../style/ModalPassword.css'
import HeaderPaginaCliente from '../components/HeaderPaginaCliente.tsx'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Swal from 'sweetalert2'

const API = 'http://localhost:5000/api'

const InformacionCliente = () => {
    const { user } = useContext(AuthContext)

    // ── Modal cambiar contraseña ──
    const [modal, setModal]             = useState(false)
    const [actual, setActual]           = useState('')
    const [nueva, setNueva]             = useState('')
    const [confirmar, setConfirmar]     = useState('')
    const [showActual, setShowActual]   = useState(false)
    const [showNueva, setShowNueva]     = useState(false)
    const [showConf, setShowConf]       = useState(false)
    const [error, setError]             = useState('')
    const [cargando, setCargando]       = useState(false)

    const abrirModal = () => { setActual(''); setNueva(''); setConfirmar(''); setError(''); setModal(true) }

    const handleCambiar = async () => {
        if (!actual)             return setError('Ingresá tu contraseña actual.')
        if (nueva.length < 6)    return setError('La nueva contraseña debe tener al menos 6 caracteres.')
        if (nueva !== confirmar) return setError('Las contraseñas nuevas no coinciden.')

        setCargando(true); setError('')
        try {
            const res = await fetch(`${API}/auth/cambiar-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token') || '',
                },
                body: JSON.stringify({ passwordActual: actual, nuevaPassword: nueva }),
            })
            const data = await res.json()
            if (!res.ok) return setError(data.msg)
            setModal(false)
            await Swal.fire({
                title: '¡Contraseña modificada!',
                text: 'Tu contraseña fue actualizada correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#DC2626',
                timer: 3500,
                timerProgressBar: true,
            })
        } catch { setError('Error de conexión.') }
        finally { setCargando(false) }
    }

    return (
        <>
            <HeaderPaginaCliente />

            <div className="mx-2 d-flex flex-column align-items-center info-page">
                <h3 className="perfil-title">Mi Perfil</h3>
                <div className="perfil-card">
                    <p><strong>Nombre:</strong> <span>{user.nombre} {user.apellido}</span></p>
                    {user.telefono      && <p><strong>Teléfono:</strong> {user.telefono}</p>}
                    {user.razon_social  && <p><strong>Razón social:</strong> {user.razon_social}</p>}
                    {user.direccion     && <p><strong>Dirección:</strong> {user.direccion}</p>}
                    {user.localidad     && <p><strong>Localidad:</strong> {user.localidad}</p>}
                    {user.provincia     && <p><strong>Provincia:</strong> {user.provincia}</p>}
                    {user.cuit          && <p><strong>CUIT:</strong> {user.cuit}</p>}
                    {user.condicion_IVA && <p><strong>Condición IVA:</strong> {user.condicion_IVA}</p>}
                    {user.email         && <p><strong>Email:</strong> <span>{user.email}</span></p>}
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <button className="btn-change-password" onClick={abrirModal}>Cambiar la contraseña</button>
                </div>
            </div>

            {/* ── MODAL CAMBIAR CONTRASEÑA ── */}
            {modal && (
                <div className="mp-overlay" onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
                    <div className="mp-modal mp-modal--angosto">

                        <div className="mp-header">
                            <h3 className="mp-titulo">🔒 Cambiar contraseña</h3>
                            <button className="mp-cerrar" onClick={() => setModal(false)}>✕</button>
                        </div>

                        <div className="mp-body mp-body--col">
                            <label className="mp-label">Contraseña actual</label>
                            <div className="mp-pass-wrap">
                                <input className="mp-input" type={showActual ? 'text' : 'password'} placeholder="Tu contraseña actual" value={actual} onChange={e => setActual(e.target.value)} />
                                <button type="button" className="mp-eye" onClick={() => setShowActual(p => !p)}>{showActual ? <FaEyeSlash /> : <FaEye />}</button>
                            </div>

                            <label className="mp-label">Nueva contraseña</label>
                            <div className="mp-pass-wrap">
                                <input className="mp-input" type={showNueva ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" value={nueva} onChange={e => setNueva(e.target.value)} />
                                <button type="button" className="mp-eye" onClick={() => setShowNueva(p => !p)}>{showNueva ? <FaEyeSlash /> : <FaEye />}</button>
                            </div>

                            <label className="mp-label">Confirmar nueva contraseña</label>
                            <div className="mp-pass-wrap">
                                <input className="mp-input" type={showConf ? 'text' : 'password'} placeholder="Repetí la nueva contraseña" value={confirmar} onChange={e => setConfirmar(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCambiar()} />
                                <button type="button" className="mp-eye" onClick={() => setShowConf(p => !p)}>{showConf ? <FaEyeSlash /> : <FaEye />}</button>
                            </div>

                            {error && <p className="mp-error">{error}</p>}
                        </div>

                        <div className="mp-footer">
                            <button className="mp-btn mp-btn--cancelar" onClick={() => setModal(false)}>Cancelar</button>
                            <button className="mp-btn mp-btn--guardar" onClick={handleCambiar} disabled={cargando}>
                                {cargando ? 'Guardando...' : 'Cambiar Contraseña'}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}

export default InformacionCliente