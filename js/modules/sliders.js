function slider() {
    // Создание слайдера

    const imgSlider = document.querySelectorAll('.offer__slide'),
        idSlider = document.querySelector('#current'),
        totalSlider = document.querySelector('#total'),
        rigthArrow = document.querySelector('.offer__slider-next'),
        leftArrow = document.querySelector('.offer__slider-prev'),
        sliderWraper = document.querySelector('.offer__slider-wrapper'),
        sliderField = document.querySelector('.offer__slider-inner'),
        sliderAll = document.querySelector('.offer__slider'),
        width = window.getComputedStyle(sliderWraper).width;


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
    let width1 = width.match(/\d/g).reduce((sum, value) => sum + value);

    rigthArrow.addEventListener('click', () => {
        if (offset == +width1 * (imgSlider.length - 1)) {
            offset = 0;
        } else {
            offset += +width1;
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
            offset = +width1 * (imgSlider.length - 1);
        } else {
            offset -= +width1;
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

    // Навигация по слайдерам

    let dots = [];
    sliderAll.style.position = 'relative'

    const wraperDot = document.createElement('ol');
    wraperDot.classList.add('carousel-indicators');
    sliderAll.append(wraperDot);

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
            offset = +width1 * i;
            sliderField.style.transform = `translateX(-${offset}px)`;
            changeIndex()
            changeDot()
        })
    })

}

module.exports = slider;