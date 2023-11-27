import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "reactstrap";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import Swal from "sweetalert2";


const SubastaRespuestasComponent = () => {
  const { user } = useAuth0();
  const { subasta_id } = useParams();
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let data;
    data = {"auction_id": subasta_id}

    console.log("data", data);
    // Realiza una solicitud GET al backend para obtener las transacciones
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/proposals_available`, data)
      .then(response => {
        setRespuestas(response.data);
        //TIENE QUE LLEGARME UN ID DE SUBASTA
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener las transacciones:', error);
        setLoading(false);
      });
  }, []);

  if (!(user && user['https://g13arquitectura.me//roles'] && user['https://g13arquitectura.me//roles'].includes('admin'))) {
    return (
        <Container style={{ textAlign: 'center', marginTop: '50px' }}>
        <p style={{ color: 'red', fontSize: '24px' }}>No tienes permisos para ver esta página.</p>
        </Container>
    );
  }

  const handleIntercambiar = async (respuestaId) => {
    try {
      // Realiza la solicitud POST al backend para realizar el intercambio
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/proposals/answer`, {
        "proposal_id": respuestaId
      });

      // Actualiza las respuestas después de realizar el intercambio
      const updatedRespuestas = respuestas.filter(respuesta => respuesta.id !== respuestaId);
      setRespuestas(updatedRespuestas);

      //SI SE INTERCAMBIÓ UNA, SE ELIMINAN TODAS LAS RESPUESTAS

      // Puedes mostrar una notificación de éxito si es necesario
      Swal.fire({
        icon: 'success', 
        title: 'Éxito',
        text: 'El intercambio se realizó correctamente.',
      });    

    } catch (error) {
      console.error('Error al realizar el intercambio:', error);
        // Muestra una alerta de error
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al realizar el intercambio.',
          });
    }
  };


  return (
    <Container className="mb-5 mt-3">
      <h2 style={{ color: "#024EAA" }} align="center">Propuestas de intercambio con otros usuarios para esta subasta</h2>

      {loading ? (
        <Loading />
      ) : (
        <Table striped bordered>
          <thead>
            <tr>
              <th>Cantidad</th>
              <th>Símbolo</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {respuestas.map((respuesta, index) => (
              <tr key={index}>
                <td>{respuesta.quantity}</td>
                <td>{respuesta.stock_id}</td>
                <td>
                    <Button onClick={() => handleIntercambiar(respuesta.proposal_id)} color="success">
                      Intercambiar 
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default withAuthenticationRequired(SubastaRespuestasComponent, {
  onRedirecting: () => <Loading />,
});

