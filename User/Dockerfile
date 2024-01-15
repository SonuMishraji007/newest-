FROM node:16-alpine
ADD . ./
RUN npm install -ci
EXPOSE 3002
CMD ["node", "server.js"]