import { useEffect, useState } from 'react'
import { usePedidos } from '../context/PedidosContext'
import type { Pedido } from '../context/PedidosContext'
import '../style/Seccion1UltimosPedidos.css'
import Swal from 'sweetalert2'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const estadoLabel: Record<string, { texto: string; clase: string }> = {
    pendiente:  { texto: 'Pendiente',  clase: 'estado--pendiente' },
    completado: { texto: 'Completado', clase: 'estado--completado' },
    cancelado:  { texto: 'Cancelado',  clase: 'estado--cancelado' },
}

// Número de pedido legible: últimos 6 chars del _id en mayúsculas
const nroPedido = (id: string) => id.slice(-6).toUpperCase()

const Seccion1UltimosPedidos = () => {
    const { pedidos, cargando, fetchPedidos, marcarComoRevisados, confirmarPedido, cancelarPedido } = usePedidos()

    // Letra seleccionada en el abecedario
    const [letraActiva, setLetraActiva] = useState<string | null>(null)
    // Pedido abierto en el modal
    const [pedidoModal, setPedidoModal] = useState<Pedido | null>(null)

    useEffect(() => {
        fetchPedidos()
        marcarComoRevisados()
    }, [fetchPedidos, marcarComoRevisados])

    // Solo pendientes aparecen en Últimos Pedidos
    const pedidosActivos = pedidos.filter(p => p.estado === 'pendiente')

    // Letras que tienen al menos un pedido activo
    const letrasConPedidos = new Set(
        pedidosActivos.map(p => p.cliente.apellido[0]?.toUpperCase()).filter(Boolean)
    )

    // Pedidos de la letra seleccionada
    const pedidosDeLaLetra = letraActiva
        ? pedidosActivos.filter(p => p.cliente.apellido[0]?.toUpperCase() === letraActiva)
        : []

    // ── Confirmar pedido ──
    const handleConfirmar = async (pedido: Pedido) => {
        const result = await Swal.fire({
            title: '¿Confirmar pedido?',
            html: `<p style="color:#555">El pedido de <strong>${pedido.cliente.nombre} ${pedido.cliente.apellido}</strong> pasará a <strong>Completado</strong>.</p>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#2d6a4f',
            cancelButtonColor: '#e74c3c',
        })
        if (!result.isConfirmed) return
        try {
            await confirmarPedido(pedido._id)
            setPedidoModal(null)
            await Swal.fire({
                title: '¡Pedido confirmado!',
                text: 'El pedido fue marcado como completado.',
                icon: 'success',
                confirmButtonColor: '#2d6a4f',
                timer: 3000,
                timerProgressBar: true,
            })
        } catch {
            await Swal.fire({ title: 'Error', text: 'No se pudo confirmar el pedido.', icon: 'error', confirmButtonColor: '#e74c3c' })
        }
    }

    // ── Cancelar pedido ──
    const handleCancelar = async (pedido: Pedido) => {
        const result = await Swal.fire({
            title: '¿Cancelar pedido?',
            html: `<p style="color:#555">El pedido de <strong>${pedido.cliente.nombre} ${pedido.cliente.apellido}</strong> será <strong>cancelado</strong>.</p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, mantener',
            confirmButtonColor: '#e74c3c',
            cancelButtonColor: '#6c757d',
        })
        if (!result.isConfirmed) return
        try {
            await cancelarPedido(pedido._id)
            setPedidoModal(null)
            await Swal.fire({
                title: 'Pedido cancelado',
                text: 'El pedido fue marcado como cancelado.',
                icon: 'success',
                confirmButtonColor: '#2d6a4f',
                timer: 3000,
                timerProgressBar: true,
            })
        } catch {
            await Swal.fire({ title: 'Error', text: 'No se pudo cancelar el pedido.', icon: 'error', confirmButtonColor: '#e74c3c' })
        }
    }

    // ── Imprimir pedido ──
    const handleImprimir = (pedido: Pedido) => {
        const ventana = window.open('', '_blank', 'width=700,height=800')
        if (!ventana) return
        const fecha = new Date(pedido.fecha).toLocaleString('es-AR')
        const filas = pedido.items.map(item => `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.codigo}</td>
                <td style="text-align:center">${item.cantidad}</td>
                <td style="text-align:right">$${item.precio.toLocaleString('es-AR')}</td>
                <td style="text-align:right">$${(item.precio * item.cantidad).toLocaleString('es-AR')}</td>
            </tr>`).join('')
        ventana.document.write(`
            <html><head><title>Pedido #${nroPedido(pedido._id)}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 2rem; color: #222; }
                h1 { color: #2d6a4f; } table { width:100%; border-collapse:collapse; margin-top:1rem; }
                th { background:#2d6a4f; color:#fff; padding:8px; text-align:left; }
                td { padding:8px; border-bottom:1px solid #eee; }
                .total { font-size:1.2rem; font-weight:bold; text-align:right; margin-top:1rem; color:#2d6a4f; }
            </style></head><body>
            <h1>Pedido #${nroPedido(pedido._id)}</h1>
            <p><strong>Cliente:</strong> ${pedido.cliente.nombre} ${pedido.cliente.apellido}</p>
            <p><strong>Fecha:</strong> ${fecha}</p>
            <table><thead><tr><th>Producto</th><th>Código</th><th>Cant.</th><th>Precio u.</th><th>Subtotal</th></tr></thead>
            <tbody>${filas}</tbody></table>
            <p class="total">Total: $${pedido.total.toLocaleString('es-AR')}</p>
            <script>window.onload = () => { window.print(); window.close(); }<\/script>
            </body></html>`)
        ventana.document.close()
    }

    if (cargando) {
        return (
            <section className="ultimos-pedidos">
                <div className="pedidos-loading"><span className="pedidos-spinner" /><p>Cargando pedidos...</p></div>
            </section>
        )
    }

    return (
        <section className="ultimos-pedidos">
            <h2 className="pedidos-titulo">📝 Últimos Pedidos</h2>

            {pedidosActivos.length === 0 ? (
                <div className="pedidos-vacio"><span>No hay pedidos pendientes.</span></div>
            ) : (
                <>
                    {/* ── ABECEDARIO ── */}
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

                    {/* ── PANEL DE LISTA POR LETRA ── */}
                    {letraActiva && (
                        <div className="abc-panel">
                            <div className="abc-panel-header">
                                <h3 className="abc-panel-titulo">
                                    Clientes — <span className="abc-panel-letra">{letraActiva}</span>
                                </h3>
                                <button className="abc-panel-cerrar" onClick={() => { setLetraActiva(null); setPedidoModal(null) }}>✕</button>
                            </div>

                            <ul className="abc-lista">
                                {pedidosDeLaLetra.map(pedido => {
                                    const estado = estadoLabel[pedido.estado] ?? { texto: pedido.estado, clase: '' }
                                    const fecha = new Date(pedido.fecha).toLocaleString('es-AR', {
                                        day: '2-digit', month: '2-digit', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit',
                                    })
                                    return (
                                        <li
                                            key={pedido._id}
                                            className={`abc-lista-item ${pedidoModal?._id === pedido._id ? 'abc-lista-item--seleccionado' : ''}`}
                                            onClick={() => setPedidoModal(pedidoModal?._id === pedido._id ? null : pedido)}
                                        >
                                            <div className="abc-item-cliente">
                                                <span className="abc-item-nombre">👤 {pedido.cliente.nombre} {pedido.cliente.apellido}</span>
                                                <span className={`abc-item-estado ${estado.clase}`}>{estado.texto}</span>
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

                    {/* ── MODAL DEL PEDIDO ── */}
                    {pedidoModal && (
                        <div className="pedido-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setPedidoModal(null) }}>
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
                                        <span className={`pedido-estado ${(estadoLabel[pedidoModal.estado] ?? {clase:''}).clase}`}>
                                            {(estadoLabel[pedidoModal.estado] ?? {texto: pedidoModal.estado}).texto}
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

                                {/* Botones */}
                                <div className="pedido-modal-acciones">
                                    <button
                                        className="pedido-modal-btn pedido-modal-btn--confirmar"
                                        onClick={() => handleConfirmar(pedidoModal)}
                                        disabled={pedidoModal.estado === 'completado' || pedidoModal.estado === 'cancelado'}
                                    >
                                        ✓ Confirmar
                                    </button>
                                    <button
                                        className="pedido-modal-btn pedido-modal-btn--cancelar"
                                        onClick={() => handleCancelar(pedidoModal)}
                                        disabled={pedidoModal.estado === 'completado' || pedidoModal.estado === 'cancelado'}
                                    >
                                        ✕ Cancelar
                                    </button>
                                    <button
                                        className="pedido-modal-btn pedido-modal-btn--imprimir"
                                        onClick={() => handleImprimir(pedidoModal)}
                                        title="Imprimir pedido"
                                    >
                                        🖨
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    )
}

export default Seccion1UltimosPedidos