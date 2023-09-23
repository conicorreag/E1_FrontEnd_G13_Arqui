import React, { useState, useEffect } from "react";
import { Container, Table } from "reactstrap";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import axios from "axios";

const ComprasComponent = () => {
  const { user } = useAuth0();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Realiza una solicitud GET al backend para obtener las transacciones
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/stocks/${user.id}`)
      .then(response => {
        setTransactions(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener las transacciones:', error);
        setLoading(false);
      });
  }, []);

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
                <td style={{ color: transaction.status === 'APPROVED' ? 'green' : (transaction.status === 'REJECTED' ? 'red' : 'yellow') }}>
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

