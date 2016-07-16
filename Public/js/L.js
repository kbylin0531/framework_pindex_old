/**
 * Created by linzh on 2016/6/30.
 * 不支持IE8及以下的浏览器
 *  ① querySelector() 方法仅仅返回匹配指定选择器的第一个元素。如果你需要返回所有的元素，请使用 querySelectorAll() 方法替代。
 */
window.L = (function () {
    //开启严格模式节约时间
    "use strict";
    var options = {
        //公共资源的URL路径
        'public_url': '',
        //自动加载路径
        'auto_url': '',
        //debug模式
        debug_on: true,
        //hex output format. 0 - lowercase; 1 - uppercase
        hexcase: 0,
        //bits per input character. 8 - ASCII; 16 - Unicode};
        chrsz: 8
    };
    /**
     * ready stack
     * @type {Array}
     * @private
     */
    var _rs = [];
    /**
     * 加载的类库
     * @type {Array}
     * @private
     */
    var _lib = [];

    //常见的兼容性问题处理
    (function () {
        //处理console对象缺失
        !window.console && (window.console = (function () {
            var c = {};
            c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {
            };
            return c;
        })());
        //解决IE8不支持indexOf方法的问题
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function (elt) {
                var len = this.length >>> 0;
                var from = Number(arguments[1]) || 0;
                from = (from < 0) ? Math.ceil(from) : Math.floor(from);
                if (from < 0) from += len;
                for (; from < len; from++) {
                    if (from in this && this[from] === elt) return from;
                }
                return -1;
            };
        }
        if (!Array.prototype.max) {
            Array.prototype.max = function () {
                return Math.max.apply({}, this)
            };
        }
        if (!Array.prototype.min) {
            Array.prototype.min = function () {
                return Math.min.apply({}, this)
            };
        }

        if (!String.prototype.trim) {
            String.prototype.trim = function () {
                return this.replace(/(^\s*)|(\s*$)/g, '');
            };
        }
        if (!String.prototype.ltrim) {
            String.prototype.ltrim = function () {
                return this.replace(/(^\s*)/g, '');
            };
        }
        if (!String.prototype.rtrim) {
            String.prototype.rtrim = function () {
                return this.replace(/(\s*$)/g, '');
            };
        }
        if (!String.prototype.beginWith) {
            String.prototype.beginWith = function (chars) {
                return this.indexOf(chars) === 0;
            };
        }

    })();

    var gettype = function (o) {
        if (o === null) return "Null";
        if (o === undefined) return "Undefined";
        return Object.prototype.toString.call(o).slice(8, -1);
    };
    var clone = function (obj) {
        // Handle the 3 simple types, and null or undefined
        // "number," "string," "boolean," "object," "function," 和 "undefined"
        //null 本身就是一个空的对象
        if (!obj || "object" !== typeof obj) return obj;
        var copy = null;
        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            var len = obj.length;
            for (var i = 0; i < len; ++i) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    };
    var sha1 = (function () {
        /**
         * The standard SHA1 needs the input string to fit into a block
         * This function align the input string to meet the requirement
         */
        var AlignSHA1 = function (str) {
            var nblk = ((str.length + 8) >> 6) + 1, blks = new Array(nblk * 16);
            for (var i = 0; i < nblk * 16; i++) blks[i] = 0;
            for (i = 0; i < str.length; i++) blks[i >> 2] |= str.charCodeAt(i) << (24 - (i & 3) * 8);
            blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);
            blks[nblk * 16 - 1] = str.length * 8;
            return blks;
        };
        /**
         * Bitwise rotate a 32-bit number to the left.
         * 32位二进制数循环左移
         */
        var rol = function (num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        };

        /**
         * Calculate the SHA-1 of an array of big-endian words, and a bit length
         */
        var core_sha1 = function (blockArray) {
            var x = blockArray; // append padding
            var w = new Array(80);
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
            var e = -1009589776;
            for (var i = 0; i < x.length; i += 16) {// 每次处理512位 16*32
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                var olde = e;
                for (var j = 0; j < 80; j++) {// 对每个512位进行80步操作
                    if (j < 16) w[j] = x[i + j];
                    else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                    var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
                    e = d;
                    d = c;
                    c = rol(b, 30);
                    b = a;
                    a = t;
                }
                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
                e = safe_add(e, olde);
            }
            return [a, b, c, d, e];
        };

        /**
         * Convert an array of big-endian words to a hex string.
         */
        var binb2hex = function (binarray) {
            var hex_tab = options.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
            return str;
        };

        /**
         * Perform the appropriate triplet combination function for the current
         * iteration
         * 返回对应F函数的值
         */
        var sha1_ft = function (t, b, c, d) {
            if (t < 20) return (b & c) | ((~b) & d);
            if (t < 40)  return b ^ c ^ d;
            if (t < 60) return (b & c) | (b & d) | (c & d);
            return b ^ c ^ d; // t<80
        };
        /**
         * Determine the appropriate additive constant for the current iteration
         * 返回对应的Kt值
         */
        var sha1_kt = function (t) {
            return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
        };
        /**
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         * 将32位数拆成高16位和低16位分别进行相加，从而实现 MOD 2^32 的加法
         */
        var safe_add = function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        };

        return (function (s) {
            return binb2hex(core_sha1(AlignSHA1(s)));
        });
    })();
    var md5 = (function () {

        var rotateLeft = function (lValue, iShiftBits) {
            var a = lValue << iShiftBits;
            var b = lValue >>> (32 - iShiftBits);
            return a | b;
        };
        var addUnsigned = function (lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            var c = lX4 & lY4;
            if (c) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            var v = 0;
            c = lX4 | lY4;
            if (c) {
                c = lResult & 0x40000000;
                if (c) {
                    v = (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    v = (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                v = (lResult ^ lX8 ^ lY8);
            }
            return v;
        };
        var f = function (x, y, z) {
            return (x & y) | ((~x) & z);
        };
        var g = function (x, y, z) {
            return (x & z) | (y & (~z));
        };
        var h = function (x, y, z) {
            return (x ^ y ^ z);
        };
        var i = function (x, y, z) {
            return (y ^ (x | (~z)));
        };
        var FF = function (a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        var GG = function (a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        var HH = function (a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        var II = function (a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(i(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };
        /**
         *
         * @param str string
         * @returns {Array}
         * @constructor
         */
        var convertToWordArray = function (str) {
            var lWordCount;
            var lMessageLength = str.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = new Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };
        var wordToHex = function (lValue) {
            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };
        var utf8Encode = function (str) {
            str = str.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < str.length; n++) {
                var c = str.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        };

        return (function (str) {
            var k, AA, BB, CC, DD, a, b, c, d;
            var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
            var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
            var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
            var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
            str = utf8Encode(str);
            var x = convertToWordArray(str);
            a = 0x67452301;
            b = 0xEFCDAB89;
            c = 0x98BADCFE;
            d = 0x10325476;
            for (k = 0; k < x.length; k += 16) {
                AA = a;
                BB = b;
                CC = c;
                DD = d;
                a = FF(a, b, c, d, x[k], S11, 0xD76AA478);
                d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                b = GG(b, c, d, a, x[k], S24, 0xE9B6C7AA);
                a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                d = HH(d, a, b, c, x[k], S32, 0xEAA127FA);
                c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                a = II(a, b, c, d, x[k], S41, 0xF4292244);
                d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                a = addUnsigned(a, AA);
                b = addUnsigned(b, BB);
                c = addUnsigned(c, CC);
                d = addUnsigned(d, DD);
            }
            var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
            return temp.toLowerCase();
        });
    })();
    var _pathen = function (path) {
        if ((path.length > 4) && (path.substr(0, 4) !== 'http')) {
            if (!options['public_url']) options['public_url'] = '/';//throw "Public uri not defined!";
            path = options['public_url'] + path;
        }
        return path;
    };
    var guid = function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        return s.join("");
    };
    var jq = function (selector) {
        if (typeof selector == "undefined") {
            //get version of jquery,it will return 0 if not exist
            return (typeof jQuery == "undefined") ? 0 : $().jquery;
        }
        return (selector instanceof $) ? selector : $(selector);
    };

    /**
     *
     * environment
     * @type Object
     */
    var E = {
        /**
         * get the hash of uri
         * @returns {string}
         */
        getHash: function () {
            if (!location.hash) return "";
            var hash = location.hash;
            var index = hash.indexOf('#');
            if (index >= 0) hash = hash.substring(index + 1);
            return "" + hash;
        },
        /**
         * get script path
         * there are some diffrence between domain access(virtual machine) and ip access of href
         * domian   :http://192.168.1.29:8085/edu/Public/admin.php/Admin/System/Menu/PageManagement#dsds
         * ip       :http://edu.kbylin.com:8085/admin.php/Admin/System/Menu/PageManagement#dsds
         * what we should do is SPLIT '.php' from href
         * ps:location.hash
         */
        getBaseUri: function () {
            var href = location.href;
            var index = href.indexOf('.php');
            if (index > 0) {//exist
                return href.substring(0, index + 4);
            } else {
                if (location.origin) {
                    return location.origin;
                } else {
                    return location.protocol + "//" + location.host;
                }
            }
        },
        /**
         * 跳转到指定的链接地址
         * 增加检查url是否合法
         * @param url
         */
        redirect: function (url) {
            location.href = url;
        },
        //获得可视区域的大小
        getViewPort: function () {
            var win = window;
            var type = 'inner';
            if (!('innerWidth' in window)) {
                type = 'client';
                win = document.documentElement ? document.documentElement : document.body;
            }
            return {
                width: win[type + 'Width'],
                height: win[type + 'Height']
            };
        },
        //获取浏览器信息 返回如 Object {type: "Chrome", version: "50.0.2661.94"}
        getBrowserInfo: function () {
            var v, tom = {}, ret = {}; //用户返回的对象
            var ua = navigator.userAgent.toLowerCase();
            (v = ua.match(/msie ([\d.]+)/)) ? tom.ie = v[1] :
                (v = ua.match(/firefox\/([\d.]+)/)) ? tom.firefox = v[1] :
                    (v = ua.match(/chrome\/([\d.]+)/)) ? tom.chrome = v[1] :
                        (v = ua.match(/opera.([\d.]+)/)) ? tom.opera = v[1] :
                            (v = ua.match(/version\/([\d.]+).*safari/)) ? tom.safari = v[1] : 0;
            if (tom.ie) {
                ret.type = "ie";
                ret.version = parseInt(tom.ie);
            } else if (tom.firefox) {
                ret.type = "firefox";
                ret.version = parseInt(tom.firefox);
            } else if (tom.chrome) {
                ret.type = "chrome";
                ret.version = parseInt(tom.chrome);
            } else if (tom.opera) {
                ret.type = "opera";
                ret.version = parseInt(tom.opera);
            } else if (tom.safari) {
                ret.type = "safari";
                ret.version = parseInt(tom.safari);
            } else {
                ret.type = ret.version = "unknown";
            }
            return ret;
        },
        /**
         * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符,年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
         * @param fmt
         * @returns {*}
         */
        date: function (fmt) { //author: meizz
            if (!fmt) fmt = "yyyy-MM-dd hh:mm:ss.S";//2006-07-02 08:09:04.423
            var o = {
                "M+": this.getMonth() + 1,                 //月份
                "d+": this.getDate(),                    //日
                "h+": this.getHours(),                   //小时
                "m+": this.getMinutes(),                 //分
                "s+": this.getSeconds(),                 //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds()             //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) {
                if (!o.hasOwnProperty(k)) continue;
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
            return fmt;
        },
        ieVersion: function () {
            var version;
            if (version = navigator.userAgent.toLowerCase().match(/msie ([\d.]+)/)) version = parseInt(version[1]);
            else version = 12;//如果是其他浏览器，默认判断为版本12
            return version;
        }
    };
    /**
     * Object
     * @type {{}}
     */
    var O = {
        /**
         * 判断是否是Object类的实例,也可以指定参数二来判断是否是某一个类的实例
         * 例如:isObj({}) 得到 [object Object] isObj([]) 得到 [object Array]
         * @param obj
         * @param clsnm
         * @returns {boolean}
         */
        isObj: function (obj, clsnm) {
            if (undefined === clsnm) {
                return obj instanceof Object;
            }
            return Object.prototype.toString.call(obj) === '[object ' + clsnm + ']';
        },
        /**
         * 判断一个元素是否是数组
         * @param el
         * @returns {boolean}
         */
        isArr: function (el) {
            return Object.prototype.toString.call(el) === '[object Array]';
        },
        /**
         * 判断元素是否是一个函数
         * @param el
         * @returns {boolean}
         */
        isFunc: function (el) {
            return '[object Function]' === Object.prototype.toString.call(el);
        },
        /**
         * 检查对象是否有指定的属性
         * @param obj {{}}
         * @param prop 属性数组
         * @return int 返回1表示全部属性都拥有,返回0表示全部都没有,部分有的情况下返回-1
         */
        prop: function (obj, prop) {
            if (!this.isArr(prop)) prop = [prop];
            var count = 0;
            for (var i = 0; i < prop.length; i++) {
                if (obj.hasOwnProperty(prop[i])) count++;
            }
            if (count === prop.length) return 1;
            else if (count === 0) return 0;
            else return -1;
        }
    };
    /**
     * Utils
     * @type object
     */
    var U = {
        /**
         * PHP中的parse_url 的javascript实现
         * @param str json字符串
         * @returns {Object}
         */
        parseUrl: function (str) {
            var obj = {};
            if (!str) return obj;

            str = decodeURI(str);
            var arr = str.split("&");
            for (var i = 0; i < arr.length; i++) {
                var d = arr[i].split("=");
                obj[d[0]] = d[1] ? d[1] : '';
            }
            return obj;
        },
        //注意安全性问题,并不推荐使用
        toObj: function (s) {
            if (s instanceof Object) return s;
            /* 已经是对象的清空下直接返回 */
            return eval("(" + s + ")");//将括号内的表达式转化为对象而不是作为语句来处理
        },
        /**
         * 遍历对象
         * @param obj {{}|[]} 待遍历的对象或者数组
         * @param ic 返回
         * @param od other data
         */
        each: function (obj, ic, od) {
            var result = undefined;
            if (O.isArr(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    result = ic(obj[i], i, od);
                    if (result === '[break]') break;
                    if (result === '[continue]') continue;
                    if (result !== undefined) return result;//如果返回了什么东西解释实际返回了，当然除了命令外
                }
            } else if (O.isObj(obj)) {
                for (var key in obj) {
                    if (!obj.hasOwnProperty(key)) continue;
                    result = ic(obj[key], key, od);
                    if (result === '[break]') break;
                    if (result === '[continue]') continue;
                    if (result !== undefined) return result;
                }
            } else {
                console.log(obj, " is not an object or array,continue!");
            }
        },
        /**
         * 停止事件冒泡
         * 如果提供了事件对象，则这是一个非IE浏览器,因此它支持W3C的stopPropagation()方法
         * 否则，我们需要使用IE的方式来取消事件冒泡
         * @param e
         */
        stopBubble: function (e) {
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                window.event.cancelBubble = true;
            }
        },
        /**
         * 阻止事件默认行为
         * 阻止默认浏览器动作(W3C)
         * IE中阻止函数器默认动作的方式
         * @param e
         * @returns {boolean}
         */
        stopDefault: function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            } else {
                window.event.returnValue = false;
            }
            return false;
        }
    };
    /**
     * DOM
     * @type {{}}
     */
    var D = {
        /**
         * 检查dom对象是否存在指定的类名称
         * @param obj
         * @param cls
         * @returns {Array|{index: number, input: string}}
         */
        hasClass: function (obj, cls) {
            return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        },
        /**
         * 添加类
         * @param obj
         * @param cls
         */
        addClass: function (obj, cls) {
            if (!this.hasClass(obj, cls)) obj.className += " " + cls;
        },
        /**
         * 删除类
         * @param obj
         * @param cls
         */
        removeClass: function (obj, cls) {
            if (this.hasClass(obj, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                obj.className = obj.className.replace(reg, ' ');
            }
        },
        /**
         * 逆转类
         * @param obj
         * @param cls
         */
        toggleClass: function (obj, cls) {
            if (this.hasClass(obj, cls)) {
                this.removeClass(obj, cls);
            } else {
                this.addClass(obj, cls);
            }
        },
        //支持多个类名的查找 http://www.cnblogs.com/rubylouvre/archive/2009/07/24/1529640.html
        getElementsByClassName: function (cls, ele) {
            var list = (ele || document).getElementsByTagName('*');
            var ele = [];

            for (var i = 0; i < list.length; i++) {
                var child = list[i];
                var classNames = child.className.split(' ');
                for (var j = 0; j < classNames.length; j++) {
                    if (classNames[j] == cls) {
                        ele.push(child);
                        break;
                    }
                }
            }
            return ele;
        },
        setOpacity: function (ele, opa) {
            if (ele.style.opacity != undefined) {
                ///兼容FF和GG和新版本IE
                ele.style.opacity = opa / 100;
            } else {
                ///兼容老版本ie
                ele.style.filter = "alpha(opacity=" + opa + ")";
            }
        },
        fadein: function (ele, opa, speed) {
            if (ele) {
                var v = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity;
                (v < 1) && (v *= 100);
                var c = speed / 1000;//count
                var avg = c < 2 ? (opa / c) : (opa / c - 1);
                var timer = null;
                timer = setInterval(function () {
                    if (v < opa) {
                        v += avg;
                        this.setOpacity(ele, v);
                    } else {
                        clearInterval(timer);
                    }
                }, 500);
            }
        },
        fadeout: function (ele, opa, speed) {
            if (ele) {
                var v = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity || 100;
                v < 1 && (v *= 100);
                var c = speed / 1000;//count
                var avg = (100 - opa) / c;
                var timer = null;
                timer = setInterval(function () {
                    if (v - avg > opa) {
                        v -= avg;
                        this.setOpacity(ele, v);
                    } else {
                        clearInterval(timer);
                    }
                }, 500);
            }
        }
    };


    //监听窗口状态变化
    window.document.onreadystatechange = function () {
        if (window.document.readyState === "complete") {
            for (var i = 0; i < _rs.length; i++) (_rs[i])();
        }
    };

    return {
        jq: jq,
        sha1: sha1,//sha1加密
        md5: md5,//md5加密
        guid: guid,//随机获取一个GUID
        clone: clone,
        //load resource for page
        load: function (path, type) {
            if (typeof path === 'object') {
                for (var x in path) {
                    if (!path.hasOwnProperty(x)) continue;
                    this.load(path[x]);
                }
            } else {
                if (undefined === type) {
                    var t = path.substring(path.length - 3);//根据后缀自动判断类型
//                    console.log(path.substring(path.length-3));
                    switch (t) {
                        case 'css':
                            type = 'css';
                            break;
                        case '.js':
                            type = 'js';
                            break;
                        case 'ico':
                            type = 'ico';
                            break;
                        default:
                            throw "加载了错误的类型'" + t + "',加载的类型必须是[css,js,ico]";
                    }
                }
                //本页面加载过将不再重新载入
                for (var i = 0; i < _lib.length; i++) if (_lib[i] === path) return;
                //现仅仅支持css,js,ico的类型
                switch (type) {
                    case 'css':
                        document.write('<link href="' + _pathen(path) + '" rel="stylesheet" type="text/css" />');
                        break;
                    case 'js':
                        document.write('<script src="' + _pathen(path) + '"  /></script>');
                        break;
                    case 'ico':
                        document.write('<link rel="shortcut icon" href="' + _pathen(path) + '" />');
                        break;
                    default:
                        return;
                }
                //记录已经加载过的
                _lib.push(path);
            }
            return this;
        },
        cookie: {
            /**
             * set cookie
             * @param name
             * @param value
             * @param expire
             * @param path
             */
            set: function (name, value, expire, path) {
                // console.log(name, value, expire,path);
                path = ";path=" + (path ? path : '/');// all will access if not set the path
                var cookie;
                if (undefined === expire || false === expire) {
                    //set or modified the cookie, and it will be remove while leave from browser
                    cookie = name + "=" + value;
                } else if (!isNaN(expire)) {// is numeric
                    var _date = new Date();//current time
                    if (expire > 0) {
                        _date.setTime(_date.getTime() + expire);//count as millisecond
                    } else if (expire === 0) {
                        _date.setDate(_date.getDate() + 365);//expire after an year
                    } else {
                        //delete cookie while expire < 0
                        _date.setDate(_date.getDate() - 1);//expire after an year
                    }
                    cookie = name + "=" + value + ";expires=" + _date.toUTCString();
                } else {
                    console.log([name, value, expire, path], "expect 'expire' to be false/undefined/numeric !");
                }
                document.cookie = cookie + path;
            },
            //get a cookie with a name
            get: function (name) {
                if (document.cookie.length > 0) {
                    var cstart = document.cookie.indexOf(name + "=");
                    if (cstart >= 0) {
                        cstart = cstart + name.length + 1;
                        var cend = document.cookie.indexOf(';', cstart);//begin from the index of param 2
                        (-1 === cend) && (cend = document.cookie.length);
                        return document.cookie.substring(cstart, cend);
                    }
                }
                return "";
            }
        },
        //init self or used as an common tool
        init: function (config, target) {
            if (!target) target = options;
            U.each(config, function (item, key) {
                target.hasOwnProperty(key) && (target[key] = item);
            });
            return this;
        },
        E: E,//environment
        U: U,//utils
        D: D,//dom
        O: O,
        /**
         * new element
         * @param exp express
         * @param ih innerHTML
         * @returns {Element}
         * @constructor
         */
        NE: function (exp, ih) {
            var tagname = exp, clses, id;
            if (exp.indexOf('.') > 0) {
                clses = exp.split(".");
                exp = clses.shift();
            }
            if (exp.indexOf("#") > 0) {
                var tempid = exp.split("#");
                tagname = tempid[0];
                id = tempid[1];
            } else {
                tagname = exp
            }
            var element = document.createElement(tagname);
            id && element.setAttribute('id', id);
            if (clses) {
                var ct = '';
                for (var i = 0; i < clses.length; i++) {
                    ct += clses[i];
                    if (i !== clses.length - 1)  ct += ",";
                }
                element.setAttribute('class', ct);
            }
            if (ih) element.innerHTML = ih;
            return element;
        },//新建一个DOM元素
        //new self
        NS: function (context) {
            var Y = function () {
                return {target: null};
            };
            var instance = new Y();
            if (context) {
                U.each(context, function (item, key) {
                    instance[key] = item;
                });
            }
            return instance;
        },//获取一个单例的操作对象作为上下文环境的深度拷贝
        /**
         * @param c callback
         */
        ready: function (c) {
            _rs.push(c);
        },
        //plugins
        P: {
            _cm: null,
            contextmenu: function () {
                if (!this._cm) {
                    if (L.jq() && ("contextmenu" in $)) {
                        this._cm = {
                            /**
                             * create a menu-handler object
                             * @param menus format like "[{'index':'edit','title':'Edit'}]"
                             * @param handler callback while click the context menu item
                             * @param onItem
                             * @param before
                             */
                            create: function (menus, handler, onItem, before) {
                                var ul, id = 'cm_' + L.guid(), cm = $("<div id='" + id + "'></div>"), flag = false, ns = L.NS(this);
                                $("body").prepend(cm.append(ul = $("<ul class='dropdown-menu' role='menu'></ul>")));
                                //菜单项
                                U.each(menus, function (group) {
                                    flag && ul.append($('<li class="divider"></li>'));//对象之间划割
                                    U.each(group, function (value, key) {
                                        ul.append('<li><a tabindex="' + key + '">' + value + '</a></li>');
                                    });
                                    flag = true;
                                });

                                before || (before = function (e, c) {
                                });
                                onItem || (onItem = function (c, e) {
                                });
                                handler || (handler = function (element, tabindex, text) {
                                });

                                //这里的target的上下文意思是 公共配置组
                                ns.target = {
                                    target: '#' + id,
                                    // execute on menu item selection
                                    onItem: function (ele, event) {
                                        onItem(ele, event);
                                        var target = event.target;
                                        handler(target, target.getAttribute('tabindex'), target.innerText);
                                    },
                                    // execute code before context menu if shown
                                    before: before
                                };
                                return ns;
                            },
                            bind: function (jq) {
                                L.jq(jq).contextmenu(this.target);
                            }
                        };
                    } else {
                        console.warn("plugin of 'contextmenu' or 'jquery' not found!");
                    }
                }
                return this._cm;
            },
            _dt: null,
            datatable: function () {
                if (!this._dt) {
                    if(!L.jq()){
                        console.warn("plugin of 'jquery' not found!");
                    }else if("DataTable" in $){
                        console.warn("plugin of 'DataTable' not found!");
                    }else{
                        this._dt = {
                            api: null,//datatable的API对象
                            ele: null, // datatable的jquery对象 dtElement
                            cr: null,//当前操作的行,可能是一群行 current_row
                            //设置之后的操作所指定的DatatableAPI对象
                            create: function (dt, opt) {
                                var ns = L.NS(this);
                                ns.target = L.jq(dt);

                                var conf = {
                                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
                                };
                                opt && L.init(opt,conf);
                                ns.api = ns.target.DataTable(conf);
                                return ns;
                            },
                            //为tableapi对象加载数据,参数二用于清空之前的数据
                            load: function (data, clear) {
                                if (this.api) {
                                    if ((undefined === clear ) || clear) this.api.clear();//clear为true或者未设置时候都会清除之前的表格内容
                                    this.api.rows.add(data).draw();
                                } else {
                                    console.log("No Datatable API binded!");
                                }
                                return this;
                            },
                            //表格发生了draw事件时设置调用函数(表格加载,翻页都会发生draw事件)
                            onDraw: function (callback) {
                                if (this.target) {
                                    this.target.on('draw.dt', function (event, settings) {
                                        callback(event, settings);
                                    });
                                } else {
                                    console.log("No Datatables binded!");
                                }
                                return this;
                            },
                            //获取表格指定行的数据
                            data: function (e) {
                                return this.api.row(this.cr = e).data();
                            },
                            /**
                             * @param nd new data
                             * @param line update row
                             * @returns {*}
                             */
                            update: function (nd, line) {
                                if (line === undefined) line = this.cr;
                                if (line) {
                                    if (L.O.isArr(line)) {
                                        for (var i = 0; i < line.length; i++) {
                                            this.update(nd, line[i]);
                                        }
                                    } else {
                                        //注意:如果出现这样的错误"DataTables warning: table id=[dtable 实际的表的ID] - Requested unknown parameter ‘acceptId’ for row X 第几行出现了错误 "
                                        this.api.row(line).data(nd).draw(false);
                                    }
                                } else {
                                    console.log('no line to update!');
                                }
                            }
                        };
                    }
                }
                return this._dt;
            },
            _md: null,
            modal: function () {
                if (!this._md) {
                    if (L.jq()) {
                        this._md = {
                            /**
                             * 创建一个Modal对象,会将HTML中指定的内容作为自己的一部分拐走
                             * @param selector 要把哪些东西添加到modal中的选择器
                             * @param opt modal配置
                             * @returns object
                             */
                            create: function (selector, opt) {
                                var config = {
                                    title: "Window",
                                    confirmText: '提交',
                                    cancelText: '取消',

                                    //确认和取消的回调函数
                                    confirm: null,
                                    cancel: null,

                                    show: null,//即将显示
                                    shown: null,//显示完毕
                                    hide: null,//即将隐藏
                                    hidden: null,//隐藏完毕

                                    backdrop: "static",
                                    keyboard: true
                                };
                                opt && L.init(opt,config);

                                var instance = L.NS(this),
                                    id = 'modal_' + L.guid(),
                                    modal = $('<div class="modal fade" id="' + id + '" aria-hidden="true" role="dialog"></div>'),
                                    dialog = $('<div class="modal-dialog"></div>'),
                                    header, content,body;

                                if (typeof config['backdrop'] !== "string") config['backdrop'] = config['backdrop'] ? 'true' : 'false';
                                $("body").append(modal.attr('data-backdrop', config['backdrop']).attr('data-keyboard', config['keyboard'] ? 'true' : 'false')) ;

                                modal.append(dialog.append(content = $('<div class="modal-content"></div>')));

                                //set header and body
                                content.append(header = $('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button></div>'))
                                    .append(body = $('<div class="modal-body"></div>').append(L.jq(selector).removeClass('hidden')));//suggest selector has class 'hidden'

                                //设置足部
                                content.append($('<div class="modal-footer"></div>').append(
                                    $('<button type="button" class="btn btn-sm _cancel" data-dismiss="modal">' + config['cancelText'] + '</button>').click(instance.cancel)
                                ).append(
                                    $('<button type="button" class="btn btn-sm _confirm">' + config['confirmText'] + '</button>').click(instance.confirm)
                                ));

                                //确认和取消事件注册
                                instance.target = modal.modal('hide');

                                config['title'] && instance.title(config['title']);
                                //事件注册
                                U.each(['show', 'shown', 'hide', 'hidden'], function (eventname) {
                                    modal.on(eventname + '.bs.modal', function () {
                                        //handle the element size change while window resizedntname,config[eventname]);
                                        config[eventname] && (config[eventname])();
                                    });
                                });
                                return instance;
                            },
                            //get the element of this.target while can not found in global jquery selector
                            getElement: function (selector){
                                return this.target.find(selector);
                            },
                            onConfirm: function (callback){
                                // var btn = this.target.find(".confirmbtn");//it worked worse ,why?
                                this.target.find("._confirm").unbind("click").click(callback);
                                return this;
                            },
                            onCancel: function (callback){
                                // this.cancel = callback;
                                this.target.find("._cancel").unbind("click").click(callback);
                                return this;
                            },
                            //update title
                            title: function (newtitle) {
                                var title = this.target.find(".modal-title");
                                if (!title.length) {
                                    var h = L.NE('h4.modal-title');
                                    h.innerHTML = newtitle;
                                    this.target.find(".modal-header").append(h);
                                }
                                title.text(newtitle);
                                return this;
                            },
                            show: function () {
                                this.target.modal('show');
                                return this;
                            },
                            hide: function () {
                                this.target.modal('hide');
                                return this;
                            }
                        };
                    } else {
                        console.warn("plugin of 'jquery' not found!");
                    }
                }
                return this._md;
            }
        },
        //variable
        V: {}//constant or config// judge
    };
})();
// 加密测试
// console.log(L.md5(L.sha1('123456')) === 'd93a5def7511da3d0f2d171d9c344e91');