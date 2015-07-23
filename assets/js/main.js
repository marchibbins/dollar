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
            hidden: 'hidden',
            layer: 'layer',
            scale: 'scale'
        }
    },
    dom = {},
    transitioning = false,

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
            var el = q(el),
                targetId = q(el).attr('data-target'),
                target = q('#' + targetId);

            el.on('mouseenter', function () {
                if (!transitioning) {
                    target.stop().fadeIn();
                }
            })

            .on('mouseleave', function () {
                if (!transitioning) {
                    target.stop().fadeOut();
                }
            })

            .on('click', function (event) {
                event.preventDefault();
                if (!transitioning) {
                    selectSection(el, target);
                }
            });
        });
    },

    selectSection = function (el, target) {
        resetToggles();
        el.unbind('mouseenter mouseleave');

        target.stop().fadeTo(0, 100)
            .addClass(config.classes.active)
            .removeClass(config.classes.hidden);

        if (!dom.container.hasClass(config.classes.scale)) {
            resizeBackgrounds();
        }
    },

    resetToggles = function () {
        $(dom.sections).each(function (i, section) {
            if (!section.hasClass(config.classes.active)) {
                section.stop().fadeTo(0, 0).addClass(config.classes.hidden);
            }
        });
    },

    resizeBackgrounds = function () {
        dom.container.addClass(config.classes.scale);
        var animProperties = {
                backgroundSize: '900px',
                backgroundPositionX: -150,
                backgroundPositionY: -410
            },
            duration = 1000,
            ease = 'easeInOutQuart';

        transitioning = true;
        dom.container.animate(animProperties, duration, ease);
        q('.' + config.classes.layer).animate(animProperties, duration, ease, function() {
            transitioning = false;
        });
    };

    return {
        init: init
    };

})(jQuery);

$(function() {
    Dollar.init();
});
