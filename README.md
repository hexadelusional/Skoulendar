# Skoulendar
*The Ultimate School Calendar*

By AdèlandÉlodie

## Initialize database
MySQL is used to build and handle our database. In order for it to work properly on
your computer, please install mySQL and configure it in order to have a username and
a password (you can use the root as user). After that, change the content of the .env 
file to match your configuration:
```
DB_HOST='localhost' //That doesn't change, your PC will host the server
DB_USER='root' //Here put your username
DB_PASSWORD='rootpassword' //Here put your password
DB_DATABASE='skoulendar' //That doesn't change, it is the name of the database
```

## Install the latest versions of the node_modules for frontend & backend
Open your terminal and use `cd` to move to the location of the Skoulendar project. 
Then, move to the server directory (`cd /server`) and type in `npm install` to update the backend modules. 
Redo the last step but with in the skoulendar directory (`cd /server`) to update the frontend modules.

## Starting the frontend and the backend
To start the frontend : ```cd /skoulendar``` & ```npm run dev```.

To start the backend : ```cd /server``` & ```nodemon start```.
If nodemon doesn't work, type in ```node server.js```.

## To create the database
mysql -u root -p skoulendar < db_init.sql

## To populate the database
mysql -u root -p skoulendar < db_populate.sql
<br/><br/>

password for id 1 : 160305

password for id 2 : 040304
