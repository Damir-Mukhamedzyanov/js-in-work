function curds() {
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

}

module.exports = curds;