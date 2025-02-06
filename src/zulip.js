import zulip from 'zulip-js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Formatar a data e hora
const agora = new Date();
const dataFormatada = agora.toLocaleDateString("pt-BR");
const horaFormatada = agora.toLocaleTimeString("pt-BR");



export const startZulip = async (req, res) => {
    try {
        // Passar o caminho para o seu arquivo zuliprc
        const config = { zuliprc: path.join(__dirname, 'zuliprc') };
        const client = await zulip(config);  // Inicializa corretamente

        let contentFormat;
        let messageParams;

        // Obtendo as configurações do projeto
        let configSystem = JSON.parse(fs.readFileSync('./config.json'))

        const params = req.body;

        console.log(req.body.event)

        let contentFormatError = `
---

#### ❌ Problema no Host \`${params.hostname}\`:

- **Status**: ${params.status}
- **Severidade**: ${params.severity}
- **Hostname**: ${params.hostname}
- **IP**: ${params.ip}
- **Item**: ${params.item}
- **Trigger**: ${params.trigger}

| ${configSystem.nomeSystem }   | ${configSystem.nomeEmpresa }  | 
|--------|------|
| Data / Hora: |  ${dataFormatada}, ${horaFormatada}        | 
| Acessar Evento:  |  [Detalhes do evento](${params.link})         |
| ID do Evento: | **${params.eventId}**  |

---
`;

        let contentFormatResolvido = `
---

#### ✅ Problema no Host \`${params.hostname}\` resolvido:

- **Status**: ${params.status}
- **Severidade**: ${params.severity}
- **Hostname**: ${params.hostname}
- **IP**: ${params.ip}
- **Item**: ${params.item}
- **Trigger**: ${params.trigger}

| Zabbix   | Grupo Irani | 
|--------|------|
| Data / Hora: |  ${dataFormatada}, ${horaFormatada}        | 
| Acessar Evento:  |  [Detalhes do evento](${params.link})         |
| ID do Evento: | **${params.eventId}** |

---
`;

        contentFormat = params.status === "OK" ? contentFormatResolvido : contentFormatError;

        if(params.status === 'OK'){
             messageParams = {
                to: "Testes", // Nome do stream
                type: "stream",
                topic: "Resolvido",
                content: contentFormat
            };
        }else{
             messageParams = {
                to: "Testes", // Nome do stream
                type: "stream",
                topic: "Problemas",
                content: contentFormat
            };

        }

        const response = await client.messages.send(messageParams);
        
        if (res) {
            res.status(200).send(response);
        } else {
            console.log("Mensagem enviada:", response);
        }
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        if (res) {
            res.status(500).send("Erro ao enviar mensagem");
        }
    }
};
