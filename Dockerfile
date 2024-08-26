FROM node:20.16-alpine

WORKDIR /app

COPY dist .

EXPOSE 3000

CMD ["node", "main.js"]
