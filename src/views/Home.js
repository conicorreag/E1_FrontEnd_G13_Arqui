import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [heartbeatStatus, setHeartbeatStatus] = useState(null);

  useEffect(() => {
    // Realizar una solicitud GET al backend para obtener el estado del heartbeat
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/job_heartbeat`)
      .then(response => {
        setHeartbeatStatus(response.data.status); // Supongo que el estado se encuentra en response.data.status
      })
      .catch(error => {
        console.error('Error al obtener el estado del heartbeat:', error);
        setHeartbeatStatus("false"); // Establecer el estado como false en caso de error
      });
  }, []);

  return (
    <div
      style={{
        color: "#024EAA",
        height: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>Bienvenidos a PPE Fintech Async</h1>
      {heartbeatStatus !== null ? (
        <h2>Estado del Jobmaster: {heartbeatStatus === "true"? "Activo" : "Inactivo"}</h2>
      ) : (
        <h2>Cargando estado del Jobmaster...</h2>
      )}
    </div>
  );
};

export default Home;
