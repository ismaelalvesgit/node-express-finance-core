# Build application
FROM node:18-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Release application
FROM node:18-alpine
LABEL maintainer="Ismael Alves <cearaismael1997@gmail.com>"
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./
COPY --from=build /app/entrypoint.sh ./entrypoint.sh

RUN npm install --only=production
RUN chmod +x /app/entrypoint.sh
RUN addgroup -S app && adduser -S -G app app 

USER app

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]

CMD [ "/app/entrypoint.sh" ]