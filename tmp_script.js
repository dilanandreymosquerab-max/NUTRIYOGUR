

/* =====================================================
   DATOS INICIALES
===================================================== */

const defaultProducts = [
    {
        id:1,
        name:"Fresa",
        category:"frutas",
        price:6000,
        emoji:"🍓"
    },
    {
        id:2,
        name:"Mora",
        category:"frutas",
        price:6000,
        emoji:"🫐"
    },
    {
        id:3,
        name:"Maracuyá",
        category:"frutas",
        price:6000,
        emoji:"🥭"
    },
    {
        id:4,
        name:"Piña",
        category:"frutas",
        price:6000,
        emoji:"🍍"
    },
    {
        id:5,
        name:"Coco",
        category:"frutas",
        price:6000,
        emoji:"🥥"
    },
    {
        id:6,
        name:"Café",
        category:"especiales",
        price:6500,
        emoji:"☕"
    },
    {
        id:7,
        name:"Guanábana",
        category:"frutas",
        price:6000,
        emoji:"🍈"
    },
    {
        id:8,
        name:"Natural",
        category:"especiales",
        price:5500,
        emoji:"🥛"
    }
];


/* =====================================================
   LOCAL STORAGE
===================================================== */

if(!localStorage.getItem("nutriyogur_products")){
    localStorage.setItem(
        "nutriyogur_products",
        JSON.stringify(defaultProducts)
    );
}

if(!localStorage.getItem("nutriyogur_users")){

    localStorage.setItem(
        "nutriyogur_users",
        JSON.stringify([
            {
                name:"Cliente Demo",
                username:"cliente",
                email:"cliente@nutriyogur.com",
                password:"1234"
            }
        ])
    );

}

if(!localStorage.getItem("nutriyogur_orders")){
    localStorage.setItem(
        "nutriyogur_orders",
        JSON.stringify([])
    );
}


let products =
    JSON.parse(
        localStorage.getItem("nutriyogur_products")
    );

let users =
    JSON.parse(
        localStorage.getItem("nutriyogur_users")
    );

let orders =
    JSON.parse(
        localStorage.getItem("nutriyogur_orders")
    );

let currentUser = null;

let cart = [];


/* =====================================================
   ACCESO
===================================================== */

let accessType = "client";


function selectAccess(type){

    accessType = type;

    document
        .getElementById("clientAccess")
        .classList.toggle(
            "active",
            type === "client"
        );

    document
        .getElementById("adminAccess")
        .classList.toggle(
            "active",
            type === "admin"
        );

    if(type === "admin"){

        document.getElementById("authTitle")
            .textContent =
            "Acceso administrativo";

        document.getElementById("registerButton")
            .classList.add("hidden");

        document.getElementById("demoInfo")
            .innerHTML =
            "<b>Administrador de prueba:</b><br>" +
            "Usuario: admin<br>" +
            "Contraseña: admin123";

    }else{

        document.getElementById("authTitle")
            .textContent =
            "Acceso de cliente";

        document.getElementById("registerButton")
            .classList.remove("hidden");

        document.getElementById("demoInfo")
            .innerHTML =
            "<b>Cuenta de prueba cliente:</b><br>" +
            "Usuario: cliente<br>" +
            "Contraseña: 1234";
    }
}


/* =====================================================
   LOGIN
===================================================== */

function login(){

    const username =
        document.getElementById("loginUser")
        .value.trim();

    const password =
        document.getElementById("loginPassword")
        .value;

    if(!username || !password){

        alert("Completa usuario y contraseña.");

        return;
    }


    /* ADMIN */

    if(accessType === "admin"){

        if(
            username === "admin" &&
            password === "admin123"
        ){

            currentUser = {
                username:"admin",
                name:"Administrador",
                role:"admin"
            };

            showAdmin();

        }else{

            alert(
                "Datos incorrectos.\n\n" +
                "Usuario: admin\n" +
                "Contraseña: admin123"
            );
        }

        return;
    }


    /* CLIENTE */

    const user = users.find(
        u =>
            u.username === username &&
            u.password === password
    );

    if(!user){

        alert(
            "Usuario o contraseña incorrectos."
        );

        return;
    }

    currentUser = {
        ...user,
        role:"client"
    };

    showClient();
}


/* =====================================================
   MOSTRAR CLIENTE
===================================================== */

function showClient(){

    document
        .getElementById("authScreen")
        .classList.add("hidden");

    document
        .getElementById("adminApp")
        .classList.add("hidden");

    document
        .getElementById("clientApp")
        .classList.remove("hidden");

    document
        .getElementById("clientName")
        .textContent =
        currentUser.name;

    renderProducts();
    renderClientOrders();
    updateCart();

    window.scrollTo(0,0);
}


/* =====================================================
   MOSTRAR ADMIN
===================================================== */

function showAdmin(){

    document
        .getElementById("authScreen")
        .classList.add("hidden");

    document
        .getElementById("clientApp")
        .classList.add("hidden");

    document
        .getElementById("adminApp")
        .classList.remove("hidden");

    renderAdmin();

    window.scrollTo(0,0);
}


/* =====================================================
   LOGOUT
===================================================== */

function logout(){

    currentUser = null;
    cart = [];

    document
        .getElementById("clientApp")
        .classList.add("hidden");

    document
        .getElementById("adminApp")
        .classList.add("hidden");

    document
        .getElementById("authScreen")
        .classList.remove("hidden");

    document
        .getElementById("loginUser")
        .value = "";

    document
        .getElementById("loginPassword")
        .value = "";

    selectAccess("client");
}


/* =====================================================
   REGISTRO
===================================================== */

function openRegister(){

    document
        .getElementById("registerModal")
        .classList.remove("hidden");
}


function closeRegister(){

    document
        .getElementById("registerModal")
        .classList.add("hidden");
}


function registerClient(){

    const name =
        document.getElementById("registerName")
        .value.trim();

    const username =
        document.getElementById("registerUser")
        .value.trim();

    const email =
        document.getElementById("registerEmail")
        .value.trim();

    const password =
        document.getElementById("registerPassword")
        .value;


    if(!name || !username || !email || !password){

        alert("Completa todos los campos.");

        return;
    }


    if(users.some(u => u.username === username)){

        alert("Ese usuario ya existe.");

        return;
    }


    users.push({
        name,
        username,
        email,
        password
    });


    localStorage.setItem(
        "nutriyogur_users",
        JSON.stringify(users)
    );


    alert(
        "Cuenta creada correctamente."
    );

    closeRegister();


    document.getElementById("loginUser")
        .value = username;

    document.getElementById("loginPassword")
        .value = password;
}


/* =====================================================
   PRODUCTOS CLIENTE
===================================================== */

function renderProducts(category="todos"){

    products =
        JSON.parse(
            localStorage.getItem(
                "nutriyogur_products"
            )
        );

    const grid =
        document.getElementById(
            "productGrid"
        );

    grid.innerHTML = "";


    const filtered =
        category === "todos"
        ? products
        : products.filter(
            p => p.category === category
        );


    filtered.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "product-card";


        card.innerHTML = `

            <div class="product-image">
                ${product.emoji || "🥛"}
            </div>

            <div class="product-info">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    Yogur Nutriyogur
                    ${product.name}.
                </p>

                <div class="price">
                    $${formatMoney(product.price)}
                </div>

                <button
                    class="add-cart"
                    onclick="addToCart(${product.id})">

                    🛒 Agregar al carrito

                </button>

            </div>
        `;


        grid.appendChild(card);

    });

}


function filterProducts(category,button){

    document
        .querySelectorAll(".filter")
        .forEach(
            b => b.classList.remove("active")
        );

    button.classList.add("active");

    renderProducts(category);
}


/* =====================================================
   CARRITO
===================================================== */

function addToCart(productId){

    const product =
        products.find(
            p => p.id === productId
        );

    if(!product) return;


    const existing =
        cart.find(
            item => item.id === productId
        );


    if(existing){

        existing.quantity++;

    }else{

        cart.push({
            ...product,
            quantity:1
        });

    }


    updateCart();

    openCart();
}


function updateCart(){

    const container =
        document.getElementById(
            "cartItems"
        );

    if(!container) return;

    container.innerHTML = "";

    let total = 0;


    if(cart.length === 0){

        container.innerHTML =
            "<p>Tu carrito está vacío.</p>";

    }


    cart.forEach(item => {

        total +=
            item.price * item.quantity;


        const div =
            document.createElement("div");

        div.className =
            "cart-item";


        div.innerHTML = `

            <div>

                <strong>
                    ${item.emoji}
                    ${item.name}
                </strong>

                <br>

                <small>
                    $${formatMoney(item.price)}
                </small>

            </div>

            <div class="qty">

                <button
                    onclick="changeQty(${item.id},-1)">
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    onclick="changeQty(${item.id},1)">
                    +
                </button>

            </div>
        `;


        container.appendChild(div);

    });


    document.getElementById(
        "cartTotal"
    ).textContent =
        formatMoney(total);
}


function changeQty(id,change){

    const item =
        cart.find(
            p => p.id === id
        );

    if(!item) return;


    item.quantity += change;


    if(item.quantity <= 0){

        cart =
            cart.filter(
                p => p.id !== id
            );

    }


    updateCart();
}


function openCart(){

    document
        .getElementById("cartPanel")
        .classList.remove("hidden");

}


function closeCart(){

    document
        .getElementById("cartPanel")
        .classList.add("hidden");

}


/* =====================================================
   PEDIDO
===================================================== */

function checkout(){

    if(cart.length === 0){

        alert(
            "Agrega productos al carrito primero."
        );

        return;
    }


    const total =
        cart.reduce(
            (sum,item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    const order = {

        id:
            "NTR-" +
            Date.now(),

        username:
            currentUser.username,

        client:
            currentUser.name,

        items:
            cart.map(
                item => ({
                    name:item.name,
                    price:item.price,
                    quantity:item.quantity
                })
            ),

        total,

        date:
            new Date().toLocaleString(
                "es-CO"
            ),

        status:
            "Pendiente"
    };


    orders.push(order);


    localStorage.setItem(
        "nutriyogur_orders",
        JSON.stringify(orders)
    );


    cart = [];

    updateCart();

    closeCart();

    renderClientOrders();

    renderAdmin();


    alert(
        "¡Pedido realizado correctamente!\n\n" +
        "Número: " + order.id
    );

    goTo("pedidos");
}


/* =====================================================
   PEDIDOS CLIENTE
===================================================== */

function renderClientOrders(){

    const container =
        document.getElementById(
            "clientOrders"
        );

    if(!container) return;


    orders =
        JSON.parse(
            localStorage.getItem(
                "nutriyogur_orders"
            )
        );


    const myOrders =
        orders.filter(
            o =>
                o.username ===
                currentUser.username
        );


    if(myOrders.length === 0){

        container.innerHTML = `
            <div class="order-card">
                <p>
                    Todavía no tienes pedidos.
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    myOrders
        .slice()
        .reverse()
        .forEach(order => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "order-card";


            let productsText =
                order.items
                .map(
                    i =>
                    `${i.quantity}x ${i.name}`
                )
                .join(", ");


            card.innerHTML = `

                <div class="order-top">

                    <strong>
                        ${order.id}
                    </strong>

                    <span class="status ${order.status}">
                        ${order.status}
                    </span>

                </div>

                <p>
                    ${productsText}
                </p>

                <br>

                <strong>
                    Total:
                    $${formatMoney(order.total)}
                </strong>

                <br>

                <small>
                    ${order.date}
                </small>

            `;


            container.appendChild(card);

        });

}


/* =====================================================
   WHATSAPP
===================================================== */

function openWhatsApp(){

    if(cart.length === 0){

        alert(
            "Agrega productos al carrito antes de enviar el pedido."
        );

        return;
    }


    let message =
        "Hola Nutriyogur 👋%0A%0A" +
        "Quiero realizar este pedido:%0A";


    cart.forEach(item => {

        message +=
            `• ${item.name} x${item.quantity} - $${formatMoney(item.price * item.quantity)}%0A`;

    });


    const total =
        cart.reduce(
            (sum,item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    message +=
        `%0ATotal: $${formatMoney(total)}`;


    /*
       CAMBIA ESTE NÚMERO POR EL WHATSAPP
       COMERCIAL REAL DE NUTRIYOGUR.
    */

    const phone =
        "573000000000";


    window.open(
        `https://wa.me/${phone}?text=${message}`,
        "_blank"
    );
}


/* =====================================================
   ADMIN
===================================================== */

function renderAdmin(){

    products =
        JSON.parse(
            localStorage.getItem(
                "nutriyogur_products"
            )
        );

    users =
        JSON.parse(
            localStorage.getItem(
                "nutriyogur_users"
            )
        );

    orders =
        JSON.parse(
            localStorage.getItem(
                "nutriyogur_orders"
            )
        );


    document.getElementById(
        "statOrders"
    ).textContent =
        orders.length;


    document.getElementById(
        "statProducts"
    ).textContent =
        products.length;


    document.getElementById(
        "statClients"
    ).textContent =
        users.length;


    const sales =
        orders.reduce(
            (sum,o) =>
                sum + o.total,
            0
        );


    document.getElementById(
        "statSales"
    ).textContent =
        "$" + formatMoney(sales);


    renderAdminProducts();
    renderAdminOrders();
    renderAdminClients();
}


/* =====================================================
   ADMIN PRODUCTOS
===================================================== */

function renderAdminProducts(){

    const tbody =
        document.getElementById(
            "adminProducts"
        );

    tbody.innerHTML = "";


    products.forEach(product => {

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>
                ${product.emoji}
                ${product.name}
            </td>

            <td>
                ${product.category}
            </td>

            <td>
                $${formatMoney(product.price)}
            </td>

            <td>

                <button
                    class="action-btn edit"
                    onclick="editProduct(${product.id})">
                    Editar
                </button>

                <button
                    class="action-btn delete"
                    onclick="deleteProduct(${product.id})">
                    Eliminar
                </button>

            </td>
        `;


        tbody.appendChild(tr);

    });

}


/* =====================================================
   ADMIN PRODUCTO MODAL
===================================================== */

function openProductModal(){

    document.getElementById(
        "productModalTitle"
    ).textContent =
        "Agregar producto";


    document.getElementById(
        "editProductId"
    ).value = "";


    document.getElementById(
        "productName"
    ).value = "";


    document.getElementById(
        "productPrice"
    ).value = "";


    document.getElementById(
        "productEmoji"
    ).value = "🥛";


    document.getElementById(
        "productModal"
    ).classList.remove("hidden");
}


function closeProductModal(){

    document.getElementById(
        "productModal"
    ).classList.add("hidden");
}


function editProduct(id){

    const product =
        products.find(
            p => p.id === id
        );

    if(!product) return;


    document.getElementById(
        "productModalTitle"
    ).textContent =
        "Editar producto";


    document.getElementById(
        "editProductId"
    ).value =
        product.id;


    document.getElementById(
        "productName"
    ).value =
        product.name;


    document.getElementById(
        "productCategory"
    ).value =
        product.category;


    document.getElementById(
        "productPrice"
    ).value =
        product.price;


    document.getElementById(
        "productEmoji"
    ).value =
        product.emoji;


    document.getElementById(
        "productModal"
    ).classList.remove("hidden");
}


function saveProduct(){

    const id =
        document.getElementById(
            "editProductId"
        ).value;


    const name =
        document.getElementById(
            "productName"
        ).value.trim();


    const category =
        document.getElementById(
            "productCategory"
        ).value;


    const price =
        Number(
            document.getElementById(
                "productPrice"
            ).value
        );


    const emoji =
        document.getElementById(
            "productEmoji"
        ).value.trim();


    if(!name || !price){

        alert(
            "Completa nombre y precio."
        );

        return;
    }


    if(id){

        const product =
            products.find(
                p =>
                    p.id === Number(id)
            );

        product.name = name;
        product.category = category;
        product.price = price;
        product.emoji = emoji || "🥛";

    }else{

        products.push({

            id:
                Date.now(),

            name,

            category,

            price,

            emoji:
                emoji || "🥛"
        });

    }


    localStorage.setItem(
        "nutriyogur_products",
        JSON.stringify(products)
    );


    closeProductModal();

    renderAdmin();

    renderProducts();

    alert(
        "Producto guardado correctamente."
    );
}


function deleteProduct(id){

    if(
        !confirm(
            "¿Seguro que deseas eliminar este producto?"
        )
    ){
        return;
    }


    products =
        products.filter(
            p => p.id !== id
        );


    localStorage.setItem(
        "nutriyogur_products",
        JSON.stringify(products)
    );


    renderAdmin();

    renderProducts();
}


/* =====================================================
   ADMIN PEDIDOS
===================================================== */

function renderAdminOrders(){

    const tbody =
        document.getElementById(
            "adminOrders"
        );

    tbody.innerHTML = "";


    orders
        .slice()
        .reverse()
        .forEach(order => {

            const tr =
                document.createElement("tr");


            tr.innerHTML = `

                <td>
                    ${order.id}
                </td>

                <td>
                    ${order.client}
                </td>

                <td>
                    $${formatMoney(order.total)}
                </td>

                <td>
                    ${order.date}
                </td>

                <td>

                    <select
                        onchange="changeOrderStatus('${order.id}',this.value)">

                        <option
                            ${order.status==="Pendiente"?"selected":""}>
                            Pendiente
                        </option>

                        <option
                            ${order.status==="Preparando"?"selected":""}>
                            Preparando
                        </option>

                        <option
                            ${order.status==="Enviado"?"selected":""}>
                            Enviado
                        </option>

                        <option
                            ${order.status==="Entregado"?"selected":""}>
                            Entregado
                        </option>

                    </select>

                </td>
            `;


            tbody.appendChild(tr);

        });

}


function changeOrderStatus(id,status){

    const order =
        orders.find(
            o => o.id === id
        );

    if(!order) return;


    order.status = status;


    localStorage.setItem(
        "nutriyogur_orders",
        JSON.stringify(orders)
    );


    renderAdmin();

    if(currentUser?.role === "client"){
        renderClientOrders();
    }

}


/* =====================================================
   ADMIN CLIENTES
===================================================== */

function renderAdminClients(){

    const tbody =
        document.getElementById(
            "adminClients"
        );

    tbody.innerHTML = "";


    users.forEach(user => {

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>
                ${user.username}
            </td>

            <td>
                ${user.name}
            </td>

            <td>
                ${user.email}
            </td>
        `;


        tbody.appendChild(tr);

    });

}


/* =====================================================
   NAVEGACIÓN
===================================================== */

function goTo(id){

    const element =
        document.getElementById(id);

    if(element){

        element.scrollIntoView({
            behavior:"smooth"
        });

    }

}


/* =====================================================
   FORMATO
===================================================== */

function formatMoney(value){

    return Number(value)
        .toLocaleString(
            "es-CO"
        );
}


/* =====================================================
   QR
===================================================== */

window.addEventListener(
    "load",
    function(){

        const qr =
            document.getElementById(
                "qrcode"
            );

        if(
            qr &&
            typeof QRCode !== "undefined"
        ){

            qr.innerHTML = "";

            new QRCode(
                qr,
                {
                    text:
                        window.location.href,
                    width:180,
                    height:180,
                    colorDark:"#071a3d",
                    colorLight:"#ffffff",
                    correctLevel:
                        QRCode.CorrectLevel.H
                }
            );

        }

    }
);

