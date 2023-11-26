import React, { useState, useEffect } from "react";
import { Container, Table } from "reactstrap";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import axios from "axios";
// import dotenv from 'dotenv';
// dotenv.config();

const ComprasComponent = () => {
  const { user } = useAuth0();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Realiza una solicitud GET al backend para obtener las transacciones
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/transactions/${user.sub}`)
      .then(response => {
        setTransactions(response.data);
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
      <h2 style={{ color: "#024EAA" }} align="center">Acciones compradas</h2>

      {loading ? (
        <Loading />
      ) : (
        <Table striped bordered>
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Cantidad</th>
              <th>Símbolo</th>
              <th>Ubicación</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.datetime}</td>
                <td>{transaction.quantity}</td>
                <td>{transaction.symbol}</td>
                <td>{transaction.location}</td>
                <td style={{ color: transaction.status === 'approved' ? 'green' : (transaction.status === 'rejected' ? 'red' : 'yellow') }}>
                  {transaction.status}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default withAuthenticationRequired(ComprasComponent, {
  onRedirecting: () => <Loading />,
});

