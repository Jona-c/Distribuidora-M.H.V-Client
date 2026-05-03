import { useEffect, useState } from 'react'
import { usePedidos } from '../context/PedidosContext'
import type { Pedido } from '../context/PedidosContext'
import '../style/Seccion1TotalPedidosCliente.css'
import Swal from 'sweetalert2'

type FiltroEstado = 'todos' | 'pendiente' | 'completado' | 'cancelado'

const estadoLabel: Record<string, { texto: string; clase: string; icono: string }> = {
    pendiente:  { texto: 'Pendiente',  clase: 'estado--pendiente',  icono: '⏳' },
    completado: { texto: 'Completado', clase: 'estado--completado', icono: '✅' },
    cancelado:  { texto: 'Cancelado',  clase: 'estado--cancelado',  icono: '❌' },
}

const nroPedido = (id: string) => id.slice(-6).toUpperCase()

const Seccion1TotalPedidosCliente = () => {
    const { pedidosCliente, cargando, fetchPedidosCliente, cancelarPedido } = usePedidos()
    const [filtro, setFiltro] = useState<FiltroEstado>('todos')
    const [pedidoModal, setPedidoModal] = useState<Pedido | null>(null)

    useEffect(() => {
        fetchPedidosCliente()
    }, [fetchPedidosCliente])

    const handleCancelar = async (id: string) => {
        const result = await Swal.fire({
            title: '¿Cancelar pedido?',
            html: '<p style="color:#555">¿Estás seguro de que deseas <strong>cancelar</strong> este pedido?</p>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, mantener',
            confirmButtonColor: '#e74c3c',
            cancelButtonColor: '#6c757d',
        })

        if (!result.isConfirmed) return

        try {
            await cancelarPedido(id)
            setPedidoModal(null)
            await Swal.fire({
                title: '¡Pedido cancelado!',
                text: 'Tu pedido fue cancelado exitosamente.',
                icon: 'info',
                confirmButtonColor: '#e74c3c',
                timer: 3000,
                timerProgressBar: true,
            })
        } catch {
            await Swal.fire({
                title: 'Error',
                text: 'No se pudo cancelar el pedido. Intentá de nuevo.',
                icon: 'error',
                confirmButtonColor: '#e74c3c',
            })
        }
    }

    if (cargando) {
        return (
            <section className="total-pedidos-cliente">
                <div className="tpc-loading">
                    <span className="tpc-spinner" />
                    <p>Cargando tus pedidos...</p>
                </div>
            </section>
        )
    }

    // Filtrar pedidos
    const pedidosFiltrados = filtro === 'todos' 
        ? pedidosCliente 
        : pedidosCliente.filter(p => p.estado === filtro)

    // Contadores para los tabs
    const counts = {
        todos: pedidosCliente.length,
        pendiente: pedidosCliente.filter(p => p.estado === 'pendiente').length,
        completado: pedidosCliente.filter(p => p.estado === 'completado').length,
        cancelado: pedidosCliente.filter(p => p.estado === 'cancelado').length,
    }

    return (
        <section className="total-pedidos-cliente">
            <h2 className="tpc-titulo">📋 Mis Pedidos</h2>

            {/* Filtros de tabs */}
            <div className="tpc-filtros">
                <button
                    className={`tpc-filtro-btn ${filtro === 'todos' ? 'tpc-filtro-btn--active' : ''}`}
                    onClick={() => setFiltro('todos')}
                >
                    Todos ({counts.todos})
                </button>
                <button
                    className={`tpc-filtro-btn ${filtro === 'pendiente' ? 'tpc-filtro-btn--active' : ''}`}
                    onClick={() => setFiltro('pendiente')}
                >
                    ⏳ Pendientes ({counts.pendiente})
                </button>
                <button
                    className={`tpc-filtro-btn ${filtro === 'completado' ? 'tpc-filtro-btn--active' : ''}`}
                    onClick={() => setFiltro('completado')}
                >
                    ✅ Completados ({counts.completado})
                </button>
                <button
                    className={`tpc-filtro-btn ${filtro === 'cancelado' ? 'tpc-filtro-btn--active' : ''}`}
                    onClick={() => setFiltro('cancelado')}
                >
                    ❌ Cancelados ({counts.cancelado})
                </button>
            </div>

            {pedidosFiltrados.length === 0 ? (
                <div className="tpc-vacio">
                    <span>No tienes pedidos en esta categoría.</span>
                </div>
            ) : (
                <ul className="tpc-lista">
                    {pedidosFiltrados.map(pedido => {
                        const estado = estadoLabel[pedido.estado] ?? { texto: pedido.estado, clase: '', icono: '📦' }
                        const fecha = new Date(pedido.fecha).toLocaleString('es-AR', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                        })

                        return (
                            <li 
                                className={`tpc-card ${pedidoModal?._id === pedido._id ? 'tpc-card--seleccionado' : ''}`}
                                key={pedido._id}
                                onClick={() => setPedidoModal(pedidoModal?._id === pedido._id ? null : pedido)}
                            >
                                <div className="tpc-card-info">
                                    <div className="tpc-card-nro">Pedido #{nroPedido(pedido._id)}</div>
                                    <div className="tpc-card-fecha">{fecha}</div>
                                </div>
                                <div className="tpc-card-resumen">
                                    <span className="tpc-card-cant-items">{pedido.items.length} producto{pedido.items.length !== 1 ? 's' : ''}</span>
                                    <span className={`tpc-card-estado ${estado.clase}`}>
                                        {estado.icono} {estado.texto}
                                    </span>
                                </div>
                                <div className="tpc-card-total">
                                    <span className="tpc-card-total-label">Total:</span>
                                    <span className="tpc-card-total-precio">${pedido.total.toLocaleString('es-AR')}</span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}

            {/* MODAL DE DETALLE */}
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
                                <p className="pedido-modal-fecha">
                                    {new Date(pedidoModal.fecha).toLocaleString('es-AR', {
                                        day: '2-digit', month: '2-digit', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            <div className="pedido-modal-header-right">
                                <span className={`tpc-card-estado ${estadoLabel[pedidoModal.estado]?.clase || ''}`}>
                                    {estadoLabel[pedidoModal.estado]?.icono} {estadoLabel[pedidoModal.estado]?.texto}
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

                        {/* Botón cancelar en modal */}
                        {(pedidoModal.estado === 'pendiente') && (
                            <div className="pedido-modal-acciones">
                                <button
                                    className="pedido-btn-cancelar"
                                    onClick={() => handleCancelar(pedidoModal._id)}
                                >
                                    ✕ Cancelar pedido
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </section>
    )
}

export default Seccion1TotalPedidosCliente