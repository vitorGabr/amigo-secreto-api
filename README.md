# 🎉 Amigo Secreto

Este projeto é construído usando **Bun**, um runtime JavaScript rápido, e é containerizado usando **Docker**. A aplicação é projetada para rodar em um ambiente de produção usando uma imagem base mínima.

## 📖 Sobre o Projeto

O **Amigo Secreto** é uma aplicação web que facilita a organização de eventos de amigo secreto. Com esta aplicação, os usuários podem criar grupos, adicionar participantes e realizar o sorteio de forma automática, garantindo que cada participante receba um amigo secreto de forma justa e aleatória.

### ✨ Funcionalidades Principais

- **Criação de Grupos:** Permite a criação de grupos para diferentes eventos de amigo secreto.
- **Adição de Participantes:** Os usuários podem adicionar participantes aos grupos com seus respectivos e-mails.
- **Sorteio Automático:** Realiza o sorteio de forma automática, garantindo que cada participante receba um amigo secreto.
- **Notificação por E-mail:** Envia notificações por e-mail para os participantes com o nome do seu amigo secreto.

## 🚀 Começando

Estas instruções ajudarão você a configurar e executar o projeto em sua máquina local para fins de desenvolvimento e teste.

### 📋 Pré-requisitos

- Docker
- Docker Compose (opcional)

### 🛠️ Instalação

1. **Clone o repositório:**
    ```sh
    git clone https://github.com/seuusuario/amigo-secreto.git
    cd amigo-secreto
    ```

2. **Construa a imagem Docker:**
    ```sh
    docker build -t amigo-secreto .
    ```

3. **Execute o container Docker:**
    ```sh
    docker run -p 3000:3000 amigo-secreto
    ```

### 📌 Uso

Uma vez que o container esteja em execução, a aplicação estará acessível em `http://localhost:3000`.

### 🐳 Explicação do Dockerfile

O `Dockerfile` é estruturado em duas etapas:

1. **Etapa de Construção:**
    - Usa a imagem `oven/bun` para instalar dependências e construir o projeto.
    - Faz cache da instalação dos pacotes para acelerar construções subsequentes.
    - Compila e minifica o código-fonte.

2. **Etapa de Produção:**
    - Usa a imagem `gcr.io/distroless/base` para um ambiente de produção mínimo.
    - Copia o servidor construído da etapa de construção.
    - Define o `NODE_ENV` para produção.
    - Expõe a porta 3000.

## 🤝 Contribuindo

Se você deseja contribuir para este projeto, por favor faça um fork do repositório e envie um pull request.

## 📄 Licença

Este projeto é licenciado sob a Licença MIT.

## 🙏 Agradecimentos

- [Bun](https://bun.sh/)
- [Distroless Images](https://github.com/GoogleContainerTools/distroless)
