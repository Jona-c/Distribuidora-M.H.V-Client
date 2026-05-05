import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('token') || '',
})

export interface Pago {
    _id: string
    monto: number
    fecha: string
}

export interface EntradaCuentaCorriente {
    _id: string
    pedidoId: string
    nroPedido: string
    cliente: {
        id: string
        nombre: string
        apellido: string
    }
    totalOriginal: number
    totalRestante: number
    estado: 'pendiente' | 'pagado'
    pagos: Pago[]
    fechaPedido: string
}

interface CuentaCorrienteContextType {
    entradas: EntradaCuentaCorriente[]         // admin: todas
    misEntradas: EntradaCuentaCorriente[]      // cliente: las suyas
    cargando: boolean
    fetchEntradas: () => Promise<void>
    fetchMisEntradas: () => Promise<void>
    registrarPago: (id: string) => Promise<void>
    restarPago: (id: string, monto: number) => Promise<void>
}

const CuentaCorrienteContext = createContext<CuentaCorrienteContextType>({
    entradas: [],
    misEntradas: [],
    cargando: false,
    fetchEntradas: async () => {},
    fetchMisEntradas: async () => {},
    registrarPago: async () => {},
    restarPago: async () => {},
})

export const CuentaCorrienteProvider = ({ children }: { children: ReactNode }) => {
    const [entradas, setEntradas] = useState<EntradaCuentaCorriente[]>([])
    const [misEntradas, setMisEntradas] = useState<EntradaCuentaCorriente[]>([])
    const [cargando, setCargando] = useState(false)

    // Admin: todas las entradas
    const fetchEntradas = useCallback(async () => {
        setCargando(true)
        try {
            const res = await fetch(`${API_URL}/cuenta-corriente`, { headers: authHeaders() })
            if (res.ok) setEntradas(await res.json())
        } catch (err) {
            console.error('Error al obtener cuenta corriente:', err)
        } finally {
            setCargando(false)
        }
    }, [])

    // Cliente: solo las suyas
    const fetchMisEntradas = useCallback(async () => {
        setCargando(true)
        try {
            const res = await fetch(`${API_URL}/cuenta-corriente/mis-entradas`, { headers: authHeaders() })
            if (res.ok) setMisEntradas(await res.json())
        } catch (err) {
            console.error('Error al obtener mis entradas:', err)
        } finally {
            setCargando(false)
        }
    }, [])

    // Admin: registra pago total → estado: pagado, restante: 0
    const registrarPago = useCallback(async (id: string) => {
        const res = await fetch(`${API_URL}/cuenta-corriente/${id}/registrar-pago`, {
            method: 'PUT',
            headers: authHeaders(),
        })
        if (!res.ok) throw new Error('Error al registrar pago')
        const data = await res.json()
        const actualizar = (prev: EntradaCuentaCorriente[]) =>
            prev.map(e => e._id === id ? data.entrada : e)
        setEntradas(actualizar)
        setMisEntradas(actualizar)
    }, [])

    // Admin: resta un pago parcial
    const restarPago = useCallback(async (id: string, monto: number) => {
        const res = await fetch(`${API_URL}/cuenta-corriente/${id}/restar-pago`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ monto }),
        })
        if (!res.ok) {
            const err = await res.json()
            throw new Error(err.msg || 'Error al restar pago')
        }
        const data = await res.json()
        const actualizar = (prev: EntradaCuentaCorriente[]) =>
            prev.map(e => e._id === id ? data.entrada : e)
        setEntradas(actualizar)
        setMisEntradas(actualizar)
    }, [])

    return (
        <CuentaCorrienteContext.Provider value={{
            entradas, misEntradas, cargando,
            fetchEntradas, fetchMisEntradas, registrarPago, restarPago,
        }}>
            {children}
        </CuentaCorrienteContext.Provider>
    )
}

export const useCuentaCorriente = () => useContext(CuentaCorrienteContext)