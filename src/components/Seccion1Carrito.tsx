import '../style/Seccion1Carrito.css'
import { useCarrito } from '../context/CarritoContext'
import { usePedidos } from '../context/PedidosContext'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Swal from 'sweetalert2'

const Seccion1Carrito = () => {
    const { items, quitarDelCarrito, cambiarCantidad, vaciarCarrito } = useCarrito()
    const { crearPedido } = usePedidos()
    const { user } = useContext(AuthContext)

    const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

    const handleConfirmarPedido = async () => {
        if (items.length === 0) return

        if (!user || !user.nombre || !user.apellido) {
            await Swal.fire({
                title: 'Sesión no válida',
                text: 'No se pudo obtener tu información. Por favor volvé a iniciar sesión.',
                icon: 'warning',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#e74c3c',
            })
            return
        }

        const confirmacion = await Swal.fire({
            title: '¿Confirmar pedido?',
            html: `
                <p style="margin:0;color:#555">
                    Estás por enviar <strong>${items.length} producto${items.length !== 1 ? 's' : ''}</strong> por un total de:
                </p>
                <p style="font-size:1.5rem;font-weight:700;color:#2d6a4f;margin:8px 0 0">
                    $${total.toLocaleString('es-AR')}
                </p>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#2d6a4f',
            cancelButtonColor: '#e74c3c',
        })

        if (!confirmacion.isConfirmed) return

        try {
            await crearPedido(
                items,
                total,
                {
                    id:       '',
                    nombre:   user.nombre,
                    apellido: user.apellido,
                }
            )

            vaciarCarrito()

            await Swal.fire({
                title: '¡Pedido enviado!',
                html: `
                    <p style="color:#555;margin:0">Tu pedido fue recibido correctamente.</p>
                    <p style="color:#555;margin:4px 0 0">Nos pondremos en contacto a la brevedad.</p>
                `,
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#2d6a4f',
                timer: 4000,
                timerProgressBar: true,
            })
        } catch {
            await Swal.fire({
                title: 'Error',
                text: 'No se pudo enviar el pedido. Intentá de nuevo más tarde.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#e74c3c',
            })
        }
    }

    return (
        <section className="seccion1-carrito">
            <h2 className="carrito-titulo">🛒 Mi Carrito</h2>

            {items.length === 0 ? (
                <div className="carrito-box carrito-vacio">
                    <span>No hay productos en el carrito</span>
                </div>
            ) : (
                <>
                    <ul className="carrito-lista">
                        {items.map(item => (
                            <li className="carrito-item" key={item._id}>
                                <img
                                    src={item.imagen || 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=300&fit=crop'}
                                    alt={item.nombre}
                                    className="carrito-item-imagen"
                                />
                                <div className="carrito-item-info">
                                    <h3 className="carrito-item-nombre">{item.nombre}</h3>
                                    <p className="carrito-item-codigo">Código: {item.codigo}</p>
                                    <p className="carrito-item-precio-unit">${item.precio} c/u</p>
                                </div>
                                <div className="carrito-item-controles">
                                    <button className="carrito-btn-cantidad" onClick={() => cambiarCantidad(item._id, item.cantidad - 1)}>−</button>
                                    <span className="carrito-item-cantidad">{item.cantidad}</span>
                                    <button className="carrito-btn-cantidad" onClick={() => cambiarCantidad(item._id, item.cantidad + 1)}>+</button>
                                </div>
                                <div className="carrito-item-subtotal">
                                    ${item.precio * item.cantidad}
                                </div>
                                <button className="carrito-btn-eliminar" onClick={() => quitarDelCarrito(item._id)} aria-label="Eliminar">✕</button>
                            </li>
                        ))}
                    </ul>

                    <div className="carrito-footer">
                        <span className="carrito-total-label">Total:</span>
                        <span className="carrito-total-precio">${total.toLocaleString('es-AR')}</span>
                        <button className="carrito-btn-comprar" onClick={handleConfirmarPedido}>
                            Confirmar pedido
                        </button>
                    </div>
                </>
            )}
        </section>
    )
}

export default Seccion1Carrito