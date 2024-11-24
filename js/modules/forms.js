function forms() {
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
}

module.exports = forms;