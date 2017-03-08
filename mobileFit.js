/**
 * Created by zhouzechen on 17/3/7.
 */
(function (host) {

    var _defaultOption = {
        size: 750,
        matchSize: 750
    };

    function updateViewport(options) {
        var size = options.size;
        if (document.body.clientWidth <= options.matchSize) {
            var DEFAULT_WIDTH = size,
                ua = navigator.userAgent.toLowerCase(),
                deviceWidth = window.screen.width,
                devicePixelRatio = window.devicePixelRatio || 1,
                targetDensitydpi;
            //Android4.0以下手机不支持viewport的width，需要设置target-densitydpi
            if (ua.indexOf("android") !== -1 && parseFloat(ua.slice(ua.indexOf("android") + 8)) < 4) {
                targetDensitydpi = DEFAULT_WIDTH / deviceWidth * devicePixelRatio * 160;
                setVPMetaContent('target-densitydpi=' + targetDensitydpi + ',width=device-width,user-scalable=no');
            } else {
                setVPMetaContent('width=' + DEFAULT_WIDTH + ',user-scalable=no,target-densitydpi=device-dpi');
            }
        } else {
            setVPMetaContent('width=device-width,user-scalable=no,scale=1');
        }
    }

    function getVPMeta() {
        var vpm = document.querySelector('meta[name="viewport"]');
        if (!vpm) {
            vpm = document.createElement('meta');
            vpm.setAttribute('name', 'viewport');
            var head = document.head;
            if (!head) {
                head = document.createElement('head');
                head.insertBefore(document.firstChild);
            }
            head.appendChild(vpm);
        }

        return vpm;
    }

    function setVPMetaContent(content) {
        var vpm = getVPMeta();
        vpm.setAttribute('content', content);
    }

    function addListener(target, eventname, callback) {
        if (typeof target.addEventListener != "undefined") {
            target.addEventListener(eventname, callback, false);
        } else {
            target.attachEvent("on" + eventname, callback)
        }
    }

    function removeListener(target, eventname, callback) {
        if (typeof target.removeEventListener != "undefined") {
            target.removeEventListener(eventname, callback, false);
        } else {
            target.detachEvent("on" + eventname, callback)
        }
    }

    function extendOptions(uOp) {
        var ops = _defaultOption;
        if (uOp.size) {
            ops.size = uOp.size;
        }
        if (uOp.matchSize && uOp.matchSize > ops.size) {
            ops.matchSize = uOp.matchSize;
        } else {
            ops.matchSize = ops.size;
        }

        return ops;
    }


    host.mobileFit = {
        fit: function (sizeOrOption) {
            var option = _defaultOption;
            if ('number' === typeof sizeOrOption) {
                option = extendOptions({
                    size: sizeOrOption
                });
            } else if ('object' != typeof sizeOrOption) {
                option = extendOptions(sizeOrOption);
            }
            updateViewport(option);
        },
        autoFit: function (sizeOrOption) {
            var option = _defaultOption;
            if ('number' === typeof sizeOrOption) {
                option = extendOptions({
                    size: sizeOrOption
                });
            } else if ('object' != typeof sizeOrOption) {
                option = extendOptions(sizeOrOption);
            }

            var fitFunc = function () {
                updateViewport(option);
            };

            fitFunc();
            removeListener(window, 'resize', fitFunc);
            addListener(window, 'resize', fitFunc);
        }
    };


})(window);



