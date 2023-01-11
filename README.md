# TOLL SYSTEM 

I have three models in my application, one for interchange so any number of interchanges can be added, then one for toll which is made to keep a record of any car that passes any of the interchanges. And finally a receipt. 


The flow of application is simple, once the interchanges have been registered, vehicles can pass through them, once a vehicle passes through an interchange it cannot enter an other interchange, it must make an exit at a difference interchange. License plates are used upon exit to see where the car entered from. Once a car exits the toll system deletes its entry so that it may enter again in the future. At the end a receipt is kept for record keeping. 

To get up and running set the environment variable TOLL_DB_URI for a mongodb local instance. Time is auto by default, but as per requirement it can be modified(if frontend choses to send a time in body it will be considered instead)


## API 
    GET {url}/api/interchange to get all interchanges
    POST {url}/api/interchange to add a new interchange
    PUT {url}/api/interchange to edit an interchange
    DELETE {url}/api/interchange to delete an interchange

    POST {url}/api/toll To enter a car on the highway 
    Exit {url}/api/toll/exit To exit a car from the highway and get the receipt