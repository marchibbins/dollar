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
            hidden: 'hidden'
        }
    },
    dom = {},

    currentSection,

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
            dom.sections.push(q('#' + sectionId));
        });
    },

    q = function (selector) {
        return $(selector, dom.container);
    },

    attach = function () {
        q('[data-toggle]').each(function (i, el) {
            var targetId = q(el).attr('data-target'),
                target = q('#' + targetId);

            q(this).hover(function () {
                if (!currentSection) {
                    target.removeClass(config.classes.hidden);
                }
            }, function () {
                if (!currentSection) {
                    target.addClass(config.classes.hidden);
                }
            })

            .click(function (event) {
                event.preventDefault();
                selectSection(targetId);
            });
        });
    },

    selectSection = function (targetId) {
        resetToggles();
        currentSection = targetId;
        console.debug("currentSection", currentSection);
    },

    resetToggles = function (targetId) {
        $(dom.sections).each(function (i, section) {
            section.addClass(config.classes.hidden);
        });
    };

    return {
        init: init
    };

})(jQuery);

$(function() {
    Dollar.init();
});
