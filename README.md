# WebHook Zabbix Para Zulip

Este projeto foi criado para integração entre o **ZULIP** e o **ZABBIX**, possibilitando o envio de alertas do Zabbix diretamente para o Zulip.

---

## Como Usar

1. **Clonar o Repositório**  
   Escolha um diretório (pasta) no seu Linux ou Windows e execute o comando abaixo para clonar o repositório:

    ```bash
    git clone https://github.com/jeffersonalionco/Zabbix-Zulip-Webhook.git
    ```

2. **Acessar a Pasta**  
   Após a clonagem, entre na pasta com o comando:

    ```bash
    cd Zabbix-Zulip-Webhook
    ```

3. **Instalar Dependências**  
   Instale as dependências do projeto com o comando:

    ```bash
    npm install
    ```

4. **Adicionar Configuração do Bot Zulip**  
   É necessário gerar o arquivo **zuliprc** do bot no Zulip e colocá-lo dentro da pasta **Zabbix-Zulip-Webhook/src/**.

5. Mude o arquivo config.json conforme a sua necessidade.

6. **Executar o Projeto**  
   Inicie o projeto com o comando:

    ```bash
    npm index.js
    ```

> **Nota**: Não se esqueça de configurar o Zabbix também!

---

## Configurações no Zabbix

### 1. Criar uma Mídia do Tipo Webhook  
   Em **Alertas** no Zabbix, crie uma mídia do tipo **Webhook** e configure os parâmetros abaixo:

| Parâmetro      | Valor                                          |
|----------------|------------------------------------------------|
| **hostname**   | `{HOST.NAME}`                                  |
| **item**       | `{ITEM.NAME1} is {ITEM.VALUE1}`                |
| **link**       | `{$ZABBIX_URL}/tr_events.php?triggerid={TRIGGER.ID}&eventid={EVENT.ID}` |
| **severity**   | `{TRIGGER.SEVERITY}`                           |
| **status**     | `{TRIGGER.STATUS}`                             |
| **trigger**    | `{TRIGGER.NAME}`                               |
| **eventId**    | `{EVENT.ID}`                                   |
| **ip**         | `{HOST.IP}`                                    |

### 2. Adicionar o Script

   No campo de script do Webhook, cole o código abaixo e substitua `<IP-DO-SERVIDOR>` pelo IP da máquina onde o **WebHook Zabbix para Zulip** está em execução.


```javascript
   try {
    Zabbix.Log(4, 'zulip webhook script value=' + value);

    var result = {
        'tags': {
            'endpoint': 'zulip'
        }
    };

    // Faz o parse do valor recebido
    var params = JSON.parse(value);
    var req = new HttpRequest();
    var payload = {};
    var resp;

    // Define o cabeçalho para JSON
    req.addHeader('Content-Type: application/json');

    // Define o status baseado no estado do trigger
    var status = "";
    if (params.status === "PROBLEM") {
        status = "PROBLEM";
    } else if (params.status === "OK") {
        status = "OK";
    } else {
        status = params.status;
    }

    // Cria o payload para enviar ao seu servidor Node.js
    payload = {
        status: status,
        severity: params.severity,
        hostname: params.hostname,
        item: params.item,
        ip: params.ip,
        eventId: params.eventId,
        trigger: params.trigger,
        link: params.link
    };

    // Defina o endpoint do seu servidor
    var zulip_endpoint = "IP-DO-SERVIDOR-DO-SEU-PROJETO:3007/zabbix-webhook"; // Substitua pelo IP ou hostname do seu servidor

    // Envia a requisição POST para o endpoint
    resp = req.post(zulip_endpoint, JSON.stringify(payload));

    // Verifica se a resposta é bem-sucedida
    if (req.getStatus() !== 200) {
        throw 'Response code: ' + req.getStatus();
    }

    // Processa a resposta
    resp = JSON.parse(resp);
    result.tags.issue_id = resp.id;
    result.tags.issue_key = resp.key;

} catch (error) {
    Zabbix.Log(4, 'zulip issue creation failed json: ' + JSON.stringify(payload));
    Zabbix.Log(4, 'zulip issue creation failed: ' + error);
    result = {};
}

return JSON.stringify(result);
```

<br><br>

3. Configurar Macro
Em Macros, crie a seguinte entrada:

``` Macro
{$ZABBIX_URL} : http://IP-DO-SERVIDOR/ 
```

> IP-DO-SERVIDOR - substitua pelo ip do seu servidor zabbix ativo.


<br> <br> <br>

---

## Dicas Extras para Linux

### Inicialização Automática com Systemd

Para iniciar o serviço automaticamente em reinicializações e falhas, siga os passos abaixo para configurá-lo como um serviço do **systemd**:

1. **Criar Arquivo de Serviço**  
   Execute o comando abaixo para criar o arquivo de serviço no diretório `/etc/systemd/system/`:

    ```bash
    sudo nano /etc/systemd/system/zabbix-zulip-webhook.service
    ```

2. **Configurar o Arquivo de Serviço**  
   No editor, adicione o conteúdo abaixo ao arquivo:

    ```ini
    [Unit]
    Description=Zabbix-Zulip Webhook Service
    After=network.target

    [Service]
    ExecStart=/usr/bin/node /caminho/do/projeto/index.js
    WorkingDirectory=/caminho/do/projeto
    Restart=always
    User=seu_usuario
    Environment=NODE_ENV=production

    [Install]
    WantedBy=multi-user.target
    ```

    > **Nota**:
    > - Substitua `/caminho/do/projeto` pelo caminho completo onde o arquivo `index.js` está localizado.
    > - Substitua `seu_usuario` pelo nome do usuário que executará o serviço.

3. **Atualizar Permissões**  
   Após salvar o arquivo, atualize as permissões com o comando:

    ```bash
    sudo chmod 644 /etc/systemd/system/zabbix-zulip-webhook.service
    ```

4. **Iniciar e Habilitar o Serviço**

   Execute os seguintes comandos para iniciar o serviço e configurá-lo para iniciar automaticamente junto com o sistema:

    ```bash
    sudo systemctl start zabbix-zulip-webhook.service
    sudo systemctl enable zabbix-zulip-webhook.service
    ```

5. **Verificar Status do Serviço**

   Para verificar o status e garantir que o serviço esteja funcionando corretamente, utilize:

    ```bash
    sudo systemctl status zabbix-zulip-webhook.service
    ```

---

Esse arquivo Markdown (`.md`) está formatado para fácil visualização e leitura, contendo seções bem definidas e detalhamentos adicionais para cada etapa do processo.

## Autor

<div align="center">
    <img src="https://github.com/jeffersonalionco.png" width="150" height="150" style="border-radius: 50%;" alt="Foto do Autor">
</div>

**Jefferson Alionco**  
Programador e entusiasta de tecnologias de integração e automação, com ampla experiência em Node.js, servidores e integração com ferramentas de monitoramento como Zabbix e Zulip.  

Entre em contato: [EMAIL: Jefferson L. Alionco](mailto:jeffersonalionco@gmail.com)
