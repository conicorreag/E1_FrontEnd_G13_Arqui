import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Axios from "axios";

export const BilleteraComponent = () => {
  const { user } = useAuth0();
  const [monto, setMonto] = useState("");  // Estado para almacenar el monto ingresado
  const [saldo, setSaldo] = useState(0);    // Estado para almacenar el saldo en la billetera

  const handleMontoChange = (event) => {
    setMonto(event.target.value);
  };

   const agregarSaldo = async () => {
     try {
       const response = await Axios.put(`http://0.0.0.0:8000/wallet/`, {
         user_id: user.id,
         amount: parseFloat(monto)
       });
       
       console.log("user_id", user.id);

       // Actualiza el saldo con el balance recibido del backend
       setSaldo(response.data.balance);
       console.log("Se agregó el monto: ", monto);
     } catch (error) {
       console.error('Error al agregar saldo:', error);
     }
   };

  return (
    <Container className="mb-5 mt-3">
          <h2 style={{ color:  "#024EAA" }} align= "center"> Billetera Virtual</h2>

          <p align="center" className="lead text-muted">Tu saldo disponible es de: ${saldo}</p>


      <br />
      <br />

      <Row>
        <Col md>
          <input
            type="number"
            value={monto}
            onChange={handleMontoChange}
            placeholder="Ingrese el monto a agregar"
            className="form-control"
          />
        </Col>
      </Row>

      <br />
      <br />

      <Row>
        <Col md>
          <button
            onClick={agregarSaldo}
            type="button"
            className="btn btn-primary btn-lg btn-block"
          >
            Agregar saldo
          </button>
        </Col>
      </Row>
    </Container>
  );
};

export default withAuthenticationRequired(BilleteraComponent, {
  onRedirecting: () => <Loading />,
});