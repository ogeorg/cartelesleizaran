# CartelesLeizaran / google cloud version


docker run -d \
  --name mariadb-cartelesleizaran \
  -e MARIADB_DATABASE=cartelesleizaran \
  -e MARIADB_ROOT_PASSWORD=123 \
  -v D:\Projects\Docker\Nodejs\cartelesleizaran\mariadb_volume:/var/lib/mysql \
  -p 3306:3306 \
  mariadb:latest
  
    -e MARIADB_USER=cartelesleizaran \
  -e MARIADB_PASSWORD=123 \


he pasado a docker compose
hay 3 containers:
- mariadb
- cliente sql
- applicacion nodejs

para conectarse a la BD en el cliente: mysql -h mariadb -u root -p

tengo que:
- ver como connectar desde windows a mariadb
- crear un dockerfile
- crear las bases de datos (eliminar el directorio data, se recrea con init.sql)
- volver a meter el Datastore para gcloud datastore