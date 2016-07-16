$(document).ready(function () {
    var docbody = $("body");
    var sidebar  = $('#sidebar');

    /* --------------------------------------------------------
     MAC Hack - Mac only
     -----------------------------------------------------------*/
    if (navigator.userAgent.indexOf('Mac') > 0) docbody.addClass('mac-os');

    docbody.on('click', '.template-skins > a', function (e) {
        e.preventDefault();
        var skin = $(this).data('skin');
        docbody.attr('id', skin);
        $('#changeSkin').modal('hide');
    }).on('click touchstart', '#menu-toggle', function (e) {
        /* --------------------------------------------------------
         Sidebar + Menu
         -----------------------------------------------------------*/
        e.preventDefault();
        $('html').toggleClass('menu-active');
        sidebar.toggleClass('toggled');
        //$('#content').toggleClass('m-0');
    }).on('click touchstart', '.tile .tile-info-toggle', function (e) {
        /* --------------------------------------------------------
         Chart Info
         -----------------------------------------------------------*/
        e.preventDefault();
        $(this).closest('.tile').find('.chart-info').toggle();
    }).on('click touchstart', '.drawer-toggle', function (e) {
        /* --------------------------------------------------------
         Messages + Notifications
         -----------------------------------------------------------*/
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
    }).on('click touchstart', '.drawer-close', function () {
        $(this).closest('.drawer').removeClass('toggled');
        $('.drawer-toggle').removeClass('open');
    }).on('click touchstart', '.chat-list-toggle', function () {
        /* --------------------------------------------------------
         Chat
         -----------------------------------------------------------*/
        $(this).closest('.chat').find('.chat-list').toggleClass('toggled');
    }).on('click touchstart', '.box-switcher', function (e) {
        /* --------------------------------------------------------
         Login + Sign up
         -----------------------------------------------------------*/
        e.preventDefault();
        var box = $(this).attr('data-switch');
        $(this).closest('.box').toggleClass('active');
        $('#' + box).closest('.box').addClass('active');
    }).on('click touchstart', '.chat .chat-header .btn', function (e) {
        e.preventDefault();
        $('.chat .chat-list').removeClass('toggled');
        $(this).closest('.chat').toggleClass('toggled');
    });
    /* --------------------------------------------------------
     Components
     -----------------------------------------------------------*/
    /* Textarea */
    $('.auto-size').autosize();

    //Select
    $('.select').selectpicker();

    //Sortable
    $('.sortable').sortable();

    //Tag Select
    $('.tag-select').chosen();

    /* Tab */
    if ($('.tab')[0]) {
        $('.tab a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
    }

    /* Collapse */
    $('.collapse').collapse();

    /* Accordion */
    $('.panel-collapse').on('shown.bs.collapse', function () {
        $(this).prev().find('.panel-title a').removeClass('active');
    }).on('hidden.bs.collapse', function () {
        $(this).prev().find('.panel-title a').addClass('active');
    });

    //Popover
    $('.pover').popover();

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
    $('.overflow').niceScroll();

    //Close when click outside
    $(document).on('mouseup touchstart', function (e) {
        var container = $('.drawer, .tm-icon');
        if (container.has(e.target).length === 0) {
            $('.drawer').removeClass('toggled');
            $('.drawer-toggle').removeClass('open');
        }


        container = $('.chat, .chat .chat-list');
        if (container.has(e.target).length === 0) {
            container.removeClass('toggled');
        }
    });
    /* --------------------------------------------------------
     Calendar - Sidebar
     -----------------------------------------------------------*/
    var sidecalendat = $('#sidebar-calendar');
    if (sidecalendat.length) {
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        sidecalendat.fullCalendar({
            editable: false,
            events: [],
            header: {
                left: 'title'
            }
        });
    }
    //Content widget
    $('#calendar-widget').fullCalendar({
        header: {
            left: 'title',
            right: 'prev, next'
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
     Form Validation
     -----------------------------------------------------------*/
    var _validation = $(".form-validation");
    if (_validation.length) {
        _validation.validationEngine();
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
    $('.color-picker-rgb').colorpicker({
        format: 'rgb'
    });
    //RGBA
    $('.color-picker-rgba').colorpicker({
        format: 'rgba'
    });

    //Output Color
    color_picker.colorpicker().on('changeColor', function (e) {
        $(this).closest('.color-pick').find('.color-preview').css('background', e.color.toHex());
    });
    /* --------------------------------------------------------
     Date Time Picker
     -----------------------------------------------------------*/
    //Date Only
    $('.date-only').datetimepicker({
        pickTime: false
    });
    //Time only
    $('.time-only').datetimepicker({
        pickDate: false
    });
    //12 Hour Time
    $('.time-only-12').datetimepicker({
        pickDate: false,
        pick12HourFormat: true
    });
    $('.datetime-pick input:text').on('click', function () {
        $(this).closest('.datetime-pick').find('.add-on i').click();
    });

    /* --------------------------------------------------------
     Input Slider
     -----------------------------------------------------------*/
    $('.input-slider').slider().on('slide', function (ev) {
        $(this).closest('.slider-container').find('.slider-value').val(ev.value);
    });
    /* --------------------------------------------------------
     WYSIWYE Editor + Markedown
     -----------------------------------------------------------*/
    //Markedown
    $('.markdown-editor').markdown({
        autofocus: false,
        savable: false
    });
    //WYSIWYE Editor
    $('.wysiwye-editor').summernote({
        height: 200
    });
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
    var tabVertical = $('.tab-vertical');
    if(tabVertical.length){
        tabVertical.each(function () {
            var tabHeight = $(this).outerHeight();
            var tabContentHeight = $(this).closest('.tab-container').find('.tab-content').outerHeight();

            if ((tabContentHeight) > (tabHeight)) {
                $(this).height(tabContentHeight);
            }
        });
        tabVertical.find("li").on('click touchstart',function () {
            tabVertical.height('auto');

            var tabHeight = tabVertical.outerHeight();
            var tabContentHeight = $(this).closest('.tab-container').find('.tab-content').outerHeight();

            if ((tabContentHeight) > (tabHeight)) {
                tabVertical.height(tabContentHeight);
            }
        });
        // docbody.on('click touchstart', '.tab-vertical li', function () {
        //     var tabVertical = $(this).closest('.tab-vertical');
        //     tabVertical.height('auto');
        //
        //     var tabHeight = tabVertical.outerHeight();
        //     var tabContentHeight = $(this).closest('.tab-container').find('.tab-content').outerHeight();
        //
        //     if ((tabContentHeight) > (tabHeight)) {
        //         tabVertical.height(tabContentHeight);
        //     }
        // });
    }




    /* --------------------------------------------------------
     Checkbox + Radio
     -----------------------------------------------------------*/
    if ($('input:checkbox, input:radio').length) {
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
    var _d = document.getElementById("date");
    if(_d) _d.innerHTML = dayNames[newDate.getDay()] + " " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear();

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
    $('.tooltips').tooltip();

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
