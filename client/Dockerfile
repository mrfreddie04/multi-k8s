# STEP 1 - BUILDER
# specify base image
FROM node:16-alpine AS builder

# switch user from root to node
USER node

# make work directory - to ensure it is created under node user
RUN mkdir -p /home/node/app
# set work directory 
WORKDIR /home/node/app

# download & install a dependencies - use chown to make user the files are oned by node user
COPY --chown=node:node ./package.json ./
RUN npm install

# download source code
COPY --chown=node:node ./ ./

# build production files
RUN npm run build

# STEP 2 - RUNNER
FROM nginx AS runner

COPY --from=builder /home/node/app/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf