import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button, Container, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

const SubastaDetalleComponent = () => {
  const { symbol } = useParams();
  const [cantidad, setCantidad] = useState("");
  const { user } = useAuth0();
  const history = useHistory();

  const handleCompra = async () => {
    const datetime = new Date().toISOString(); // Fecha y hora de compra

    try {
      // Realiza la solicitud POST al backend para enviar la información de la compra
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/transactions`, {
        user_sub: user.sub,
        datetime: datetime,
        symbol: symbol,
        quantity: cantidad,
      });

      // Muestra un pop-up con el mensaje de éxito
      Swal.fire({
        title: "Éxito",
        text: "Compra realizada correctamente.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Redirige a la página principal o a donde sea necesario
      history.push("/");
    } catch (error) {
      console.error("Error al enviar la solicitud de compra:", error);
      // Muestra un pop-up con el mensaje de error
      Swal.fire({
        title: "Error",
        text: "Hubo un error al enviar la solicitud de compra.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <Container className="mb-5 mt-3">
      <h2 style={{ color: "#024EAA" }} align="center">
        Detalle de Subasta para {symbol}
      </h2>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleCompra();
        }}
      >
        <FormGroup>
          <Label for="cantidad">Cantidad a subastar</Label>
          <Input
            type="number"
            id="cantidad"
            placeholder="Ingrese la cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </FormGroup>

        <Button
          type="submit"
          style={{
            display: "block", // Hace que el botón ocupe todo el ancho disponible
            margin: "20px auto", // Agrega espaciado arriba y abajo y lo centra horizontalmente
          }}
          color="success"
          size="lg"
        >
          Aceptar
        </Button>
      </Form>
    </Container>
  );
};

export default withAuthenticationRequired(SubastaDetalleComponent, {
  onRedirecting: () => <Loading />,
});
