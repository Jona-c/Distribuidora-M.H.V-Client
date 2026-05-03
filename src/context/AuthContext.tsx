import { useState, createContext, useEffect } from "react";
import { getMeFetch } from "../api/getMeFetch";
export const AuthContext = createContext();
import '../style/Loading.css'
import { useNavigate } from 'react-router-dom'

export const AuthProvider = ({ children }) => {
    //usuario estatico(de momento no existe)
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    // relogin
    useEffect(() => {
        (async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const success = await login(token);
                // Si el login falla (token inválido), simplemente limpiar el token
                // No redirigir para permitir navegación libre
                if (!success) {
                    localStorage.removeItem('token');
                    // No redirigir a login - permitir navegación libre
                }
            }
            setLoading(false);
        })();
    }, []);


    //login
    const login = async(token) => {
        if (!token) return false;
        
        try {
            const userData = await getMeFetch(token)
            console.log('usuario recibido', userData);
            
            // Verificar que el usuario tenga role
            if (!userData || !userData.role) {
                console.log('Usuario sin role válido');
                return false;
            }
            
            setUser(userData);
            return true;
        }catch (error) {
            console.log('error en login', error);
            setUser(null);
            return false;
        }
    }

    // logaut
    const logout = () => {
        setUser(null);
        localStorage.clear();
        navigate('/InicioSesion');
    }
    //los datos para utilizar en todo el sitio web
    const data = {
        user,
        setUser,
        login,
        logout,
    }

    // Mostrar spinner mientras carga
    if (loading) {
        return (
            <div className="auth-loading-container">
                <div className="auth-spinner"></div>
            </div>
        );
    }

    //en el contexto
    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};