const express = require ('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
const port = 5000;

observacoesPorLembrete = {};

const funcoes = {
    ObservacaoClassificada: (observacao) => {
        console.log(observacao);
        const observacoes = observacoesPorLembrete[observacao.lembreteId];
        const obsParaAtualizar = observacoes.find(o => o.id === observacao.id);
        obsParaAtualizar.status = observacao.status;
        axios.post('http://localhost:10000/eventos', {
            tipo: 'ObservacaoAtualizada',
            dados: {
                id: observacao.id,
                status: observacao.status,
                lembreteId: observacao.lembreteId,
                texto: observacao.texto,
            },
        });
    },
};

app.post('/eventos', (req, res) => {
    try {
        funcoes[req.body.tipo](req.body.dados);
    } catch (error) {}
    res.status(200).send({ msg: 'ok' });
});

app.get('/lembretes/:id/observacoes', (req, res) => {
  res.send(observacoesPorLembrete[req.params.id] || []);
});

app.put('/lembretes/:id/observacoes', async (req, res) => {
    const idObservacao = uuidv4();
    const { texto } = req.body;
    const observacoesDoLembrete = observacoesPorLembrete[req.params.id] || [];
    observacoesDoLembrete.push({ id: idObservacao, texto, status: 'aguardando' });
    observacoesPorLembrete[req.params.id] = observacoesDoLembrete;
    await axios.post('http://localhost:10000/eventos', {
        tipo: "ObservacaoCriada",
        dados: {
            id: idObservacao,
            texto,
            lembreteId: req.params.id,
            status: 'aguardando',
        },
    });
    res.status(201).send(observacoesDoLembrete);
});

app.listen(port, () => {
  console.log(`Observacoes em http://localhost:${port}`);
});
