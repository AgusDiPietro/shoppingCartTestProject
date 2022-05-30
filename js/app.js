// Variables
const carrito = document.querySelector('#carrito');
const listaCursos = document.querySelector('#lista-cursos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito'); 
let articulosCarrito = [];

// Listeners
cargarEventListeners();

function cargarEventListeners() {
     // Dispara cuando se presiona "Agregar Carrito"
     listaCursos.addEventListener('click', agregarCurso);

     // Cuando se elimina un curso del carrito
     carrito.addEventListener('click', eliminarCurso);

     // Muestra los cursos del localStorage
     document.addEventListener('DOMContentLoaded', () => {
          articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
          carritoHTML();
     })

     vaciarCarritoBtn.addEventListener('click', () => {
          articulosCarrito = []; // reseteamos el arreglo/carrito
  
          vaciarCarrito(); // eliminamos todo el html
     })
}

// Funciones
// Función que añade el curso al carrito
function agregarCurso(e) {
     e.preventDefault();
     // Delegation para agregar-carrito
     if(e.target.classList.contains('agregar-carrito')) {
          const curso = e.target.parentElement.parentElement;
          // Enviamos el curso seleccionado para tomar sus datos
          leerDatosCurso(curso);
     }
}

// Lee los datos del curso
function leerDatosCurso(curso) {

     // creo objeto con contenido de curso actual.
     const infoCurso = {
          imagen: curso.querySelector('img').src,
          titulo: curso.querySelector('h4').textContent,
          precio: curso.querySelector('.precio span').textContent,
          id: curso.querySelector('a').getAttribute('data-id'), 
          cantidad: 1
     }

     // Revisa si el elemento es repetido en el carrito. 
     if( articulosCarrito.some( curso => curso.id === infoCurso.id ) ) { 
          // Actualizamos la cantidad  -  map crea nuevo arreglo - ver que el curso que estamos agregando es igual a un curso que ya tenemos.
          const cursos = articulosCarrito.map( curso => {
               if( curso.id === infoCurso.id ) {
                    curso.cantidad++;
                     return curso; //trae el objeto actualizado (con su cant actu)
                } else {
                     return curso; // trae los objetos no duplicados
             }
          })
          articulosCarrito = [...cursos];
     }  else {
          // Agregar elementos al arreglo carrito
          articulosCarrito = [...articulosCarrito, infoCurso];
     }

     // console.log(articulosCarrito)
     carritoHTML();
}

// Elimina el curso del carrito en el DOM
function eliminarCurso(e) {
     e.preventDefault();
     if(e.target.classList.contains('borrar-curso') ) {
          // e.target.parentElement.parentElement.remove();
          const cursoId = e.target.getAttribute('data-id')
          
          // Eliminar del arreglo del carrito
          articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

          carritoHTML();
     }
}


// Muestra el curso seleccionado en el Carrito
function carritoHTML() {

     vaciarCarrito();

 // recorre el carrito y genera HTML
     articulosCarrito.forEach(curso => {
          // utilizamos destructuring
          const row = document.createElement('tr');
          // le agregamos HTML y construimos un template sting/literal ( una planilla dentro de la seccion carrito en el html.)
          row.innerHTML = `
               <td>  
                    <img src="${curso.imagen}" width=100>
               </td>
               <td>${curso.titulo}</td>
               <td>${curso.precio}</td>
               <td>${curso.cantidad} </td>
               <td>
                    <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
               </td>
          `;
          // agrega HTML del carrito en el tbody (en el body del html de la pagina)
          contenedorCarrito.appendChild(row);
     });

     //Agregar el carrito de compras al LocalStorage.
     sincronizarStorage(); 


}

function sincronizarStorage(){
     localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Elimina los cursos del carrito en el DOM
function vaciarCarrito() {
     // forma lenta
     // contenedorCarrito.innerHTML = '';

     // forma rapida (recomendada)
     // mientras el contenedor tenga hijo, lo elimina, para que solo quede 1 contenedor.
     while(contenedorCarrito.firstChild) {
          contenedorCarrito.removeChild(contenedorCarrito.firstChild);
      }
}
