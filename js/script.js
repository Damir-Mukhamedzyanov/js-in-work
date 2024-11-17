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

    modalWindow.addEventListener('click', (e) => {
        if (e.target === modalWindow || e.target.getAttribute('data-close') == '') {
            clouseModal()
        }
    })

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
            clouseModal()
        }
    })

    const openModalThroughTime = setTimeout(openModal, 50000);

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

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({ img, altimg, title, descr, price }) => {
                new MenuCards(img, altimg, title, descr, price, '.menu__field .container').rander();
            })
        })

    //Forms

    const forms = document.querySelectorAll('form');


    const massage = {
        loading: 'img/spiner/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся.',
        failure: 'Что-то пошло не так...'
    }

    forms.forEach(item => {
        bindPostData(item);
    });

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMassege = document.createElement('img');
            statusMassege.src = massage.loading
            statusMassege.style.cssText = `
            display: block;
            margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMassege);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            axios.post('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(massage.success);
                })
                .catch(() => {
                    showThanksModal(massage.failure)
                })
                .finally(() => {
                    form.reset();
                    statusMassege.remove();
                })

        })
    }

    function showThanksModal(massage) {
        const privModalDilog = document.querySelector('.modal__dialog');
        privModalDilog.style.display = 'none';

        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${massage}</div>
        </div>
        `;
        document.querySelector('.modal').append(thanksModal);

        setTimeout(function () {
            thanksModal.remove();
            privModalDilog.style.display = 'block';
            clouseModal();

        }, 4000);
    };

    // Создание слайдера

    const imgSlider = document.querySelectorAll('.offer__slide'),
        idSlider = document.querySelector('#current'),
        rigthArrow = document.querySelector('.offer__slider-next'),
        leftArrow = document.querySelector('.offer__slider-prev');

    // Счётчик слайда

    let t = 0;

    function current() {
        imgSlider.forEach((item, i) => {
            if (!item.classList.contains('hide')) {
                t = i
            }
        });

        idSlider.innerHTML = ''
        idSlider.innerHTML = `0${t + 1}`
    }

    current()

    // Смена слайдов

    rigthArrow.addEventListener('click', () => {
        imgSlider[t].classList.add('hide')
        if (t == (imgSlider.length - 1)) {
            imgSlider[0].classList.remove('hide')
        } else {
            imgSlider[t + 1].classList.remove('hide')
        }
        current()
    })

    leftArrow.addEventListener('click', () => {
        imgSlider[t].classList.add('hide')
        if (t == 0) {
            imgSlider[imgSlider.length - 1].classList.remove('hide')
        } else {
            imgSlider[t - 1].classList.remove('hide')
        }
        current()
    })

});
