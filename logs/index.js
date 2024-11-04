const express = require('express');
const bodyParser = require('body-parser');
const { format } = require('date-fns');

const app = express();
app.use(bodyParser.json());
const port = 8000;

const funcoes = {
    LembreteCriado: (lembrete) => {
        contador++;
        const agora = new Date();
        const dataFormatada = format(agora, 'dd/MM/yyyy HH:mm');
        logs[contador]  = { tipo: 'LembreteCriado', data: dataFormatada };
    },
    ObservacaoCriada: (observacao) => {
        contador++;
        const agora = new Date();
        const dataFormatada = format(agora, 'dd/MM/yyyy HH:mm');
        logs[contador] = { tipo: 'ObservacaoCriada', data: dataFormatada };
    },
};

logs = {};
contador = 0;

app.get('/logs', (req, res) => {
    res.status(200).send(logs);
});

app.post('/eventos', (req, res) => {
    try {
        funcoes[req.body.tipo](req.body.dados);
    } catch (error) {}
    res.status(200).send({ msg: 'ok' });
});

app.listen(port, () => {
  console.log(`Lembretes em http://localhost:${port}`);
});
