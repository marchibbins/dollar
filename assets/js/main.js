var HelloYesDollar = (function ($) {

    var config = {
        ids: {
            interactive: 'HYD',
        },
        classes: {
            active:   'HYD__active',
            back:     'HYD__back',
            hidden:   'HYD__hidden',
            layer:    'HYD__layer',
            map:      'HYD__map',
            mapImage: 'HYD__map-image',
            scale:    'HYD__scale',
            section:  'HYD__section',
            scroll:   'HYD__scroll',
            text:     'HYD__text',
            title:    'HYD__title',
            titlebox: 'HYD__titlebox'
        },
        maps: {
            large:    'HYD__map--large',
            small:    'HYD__map--small'
        }
    },
    dom = {},

    fadeSpeed = 400,

    glow = {
        init: true,
        speed: 100,
        start: 1000,
        wait: 3000,
        count: 0,
        duration: 0
    },

    transition = {
        init: false,
        large: {
            size: 1067,
            x: -267,
            y: -400
        },
        small: {
            size: 780,
            x: -123,
            y: -374
        },
        duration: 1000,
        easing: 'easeInOutQuart',
    },

    init = function () {
        setup();
        attach();
        setTimeout(attract, glow.start);
        dom.interactive.removeClass(config.classes.hidden);
    },

    setup = function () {
        dom = {
            interactive: $('#' + config.ids.interactive),
            toggles: q('[data-target]'),
            sections: q('.' + config.classes.section)
        };
    },

    attract = function () {
        setTimeout(function () {
            if (glow.init) {
                var section = q(dom.sections[glow.count]);
                section.fadeIn(fadeSpeed, function () {
                    section.fadeOut(fadeSpeed);
                });

                glow.count++;
                if (glow.count == dom.sections.length) {
                    glow.duration = glow.wait;
                    glow.count = 0;
                } else {
                    glow.duration = glow.speed;
                }

                attract();
            }
        }, glow.duration);
    },

    attach = function () {
        dom.toggles.each(function (i, el) {
            var el = q(el),
                targetId = q(el).attr('data-target'),
                target = q('.' + targetId);

            if (!IsTouchDevice) {
                el.on('mouseenter', function (event) {
                    glow.init = false;
                    if (!transition.init) {
                        if (!target.attr('active')) {
                            target.stop().fadeIn(fadeSpeed);
                        }
                        toggleTitle(event.type, targetId)
                    }
                })

                .on('mouseleave', function (event) {
                    if (!transition.init) {
                        if (!target.attr('active')) {
                            target.stop().fadeOut(fadeSpeed);
                        }
                        toggleTitle(event.type, targetId)
                    }
                })
            };

            el.on('click', function (event) {
                glow.init = false;
                event.preventDefault();
                if (!transition.init) {
                    selectSection(targetId, target);
                }
            });
        });
    },

    selectSection = function (targetId, target) {
        resetToggles();
        target.attr('active', true)
            .stop().fadeTo(0, 100)
            .addClass(config.classes.active)
            .removeClass(config.classes.hidden);

        if (!dom.interactive.hasClass(config.classes.scale)) {
            resizeBackgrounds(targetId);
        } else {
            showText(targetId);
        }

        complete();
    },

    complete = function () {
        if (q('.' + config.classes.section + '.' + config.classes.active).length === dom.sections.length) {
            var back = q('.' + config.classes.back);
            back.show().on('click', function (event) {
                event.preventDefault();
                back.remove();
                q('.' + config.classes.map + ', .' + config.classes.text).remove();
                q('.' + config.classes.layer).animateBackground(transition.large.size, transition.large.x, transition.large.y, transition.duration, transition.easing);
            });
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

    resizeBackgrounds = function (targetId) {
        dom.interactive.addClass(config.classes.scale);
        q('.' + config.classes.text).addClass(config.classes.hidden);
        q('[name="' + config.maps.large + '"]').remove();
        transition.init = true;

        q('.' + config.classes.layer)
            .animateBackground(transition.small.size, transition.small.x, transition.small.y, transition.duration, transition.easing, function () {
                q('[name="' + config.maps.small + '"]').removeClass(config.classes.hidden);
                q('.' + config.classes.mapImage).attr('usemap', '#' + config.maps.small);
                transition.init = false;
                showText(targetId);
            });
    },

    showText = function (targetId) {
        var text = q('.' + config.classes.text);
        q('.' + config.classes.scroll).perfectScrollbar();
        q('.' + config.classes.titlebox).addClass(config.classes.hidden);

        if (text.hasClass(config.classes.hidden)) {
            q('[data-text="' + targetId + '"]').removeClass(config.classes.hidden);
            text.fadeIn({duration: fadeSpeed, queue: false}).animate({bottom: 0}, fadeSpeed, function () {
                text.removeClass(config.classes.hidden);
            });
        } else {
            var text = q('[data-text="' + targetId + '"]');
            if (!text.is(':visible')) {
                q('[data-text]').hide();
                text.fadeIn(fadeSpeed);
            }
        }

        // Hack to trigger change, i.e. init the scollbar 'active'
        q('.' + config.classes.scroll).scrollTop(1).scrollTop(0);
    }

    toggleTitle = function (type, targetId) {
        var titlebox = q('.' + config.classes.titlebox);
        if (type === 'mouseenter' && !q('[data-text="' + targetId + '"]').is(':visible')) {
            var title = q('[data-text="' + targetId + '"] .' + config.classes.title).text();
            titlebox.text(title).removeClass(config.classes.hidden);
        } else {
            titlebox.addClass(config.classes.hidden);
        }
    },

    q = function (selector) {
        return $(selector, dom.interactive);
    };

    return {
        init: init
    };

})(jQuery);

$.fn.animateBackground = function (size, x, y, duration, easing, callback) {
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
    }).progress(function (event) {
        this.css('background-size', event.tweens[0].now + 'px');
        this.css('background-position', event.tweens[1].now + 'px ' + event.tweens[2].now + 'px');
    }).done(callback);

    return this;
}

IsTouchDevice = 'ontouchstart' in window; // Most browsers, not IE10

FastClick.attach(document.body);

$(window).load(function () {
    HelloYesDollar.init();
});
