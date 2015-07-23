var Dollar = (function($) {

    var config = {
        ids: {
            container: 'dollar'
        },
        classes: {
            hidden: 'hidden'
        },
        dom: {}
    };

    var init = function () {
        dom();
        attach();
    },

    dom = function () {
        config.dom = {
            container: $('#' + config.ids.container)
        };
    },

    attach = function () {
        q('[data-toggle]').each(function (i, el) {
            var targetId = q(el).attr('data-toggle'),
                target = q('#' + targetId);
            q(this).hover(function () {
                target.removeClass(config.classes.hidden);
            }, function () {
                target.addClass(config.classes.hidden);
            });
        });
    },

    q = function (selector) {
        return $(selector, dom.container);
    }

    return {
        init: init
    };

})(jQuery);

$(function() {
    Dollar.init();
});
