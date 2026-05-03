import '../style/ContenedorPrincipalPagCliente.css'
import { useState } from 'react'
import ProductosClientes from './ProductosClientes'
import importadoNacional from '../assets/importado-nacional.png'
import bremen from '../assets/bremen.png'
import wembley from '../assets/wembley.png'
import pietra from '../assets/pietra.png'
import tornillosAllen from '../assets/tornillosAllen.png'
import articulosDeLimpieza from '../assets/articulos de limpieza.png'
import accesoriosDePileta from '../assets/accesorios de pileta.png'
import limpiafondoAccesorios from '../assets/limpiafondos.png'
import cloro from '../assets/cloro.png'
import bulong5 from '../assets/bulon g5.png'

const categorias = [
  { nombre: 'IMPORTADO-NACIONAL', imagen: importadoNacional },
  { nombre: 'BREMEN',             imagen: bremen },
  { nombre: 'WEMBLEY',            imagen: wembley },
  { nombre: 'BULON G5',           imagen: bulong5 },
  { nombre: 'PIETRA',             imagen: pietra },
  { nombre: 'TORNILLOS ALLEN',    imagen: tornillosAllen },
  { nombre: 'ARTICULOS DE LIMPIEZA', imagen: articulosDeLimpieza },
  { nombre: 'ACCESORIOS DE PILETA',  imagen: accesoriosDePileta },
  { nombre: 'LIMPIAFONDO-ACCESORIOS', imagen: limpiafondoAccesorios },
  { nombre: 'CLORO',              imagen: cloro },
]

const ContenedorPrincipalPagCliente = ({ vista = 'grilla', busqueda = '' }: { vista?: 'grilla' | 'lista', busqueda?: string }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null)

  const handleCategoria = (nombre: string) => {
    // Si ya está activa, deselecciona y muestra todos
    setCategoriaActiva(prev => prev === nombre ? null : nombre)
  }

  return (
    <div className="main-container">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} aria-expanded={!collapsed}>
        <div className="sidebar-header" role="toolbar">
          <h3 className="sidebar-title">Categorías</h3>
          <button
            type="button"
            className={`toggle-button ${collapsed ? 'collapsed' : ''}`}
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
            aria-pressed={collapsed}
          >
            <span className="arrow" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>

        <ul className="category-list">
          {categorias.map(cat => (
            <li
              key={cat.nombre}
              className={`category-item ${categoriaActiva === cat.nombre ? 'activa' : ''}`}
              onClick={() => handleCategoria(cat.nombre)}
              style={{ cursor: 'pointer' }}
            >
              <img src={cat.imagen} alt={cat.nombre} className="brand-logo1" />
              <span className="category-name">{cat.nombre}</span>
            </li>
          ))}
        </ul>
      </aside>

      <ProductosClientes vista={vista} categoria={categoriaActiva} busqueda={busqueda} />
    </div>
  )
}

export default ContenedorPrincipalPagCliente