$('#formReserva').on('submit', function (event) {

    var mensaje = {
        Nombre: $('#nombre').val(),
        EmailUsuario: $('#email').val(),
        Asunto: $('#asunto').val(),
        Mensaje: $('#mensaje').val()
    }
    event.preventDefault();
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

        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#modalMessage').text('ERROR, mira la consola para más detalles.');
            console.log(jqXHR);
            var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
            myModal.show();
        }
    });
});