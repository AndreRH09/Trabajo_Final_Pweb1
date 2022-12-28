function showLogin(){
  let html = "<center>\n"+
  "<link rel='stylesheet' href='./css/myStyle.css' />\n"+
    "<form>\n"+
    "<label>Usuario: </label><br><input class=field type='text' id='userID'><br><br>\n"+
    "<label>Contraseña: </label><br><input class=field type='password' id='pwd'><br>\n"+
    "<br><input class='bot' type='button' value='Ingresar' onclick='doLogin()'>\n"+
    "</form>\n"+
    "</center>\n";
  document.getElementById('main').innerHTML = html;
}

function doLogin(){
  let user = document.getElementById("userID").value;
  let pwd = document.getElementById("pwd").value;
  let url = "cgi-bin/login.pl?usuario="+user+"&password="+pwd;
  let promise = fetch(url);
  promise.then(response => response.text())
    .then(data =>{
      var xml = (new window.DOMParser()).parseFromString(data, "text/xml");
      loginResponse(xml);

    }).catch(error => {
      console.log("Error: ", error);
    });
}

function loginResponse(xml){
  if(xml.getElementsByTagName("owner")[0] == undefined){
    document.getElementById("userID").value = "";
    document.getElementById("pwd").value = "";
    let textoAux = document.getElementById("main").innerHTML;
    console.log(textoAux);
    document.getElementById("main").innerHTML = textoAux + "<p>Datos del usuario y contraseña no coinciden</p>";
  }
  else if(xml.getElementsByTagName("owner")[0].textContent=='Admin'){
    userKey = 'Admin';
    let firstName = xml.getElementsByTagName("firstName")[0].textContent;
    let lastName = xml.getElementsByTagName("lastName")[0].textContent;
    userFullName = 'Admin';
    showLoggedInAdmin();
  }else{
    userKey = xml.getElementsByTagName("owner")[0].textContent;
    let firstName = xml.getElementsByTagName("firstName")[0].textContent;
    let lastName = xml.getElementsByTagName("lastName")[0].textContent;
    userFullName = firstName;
    showLoggedIn();
  }
}

function registerResponse(xml){
  if(xml.getElementsByTagName("owner")[0] == undefined){
    document.getElementById("userID").value = "";
    document.getElementById("pwd").value = "";
    document.getElementById("firstNameUser").value = "";
    document.getElementById("lastNameUser").value = "";
    document.getElementById("banco").value = "";
    document.getElementById("tarjeta").value = "";
    document.getElementById("direccion").value = "";
    let textoAux = document.getElementById("main").innerHTML;
    console.log(textoAux);
    document.getElementById("main").innerHTML = textoAux + "<p>Datos ya existentes.</p>";
  }else{
    userKey = xml.getElementsByTagName("owner")[0].textContent;
    let firstName = xml.getElementsByTagName("firstName")[0].textContent;
    let lastName = xml.getElementsByTagName("lastName")[0].textContent;
    userFullName = firstName;
    showLoggedIn();
  }
}

function showLoggedInAdmin(){
  document.getElementById("userName").innerHTML = userFullName;
  showWelcome();
  showMenuAdminLogged();
}


function showLoggedIn(){
  document.getElementById("userName").innerHTML = userFullName;
  showWelcome();
  showMenuUserLogged();
}

function showCreateAccount(){
  let html = "<link rel='stylesheet' href='./css/myStyle.css' />\n"+ 
      "<form>\n"+
      "<center>\n"+
      "<label>Usuario: </label><br><input class=field type='text' id='userID'><br>\n"+
      "<br><label>Contraseña: </label><br><input class=field type='password' id='pwd'><br>\n"+
      "<br><label>Nombre: </label><br><input class=field type='text' id='firstNameUser'><br>\n"+
      "<br><label>Apellido: </label><br><input class=field type='text' id='lastNameUser'><br>\n"+
      "<br><label>Banco: </label><br><input class=field type='text' id='banco'><br>\n"+
      "<br><label>Tarjeta: </label><br><input class=field type='number' id='tarjeta'><br>\n"+
      "<br><label>Direccion: </label><br><input class=field type='text' id='direccion'><br>\n"+
      "<br><input class='bot' type='button' value='Registrarse' onclick='doCreateAccount()'>\n"+
      "</form>\n"+
      "</center>\n";
  document.getElementById('main').innerHTML = html;
}

function doCreateAccount(){
  let user = document.getElementById("userID").value;
  let pwd = document.getElementById("pwd").value;
  let fnUser = document.getElementById("firstNameUser").value;
  let lnUser = document.getElementById("lastNameUser").value;
  let banco = document.getElementById("banco").value;
  let tarjeta = document.getElementById("tarjeta").value;
  let direccion = document.getElementById("direccion").value;

  let url = "cgi-bin/register.pl?usuario="+user+"&password="+pwd+"&nombres="+fnUser+"&apellidos="+lnUser+"&banco="+banco+"&tarjeta="+tarjeta+"&direccion="+direccion;
  let promise = fetch(url);
  promise.then(response => response.text())
    .then(data =>{
      var xml = (new window.DOMParser()).parseFromString(data, "text/xml");
      registerResponse(xml);
    }).catch(error => {
      console.log("Error: ", error);
    });
}

var auxiliar;
function doList(){
  let url = "cgi-bin/list.pl";
  let promise = fetch(url);
  promise.then(response => response.text())
    .then(data =>{
      var xml = (new window.DOMParser()).parseFromString(data, "text/xml");
      showList(xml);
    }).catch(error => {
      console.log("Error: ", error);
    });
}

function showList(xml){
  let html = "";
  if(xml.getElementsByTagName("nombre")[0] == undefined){
    html = "No hay productos.";
  }
  else{
    let nombre = xml.getElementsByTagName("nombre");
    let modelo = xml.getElementsByTagName("modelo");
    let marca = xml.getElementsByTagName("marca");
    let precio = xml.getElementsByTagName("precio");
    let nombreProducto;
    let modeloProducto;
    let marcaProducto;
    let precioProducto;
    for(var i = 0; i<nombre.length; i++){
      nombreProducto = nombre[i].textContent;
      nombreProducto = nombreProducto.toString();
      marcaProducto = marca[i].textContent;
      marcaProducto = marcaProducto.toString();
      precioProducto = precio[i].textContent;
      precioProducto = precioProducto.toString();
      let user = userKey.toString();
      html += "<link rel='stylesheet' href='./css/myStyle.css' />\n"+
              "<div class='productos' id='productos'> \n"+
              "<h2 onclick=\"doView(\'"+nombreProducto+"\',\'"+marcaProducto+"\')\">"+nombreProducto+"</h2>"+
              "<h3>Marca: "+marcaProducto+"</h3>"+
              "<h3>S/"+precioProducto+"</h3>"+
              "<input class='bot' type='button' onclick=\"agregarCarrito(\'"+nombreProducto+"\',\'"+marcaProducto+"\')\" value='Agregar al carrito'>"+
              "</div>\n";
    }
  }
  document.getElementById('main').innerHTML = html;
}

function doList2(){
  let url = "cgi-bin/list.pl";
  let promise = fetch(url);
  promise.then(response => response.text())
    .then(data =>{
      var xml = (new window.DOMParser()).parseFromString(data, "text/xml");
      showList2(xml);
    }).catch(error => {
      console.log("Error: ", error);
    });
}

function showList2(xml){
  let html = "";
  if(xml.getElementsByTagName("nombre")[0] == undefined){
    html = "No hay productos.";
  }
  else{
    let nombre = xml.getElementsByTagName("nombre");
    let modelo = xml.getElementsByTagName("modelo");
    let marca = xml.getElementsByTagName("marca");
    let precio = xml.getElementsByTagName("precio");
    let nombreProducto;
    let modeloProducto;
    let marcaProducto;
    let precioProducto;
    html+= "<br><input class='bot' type='button' onclick=\"nuevoProd()\" value='Nuevo producto'><br><br>\n";
    for(var i = 0; i<nombre.length; i++){
      nombreProducto = nombre[i].textContent;
      nombreProducto = nombreProducto.toString();
      marcaProducto = marca[i].textContent;
      marcaProducto = marcaProducto.toString();
      precioProducto = precio[i].textContent;
      precioProducto = precioProducto.toString();
      let user = userKey.toString();
      html += "<link rel='stylesheet' href='./css/myStyle.css' />\n"+
              "<div class='productos' id='productos'> \n"+
              "<h2 onclick=\"doView(\'"+nombreProducto+"\',\'"+marcaProducto+"\')\">"+nombreProducto+"</h2>"+
              "<h3>Marca: "+marcaProducto+"</h3>"+
              "<h3>S/"+precioProducto+"</h3>"+
              "<input class='bot' type='button' onclick=\"modStock(\'"+nombreProducto+"\',\'"+marcaProducto+"\')\" value='Cambiar stock'>"+
              "<input class='bot' type='button' onclick=\"elimProd(\'"+nombreProducto+"\',\'"+marcaProducto+"\')\" value='Eliminar'>"+
              "<input class='bot' type='button' onclick=\"modPrecio(\'"+nombreProducto+"\',\'"+marcaProducto+"\')\" value='Cambiar precio'>\n"+
              "</div>\n";
    }
  }
  document.getElementById('main').innerHTML = html;
}

function modStock(nombre,marca){ 
  let html="<form>\n"+
            "<center>\n"+
            "<label>Nuevo stock: </label><br><input type='number' id='stock'><br>\n"+
                "<input class='bot' type='button' onclick=\"modStock2(\'"+nombre+"\',\'"+marca+"\')\" value='Modificar stock'>\n";
                "</center>\n"+
             "</form>\n";
  document.getElementById('main').innerHTML = html;
}

function modStock2(nombre,marca){
  let stock=document.getElementById('stock').value;
  let pl="cgi-bin/stock.pl?nombre="+nombre+"&marca="+marca+"&stock="+stock;
  let invoque=fetch(pl);
  invoque.then(response=>response.text())
    .then(data =>{
      var xml=(new window.DOMParser()).parseFromString(data, "text/xml");
      modStock3(xml);
    }).catch(error =>{
      console.log("Error: ", error);
    });
}

function modStock3(xml){
  console.log(xml);
  let html="";
  if(xml.getElementsByTagName('nombre')[0]==undefined){
    html="No se modifico ningun producto.";
  }
  else{
    let nombre=xml.getElementsByTagName("nombre")[0].textContent;
    let stock=xml.getElementsByTagName("stock")[0].textContent;
    let modelo=xml.getElementsByTagName("modelo")[0].textContent;
    let precio=xml.getElementsByTagName("precio")[0].textContent;
    let marca=xml.getElementsByTagName("marca")[0].textContent;
    let codigo=xml.getElementsByTagName("codigo")[0].textContent;
    html="<div class='vista'>"+
      "<h2>"+nombre+"</h2>\n"+
      "<h3>Stock: "+stock+"</h3>\n"+
      "<h3>Modelo: "+modelo+"</h3>\n"+
      "<h3>Precio: S/"+precio+"</h3>\n"+
      "<h3>Marca: "+marca+"</h3>\n"+
      "<h3>Codigo: "+codigo+"</h3>\n"+
      "</div>";
  }
  document.getElementById('main').innerHTML=html;
}

function elimProd(nombre,marca){
  let pl="cgi-bin/delete.pl?nombre="+nombre+"&marca="+marca;
  let invoque=fetch(pl);
  invoque.then(response=>response.text())
    .then(data =>{
      var xml=(new window.DOMParser()).parseFromString(data, "text/xml");
      doList2();
    }).catch(error =>{
      console.log("Error: ", error);
    });
}

function modPrecio(nombre,marca){
  let html= "<form>\n"+
            "<center>\n"+
            "<label>Nuevo precio: </label><br><input class=field type='number' id='precio'><br>\n"+
            "<input class='bot' type='button' onclick=\"modPrecio2(\'"+nombre+"\',\'"+marca+"\')\" value='Modificar precio'>\n";
            "</center>\n"+
            "</form>\n";
            
  document.getElementById('main').innerHTML = html;
}

function modPrecio2(nombre,marca){
  let precio=document.getElementById('precio').value;
  let pl="cgi-bin/precio.pl?nombre="+nombre+"&marca="+marca+"&precio="+precio;
  let invoque=fetch(pl);
  invoque.then(response=>response.text())
    .then(data =>{
      var xml=(new window.DOMParser()).parseFromString(data, "text/xml");
      modPrecio3(xml);
    }).catch(error =>{
      console.log("Error: ", error);
    });
}

function modPrecio3(xml){
  console.log(xml) 
  let html="";
  if(xml.getElementsByTagName('nombre')[0]==undefined){
    html="No se modifico ningun producto.";
  }
  else{
    let nombre=xml.getElementsByTagName("nombre")[0].textContent;
    let stock=xml.getElementsByTagName("stock")[0].textContent;
    let modelo=xml.getElementsByTagName("modelo")[0].textContent;
    let precio=xml.getElementsByTagName("precio")[0].textContent;
    let marca=xml.getElementsByTagName("marca")[0].textContent;
    let codigo=xml.getElementsByTagName("codigo")[0].textContent;
    html="<div class='vista'>"+
      "<h2>"+nombre+"</h2>\n"+
      "<h3>Stock: "+stock+"</h3>\n"+
      "<h3>Modelo: "+modelo+"</h3>\n"+
      "<h3>Precio: S/"+precio+"</h3>\n"+
      "<h3>Marca: "+marca+"</h3>\n"+
      "<h3>Codigo: "+codigo+"</h3>\n"+
      "</div>";
  }
  document.getElementById('main').innerHTML=html;
}

function modInv(){
  doList2();
}

function nuevoProd(){
  let html = "<link rel='stylesheet' href='./css/myStyle.css' />\n"+ 
      "<form>\n"+
      "<center>\n"+
      "<label>Nombre del producto: </label><br><input class=field type='text' id='nombre'><br>\n"+
      "<br><label>Stock: </label><br><input class=field type='number' id='stock'><br>\n"+
      "<br><label>Modelo: </label><br><input class=field type='text' id='modelo'><br>\n"+
      "<br><label>Precio: </label><br><input class=field type='number' id='precio'><br>\n"+
      "<br><label>Marca: </label><br><input class=field type='text' id='marca'><br>\n"+
      "<br><label>Codigo: </label><br><input class=field type='texto' id='codigo'><br>\n"+
      "<br><input class='bot' type='button' value='Registrar producto' onclick='nuevoProd2()'>\n"
      "</center>"+
      "</form>";
  document.getElementById('main').innerHTML = html;
}

function nuevoProd2(){
  let nombre=document.getElementById('nombre').value;
  let stock=document.getElementById('stock').value;
  let modelo=document.getElementById('modelo').value;
  let precio=document.getElementById('precio').value;
  let marca=document.getElementById('marca').value;
  let codigo=document.getElementById('codigo').value;
  let pl="cgi-bin/new.pl?nombre="+nombre+"&stock="+stock+"&modelo="+modelo+"&precio="+precio+"&marca="+marca+"&codigo="+codigo;
  let invoque=fetch(pl);
  invoque.then(response=>response.text())
    .then(data =>{
      var xml=(new window.DOMParser()).parseFromString(data, "text/xml");
      nuevoProd3(xml);
    }).catch(error =>{
      console.log("Error: ", error);
    });
}

function nuevoProd3(xml){
  console.log(xml) 
  let html="";
  if(xml.getElementsByTagName('nombre')[0]==undefined){
    html="No se pudo ingresar el producto.";
  }
  else{
    let nombre=xml.getElementsByTagName("nombre")[0].textContent;
    let stock=xml.getElementsByTagName("stock")[0].textContent;
    let modelo=xml.getElementsByTagName("modelo")[0].textContent;
    let precio=xml.getElementsByTagName("precio")[0].textContent;
    let marca=xml.getElementsByTagName("marca")[0].textContent;
    let codigo=xml.getElementsByTagName("codigo")[0].textContent;
    html="<div class='vista'>"+
      "<h2>"+nombre+"</h2>\n"+
      "<h3>Stock: "+stock+"</h3>\n"+
      "<h3>Modelo: "+modelo+"</h3>\n"+
      "<h3>Precio: S/"+precio+"</h3>\n"+
      "<h3>Marca: "+marca+"</h3>\n"+
      "<h3>Codigo: "+codigo+"</h3>\n"+
      "</div>";
  }
  document.getElementById('main').innerHTML=html;

}

function doView(nombre,marca){
  let pl="cgi-bin/producto.pl?nombre="+nombre+"&marca="+marca;
  let invoque=fetch(pl);
  invoque.then(response=>response.text())
    .then(data =>{
      var xml=(new window.DOMParser()).parseFromString(data, "text/xml");
      doView2(xml);
    }).catch(error =>{
      console.log("Error: ", error);
    });
}

function doView2(xml){
  console.log(xml) 
  let html="";
  if(xml.getElementsByTagName('nombre')[0]==undefined){
    html="No se encontro el producto.";
  }
  else{
    let nombre=xml.getElementsByTagName("nombre")[0].textContent;
    let stock=xml.getElementsByTagName("stock")[0].textContent;
    let modelo=xml.getElementsByTagName("modelo")[0].textContent;
    let precio=xml.getElementsByTagName("precio")[0].textContent;
    let marca=xml.getElementsByTagName("marca")[0].textContent;
    let codigo=xml.getElementsByTagName("codigo")[0].textContent;
    html="<div class='vista'>"+
      "<h2>"+nombre+"</h2>\n"+
      "<h3>Stock: "+stock+"</h3>\n"+
      "<h3>Modelo: "+modelo+"</h3>\n"+
      "<h3>Precio: S/"+precio+"</h3>\n"+
      "<h3>Marca: "+marca+"</h3>\n"+
      "<h3>Codigo: "+codigo+"</h3>\n"+
      "</div>";
  }
  document.getElementById('main').innerHTML=html;
  
}
function agregarCarrito(nombre,marca){
  let pl="cgi-bin/carrito.pl?nombre="+nombre+"&marca="+marca+"&usuario="+userKey;
  let invoque=fetch(pl);
  invoque.then(response=>response.text())
    .then(data =>{
      var xml=(new window.DOMParser()).parseFromString(data, "text/xml");
      agregarCarrito2(xml);
    }).catch(error =>{
      console.log("Error: ", error);
    });

}
function agregarCarrito2(xml){
  console.log(xml) 
  let html="";
  if(xml.getElementsByTagName('nombre')[0]==undefined){
    html="No se encontro el producto.";
  }
  else{
    showList();
  }
  document.getElementById('main').innerHTML=html;
  
}

function verCarrito(){
  let pl="cgi-bin/carrito2.pl";
  let invoque=fetch(pl);
  invoque.then(response=>response.text())
    .then(data =>{
      var xml=(new window.DOMParser()).parseFromString(data, "text/xml");
      verCarrito2(xml);
    }).catch(error =>{
      console.log("Error: ", error);
    });
  
}
function verCarrito2(xml){
  let html = "";
  if(xml.getElementsByTagName("nombre")[0] == undefined){
    html = "No hay productos.";
  }
  else{
    let nombre = xml.getElementsByTagName("nombre");
    let modelo = xml.getElementsByTagName("modelo");
    let marca = xml.getElementsByTagName("marca");
    let precio = xml.getElementsByTagName("precio");
    let nombreProducto;
    let modeloProducto;
    let marcaProducto;
    let precioProducto;
    var precioTotal=0;
    for(var i = 0; i<nombre.length; i++){
      precioTotal+=parseInt(precio[i].textContent);
      nombreProducto = nombre[i].textContent;
      nombreProducto = nombreProducto.toString();
      marcaProducto = marca[i].textContent;
      marcaProducto = marcaProducto.toString();
      precioProducto = precio[i].textContent;
      precioProducto = precioProducto.toString();
      let user = userKey.toString();
      html += "<link rel='stylesheet' href='./css/myStyle.css' />\n"+
              "<div class='productos' id='productos'> \n"+
              "<h2 onclick=\"doView(\'"+nombreProducto+"\',\'"+marcaProducto+"\')\">"+nombreProducto+"</h2>"+
              "<h3>Marca: "+marcaProducto+"</h3>"+
              "<h3>S/"+precioProducto+"</h3>"+
              "<input class='bot' type='button' onclick=\"quitarCarrito(\'"+nombreProducto+"\',\'"+marcaProducto+"\')\" value='Quitar'>"+
              "</div>\n";
    }
    html+="<h3>PRECIO TOTAL: S/"+precioTotal+"</h3>"+
              "<input class='bot' type='button' onclick=\"vaciarCarrito()\" value='Vaciar carrito'>";
  }
  document.getElementById('main').innerHTML = html;
  
}
function vaciarCarrito(){
  let pl="cgi-bin/carrito4.pl";
  let invoque=fetch(pl);
  invoque.then(response=>response.text())
    .then(data =>{
      var xml=(new window.DOMParser()).parseFromString(data, "text/xml");
      verCarrito2(xml);
    }).catch(error =>{
      console.log("Error: ", error);
    });
}

function quitarCarrito(nombre,marca){
  let pl="cgi-bin/carrito3.pl?nombre="+nombre+"&marca="+marca;
  let invoque=fetch(pl);
  invoque.then(response=>response.text())
    .then(data =>{
      var xml=(new window.DOMParser()).parseFromString(data, "text/xml");
      verCarrito2(xml);
    }).catch(error =>{
      console.log("Error: ", error);
    });

}
  

