import '../style/FormRegistrarse.css'
import '../style/HeaderRegistrarse.css'
import { useState } from 'react'
import { registerFetch } from '../api/registerFetch.ts'
import {FaEye , FaEyeSlash} from 'react-icons/fa'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const FormRegistrarse = () => {

    const navigate = useNavigate();

    //Datos del formulario

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        razon_social: '',
        email: '',
        telefono: '',
        direccion: '',
        localidad: '',
        provincia: '',
        cuit: '',
        condicion_IVA: '',
        password: ''

    });

    // Estado para mostrar/ocultar contraseña
    const [showPassword, setShowPassword] = useState(false);

    // Validacion de formulario

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    // Obtener los datos del formulario de registro

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const resp = await registerFetch(formData);
            setSuccess(resp.msg);
            setError(false);

             // Mostrar SweetAlert de éxito
            Swal.fire({
                icon: 'success',
                title: 'Registro Exitoso',
                text: 'Aguarde a ser activado por un administrador',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#d63030ff',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/');
                }
            });

        }catch (error) {
            setError(error.msg);
            setSuccess(false);
        }
        
        console.log(formData);
    }


    return (
        <>
            <div className="register-page-wrapper">
                <div className="register-page">
                    <div className="header-section">
                        <h1 className="header-title">Registrarse</h1>
                        <p className="header-subtitle">Complete el formulario para solicitar su registro</p>
                    </div>

                    <form className="registration-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Nombre<span className="required">*</span></label>
                                <input type="text" className="form-input" 
                                    name='nombre'
                                    placeholder="Ingrese su nombre"
                                    value={formData.nombre} 
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Apellido <span className="required">*</span></label>
                                <input type="text" className="form-input" 
                                    name='apellido'
                                    placeholder="Ingrese su apellido"
                                    value={formData.apellido}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-group form-group-full">
                            <label className="form-label">Razón Social</label>
                            <input type="text" className="form-input" 
                                name='razon_social'
                                placeholder="Ingrese la razón social"
                                value={formData.razon_social}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Email <span className="required">*</span></label>
                                <input type="email" className="form-input" 
                                name='email'
                                    placeholder="ejemplo@correo.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Teléfono o Whatsapp<span className="required">*</span></label>
                                <input type="tel" className="form-input" 
                                    name='telefono'
                                    placeholder="Ingrese numero"
                                    value={formData.telefono}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-group form-group-full">
                            <label className="form-label">Dirección <span className="required">*</span></label>
                            <input type="text" className="form-input" 
                                name='direccion'
                                placeholder="Calle y número"
                                value={formData.direccion}
                                onChange={handleInputChange}
                            />   
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Localidad <span className="required">*</span></label>
                                <input type="text" className="form-input" 
                                    name='localidad'
                                    placeholder="Ingrese su localidad"
                                    value={formData.localidad}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Provincia <span className="required">*</span></label>
                                <input type="text" className="form-input" 
                                    name='provincia'
                                    placeholder="ingrese provincia"
                                    value={formData.provincia}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-group form-group-full">
                            <label className="form-label">Cuit <span className="required">*</span></label>
                            <input type="text" className="form-input" 
                                name='cuit'
                                placeholder="ingrese numero"
                                value={formData.cuit}
                                onChange={handleInputChange}
                            />
                        </div>


                        <div className="form-group form-group-full">
                            <label className="form-label">Condición IVA <span className="required">*</span></label>
                            <select 
                                className="form-select" 
                                name='condicion_IVA'
                                value={formData.condicion_IVA}
                                onChange={handleInputChange}
                            >
                                <option value="">Seleccione su condición ante el IVA</option>
                                <option value="responsable-inscripto">Responsable Inscripto</option>
                                <option value="monotributista">Monotributista</option>
                                <option value="exento">Exento</option>
                                <option value="consumidor-final">Consumidor Final</option>
                            </select>
                        </div>

                        <div className="form-group form-group-full">
                            <label className="form-label">Contraseña <span className="required">*</span></label>
                            <div className="password-wrapper">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="form-input" 
                                    name='password'
                                    placeholder="ingrese la contraseña" 
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
                        </div>

                        {error && <p className="alert alert-danger mt-2">{error}</p>}
                        <div className="submit-section">
                            <button type="submit" className="btn-submit">Enviar Solicitud</button>
                        {success && <p className="alert alert-success mt-2">{success}</p>}
                            <p className="required-note">* Campos obligatorios</p>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default FormRegistrarse