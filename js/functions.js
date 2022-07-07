let herramientas = []

const fetchData = async ()=> {
  try {
    const resp = await fetch("./JSON/datos.json")
    return await resp.json()
  } catch (error) {
    console.log(error)
  }
  
}


let carro =localStorage.getItem('cart')!=null? JSON.parse(localStorage.getItem('cart')) : [];
////////*********Leer pagina***********////////
function getPage(){
  const path = window.location.pathname;
  const page = path.split("/").pop().split('.')[0];
  return page;
}

////////**********cargar productos a la pagina**********////////


async function loadProducts(){
  const contenedor = document.getElementById("container")
  contenedor.innerHTML = '';
  herramientas = await fetchData();
  herramientas.forEach((producto,indice) => {
    let card = document.createElement('div');
    card.classList.add('col');
    let carta = `
    <div class="card" style="width: 18rem;">
    <img src="${producto.imagen}" class="card-img-top" alt="...">
        <div class="card-body">
      <h5 class="card-title">${producto.descripcion}</h5>
      <p class="card-text">Precio: ${producto.precio} usd</p>
      <input type="button" class="btn btn-primary" id="a" onclick="modificarCarrito('${producto.id}')" value="Agregar">
    </div>
  </div>`
    card.innerHTML = carta;
    contenedor.appendChild(card);
  
  });
}



/////////********** Mostrar el carrito **********///////////


const dibujar = () => {
  if(getPage()!='carrito'){
    return
  }
  let total = 0;
  const carrito = document.getElementById("carrito");
  carrito.className = "container";
  carrito.innerHTML = "";
  if (carro.length > 0) {
    carro.forEach((producto, indice) => {
      total = total + producto.precio * producto.cantidad;
      const carritoContainer = document.createElement("table");
      carritoContainer.className = "table";
      carritoContainer.innerHTML = `<tr><th>
        <img class="car-img" src="${producto.imagen}" width="100" height="100"/>
        </th>
        <th>${producto.descripcion}</th>
        <th>Cantidad: ${producto.cantidad}</th>
        <th><button class= "btn btn-success" id="sumar" onClick="modificarCarrito('${producto.id}')"> + </button> 
            <button class= "btn btn-danger" id="restar" onClick="modificarCarrito('${producto.id}','-')"> - </button></th>
        <th> Precio: $ ${producto.precio}</th>
        <th> Subtotal: $ ${producto.precio * producto.cantidad}</th>
        <th><button class="btn btn-danger"  id="remove-product" onClick="quitarProducto('${indice}')">Eliminar producto</button>
        </th></tr>`;
      carrito.appendChild(carritoContainer);
    });

    const totalContainer = document.createElement("table");
    totalContainer.className = "total-carrito";
    totalContainer.innerHTML = `<td class= "total"> TOTAL $ ${total}</td>
    <button class= "btn btn-danger finalizar" id="finalizar" onClick="finalizarCompra()"> FINALIZAR COMPRA </button>`;
    carrito.appendChild(totalContainer);
  } else {
    carrito.classList.remove("cart");
    carrito.innerHTML=`<h2>Tu carrito esta vacio</h2>`;
  }  
};


///////////**********Cargar funcion por pagina**********/////
function inicializa(){
  const page = getPage();
  switch(page){
    case "carrito":
      dibujar();
      break;
    case "contacto":
      const contactForm = document.getElementById('formularioContacto');
      contactForm.addEventListener('submit',contactar);
      break;
    case "index":
      loadProducts();
      break;

  }
}

inicializa();


//////////**********agregar/modificar carrito **********//////////




const modificarCarrito = (id ,operacion ="+") => {
  const indiceCarrito = carro.findIndex((elemento) => {
    return elemento.id === herramientas[i].id;
  });
  if (indiceCarrito === -1) {
    const nuevoProducto = herramientas.find(x=>x.id === id);
    nuevoProducto.cantidad = 1;
    mostrarMensaje(`Agregaste 1 ${nuevoProducto.descripcion} a tu carrito`, './carrito.html');
    carro.push(nuevoProducto);
    dibujar();

  } else {

    if(operacion ==="-"){
      carro[indiceCarrito].cantidad -= 1;
      
      if(carro[indiceCarrito].cantidad == 0){
        quitarProducto(indiceCarrito);
      }
      else{
        mostrarMensaje(`Quitaste 1 ${carro[indiceCarrito].descripcion} de tu carrito`, './carrito.html');
      }

    }else{
      carro[indiceCarrito].cantidad += 1;
      mostrarMensaje(`Agregaste 1 ${carro[indiceCarrito].descripcion} a tu carrito`, './carrito.html');
    }
    
    dibujar();
  }
  localStorage.setItem('cart', JSON.stringify(carro))
 };


////////********** borrar producto del carrito **********/////////

const quitarProducto = (indice) => {
  mostrarMensaje(`Eliminaste ${carro[indice].descripcion} de tu carrito`, './carrito.html');
  carro.splice(indice, 1);
  localStorage.setItem('cart', JSON.stringify(carro));

  dibujar();
  
  
};


/////********** finalizar compra   **********////


const finalizarCompra = () => {
  const total = document.getElementsByClassName("total")[0].innerHTML;
  carrito.innerHTML = "";
  carro=[];
  localStorage.setItem('cart', JSON.stringify(carro));
  $('#formularioCompra').removeClass("d-none");
  const formEnvio = document.getElementById('formularioCompra');
  formEnvio.addEventListener('submit',envio);
};



////**********Formulario de Contacto*************////



function contactar(evt){
  evt.preventDefault();
  const email = document.getElementById("email").value;
  const nombre = document.getElementById("nombres").value;
  const mensaje = document.getElementById("mensajes").value;

  Swal.fire({
    title: 'Recivimos tu email!',
    text: `${nombre}, nos contactaremos con usted dentro de 48h habiles, a su correo: ${email}`,
    icon: 'success',
    confirmButtonText: 'Entendido'
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      $('#formularioContacto')[0].reset();
           
    } 
  })

}

//////**********Toastyfy **********/////////

function mostrarMensaje(mensaje, URL=null){
  Toastify({
    text: mensaje,
    duration: 3000,
    destination: URL,
    newWindow: false,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      color: "#000000",
      background: "linear-gradient(to right, #eeee77f7, #ffd700)",
    },
    onClick: function(){} // Callback after click
  }).showToast();
}


///////**********mensaje carrito**********/////////
function envio(e){

  e.preventDefault();
  const emailCompra = document.getElementById("emailCompra").value;
  const nombreCompra = document.getElementById("nombreCompra").value;
  const apellidoCompra = document.getElementById("apellidoCompra").value;
  const direccion = document.getElementById("direccion").value;

  Swal.fire({
    title: 'Recepcionamos tu Compra!',
    text: `${nombreCompra} ${apellidoCompra}, tu envio sera despachado dentro de 48h habiles, a tu direccion: ${direccion}`,
    icon: 'success',
    confirmButtonText: 'Hasta la proxima'
    
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      $('form')[0].reset();
      window.location.href='index.html'
      
    } 
  })
}