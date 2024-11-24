function culc() {
    // Калькулятор уточной нормы калорий

    const result = document.querySelector('.calculating__result span');

    let sex, ratio, height, weight, age;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'woman';
        localStorage.setItem('sex', 'woman');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector)

        elements.forEach(element => {
            element.classList.remove(activeClass);

            if (element.getAttribute('id') === localStorage.getItem('sex')) {
                element.classList.add(activeClass)
            }

            if (element.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                element.classList.add(activeClass)
            }
        })
    }

    initLocalSettings('.calculating__choose-item', 'calculating__choose-item_active')

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }

        if (sex == 'woman') {
            result.textContent = Math.round(((height * 1.8) - (age * 4.7) + (weight * 9.6) + 655) * ratio)
        } else {
            result.textContent = Math.round(((height * 5) - (age * 6.8) + (weight * 13.7) + 66) * ratio)
        }
    }

    calcTotal()

    function getStaticInformation(selector, classActiv) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', ratio)
                } else {
                    sex = e.target.getAttribute('id')
                    localStorage.setItem('sex', sex)
                }

                console.log(ratio, sex);

                elements.forEach(element => {
                    element.classList.remove(classActiv)
                })

                e.target.classList.add(classActiv)
                calcTotal()

            })
        })

    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDInamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) {
                input.style.border = '2px solid red';
            } else {
                input.style.border = 'none'
            }


            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal()
        })
    }

    getDInamicInformation('#height')
    getDInamicInformation('#weight')
    getDInamicInformation('#age')
}

module.exports = culc;