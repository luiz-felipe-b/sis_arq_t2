const express = require('express');
const app = express();
const axios = require('axios');
app.use(express.json());
const port = 7000;
const palavraChave = 'importante';
const funcoes = {
    ObservacaoCriada: (observacao) => {
        observacao.status = observacao.texto.includes(palavraChave) ? 'importante' : 'comum';
        axios.post('http://localhost:10000/eventos', {
            tipo: 'ObservacaoClassificada',
            dados: observacao,
        });
    },
};

app.post('/eventos', (req, res) => {
    try {
        funcoes[req.body.tipo](req.body.dados);
    } catch (error) {}
    res.status(200).send({ msg: 'ok' });
});

app.listen(port, () => {
  console.log(`Classificação em localhost:${port}`);
});
