import { useEffect, useState } from 'react'
import { usePedidos } from '../context/PedidosContext'
import type { Pedido } from '../context/PedidosContext'
import '../style/Seccion1TotalPedidosAdmin.css'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

type FiltroEstado = 'completado' | 'cancelado'

const estadoBadge: Record<FiltroEstado, { texto: string; clase: string }> = {
    completado: { texto: '✅ Completado', clase: 'tpa-badge-completado' },
    cancelado:  { texto: '❌ Cancelado',  clase: 'tpa-badge-cancelado' },
}

const nroPedido = (id: string) => id.slice(-6).toUpperCase()

const Seccion1TotalPedidosAdmin = () => {
    const { pedidos, cargando, fetchPedidos } = usePedidos()
    const [filtro, setFiltro] = useState<FiltroEstado>('completado')
    const [letraActiva, setLetraActiva] = useState<string | null>(null)
    const [pedidoModal, setPedidoModal] = useState<Pedido | null>(null)

    useEffect(() => {
        fetchPedidos()
    }, [fetchPedidos])

    const handleFiltro = (f: FiltroEstado) => {
        setFiltro(f)
        setLetraActiva(null)
        setPedidoModal(null)
    }

    const pedidosFiltrados = pedidos.filter(p => p.estado === filtro)

    const letrasConPedidos = new Set(
        pedidosFiltrados.map(p => p.cliente.apellido[0]?.toUpperCase()).filter(Boolean)
    )

    const pedidosDeLaLetra = letraActiva
        ? pedidosFiltrados.filter(p => p.cliente.apellido[0]?.toUpperCase() === letraActiva)
        : []

    const totalCompletados = pedidos.filter(p => p.estado === 'completado').length
    const totalCancelados  = pedidos.filter(p => p.estado === 'cancelado').length
    const facturado = pedidos.filter(p => p.estado === 'completado').reduce((acc, p) => acc + p.total, 0)

    if (cargando) {
        return (
            <section className="total-pedidos-admin">
                <div className="tpa-loading"><span className="tpa-spinner" /><p>Cargando pedidos...</p></div>
            </section>
        )
    }

    return (
        <section className="total-pedidos-admin">
            <h2 className="tpa-titulo">📋 Pedidos Procesados</h2>

            {/* Resumen */}
            <div className="tpa-resumen">
                <div className="tpa-resumen-card">
                    <span className="tpa-resumen-num">{totalCompletados}</span>
                    <span className="tpa-resumen-label">Completados</span>
                </div>
                <div className="tpa-resumen-card">
                    <span className="tpa-resumen-num">{totalCancelados}</span>
                    <span className="tpa-resumen-label">Cancelados</span>
                </div>
                <div className="tpa-resumen-card">
                    <span className="tpa-resumen-num">${facturado.toLocaleString('es-AR')}</span>
                    <span className="tpa-resumen-label">Total facturado</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="tpa-filtros">
                <button
                    className={`tpa-filtro-btn ${filtro === 'completado' ? 'tpa-filtro-btn--active' : ''}`}
                    onClick={() => handleFiltro('completado')}
                >
                    ✅ Completados ({totalCompletados})
                </button>
                <button
                    className={`tpa-filtro-btn ${filtro === 'cancelado' ? 'tpa-filtro-btn--active' : ''}`}
                    onClick={() => handleFiltro('cancelado')}
                >
                    ❌ Cancelados ({totalCancelados})
                </button>
            </div>

            {pedidosFiltrados.length === 0 ? (
                <div className="tpa-vacio">
                    <span>No hay pedidos {filtro === 'completado' ? 'completados' : 'cancelados'} todavía.</span>
                </div>
            ) : (
                <>
                    {/* ABECEDARIO */}
                    <div className="abecedario">
                        {ALPHABET.map(letra => {
                            const activa = letrasConPedidos.has(letra)
                            const seleccionada = letraActiva === letra
                            return (
                                <button
                                    key={letra}
                                    className={`abc-btn ${activa ? 'abc-btn--activa' : 'abc-btn--inactiva'} ${seleccionada ? 'abc-btn--seleccionada' : ''}`}
                                    onClick={() => {
                                        if (!activa) return
                                        setLetraActiva(prev => prev === letra ? null : letra)
                                        setPedidoModal(null)
                                    }}
                                    disabled={!activa}
                                >
                                    {letra}
                                </button>
                            )
                        })}
                    </div>

                    {/* PANEL DE LISTA POR LETRA */}
                    {letraActiva && (
                        <div className="abc-panel">
                            <div className="abc-panel-header">
                                <h3 className="abc-panel-titulo">
                                    Clientes — <span className="abc-panel-letra">{letraActiva}</span>
                                    <span className="abc-panel-subtitulo">
                                        {filtro === 'completado' ? 'Completados' : 'Cancelados'}
                                    </span>
                                </h3>
                                <button className="abc-panel-cerrar" onClick={() => { setLetraActiva(null); setPedidoModal(null) }}>✕</button>
                            </div>

                            <ul className="abc-lista">
                                {pedidosDeLaLetra.map(pedido => {
                                    const fecha = new Date(pedido.fecha).toLocaleString('es-AR', {
                                        day: '2-digit', month: '2-digit', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit',
                                    })
                                    const badge = estadoBadge[filtro]
                                    return (
                                        <li
                                            key={pedido._id}
                                            className={`abc-lista-item ${pedidoModal?._id === pedido._id ? 'abc-lista-item--seleccionado' : ''}`}
                                            onClick={() => setPedidoModal(pedidoModal?._id === pedido._id ? null : pedido)}
                                        >
                                            <div className="abc-item-cliente">
                                                <span className="abc-item-nombre">👤 {pedido.cliente.nombre} {pedido.cliente.apellido}</span>
                                                <span className={`abc-item-estado ${badge.clase}`}>{badge.texto}</span>
                                            </div>
                                            <div className="abc-item-meta">
                                                <span className="abc-item-nro">Pedido #{nroPedido(pedido._id)}</span>
                                                <span className="abc-item-fecha">{fecha}</span>
                                                <span className="abc-item-total">${pedido.total.toLocaleString('es-AR')}</span>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}
                </>
            )}

            {/* MODAL DE DETALLE — igual al de UltimosPedidos pero sin botones de acción */}
            {pedidoModal && (
                <div
                    className="pedido-modal-overlay"
                    onClick={(e) => { if (e.target === e.currentTarget) setPedidoModal(null) }}
                >
                    <div className="pedido-modal">

                        {/* Encabezado */}
                        <div className="pedido-modal-header">
                            <div>
                                <h3 className="pedido-modal-titulo">
                                    Pedido <span className="pedido-modal-nro">#{nroPedido(pedidoModal._id)}</span>
                                </h3>
                                <p className="pedido-modal-cliente">
                                    👤 {pedidoModal.cliente.nombre} {pedidoModal.cliente.apellido}
                                </p>
                                <p className="pedido-modal-fecha">
                                    {new Date(pedidoModal.fecha).toLocaleString('es-AR', {
                                        day: '2-digit', month: '2-digit', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            <div className="pedido-modal-header-right">
                                <span className={`abc-item-estado ${estadoBadge[filtro].clase}`}>
                                    {estadoBadge[filtro].texto}
                                </span>
                                <button className="pedido-modal-cerrar" onClick={() => setPedidoModal(null)}>✕</button>
                            </div>
                        </div>

                        {/* Items */}
                        <ul className="pedido-modal-items">
                            {pedidoModal.items.map(item => (
                                <li className="pedido-modal-item" key={item._id}>
                                    <img
                                        src={item.imagen || 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=80&h=60&fit=crop'}
                                        alt={item.nombre}
                                        className="pedido-modal-item-img"
                                    />
                                    <div className="pedido-modal-item-detalle">
                                        <span className="pedido-modal-item-nombre">{item.nombre}</span>
                                        <span className="pedido-modal-item-codigo">Cód: {item.codigo}</span>
                                    </div>
                                    <div className="pedido-modal-item-nums">
                                        <span className="pedido-modal-item-cant">×{item.cantidad}</span>
                                        <span className="pedido-modal-item-subtotal">
                                            ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Total */}
                        <div className="pedido-modal-footer">
                            <span className="pedido-modal-total-label">Total del pedido:</span>
                            <span className="pedido-modal-total-precio">
                                ${pedidoModal.total.toLocaleString('es-AR')}
                            </span>
                        </div>

                    </div>
                </div>
            )}
        </section>
    )
}

export default Seccion1TotalPedidosAdmin