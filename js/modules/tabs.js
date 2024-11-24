function tubs() {
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

}

module.exports = tubs;