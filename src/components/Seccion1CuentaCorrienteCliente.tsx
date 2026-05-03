import { useEffect, useState } from 'react'
import { useCuentaCorriente } from '../context/CuentaCorrienteContext'
import type { EntradaCuentaCorriente } from '../context/CuentaCorrienteContext'
import '../style/Seccion1CuentaCorrienteCliente.css'

const Seccion1CuentaCorrienteCliente = () => {
    const { misEntradas, cargando, fetchMisEntradas } = useCuentaCorriente()

    const [filtro, setFiltro] = useState<'pendiente' | 'pagado'>('pendiente')
    const [modal, setModal] = useState<EntradaCuentaCorriente | null>(null)

    useEffect(() => { fetchMisEntradas() }, [fetchMisEntradas])

    const entradasFiltradas = misEntradas.filter(e => e.estado === filtro)
    const totalDeuda = misEntradas.filter(e => e.estado === 'pendiente').reduce((acc, e) => acc + e.totalRestante, 0)

    if (cargando) {
        return (
            <section className="cc-cliente">
                <div className="ccc-loading"><span className="ccc-spinner" /><p>Cargando tu cuenta corriente...</p></div>
            </section>
        )
    }

    return (
        <section className="cc-cliente">
            <h2 className="ccc-titulo">💳 Mi Cuenta Corriente</h2>

            <div className="ccc-resumen">
                <div className={`ccc-resumen-card ${totalDeuda > 0 ? 'ccc-resumen-card--deuda' : 'ccc-resumen-card--ok'}`}>
                    <span className="ccc-resumen-num">${totalDeuda.toLocaleString('es-AR')}</span>
                    <span className="ccc-resumen-label">Saldo pendiente</span>
                </div>
                <div className="ccc-resumen-card ccc-resumen-card--ok">
                    <span className="ccc-resumen-num">{misEntradas.filter(e => e.estado === 'pagado').length}</span>
                    <span className="ccc-resumen-label">Cuentas saldadas</span>
                </div>
            </div>

            <div className="ccc-filtros">
                <button className={`ccc-filtro-btn ${filtro === 'pendiente' ? 'ccc-filtro-btn--active' : ''}`} onClick={() => { setFiltro('pendiente'); setModal(null) }}>
                    ⏳ Pendientes ({misEntradas.filter(e => e.estado === 'pendiente').length})
                </button>
                <button className={`ccc-filtro-btn ${filtro === 'pagado' ? 'ccc-filtro-btn--active' : ''}`} onClick={() => { setFiltro('pagado'); setModal(null) }}>
                    ✅ Pagados ({misEntradas.filter(e => e.estado === 'pagado').length})
                </button>
            </div>

            {entradasFiltradas.length === 0 ? (
                <div className="ccc-vacio">
                    <span>No tenés cuentas {filtro === 'pendiente' ? 'pendientes' : 'pagadas'} todavía.</span>
                </div>
            ) : (
                <ul className="ccc-lista">
                    {entradasFiltradas.map(entrada => {
                        const fecha = new Date(entrada.fechaPedido).toLocaleString('es-AR', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                        })
                        return (
                            <li
                                key={entrada._id}
                                className={`ccc-item ${modal?._id === entrada._id ? 'ccc-item--seleccionado' : ''}`}
                                onClick={() => setModal(modal?._id === entrada._id ? null : entrada)}
                            >
                                <div className="ccc-item-top">
                                    <span className="ccc-item-nombre">📦 {entrada.cliente.nombre} {entrada.cliente.apellido}</span>
                                    <span className={`ccc-item-badge ${entrada.estado === 'pendiente' ? 'cc-badge--pendiente' : 'cc-badge--pagado'}`}>
                                        {entrada.estado === 'pendiente' ? '⏳ Pago Pendiente' : '✅ Pago Exitoso'}
                                    </span>
                                </div>
                                <div className="ccc-item-meta">
                                    <span className="ccc-item-nro">Pedido #{entrada.nroPedido}</span>
                                    <span className="ccc-item-fecha">{fecha}</span>
                                    <span className="ccc-item-total">${entrada.totalRestante.toLocaleString('es-AR')}</span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}

            {modal && (
                <div className="pedido-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
                    <div className="pedido-modal">
                        <div className="pedido-modal-header">
                            <div>
                                <h3 className="pedido-modal-titulo">Pedido <span className="pedido-modal-nro">#{modal.nroPedido}</span></h3>
                                <p className="pedido-modal-cliente">📦 Pedido realizado el {new Date(modal.fechaPedido).toLocaleDateString('es-AR')}</p>
                            </div>
                            <div className="pedido-modal-header-right">
                                <span className={`ccc-item-badge ${modal.estado === 'pendiente' ? 'cc-badge--pendiente' : 'cc-badge--pagado'}`}>
                                    {modal.estado === 'pendiente' ? '⏳ Pago Pendiente' : '✅ Pago Exitoso'}
                                </span>
                                <button className="pedido-modal-cerrar" onClick={() => setModal(null)}>✕</button>
                            </div>
                        </div>

                        <div className="cc-modal-montos">
                            <div className="cc-monto-row">
                                <span className="cc-monto-label">Total del pedido:</span>
                                <span className="cc-monto-valor">${modal.totalOriginal.toLocaleString('es-AR')}</span>
                            </div>
                            <div className="cc-monto-row cc-monto-row--restante">
                                <span className="cc-monto-label">Saldo restante:</span>
                                <span className={`cc-monto-valor cc-monto-valor--restante ${modal.totalRestante === 0 ? 'cc-monto-valor--cero' : ''}`}>
                                    ${modal.totalRestante.toLocaleString('es-AR')}
                                </span>
                            </div>
                            {modal.pagos.length > 0 && (
                                <div className="cc-pagos-historial">
                                    <p className="cc-pagos-titulo">Pagos realizados:</p>
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

                        <div className="pedido-modal-footer">
                            <span className="pedido-modal-total-label">Saldo a pagar:</span>
                            <span className="pedido-modal-total-precio">${modal.totalRestante.toLocaleString('es-AR')}</span>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default Seccion1CuentaCorrienteCliente