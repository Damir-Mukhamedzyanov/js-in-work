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
        clearTimeout(openModalThroughTime);
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
        totalSlider = document.querySelector('#total'),
        rigthArrow = document.querySelector('.offer__slider-next'),
        leftArrow = document.querySelector('.offer__slider-prev'),
        sliderWraper = document.querySelector('.offer__slider-wrapper'),
        sliderField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(sliderWraper).width,
        sliderAll = document.querySelector('.offer__slider');

    let slideIndex = 1;
    let offset = 0;

    if (imgSlider.length < 10) {
        totalSlider.textContent = `0${imgSlider.length}`;
        idSlider.textContent = `0${slideIndex}`;
    } else {
        totalSlider.textContent = imgSlider.length;
        idSlider.textContent = slideIndex
    }

    function changeIndex() {
        if (imgSlider.length < 10) {
            idSlider.textContent = `0${slideIndex}`;
        } else {
            idSlider.textContent = slideIndex;

        }
    }

    sliderField.style.width = 100 * imgSlider.length + '%';
    sliderField.style.display = 'flex';
    sliderField.style.transition = '0.5s all';

    sliderWraper.style.overflow = 'hidden'

    imgSlider.forEach(item => {
        item.style.width = width;
    })

    rigthArrow.addEventListener('click', () => {
        if (offset == +width.slice(0, width.length - 2) * (imgSlider.length - 1)) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }
        sliderField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == imgSlider.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        changeIndex()
        changeDot()
    })

    leftArrow.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (imgSlider.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }
        sliderField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = imgSlider.length;
        } else {
            slideIndex--;
        }

        changeIndex()
        changeDot()
    })

    let dots = [];

    // Навигация по слайдерам
    sliderAll.style.position = 'relative'

    const wraperDot = document.createElement('ol');
    wraperDot.classList.add('carousel-indicators');
    sliderAll.append(wraperDot);



    // Точки навигации
    for (let i = 0; i < imgSlider.length; i++) {
        const dot = document.createElement('li');
        dot.classList.add('dot');
        dot.setAttribute('data-slide-to', (i + 1))

        if (i == 0) {
            dot.style.opacity = 1;
        }
        wraperDot.append(dot)
        dots.push(dot)
    }

    function changeDot() {
        dots.forEach(dot => dot.style.opacity = '0.5')
        dots[slideIndex - 1].style.opacity = 1;
    }

    // Интерактивность точек
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            let i = dots.indexOf(dot);
            slideIndex = (i + 1);
            offset = +width.slice(0, width.length - 2) * i;
            sliderField.style.transform = `translateX(-${offset}px)`;
            changeIndex()
            changeDot()
        })
    })
})


