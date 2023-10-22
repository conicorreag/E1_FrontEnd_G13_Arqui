import React, { useState, useEffect } from "react";
import { Container, Table } from "reactstrap";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import axios from "axios";

const PrediccionesComponent = () => {
    const { user } = useAuth0();
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      // Realiza una solicitud GET al backend para obtener las transacciones
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/predicciones/${user.sub}`)
        .then(response => {
          setPredictions(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error al obtener las predicciones:', error);
          setLoading(false);
        });
    }, []);


    return (
    <Container className="mb-5 mt-3">
      <h2 style={{ color: "#024EAA" }} align="center">Simulaciones de predicción de ganancias</h2>

      {loading ? (
        <Loading />
      ) : (
        <Table striped bordered>
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Cantidad</th>
              <th>Símbolo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((prediction, index) => (
              <tr key={index}>
                <td>{prediction.datetime}</td>
                <td>{prediction.quantity}</td>
                <td>{prediction.symbol}</td>
                <td style={{ color: prediction.status === 'approved' ? 'green' : (prediction.status === 'rejected' ? 'red' : 'yellow') }}>
                  {prediction.status}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

    </Container>

    );
}



export default withAuthenticationRequired(PrediccionesComponent, {
  onRedirecting: () => <Loading />,
});

