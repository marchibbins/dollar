var Dollar = (function($) {

    var config = {
        ids: {
            interactive: 'dollar-interactive',
            dollar: 'zero',
            one: 'one',
            two: 'two',
            three: 'three',
            four: 'four',
            five: 'five',
            six: 'six',
            mapLarge: 'map-large',
            mapSmall: 'map-small'
        },
        classes: {
            active: 'active',
            hidden: 'hidden',
            layer: 'layer',
            mapImage: 'map-image',
            scale: 'scale'
        }
    },
    dom = {},

    transitioning = false,
    fadeSpeed = 400,

    glowing = true,
    glowSpeed = 100,
    glowWait = 5000,
    glowCount = 0,
    glowDuration;

    init = function () {
        setup();
        attach();
        setTimeout(glow, glowWait);
        dom.interactive.removeClass(config.classes.hidden);
    },

    setup = function () {
        dom = {
            interactive: $('#' + config.ids.interactive),
            dollar: q('#' + config.ids.dollar),
            toggles: q('[data-target]'),
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

    glow = function () {
        setTimeout(function() {
            if (glowing) {
                var section = dom.sections[glowCount];
                section.fadeIn(fadeSpeed, function () {
                    section.fadeOut(fadeSpeed);
                });

                glowCount++;
                if (glowCount == dom.sections.length) {
                    glowDuration = glowWait;
                    glowCount = 0;
                } else {
                    glowDuration = glowSpeed;
                }

                glow();
            }
        }, glowDuration);
    },

    q = function (selector) {
        return $(selector, dom.interactive);
    },

    attach = function () {
        dom.toggles.each(function (i, el) {
            var el = q(el),
                targetId = q(el).attr('data-target'),
                target = q('#' + targetId);

            if (!IsTouchDevice) {
                el.on('mouseenter', function () {
                    glowing = false;
                    if (!transitioning) {
                        target.stop().fadeIn(fadeSpeed);
                    }
                })

                .on('mouseleave', function () {
                    if (!transitioning) {
                        target.stop().fadeOut(fadeSpeed);
                    }
                })
            };

            el.on('click', function (event) {
                glowing = false;
                event.preventDefault();
                if (!transitioning) {
                    selectSection(targetId, target);
                }
            });
        });
    },

    selectSection = function (targetId, target) {
        resetToggles();
        q('[data-target="' + targetId + '"]').unbind('mouseenter mouseleave');

        target.stop().fadeTo(0, 100)
            .addClass(config.classes.active)
            .removeClass(config.classes.hidden);

        if (!dom.interactive.hasClass(config.classes.scale)) {
            resizeBackgrounds();
        }
    },

    resetToggles = function () {
        $(dom.sections).each(function (i, section) {
            if (!section.hasClass(config.classes.active)) {
                section.stop().fadeOut(0, 0).addClass(config.classes.hidden);
            }
        });
    },

    resizeBackgrounds = function () {
        dom.interactive.addClass(config.classes.scale);
        q('#' + config.ids.mapLarge).remove();

        var animProperties = {
                backgroundSize: '900px',
                backgroundPositionX: -150,
                backgroundPositionY: -410
            },
            duration = 1000,
            ease = 'easeInOutQuart';

        transitioning = true;
        dom.dollar.animate(animProperties, duration, ease);
        q('.' + config.classes.layer).animate(animProperties, duration, ease, function() {
            q('#' + config.ids.mapSmall).removeClass(config.classes.hidden);
            q('.' + config.classes.mapImage).attr('usemap', '#' + config.ids.mapSmall);
            transitioning = false;
        });
    };

    return {
        init: init
    };

})(jQuery);

IsTouchDevice = 'ontouchstart' in window // Most browsers
    || 'onmsgesturechange' in window; // IE10

FastClick.attach(document.body);

$(window).load(function() {
    Dollar.init();
});
