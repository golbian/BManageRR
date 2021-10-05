FROM node:current-alpine

# setup the user info
ENV USER=managerr
ENV UID=12345
ENV GID=12345

EXPOSE 8080/tcp

# Create app directory
WORKDIR /usr/src/managerr

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY backend/package.*json ./

# install dependencies
RUN apk --no-cache add --virtual builds-deps build-base git

# add new group
RUN addgroup -S "$USER" --gid "$GID"

# add new user
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "$(pwd)" \
    --ingroup "$USER" \
    --no-create-home \
    --uid "$UID" \
    "$USER"

RUN chown $USER:$USER ./

# run the next commands as the specified user
USER $USER

COPY letsencrypt /etc/letsencrypt/

RUN git clone https://github.com/golbian/BManageRR

WORKDIR /usr/src/managerr/BManageRR

# Calls for a random number to break the cahing of the git clone
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache
RUN git pull

# install node packages
RUN npm i
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
#COPY ./backend/*  ./

CMD [ "node", "server.js" ]