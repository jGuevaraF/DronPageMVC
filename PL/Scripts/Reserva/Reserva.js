// Obtener todos los elementos de opción de servicio
const serviceOptions = document.querySelectorAll('.service-option');

var idServicio = 0;
// Agregar evento de click a cada opción
serviceOptions.forEach(option => {
    option.addEventListener('click', function () {
        // Remover la clase 'active' de todas las opciones
        serviceOptions.forEach(opt => opt.classList.remove('active'));

        // Agregar la clase 'active' a la opción seleccionada
        this.classList.add('active');
        idServicio = this.querySelector('#IdServicio').value;
        console.log(idServicio);
    });
});

$(document).ready(function () {
    $('#nextToSection2').click(function () {
        $('#section1').removeClass('visible').addClass('hidden');
        $('#section2').removeClass('hidden').addClass('visible').show();
    });

    $('#backToSection1').click(function () {
        $('#section2').removeClass('visible').addClass('hidden');
        $('#section1').removeClass('hidden').addClass('visible').show();
    });
   
});