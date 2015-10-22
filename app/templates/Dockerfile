FROM <%= fromOS %>

# Bundle app source
ADD app <%= apploc %>
WORKDIR <%= apploc %>

ADD .env /.env
RUN . /.env

EXPOSE <%= internalPort %>

CMD ["<%= apploc %>/exec"]
