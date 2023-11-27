import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import ExternalApi from "./views/ExternalApi";
import Billetera from "./views/Billetera";
import EmpresaDetalle from "./views/EmpresaDetalle";
import Empresas from "./views/Empresas";
import EmpresasUser from "./views/EmpresasUser";
import CompraDetalle from "./views/CompraDetalle";
import Compras from "./views/Compras";
import Predicciones from "./views/Predicciones";
import Subasta from "./views/Subasta";
import Ofertas from "./views/Ofertas";
import SubastaDetalle from "./views/SubastaDetalle";
import SubastaRespuestas from "./views/SubastaRespuestas";
import MisSubastas from "./views/MisSubastas";
import OfertaDetalle from "./views/OfertaDetalle";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";

// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();

const App = () => {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        
        <NavBar />
        <Container className="flex-grow-1">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/external-api" component={ExternalApi} />
            <Route path="/billetera" component={Billetera} />
            <Route path="/empresas" component={Empresas} />
            <Route path="/compras" component={Compras} />
            <Route path="/predicciones" component={Predicciones} />
            <Route path="/compraDetalle" component={CompraDetalle} />
            <Route path="/subasta" component={Subasta} />
            <Route path="/ofertas" component={Ofertas} />
            <Route path="/empresas-user" component={EmpresasUser} />
            <Route path="/mis-subastas" component={MisSubastas} />
            

          </Switch>

          <Switch>
            <Route path="/empresa-detalle/:symbol" component={EmpresaDetalle} />
            <Route path="/subasta-detalle/:symbol/:max_quantity" component={SubastaDetalle} />
            <Route path="/subasta-respuestas/:subasta_id" component={SubastaRespuestas} />
            <Route path="/oferta-detalle/:auctionId" component={OfertaDetalle} />
          </Switch>

        </Container>

        <Footer />
      </div>
    </Router>
  );
};

export default App;

