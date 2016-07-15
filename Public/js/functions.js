$(document).ready(function () {
    var docbody = $("body");

    var public_url = typeof L !== 'undefined'?L.C.public_url:'../';

    /* --------------------------------------------------------
     Template Settings
     -----------------------------------------------------------*/
    var settings = '<a id="settings" href="#changeSkin" data-toggle="modal">' +
        '<i class="fa fa-gear"></i> Change Skin' +
        '</a>' +
        '<div class="modal fade" id="changeSkin" tabindex="-1" role="dialog" aria-hidden="true">' +
        '<div class="modal-dialog modal-lg">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
        '<h4 class="modal-title">Change Template Skin</h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<div class="row template-skins">' +
        '<a data-skin="skin-blur-violate" class="col-sm-2 col-xs-4" href="">' +
        '<img src="' + public_url + '/img/skin/violate.jpg" alt="">' +
        '</a>' +
        '<a data-skin="skin/blur-lights" class="col-sm-2 col-xs-4" href="">' +
        '<img src="' + public_url + '/img/skin/lights.jpg" alt="">' +
        '</a>' +
        '<a data-skin="skin/blur-city" class="col-sm-2 col-xs-4" href="">' +
        '<img src="' + public_url + '/img/skin/city.jpg" alt="">' +
        '</a>' +
        '<a data-skin="skin/blur-greenish" class="col-sm-2 col-xs-4" href="">' +
        '<img src="' + public_url + '/img/skin/greenish.jpg" alt="">' +
        '</a>' +
        '<a data-skin="skin/blur-night" class="col-sm-2 col-xs-4" href="">' +
        '<img src="' + public_url + '/img/skin/night.jpg" alt="">' +
        '</a>' +
        '<a data-skin="skin/blur-blue" class="col-sm-2 col-xs-4" href="">' +
        '<img src="' + public_url + '/img/skin/blue.jpg" alt="">' +
        '</a>' +
        '<a data-skin="skin/blur-sunny" class="col-sm-2 col-xs-4" href="">' +
        '<img src="' + public_url + '/img/skin/sunny.jpg" alt="">' +
        '</a>' +
        '<a data-skin="skin/cloth" class="col-sm-2 col-xs-4" href="">' +
        '<img src="' + public_url + '/img/skin/cloth.jpg" alt="">' +
        '</a>' +
        '<a data-skin="skin/tectile" class="col-sm-2 col-xs-4" href="">' +
        '<img src="' + public_url + '/img/skin/tectile.jpg" alt="">' +
        '</a>' +
        '<a data-skin="skin/blur-chrome" class="col-sm-2 col-xs-4" href="">' +
        '<img src="' + public_url + '/img/skin/chrome.jpg" alt="">' +
        '</a>' +
        '<a data-skin="skin/blur-ocean" class="col-sm-2 col-xs-4" href="">' +
        '<img src="' + public_url + '/img/skin/ocean.jpg" alt="">' +
        '</a>' +
        '<a data-skin="skin/blur-sunset" class="col-sm-2 col-xs-4" href="">' +
        '<img src="' + public_url + '/img/skin/sunset.jpg" alt="">' +
        '</a>' +
        '<a data-skin="skin/blur-yellow" class="col-sm-2 col-xs-4" href="">' +
        '<img src="' + public_url + '/img/skin/yellow.jpg" alt="">' +
        '</a>' +
        '<a  data-skin="skin/blur-kiwi" class="col-sm-2 col-xs-4" href="">' +
        '<img src="' + public_url + '/img/skin/kiwi.jpg" alt="">' +
        '</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $('#main').prepend(settings);

    docbody.on('click', '.template-skins > a', function (e) {
        e.preventDefault();
        var skin = $(this).data('skin');
        docbody.attr('id', skin);
        $('#changeSkin').modal('hide');
    });

    /* --------------------------------------------------------
     Components
     -----------------------------------------------------------*/
    /* Textarea */
    if ($('.auto-size')[0]) {
        $('.auto-size').autosize();
    }

    //Select
    if ($('.select')[0]) {
        $('.select').selectpicker();
    }

    //Sortable
    if ($('.sortable')[0]) {
        $('.sortable').sortable();
    }

    //Tag Select
    if ($('.tag-select')[0]) {
        $('.tag-select').chosen();
    }

    /* Tab */
    if ($('.tab')[0]) {
        $('.tab a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
    }

    /* Collapse */
    if ($('.collapse')[0]) {
        $('.collapse').collapse();
    }

    /* Accordion */
    $('.panel-collapse').on('shown.bs.collapse', function () {
        $(this).prev().find('.panel-title a').removeClass('active');
    }).on('hidden.bs.collapse', function () {
        $(this).prev().find('.panel-title a').addClass('active');
    });

    //Popover
    if ($('.pover')[0]) {
        $('.pover').popover();
    }

    /* --------------------------------------------------------
     Sidebar + Menu
     -----------------------------------------------------------*/
    var sidebar  = $('#sidebar');
    /* Menu Toggle */
    docbody.on('click touchstart', '#menu-toggle', function (e) {
        e.preventDefault();
        $('html').toggleClass('menu-active');
        sidebar.toggleClass('toggled');
        //$('#content').toggleClass('m-0');
    });

    /* Active Menu */
    sidebar.find('.menu-item').hover(function () {
        $(this).closest('.dropdown').addClass('hovered');
    }, function () {
        $(this).closest('.dropdown').removeClass('hovered');
    });
    /* Prevent */
    $('.side-menu .dropdown > a').click(function (e) {
        e.preventDefault();
    });

    /* --------------------------------------------------------
     Chart Info
     -----------------------------------------------------------*/
    docbody.on('click touchstart', '.tile .tile-info-toggle', function (e) {
        e.preventDefault();
        $(this).closest('.tile').find('.chart-info').toggle();
    });

    /* --------------------------------------------------------
     -----------------------------------------------------------*/
    var _tm_ = $(".todo-list .media");
    //Add line-through for alreadt checked items
    _tm_.find('.checked').each(function () {
        $(this).closest('.media').find('.checkbox label').css('text-decoration', 'line-through')
    });
    //Add line-through when checking
    _tm_.find('input').on('ifChecked', function () {
        $(this).closest('.media').find('.checkbox label').css('text-decoration', 'line-through');
    }).on('ifUnchecked', function () {
        $(this).closest('.media').find('.checkbox label').removeAttr('style');
    });

    /* --------------------------------------------------------
     Custom Scrollbar
     -----------------------------------------------------------*/
    if ($('.overflow')[0]) {
        $('.overflow').niceScroll();
    }

    /* --------------------------------------------------------
     Messages + Notifications
     -----------------------------------------------------------*/

    docbody.on('click touchstart', '.drawer-toggle', function (e) {
        e.preventDefault();
        var drawer = $(this).attr('data-drawer');

        $('.drawer:not("#' + drawer + '")').removeClass('toggled');
        var d = $('#' + drawer);
        if (d.hasClass('toggled')) {
            d.removeClass('toggled');
        }
        else {
            d.addClass('toggled');
        }
    });

    //Close when click outside
    $(document).on('mouseup touchstart', function (e) {
        var container = $('.drawer, .tm-icon');
        if (container.has(e.target).length === 0) {
            $('.drawer').removeClass('toggled');
            $('.drawer-toggle').removeClass('open');
        }
    });

    //Close
    docbody.on('click touchstart', '.drawer-close', function () {
        $(this).closest('.drawer').removeClass('toggled');
        $('.drawer-toggle').removeClass('open');
    });


    /* --------------------------------------------------------
     Calendar
     -----------------------------------------------------------*/
    //Sidebar
    if ($('#sidebar-calendar')[0]) {
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        $('#sidebar-calendar').fullCalendar({
            editable: false,
            events: [],
            header: {
                left: 'title'
            }
        });
    }
    //Content widget
    if ($('#calendar-widget')[0]) {
        $('#calendar-widget').fullCalendar({
            header: {
                left: 'title',
                right: 'prev, next',
                //right: 'month,basicWeek,basicDay'
            },
            editable: true,
            events: [
                {
                    title: 'All Day Event',
                    start: new Date(y, m, 1)
                },
                {
                    title: 'Long Event',
                    start: new Date(y, m, d - 5),
                    end: new Date(y, m, d - 2)
                },
                {
                    title: 'Repeat Event',
                    start: new Date(y, m, 3),
                    allDay: false
                },
                {
                    title: 'Repeat Event',
                    start: new Date(y, m, 4),
                    allDay: false
                }
            ]
        });
    }
    /* --------------------------------------------------------
     RSS Feed widget
     -----------------------------------------------------------*/
    // if ($('#news-feed')[0]) {
    //     $('#news-feed').FeedEk({
    //         FeedUrl: 'http://rss.cnn.com/rss/edition.rss',
    //         MaxCount: 5,
    //         ShowDesc: false,
    //         ShowPubDate: true,
    //         DescCharacterLimit: 0
    //     });
    // }

    /* --------------------------------------------------------
     Chat
     -----------------------------------------------------------*/
    $(function () {
        docbody.on('click touchstart', '.chat-list-toggle', function () {
            $(this).closest('.chat').find('.chat-list').toggleClass('toggled');
        });

        docbody.on('click touchstart', '.chat .chat-header .btn', function (e) {
            e.preventDefault();
            $('.chat .chat-list').removeClass('toggled');
            $(this).closest('.chat').toggleClass('toggled');
        });

        $(document).on('mouseup touchstart', function (e) {
            var container = $('.chat, .chat .chat-list');
            if (container.has(e.target).length === 0) {
                container.removeClass('toggled');
            }
        });
    });

    /* --------------------------------------------------------
     Form Validation
     -----------------------------------------------------------*/
    if ($("[class*='form-validation']")[0]) {
        $("[class*='form-validation']").validationEngine();

        //Clear Prompt
        docbody.on('click', '.validation-clear', function (e) {
            e.preventDefault();
            $(this).closest('form').validationEngine('hide');
        });
    }

    /* --------------------------------------------------------
     `Color Picker
     -----------------------------------------------------------*/
    //Default - hex
    var color_picker = $(".color-picker");
    if (color_picker[0]) {
        color_picker.colorpicker();
    }

    //RGB
    if ($('.color-picker-rgb')[0]) {
        $('.color-picker-rgb').colorpicker({
            format: 'rgb'
        });
    }

    //RGBA
    if ($('.color-picker-rgba')[0]) {
        $('.color-picker-rgba').colorpicker({
            format: 'rgba'
        });
    }

    //Output Color
    if ($('[class*="color-picker"]')[0]) {
        $('[class*="color-picker"]').colorpicker().on('changeColor', function (e) {
            var colorThis = $(this).val();
            $(this).closest('.color-pick').find('.color-preview').css('background', e.color.toHex());
        });
    }

    /* --------------------------------------------------------
     Date Time Picker
     -----------------------------------------------------------*/
    //Date Only
    if ($('.date-only')[0]) {
        $('.date-only').datetimepicker({
            pickTime: false
        });
    }

    //Time only
    if ($('.time-only')[0]) {
        $('.time-only').datetimepicker({
            pickDate: false
        });
    }

    //12 Hour Time
    if ($('.time-only-12')[0]) {
        $('.time-only-12').datetimepicker({
            pickDate: false,
            pick12HourFormat: true
        });
    }

    $('.datetime-pick input:text').on('click', function () {
        $(this).closest('.datetime-pick').find('.add-on i').click();
    });

    /* --------------------------------------------------------
     Input Slider
     -----------------------------------------------------------*/
    if ($('.input-slider')[0]) {
        $('.input-slider').slider().on('slide', function (ev) {
            $(this).closest('.slider-container').find('.slider-value').val(ev.value);
        });
    }
    /* --------------------------------------------------------
     WYSIWYE Editor + Markedown
     -----------------------------------------------------------*/
    //Markedown
    if ($('.markdown-editor')[0]) {
        $('.markdown-editor').markdown({
            autofocus: false,
            savable: false
        });
    }
    //WYSIWYE Editor
    if ($('.wysiwye-editor')[0]) {
        $('.wysiwye-editor').summernote({
            height: 200
        });
    }
    /* --------------------------------------------------------
     Media Player
     -----------------------------------------------------------*/
    var av = $('audio,video');
    if (av[0]) {
        av.mediaelementplayer({
            success: function (player, node) {
                $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
            }
        });
    }

    /* ---------------------------
     Image Popup [Pirobox]
     --------------------------- */
    if ($('.pirobox_gall')[0]) {
        //Fix IE
        jQuery.browser = {};
        (function () {
            jQuery.browser.msie = false;
            jQuery.browser.version = 0;
            if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
                jQuery.browser.msie = true;
                jQuery.browser.version = RegExp.$1;
            }
        })();
        //Lightbox
        $.piroBox_ext({
            piro_speed: 700,
            bg_alpha: 0.5,
            piro_scroll: true // pirobox always positioned at the center of the page
        });
    }

    /* ---------------------------
     Vertical tab
     --------------------------- */
    $('.tab-vertical').each(function () {
        var tabHeight = $(this).outerHeight();
        var tabContentHeight = $(this).closest('.tab-container').find('.tab-content').outerHeight();

        if ((tabContentHeight) > (tabHeight)) {
            $(this).height(tabContentHeight);
        }
    });

    docbody.on('click touchstart', '.tab-vertical li', function () {
        var tabVertical = $(this).closest('.tab-vertical');
        tabVertical.height('auto');

        var tabHeight = tabVertical.outerHeight();
        var tabContentHeight = $(this).closest('.tab-container').find('.tab-content').outerHeight();

        if ((tabContentHeight) > (tabHeight)) {
            tabVertical.height(tabContentHeight);
        }
    });

    /* --------------------------------------------------------
     Login + Sign up
     -----------------------------------------------------------*/
    (function () {
        docbody.on('click touchstart', '.box-switcher', function (e) {
            e.preventDefault();
            var box = $(this).attr('data-switch');
            $(this).closest('.box').toggleClass('active');
            $('#' + box).closest('.box').addClass('active');
        });
    })();


    /* --------------------------------------------------------
     Checkbox + Radio
     -----------------------------------------------------------*/
    if ($('input:checkbox, input:radio')[0]) {

        //Checkbox + Radio skin
        $('input:checkbox:not([data-toggle="buttons"] input, .make-switch input), input:radio:not([data-toggle="buttons"] input)').iCheck({
            checkboxClass: 'icheckbox_minimal',
            radioClass: 'iradio_minimal',
            increaseArea: '20%' // optional
        });

        //Checkbox listing
        $('.list-parent-check').on('ifChecked', function () {
            $(this).closest('.list-container').find('.list-check').iCheck('check');
        }).on('ifClicked', function () {
            $(this).closest('.list-container').find('.list-check').iCheck('uncheck');
        });

        $('.list-check').on('ifChecked', function () {
            var parent = $(this).closest('.list-container').find('.list-parent-check');
            var thisCheck = $(this).closest('.list-container').find('.list-check');
            var thisChecked = $(this).closest('.list-container').find('.list-check:checked');

            if (thisCheck.length == thisChecked.length) {
                parent.iCheck('check');
            }
        }).on('ifUnchecked', function () {
            var parent = $(this).closest('.list-container').find('.list-parent-check');
            parent.iCheck('uncheck');
        }).on('ifChanged', function () {
            var thisChecked = $(this).closest('.list-container').find('.list-check:checked');
            var showon = $(this).closest('.list-container').find('.show-on');
            if (thisChecked.length > 0) {
                showon.show();
            }
            else {
                showon.hide();
            }
        });

    }

    /* --------------------------------------------------------
     MAC Hack - Mac only
     -----------------------------------------------------------*/
    if (navigator.userAgent.indexOf('Mac') > 0) docbody.addClass('mac-os');

    /* --------------------------------------------------------
     Date Time Widget
     -----------------------------------------------------------*/
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Create a newDate() object
    var newDate = new Date();
    // Extract the current date from Date object
    newDate.setDate(newDate.getDate());

    // Output the day, date, month and year
    // $('#date').html(dayNames[newDate.getDay()] + " " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());
    var d = document.getElementById("date");
    if(d){
        d.innerHTML = dayNames[newDate.getDay()] + " " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear();
    }


    var sec = document.getElementById("sec");
    var min = document.getElementById("min");
    var hour = document.getElementById("hours");
    setInterval(function () {
        var date = new Date();
        var seconds = date.getSeconds();
        var minutes = date.getMinutes();
        var hours = date.getHours();
        sec.innerHTML =  seconds < 10 ? "0"+seconds : seconds;
        min.innerHTML =  minutes < 10 ? "0"+minutes : minutes;
        hour.innerHTML =  hours < 10 ? "0"+hours : hours ;
    }, 1000);



    /* --------------------------------------------------------
     Tooltips
     -----------------------------------------------------------*/
    var tooltips = $('.tooltips');
    tooltips[0] && tooltips.tooltip();

    /* --------------------------------------------------------
     Animate numbers
     -----------------------------------------------------------*/
    $('.quick-stats').each(function () {
        var target = $(this).find('h2');
        var toAnimate = $(this).find('h2').attr('data-value');
        // Animate the element's value from x to y:
        $({someValue: 0}).animate({someValue: toAnimate}, {
            duration: 1000,
            easing: 'swing', // can be anything
            step: function () { // called on every step
                // Update the element's text with rounded-up value:
                target.text(commaSeparateNumber(Math.round(this.someValue)));
            }
        });

        function commaSeparateNumber(val) {
            while (/(\d+)(\d{3})/.test(val.toString())) {
                val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            }
            return val;
        }
    });

});
