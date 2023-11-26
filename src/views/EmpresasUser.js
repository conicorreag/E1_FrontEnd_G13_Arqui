import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table } from "reactstrap";
import { useHistory } from "react-router-dom";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Axios from "axios";

const EmpresasUserComponent = () => {
  const history = useHistory();
  const { user } = useAuth0();
  const [empresas, setEmpresas] = useState([]);
  const [error, setError] = useState(null);

   useEffect(() => {
    
    //GET PARA OBTENER LAS EMPRESAS DISPONIBLES

     Axios.get(`${process.env.REACT_APP_BACKEND_URL}/stocks_disponibles_G13`)
       .then((response) => {
         setEmpresas(response.data);
         console.log('DATOS DE LAS EMPRESAS PARA EL USER:', response.data);
       })
       .catch((error) => {
         console.error('Error al obtener las empresas:', error);
         setError(error);
       });
   }, []);


  const handleEmpresaDetailClick = (symbol) => {
    console.log("--------holaaaaaaaaa------------------")
    console.log('---------Símbolo:-----------\n', symbol);
    console.log(`/empresa-detalle/${symbol}`);
    history.push(`/empresa-detalle/${symbol}`);
  };

  return (
    <Container className="mb-5 mt-3">
        <h2 style={{ color:  "#024EAA" }} align= "center" >Empresas</h2>
        <p align= "center" className="lead text-muted">A continuación, las acciones compradas por tu admin que están disponibles. </p>


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
              <td>{empresa.shortName}</td>
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

export default withAuthenticationRequired(EmpresasUserComponent, {
  onRedirecting: () => <Loading />,
});