# WebHook Zabbix Para Zulip

---


Este projeto foi criado para fins de integração entre o **ZULIP** e o **ZABBIX**


---
<BR>

## Como usar?



Pelo terminal (ou CMD) Escolha um diretório **(PASTA)** dentro do seu linux ou Windows e execute o seguinte comando:



Para iniciar automaticamente o projeto Node.js quando a máquina reiniciar, você pode configurá-lo como um serviço do sistema usando o systemd. Isso garante que o projeto inicie junto com o sistema operacional e seja reiniciado automaticamente em caso de falha. Siga estes passos:



```bash
git clone https://github.com/jeffersonalionco/Zabbix-Zulip-Webhook.git
```


Depois entre na pasta baixada com o comado:



```bash
cd Zabbix-Zulip-Webhook
 ```

 Após entrar na pasta será necessario instalar alguas dependencias com o comando:

 
```bash
npm install
```


>  **Nota**:
> - É necessario gerar o arquivo **zuliprc** do seu bot no zulip e colocar dentro desta pasta **Zabbix-Zulip-Webhook** do seu projeto.
> ...


Pronto agora so executar

```bash
npm index.js
```

**Não esqueça - de configurar o zabbix também.**

---

<br> <br> <br>
# Configurações no Zabbix 


Em alertas no zabbix crie uma midia  do tipo webhook, em parametros coloque os abaixos:


> Parâmetros do Zabbix

| Parâmetro      | Valor                                          |
|----------------|------------------------------------------------|
| **hostname**   | `{HOST.NAME}`                                  |
| **item**       | `{ITEM.NAME1} is {ITEM.VALUE1}`                |
| **link**       | `{$ZABBIX_URL}/tr_events.php?triggerid={TRIGGER.ID}&eventid={EVENT.ID}` |
| **severity**   | `{TRIGGER.SEVERITY}`                           |
| **status**     | `{TRIGGER.STATUS}`                             |
| **trigger**    | `{TRIGGER.NAME}`                               |



<br><br>

> Na opção de script cole o codigo abaixo:
    > - **Nota:**
    > - Em **IP-DO-SERVIDOR** insira o ip do servidor(Maquina) que você irá executar o *WebHook Zabbix Para Zulip* que você acabou de baixar e instalar.
<br>

```script
try {
    Zabbix.Log(4, 'valor do script do webhook zulip. Value=' + value);

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
        status = "**⚠️ Problema detectado**. \n\n Nível:";
    } else if (params.status === "OK") {
        status = "**✅ Problema Resolvido** \n\n Nível:";
    } else {
        status = params.status;
    }

    // Cria o payload para enviar ao seu servidor Node.js
    payload = {
        status: status,
        severity: params.severity,
        hostname: params.hostname,
        item: params.item,
        trigger: params.trigger,
        link: params.link
    };

    // Defina o endpoint do seu servidor
    var zulip_endpoint = "<IP-DO-SERVIDOR>:3007/zabbix-webhook"; // Substitua pelo IP ou hostname do seu servidor

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
    Zabbix.Log(4, 'Criação do problema zulip falhou JSON: ' + JSON.stringify(payload));
    Zabbix.Log(4, 'Falha na criação do problema zulip: ' + error);
    result = {};
}

return JSON.stringify(result);

```

<br><br>

Depois la em macro crie o seguinte

``` Macro
{$ZABBIX_URL} : http://IP-DO-SERVIDOR/ 
```

> IP-DO-SERVIDOR - substitua pelo ip do seu servidor zabbix ativo.


<br> <br> <br>

---

# DICAS EXTRAS LINUX 
## - Para inicializar o serviço automatico do Zabbix-Zulip Webhook siga as etapas abaixo

Este guia fornece instruções para configurar o serviço **Zabbix-Zulip Webhook** para iniciar automaticamente em reinicializações e falhas, usando **systemd**.

## Passo 1: Crie o Arquivo de Serviço

1. Execute o comando abaixo para criar o arquivo de serviço no diretório `/etc/systemd/system/`:

    ```bash
    sudo nano /etc/systemd/system/zabbix-zulip-webhook.service
    ```

2. No editor, adicione o conteúdo abaixo ao arquivo:

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
> - Substitua `/caminho/do/projeto` pelo diretório completo onde o seu projeto `index.js` está localizado.
> - Substitua `seu_usuario` pelo nome do usuário que executará o serviço.

## Passo 2: Atualize as Permissões do Arquivo de Serviço

Depois de salvar o arquivo, atualize as permissões com o comando:

```bash
sudo chmod 644 /etc/systemd/system/zabbix-zulip-webhook.service



