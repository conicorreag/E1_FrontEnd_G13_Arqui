import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { Button, Container, Table, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";  
import Swal from "sweetalert2";

const EmpresaDetalleComponent = () => {
  const { symbol } = useParams();
  const [actionHistory, setActionHistory] = useState([]);
  const [cantidad, setCantidad] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);  // Cantidad de elementos por página

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = actionHistory.slice(indexOfFirstItem, indexOfLastItem);

  const history = useHistory();

  const totalPages = Math.ceil(actionHistory.length / itemsPerPage);

  const handleNextPage = () => {
  setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  useEffect(() => {
    // Realiza la solicitud GET al backend para obtener el historial de precios para el símbolo
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/stocks/${symbol}`)
      .then(response => {
        setActionHistory(response.data);  // Actualiza el historial con la respuesta del backend
      })
      .catch(error => {
        console.error('Error al obtener el historial de precios:', error);
        // Puedes manejar el error aquí
      });
  }, [symbol]);  

  const handleCompra = () => {
    const user_id = "user123";  // Obtén el ID del usuario, puede ser desde tu sistema de autenticación
    const datetime = new Date().toISOString();  // Fecha y hora de compra
    const quantity = cantidad;

    // Realiza la solicitud POST al backend para enviar la información de la compra
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/transactions/`, { user_id, datetime, symbol, quantity })
      .then(response => {
        // Muestra un pop-up con el mensaje de éxito
        Swal.fire({
          title: 'Solicitud enviada',
          text: 'La solicitud de compra ha sido enviada correctamente.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      })
      .catch(error => {
        console.error('Error al enviar la solicitud de compra:', error);
        // Muestra un pop-up con el mensaje de error
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al enviar la solicitud de compra.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
};

  return (
    <Container className="mb-5 mt-3">
      <h2 style={{ color: "#024EAA" }} align="center">
        Historial de precios para {symbol}
      </h2>
  
      <Form>
        <FormGroup>
          <Label for="cantidad">Cantidad a comprar</Label>
          <Input
            type="number"
            id="cantidad"
            placeholder="Ingrese la cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </FormGroup>
        <Button align-self="center" color="primary" size="lg" onClick={handleCompra}>
          Comprar
        </Button>
      </Form>
  
      <Table striped bordered>
        <thead>
          <tr>
            <th>Fecha y Hora</th>
            <th>Precio</th>
            <th>Moneda</th>
            <th>Fuente</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((action, index) => (
            <tr key={index}>
              <td>{action.datetime}</td>
              <td>{action.price}</td>
              <td>{action.currency}</td>
              <td>{action.source}</td> 
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="pagination">
        <Button disabled={currentPage === 1} onClick={handlePrevPage}>
          Anterior
        </Button>
        <span>{`Página ${currentPage} de ${totalPages}`}</span>
        <Button disabled={currentPage === totalPages} onClick={handleNextPage}>
          Siguiente
        </Button>
      </div>
    </Container>

  );
};

export default EmpresaDetalleComponent;