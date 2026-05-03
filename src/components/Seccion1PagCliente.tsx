import '../style/Seccion1PagCliente.css'
import { Dispatch, SetStateAction } from 'react'

const Seccion1PagCliente = ({ view, setView }: { view: 'grid' | 'list', setView: Dispatch<SetStateAction<'grid' | 'list'>> }) => {
  return (
    <>
    <div className="filter-bar">
        <h3 className="filter-title">Tipo de Precio</h3>
        <div className="filter-middle">
            <label className="filter-option">
                <input type="checkbox" className="filter-checkbox" defaultChecked/>
                <span className="filter-label">Precio de Venta</span>
            </label>
            <label className="filter-option">
                <input type="checkbox" className="filter-checkbox"/>
                <span className="filter-label">Precio de Costo</span>
            </label>
        </div>
        <div className="filter-right">
            <div className="view-toggle" role="group" aria-label="Vista de productos">
                <button type="button" className={`view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} aria-pressed={view === 'grid'} title="Ver en cuadrícula">
                    <svg className="view-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>
                </button>
                <button type="button" className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} aria-pressed={view === 'list'} title="Ver en lista">
                    <svg className="view-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><rect x="3" y="5" width="4" height="4" rx="1"/></svg>
                </button>
            </div>
        </div>
    </div>
    </>    
  )
}

export default Seccion1PagCliente