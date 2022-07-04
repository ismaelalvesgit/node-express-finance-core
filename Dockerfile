FROM node:14-slim

RUN groupadd --gid 10001 app && \
    useradd --gid 10001 --uid 10001 --home-dir /app app
RUN apt-get install tzdata
ENV TZ="America/Fortaleza"
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

LABEL maintainer="Ismael Alves <cearaismael1997@gmail.com>"
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Porta
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=60s --timeout=20s CMD curl --fail http://localhost:3000/system/healthcheck || exit 1

USER 10001:10001
CMD [ "npm", "start" ]