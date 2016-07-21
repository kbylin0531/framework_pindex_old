$(document).ready(function () {
    var docbody = $("body");
    var sidebar  = $('#sidebar');
    var v;//template var

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

    //Sortable
    if((v = $('.sortable')).length) v.sortable();


    /* Tab */
    if ($('.tab')[0]) {
        $('.tab a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
    }

    /* Collapse */
    if((v = $('.collapse')).length) v.collapse();

    /* Accordion */
    $('.panel-collapse').on('shown.bs.collapse', function () {
        $(this).prev().find('.panel-title a').removeClass('active');
    }).on('hidden.bs.collapse', function () {
        $(this).prev().find('.panel-title a').addClass('active');
    });

    //Popover
    // if((v = $('.pover')).length) v.popover();

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
    if((v = $('#calendar-widget')).length) v.fullCalendar({
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
    }




    /* --------------------------------------------------------
     Checkbox + Radio
     -----------------------------------------------------------*/
    // if ($('input:checkbox, input:radio').length) {
    //     //Checkbox + Radio skin
    //     $('input:checkbox:not([data-toggle="buttons"] input, .make-switch input), input:radio:not([data-toggle="buttons"] input)').iCheck({
    //         checkboxClass: 'icheckbox_minimal',
    //         radioClass: 'iradio_minimal',
    //         increaseArea: '20%' // optional
    //     });

        //Checkbox listing
        // $('.list-parent-check').on('ifChecked', function () {
        //     $(this).closest('.list-container').find('.list-check').iCheck('check');
        // }).on('ifClicked', function () {
        //     $(this).closest('.list-container').find('.list-check').iCheck('uncheck');
        // });
        //
        // $('.list-check').on('ifChecked', function () {
        //     var parent = $(this).closest('.list-container').find('.list-parent-check');
        //     var thisCheck = $(this).closest('.list-container').find('.list-check');
        //     var thisChecked = $(this).closest('.list-container').find('.list-check:checked');
        //
        //     if (thisCheck.length == thisChecked.length) {
        //         parent.iCheck('check');
        //     }
        // }).on('ifUnchecked', function () {
        //     var parent = $(this).closest('.list-container').find('.list-parent-check');
        //     parent.iCheck('uncheck');
        // }).on('ifChanged', function () {
        //     var thisChecked = $(this).closest('.list-container').find('.list-check:checked');
        //     var showon = $(this).closest('.list-container').find('.show-on');
        //     if (thisChecked.length > 0) {
        //         showon.show();
        //     }
        //     else {
        //         showon.hide();
        //     }
        // });
    // }

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

    var sec,min,hour;
    if(sec = document.getElementById("sec")){/* it will be null if not found */
        min = document.getElementById("min");
        hour = document.getElementById("hours");
        setInterval(function () {
            var date = new Date();
            var seconds = date.getSeconds();
            var minutes = date.getMinutes();
            var hours = date.getHours();
            sec.innerHTML =  seconds < 10 ? "0"+seconds : seconds;
            min.innerHTML =  minutes < 10 ? "0"+minutes : minutes;
            hour.innerHTML =  hours < 10 ? "0"+hours : hours ;
        }, 1000);
    }

    /* --------------------------------------------------------
     Tooltips - based on bootstrap
     -----------------------------------------------------------*/
    // $('.tooltips').tooltip();

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




//-------------------------------- plugins ------------------------------------------------------------------------//
// place of replacement suggest in <p id="..."></p>
L.P.jsMap({
    'input_mask':'/js/input-mask.min.js',
    'chosen':'/js/chosen.min.js',
    'select':'/js/select.min.js',
    'autosize':'/js/autosize.min.js',
    'datetimepicker':'/js/datetimepicker.min.js',
    'fileupload':'/js/fileupload.min.js',
    'colorpicker':'/js/colorpicker.min.js',
    'spinner':'/js/spinner.min.js',
    'wysiwyg':'/js/editor2.min.js',
    'markdown':'/js/markdown.min.js',
    'iCheck':['/js/icheck.js','/js/toggler.min.js'],
    'slider':'/js/slider.min.js'
});
//components - no plugin reply
L.alert = {
    _alert:null,
    _alert_t:0,
    clear:function () {
        this._alert_t && clearTimeout(this._alert_t);
    },
    /**
     * @param msg string
     * @param type string
     * @param icon bool
     */
    show:function (msg, type, icon) {
        type || (type = 'info');
        var html = '';
        if(icon){
            switch (type){
                case 'success':
                    html = '<i class="icon">&#61845;</i>';
                    break;
                case 'warning':
                    html = '<i class="icon">&#61730;</i>';
                    break;
                case 'danger':
                    html = '<i class="icon">&#61907;</i>';
                    break;
                case 'info':
                default:
                    html = '<i class="icon">&#61770;</i>';//info
            }
            icon = 'alert-icon';
        }else{
            icon = '';
        }

        var env = this;
        if(!this._alert){
            this._alert = $('<div class="block-area"><div class="alert alert-'+type+' '+icon+'">'+msg+html+'</div></div>');
            $(".container").prepend(this._alert);
            this._alert.click(function () {
                env._alert.fadeOut();
            });
        }else{
            this.clear();
            this._alert.css("display","").find(".alert").attr("class","alert alert-"+type+' '+icon).html(msg+html);
        }
        this._alert_t = setTimeout(function () {
            env._alert.fadeOut();
        },2000)
    },
    success:function (msg, icon) { this.show(msg,'success', icon);},
    info:function (msg, icon) { this.show(msg,'info', icon);},
    warning:function (msg, icon) { this.show(msg,'warning', icon);},
    danger:function (msg, icon) { this.show(msg,'danger', icon);}
};
L.list = {
    /**
     * @param title List title
     * @param colspan sum of columns
     * @returns {L.list}
     */
    create:function (title,colspan) {
        title = title?'<h4 class="m-l-5">'+title+'</h4>':'';
        colspan = colspan?colspan:12;
        var instance = L.NS(this);
        instance.target = $('<div class="col-md-'+colspan+'">'+title+'<div class="listview narrow"></div></div>');
        return instance;
    },
    load:function (data) {
        if(this.target){
            var html = '';
            var profile = '',time = '';
            for(var i = 0;i < data.length; i++){
                profile = ('profile' in data[i])?'<div class="pull-left"><img width="40" src="'+data[i].profile+'" alt=""></div>':'';
                time = ('time' in data[i])?'<div class="media-body"><small class="text-muted">'+data[i].time+'</small><br>':'';
                html += '<div class="media p-l-5">'+profile+time+'<a class="overflow" href="">'+data[i].content+'</a></div></div>';
            }
            this.target.find(".listview").html(html);
        }else{
            console.log('No target!');
        }
        return this;
    },
    //some bug to fix
    prepend:function (data) {
        if(this.target){
            var profile = ('profile' in data)?'<div class="pull-left"><img width="40" src="'+data.profile+'" alt=""></div>':'';
            var time = ('time' in data)?'<div class="media-body"><small class="text-muted">'+data.time+'</small><br>':'';
            var html ='<div class="media p-l-5">'+profile+time+'<a class="overflow" href="">'+data.content+'</a></div></div>';
            this.target.find(".listview").prepend(html);
        }else{
            console.log('No target!');
        }
        return this;
    },
    outerHTML:function () {
        if(this.target){
            return this.target.prop("outerHTML");
        }else{
            console.log('No target!');
            return null;
        }
    }
};
L.pane = {
    create:function (items,append,isv) {
        var tabs = '';
        var tabpanes = '';
        for(var i = 0 ;i < items.length;i++){
            if(0 === i){
                tabs += '<li><a href="#'+items[i].id+'">'+items[i].title+'</a></li>';
            }else{
                tabs += '<li><a href="#'+items[i].id+'">'+items[i].title+'</a></li>';
            }
            var raw = $("#"+items[i].id);
            tabpanes += '<div class="tab-pane" id="'+items[i].id+'">'+raw.html()+'</div>';
            raw.remove();
        }
        var cls_c = 'tab-container tile';
        var cls_u = 'nav tab nav-tabs';
        var cls_b = 'tab-content';
        if(isv){
            cls_c += " media";
            cls_u += " pull-left tab-vertical";
            cls_b += " media-body";
        }

        var html = $('<div class="'+cls_c+'"><ul class="'+cls_u+'">'+tabs+'</ul><div class="'+cls_b+'">'+tabpanes+'</div></div>');

        L.jq(append).after(html).remove();
        setTimeout(function () {
            html.find("li:first>a").trigger("click")
        },167);
    }
};
L.accordion = {
    create:function (items,id) {
        var html = '<div class="accordion tile"><div class="panel-group block" id="'+id+'">';
        for(var i = 0 ;i < items.length;i++) {
            var tg = L.jq("#"+items[i].id);
            html += '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">'+
                '<a class="accordion-toggle active" data-toggle="collapse" data-parent="'+id+'" href="#'+items[i].id+'">'+
                items[i].title+'</a></h3></div>'+
                '<div id="'+items[i].id+'" class="panel-collapse collapse in"><div class="panel-body">'+tg.html()+'</div></div></div>';
            tg.remove();
        }
        html = $(html+"</div></div>");
        L.jq("#"+id).after(html).remove();
        setTimeout(function () {
            html.find(".panel:first a").trigger("click")
        },167);
    }
};
L.tooltip = {
    /**
     *
     * @param selector
     * @param title
     * @param place left right bottom yop
     */
    init:function (selector, title, place) {
        place || (place = 'bottom');
        L.jq(selector).attr("data-toggle","tooltip").attr("data-placement",place).attr("title",title).tooltip();
    }
};
L.popover = {
    /**
     * @param selector
     * @param title
     * @param content
     * @param hover it will hover to pop over if set to true
     * @param place left right bottom yop
     */
    init:function (selector,title,content,hover,place) {
        place || (place = 'bottom');
        selector = L.jq(selector);
        hover && selector.attr("data-trigger","hover");
        selector.attr("data-toggle","popover").attr("data-placement",place).attr("title",title).attr("data-content",content).popover();
    }
};
//single plugin based
L.slider = {
    init:function (selector, option,callback) {
        L.P.initlize(selector,option,'slider','slider',callback);
    }
};
L.iCheck = {
    init:function(selector,option,callback) {
        selector = $(selector || 'input:checkbox,input:radio');
        L.P.initlize(selector,option,'iCheck','iCheck',callback);
    },
    load:function (callback) {
        L.P.loadLib('iCheck',callback);
    }
};
L.inputMask = {
    init:function (selector,option) {
        L.P.initlize(selector,option,'mask','input_mask');
    }
};
L.scroll = {
    init:function (selector) {
        L.jq(selector).niceScroll();
    }
};
L.chosen = L.tagSelect = {
    init:function (selector,option) {
        L.P.initlize(selector,option,'chosen');
    },
    /**
     * update element
     * @param selector
     * @param options
     */
    editElement:function (selector, options) {
        selector = $(selector);
        L.O.notempty("multiple",options) && selector.attr("multiple",'');
        L.O.notempty("placeholder",options) && selector.attr("data-placeholder",options.placeholder);
        if(L.O.notempty("data",options)){
            var html = '',disable;
            L.U.each(options.data,function (item) {
                disable = L.O.notempty("disabled",item)?' disabled ':'';
                html += '<option value="'+item.value+disable+'">'+item.title+'</option>';
            });
            selector.html(html);
        }
        return selector;
    }
};
//form-components
L.select = {
    init:function (selector,option) {
        L.P.initlize(selector,option,'selectpicker','select');
    },
    /**
     * @param options
     * @returns {string}
     */
    _createOpt:function (options) {
        var html = '';
        L.U.each(options,function (option) {
            if(L.O.notempty("divider" , option)){/* it will be diliver if exist in object */
                html += '<option data-divider="true">&nbsp;</option>';
            }else{
                var disable = L.O.notempty(option,"disabled")?' disabled="disabled" ':'';
                var icon = L.O.notempty("icon", option)?' data-icon="fa fa-'+option.icon+'" ':'';//just for font-awsome
                html += '<option value="'+option.value+'"'+disable+icon+'>'+option.title+'</option>';
            }
        });
        return html;
    },
    /**
     * create an selector but do not init because jquery may not loaded
     * @param config array
     * @param place selector
     * @param cls string
     */
    create:function (config, place, cls) {
        cls || (cls = "select");
        var html;
        if(L.O.notempty("multiple" , config)){
            if(L.O.notempty("multiple_top",config)){
                html = '<select class="'+cls+'" multiple data-selected-text-format="count>'+config['multiple_top']+'">';
            }else{
                html = '<select class="'+cls+'" multiple>';
            }
        }else{
            html = '<select class="'+cls+'">';
        }


        if(("options" in config) && (config.options.length)){
            var env = this;
            if(L.O.notempty("group" , config)){
                L.U.each(config.options,function (group) {
                    html += '<optgroup label="'+group.lable+'">';
                    html += env._createOpt(group.options)+'</optgroup>';
                });
            }else{
                /* config is options */
                html += this._createOpt(config.options);
            }
        }
        html = $(html+"</select>");
        if(place){
            place = L.jq(place);
            place.after(html).remove();//place it after and delete self
        }
        return html;
    }
};
L.autosize = {
    init:function (selector,option) {
        L.P.initlize(selector,option,'autosize');
    }
};
L.datetimepicker = {
    init:function (selector,option) {
        L.P.initlize((selector || {
            '.date-only': {pickTime: false},
            '.time-only': {pickDate: false},
            '.datetime': {}
        }),option,'datetimepicker');
    },
    /**
     *
     * @param name
     * @param place_id
     * @param format 0 date 1 time
     */
    create:function (name,place_id,format) {
        var clsnm = '';
        switch (parseInt(format || 0)){
            case 2:
                clsnm = 'datetime';
                format = 'yyyy/MM/dd hh:mm:ss';
                break;
            case 1:
                clsnm  = 'date-only';
                format = 'yyyy/MM/dd';
                break;
            case 0:
            default:
                clsnm = 'time-only';
                format = 'hh:mm:ss';
        }
        var html = '<div class="input-icon datetime-pick '+clsnm+'"><input data-format="'+format+'" name="'+name+'" type="text" class="form-control input-sm"/><span class="add-on"><i class="sa-plus"></i></span></div>';
        L.jq("#"+place_id).after($(html)).remove();
    }
};
L.colorpicker = {
    /**
     * output color
     $(".color-picker").colorpicker().on('changeColor', function (e) {e.color.toHex();}
     */
    init:function (selector,option) {
        L.P.initlize((selector || {
            '.color-picker-hex':{},
            '.color-picker-rgb':{format: 'rgb'},
            '.color-picker-rgba':{format: 'rgba'}
        }),option,'colorpicker');

        //Output Color
        $(".colorpicker").on('changeColor', function (e) {
            $(this).closest('.color-pick').find('.color-preview').css('background', e.color.toHex());
        });
    },
    /**
     * @param name
     * @param place_id
     * @param type  'rgb' 'rgba' 'hex'
     */
    create:function (name,place_id,type) {
        if(!type){
            type = 'color-picker color-picker-hex';
        }else{
            type = 'color-picker color-picker-'+type;
        }
        var html = '<div class="color-pick input-icon">' +
            '<input class="form-control colorpicker '+type+' input-sm" type="text" name="'+name+'" />'+
            '<span class="color-preview"></span><span class="add-on"><i class="sa-plus"></i></span></div>';
        L.jq("#"+place_id).after($(html)).remove();
    }
};
L.fileupload = {
    init: function (id, option, style) {
        var env = this;
        L.load(L.P.jsMap('fileupload'), 'js', function () {
            if (L.O.isObj(id)) {
                L.U.each(id, function (config, _id) {
                    option = L.O.notempty("option", config) ? config.option : null;
                    style = L.O.notempty("style", config) ? config.style : 0;
                    env._initItem(_id, option, style);
                });
            } else {
                style || (style = 0);
                env._initItem(id, option, style);
            }
        });
    },
    _initItem: function (id, option, style) {
        var st = L.O.notempty("select", option) ? option['select'] : 'Select file';
        var ct = L.O.notempty("change", option) ? option['change'] : 'Change';
        var rt = L.O.notempty("remove", option) ? option['remove'] : 'Remove';
        var common = '<span class="btn btn-file btn-alt btn-sm"><span class="fileupload-new">' + st + '</span><span class="fileupload-exists">' + ct + '</span><input type="file" name="' + id + '" id="' + id + '" />';
        var html;
        switch (parseInt(style || 0)) {
            //small image preview
            case 2:
                html = '<div class="fileupload fileupload-new" data-provides="fileupload">' +
                    '<div class="fileupload-new thumbnail small form-control m-r-5"></div>' +
                    '<div class="fileupload-preview form-control fileupload-exists thumbnail small"></div>' + common +
                    '</span><a href="#" class="btn-sm btn fileupload-exists" data-dismiss="fileupload">' + rt + '</a></div>';
                break;
            //big image preview
            case 1:
                html =
                    '<div class="fileupload fileupload-new" data-provides="fileupload">' +
                    '<div class="fileupload-preview thumbnail form-control"></div><div>' + common +
                    '</span><a href="#" class="btn fileupload-exists btn-sm" data-dismiss="fileupload">' + rt + '</a></div></div>';
                break;
            //sample
            case 0:
            default:
                html =
                    '<div class="fileupload fileupload-new" data-provides="fileupload">' + common +
                    '</span><span class="fileupload-preview p-l-5"></span>' +
                    '<a href="#" class="close close-pic fileupload-exists" data-dismiss="fileupload">' +
                    '<i class="fa fa-times"></i></a></div>';

        }
        L.jq("#" + id).after($(html)).remove();
    }
};
/**
 *
 //Basic
 $('.spinner-1').spinedit();

 //Set Value
 $('.spinner-2').spinedit('setValue', 100);

 //Set Minimum
 $('.spinner-3').spinedit('setMinimum', -10);

 //Set Maximum
 $('.spinner-4').spinedit('setMaxmum', 100);

 //Set Step
 $('.spinner-5').spinedit('setStep', 10);

 //Set Number Of Decimals
 $('.spinner-6').spinedit('setNumberOfDecimals', 2);
 * @type {{init: L.spinedit.init}}
 */
L.spinedit = {
    init:function (selector, option) {
        L.P.initlize(selector,option,'spinedit','spinner');
    }
};
/**
 * What You See Is What You Get
 * @type {{init: L.wysiwyg.init, create: L.wysiwyg.create}}
 */
L.wysiwyg = {
    /***
     * @param selector
     * @param option
     * @returns {*|jQuery|HTMLElement} return selector of jquery
     */
    init:function (selector, option) {
        selector = $((selector || '.wysiwye-editor'));
        L.P.initlize(selector,option,'summernote','wysiwyg');
        return selector;
    },
    create:function (option, place_id) {
        var html = $('<div class="wysiwye-editor"></div>');
        $("#"+place_id).after(html).remove();
        return html;
    },
    getCode:function (selector) {
        return selector.code();
    }
};
L.markdown = {
    /**
     * HTML:<textarea class="markdown-editor" id="markdown" name="content" rows="10"></textarea>
     * @param selector
     * @param option
     */
    init:function (selector, option) {
        L.P.initlize(selector,option,'markdown','markdown');
    }
};

