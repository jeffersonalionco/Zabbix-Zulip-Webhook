import express from 'express'
import  { startZulip }   from "./src/zulip.js"
const app = express();
const PORT = 3007;


// Ignora a verificação de certificados autoassinados (para desenvolvimento apenas)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';



app.use(express.json());

app.post('/zabbix-webhook', async (req, res) => {
    startZulip(req, res)
});

app.listen(PORT, () => {
    console.log(`Servidor escutando na porta ${PORT}`);
});
