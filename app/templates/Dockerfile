FROM <%= fromOS %>

# Bundle app source
ADD app /app
WORKDIR /app

ADD .env /.env
RUN . /.env

EXPOSE <%= internalPort %>

CMD ["/app/exec"]
