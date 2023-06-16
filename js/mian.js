//* URL base
const baseUrl = "https://ecommercebackend.fundamentos-29.repl.co/";
//* Dibujar productos en la web
const productsList = document.querySelector("#products-container");
//* Mostrar y ocultar carrito
const navToggle = document.querySelector(".nav__button--toggle");
const navCar = document.querySelector(".nav__car");
//* Carrito de compras
const car = document.querySelector("#car");
const carList = document.querySelector("#car__list");
//* Vaciar carrito
const emptyCarButton = document.querySelector("#empty-car")
//* Car counter
const carCounter = document.querySelector("#car-counter");
//*efecto imagen
const el = document.getElementById('products-container')
const height =el.clientHeight
const width =el.clientWidth
//* Array Carrito
//? Necesitamos tener un array que reciba los elementos que debo introducir en el carrito de compras.
let carProducts = [];
//* Ventana Modal
const modalContainer = document.querySelector("#modal-container");
const modalElement = document.querySelector("#modal-element");
let modalDetails = [];
//*Suma total de valores
const totalValue = document.querySelector("#total-value")


navToggle.addEventListener("click", () => {
    navCar.classList.toggle("nav__car--visible")
})

eventListenersLoader()

function eventListenersLoader() {
    //* Cuando se presione el botón "Add to car"
    productsList.addEventListener("click", addProduct);
    //* Cuando se presione el botón "Delete"
    car.addEventListener("click", deleteProduct);
    //* Cuando se de click al botón Empty Car
    emptyCarButton.addEventListener("click", emptyCar)

    //* Listeners Modal.
    //* Cuando se de click al botón de ver detalles
    productsList.addEventListener("click", modalProduct)
    //* Cuando se de click al botón de cerrar modal.
    modalContainer.addEventListener("click", closeModal)
    //*se ejecuta cuando carga la pagina
    document.addEventListener("DOMContentLoaded",()=>{
        //* si el local storge tiene info entonces,igualamos car products con la info del local storage.pero si el local storage esta vacio entonces carProdcuts igua aun arreglo vacio
        carProducts=JSON.parse(localStorage.getItem('car'))||[];
        carElementsHTML()
    }) 
}


//* Hacer petición a la API de productos
//* 1. Crear una función con la petición:

function getProducts() {
    axios.get(baseUrl)
        .then((response) => {
            const products = response.data
            printProducts(products)
        })
        .catch((error) => {
            console.log(error)
        })
}
getProducts()

//* 2. Renderizar los productos capturados de la API en mi HTML.

function printProducts(products) {
    let html = '';
    for(let product of products) {
        html += `
            <div class="products__element">
                <img src="${product.image}" alt="product_img" class="products__img">
                <p class="products__name">${product.name}</p>
                <div class="products__div">
                    <p class="products__price">USD ${product.price.toFixed(2)}</p>
                </div>
                <div class="products__divs products__divs--flex">
                    <button data-id="${product.id}" class="products__button add_car">
                    <ion-icon name="bag-add-outline"class="icono "></ion-icon> 
                    </button>
                    <button data-id="${product.id}" data-description="${product.description}" class="products__button products__button--search products__details">
                    <ion-icon name="eye-outline"class="icono"></ion-icon>
                    </button>
                </div>
            </div>
        `
    }
    productsList.innerHTML = html
}

//* Agregar los productos al carrito
//* 1. Capturar la información del producto al que se dé click.
function addProduct(event){
    //* Método contains => valída si existe un elemento dentro de la clase.
    if(event.target.classList.contains("add_car")){
        const product = event.target.parentElement.parentElement
        //* parentElement => nos ayuda a acceder al padre inmediatamente superior del elemento.
        carProductsElements(product)
    }
}

//* 2. Debemos transformar la información HTML a un array de objetos.
//* 2.1 Debo validar si el elemento seleccionado ya se encuentra dentro del array del carrito (carProducts). Si existe, le debo sumar una unidad para que no se repita.
function carProductsElements(product){

    const infoProduct = {
        id: product.querySelector('button').getAttribute('data-id'),
        image: product.querySelector('img').src,
        name: product.querySelector('p').textContent,
        price: product.querySelector('.products__div p').textContent,
        quantity: 1
        // textContent nos permite pedir el texto que contiene un elemento.
    }
    
    //* Agregar el objeto de infoProduct al array de carProducts, pero hay que validar si el elemento existe o no.
    //? El primer if valída si por lo menos un elemento que se encuentre en carProducts es igual al que quiero enviarle en infoProduct.
    if( carProducts.some( product => product.id === infoProduct.id ) ){ //True or False
        const productIncrement = carProducts.map(product => {
            if(product.id === infoProduct.id){
                product.quantity++
                return product
            } else {
                return product
            }
        })
        carProducts = [ ...productIncrement ]
    } else {
        carProducts = [ ...carProducts, infoProduct ]
    }
    
    carElementsHTML();
}

function carElementsHTML() {

    let carHTML = '';
    for (let product of carProducts){
        carHTML += `
        <div class="car__product">
            <div class="car__product__image">
              <img src="${product.image}">
            </div>
            <div class="car__product__description">
              <p>${product.name}</p>
              <p>Precio: ${product.price}</p>
              <p>Cantidad: ${product.quantity}</p>
            </div>
            <div class="car__product__button">
                <button class="delete__product" data-id="${product.id}">
                    <img src="./img/basurero.png" >
                </button>
            </div>
        </div>
        <hr>
        `
        productsStorage()
    }

    carList.innerHTML = carHTML;
//* Crear suma total del pedido.
    if(carProducts.length > 0){
        totalValue.innerHTML = `<h3>Suma Total: USD ${total.toFixed(2)}</h3>`
    } else {
        totalValue.innerHTML = ""
    }

    let value = 0
    for (let counter of carProducts) {
        value += counter.quantity
    }
    carCounter.innerHTML = `<p>${value}</p>`

    productsStorage()
    
}
   
//*localStorage
    function productsStorage(){
        localStorage.setItem("car",JSON.stringify(carProducts))
    }

//* Eliminar productos del carrito
function deleteProduct(event) {
    if( event.target.classList.contains('delete__product') ){
        const productId = event.target.getAttribute('data-id')
        carProducts = carProducts.filter(product => product.id != productId)
        carElementsHTML()
    }
}

//* Vaciar el carrito
function emptyCar() {
    carProducts = [];
    carElementsHTML();
}
//* Ventana Modal
//* 1. Crear función que escuche el botón del producto.
function modalProduct(event) {
    if(event.target.classList.contains("products__details")){
        modalContainer.classList.add("show__modal")
        const product = event.target.parentElement.parentElement
        modalDetailsElement(product)
    }
}

//* 2. Crear función que escuche el botón de cierre.
function closeModal(event) {
    if(event.target.classList.contains("modal__icon")){
        modalContainer.classList.remove("show__modal")
    }
}

//* 3. Crear función que convierta la info HTML en objeto.
function modalDetailsElement(product) {

    const infoDatails = {
        id: product.querySelector('button').getAttribute('data-id'),
        image: product.querySelector('img').src,
        name: product.querySelector('p').textContent,
        price: product.querySelector('.products__div .products__price').textContent,
        description: product.querySelector('.products__details').getAttribute('data-description')
    }
    modalDetails = [ ...modalDetails, infoDatails ]
    modalHTML()
}

//* 4. Dibujar producto dentro del modal.
function modalHTML() {

    let detailsHTML = ""
    for( let element of modalDetails ) {
        detailsHTML = `
        <div class="modal__product">
            <div >
                <img src="${element.image}" class="modal__img">
            </div>
        
            <div class ="container">
                <div class="modal__description">
                    <p>${element.name}</p>
                
                </div>
                <div class="modal__product__h2">
                    <h2>${element.description}</h2>
                </div>
                <div>
                    <p class = "modal__price">Precio: ${element.price}</p>
                </div>
                <div class ="button_modal">
                    <button> S </button>
                    <button> M </button>
                    <button> L </button>
                </div>
              
            </div>
        </div>
        
        `
    }
    modalElement.innerHTML = detailsHTML
}
//*local storage es una base de datos del navegador que nos permte almacenar informacion paraa  hacerlo recurrente dentro de nuestra pagina

//?guardando un valor en e local storage=>setItem("key","value")
//*localStorage.setItem("name","alejandro")

//?obtener info desde lcoal storage
//*console.log(localStorage.getItem("name"));

//?nesecitamos convertir ese objeto en json
//*const user={name:'Alejandro', lastName:'betancour'}
//?covertir json en un json
//*localStorage.setItem("user",JSON.stringify(user))
//?con esto convertimos la info en json
//?botener la info y convertirla de json a javascript
//*const userLocal=localStorage.getItem("user")
//*JSON.parse(userLocal)

