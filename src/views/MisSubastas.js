import React, { useState, useEffect } from "react";
import { Container, Table } from "reactstrap";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import axios from "axios";

const MisSubastasComponent = () => {
  const { user } = useAuth0();
  const [subastas, setSubastas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Realiza una solicitud GET al backend para obtener las transacciones
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/subastas/${user.sub}`)
      .then(response => {
        setSubastas(response.data);
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



  return (
    <Container className="mb-5 mt-3">
      <h2 style={{ color: "#024EAA" }} align="center">Subastas enviadas</h2>

      {loading ? (
        <Loading />
      ) : (
        <Table striped bordered>
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Cantidad</th>
              <th>Símbolo</th>
              <th>Respuestas</th>
            </tr>
          </thead>
          <tbody>
            {subastas.map((subasta, index) => (
              <tr key={index}>
                <td>{subasta.datetime}</td>
                <td>{subasta.quantity}</td>
                <td>{subasta.symbol}</td>
                <td>
                  <Link to={`/subasta-respuestas/${subasta.id}`}>
                    <Button color="primary">Ver Respuestas</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default withAuthenticationRequired(MisSubastasComponent, {
  onRedirecting: () => <Loading />,
});

