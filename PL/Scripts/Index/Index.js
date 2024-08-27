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