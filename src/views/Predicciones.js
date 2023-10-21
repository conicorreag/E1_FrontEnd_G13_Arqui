import React, { useState, useEffect } from "react";
import { Container, Table } from "reactstrap";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import axios from "axios";

const PrediccionesComponent = () => {}

export default withAuthenticationRequired(PrediccionesComponent, {
  onRedirecting: () => <Loading />,
});

