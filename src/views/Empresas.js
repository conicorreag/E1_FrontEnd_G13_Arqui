import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table } from "reactstrap";
import { useHistory } from "react-router-dom";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Axios from "axios";

const EmpresasComponent = () => {
  const history = useHistory();
  const { user } = useAuth0();
   const [empresas, setEmpresas] = useState([]);
  const [error, setError] = useState(null);

   useEffect(() => {
     Axios.get(`${import.meta.env.VITE_BACKEND_URL}/stocks`)
       .then((response) => {
         setEmpresas(response.data);
         console.log('DATOS DE LAS EMPRESAS:', response.data);
       })
       .catch((error) => {
         console.error('Error al obtener las empresas:', error);
         setError(error);
       });
   }, []);

//   const empresas = [{"name":"Apple Inc.","symbol":"AAPL","price":173.93},{"name":"Amazon.com, Inc.","symbol":"AMZN","price":131.6},{"name":"Broadcom Inc.","symbol":"AVGO","price":808.36},{"name":"Compass, Inc.","symbol":"COMP","price":2.92},{"name":"Alphabet Inc.","symbol":"GOOGL","price":130.44},{"name":"LATAM AIRLINES GROUP SA SPONS A","symbol":"LTMAY","price":0.515},{"name":"Mastercard Incorporated","symbol":"MA","price":403.36},{"name":"Meta Platforms, Inc.","symbol":"META","price":295.73},{"name":"Microsoft Corporation","symbol":"MSFT","price":319.53},{"name":"Netflix, Inc.","symbol":"NFLX","price":384.15},{"name":"NVIDIA Corporation","symbol":"NVDA","price":410.17},{"name":"Procter & Gamble Company (The)","symbol":"PG","price":152.14},{"name":"Shell PLC","symbol":"SHEL","price":64.56},{"name":"Tesla, Inc.","symbol":"TSLA","price":246.67},{"name":"Walmart Inc.","symbol":"WMT","price":162.98}]

  const handleEmpresaDetailClick = (symbol) => {
    history.push(`/empresa-detalle/${symbol}`);
  };

  return (
    <Container className="mb-5 mt-3">
        <h2 style={{ color:  "#024EAA" }} align= "center" >Empresas</h2>
        <p align= "center" className="lead text-muted">A continuación, las empresas con acciones disponibles. </p>


      <Table>
        <thead>
          <tr>
            <th>Nombre de la Empresa</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((empresa, index) => (
            <tr key={index}>
              <td>{empresa.name}</td>
              <td>{empresa.price}</td>
              <td>
                <Button
                  color="primary"
                  onClick={() => handleEmpresaDetailClick(empresa.symbol)}
                >
                  Ver detalles
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default withAuthenticationRequired(EmpresasComponent, {
  onRedirecting: () => <Loading />,
});
