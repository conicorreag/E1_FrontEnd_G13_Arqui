import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory, useLocation } from "react-router-dom";
import { Button, Container, Table, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

const CompraDetalleComponent = () => {
const [token, setToken] = useState(null);
const [requestID, setRequestID] = useState(null);
const location = useLocation();
const searchParams = new URLSearchParams(location.search);
const history = useHistory();
setToken(searchParams.get('token'));

const handleToken = () => {
    const data = {
        token: token,
    };
    axios
        .patch(`${process.env.REACT_APP_BACKEND_URL}/transactions`, data)
        .then((response) => {
        data = JSON.parse(response.data); 
        console.log('Respuesta del backend:', response);
        if (response.data.status === "approved") {
            Swal.fire({
                title: "Compra realizada con éxito",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
            
        }
        else if (response.data.status === "rejected") {
            Swal.fire({
                title: "Compra Anulada",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
        else if(response.data.status === "user canceled"){
            Swal.fire({
                title: "Compra Rechazada",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
        
        })
        .catch((error) => {
        console.error('Error al realizar la compra:', error);
        Swal.fire({
            title: "Error al realizar la compra",
            icon: "error",
            confirmButtonText: "Aceptar",
        });
        });
}
handleToken();
history.push("/compras");
}

export default CompraDetalleComponent;