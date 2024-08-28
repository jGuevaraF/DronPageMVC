!function () {

    moment.locale('es');

    var today = moment();
    //moment().locale('es');


    function Calendar(selector, events) {
        this.el = document.querySelector(selector);
        this.events = events;
        this.current = moment().date(1);
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

        this.drawLegend();
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
            icon.classList.add('bi', 'bi-chevron-right', 'fs-1', 'text-primary');
            right.addEventListener('click', function () { self.nextMonth(); });

            right.appendChild(icon);

            var left = createElement('div', 'left');
            icon = document.createElement('i');
            icon.classList.add('bi', 'bi-chevron-left', 'fs-1', 'text-primary');
            left.addEventListener('click', function () { self.prevMonth(); });
            left.appendChild(icon);

            //Append the Elements
            this.header.appendChild(this.title);
            this.header.appendChild(right);
            this.header.appendChild(left);
            this.el.appendChild(this.header);
        }

        //this.title.innerHTML = 'Fecha Aproximada <br>'+this.current.format('MMMM YYYY');
        this.title.innerHTML = 'Fecha aproximada<br>' + this.current.format('MMMM').toUpperCase() + '<br>' + this.current.format('YYYY');

    }

    Calendar.prototype.drawMonth = function () {
        var self = this;

        this.events.forEach(function (ev) {
            ev.date = self.current.clone().date(Math.random() * (29 - 1) + 1);
        });


        if (this.month) {
            this.oldMonth = this.month;
            this.oldMonth.className = 'month out ' + (self.next ? 'next' : 'prev');
            this.oldMonth.addEventListener('webkitAnimationEnd', function () {
                self.oldMonth.parentNode.removeChild(self.oldMonth);
                self.month = createElement('div', 'month');
                self.backFill();
                self.currentMonth();
                self.fowardFill();
                self.el.appendChild(self.month);
                window.setTimeout(function () {
                    self.month.className = 'month in ' + (self.next ? 'next' : 'prev');
                }, 16);
            });
        } else {
            this.month = createElement('div', 'month');
            this.el.appendChild(this.month);
            this.backFill();
            this.currentMonth();
            this.fowardFill();
            this.month.className = 'month new';
        }
    }

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

    Calendar.prototype.drawDay = function (day) {
        var self = this;
        this.getWeek(day);

        // Outer Day
        var outer = createElement('div', this.getDayClass(day));
        outer.addEventListener('click', function () {
            self.openDay(this);
        });

        // Day Name
        var name = createElement('div', 'day-name', day.format('ddd'));

        // Day Number
        var number = createElement('div', 'day-number', day.format('DD'));

        // Create a container for the icon
        var iconContainer = createElement('div', 'day-icon-container');

        // Append the number and icon container
        outer.appendChild(name);
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

    Calendar.prototype.openDay = function (el) {
        var dayNumberElement = el.querySelector('.day-number');
        var iconContainer = el.querySelector('.day-icon-container');

        // Alternar entre mostrar y ocultar el ícono
        if (iconContainer.style.display === 'none' || iconContainer.style.display === '') {
            // Mostrar el ícono y ocultar visualmente el número del día
            iconContainer.style.display = 'block';
            iconContainer.style.marginTop = '10px';
            dayNumberElement.style.visibility = 'hidden'; // Ocultar el número del día visualmente, pero no ocupar el espacio

            // Añadir el ícono si aún no existe
            if (!iconContainer.querySelector('.day-icon')) {
                this.addIconToDay(el, dayNumberElement.innerText);
            }
        } else {
            // Ocultar el ícono y hacer visible el número del día
            iconContainer.style.display = 'none';
            dayNumberElement.style.visibility = 'visible'; // Mostrar el número del día visualmente
        }
    };


    Calendar.prototype.addIconToDay = function (dayElement, day) {
        // Crear el ícono y añadirlo al contenedor
        var iconContainer = dayElement.querySelector('.day-icon-container');
        var icon = createElement('i', 'day-icon bi bi-calendar-check-fill'); // Cambia 'bi bi-star' por el ícono que desees
        icon.style.color = 'red'; // Aplicar el color rojo al ícono
        iconContainer.appendChild(icon);
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

    Calendar.prototype.drawLegend = function () {
        var legend = createElement('div', 'legend');
        var calendars = this.events.map(function (e) {
            return e.calendar + '|' + e.color;
        }).reduce(function (memo, e) {
            if (memo.indexOf(e) === -1) {
                memo.push(e);
            }
            return memo;
        }, []).forEach(function (e) {
            var parts = e.split('|');
            var entry = createElement('span', 'entry ' + parts[1], parts[0]);
            legend.appendChild(entry);
        });
        this.el.appendChild(legend);
    }

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
    //var data = [
    //  { eventName: 'Lunch Meeting w/ Mark', calendar: 'Work', color: 'orange' },
    //  { eventName: 'Interview - Jr. Web Developer', calendar: 'Work', color: 'orange' },
    //  { eventName: 'Demo New App to the Board', calendar: 'Work', color: 'orange' },
    //  { eventName: 'Dinner w/ Marketing', calendar: 'Work', color: 'orange' },

    //  { eventName: 'Game vs Portalnd', calendar: 'Sports', color: 'blue' },
    //  { eventName: 'Game vs Houston', calendar: 'Sports', color: 'blue' },
    //  { eventName: 'Game vs Denver', calendar: 'Sports', color: 'blue' },
    //  { eventName: 'Game vs San Degio', calendar: 'Sports', color: 'blue' },

    //  { eventName: 'School Play', calendar: 'Kids', color: 'yellow' },
    //  { eventName: 'Parent/Teacher Conference', calendar: 'Kids', color: 'yellow' },
    //  { eventName: 'Pick up from Soccer Practice', calendar: 'Kids', color: 'yellow' },
    //  { eventName: 'Ice Cream Night', calendar: 'Kids', color: 'yellow' },

    //  { eventName: 'Free Tamale Night', calendar: 'Other', color: 'green' },
    //  { eventName: 'Bowling Team', calendar: 'Other', color: 'green' },
    //  { eventName: 'Teach Kids to Code', calendar: 'Other', color: 'green' },
    //  { eventName: 'Startup Weekend', calendar: 'Other', color: 'green' }
    //];

    var data = [];



    function addDate(ev) {

    }

    var calendar = new Calendar('#calendar', data);

}();