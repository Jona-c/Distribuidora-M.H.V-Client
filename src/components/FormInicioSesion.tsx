import '../style/FormInicioSesion.css'
import '../style/HeaderInicioSesion.css' 
import { useContext, useState } from 'react'
import {FaEye , FaEyeSlash} from 'react-icons/fa'
import { inicioSesionFetch } from '../api/inicioSesionFetch.ts'
import { AuthContext } from '../context/AuthContext.tsx' 
import { useNavigate } from 'react-router-dom'

const FormInicioSesion = () => {
    const { login } = useContext(AuthContext); 
    const navigate = useNavigate();

    //datos del formulario

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

     // Estado para mostrar/ocultar contraseña
    const [showPassword, setShowPassword] = useState(false);

    //validacion del formulario

    const [error, setError] = useState(null);
    

    const handleInputChange = (e:any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    //obtener datos del formulario

    const handleSubmit = async (e:any) => {
    e.preventDefault();

    try {
        // ✅ Obtener datos del servidor
        const response = await inicioSesionFetch(formData);
        const { token, role } = response;
        
        // ✅ Guardar token primero
        localStorage.setItem('token', token);
        
        // ✅ Luego hacer login con el token
        const success = await login(token);
        
        if (!success) {
            localStorage.removeItem('token');
            setError('Error al verificar credenciales');
            return;
        }
        
        setError(false);

        // ✅ Redirige según el rol
        if (role === 'admin') {
            navigate('/PaginaAdmin');
        } else {
            navigate('/PaginaCliente');
        }

    } catch (err:any) {
        setError(err.msg);
    }
};


    return (
        <>
            <div className="login-page-wrapper">
                <div className="login-container">
                    <div className="header-section">
                        <h1 className="header-title">
                            Iniciar <span className="brand-text">Sesión</span>
                        </h1>
                        <p className="header-subtitle">Accede a tu cuenta de Distribuidora M.H.V</p>
                    </div>

                    <div className="form-section">
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Email del Usuario <span className="required">*</span></label>
                                <input type="text" className="form-input" 
                                        name='email'
                                        placeholder="Ingrese su email"
                                        value={formData.email}
                                        onChange={handleInputChange}/>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Contraseña <span className="required">*</span></label>
                                <div className="password-wrapper">
                                    <input 
                                            type={showPassword ? "text" : "password"} 
                                            className="form-input" 
                                            name='password'
                                            placeholder="Ingrese su contraseña"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            />

                                    <button
                                        type="button"
                                        className="eye-button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>

                                <div className="forgot-password">
                                    <a href="#">¿Olvidaste tu contraseña?</a>
                                </div>
                            </div>

                            {error && <p className="alert alert-danger">{error}</p>}
                            <button type="submit" className="btn-submit">Iniciar Sesión</button>
                        </form>

                        <div className="register-link">
                            ¿No tienes cuenta? <a href="/Registrarse">Regístrate aquí</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
    
}


export default FormInicioSesion