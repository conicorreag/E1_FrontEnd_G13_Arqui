import React, { useState, useEffect } from "react";
import { Container, Table } from "reactstrap";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import axios from "axios";

const SubastaRespuestasComponent = () => {
  const { user } = useAuth0();
  const { subasta_id } = useParams();
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Realiza una solicitud GET al backend para obtener las transacciones
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/subasta-respuestas/${subasta_id}`)
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
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/RUTA PARA MANDAR EL INTERCAMBIO HECHO`, {
        respuestaId: respuestaId,
        subastaId: subasta_id,
      });

      // Actualiza las respuestas después de realizar el intercambio
      const updatedRespuestas = respuestas.filter(respuesta => respuesta.id !== respuestaId);
      setRespuestas(updatedRespuestas);

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
              <th>Fecha y Hora</th>
              <th>Cantidad</th>
              <th>Símbolo</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {respuestas.map((respuesta, index) => (
              <tr key={index}>
                <td>{respuesta.datetime}</td>
                <td>{respuesta.quantity}</td>
                <td>{respuesta.symbol}</td>
                <td>
                    <Button onClick={() => handleIntercambiar(respuesta.id)} color="success">
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

