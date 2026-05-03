import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { CarritoProvider } from './context/CarritoContext.tsx'
import { PedidosProvider } from './context/PedidosContext.tsx'
import { CuentaCorrienteProvider } from './context/CuentaCorrienteContext.tsx'
import { ProductosProvider } from './context/ProductosContext.tsx'  
import 'bootstrap/dist/css/bootstrap.min.css'
import AppRouter from './router/router.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <CarritoProvider>
        <PedidosProvider>
          <CuentaCorrienteProvider>
            <ProductosProvider>           
              <AppRouter />
            </ProductosProvider>           
          </CuentaCorrienteProvider>
        </PedidosProvider>
      </CarritoProvider>
    </AuthProvider>
  </BrowserRouter>
)