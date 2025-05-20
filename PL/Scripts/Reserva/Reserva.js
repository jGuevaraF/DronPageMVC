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
    //$('#nextToSection2').click(function () {
    //    // Variable para rastrear si el formulario es válido
    //    let formIsValid = true;

    //    // Selecciona todos los inputs requeridos en section1 y verifica su validez
    //    $('#section1 input[required]').each(function () {
    //        if (!this.checkValidity()) {
    //            this.reportValidity(); // Muestra el mensaje nativo de requerido en el campo
    //            formIsValid = false;
    //            return false; // Detiene la iteración si encuentra un campo inválido
    //        }
    //    });

    //    // Validación del select de ciudad (campo requerido y valor distinto de '0')
    //    let ciudadSelect = $('#IdCiudad')[0]; // Accedemos al elemento del select
    //    let IdCiudad = $('#IdCiudad').val();

    //    console.log(IdCiudad)
    //    //if ($('#IdCiudad').val() === '0' || !ciudadSelect.checkValidity()) {
    //    if ($('#IdCiudad').val() === '0') {
    //        // Si el valor es '0' o no pasa la validación
    //        ciudadSelect.setCustomValidity('Por favor, selecciona una ciudad.');
    //        ciudadSelect.reportValidity(); // Mostrar el mensaje de error
    //        formIsValid = false;
    //    } else {
    //        ciudadSelect.setCustomValidity(''); // Limpiar el mensaje de error si es válido
    //    }

    //    // Si todos los campos son válidos, procede a mostrar section2
    //    if (formIsValid) {
    //        $('#section1').removeClass('visible').addClass('hidden');
    //        $('#section2').removeClass('hidden').addClass('visible').show();
    //    }
    //});

    //$('#backToSection1').click(function () {
    //    // Muestra section1 nuevamente y oculta section2
    //    $('#section2').removeClass('visible').addClass('hidden');
    //    $('#section1').removeClass('hidden').addClass('visible').show();
    //});


    obtenerUbicacion();
});


function validarFormulario() {
    let formIsValid = true;

    $('#section1 input[required]').each(function () {
        if (!this.checkValidity()) {
            this.reportValidity();
            formIsValid = false;
            return false;
        }
    });

    let ciudadSelect = $('#IdCiudad')[0];
    let IdCiudad = $('#IdCiudad').val();


    if (IdCiudad === '0') {
        ciudadSelect.setCustomValidity('Por favor, selecciona una ciudad.');
        ciudadSelect.reportValidity();
        formIsValid = false;
    } else {
        ciudadSelect.setCustomValidity('');
    }

    // Validar que al menos una opción tenga la clase 'active'
    //if ($('.service-option.active').length === 0) {
    //    alert('Debes seleccionar al menos una opción antes de continuar.');
    //    formIsValid = false;
    //}

    // Validar que al menos una opción tenga la clase 'active'
    if ($('.service-option.active').length === 0) {
        $('#mensajeValidacion').text('Debes seleccionar al menos una opción.').show();
        formIsValid = false;
    } else {
        $('#mensajeValidacion').text('').hide();
    }

    if (formIsValid) {
        $('#section1').removeClass('visible').addClass('hidden');
        $('#section2').removeClass('hidden').addClass('visible').show();
    }

    $('#backToSection1').click(function () {
        $('#section2').removeClass('visible').addClass('hidden');
        $('#section1').removeClass('hidden').addClass('visible').show();
    });
}
function obtenerUbicacion() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitud = position.coords.latitude;
                const longitud = position.coords.longitude;

                verificarPais(latitud, longitud);
            },
            function (error) {
                $('#IdPais').removeAttr('disabled');

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        console.error("El usuario ha denegado el permiso para acceder a la ubicación.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.error("La información de ubicación no está disponible.");
                        break;
                    case error.TIMEOUT:
                        console.error("La solicitud para obtener la ubicación ha caducado.");
                        break;
                    case error.UNKNOWN_ERROR:
                    default:
                        console.error("Se produjo un error desconocido al intentar obtener la ubicación.");
                        break;
                }
            }

        );


    } else {
        console.error("La geolocalización no está soportada en este navegador.");
    }
}


function verificarPais(latitud, longitud) {
    // Rango aproximado de coordenadas para Canadá, EE.UU. y México
    const estadosUnidos = { lat: { min: 24.396308, max: 49.384358 }, lng: { min: -125.0, max: -66.93457 } };
    const canada = { lat: { min: 41.676555, max: 83.23324 }, lng: { min: -141.0, max: -52.648098 } };
    const mexico = { lat: { min: 14.538433, max: 32.718716 }, lng: { min: -118.404354, max: -86.691128 } };

    if (
        latitud >= estadosUnidos.lat.min && latitud <= estadosUnidos.lat.max &&
        longitud >= estadosUnidos.lng.min && longitud <= estadosUnidos.lng.max
    ) {
        console.log("Estás en Estados Unidos.");
        $('#IdPais').val("1");
        $('#IdPais').find('option').not('[value="1"]').remove();

        GetCiudadByIdPais(1)

    } else if (
        latitud >= canada.lat.min && latitud <= canada.lat.max &&
        longitud >= canada.lng.min && longitud <= canada.lng.max
    ) {
        console.log("Estás en Canadá.");
        $('#IdPais').val("2");
        $('#IdPais').find('option').not('[value="2"]').remove();

        GetCiudadByIdPais(2)

    } else if (
        latitud >= mexico.lat.min && latitud <= mexico.lat.max &&
        longitud >= mexico.lng.min && longitud <= mexico.lng.max
    ) {
        console.log("Estás en México.");
        $('#IdPais').val("3");
        $('#IdPais').find('option').not('[value="3"]').remove();

        GetCiudadByIdPais(3)
    } else {
        console.log("No estás en Canadá, Estados Unidos o México.");
    }
}


function GetCiudadByIdPais(idPais) {
    //let idPais = $('#IdPais').val();
    $('#IdCiudad').empty();

    let etiqueta = `
                        <option value=0>Selecciona una ciudad</option>
                    `

    $('#IdCiudad').append(etiqueta);

    //$('#IdCiudad').attr('disabled', 'disabled');

    if (idPais == undefined) {

        idPais = $('#IdPais').val();
    }

    if (idPais != '0') {
        $.ajax({
            url: urlGetCiudadByIdPais,
            type: 'GET',
            dataType: 'JSON',
            data: { IdPais: idPais },
            success: function (result) {

                if (result.Correct) {

                    $.each(result.Objects, function (index, item) {
                        etiqueta = `
                        <option value= ${item.IdCiudad}> ${item.Nombre} </option>
                    `
                        $('#IdCiudad').append(etiqueta);
                        //$('#IdCiudad').removeAttr('disabled');
                    })
                }

            },

            error: function (result) {
                console.log("ERROR en AJAX")
            }
        })
    }

}


function soloLetras(event) {
    var input = event.target;
    var char = String.fromCharCode(event.keyCode || event.which);
    var nuevaCadena = input.value + char; // Texto después de la pulsación

    // Contamos los espacios en la cadena
    var cantidadEspacios = (nuevaCadena.match(/ /g) || []).length;

    // Expresión regular que no permite más de un espacio seguido
    var regex = /^[a-zA-Z ]*$/; // Solo permite letras y espacios
    var noDosEspaciosSeguidos = !/\s{2,}/.test(nuevaCadena); // No permite dos espacios seguidos

    // Verificamos que no haya más de 2 espacios, que no haya dos espacios seguidos y que la cadena sea válida
    if (cantidadEspacios > 2 || !regex.test(nuevaCadena) || !noDosEspaciosSeguidos) {
        event.preventDefault();
        document.getElementById('mensajeError').style.display = 'inline'; // Mostrar mensaje
    } else {
        document.getElementById('mensajeError').style.display = 'none'; // Ocultar mensaje si es válido
    }
}

//function soloLetras(event) {
//    var input = event.target;
//    var char = String.fromCharCode(event.keyCode || event.which);
//    var nuevaCadena = input.value + char; // Texto después de la pulsación

//    // Contamos los espacios en la cadena
//    var cantidadEspacios = (nuevaCadena.match(/ /g) || []).length;

//    // Verificamos que no haya más de 2 espacios y que solo haya letras y espacios
//    var regex = /^[a-zA-Z ]*$/;  // Solo permite letras y espacios

//    // Si la cadena tiene más de 2 espacios o no cumple con la regex, prevenir la acción
//    if (cantidadEspacios > 2 || !regex.test(nuevaCadena)) {
//        event.preventDefault();
//        document.getElementById('mensajeError').style.display = 'inline'; // Mostrar mensaje
//    } else {
//        document.getElementById('mensajeError').style.display = 'none'; // Ocultar mensaje si es válido
//    }
//}