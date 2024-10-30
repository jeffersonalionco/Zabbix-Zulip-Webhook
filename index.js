const express = require('express');
const zulipInit = require('zulip-js');
const app = express();
const PORT = 3000;

// Ignora a verificação de certificados autoassinados (para desenvolvimento apenas)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Passar o caminho para o seu arquivo zuliprc
const config = { zuliprc: "zuliprc" };
let client;

(async () => {
    client = await zulipInit(config);
})();

app.use(express.json());

app.post('/zabbix-webhook', async (req, res) => {
    const params = req.body;

    try {
        const messageParams = {
            to: "tecnologia", // Nome do stream
            type: "stream",
            topic: "Eventos do Zabbix",
            content: `**Status**: ${params.status}\n**Severidade**: ${params.severity}\n**Hostname**: ${params.hostname}\n**Item**: ${params.item}\n**Trigger**: ${params.trigger}\n[Detalhes do evento](${params.link})`
        };

        const response = await client.messages.send(messageParams);
        res.status(200).send(response);
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        res.status(500).send("Erro ao enviar mensagem");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escutando na porta ${PORT}`);
});
