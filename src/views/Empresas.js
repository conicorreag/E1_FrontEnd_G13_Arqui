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
    
     Axios.get(`${process.env.REACT_APP_BACKEND_URL}/stocks`)
       .then((response) => {
         setEmpresas(response.data);
         console.log('DATOS DE LAS EMPRESAS:', response.data);
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

export default withAuthenticationRequired(EmpresasComponent, {
  onRedirecting: () => <Loading />,
});
