FROM <%= from_os %>

# Bundle app source
ADD app /app
WORKDIR /app

ADD .env /.env
RUN . /.env

EXPOSE <%= internal_port %>

CMD ["/app/exec"]
