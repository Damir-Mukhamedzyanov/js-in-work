window.addEventListener(('DOMContentLoaded'), () => {

    const tabs = require('./modules/tabs'),
        modal = require('./modules/modal'),
        timer = require('./modules/timer'),
        cards = require('./modules/cards'),
        culc = require('./modules/culc'),
        forms = require('./modules/forms'),
        sliders = require('./modules/sliders');

    tabs();
    modal();
    timer();
    cards();
    culc();
    forms();
    sliders();

});