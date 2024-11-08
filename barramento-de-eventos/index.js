const express = require ('express');
const bodyParser = require('body-parser');
//o axios serve para enviar eventos para os demais microsserviços
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
const port = 10000;

const eventos = [];

app.post('/eventos', async (req, res) => { //recebe eventos
  const evento = req.body;
  eventos.push(evento);
  console.log(evento);
  try {
    //envia para o microsserviço de lembretes
    await axios.post('http://lembretes-service:4000/eventos', evento);
  } catch (error) {}
  try {
    //envia para o microsserviço de observações
    await axios.post('http://observacoes-service:5000/eventos', evento);
  } catch (error) {}
  try {
    //envia o evento para o microsservico de consulta
    await axios.post('http://consulta-service:6000/eventos', evento);
  } catch (error) {}
  try {
    //envia o evento para o microsservico de classificacao
    await axios.post("http://classificacao-service:7000/eventos", evento);
  } catch (error) {}
  try {
    //envia o evento para o microsservico de logs
    await axios.post("http://logs-service:8000/eventos", evento);
  } catch (error) {}
  res.status(200).send({ msg: 'ok' });
});

app.get('/eventos', (req, res) => {
    res.send(eventos);
});

app.listen(port, () => {
  console.log(`Barramento de eventos em http://barramento-de-eventos-service:${port}`);
} );
