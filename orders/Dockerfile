FROM node:alpine

WORKDIR /app
COPY package.json .
# Install all dependencies including devDependencies
RUN npm install --only=prod --legacy-peer-deps
COPY . .

CMD ["npm", "start"]