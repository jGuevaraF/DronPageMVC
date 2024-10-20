var clickedDate;
var today = moment();

!function () {

    moment.locale('es');

    //moment().locale('es');
    var drawDayGlobal = true;


    function Calendar(selector, events) {
        this.el = document.querySelector(selector);
        this.events = events;
        this.current = moment().date(1);
        this.selectedDate = null; // Variable para guardar la fecha seleccionada
        this.draw();
        var current = document.querySelector('.today');
        //if(current) {
        //  var self = this;
        //  window.setTimeout(function() {
        //    self.openDay(current);
        //  }, 500);
        //}

    }

    Calendar.prototype.draw = function () {
        //Create Header
        this.drawHeader();

        //Draw Month
        this.drawMonth();

        //this.drawLegend();
    }

    Calendar.prototype.drawHeader = function () {
        var self = this;
        if (!this.header) {
            //Create the header elements
            this.header = createElement('div', 'header');
            this.header.className = 'header';
            //this.header.className = 'subtitulo2';
            //this.header.style.fontsize = "10px";

            this.title = createElement('h5');
            this.title.className = 'subtitulo2';

            //var right = createElement('div', 'right');
            var right = createElement('div', 'right');

            var icon = document.createElement('i');
            //icon.classList.add('bi', 'bi-chevron-right', 'fs-1', 'text-primary');
            icon.classList.add('bi', 'bi-caret-right', 'text-white');
            right.addEventListener('click', function () { self.nextMonth(); });

            right.appendChild(icon);

            var left = createElement('div', 'left');
            icon = document.createElement('i');
            //icon.classList.add('bi', 'bi-chevron-left', 'fs-1', 'text-primary');
            icon.classList.add('bi', 'bi-caret-left', 'text-white');
            left.addEventListener('click', function () { self.prevMonth(); });
            left.appendChild(icon);

            //Append the Elements
            this.header.appendChild(this.title);
            this.header.appendChild(right);
            this.header.appendChild(left);
            this.el.appendChild(this.header);
        }

        //this.title.innerHTML = 'Fecha Aproximada <br>'+this.current.format('MMMM YYYY');
        this.title.innerHTML = /*'Fecha aproximada<br>' + */this.current.format('MMMM').toUpperCase() + ' ' + this.current.format('YYYY');

    }

    Calendar.prototype.drawMonth = function () {
        var self = this;

        // Dibuja los nombres de los días de la semana
        if (drawDayGlobal) {
            this.drawHeaderDays();
            drawDayGlobal = false;
        }

        this.events.forEach(function (ev) {
            ev.date = self.current.clone().date(Math.random() * (29 - 1) + 1);
        });


        if (this.month) {
            this.oldMonth = this.month;
            this.oldMonth.className = 'month out ' + (self.next ? 'next subtitulo2' : 'prev subtitulo2');
            this.oldMonth.addEventListener('webkitAnimationEnd', function () {
                self.oldMonth.parentNode.removeChild(self.oldMonth);
                self.month = createElement('div', 'month');
                self.backFill();
                self.currentMonth();
                self.fowardFill();
                self.el.appendChild(self.month);
                window.setTimeout(function () {
                    self.month.className = 'month in ' + (self.next ? 'next subtitulo2' : 'prev subtitulo2');
                }, 16);
            });
        } else {
            this.month = createElement('div', 'month');
            this.el.appendChild(this.month);
            this.backFill();
            this.currentMonth();
            this.fowardFill();
            this.month.className = 'month new subtitulo2';
        }
    }

    // Nueva función para dibujar la cabecera con los nombres de los días
    Calendar.prototype.drawHeaderDays = function () {
        var daysHeader = createElement('div', 'days-header');
        daysHeader.style.display = 'flex'; // Asegúrate de que los días se muestren en fila
        daysHeader.style.justifyContent = 'space-between'; // Espacio entre los días

        var dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

        dayNames.forEach(function (day) {
            var dayElement = createElement('div', 'day-name-header', day);
            //dayElement.style.flex = '1'; // Cada día ocupa el mismo espacio
            //dayElement.style.textAlign = 'center'; // Centrar el texto
            daysHeader.appendChild(dayElement);
        });

        this.el.appendChild(daysHeader);
    };

    Calendar.prototype.backFill = function () {
        var clone = this.current.clone();
        var dayOfWeek = clone.day();

        if (!dayOfWeek) { return; }

        clone.subtract('days', dayOfWeek + 1);

        for (var i = dayOfWeek; i > 0; i--) {
            this.drawDay(clone.add('days', 1));
        }
    }

    Calendar.prototype.fowardFill = function () {
        var clone = this.current.clone().add('months', 1).subtract('days', 1);
        var dayOfWeek = clone.day();

        if (dayOfWeek === 6) { return; }

        for (var i = dayOfWeek; i < 6; i++) {
            this.drawDay(clone.add('days', 1));
        }
    }

    Calendar.prototype.currentMonth = function () {
        var clone = this.current.clone();

        while (clone.month() === this.current.month()) {
            this.drawDay(clone);
            clone.add('days', 1);
        }
    }

    Calendar.prototype.getWeek = function (day) {
        if (!this.week || day.day() === 0) {
            this.week = createElement('div', 'week');
            this.month.appendChild(this.week);
        }
    }


    // Modifica la función drawDay para no incluir el nombre del día
    Calendar.prototype.drawDay = function (day) {
        var self = this;
        this.getWeek(day);

        // Outer Day
        var outer = createElement('div', this.getDayClass(day));
        outer.dataset.date = day.format('YYYY-MM-DD');
        outer.addEventListener('click', function () {
            self.openDay(this, day);
        });

        // Day Number
        var number = createElement('div', 'day-number', day.format('DD'));

        // Create a container for the icon
        var iconContainer = createElement('div', 'day-icon-container');
        //iconContainer.style.display = "block";
        //iconContainer.style.marginTop = "20px";

        var fechasReservadas = fechasReservadasData.map(function (item) {
            return item.Fecha;
        });

        // Check if the day is in fechasReservadas
        if (fechasReservadas.includes(day.format('YYYY-MM-DD'))) {
            number.style.display = 'none';
            var reservedIcon = createElement('i', 'bi bi-calendar-x-fill'); // Clase de ícono para fechas reservadas
            reservedIcon.style.fontSize = '20px'; // Ajusta el tamaño del ícono
            iconContainer.appendChild(reservedIcon);
        }

        // Append the number and icon container
        outer.appendChild(number);
        outer.appendChild(iconContainer);

        this.week.appendChild(outer);
    };


    Calendar.prototype.drawEvents = function (day, element) {
        if (day.month() === this.current.month()) {
            var todaysEvents = this.events.reduce(function (memo, ev) {
                if (ev.date.isSame(day, 'day')) {
                    memo.push(ev);
                }
                return memo;
            }, []);

            todaysEvents.forEach(function (ev) {
                var evSpan = createElement('span', ev.color);
                element.appendChild(evSpan);
            });
        }
    }

    Calendar.prototype.getDayClass = function (day) {
        classes = ['day'];
        if (day.month() !== this.current.month()) {
            classes.push('other');
        } else if (today.isSame(day, 'day')) {
            classes.push('today');
        }
        return classes.join(' ');
    }

    
    Calendar.prototype.openDay = function (el, day) {

        clickedDate = el.dataset.date;
        console.log(clickedDate);
        var dayNumberElement = el.querySelector('.day-number');
        var iconContainer = el.querySelector('.day-icon-container');

        // Alternar entre mostrar y ocultar el ícono
        if (iconContainer.style.display === 'none' || iconContainer.style.display === '') {
            // Mostrar el ícono y ocultar visualmente el número del día
            iconContainer.style.display = 'block';
            iconContainer.style.marginTop = '10px';
            dayNumberElement.style.visibility = 'hidden'; // Ocultar el número del día visualmente, pero no ocupar el espacio

            

        } else {
            // Ocultar el ícono y hacer visible el número del día
            iconContainer.style.display = 'none';
            dayNumberElement.style.visibility = 'visible'; // Mostrar el número del día visualmente
        }

        // Añadir el ícono si aún no existe
        if (!iconContainer.querySelector('.day-icon')) {
            //this.addIconToDay(el, dayNumberElement.innerText);
            this.addIconToDay(el, day);
            getClima(clickedDate);
        }
    };

    Calendar.prototype.addIconToDay = function (dayElement, day) {
        // Crear el ícono y añadirlo al contenedor
        var iconContainer = dayElement.querySelector('.day-icon-container');
        //var icon = createElement('i', 'day-icon bi bi-calendar-check-fill'); // Cambia 'bi bi-star' por el ícono que desees
        var icon = createElement('img', 'day-icon colibri');
        icon.src = '../../Content/img/IconoReserva.png';
        icon.style.width = '50px'; // Ajusta el tamaño para que coincida con el ícono
        //icon.style.height = '1em';

        //icon.style.color = 'red'; // Aplicar el color rojo al ícono
        iconContainer.appendChild(icon);
        //this.selectedDate = day.format('YYYY-MM-DD');
        //console.log('Fecha seleccionada:', this.selectedDate); // Mostrar en consola

    };

    Calendar.prototype.renderEvents = function (events, ele) {
        //Remove any events in the current details element
        var currentWrapper = ele.querySelector('.events');
        var wrapper = createElement('div', 'events in' + (currentWrapper ? ' new' : ''));

        events.forEach(function (ev) {
            var div = createElement('div', 'event');
            var square = createElement('div', 'event-category ' + ev.color);
            var span = createElement('span', '', ev.eventName);

            div.appendChild(square);
            div.appendChild(span);
            wrapper.appendChild(div);
        });

        if (!events.length) {
            var div = createElement('div', 'event empty');
            var span = createElement('span', '', 'No Events');

            div.appendChild(span);
            wrapper.appendChild(div);
        }

        if (currentWrapper) {
            currentWrapper.className = 'events out';
            currentWrapper.addEventListener('webkitAnimationEnd', function () {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
            });
            currentWrapper.addEventListener('oanimationend', function () {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
            });
            currentWrapper.addEventListener('msAnimationEnd', function () {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
            });
            currentWrapper.addEventListener('animationend', function () {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
            });
        } else {
            ele.appendChild(wrapper);
        }
    }

    //Calendar.prototype.drawLegend = function () {
    //    var legend = createElement('div', 'legend');
    //    var calendars = this.events.map(function (e) {
    //        return e.calendar + '|' + e.color;
    //    }).reduce(function (memo, e) {
    //        if (memo.indexOf(e) === -1) {
    //            memo.push(e);
    //        }
    //        return memo;
    //    }, []).forEach(function (e) {
    //        var parts = e.split('|');
    //        var entry = createElement('span', 'entry ' + parts[1], parts[0]);
    //        legend.appendChild(entry);
    //    });
    //    this.el.appendChild(legend);
    //}

    Calendar.prototype.nextMonth = function () {
        this.current.add('months', 1);
        this.next = true;
        this.draw();
    }

    Calendar.prototype.prevMonth = function () {
        this.current.subtract('months', 1);
        this.next = false;
        this.draw();
    }


    window.Calendar = Calendar;

    function createElement(tagName, className, innerText) {
        var ele = document.createElement(tagName);
        if (className) {
            ele.className = className;
        }
        if (innerText) {
            ele.innderText = ele.textContent = innerText;
        }
        return ele;
    }
}();

!function () {

    var data = [];



    function addDate(ev) {

    }

    var calendar = new Calendar('#calendar', data);

}();

$(document).ready(function () {
    //console.log(today.format('YYYY-MM-DD'));
    getClima(today.format('YYYY-MM-DD'))
})

function getClima(day) {
    if (clickedDate != undefined) {
        day = clickedDate;
    }
    console.log(formatearFecha(day))
    $.ajax({
        url: `https://api.weatherapi.com/v1/forecast.json?key=c2c169a5282c425fafa215433243009&q=Mexico City&dt=${day}&lang=es`,
        type: 'GET',
        dataType: 'JSON',
        success: function (result) {
            console.log(result);

            // Limpiar los valores anteriores
            $('#temp_c').empty();
            $('#max_temp').empty();
            $('#min_temp').empty();
            $('#estado_temp').empty();
            $('#icon').attr('src', '');

            // Obtener el pronóstico del día especificado
            var forecastDay = result.forecast.forecastday[0];
            var fecha = formatearFecha(day).split('|');

            // Mostrar los valores en el DOM
            $('#dayNumber').html(fecha[0]);
            $('#monthNumber').html(fecha[1]);
            $('#temp_c').text(forecastDay.day.avgtemp_c + " °C");
            $('#max_temp').text("Temperatura Máxima: " + forecastDay.day.maxtemp_c + " °C");
            $('#min_temp').text("Temperatura Mínima: " + forecastDay.day.mintemp_c + " °C");
            $('#estado_temp').text(forecastDay.day.condition.text);
            $('#icon').attr('src', forecastDay.day.condition.icon);
        },
        error: function () {
            console.log("Error al obtener los datos.");
        }
    });

}



function obtenerNombreDia(fecha) {
    var diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return diasSemana[fecha.getDay()];
}

// Función para formatear la fecha al formato deseado
function formatearFecha(day) {
    // Convertir la cadena 'YYYY-MM-DD' a un objeto Date
    var partesFecha = day.split('-');  // Dividir la cadena por los guiones
    var fecha = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2]); // Crear objeto Date

    // Obtener el número del día y el nombre del día de la semana
    var diaNumero = fecha.getDate().toString().padStart(2, '0'); // Asegura que haya dos dígitos
    var diaSemana = obtenerNombreDia(fecha);

    // Retornar el formato '04 Viernes'
    return diaNumero + '|' + diaSemana;
}
