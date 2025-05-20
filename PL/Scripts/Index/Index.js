function showOptions() {
    var toggleButton = document.getElementById('toggleButton');
    toggleButton.addEventListener('click', function () {
        var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        if (viewportWidth < 576) {
            document.querySelector('#navIndex .navbar-toggler').classList.add('d-lg-none');
            document.querySelector('#navIndex .navbar-collapse').classList.add('collapse');
            document.querySelector('#navIndex .navbar-collapse').classList.toggle('show');
        }
    });
}

const carouselElement = document.querySelector('#inicio');

// Escucha el evento "slid.bs.carousel" que se dispara después de que el carrusel ha cambiado de slide
carouselElement.addEventListener('slid.bs.carousel', () => {
    // Selecciona todos los videos en el carrusel
    const videos = carouselElement.querySelectorAll('video');

    // Reproduce el video que está actualmente visible
    videos.forEach(video => {
        if (video.closest('.carousel-item').classList.contains('active')) {
            video.play();
        } else {
            video.pause();
            video.currentTime = 0; // Opcional: reiniciar el video
        }
    });
});
