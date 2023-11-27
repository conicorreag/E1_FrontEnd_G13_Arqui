import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button, Container, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/Loading"; // Asegúrate de importar Loading si no está importado

const OfertaDetalleComponent = () => {
  const {auctionId} = useParams();
  const [accionesDisponibles, setAccionesDisponibles] = useState([]);
  const [cantidadAcciones, setCantidadAcciones] = useState(0);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const history = useHistory();

  const handleOferta = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/stocks_available/`);
      const accionesDisponibles = Object.keys(response.data).map((symbol) => ({
        symbol,
        ...response.data[symbol],
      }));
      setAccionesDisponibles(accionesDisponibles);

      console.log('Acciones disponibles:', accionesDisponibles);
      // Aquí puedes almacenar las acciones disponibles en el estado o realizar cualquier otra lógica que necesites.
    } catch (error) {
      console.error('Error al obtener las acciones disponibles:', error);
      // Manejo de errores
    }
  };

  useEffect(() => {
    handleOferta();
  }, []);

  const enviarOferta = async () => {
    try {
      // Validación: Asegúrate de que la cantidad de acciones a ofrecer no sea mayor que la cantidad disponible
      const accionesDisponiblesParaElSimbolo = accionesDisponibles.find(accion => accion.symbol === selectedSymbol);
      console.log('Acciones disponibles para el símbolo:', accionesDisponiblesParaElSimbolo);
      if (parseInt(cantidadAcciones) > parseInt(accionesDisponiblesParaElSimbolo.quantity)) {
        // Muestra un pop-up con el mensaje de error
        Swal.fire({
          title: "Error",
          text: `No puedes ofrecer más acciones de las que tienes disponibles para ${selectedSymbol}.`,
          icon: "error",
          confirmButtonText: "OK",
        });
        return; // Detén la ejecución de la función si hay un error
      }

      // Realizar la solicitud POST al backend con cantidadAcciones, selectedSymbol y auction_id.
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/proposals/send/`, {
        "quantity": cantidadAcciones,
        "stock_id": selectedSymbol,
        "auction_id": auctionId, // Asegúrate de tener el valor correcto del auction_id.
      });

      // Manejo de éxito
      Swal.fire({
        title: 'Éxito',
        text: 'Oferta enviada correctamente',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      // Puedes redirigir a otra página o realizar otras acciones después del éxito.
    } catch (error) {
      console.error('Error al enviar la oferta:', error);
      // Manejo de errores
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al enviar la oferta.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <Container>
      <h2>Ofrecer Acciones</h2>
      <Form>
        <FormGroup>
          <Label for="cantidad">Cantidad de Acciones (hasta {accionesDisponibles.find(accion => accion.symbol === selectedSymbol)?.quantity || 0})</Label>
          <Input
            type="number"
            id="cantidad"
            value={cantidadAcciones}
            onChange={(e) => setCantidadAcciones(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="symbol">Seleccionar Símbolo</Label>
          <Input
            type="select"
            id="symbol"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
          >
            <option value="" disabled>Seleccionar</option>
            {accionesDisponibles.map((accion) => (
              <option key={accion.symbol} value={accion.symbol}>{accion.symbol}</option>
            ))}
          </Input>
        </FormGroup>
        <Button color="primary" onClick={enviarOferta}>Enviar Oferta</Button>
      </Form>
    </Container>
  );
};

export default withAuthenticationRequired(OfertaDetalleComponent, {
  onRedirecting: () => <Loading />,
});
