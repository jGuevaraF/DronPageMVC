//$('#formReserva').on('submit', function (event) {
function sendEmail() {

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