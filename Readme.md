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

* Se elimino una linea de codigo innecesaria en el GET `/user/{userId}`.

# createPost y updatePost

* se tuvo que agregar que la imagen acepte valores que empiecen con https, https. 
* se agrego una nueva constante para hacer referencia al post real en el json retornado.