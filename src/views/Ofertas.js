import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table } from "reactstrap";
import { useHistory } from "react-router-dom";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Axios from "axios";


const OfertasComponent = () => {
  const history = useHistory();
  const { user } = useAuth0();
  const [empresas_ofrecidas, setEmpresas_ofrecidas] = useState([]);
  const [error, setError] = useState(null);


   useEffect(() => {

    //OFERTAS DE LOS GRUPOS QUE QUIEREN SUBASTAR
    
     Axios.get(`${process.env.REACT_APP_BACKEND_URL}/auctions_available`)
       .then((response) => {
         setEmpresas_ofrecidas(response.data);
         console.log('DATOS DE LAS EMPRESAS:', response.data);
       })
       .catch((error) => {
         console.error('Error al obtener las empresas:', error);
         setError(error);
       });
   }, []);


   const handleOfertaDetailClick = (auctionId) => {
    const ruta = `/oferta-detalle/${auctionId}`;
    history.push(ruta);
  };

  if (!(user && user['https://g13arquitectura.me//roles'] && user['https://g13arquitectura.me//roles'].includes('admin'))) {
    return (
        <Container style={{ textAlign: 'center', marginTop: '50px' }}>
        <p style={{ color: 'red', fontSize: '24px' }}>No tienes permisos para ver esta página.</p>
        </Container>
    );
  }

  return (
    <Container className="mb-5 mt-3">
        <h2 style={{ color:  "#024EAA" }} align= "center" >Ofertas de otros grupos</h2>
        <p align= "center" className="lead text-muted"> A continuación, las acciones que otros grupos desean subastar. </p>


      <Table>
        <thead>
          <tr>
            <th>Nombre de la Empresa</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresas_ofrecidas.map((empresa, index) => (
            <tr key={index}>
              <td>{empresa.shortName}</td>
              <td>{empresa.price}</td>
              <td>
                <Button
                  color="primary"
                  onClick={() => handleOfertaDetailClick(empresa.auction_id)}
                >
                  Hacer Oferta
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default withAuthenticationRequired(OfertasComponent, {
  onRedirecting: () => <Loading />,
});
