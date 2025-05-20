//$('#formReserva').on('submit', function (event) {
function sendEmail2() {

    let idServicioEmal = idServicio;

    let fecha = clickedDate;
    //Cantidad drones
    let cantidadDrones;
    const activeItem = document.querySelector('#dronesCarousel .carousel-item.active');

    if (activeItem) {
        // Obtener el texto del elemento h3 que contiene la cantidad de drones
        const droneCountText = activeItem.querySelector('.subtitulo2').innerText;

        // Extraer la cantidad de drones del texto
        const droneCount = droneCountText.split(' ')[0]; // Asumiendo que el texto es algo como "100 drones"

        // Guardar la cantidad en una variable
        cantidadDrones = parseInt(droneCount, 10); // Convertir a número entero
    }

    //objeto JSON
    var mensaje = {
        NombreUsuario: $('#nombre').val(),
        EmailUsuario: $('#email').val(),
        //Ciudad: $('#ciudad').val(),
        Telefono: $('#telefono').val(),
        CantidadDrones: cantidadDrones,
        Fecha: fecha,
        CatServicio: {
            IdCatServicio: idServicioEmal,
            Ciudad: {
                IdCiudad: $('#IdCiudad').val()
            }
        }
    }
    //event.preventDefault();
    $.ajax({
        url: '../Reserva/SendEmail',
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(mensaje),
        success: function (result) {
            if (result.success) {
                $('#modalMessage').text('Tu mensaje ha sido enviado con éxito.');
            } else {
                $('#modalMessage').text('Hubo un problema al enviar tu mensaje. Inténtalo de nuevo.');
            }
            var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
            myModal.show();
            $('#formReserva').trigger('reset');

            $('#exampleModal').on('hidden.bs.modal', function () {
                location.reload();
            });

            document.getElementById('formContacto').reset();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#modalMessage').text('ERROR, mira la consola para más detalles.');
            console.log(jqXHR);
            var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
            myModal.show();
        }
    });
};

function sendEmail() {
    // Obtener los valores de los campos y sus elementos DOM
    //let nombreUsuario = $('#nombre').val() + $('#ApellidoPaterno').val() + $('#ApellidoMaterno').val(); 
    let nombreUsuario = `${$('#nombre').val()} ${$('#ApellidoPaterno').val()} ${$('#ApellidoMaterno').val()}`;
    let emailUsuario = $('#email')[0];
    let telefonoUsuario = $('#telefono')[0];
    let idCiudad = $('#IdCiudad')[0];
    let fecha = clickedDate;
    let idServicioEmal = idServicio;

    // Obtener la cantidad de drones
    let cantidadDrones;
    const activeItem = document.querySelector('#dronesCarousel .carousel-item.active');
    if (activeItem) {
        const droneCountText = activeItem.querySelector('.subtitulo2').innerText;
        cantidadDrones = parseInt(droneCountText.split(' ')[0], 10);
    }

    // Validar los campos con el método `reportValidity()` y alertas personalizadas
    //if (!nombreUsuario.checkValidity()) {
    //    nombreUsuario.reportValidity();
    //    return;
    //}
    if (!emailUsuario.checkValidity()) {
        emailUsuario.reportValidity();
        return;
    }
    if (!telefonoUsuario.checkValidity()) {
        telefonoUsuario.reportValidity();
        return;
    }
    if (!idCiudad.checkValidity()) {
        idCiudad.reportValidity();
        return;
    }
    if (!fecha) {
        alert("La fecha es requerida.");
        return;
    }
    if (!cantidadDrones) {
        alert("La cantidad de drones es requerida.");
        return;
    }
    if (!idServicioEmal) {
        alert("El servicio es requerido.");
        return;
    }

    // Crear el objeto JSON si todos los campos son válidos
    var mensaje = {
        NombreUsuario: nombreUsuario,
        EmailUsuario: emailUsuario.value,
        Telefono: telefonoUsuario.value,
        CantidadDrones: cantidadDrones,
        Fecha: fecha,
        CatServicio: {
            IdCatServicio: idServicioEmal,
            Ciudad: {
                IdCiudad: idCiudad.value
            }
        }
    };

    // Enviar el correo mediante AJAX
    $.ajax({
        url: '../Reserva/SendEmail',
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(mensaje),
        beforeSend: function () {
            // Muestra el overlay con el spinner
            $('#loadingOverlay').removeClass('d-none');
        },
        success: function (result) {
            if (result.success) {
                $('#section1, #section2').hide();
                $('#section3').removeClass('d-none');
            } else {
                $('#modalMessage').text('Hubo un problema al enviar tu mensaje. Inténtalo de nuevo.');
                var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
                myModal.show();
                $('#exampleModal').on('hidden.bs.modal', function () {
                    location.reload();
                });
            }

            $('#formReserva').trigger('reset');
            document.getElementById('formContacto').reset();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#modalMessage').text('ERROR, mira la consola para más detalles.');
            console.log(jqXHR);
            var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
            myModal.show();
        },
        complete: function () {
            // Oculta el overlay con el spinner
            $('#loadingOverlay').addClass('d-none');
        }
    });


};

