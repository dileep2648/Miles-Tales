FROM node:22-bookworm

WORKDIR /app

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

COPY Backend/package*.json ./Backend/
RUN cd Backend && npm install

COPY Backend/requirements.txt ./Backend/
RUN pip3 install --break-system-packages -r Backend/requirements.txt

COPY . .

EXPOSE 10000

CMD ["node", "Backend/server.js"]