FROM <%= fromOS %>

RUN useradd -c 'Docker user' -m -d /home/docker -s /bin/bash docker

# Bundle app source
ADD <%= apploc %> app
WORKDIR app

RUN chown -R dockerdocker /app

USER node

ADD .env /.env
RUN . /.env

EXPOSE <%= internalPort %>

CMD /app/exec
