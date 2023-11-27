import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table } from "reactstrap";
import { useHistory } from "react-router-dom";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Axios from "axios";

const SubastaComponent = () => {

  const history = useHistory();
  const { user } = useAuth0();
  const [empresas, setEmpresas] = useState([]);
  const [error, setError] = useState(null);
  const [subastaPressed, setSubastaPressed] = useState(false);
  const [actionhistory, setActionhistory] = useState([]);
  const [symbol, setSymbol] = useState('');

   useEffect(() => {

    //HACER GET A LAS ACCIONES QUE YO HE COMPRADO Y MIS USUARIOS NO, OSEA ESTÁN DISPONIBLES.
    
     Axios.get(`${process.env.REACT_APP_BACKEND_URL}/stocks_available`)
     .then((response) => {
       const empresasArray = Object.keys(response.data).map((symbol) => ({
         symbol,
         ...response.data[symbol],
       }));
 
       setEmpresas(empresasArray);
       console.log('DATOS DE LAS EMPRESAS DISPONIBLES DE MI GRUPO:', empresasArray);
     })
     .catch((error) => {
       console.error('Error al obtener las empresas:', error);
       setError(error);
     });

   }, []);

    const handleSubastaDetailClick = (symbol, max_quantity) => {
        console.log('DATOS DE LA EMPRESA SELECCIONADA:', symbol, max_quantity);
        history.push(`/subasta-detalle/${symbol}/${max_quantity}`);
    };


// Verificar si el usuario es administrador antes de renderizar el contenido
  if (!(user && user['https://g13arquitectura.me//roles'] && user['https://g13arquitectura.me//roles'].includes('admin'))) {
    return (
      <Container style={{ textAlign: 'center', marginTop: '50px' }}>
        <p style={{ color: 'red', fontSize: '24px' }}>No tienes permisos para ver esta página.</p>
      </Container>
    );
  }

  return (
    <Container className="mb-5 mt-3">
        <h2 style={{ color:  "#024EAA" }} align= "center" >Acciones del Grupo 13</h2>
        <p align= "center" className="lead text-muted">A continuación, las empresas de tu grupo que aún estan disponibles. </p>

      <Table>
        <thead>
          <tr>
            <th>Nombre de la Empresa</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((empresa, index) => (
            <tr key={index}>
              <td>{empresa.shortName}</td>
              <td>{empresa.price}</td>
              <td>{empresa.quantity}</td>

              <td>
                  <Button
                    color="primary"
                    onClick={() => handleSubastaDetailClick(empresa.symbol, empresa.quantity)}
                  >
                    Subastar
                  </Button> 
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default withAuthenticationRequired(SubastaComponent, {
  onRedirecting: () => <Loading />,
});