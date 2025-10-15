# Enunciado

https://github.com/unq-ui/material/tree/master/TPs/2025s2

# Modelo

https://github.com/unq-ui/instagram-model-js

## Tener en cuenta

Los siguientes archivos y/o carpetas no se suben al repo

* Los archivos .iml 
* /target
* /node_modules
* .log

Dentro de las carpetas que nosotros subimos tienen que estar su proyecto directamente, eso significa que por ejemplo dentro de la carpeta de arena espero ver el `pom.xml` y la carpeta `src`


#### Cambios en la API

# userController:

* Se refactorizo el PUT `/users/{userId}/follow` ya que arrojaba 500 al presionar el boton de seguir/dejar de seguir

* Se elimino una linea de codigo innecesaria en el GET `/user/{userId}`