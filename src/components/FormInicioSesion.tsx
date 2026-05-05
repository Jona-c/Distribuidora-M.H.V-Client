import '../style/FormInicioSesion.css'
import '../style/HeaderInicioSesion.css'
import '../style/ModalPassword.css'
import { useContext, useState, type ChangeEvent, type FormEvent } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { inicioSesionFetch } from '../api/inicioSesionFetch.ts'
import { AuthContext } from '../context/AuthContext.tsx'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Paso 1 → pide email y manda código
// Paso 2 → verifica el código de 6 dígitos
// Paso 3 → ingresa nueva contraseña

const FormInicioSesion = () => {
    const { login }  = useContext(AuthContext)
    const navigate   = useNavigate()

    // ── Login ──
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword]  = useState(false)
    const [error, setError] = useState<string | null>(null)

    // ── Forgot password modal ──
    const [modalAbierto, setModalAbierto] = useState(false)
    const [paso, setPaso]                 = useState<1 | 2 | 3>(1)
    const [fpEmail, setFpEmail]           = useState('')
    const [fpCodigo, setFpCodigo]         = useState('')
    const [fpNueva, setFpNueva]           = useState('')
    const [fpConfirmar, setFpConfirmar]   = useState('')
    const [fpShowNueva, setFpShowNueva]   = useState(false)
    const [fpShowConf, setFpShowConf]     = useState(false)
    const [fpCargando, setFpCargando]     = useState(false)
    const [fpError, setFpError]           = useState('')

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await inicioSesionFetch(formData)
            const { token, role } = response
            localStorage.setItem('token', token)
            const success = await login(token)
            if (!success) { localStorage.removeItem('token'); setError('Error al verificar credenciales'); return }
            setError(null)
            navigate(role === 'admin' ? '/PaginaAdmin' : '/PaginaCliente')
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : (err as any)?.msg ?? 'Error al iniciar sesión'
            setError(message)
        }
    }

    // ── Abrir modal ──
    const abrirModal = () => {
        setPaso(1); setFpEmail(''); setFpCodigo(''); setFpNueva(''); setFpConfirmar(''); setFpError(''); setModalAbierto(true)
    }

    // ── Paso 1: enviar código ──
    const handleEnviarCodigo = async () => {
        if (!fpEmail.trim()) return setFpError('Ingresá tu email.')
        setFpCargando(true); setFpError('')
        try {
            const res = await fetch(`${API_URL}/auth/solicitar-codigo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: fpEmail }),
            })
            const data = await res.json()
            if (!res.ok) return setFpError(data.msg)
            setPaso(2)
        } catch { setFpError('Error de conexión.') }
        finally { setFpCargando(false) }
    }

    // ── Paso 2: verificar código ──
    const handleVerificarCodigo = async () => {
        if (fpCodigo.length !== 6) return setFpError('El código debe tener 6 dígitos.')
        setFpCargando(true); setFpError('')
        try {
            const res = await fetch(`${API_URL}/auth/verificar-codigo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: fpEmail, codigo: fpCodigo }),
            })
            const data = await res.json()
            if (!res.ok) return setFpError(data.msg)
            setPaso(3)
        } catch { setFpError('Error de conexión.') }
        finally { setFpCargando(false) }
    }

    // ── Paso 3: resetear contraseña ──
    const handleResetearPassword = async () => {
        if (!fpNueva || fpNueva.length < 6) return setFpError('La contraseña debe tener al menos 6 caracteres.')
        if (fpNueva !== fpConfirmar)         return setFpError('Las contraseñas no coinciden.')
        setFpCargando(true); setFpError('')
        try {
            const res = await fetch(`${API_URL}/auth/resetear-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: fpEmail, codigo: fpCodigo, nuevaPassword: fpNueva }),
            })
            const data = await res.json()
            if (!res.ok) return setFpError(data.msg)
            setModalAbierto(false)
            await Swal.fire({
                title: '¡Contraseña nueva guardada!',
                text: 'Tu contraseña fue actualizada correctamente. Ya podés iniciar sesión.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#DC2626',
                timer: 4000,
                timerProgressBar: true,
            })
        } catch { setFpError('Error de conexión.') }
        finally { setFpCargando(false) }
    }

    return (
        <>
            <div className="login-page-wrapper">
                <div className="login-container">
                    <div className="header-section">
                        <h1 className="header-title">Iniciar <span className="brand-text">Sesión</span></h1>
                        <p className="header-subtitle">Accede a tu cuenta de Distribuidora M.H.V</p>
                    </div>

                    <div className="form-section">
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Email del Usuario <span className="required">*</span></label>
                                <input type="text" className="form-input" name="email" placeholder="Ingrese su email" value={formData.email} onChange={handleInputChange} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Contraseña <span className="required">*</span></label>
                                <div className="password-wrapper">
                                    <input type={showPassword ? 'text' : 'password'} className="form-input" name="password" placeholder="Ingrese su contraseña" value={formData.password} onChange={handleInputChange} />
                                    <button type="button" className="eye-button" onClick={() => setShowPassword(p => !p)}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                <div className="forgot-password">
                                    {/* ★ Olvidé mi contraseña */}
                                    <a href="#" onClick={e => { e.preventDefault(); abrirModal() }}>¿Olvidaste tu contraseña?</a>
                                </div>
                            </div>

                            {error && <p className="alert alert-danger">{error}</p>}
                            <button type="submit" className="btn-submit">Iniciar Sesión</button>
                        </form>

                        <div className="register-link">
                            ¿No tienes cuenta? <a href="/Registrarse">Regístrate aquí</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MODAL OLVIDÉ MI CONTRASEÑA ── */}
            {modalAbierto && (
                <div className="mp-overlay" onClick={e => { if (e.target === e.currentTarget) setModalAbierto(false) }}>
                    <div className="mp-modal mp-modal--angosto">

                        <div className="mp-header">
                            <h3 className="mp-titulo">
                                {paso === 1 && '🔑 Recuperar contraseña'}
                                {paso === 2 && '📧 Verificar código'}
                                {paso === 3 && '🔒 Nueva contraseña'}
                            </h3>
                            <button className="mp-cerrar" onClick={() => setModalAbierto(false)}>✕</button>
                        </div>

                        <div className="mp-body mp-body--col">

                            {/* ── PASO 1 ── */}
                            {paso === 1 && (
                                <>
                                    <p className="mp-desc">Ingresá tu email y te enviaremos un código de 6 dígitos para restablecer tu contraseña.</p>
                                    <label className="mp-label">Email</label>
                                    <input className="mp-input" type="email" placeholder="tu@email.com" value={fpEmail} onChange={e => setFpEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEnviarCodigo()} />
                                </>
                            )}

                            {/* ── PASO 2 ── */}
                            {paso === 2 && (
                                <>
                                    <p className="mp-desc">Revisá tu mail <strong>{fpEmail}</strong> e ingresá el código de 6 dígitos que recibiste.</p>
                                    <label className="mp-label">Código de verificación</label>
                                    <input
                                        className="mp-input mp-input--codigo"
                                        type="text"
                                        maxLength={6}
                                        placeholder="_ _ _ _ _ _"
                                        value={fpCodigo}
                                        onChange={e => setFpCodigo(e.target.value.replace(/\D/g, ''))}
                                        onKeyDown={e => e.key === 'Enter' && handleVerificarCodigo()}
                                    />
                                    <button className="mp-link" onClick={() => { setPaso(1); setFpCodigo('') }}>← Cambiar email</button>
                                </>
                            )}

                            {/* ── PASO 3 ── */}
                            {paso === 3 && (
                                <>
                                    <p className="mp-desc">Ingresá tu nueva contraseña.</p>
                                    <label className="mp-label">Nueva contraseña</label>
                                    <div className="mp-pass-wrap">
                                        <input className="mp-input" type={fpShowNueva ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" value={fpNueva} onChange={e => setFpNueva(e.target.value)} />
                                        <button type="button" className="mp-eye" onClick={() => setFpShowNueva(p => !p)}>{fpShowNueva ? <FaEyeSlash /> : <FaEye />}</button>
                                    </div>
                                    <label className="mp-label">Confirmar nueva contraseña</label>
                                    <div className="mp-pass-wrap">
                                        <input className="mp-input" type={fpShowConf ? 'text' : 'password'} placeholder="Repetí la contraseña" value={fpConfirmar} onChange={e => setFpConfirmar(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleResetearPassword()} />
                                        <button type="button" className="mp-eye" onClick={() => setFpShowConf(p => !p)}>{fpShowConf ? <FaEyeSlash /> : <FaEye />}</button>
                                    </div>
                                </>
                            )}

                            {fpError && <p className="mp-error">{fpError}</p>}
                        </div>

                        <div className="mp-footer">
                            <button className="mp-btn mp-btn--cancelar" onClick={() => setModalAbierto(false)}>Cancelar</button>
                            {paso === 1 && <button className="mp-btn mp-btn--guardar" onClick={handleEnviarCodigo} disabled={fpCargando}>{fpCargando ? 'Enviando...' : 'Enviar código'}</button>}
                            {paso === 2 && <button className="mp-btn mp-btn--guardar" onClick={handleVerificarCodigo} disabled={fpCargando}>{fpCargando ? 'Verificando...' : 'Verificar código'}</button>}
                            {paso === 3 && <button className="mp-btn mp-btn--guardar" onClick={handleResetearPassword} disabled={fpCargando}>{fpCargando ? 'Guardando...' : 'Confirmar contraseña'}</button>}
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}

export default FormInicioSesion