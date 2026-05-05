import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const IMG_URL = import.meta.env.VITE_IMG_URL || 'http://localhost:5000'

const authHeaders = () => ({
    'Authorization': localStorage.getItem('token') || '',
})

export interface Producto {
    _id: string
    nombre: string
    imagen?: string
    codigo: string
    precio: number
    fecha_actualizacion?: string
    categoria?: string
    en_stock: boolean
}

interface ProductosContextType {
    productos: Producto[]
    total: number
    cargando: boolean
    fetchProductos: (pagina: number, categoria?: string | null, busqueda?: string) => Promise<void>
    crearProducto: (form: FormData) => Promise<void>
    editarProducto: (id: string, form: FormData) => Promise<void>
    eliminarProducto: (id: string) => Promise<void>
    getImagenUrl: (imagen?: string) => string
}

const ProductosContext = createContext<ProductosContextType>({
    productos: [],
    total: 0,
    cargando: false,
    fetchProductos: async () => {},
    crearProducto: async () => {},
    editarProducto: async () => {},
    eliminarProducto: async () => {},
    getImagenUrl: () => '',
})

export const ProductosProvider = ({ children }: { children: ReactNode }) => {
    const [productos, setProductos] = useState<Producto[]>([])
    const [total, setTotal] = useState(0)
    const [cargando, setCargando] = useState(false)

    const getImagenUrl = useCallback((imagen?: string) => {
        if (!imagen) return 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=300&fit=crop'
        if (imagen.startsWith('http')) return imagen
        return `${IMG_URL}/${imagen}`
    }, [])

    const fetchProductos = useCallback(async (pagina = 1, categoria?: string | null, busqueda?: string) => {
        setCargando(true)
        try {
            let url = `${API_URL}/ObtenerProductosPaginados?page=${pagina}&limit=6`
            if (categoria) url += `&categoria=${encodeURIComponent(categoria)}`
            if (busqueda)  url += `&busqueda=${encodeURIComponent(busqueda)}`
            const res = await fetch(url)
            if (res.ok) {
                const data = await res.json()
                setProductos(data.results)
                setTotal(data.info?.count ?? 0)
            }
        } catch (err) {
            console.error('Error al obtener productos:', err)
        } finally {
            setCargando(false)
        }
    }, [])

    // Admin: crear producto (multipart/form-data)
    const crearProducto = useCallback(async (form: FormData) => {
        const res = await fetch(`${API_URL}/Productos`, {
            method: 'POST',
            headers: authHeaders(),
            body: form,
        })
        if (!res.ok) throw new Error('Error al crear el producto')
    }, [])

    // Admin: editar producto (multipart/form-data)
    const editarProducto = useCallback(async (id: string, form: FormData) => {
        const res = await fetch(`${API_URL}/EditarProducto/${id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: form,
        })
        if (!res.ok) throw new Error('Error al editar el producto')
    }, [])

    // Admin: eliminar producto
    const eliminarProducto = useCallback(async (id: string) => {
        const res = await fetch(`${API_URL}/EliminarProducto/${id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        })
        if (!res.ok) throw new Error('Error al eliminar el producto')
        setProductos(prev => prev.filter(p => p._id !== id))
    }, [])

    return (
        <ProductosContext.Provider value={{
            productos, total, cargando,
            fetchProductos, crearProducto, editarProducto, eliminarProducto, getImagenUrl,
        }}>
            {children}
        </ProductosContext.Provider>
    )
}

export const useProductos = () => useContext(ProductosContext)