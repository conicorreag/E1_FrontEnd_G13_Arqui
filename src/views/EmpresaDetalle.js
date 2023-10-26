import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { Button, Container, Table, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";


const EmpresaDetalleComponent = () => {
  const { symbol } = useParams();
  const [actionHistory, setActionHistory] = useState([]);
  const [cantidad, setCantidad] = useState("");
  const [predictionDate, setPredictionDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Cantidad de elementos por página
  const { user } = useAuth0();
  const [buying, setBuying] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [predictionMessage, setPredictionMessage] = useState(true);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = actionHistory.slice(indexOfFirstItem, indexOfLastItem);

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Añade un cero al mes si es necesario
    const day = String(currentDate.getDate()).padStart(2, "0"); // Añade un cero al día si es necesario
    return `${year}-${month}-${day}`;
  };

  const history = useHistory();

  const {
    getAccessTokenSilently,
    loginWithPopup,
    getAccessTokenWithPopup,
    generateAuth0Token,
  } = useAuth0();

  const totalPages = Math.ceil(actionHistory.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const resetForm = () => {
    setPredictionDate("");
    setCantidad("");
    setPredictionMessage(false);
  };

  useEffect(() => {
    // Realiza la solicitud GET al backend para obtener el historial de precios para el símbolo
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/stocks/${symbol}`)
      .then((response) => {
        setActionHistory(response.data); // Actualiza el historial con la respuesta del backend
      })
      .catch((error) => {
        console.error("Error al obtener el historial de precios:", error);
        // Puedes manejar el error aquí
      });
  }, [symbol]);

  const handleCompra = async () => {
    const datetime = new Date().toISOString(); // Fecha y hora de compra
    const quantity = cantidad;

    try {
      // Obtén el token de acceso de forma silenciosa
      const token = await getAccessTokenSilently();
      // const token = await generateAuth0Token();

      // Configura los encabezados con el token de autenticación
      const tokenBearer = "Bearer " + token;


      // Realiza la solicitud POST al backend para enviar la información de la compra
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/transactions`,
        {
          user_sub: user.sub,
          datetime: datetime,
          symbol: symbol,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: tokenBearer,
          }
        }
      );

      // Muestra un pop-up con el mensaje de éxito
      Swal.fire({
        title: "Solicitud enviada",
        text: "La solicitud de compra ha sido enviada correctamente.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error al enviar la solicitud de compra:", error);
      // Muestra un pop-up con el mensaje de error
      Swal.fire({
        title: "Error",
        text: "Hubo un error al enviar la solicitud de compra.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handlePredict = async () => {
    // Comprueba que la fecha de predicción y la cantidad no estén vacías
    if (!predictionDate || !cantidad) {
      Swal.fire({
        title: "Error",
        text: "Por favor, ingresa una fecha de predicción y una cantidad.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
  
    const datetime = new Date().toISOString(); // Fecha y hora de la predicción

    const predictionData = {
      
      final_date: predictionDate,
      quantity: cantidad,
      symbol: symbol,
      user_sub: user.sub      

    };

    console.log(predictionData);
  
    try {
      //Realiza la solicitud POST al backend para enviar la información de la predicción
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/create_prediction`,
        predictionData,
        {
          headers: {
            Authorization: "Bearer " + (await getAccessTokenSilently()),
          },
        }
      );

      console.log("hola");
      //imprimir la response.data.message
      console.log(response.data.message);


      if (response.data && response.data.message === "job published") {
        console.log("El job si fue publicado");

        // La simulación se ha creado con éxito
        setPredictionMessage(true);
        console.log("El mensaje es: " + predictionMessage);

      } else {
        // La respuesta no tiene el mensaje esperado
        setPredictionMessage(false);
      }
  

      await new Promise(resolve => setTimeout(resolve, 0));
      console.log("El mensaje es: " + predictionMessage);
      // Muestra un pop-up con el mensaje de éxito o error
      Swal.fire({
        title: predictionMessage === true ? "Éxito" : "Error",
        html: `
        <p>Simulación enviada correctamente</p>
        <p>El ID del trabajo creado es: ${response.data.job_id || "No hay job creado"}</p>
      `,
        icon: predictionMessage === true ? "success" : "error",
        confirmButtonText: "OK",
      });

      // resetForm(); // Reiniciar el formulario después de la respuesta
      } 

      //Cuando no entra al try pq no hubo respuesta del backend
      
      catch (error) {
      console.error("Error al enviar la solicitud de predicción:", error);
      // Muestra un pop-up con el mensaje de error
      Swal.fire({
        title: "Error",
        text: "Hubo un error al realizar la predicción.",
        icon: "error",
        confirmButtonText: "OK",
      });
      }
      };
  

  return (
    <Container className="mb-5 mt-3">
      <h2 style={{ color: "#024EAA" }} align="center">
        Historial de precios para {symbol}
      </h2>

      <div align="center" align-items= "center">
      <Button
        onClick={() => {
          setBuying(true);
          setPredicting(false);
        }}
        className="btn btn-primary" // Estilo azul
      >
        Realizar una compra
      </Button>
      <span> </span>
      <Button
        onClick={() => {
          setPredicting(true);
          setBuying(false);
        }}
        className="btn btn-primary" // Estilo azul
      >
        Simular una predicción
      </Button>
      </div>

      {buying && (
        <Form>
          <FormGroup>
            <Label for="cantidad">Cantidad a comprar</Label>
            <Input
              type="number"
              id="cantidad"
              placeholder="Ingrese la cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </FormGroup>
          <Button
            style={{
              display: "block", // Hace que el botón ocupe todo el ancho disponible
              margin: "20px auto", // Agrega espaciado arriba y abajo y lo centra horizontalmente
            }}
            color="success"
            size="lg"
            onClick={handleCompra}
          >
            Comprar
          </Button>
        </Form>
      )}

      {predicting && (
        <Form>
          <FormGroup>
            <Label for="predictionDate">Fecha final del ahorro </Label>
            <Input
              type="date"
              id="predictionDate"
              min={getCurrentDate()} 
              value={predictionDate}
              onChange={(e) => setPredictionDate(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="cantidad">Cantidad de acciones </Label>
            <Input
              type="number"
              id="cantidad"
              placeholder="Ingrese la cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </FormGroup>
          <Button
            style={{
              display: "block", // Hace que el botón ocupe todo el ancho disponible
              margin: "20px auto", // Agrega espaciado arriba y abajo y lo centra horizontalmente
            }}
            color="success"
            size="lg"
            onClick={handlePredict}
          >
            Simular
          </Button>
        </Form>
      )}

      <Table striped bordered>
        <thead>
          <tr>
            <th>Fecha y Hora</th>
            <th>Precio</th>
            <th>Moneda</th>
            <th>Fuente</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((action, index) => (
            <tr key={index}>
              <td>{action.datetime}</td>
              <td>{action.price}</td>
              <td>{action.currency}</td>
              <td>{action.source}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="pagination" align="center">
        <Button disabled={currentPage === 1} onClick={handlePrevPage}>
          Anterior
        </Button>
        <span>{`    Página ${currentPage} de ${totalPages}    `}</span>
        <Button disabled={currentPage === totalPages} onClick={handleNextPage}>
          Siguiente
        </Button>
      </div>
    </Container>

  );
};

export default EmpresaDetalleComponent;