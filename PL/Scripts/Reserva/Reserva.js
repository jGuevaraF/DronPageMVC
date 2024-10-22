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

    obtenerUbicacion();
});


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
        GetCiudadByIdPais(1)

    } else if (
        latitud >= canada.lat.min && latitud <= canada.lat.max &&
        longitud >= canada.lng.min && longitud <= canada.lng.max
    ) {
        console.log("Estás en Canadá.");
        $('#IdPais').val("2");
        GetCiudadByIdPais(2)

    } else if (
        latitud >= mexico.lat.min && latitud <= mexico.lat.max &&
        longitud >= mexico.lng.min && longitud <= mexico.lng.max
    ) {
        console.log("Estás en México.");
        $('#IdPais').val("3");
        GetCiudadByIdPais(3)
    } else {
        console.log("No estás en Canadá, Estados Unidos o México.");
    }
}


function GetCiudadByIdPais(idPais) {
    //let idPais = $('#IdPais').val();
    $('#IdCiudad').empty();

    if (idPais == undefined) {

        idPais = $('#IdPais').val();

        let etiqueta = `
                        <option value=0>Selecciona una ciudad</option>
                    `

        $('#IdCiudad').append(etiqueta);

        $('#IdCiudad').attr('disabled', 'disabled');
    } 

    if (idPais != '0') {
        $.ajax({
            url: '/Reserva/GetCiudadByIdPais',
            type: 'GET',
            dataType: 'JSON',
            data: { IdPais: idPais },
            success: function (result) {

                if (result.Correct) {
                    //let etiqueta = `
                    //        <option value=0>Selecciona una ciudad</option>
                    //    `

                    //$('#IdCiudad').append(etiqueta);

                    $.each(result.Objects, function (index, item) {
                        etiqueta = `
                        <option value= ${item.IdCiudad}> ${item.Nombre} </option>
                    `
                        $('#IdCiudad').append(etiqueta);
                        $('#IdCiudad').removeAttr('disabled');
                    })
                }

            },

            error: function (result) {
                console.log("ERROR en AJAX")
            }
        })
    }

}