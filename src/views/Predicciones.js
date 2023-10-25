"use client";

import "chart.js/auto";
import React, { useState, useEffect } from "react";
import { Container, Table } from "reactstrap";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import axios from "axios";
import { Line } from 'react-chartjs-2';


const PrediccionesComponent = () => {
    const { user } = useAuth0();
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState(null);
  
    useEffect(() => {
      // Realiza una solicitud GET al backend para obtener las transacciones
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/user_predictions/${user.sub}`)
        .then(response => {
          setPredictions(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error al obtener las predicciones:', error);
          setLoading(false);
        });
    }, []);

    // Función para mostrar el gráfico
    const handleVerGrafico = (prediction) => {

      console.log("predicciones 1: ", predictions);

      console.log("La fechas futuras son: ", prediction.future_dates);
      console.log("Los precios futuros son: ", prediction.future_prices);

      const data = {


        labels: prediction.future_dates, // Fechas en el eje X
        datasets: [
          {
            label: 'Precios',
            data: prediction.future_prices, // Precios en el eje Y
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
          },
        ],
      };      
    
      setChartData(data);

      console.log("El chartData es: ", chartData);
      console.log("predicciones 2: ", predictions);
      
    };

    
    return (
    <Container className="mb-5 mt-3">
      <h2 style={{ color: "#024EAA" }} align="center">Simulaciones de predicción de ganancias</h2>

      {loading ? (
        <Loading />
      ) : (
        <Table striped bordered>
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Cantidad</th>
              <th>Símbolo</th>
              <th>Estado</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {predictions.slice().reverse().map((prediction, index) => (
              <tr key={index}>
                <td>{prediction.initial_date}</td>
                <td>{prediction.quantity}</td>
                <td>{prediction.symbol}</td>
                <td style={{ color: prediction.status === 'ready' ? 'green' :  'orange'}}>
                  {prediction.status}
                </td>
                <td>
                  {prediction.status === 'ready' && (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleVerGrafico(prediction)}
                    >
                      Ver comportamiento
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {chartData && (
        <div>
          <Line data={chartData} />
        </div>
      )}

    </Container>

    );
}

export default withAuthenticationRequired(PrediccionesComponent, {
  onRedirecting: () => <Loading />,
});



