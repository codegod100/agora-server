FROM debian:12-slim
RUN apt update && apt install -y python3 nodejs python3-poetry npm
WORKDIR /workspace/agora-server
COPY pyproject.toml pyproject.toml
RUN poetry install
COPY package.json package.json
RUN npm install
COPY . .
RUN mkdir -p /home/root/agora/
RUN touch /home/root/agora/sources.yaml
CMD ["./run-prod.sh",]