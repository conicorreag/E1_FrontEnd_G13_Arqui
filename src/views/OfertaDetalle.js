import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory, useLocation } from "react-router-dom";
import { Button, Container, Table, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

const OfertaDetalleComponent = () => {
    const [accionesDisponibles, setAccionesDisponibles] = useState([]);
    const [cantidadAcciones, setCantidadAcciones] = useState(0);
    const [selectedSymbol, setSelectedSymbol] = useState('');
    const { symbol, auctionId, stockId, quantity } = useParams();

    const history = useHistory();

    const handleOferta = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/stocks_available`);
          const accionesDisponibles = response.data;
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
            // Realizar la solicitud POST al backend con cantidadAcciones, selectedSymbol y auction_id.
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/ofertas`, {
            cantidadAcciones,
            selectedSymbol,
            auction_id: auction_id, // Asegúrate de tener el valor correcto del auction_id.
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
              <Label for="cantidad">Cantidad de Acciones</Label>
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

}

export default OfertaDetalleComponent;