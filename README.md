WebHook Zabbix Para Zulip

---


Este projeto foi criado para fins de integração entre o **ZULIP** e o **ZABBIX**


---
Como usar?



Pelo terminal (ou CMD) Escolha um diretório **(PASTA)** dentro do seu linux ou Windows e execute o seguinte comando:



Para iniciar automaticamente o projeto Node.js quando a máquina reiniciar, você pode configurá-lo como um serviço do sistema usando o systemd. Isso garante que o projeto inicie junto com o sistema operacional e seja reiniciado automaticamente em caso de falha. Siga estes passos:






# Configuração do Serviço Zabbix-Zulip Webhook

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



