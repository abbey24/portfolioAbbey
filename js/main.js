



/********************************************
PORTFOLIO
********************************************/
$(window).load(function () {
    "use strict";
    var $container = $('.albumContainer');
    $container.isotope({
        filter: '*',
        animationOptions: {
            duration: 750,
            easing: 'linear',
            queue: false
        }
    });

    $('.albumFilter li').on('click', function () {
        "use strict";
        $('.albumFilter .current').removeClass('current');
        $(this).addClass('current');

        var selector = $(this).attr('data-filter');
        $container.isotope({
            filter: selector,
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });
        return false;
    });
});

/********************************************
EMAIL CONTROL
********************************************/

$(function () {
    "use strict";
    $('#contact_form').submit(function (e) {
        e.preventDefault();
        var form = $(this);
        var name = $("#name").val();
        var email = $("#email").val();
        var text = $("#message").val();
        var dataString = 'name=' + name + '&email=' + email + '&message=' + text;
        var proceed = true;
        if (name == "") {
            $('input[name=name]').css('border-color', '#e41919');
            proceed = false;
        }
        if (email == "") {
            $('input[name=email]').css('border-color', '#e41919');
            proceed = false;
        }

        if (text == "") {
            $('textarea[name=message]').css('border-color', '#e41919');
            proceed = false;
        }

        function isValidEmail(emailAddress) {
            var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
            return pattern.test(emailAddress);
        };
        if (isValidEmail(email) && proceed) {
            //            if (isValidEmail(email) && (text.length > 20) && (name.length > 1)) {
            $.ajax({
                type: 'POST',
                url: "contact_form/contact_process.php",
                data: dataString,
                success: function () {
                    $('.success').fadeIn(1000);
                    $("#subject").val("");
                    $("#name").val("");
                    $("#email").val("");
                    $("#message").val("");
                }
            });
        } else {
            $('.error').fadeIn(1000);
        }

    });
});
