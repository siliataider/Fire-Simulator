# Fire-Simulator
🚒 This was a 4 days project aiming to deploy a REST API compliant application with the Springboot framework (backend and frontend from scratch) able to connect to the teacher's API, get data related to fires in the region, place them on a map, get data related to the location of the fire engines, connect to the openstreetmap API to get directions, and move the engines towards the fires to reduce their intensity.

### To get started, goto
localhost:8080/html/index.html


### Teaser vidéo de notre projet
https://youtu.be/yPQNRaNWkqw


Organisation de notre projet:

Pour les tâches individuelles; on s’est réparties le travail de manière à faire un peu de back et un peu de front chacune:

La première phase était très orientée front, toutes les requêtes se faisaient en javascript pour dans un premier temps se familiariser avec leaflet et mapbox, et travailler sur l’affichage de la map ainsi que des différents composants du emergency service (casernes, véhicules et feux).

La deuxième phase était de définir l’architecture monolithique de notre projet et de construire notre projet spring boot.

La dernière phase était de faire le lien entre notre front et notre back notamment au niveau du mouvement des véhicules en suivant les instructions proposées par l’api de mapbox.


Schéma d’architecture:

![ProjetMajeure](https://user-images.githubusercontent.com/69010419/192505041-b73383f3-d8a1-463a-a6db-9bb7cfb4049e.jpg)

Structure du projet:

![image](https://user-images.githubusercontent.com/69010419/192505788-a2c1875c-a721-4c46-9a95-4227267f1196.png)
