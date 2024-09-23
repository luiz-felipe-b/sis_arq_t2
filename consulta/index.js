const express = require ('express');
const app = express();
app.use(express.json());
const axios = require('axios');

const baseConsulta = {};
const port = 6000;
const funcoes = {
  LembreteCriado: (lembrete) => {
        baseConsulta[lembrete.contador] = lembrete;
  },
  ObservacaoCriada: (observacao) => {
    const observacoes =
      baseConsulta[observacao.lembreteId]["observacoes"] || [];
    observacoes.push(observacao);
    baseConsulta[observacao.lembreteId]["observacoes"] = observacoes;
  },
  ObservacaoAtualizada: (observacao) => {
    const observacoes =
      baseConsulta[observacao.lembreteId]["observacoes"];
    const indice = observacoes.findIndex(o => o.id === observacao.id);
    observacoes[indice] = observacao;
  },
};

app.get('/lembretes', (req, res) => {
    res.status(200).send(baseConsulta);
});

app.post('/eventos', (req, res) => {
    try {
        funcoes[req.body.tipo](req.body.dados);
    } catch (error) {}
    res.status(200).send(baseConsulta);
});

app.listen(port, async () => {
  console.log(`Consultas em http://localhost:${port}`);
  const resp = await axios.get('http://localhost:10000/eventos');
  //axios entrega os dados na propriedade data
  resp.data.forEach((valor) => {
    try {
      funcoes[valor.tipo](valor.dados);
    } catch (error) {}
  });
});
