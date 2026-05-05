import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface ItemCarrito {
    _id: string
    nombre: string
    precio: number
    imagen: string
    codigo: string
    cantidad: number
}

interface CarritoContextType {
    items: ItemCarrito[]
    agregarAlCarrito: (producto: any, cantidad: number) => void
    quitarDelCarrito: (id: string) => void
    cambiarCantidad: (id: string, cantidad: number) => void
    vaciarCarrito: () => void
    totalItems: number
}

export const CarritoContext = createContext<CarritoContextType>({
    items: [],
    agregarAlCarrito: () => {},
    quitarDelCarrito: () => {},
    cambiarCantidad: () => {},
    vaciarCarrito: () => {},
    totalItems: 0,
})

export const useCarrito = () => useContext(CarritoContext)

const CLAVE_STORAGE = 'carrito_items'

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<ItemCarrito[]>(() => {
        try {
            const guardado = localStorage.getItem(CLAVE_STORAGE)
            return guardado ? JSON.parse(guardado) : []
        } catch {
            return []
        }
    })

    useEffect(() => {
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items))
    }, [items])

    const agregarAlCarrito = (producto: any, cantidad: number) => {
        setItems(prev => {
            const existe = prev.find(i => i._id === producto._id)
            if (existe) {
                return prev.map(i =>
                    i._id === producto._id
                        ? { ...i, cantidad: i.cantidad + cantidad }
                        : i
                )
            }
            return [...prev, {
                _id: producto._id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                codigo: producto.codigo,
                cantidad,
            }]
        })
    }

    const quitarDelCarrito = (id: string) => {
        setItems(prev => prev.filter(i => i._id !== id))
    }

    const cambiarCantidad = (id: string, cantidad: number) => {
        if (cantidad <= 0) return quitarDelCarrito(id)
        setItems(prev => prev.map(i => i._id === id ? { ...i, cantidad } : i))
    }

    // vacía el carrito completo y limpia localStorage
    const vaciarCarrito = () => {
        setItems([])
        localStorage.removeItem(CLAVE_STORAGE)
    }

    const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)

    return (
        <CarritoContext.Provider value={{ items, agregarAlCarrito, quitarDelCarrito, cambiarCantidad, vaciarCarrito, totalItems }}>
            {children}
        </CarritoContext.Provider>
    )
}