import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import "../css/style.css";
import "../css/sweet-alert.css";
import 'material-design-iconic-font/dist/css/material-design-iconic-font.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/jquery.mCustomScrollbar.css";
import FondoLogin from "../assets/img/Logo2.jpg";
import LogoLogin from "../assets/img/Logo_login.png";
import { fetchCSRF, headers, baseURL } from "../network/apiConstants";
import {
  MDBBtn,
  MDBInput,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon
} from "mdb-react-ui-kit";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetchCSRF()
      .then(response => {
          fetch(`${baseURL}/login`, {
            method: "POST",
            headers: headers(),
            body: JSON.stringify({
              email: email,
              password: password
            }),
            credentials: "include",
          }).then(response => {
              if (response.ok) {
                localStorage.setItem('loggedIn', 'true');
                navigate("/home");
              } else {
                setError("Las credenciales no coinciden")
              }
          })
          .catch(error => {
              setError("Algo salió mal")
          });
      });
  };

  return (
    <MDBContainer className="my-3">

      <MDBCard>
        <MDBRow className='g-0'>

          {/* Imagen de fondo: oculta en móviles */}
          <MDBCol md='6'>
            <MDBCardImage 
              src={FondoLogin} 
              alt="login form" 
              className='rounded-start w-100 d-none d-md-block'  // <- oculto en móviles
              style={{maxHeight: "85vh", objectFit: "cover"}}
            />
          </MDBCol>

          <MDBCol md='6'>
            <MDBCardBody className='d-flex flex-column justify-content-center h-100 mx-3'>
              <form onSubmit={handleSubmit}>

                <div className='d-flex flex-row mt-4 mb-4'>
                  <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }}/>
                  <MDBCardImage src={LogoLogin} alt="login form" className='rounded-start mx-auto' style={{width: "60%"}}/>
                </div>

                <h5 className="fw-bold fs-2 my-3 pb-3" style={{letterSpacing: '1px'}}>Iniciar sesión</h5>

                <MDBInput 
                  wrapperClass='mb-4' 
                  label='Correo electrónico' 
                  id='formControlLg' 
                  type='email' 
                  size="lg" 
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MDBInput 
                  wrapperClass='mb-4' 
                  label='Contraseña' 
                  id='formControlLg' 
                  type='password' 
                  size="lg" 
                  onChange={(e) => setPassword(e.target.value)} 
                /> 

                <button type="submit" className="btn btn-dark w-100 py-2 fs-5 mt-2">
                  Login
                </button>

                {error && <p className="text-danger pt-2">{error}</p>}

                <div className="text-center mt-5">
                  <a className="small text-muted" href="#!">¿Olvidaste tu contraseña?</a>
                  <p className="mb-5 pb-lg-2" style={{color: '#393f81'}}>
                    ¿No tienes una cuenta?  
                    <a href="#!" style={{color: '#393f81'}}> Registrate aquí</a>
                  </p>
                </div>

                <div className='d-flex flex-row justify-content-end'>
                  <a href="#!" className="small text-muted me-1">Terms of use.</a>
                  <a href="#!" className="small text-muted">Privacy policy</a>
                </div>

              </form>
            </MDBCardBody>
          </MDBCol>

        </MDBRow>
      </MDBCard>

    </MDBContainer>
  );
};

export default Login;
