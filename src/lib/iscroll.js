/*
     * iScroll Lite base on iScroll v4.1.6 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
     * Released under MIT license, http://cubiq.org/license
     */
;
(function () {
    var n = Math,
        p = function (m) {
            return m >> 0
        },
        v = (/webkit/i).test(navigator.appVersion) ? "webkit" : (/firefox/i).test(navigator.userAgent) ? "Moz" : "opera" in window ? "O" : "",
        h = (/android/gi).test(navigator.appVersion),
        j = (/iphone|ipad/gi).test(navigator.appVersion),
        k = (/playbook/gi).test(navigator.appVersion),
        l = (/hp-tablet/gi).test(navigator.appVersion),
        d = "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix(),
        e = "ontouchstart" in window && !l,
        f = v + "Transform" in document.documentElement.style,
        g = j || k,
        q = (function () {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (m) {
                return setTimeout(m, 17)
            }
        })(),
        b = (function () {
            return window.cancelRequestAnimationFrame || window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout
        })(),
        r = "onorientationchange" in window ? "orientationchange" : "resize",
        s = e ? "touchstart" : "mousedown",
        o = e ? "touchmove" : "mousemove",
        c = e ? "touchend" : "mouseup",
        a = e ? "touchcancel" : "mouseup",
        u = "translate" + (d ? "3d(" : "("),
        t = d ? ",0)" : ")",
        i = function (w, y) {
            var z = this,
                m = document,
                x;
            z.wrapper = typeof w == "object" ? w : m.getElementById(w);
            z.wrapper.style.overflow = "hidden";
            z.scroller = z.wrapper.children[0];
            z.options = {
                hScroll: true,
                vScroll: true,
                x: 0,
                y: 0,
                bounce: true,
                bounceLock: false,
                momentum: true,
                lockDirection: true,
                useTransform: true,
                useTransition: false,
                onRefresh: null,
                onBeforeScrollStart: function (A) {
                    A.preventDefault()
                },
                onScrollStart: null,
                onBeforeScrollMove: null,
                onScrollMove: null,
                onBeforeScrollEnd: null,
                onScrollEnd: null,
                onTouchEnd: null,
                onDestroy: null
            };
            for (x in y) {
                z.options[x] = y[x]
            }
            z.x = z.options.x;
            z.y = z.options.y;
            z.options.useTransform = f ? z.options.useTransform : false;
            z.options.hScrollbar = z.options.hScroll && z.options.hScrollbar;
            z.options.vScrollbar = z.options.vScroll && z.options.vScrollbar;
            z.options.useTransition = g && z.options.useTransition;
            z.scroller.style[v + "TransitionProperty"] = z.options.useTransform ? "-" + v.toLowerCase() + "-transform" : "top left";
            z.scroller.style[v + "TransitionDuration"] = "0";
            z.scroller.style[v + "TransformOrigin"] = "0 0";
            if (z.options.useTransition) {
                z.scroller.style[v + "TransitionTimingFunction"] = "cubic-bezier(0.33,0.66,0.66,1)"
            }
            if (z.options.useTransform) {
                z.scroller.style[v + "Transform"] = u + z.x + "px," + z.y + "px" + t
            } else {
                z.scroller.style.cssText += ";position:absolute;top:" + z.y + "px;left:" + z.x + "px"
            }
            z.refresh();
            z._bind(r, window);
            z._bind(s);
            if (!e) {
                z._bind("mouseout", z.wrapper)
            }
        };
    i.prototype = {
        enabled: true,
        x: 0,
        y: 0,
        steps: [],
        scale: 1,
        handleEvent: function (m) {
            var w = this;
            switch (m.type) {
            case s:
                if (!e && m.button !== 0) {
                    return
                }
                w._start(m);
                break;
            case o:
                w._move(m);
                break;
            case c:
            case a:
                w._end(m);
                break;
            case r:
                w._resize();
                break;
            case "mouseout":
                w._mouseout(m);
                break;
            case "webkitTransitionEnd":
                w._transitionEnd(m);
                break
            }
        },
        _resize: function () {
            this.refresh()
        },
        _pos: function (m, w) {
            m = this.hScroll ? m : 0;
            w = this.vScroll ? w : 0;
            if (this.options.useTransform) {
                this.scroller.style[v + "Transform"] = u + m + "px," + w + "px" + t + " scale(" + this.scale + ")"
            } else {
                m = p(m);
                w = p(w);
                this.scroller.style.left = m + "px";
                this.scroller.style.top = w + "px"
            }
            this.x = m;
            this.y = w
        },
        _start: function (m) {
            var A = this,
                z = e ? m.touches[0] : m,
                w, B, C;
            if (!A.enabled) {
                return
            }
            if (A.options.onBeforeScrollStart) {
                A.options.onBeforeScrollStart.call(A, m)
            }
            if (A.options.useTransition) {
                A._transitionTime(0)
            }
            A.moved = false;
            A.animating = false;
            A.zoomed = false;
            A.distX = 0;
            A.distY = 0;
            A.absDistX = 0;
            A.absDistY = 0;
            A.dirX = 0;
            A.dirY = 0;
            if (A.options.momentum) {
                if (A.options.useTransform) {
                    w = getComputedStyle(A.scroller, null)[v + "Transform"].replace(/[^0-9-.,]/g, "").split(",");
                    B = w[4] * 1;
                    C = w[5] * 1
                } else {
                    B = getComputedStyle(A.scroller, null).left.replace(/[^0-9-]/g, "") * 1;
                    C = getComputedStyle(A.scroller, null).top.replace(/[^0-9-]/g, "") * 1
                }
                if (B != A.x || C != A.y) {
                    if (A.options.useTransition) {
                        A._unbind("webkitTransitionEnd")
                    } else {
                        b(A.aniTime)
                    }
                    A.steps = [];
                    A._pos(B, C)
                }
            }
            A.startX = A.x;
            A.startY = A.y;
            A.pointX = z.pageX;
            A.pointY = z.pageY;
            A.startTime = m.timeStamp || Date.now();
            if (A.options.onScrollStart) {
                A.options.onScrollStart.call(A, m)
            }
            A._bind(o);
            A._bind(c);
            A._bind(a)
        },
        _move: function (x) {
            var B = this,
                A = e ? x.touches[0] : x,
                m = A.pageX - B.pointX,
                w = A.pageY - B.pointY,
                y = B.x + m,
                z = B.y + w,
                C = x.timeStamp || Date.now();
            if (B.options.onBeforeScrollMove) {
                B.options.onBeforeScrollMove.call(B, x)
            }
            B.pointX = A.pageX;
            B.pointY = A.pageY;
            if (y > 0 || y < B.maxScrollX) {
                y = B.options.bounce ? B.x + (m / 2) : y >= 0 || B.maxScrollX >= 0 ? 0 : B.maxScrollX
            }
            if (z > 0 || z < B.maxScrollY) {
                z = B.options.bounce ? B.y + (w / 2) : z >= 0 || B.maxScrollY >= 0 ? 0 : B.maxScrollY
            }
            B.distX += m;
            B.distY += w;
            B.absDistX = n.abs(B.distX);
            B.absDistY = n.abs(B.distY);
            if (B.absDistX < 6 && B.absDistY < 6) {
                return
            }
            if (B.options.lockDirection) {
                if (B.absDistX > B.absDistY + 5) {
                    z = B.y;
                    w = 0
                } else {
                    if (B.absDistY > B.absDistX + 5) {
                        y = B.x;
                        m = 0
                    }
                }
            }
            B.moved = true;
            B._pos(y, z);
            B.dirX = m > 0 ? -1 : m < 0 ? 1 : 0;
            B.dirY = w > 0 ? -1 : w < 0 ? 1 : 0;
            if (C - B.startTime > 300) {
                B.startTime = C;
                B.startX = B.x;
                B.startY = B.y
            }
            if (B.options.onScrollMove) {
                B.options.onScrollMove.call(B, x)
            }
        },
        _end: function (w) {
            if (e && w.touches.length != 0) {
                return
            }
            var F = this,
                D = e ? w.changedTouches[0] : w,
                E, x, y = {
                    dist: 0,
                    time: 0
                },
                z = {
                    dist: 0,
                    time: 0
                },
                m = (w.timeStamp || Date.now()) - F.startTime,
                B = F.x,
                C = F.y,
                A;
            F._unbind(o);
            F._unbind(c);
            F._unbind(a);
            if (F.options.onBeforeScrollEnd) {
                F.options.onBeforeScrollEnd.call(F, w)
            }
            if (!F.moved) {
                if (e) {
                    E = D.target;
                    while (E.nodeType != 1) {
                        E = E.parentNode
                    }
                    if (E.tagName != "SELECT" && E.tagName != "INPUT" && E.tagName != "TEXTAREA") {
                        x = document.createEvent("MouseEvents");
                        x.initMouseEvent("click", true, true, w.view, 1, D.screenX, D.screenY, D.clientX, D.clientY, w.ctrlKey, w.altKey, w.shiftKey, w.metaKey, 0, null);
                        x._fake = true;
                        E.dispatchEvent(x)
                    }
                }
                F._resetPos(200);
                if (F.options.onTouchEnd) {
                    F.options.onTouchEnd.call(F, w)
                }
                return
            }
            if (m < 300 && F.options.momentum) {
                y = B ? F._momentum(B - F.startX, m, -F.x, F.scrollerW - F.wrapperW + F.x, F.options.bounce ? F.wrapperW : 0) : y;
                z = C ? F._momentum(C - F.startY, m, -F.y, (F.maxScrollY < 0 ? F.scrollerH - F.wrapperH + F.y : 0), F.options.bounce ? F.wrapperH : 0) : z;
                B = F.x + y.dist;
                C = F.y + z.dist;
                if ((F.x > 0 && B > 0) || (F.x < F.maxScrollX && B < F.maxScrollX)) {
                    y = {
                        dist: 0,
                        time: 0
                    }
                }
                if ((F.y > 0 && C > 0) || (F.y < F.maxScrollY && C < F.maxScrollY)) {
                    z = {
                        dist: 0,
                        time: 0
                    }
                }
            }
            if (y.dist || z.dist) {
                A = n.max(n.max(y.time, z.time), 10);
                F.scrollTo(p(B), p(C), A);
                if (F.options.onTouchEnd) {
                    F.options.onTouchEnd.call(F, w)
                }
                return
            }
            F._resetPos(200);
            if (F.options.onTouchEnd) {
                F.options.onTouchEnd.call(F, w)
            }
        },
        _resetPos: function (y) {
            var x = this,
                m = x.x >= 0 ? 0 : x.x < x.maxScrollX ? x.maxScrollX : x.x,
                w = x.y >= 0 || x.maxScrollY > 0 ? 0 : x.y < x.maxScrollY ? x.maxScrollY : x.y;
            if (m == x.x && w == x.y) {
                if (x.moved) {
                    if (x.options.onScrollEnd) {
                        x.options.onScrollEnd.call(x)
                    }
                    x.moved = false
                }
                return
            }
            x.scrollTo(m, w, y || 0)
        },
        _mouseout: function (m) {
            var w = m.relatedTarget;
            if (!w) {
                this._end(m);
                return
            }
            while (w = w.parentNode) {
                if (w == this.wrapper) {
                    return
                }
            }
            this._end(m)
        },
        _transitionEnd: function (m) {
            var w = this;
            if (m.target != w.scroller) {
                return
            }
            w._unbind("webkitTransitionEnd");
            w._startAni()
        },
        _startAni: function () {
            var B = this,
                y = B.x,
                z = B.y,
                x = Date.now(),
                A, w, m;
            if (B.animating) {
                return
            }
            if (!B.steps.length) {
                B._resetPos(400);
                return
            }
            A = B.steps.shift();
            if (A.x == y && A.y == z) {
                A.time = 0
            }
            B.animating = true;
            B.moved = true;
            if (B.options.useTransition) {
                B._transitionTime(A.time);
                B._pos(A.x, A.y);
                B.animating = false;
                if (A.time) {
                    B._bind("webkitTransitionEnd")
                } else {
                    B._resetPos(0)
                }
                return
            }
            m = function () {
                var E = Date.now(),
                    C, D;
                if (B.options.onScrollMove) {
                    B.options.onScrollMove.call(B, {
                        y: D
                    })
                }
                if (E >= x + A.time) {
                    B._pos(A.x, A.y);
                    B.animating = false;
                    if (B.options.onAnimationEnd) {
                        B.options.onAnimationEnd.call(B)
                    }
                    B._startAni();
                    return
                }
                E = (E - x) / A.time - 1;
                w = n.sqrt(1 - E * E);
                C = (A.x - y) * w + y;
                D = (A.y - z) * w + z;
                B._pos(C, D);
                if (B.animating) {
                    B.aniTime = q(m)
                }
            };
            m()
        },
        _transitionTime: function (m) {
            this.scroller.style[v + "TransitionDuration"] = m + "ms"
        },
        _momentum: function (w, E, y, x, C) {
            var m = 0.0006,
                D = n.abs(w) / E,
                z = (D * D) / (2 * m),
                A = 0,
                B = 0;
            if (w > 0 && z > y) {
                B = C / (6 / (z / D * m));
                y = y + B;
                D = D * y / z;
                z = y
            } else {
                if (w < 0 && z > x) {
                    B = C / (6 / (z / D * m));
                    x = x + B;
                    D = D * x / z;
                    z = x
                }
            }
            z = z * (w < 0 ? -1 : 1);
            A = D / m;
            return {
                dist: z,
                time: p(A)
            }
        },
        _offset: function (m) {
            var w = -m.offsetLeft,
                x = -m.offsetTop;
            while (m = m.offsetParent) {
                w -= m.offsetLeft;
                x -= m.offsetTop
            }
            return {
                left: w,
                top: x
            }
        },
        _bind: function (x, w, m) {
            (w || this.scroller).addEventListener(x, this, !!m)
        },
        _unbind: function (x, w, m) {
            (w || this.scroller).removeEventListener(x, this, !!m)
        },
        destroy: function () {
            var m = this;
            m.scroller.style[v + "Transform"] = "";
            m._unbind(r, window);
            m._unbind(s);
            m._unbind(o);
            m._unbind(c);
            m._unbind(a);
            m._unbind("mouseout", m.wrapper);
            if (m.options.useTransition) {
                m._unbind("webkitTransitionEnd")
            }
            if (m.options.onDestroy) {
                m.options.onDestroy.call(m)
            }
        },
        refresh: function () {
            var w = this,
                m;
            w.wrapperW = w.wrapper.clientWidth;
            w.wrapperH = w.wrapper.clientHeight;
            w.scrollerW = w.scroller.offsetWidth;
            w.scrollerH = w.scroller.offsetHeight;
            w.maxScrollX = w.wrapperW - w.scrollerW;
            w.maxScrollY = w.wrapperH - w.scrollerH;
            w.dirX = 0;
            w.dirY = 0;
            w.hScroll = w.options.hScroll && w.maxScrollX < 0;
            w.vScroll = w.options.vScroll && (!w.options.bounceLock && !w.hScroll || w.scrollerH > w.wrapperH);
            m = w._offset(w.wrapper);
            w.wrapperOffsetLeft = -m.left;
            w.wrapperOffsetTop = -m.top;
            w.scroller.style[v + "TransitionDuration"] = "0";
            w._resetPos(200)
        },
        scrollTo: function (D, E, C, z) {
            var B = this,
                A = D,
                m, w;
            B.stop();
            if (!A.length) {
                A = [{
                    x: D,
                    y: E,
                    time: C,
                    relative: z
                }]
            }
            for (m = 0, w = A.length; m < w; m++) {
                if (A[m].relative) {
                    A[m].x = B.x - A[m].x;
                    A[m].y = B.y - A[m].y
                }
                B.steps.push({
                    x: A[m].x,
                    y: A[m].y,
                    time: A[m].time || 0
                })
            }
            B._startAni()
        },
        scrollToElement: function (m, y) {
            var x = this,
                w;
            m = m.nodeType ? m : x.scroller.querySelector(m);
            if (!m) {
                return
            }
            w = x._offset(m);
            w.left += x.wrapperOffsetLeft;
            w.top += x.wrapperOffsetTop;
            w.left = w.left > 0 ? 0 : w.left < x.maxScrollX ? x.maxScrollX : w.left;
            w.top = w.top > 0 ? 0 : w.top < x.maxScrollY ? x.maxScrollY : w.top;
            y = y === undefined ? n.max(n.abs(w.left) * 2, n.abs(w.top) * 2) : y;
            x.scrollTo(w.left, w.top, y)
        },
        disable: function () {
            this.stop();
            this._resetPos(0);
            this.enabled = false;
            this._unbind(o);
            this._unbind(c);
            this._unbind(a)
        },
        enable: function () {
            this.enabled = true
        },
        stop: function () {
            b(this.aniTime);
            this.steps = [];
            this.moved = false;
            this.animating = false
        }
    };
    if (typeof exports !== "undefined") {
        exports.iScroll = i
    } else {
        window.iScroll = i
    }
})();