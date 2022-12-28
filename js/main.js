var userFullName = '';
var userKey = '';

window.addEventListener('load', showWelcome);
function showWelcome(){
  let html = '<h2>Bienvenido ' + userFullName + '</h2>\n';
  html += `
          <p>Esta tienda de venta de repuestos fue creada por alumnos del curso de programacion web 1 de la Universidad Nacional de San Agustin</p>
          <p>El sistema fué desarrollado usando estas tecnologías:</p>
          <ul>
            <li>HTML y CSS</li>
            <li>Perl para el backend</li>
            <li>MariaDB para la base de datos</li>
            <li>Javascript para el frontend</li>
            <li>La comunicación entre el cliente y el servidor se hizo usando XML de manera asíncrona</li>
          </ul>`;
  document.getElementById('main').innerHTML = html;
}

function showMenuUserLogged(){
  let html = "<p onclick='showWelcome()'>Inicio</p>\n"+
    "<p onclick='doList()'>Ver productos</p>\n"+
    "<p onclick='verCarrito()' class='rightAlign'>Ver Carrito</p>\n";
    
  document.getElementById('menu').innerHTML = html;
}
function showMenuAdminLogged(){
  let html = "<p onclick='showWelcome()'>Inicio</p>\n"+
    "<p onclick='doList()'>Ver productos</p>\n"+
    "<p onclick='modInv()' class='rightAlign'>Modificar Inventario</p>\n"+
    "<p onclick='verCarrito()' class='rightAlign'>Ver Carrito</p>\n";
    
  document.getElementById('menu').innerHTML = html;
}


