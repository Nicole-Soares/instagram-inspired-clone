# Instagram-clone
Trabajo práctico inspirado en Instagram para la materia Interfaces de Usuario en la UNQ. Se realizaron las APIS (Node + Express) para la comunicación con el servicio de back, ademas tambien se realizó la página web responsive (Ract + Vite) junto con su versión mobile (React Native).

# Enunciado

https://github.com/unq-ui/material/tree/master/TPs/2025s2

# Modelo

https://github.com/unq-ui/instagram-model-js

# 🛠️ Tecnologías usadas
React
React Native
React Router
Node
Express
Context + hooks personalizados:
CSS puro para estilos y animaciones.
Fetch API para consumir el backend de preguntas.


# 🧩 Funcionalidades principales
Login / Registrarse.
Pantalla de Home donde se ven los posts de los seguidos.
Dar like / comentar los posts.
Feedback visual inmediato al dar like / comentar / o si hay algún error.
Poder crear / editar / eliminar post propios.
Seguir o dejar de seguir a alguien.
Navbar.
Barra de búsqueda.
Loader inicial: pantalla de carga breve mientras se obtienen los datos.

## 🚀 Cómo ejecutar el proyecto

Pasos para poder ejecutar el proyecto localmente

### 1. Requisitos previos

- [Node.js](https://nodejs.org/) (versión recomendada 18+)
- npm o yarn (cualquiera de los dos)
- Git

### 2. Clonar el repositorio

Abrir la terminal, posicionarse en la carpeta donde se quiera clonar el repo
```bash
git clone https://github.com/Nicole-Soares/instagram-inspired-clone.git
```

### 3. Instalar dependencias

Posicionarse en el repo clonado en el paso anterior con:

cd al repo clonado

Instalar lo necesario para su funcionamiento con:

```bash
npm install
```
Repetir ese proceso para cada sector (Api / web / Mobile)

### 4. Ejecutar localmente

Posicionado en el repo, hacemos cd al sector que querramos y lo levantamos con:

```bash
npm run dev
```
Mayormente se levanta en http://localhost:5173/, copiar y pegar esa url en el navegador o ctrl + click te direcciona al navegador

En el caso de mobile usar:

```bash
npm expo start
```
Para probarlo crearse una cuenta o usar la siguiente información:
mail: jania@gmail.com
password: jania