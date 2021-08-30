# pull the Node.js Docker image
FROM node:alpine

# create the directory inside the container
WORKDIR /app

# copy the package.json files from local machine to the workdir in container
COPY package*.json yarn.lock ./
# run npm install in our local machine
RUN yarn
# copy the generated modules and all other files to the container
COPY . .

# our app is running on port 5000 within the container, so need to expose it
EXPOSE 4000

RUN yarn build
RUN yarn generate
# the command that starts our app
CMD ["yarn", "start"]