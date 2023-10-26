"use client";

import "chart.js/auto";
import React, { useState, useEffect } from "react";
import { Container, Table } from "reactstrap";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import axios from "axios";
import { Line } from 'react-chartjs-2';
import Modal from 'react-modal';



const PrediccionesComponent = () => {
    const { user } = useAuth0();
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [estimatedGain, setEstimatedGain] = useState(0);

    const openModal = (title, gain) => {
      setModalTitle(title);
      setEstimatedGain(gain);
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };

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


      //imprimir ganancia total estimada
      console.log(prediction.final_price);
      

      const formattedDates = prediction.future_dates.map(dateString => dateString.slice(0, 19));
      const estimatedGain = prediction.final_price; // Obtén la ganancia estimada
      setModalTitle('Predicción de las ganancias'); // Establece el título del modal
      openModal('Prediccion de las ganancias', estimatedGain); // Abre el modal y pasa la ganancia estimada


      const data = {


        labels: formattedDates, // Fechas en el eje X
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
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel={modalTitle}
        ariaHideApp={false}
        style={{
          overlay: {
            // Agrega estilos para el fondo oscuro detrás del pop-up si es necesario
          },
          content: {
            maxHeight: '100%',
            width: '90%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >

      <button
        onClick={closeModal}
        style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '30px', 
      }}
      >
          <span aria-hidden="true">×</span> {/* Puedes usar otro icono aquí */}
      </button>

        <h2 style={{ textAlign: 'center', color: 'rgba(75, 192, 192, 1)' }}>Ganancia total estimada: {estimatedGain.toFixed(2)} </h2>
        <div style={{ width: '80%', height: '80%' }}>
          <Line data={chartData} />
        </div>
      </Modal>
    )}

    </Container>

    );
}

export default withAuthenticationRequired(PrediccionesComponent, {
  onRedirecting: () => <Loading />,
});



