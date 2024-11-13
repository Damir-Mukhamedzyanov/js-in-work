'use strict'

window.addEventListener(('DOMContentLoaded'), () => {
    //Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
        tabParent = document.querySelector('.tabheader__items'),
        tabContent = document.querySelectorAll('.tabcontent');

    function deleteTabs() {
        tabContent.forEach((item) => {
            item.classList.remove('show', "fade")
            item.classList.add('hide')
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active')
        });
    };

    function activeTab(i = 0) {
        tabContent[i].classList.remove('hide');
        tabContent[i].classList.add("show", "fade");
        tabs[i].classList.add('tabheader__item_active');
    };

    deleteTabs();
    activeTab();

    tabParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (item == target) {
                    deleteTabs();
                    activeTab(i);
                }
            })
        }
    })

    //Timer

    const dedline = '2024-10-10';
    function getTimeRemining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        if (t <= 0) {
            return {
                'total': 0,
                'days': 0,
                'hours': 0,
                'minutes': 0,
                'seconds': 0
            }
        }

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        }
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector('.timer'),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', dedline);

    //Modal

    const modalWindow = document.querySelector('.modal'),
        clouseModalWindow = document.querySelector('.modal__close'),
        btn = document.querySelectorAll('[data-modal]');

    function openModal() {
        modalWindow.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    btn.forEach(item => {
        item.addEventListener('click', () => {
            openModal();
            clearInterval(openModalThroughTime);
        })

    })

    function clouseModal() {
        modalWindow.style.display = 'none';
        document.body.style.overflow = '';
    }

    clouseModalWindow.addEventListener('click', clouseModal)

    modalWindow.addEventListener('click', (e) => {
        if (e.target === modalWindow) {
            clouseModal()
        }
    })

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
            clouseModal()
        }
    })

    const openModalThroughTime = setTimeout(openModal, 15000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal()
            clearInterval(openModalThroughTime);
            window.removeEventListener('scroll', showModalByScroll)
        }
    }

    window.addEventListener('scroll', showModalByScroll)

    // Используем класы

    class MenuCards {
        constructor(srcImg, alt, title, dscr, price, parent, ...classList) {
            this.srcImg = srcImg;
            this.alt = alt;
            this.title = title;
            this.dscr = dscr;
            this.price = price;
            this.classList = classList;
            this.parent = document.querySelector(parent);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        rander() {
            const element = document.createElement('div');

            if (this.classList.length === 0) {
                this.classList = 'menu__item';
                element.classList.add(this.classList)
            } else {
                this.classList.forEach(cl => element.classList.add(cl))
            }

            element.innerHTML = `
                    <img src="${this.srcImg}" alt="${this.alt}">
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.dscr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>`;

            this.parent.append(element)

        }
    }

    new MenuCards('img/tabs/vegy.jpg',
        'vegy',
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов.Продукт активных и здоровых людей.Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        8,
        '.menu__field .container',
        'menu__item'
    ).rander();

    new MenuCards('img/tabs/elite.jpg',
        'elite',
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд.Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        20,
        '.menu__field .container',
        'menu__item'
    ).rander();

    new MenuCards('img/tabs/post.jpg',
        'post',
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        15,
        '.menu__field .container',
        'menu__item'
    ).rander();

    //Forms

    const forms = document.querySelectorAll('form');

    const massage = {
        loading: 'Загрузка',
        success: 'Спасибо! Скоро мы с вами свяжемся.',
        failure: 'Что-то пошло не так...'
    }

    forms.forEach(item => {
        postData(item);
    });

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMassege = document.createElement('div');
            statusMassege.classList = ('status');
            statusMassege.textContent = massage.loading;
            form.append(statusMassege)

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');
            request.setRequestHeader('Content-type', 'application/json');
            const formData = new FormData(form);

            const obj = {};
            formData.forEach((value, key) => {
                obj[key] = value;
            });

            const json = JSON.stringify(obj);

            request.send(json);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    statusMassege.textContent = massage.success;
                    form.reset();
                    setTimeout(() => {
                        statusMassege.remove();
                    }, 2000)
                } else {
                    statusMassege.textContent = massage.failure;
                }
            })
        })
    }
});
