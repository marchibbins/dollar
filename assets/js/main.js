var Dollar = (function($) {

    var config = {
        ids: {
            container: 'dollar',
            one: 'one',
            two: 'two',
            three: 'three',
            four: 'four',
            five: 'five',
            six: 'six'
        },
        classes: {
            active: 'active',
            hidden: 'hidden'
        }
    },
    dom = {},

    init = function () {
        setup();
        attach();
    },

    setup = function () {
        dom = {
            container: $('#' + config.ids.container),
            sections: []
        };

        var sections = [
            config.ids.one,
            config.ids.two,
            config.ids.three,
            config.ids.four,
            config.ids.five,
            config.ids.six,
        ];

        $(sections).each(function (i, sectionId) {
            var section = q('#' + sectionId);
            dom.sections.push(section);
        });
    },

    q = function (selector) {
        return $(selector, dom.container);
    },

    attach = function () {
        q('[data-target]').each(function (i, el) {
            var el = $(el),
                targetId = q(el).attr('data-target'),
                target = q('#' + targetId);

            el.on('mouseenter', function () {
                target.fadeIn();
            })

            .on('mouseleave', function () {
                target.fadeOut();
            })

            .on('click', function (event) {
                event.preventDefault();
                selectSection(el, target);
            });
        });
    },

    selectSection = function (el, target) {
        resetToggles();
        el.unbind('mouseenter mouseleave');
        target.addClass(config.classes.active);
        target.removeClass(config.classes.hidden);
    },

    resetToggles = function () {
        $(dom.sections).each(function (i, section) {
            if (!section.hasClass(config.classes.active)) {
                section.addClass(config.classes.hidden);
            }
        });
    };

    return {
        init: init
    };

})(jQuery);

$(function() {
    Dollar.init();
});
