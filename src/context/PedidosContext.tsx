import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('token') || '',
})

interface PedidoItem {
    _id: string
    nombre: string
    codigo: string
    precio: number
    cantidad: number
    imagen?: string
}

export interface Pedido {
    _id: string
    cliente: {
        id: string
        nombre: string
        apellido: string
    }
    items: PedidoItem[]
    total: number
    fecha: string
    revisado: boolean
    estado: 'pendiente' | 'completado' | 'cancelado'
}

interface PedidosContextType {
    pedidos: Pedido[]
    pedidosCliente: Pedido[]
    pedidosSinRevisar: number
    cargando: boolean
    fetchPedidos: () => Promise<void>
    fetchPedidosCliente: () => Promise<void>
    marcarComoRevisados: () => Promise<void>
    crearPedido: (items: PedidoItem[], total: number, cliente: Pedido['cliente']) => Promise<void>
    confirmarPedido: (id: string) => Promise<void>
    cancelarPedido: (id: string) => Promise<void>
}

const PedidosContext = createContext<PedidosContextType>({
    pedidos: [],
    pedidosCliente: [],
    pedidosSinRevisar: 0,
    cargando: false,
    fetchPedidos: async () => {},
    fetchPedidosCliente: async () => {},
    marcarComoRevisados: async () => {},
    crearPedido: async () => {},
    confirmarPedido: async () => {},
    cancelarPedido: async () => {},
})

export const PedidosProvider = ({ children }: { children: ReactNode }) => {
    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const [pedidosCliente, setPedidosCliente] = useState<Pedido[]>([])
    const [pedidosSinRevisar, setPedidosSinRevisar] = useState(0)
    const [cargando, setCargando] = useState(false)

    const fetchSinRevisarCount = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/pedidos/sin-revisar/count`, { headers: authHeaders() })
            if (res.ok) {
                const data = await res.json()
                setPedidosSinRevisar(data.count ?? 0)
            }
        } catch (err) {
            console.error('Error al obtener pedidos sin revisar:', err)
        }
    }, [])

    const fetchPedidos = useCallback(async () => {
        setCargando(true)
        try {
            const res = await fetch(`${API_URL}/pedidos`, { headers: authHeaders() })
            if (res.ok) setPedidos(await res.json())
        } catch (err) {
            console.error('Error al obtener pedidos:', err)
        } finally {
            setCargando(false)
        }
    }, [])

    const fetchPedidosCliente = useCallback(async () => {
        setCargando(true)
        try {
            const res = await fetch(`${API_URL}/pedidos/mis-pedidos`, { headers: authHeaders() })
            if (res.ok) setPedidosCliente(await res.json())
        } catch (err) {
            console.error('Error al obtener pedidos del cliente:', err)
        } finally {
            setCargando(false)
        }
    }, [])

    const marcarComoRevisados = useCallback(async () => {
        try {
            await fetch(`${API_URL}/pedidos/marcar-revisados`, { method: 'PUT', headers: authHeaders() })
            setPedidosSinRevisar(0)
        } catch (err) {
            console.error('Error al marcar pedidos como revisados:', err)
        }
    }, [])

    const crearPedido = useCallback(async (
        items: PedidoItem[], total: number, cliente: Pedido['cliente']
    ) => {
        const res = await fetch(`${API_URL}/pedidos`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ cliente, items, total }),
        })
        if (!res.ok) throw new Error('Error al crear el pedido')
        const data = await res.json()
        setPedidosCliente(prev => [data.pedido, ...prev])
        await fetchSinRevisarCount()
    }, [fetchSinRevisarCount])

    // Admin confirma → completado en ambas listas
    const confirmarPedido = useCallback(async (id: string) => {
        const res = await fetch(`${API_URL}/pedidos/${id}/confirmar`, {
            method: 'PUT',
            headers: authHeaders(),
        })
        if (!res.ok) throw new Error('Error al confirmar el pedido')
        const actualizar = (prev: Pedido[]) =>
            prev.map(p => p._id === id ? { ...p, estado: 'completado' as const } : p)
        setPedidos(actualizar)
        setPedidosCliente(actualizar)
    }, [])

    // Admin cancela → cancelado en ambas listas
    const cancelarPedido = useCallback(async (id: string) => {
        const res = await fetch(`${API_URL}/pedidos/${id}/cancelar`, {
            method: 'PUT',
            headers: authHeaders(),
        })
        if (!res.ok) throw new Error('Error al cancelar el pedido')
        const actualizar = (prev: Pedido[]) =>
            prev.map(p => p._id === id ? { ...p, estado: 'cancelado' as const } : p)
        setPedidos(actualizar)
        setPedidosCliente(actualizar)
    }, [])

    useEffect(() => {
        fetchSinRevisarCount()
        const interval = setInterval(fetchSinRevisarCount, 30_000)
        return () => clearInterval(interval)
    }, [fetchSinRevisarCount])

    return (
        <PedidosContext.Provider value={{
            pedidos, pedidosCliente, pedidosSinRevisar, cargando,
            fetchPedidos, fetchPedidosCliente, marcarComoRevisados,
            crearPedido, confirmarPedido, cancelarPedido,
        }}>
            {children}
        </PedidosContext.Provider>
    )
}

export const usePedidos = () => useContext(PedidosContext)