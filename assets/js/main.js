var HelloYesDollar = (function($) {

    var config = {
        ids: {
            interactive: 'HYD',
        },
        classes: {
            active:   'HYD__active',
            hidden:   'HYD__hidden',
            layer:    'HYD__layer',
            mapImage: 'HYD__map-image',
            scale:    'HYD__scale',
            section:  'HYD__section'
        },
        maps: {
            large:    'HYD__map--large',
            small:    'HYD__map--small'
        }
    },
    dom = {},

    transitioning = false,
    transitionDuration = 1000,
    transitionEasing = 'easeInOutQuart',

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
            toggles: q('[data-target]'),
            sections: q('.' + config.classes.section)
        };
    },

    glow = function () {
        setTimeout(function() {
            if (glowing) {
                var section = q(dom.sections[glowCount]);
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
                target = q('.' + targetId);

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
            section = q(section);
            if (!section.hasClass(config.classes.active)) {
                section.stop().fadeOut(0, 0).addClass(config.classes.hidden);
            }
        });
    },

    resizeBackgrounds = function () {
        dom.interactive.addClass(config.classes.scale);
        q('[name="' + config.maps.large + '"]').remove();
        transitioning = true;

        q('.' + config.classes.layer)
            .animateBackground(900, -150, -410, transitionDuration, transitionEasing, function() {
                q('[name="' + config.maps.small + '"]').removeClass(config.classes.hidden);
                q('.' + config.classes.mapImage).attr('usemap', '#' + config.maps.small);
                transitioning = false;
            });
    };

    return {
        init: init
    };

})(jQuery);

$.fn.animateBackground = function(size, x, y, duration, easing, callback) {
    var position = this.css('background-position').split(' ');
    this.size = parseInt(this.css('background-size')) || 0,
    this.x = parseInt(position[0]) || 0,
    this.y = parseInt(position[1]) || 0;

    $.Animation(this, {
        size: size,
        x: x,
        y: y
    }, {
        duration: duration,
        easing: easing
    }).progress(function(e) {
        this.css('background-size', e.tweens[0].now + 'px');
        this.css('background-position', e.tweens[1].now + 'px ' + e.tweens[2].now + 'px');
    }).done(callback);

    return this;
}

IsTouchDevice = 'ontouchstart' in window // Most browsers
    || 'onmsgesturechange' in window; // IE10

FastClick.attach(document.body);

$(window).load(function() {
    HelloYesDollar.init();
});
