// Importa tus librerías y componentes necesarios
import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button, Container, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/Loading"; // Asegúrate de importar Loading si no está importado

const SubastaDetalleComponent = () => {
  const {symbol, max_quantity} = useParams();
  const [cantidad, setCantidad] = useState("");
  const { user } = useAuth0();
  const history = useHistory();
  console.log("symbol", symbol);
  console.log("max_quantity", max_quantity);

  const handleSubasta = async () => {
    const datetime = new Date().toISOString(); // Fecha y hora de la subasta

    try {
      // Validación: Asegúrate de que la cantidad no sea mayor que max_quantity
      if (parseInt(cantidad) > parseInt(max_quantity)) {
        // Muestra un pop-up con el mensaje de error
        Swal.fire({
          title: "Error",
          text: `La cantidad a subastar no puede ser mayor que ${max_quantity}.`,
          icon: "error",
          confirmButtonText: "OK",
        });
        return; // Detén la ejecución de la función si hay un error
      }

      // Realiza la solicitud POST al backend para enviar la información de la subasta
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auctions/send/`, {
        symbol: symbol,
        quantity: cantidad,
      });

      // Muestra un pop-up con el mensaje de éxito
      Swal.fire({
        title: "Éxito",
        text: "Subasta solicitada correctamente.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Redirige a la página principal o a donde sea necesario
      history.push("/");
    } catch (error) {
      console.error("Error al enviar la solicitud de subasta:", error);
      // Muestra un pop-up con el mensaje de error
      Swal.fire({
        title: "Error",
        text: "Hubo un error al enviar la solicitud de subasta.",
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
          handleSubasta();
        }}
      >
        <FormGroup>
          <Label for="cantidad">Cantidad a subastar (hasta {max_quantity})</Label>
          <Input
            type="number"
            id="cantidad"
            placeholder={`Ingrese la cantidad (hasta ${max_quantity})`}
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </FormGroup>

        <Button
          type="submit"
          style={{
            display: "block",
            margin: "20px auto",
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
