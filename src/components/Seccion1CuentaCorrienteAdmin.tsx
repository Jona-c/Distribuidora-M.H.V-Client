import { useEffect, useState } from 'react'
import { useCuentaCorriente } from '../context/CuentaCorrienteContext'
import type { EntradaCuentaCorriente } from '../context/CuentaCorrienteContext'
import '../style/Seccion1CuentaCorrienteAdmin.css'
import Swal from 'sweetalert2'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

type Filtro = 'pendiente' | 'pagado'

const Seccion1CuentaCorrienteAdmin = () => {
    const { entradas, cargando, fetchEntradas, registrarPago, restarPago } = useCuentaCorriente()

    const [filtro, setFiltro] = useState<Filtro>('pendiente')
    const [letraActiva, setLetraActiva] = useState<string | null>(null)
    const [modal, setModal] = useState<EntradaCuentaCorriente | null>(null)
    const [montoRestar, setMontoRestar] = useState('')

    useEffect(() => { fetchEntradas() }, [fetchEntradas])

    // Cuando cambia el modal, sincronizar el estado local del monto
    useEffect(() => { setMontoRestar('') }, [modal])

    const handleFiltro = (f: Filtro) => {
        setFiltro(f)
        setLetraActiva(null)
        setModal(null)
    }

    const entradasFiltradas = entradas.filter(e => e.estado === filtro)

    const letrasConEntradas = new Set(
        entradasFiltradas.map(e => e.cliente.apellido[0]?.toUpperCase()).filter(Boolean)
    )

    const entradasDeLaLetra = letraActiva
        ? entradasFiltradas.filter(e => e.cliente.apellido[0]?.toUpperCase() === letraActiva)
        : []

    const totalPendiente = entradas.filter(e => e.estado === 'pendiente').reduce((acc, e) => acc + e.totalRestante, 0)
    const totalPagado    = entradas.filter(e => e.estado === 'pagado').length

    // ── Registrar pago total ──
    const handleRegistrarPago = async () => {
        if (!modal) return
        const result = await Swal.fire({
            title: '¿Registrar pago completo?',
            html: `<p style="color:#555">Se marcará como <strong>Pago Exitoso</strong> la deuda de <strong>${modal.cliente.nombre} ${modal.cliente.apellido}</strong> por <strong>$${modal.totalRestante.toLocaleString('es-AR')}</strong>.</p>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, registrar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#2d6a4f',
            cancelButtonColor: '#6c757d',
        })
        if (!result.isConfirmed) return
        try {
            await registrarPago(modal._id)
            // Actualizar el modal con el dato fresco desde el array
            setModal(prev => prev ? { ...prev, estado: 'pagado', totalRestante: 0 } : null)
            await Swal.fire({ title: '¡Pago registrado!', text: 'La cuenta fue saldada exitosamente.', icon: 'success', confirmButtonColor: '#2d6a4f', timer: 3000, timerProgressBar: true })
            setModal(null)
        } catch {
            Swal.fire({ title: 'Error', text: 'No se pudo registrar el pago.', icon: 'error', confirmButtonColor: '#e74c3c' })
        }
    }

    // ── Restar pago parcial ──
    const handleRestarPago = async () => {
        if (!modal) return
        const monto = parseFloat(montoRestar)
        if (isNaN(monto) || monto <= 0) {
            return Swal.fire({ title: 'Monto inválido', text: 'Ingresá un monto mayor a 0.', icon: 'warning', confirmButtonColor: '#e74c3c' })
        }
        if (monto > modal.totalRestante) {
            return Swal.fire({ title: 'Monto excedido', text: `El monto ($${monto.toLocaleString('es-AR')}) supera la deuda restante ($${modal.totalRestante.toLocaleString('es-AR')}).`, icon: 'warning', confirmButtonColor: '#e74c3c' })
        }
        try {
            await restarPago(modal._id, monto)
            const nuevoRestante = modal.totalRestante - monto
            setModal(prev => prev ? { ...prev, totalRestante: nuevoRestante, estado: nuevoRestante === 0 ? 'pagado' : 'pendiente' } : null)
            setMontoRestar('')
            await Swal.fire({ title: '¡Pago parcial registrado!', text: `Se restaron $${monto.toLocaleString('es-AR')}. Resta: $${nuevoRestante.toLocaleString('es-AR')}`, icon: 'success', confirmButtonColor: '#2d6a4f', timer: 3000, timerProgressBar: true })
            if (nuevoRestante === 0) setModal(null)
        } catch (err: any) {
            Swal.fire({ title: 'Error', text: err.message || 'No se pudo restar el pago.', icon: 'error', confirmButtonColor: '#e74c3c' })
        }
    }

    if (cargando) {
        return (
            <section className="cc-admin">
                <div className="cc-loading"><span className="cc-spinner" /><p>Cargando cuenta corriente...</p></div>
            </section>
        )
    }

    return (
        <section className="cc-admin">
            <h2 className="cc-titulo">💳 Cuenta Corriente</h2>

            {/* Resumen */}
            <div className="cc-resumen">
                <div className="cc-resumen-card cc-resumen-card--deuda">
                    <span className="cc-resumen-num">${totalPendiente.toLocaleString('es-AR')}</span>
                    <span className="cc-resumen-label">Total pendiente de cobro</span>
                </div>
                <div className="cc-resumen-card cc-resumen-card--ok">
                    <span className="cc-resumen-num">{totalPagado}</span>
                    <span className="cc-resumen-label">Cuentas saldadas</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="cc-filtros">
                <button className={`cc-filtro-btn ${filtro === 'pendiente' ? 'cc-filtro-btn--active' : ''}`} onClick={() => handleFiltro('pendiente')}>
                    ⏳ Pendientes ({entradas.filter(e => e.estado === 'pendiente').length})
                </button>
                <button className={`cc-filtro-btn ${filtro === 'pagado' ? 'cc-filtro-btn--active' : ''}`} onClick={() => handleFiltro('pagado')}>
                    ✅ Pagados ({totalPagado})
                </button>
            </div>

            {entradasFiltradas.length === 0 ? (
                <div className="cc-vacio"><span>No hay cuentas {filtro === 'pendiente' ? 'pendientes' : 'pagadas'} todavía.</span></div>
            ) : (
                <>
                    {/* ABECEDARIO */}
                    <div className="abecedario">
                        {ALPHABET.map(letra => {
                            const activa = letrasConEntradas.has(letra)
                            const seleccionada = letraActiva === letra
                            return (
                                <button
                                    key={letra}
                                    className={`abc-btn ${activa ? 'abc-btn--activa' : 'abc-btn--inactiva'} ${seleccionada ? 'abc-btn--seleccionada' : ''}`}
                                    onClick={() => { if (!activa) return; setLetraActiva(prev => prev === letra ? null : letra); setModal(null) }}
                                    disabled={!activa}
                                >
                                    {letra}
                                </button>
                            )
                        })}
                    </div>

                    {/* PANEL */}
                    {letraActiva && (
                        <div className="abc-panel">
                            <div className="abc-panel-header">
                                <h3 className="abc-panel-titulo">
                                    Clientes — <span className="abc-panel-letra">{letraActiva}</span>
                                    <span className="abc-panel-subtitulo">{filtro === 'pendiente' ? 'Pendientes' : 'Pagados'}</span>
                                </h3>
                                <button className="abc-panel-cerrar" onClick={() => { setLetraActiva(null); setModal(null) }}>✕</button>
                            </div>

                            <ul className="abc-lista">
                                {entradasDeLaLetra.map(entrada => {
                                    const fecha = new Date(entrada.fechaPedido).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                    return (
                                        <li
                                            key={entrada._id}
                                            className={`abc-lista-item ${modal?._id === entrada._id ? 'abc-lista-item--seleccionado' : ''}`}
                                            onClick={() => setModal(modal?._id === entrada._id ? null : entrada)}
                                        >
                                            <div className="abc-item-cliente">
                                                <span className="abc-item-nombre">👤 {entrada.cliente.nombre} {entrada.cliente.apellido}</span>
                                                <span className={`abc-item-estado ${entrada.estado === 'pendiente' ? 'cc-badge--pendiente' : 'cc-badge--pagado'}`}>
                                                    {entrada.estado === 'pendiente' ? '⏳ Pago Pendiente' : '✅ Pago Exitoso'}
                                                </span>
                                            </div>
                                            <div className="abc-item-meta">
                                                <span className="abc-item-nro">Pedido #{entrada.nroPedido}</span>
                                                <span className="abc-item-fecha">{fecha}</span>
                                                <span className="abc-item-total">${entrada.totalRestante.toLocaleString('es-AR')}</span>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}
                </>
            )}

            {/* MODAL */}
            {modal && (
                <div className="pedido-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
                    <div className="pedido-modal cc-modal">

                        <div className="pedido-modal-header">
                            <div>
                                <h3 className="pedido-modal-titulo">Pedido <span className="pedido-modal-nro">#{modal.nroPedido}</span></h3>
                                <p className="pedido-modal-cliente">👤 {modal.cliente.nombre} {modal.cliente.apellido}</p>
                                <p className="pedido-modal-fecha">{new Date(modal.fechaPedido).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div className="pedido-modal-header-right">
                                <span className={`abc-item-estado ${modal.estado === 'pendiente' ? 'cc-badge--pendiente' : 'cc-badge--pagado'}`}>
                                    {modal.estado === 'pendiente' ? '⏳ Pago Pendiente' : '✅ Pago Exitoso'}
                                </span>
                                <button className="pedido-modal-cerrar" onClick={() => setModal(null)}>✕</button>
                            </div>
                        </div>

                        {/* Montos */}
                        <div className="cc-modal-montos">
                            <div className="cc-monto-row">
                                <span className="cc-monto-label">Total original:</span>
                                <span className="cc-monto-valor">${modal.totalOriginal.toLocaleString('es-AR')}</span>
                            </div>
                            <div className="cc-monto-row cc-monto-row--restante">
                                <span className="cc-monto-label">Saldo restante:</span>
                                <span className={`cc-monto-valor cc-monto-valor--restante ${modal.totalRestante === 0 ? 'cc-monto-valor--cero' : ''}`}>
                                    ${modal.totalRestante.toLocaleString('es-AR')}
                                </span>
                            </div>

                            {/* Historial de pagos */}
                            {modal.pagos.length > 0 && (
                                <div className="cc-pagos-historial">
                                    <p className="cc-pagos-titulo">Historial de pagos:</p>
                                    <ul className="cc-pagos-lista">
                                        {modal.pagos.map(pago => (
                                            <li key={pago._id} className="cc-pago-item">
                                                <span>{new Date(pago.fecha).toLocaleDateString('es-AR')}</span>
                                                <span className="cc-pago-monto">-${pago.monto.toLocaleString('es-AR')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Acciones (solo si está pendiente) */}
                        {modal.estado === 'pendiente' && (
                            <div className="cc-modal-acciones">
                                {/* Registrar pago total */}
                                <button className="cc-btn cc-btn--pago-total" onClick={handleRegistrarPago}>
                                    ✅ Registrar Pago
                                </button>

                                {/* Restar pago parcial */}
                                <div className="cc-restar-grupo">
                                    <input
                                        type="number"
                                        className="cc-input-monto"
                                        placeholder="Monto a restar..."
                                        value={montoRestar}
                                        min={1}
                                        max={modal.totalRestante}
                                        onChange={e => setMontoRestar(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleRestarPago()}
                                    />
                                    <button className="cc-btn cc-btn--restar" onClick={handleRestarPago}>
                                        − Restar Pago
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </section>
    )
}

export default Seccion1CuentaCorrienteAdmin