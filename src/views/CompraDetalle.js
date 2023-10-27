import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory, useLocation } from "react-router-dom";
import { Button, Container, Table, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

const CompraDetalleComponent = () => {
const [token, setToken] = useState(null);
const [requestID, setRequestID] = useState(null);
// const location = useLocation();
// const searchParams = new URLSearchParams(location.search);
const history = useHistory();
const location = useLocation();
// setToken(searchParams.get('token_ws'));



const handleToken = () => {
    const params = new URLSearchParams(window.location.search);
    const token_ws = params.get('token_ws');
    const tbk_token = params.get('TBK_TOKEN');
    if (token_ws) {
        const data = {
            "token": token_ws,
            "tbk":false
        };
    }
    else if (tbk_token) {
        const data = {
            "token": tbk_token,
            "tbk":true
        };
    }

    console.log("token1", token1);
    axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/transactions_webpay`, data)
        .then((response) => {
        console.log('Respuesta del backend:', response);
        if (response.data.status === "approved") {
            console.log("--------aprobadoooo--------");
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

useEffect(() => {
    handleToken();
}, []);

// history.push("/compras");
}

export default CompraDetalleComponent;