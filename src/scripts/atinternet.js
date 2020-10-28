;(function () {
    var dfltPluginCfg = {}
    var dfltGlobalCfg = {
        site: 614871,
        log: '',
        logSSL: '',
        domain: 'xiti.com',
        collectDomain: 'logc412.xiti.com',
        collectDomainSSL: 'logs1412.xiti.com',
        userIdOrigin: 'server',
        pixelPath: '/hit.xiti',
        disableCookie: false,
        disableStorage: false,
        cookieSecure: true,
        cookieDomain: 'mesconseilscovid.sante.gouv.fr',
        preview: false,
        plgs: ['Page'],
        lazyLoadingPath: '',
        documentLevel: 'document',
        redirect: false,
        activateCallbacks: true,
        medium: '',
        ignoreEmptyChapterValue: true,
        base64Storage: false,
        sendHitWhenOptOut: true,
        forceHttp: false,
        requestMethod: 'GET',
        maxHitSize: 2000,
    }
    ;(function (a) {
        a.ATInternet = a.ATInternet || {}
        a.ATInternet.Tracker = a.ATInternet.Tracker || {}
        a.ATInternet.Tracker.Plugins = a.ATInternet.Tracker.Plugins || {}
    })(window)
    var Utils = function () {
        function a(d) {
            var b = typeof d
            if ('object' !== b || null === d)
                return 'string' === b && (d = '"' + d + '"'), String(d)
            var g,
                f,
                c = [],
                e = d.constructor === Array
            for (g in d)
                d.hasOwnProperty(g) &&
                    ((f = d[g]),
                    (b = typeof f),
                    'function' !== b &&
                        'undefined' !== b &&
                        ('string' === b
                            ? (f = '"' + f.replace(/[^\\]"/g, '\\"') + '"')
                            : 'object' === b && null !== f && (f = a(f)),
                        c.push((e ? '' : '"' + g + '":') + String(f))))
            return (e ? '[' : '{') + String(c) + (e ? ']' : '}')
        }
        function l(a) {
            return null === a ? '' : (a + '').replace(c, '')
        }
        function h(a) {
            var k,
                g = null
            return (a = l(a + '')) &&
                !l(
                    a.replace(b, function (a, d, b, c) {
                        k && d && (g = 0)
                        if (0 === g) return a
                        k = b || d
                        g += !c - !b
                        return ''
                    })
                )
                ? Function('return ' + a)()
                : null
        }
        var e = this,
            b = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g,
            c = RegExp(
                '^[\\x20\\t\\r\\n\\f]+|((?:^|[^\\\\])(?:\\\\.)*)[\\x20\\t\\r\\n\\f]+$',
                'g'
            )
        e.isLocalStorageAvailable = function () {
            try {
                var a = localStorage
                a.setItem('__storage_test__', '__storage_test__')
                a.removeItem('__storage_test__')
                return !0
            } catch (b) {
                return !1
            }
        }
        e.isBeaconMethodAvailable = function () {
            return window.navigator && 'function' === typeof window.navigator.sendBeacon
        }
        e.Base64 = {
            _keyStr:
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
            encode: function (a) {
                var b = '',
                    g,
                    f,
                    c,
                    q,
                    n,
                    m,
                    p = 0
                for (a = e.Base64._utf8_encode(a); p < a.length; )
                    (g = a.charCodeAt(p++)),
                        (f = a.charCodeAt(p++)),
                        (c = a.charCodeAt(p++)),
                        (q = g >> 2),
                        (g = ((g & 3) << 4) | (f >> 4)),
                        (n = ((f & 15) << 2) | (c >> 6)),
                        (m = c & 63),
                        isNaN(f) ? (n = m = 64) : isNaN(c) && (m = 64),
                        (b =
                            b +
                            this._keyStr.charAt(q) +
                            this._keyStr.charAt(g) +
                            this._keyStr.charAt(n) +
                            this._keyStr.charAt(m))
                return b
            },
            decode: function (a) {
                var b = '',
                    g,
                    f,
                    c,
                    q,
                    n,
                    m = 0
                for (a = a.replace(/[^A-Za-z0-9\+\/\=]/g, ''); m < a.length; )
                    (g = this._keyStr.indexOf(a.charAt(m++))),
                        (f = this._keyStr.indexOf(a.charAt(m++))),
                        (q = this._keyStr.indexOf(a.charAt(m++))),
                        (n = this._keyStr.indexOf(a.charAt(m++))),
                        (g = (g << 2) | (f >> 4)),
                        (f = ((f & 15) << 4) | (q >> 2)),
                        (c = ((q & 3) << 6) | n),
                        (b += String.fromCharCode(g)),
                        64 != q && (b += String.fromCharCode(f)),
                        64 != n && (b += String.fromCharCode(c))
                return (b = e.Base64._utf8_decode(b))
            },
            _utf8_encode: function (a) {
                a = a.replace(/\r\n/g, '\n')
                for (var b = '', g = 0; g < a.length; g++) {
                    var f = a.charCodeAt(g)
                    128 > f
                        ? (b += String.fromCharCode(f))
                        : (127 < f && 2048 > f
                              ? (b += String.fromCharCode((f >> 6) | 192))
                              : ((b += String.fromCharCode((f >> 12) | 224)),
                                (b += String.fromCharCode(((f >> 6) & 63) | 128))),
                          (b += String.fromCharCode((f & 63) | 128)))
                }
                return b
            },
            _utf8_decode: function (a) {
                for (var b = '', g = 0, f, c, e; g < a.length; )
                    (f = a.charCodeAt(g)),
                        128 > f
                            ? ((b += String.fromCharCode(f)), g++)
                            : 191 < f && 224 > f
                            ? ((c = a.charCodeAt(g + 1)),
                              (b += String.fromCharCode(((f & 31) << 6) | (c & 63))),
                              (g += 2))
                            : ((c = a.charCodeAt(g + 1)),
                              (e = a.charCodeAt(g + 2)),
                              (b += String.fromCharCode(
                                  ((f & 15) << 12) | ((c & 63) << 6) | (e & 63)
                              )),
                              (g += 3))
                return b
            },
        }
        e.loadScript = function (a, b) {
            var g
            b = b || function () {}
            g = document.createElement('script')
            g.type = 'text/javascript'
            g.src = a.url
            g.async = !1
            g.defer = !1
            g.onload = g.onreadystatechange = function (a) {
                a = a || window.event
                if (
                    'load' === a.type ||
                    (/loaded|complete/.test(g.readyState) &&
                        (!document.documentMode || 9 > document.documentMode))
                )
                    (g.onload = g.onreadystatechange = g.onerror = null), b(null, a)
            }
            g.onerror = function (a) {
                g.onload = g.onreadystatechange = g.onerror = null
                b({ msg: 'script not loaded', event: a })
            }
            var f = document.head || document.getElementsByTagName('head')[0]
            f.insertBefore(g, f.lastChild)
        }
        e.cloneSimpleObject = function (a, b) {
            if ('object' !== typeof a || null === a || a instanceof Date) return a
            var g = new a.constructor(),
                f
            for (f in a)
                a.hasOwnProperty(f) &&
                    (void 0 === f ||
                        (b && void 0 === a[f]) ||
                        (g[f] = e.cloneSimpleObject(a[f])))
            return g
        }
        e.isEmptyObject = function (a) {
            for (var b in a) if (a.hasOwnProperty(b)) return !1
            return !0
        }
        e.isObject = function (a) {
            return null !== a && 'object' === typeof a && !(a instanceof Array)
        }
        e.ATVALUE = '_ATVALUE'
        e.ATPREFIX = '_ATPREFIX'
        e.object2Flatten = function (a, b, g, f, c) {
            var q = {},
                n = '',
                m = '',
                p = [],
                h = '',
                s = 0,
                t
            for (t in a)
                if (a.hasOwnProperty(t))
                    if (
                        ((q = e.splitProtocolAndKey(t, c)),
                        (n = q.prefix || f || ''),
                        (m = (b ? b + '_' : '') + q.key),
                        e.isObject(a[t]))
                    )
                        e.object2Flatten(a[t], m, g, n, c)
                    else {
                        p = m.split('_')
                        h = ''
                        for (s = 0; s < p.length; s++)
                            (q = e.splitProtocolAndKey(p[s], c)),
                                (n = q.prefix || n),
                                (h += q.key + (s < p.length - 1 ? '_' : ''))
                        m = h || m
                        g[m] = g[m] || {}
                        g[m][e.ATVALUE] = a[t]
                        g[m][e.ATPREFIX] = n
                    }
        }
        e.flatten2Object = function (a, b, g) {
            b = b.split('_')
            var f, c
            for (c = 0; c < b.length - 1; c++)
                (f = b[c]), a[f] || (a[f] = {}), (a = a[f])
            if (a.hasOwnProperty(e.ATVALUE)) {
                f = a[e.ATVALUE]
                var q = a[e.ATPREFIX]
                delete a[e.ATVALUE]
                delete a[e.ATPREFIX]
                a.$ = {}
                a.$[e.ATVALUE] = f
                a.$[e.ATPREFIX] = q
            }
            g = e.cloneSimpleObject(g)
            a[b[c]] ? (a[b[c]].$ = g) : (a[b[c]] = g)
        }
        e.getFormattedObject = function (a) {
            var b = {},
                c,
                f
            for (f in a)
                a.hasOwnProperty(f) &&
                    (a[f].hasOwnProperty(e.ATVALUE)
                        ? ((c = a[f][e.ATPREFIX] ? a[f][e.ATPREFIX] + ':' + f : f),
                          (b[c] = a[f][e.ATVALUE]))
                        : (b[f] = e.getFormattedObject(a[f])))
            return b
        }
        e.completeFstLevelObj = function (a, b, c) {
            if (a) {
                if (b)
                    for (var f in b)
                        !b.hasOwnProperty(f) || (a[f] && !c) || (a[f] = b[f])
            } else a = b
            return a
        }
        e.getObjectKeys = function (a) {
            var b = [],
                c
            for (c in a) a.hasOwnProperty(c) && b.push(c)
            return b
        }
        e.objectToLowercase = function (a) {
            var b = {},
                c
            for (c in a)
                a.hasOwnProperty(c) &&
                    (e.isObject(a[c])
                        ? (b[c.toLowerCase()] = e.objectToLowercase(a[c]))
                        : (b[c.toLowerCase()] = a[c]))
            return b
        }
        e.splitProtocolAndKey = function (a, b) {
            var c, f
            2 > a.length || ':' !== a[1]
                ? ((c = ''), (f = a))
                : 4 > a.length || ':' !== a[3]
                ? ((c = a.substring(0, 1)), (f = a.substring(2, a.length)))
                : ((c = a.substring(0, 3)), (f = a.substring(4, a.length)))
            b && ((c = c.toLowerCase()), (f = f.toLowerCase()))
            return { prefix: c, key: f }
        }
        e.jsonSerialize = function (b) {
            try {
                return 'undefined' !== typeof JSON && JSON.stringify
                    ? JSON.stringify(b)
                    : a(b)
            } catch (c) {
                return null
            }
        }
        e.jsonParse = function (a) {
            try {
                return 'undefined' !== typeof JSON && JSON.parse
                    ? JSON.parse(a + '')
                    : h(a)
            } catch (b) {
                return null
            }
        }
        e.trim = function (a) {
            try {
                return String.prototype.trim
                    ? a.trim()
                    : a.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
            } catch (b) {
                return a
            }
        }
        e.arrayIndexOf = function (a, b) {
            if (Array.prototype.indexOf) {
                var c = -1
                'undefined' !== typeof a.indexOf(b) && (c = a.indexOf(b))
                return c
            }
            return function (a) {
                if (null == this) throw new TypeError()
                var b = Object(this),
                    c = b.length >>> 0
                if (0 === c) return -1
                var d = 0
                1 < arguments.length &&
                    ((d = Number(arguments[1])),
                    d != d
                        ? (d = 0)
                        : 0 != d &&
                          Infinity != d &&
                          -Infinity != d &&
                          (d = (0 < d || -1) * Math.floor(Math.abs(d))))
                if (d >= c) return -1
                for (d = 0 <= d ? d : Math.max(c - Math.abs(d), 0); d < c; d++)
                    if (d in b && b[d] === a) return d
                return -1
            }.apply(a, [b])
        }
        e.uuid = function () {
            function a(f) {
                var d = Math.random()
                c && (d = b.getRandomValues(new Uint32Array(1))[0] / Math.pow(2, 32))
                return Math.floor((9 * d + 1) * Math.pow(10, f - 1))
            }
            var b = window.crypto || window.msCrypto,
                c = null !== b && 'object' === typeof b
            return {
                v4: function () {
                    return c
                        ? ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
                              /[018]/g,
                              function (a) {
                                  return (
                                      a ^
                                      (b.getRandomValues(new Uint32Array(1))[0] &
                                          (15 >> (a / 4)))
                                  ).toString(16)
                              }
                          )
                        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
                              /[xy]/g,
                              function (a) {
                                  var b = (16 * Math.random()) | 0
                                  return ('x' === a ? b : (b & 3) | 8).toString(16)
                              }
                          )
                },
                num: function (b) {
                    var c = new Date(),
                        g = function (a) {
                            a -= 100 * Math.floor(a / 100)
                            return 10 > a ? '0' + a : String(a)
                        }
                    return (
                        g(c.getHours()) +
                        '' +
                        g(c.getMinutes()) +
                        '' +
                        g(c.getSeconds()) +
                        '' +
                        a(b - 6)
                    )
                },
            }
        }
        e.isPreview = function () {
            return window.navigator && 'preview' === window.navigator.loadPurpose
        }
        e.isPrerender = function (a) {
            var b,
                c = !1,
                f = ['webkit', 'ms']
            if ('prerender' === document.visibilityState) b = 'visibilitychange'
            else
                for (var r = 0; r < f.length; r++)
                    'prerender' === document[f[r] + 'VisibilityState'] &&
                        (b = f[r] + 'visibilitychange')
            if ('undefined' !== typeof b) {
                var q = function (c) {
                    a(c)
                    e.removeEvtListener(document, b, q)
                }
                e.addEvtListener(document, b, q)
                c = !0
            }
            return c
        }
        e.addEvtListener = function (a, b, c) {
            a.addEventListener
                ? a.addEventListener(b, c, !1)
                : a.attachEvent && a.attachEvent('on' + b, c)
        }
        e.removeEvtListener = function (a, b, c) {
            a.removeEventListener
                ? a.removeEventListener(b, c, !1)
                : a.detachEvent && a.detachEvent('on' + b, c)
        }
        e.hashcode = function (a) {
            var b = 0
            if (0 === a.length) return b
            for (var c = 0; c < a.length; c++)
                var f = a.charCodeAt(c), b = (b << 5) - b + f, b = b | 0
            return b
        }
        e.setLocation = function (a) {
            var b = a.location
            a = window[a.target] || window
            b && (a.location.href = b)
        }
        e.dispatchCallbackEvent = function (a) {
            var b
            if ('function' === typeof window.Event) b = new Event('ATCallbackEvent')
            else
                try {
                    ;(b = document.createEvent('Event')),
                        b.initEvent && b.initEvent('ATCallbackEvent', !0, !0)
                } catch (c) {}
            b &&
                'function' === typeof document.dispatchEvent &&
                ((b.name = a), document.dispatchEvent(b))
        }
        e.addCallbackEvent = function (a) {
            e.addEvtListener(document, 'ATCallbackEvent', a)
        }
        e.removeCallbackEvent = function (a) {
            e.removeEvent('ATCallbackEvent', a)
        }
        ;(function () {
            function a(b, c) {
                c = c || { bubbles: !1, cancelable: !1, detail: void 0 }
                var f
                try {
                    ;(f = document.createEvent('CustomEvent')),
                        f.initCustomEvent(b, c.bubbles, c.cancelable, c.detail)
                } catch (d) {}
                return f
            }
            'function' === typeof window.CustomEvent
                ? (window.ATCustomEvent = window.CustomEvent)
                : ('function' === typeof window.Event &&
                      (a.prototype = window.Event.prototype),
                  (window.ATCustomEvent = a))
        })()
        e.addEvent = function (a, b, c, f) {
            e[a] = new ATCustomEvent(a, { detail: { name: b, id: c } })
            e.addEvtListener(document, a, f)
        }
        e.removeEvent = function (a, b) {
            e.removeEvtListener(document, a, b)
        }
        e.dispatchEvent = function (a, b) {
            e[a] = e[a] || new ATCustomEvent(a, { detail: { name: b, id: -1 } })
            try {
                document.dispatchEvent(e[a])
            } catch (c) {}
        }
        e.privacy = new (function () {
            function a(b) {
                var c = [],
                    d = !1
                b instanceof Array
                    ? ((c = b), (d = !0))
                    : b && 'object' === typeof b && c.push(b)
                return { array: c, isArray: d }
            }
            function b(a, c, d) {
                for (var g = [], m, k = 0; k < a.length; k++)
                    if (a[k] && 'object' === typeof a[k]) {
                        var h = c
                        m = {}
                        e.object2Flatten(a[k], null, m, null, d)
                        if (h instanceof Array)
                            for (var s = 0; s < h.length; s++) delete m[h[s]]
                        else delete m[h]
                        h = {}
                        s = void 0
                        for (s in m) m.hasOwnProperty(s) && e.flatten2Object(h, s, m[s])
                        m = e.getFormattedObject(h)
                        e.isEmptyObject(m) || g.push(m)
                    }
                return g
            }
            var c = {
                storageParams: [],
                bufferParams: [],
                contextParams: [],
                propertiesParams: [],
            }
            this.CONSENTNO = 'Consent-NO'
            this.testStorageParam = function (a, b) {
                for (var d, k, m = c.storageParams.length - 1; 0 <= m; m--)
                    if (((k = c.storageParams[m]), 'string' === typeof k)) {
                        if (k === a) return { toSetInStorage: !1 }
                    } else {
                        a: {
                            d = a
                            var e = b,
                                h = void 0,
                                s = void 0
                            for (s in k)
                                if (k.hasOwnProperty(s) && d === s) {
                                    h = []
                                    k[s] instanceof Array ? (h = k[s]) : h.push(k[s])
                                    for (var t = 0; t < h.length; t++)
                                        if (s === d && h[t] === e) {
                                            d = !1
                                            break a
                                        }
                                }
                            d = !0
                        }
                        if (!d) return { toSetInStorage: !1 }
                    }
                return { toSetInStorage: !0 }
            }
            this.processStorageParams = function (a, b) {
                for (var d, k = c.storageParams.length - 1; 0 <= k; k--)
                    if (((d = c.storageParams[k]), 'string' === typeof d)) a && a(d)
                    else {
                        var m = a,
                            p = b,
                            h = void 0,
                            s = void 0
                        for (s in d)
                            if (d.hasOwnProperty(s)) {
                                h = []
                                d[s] instanceof Array ? (h = d[s]) : h.push(d[s])
                                for (var t = 0; t < h.length; t++) m && m([s, h[t]])
                                m && p && e.isEmptyObject(p(s)) && m(s)
                            }
                    }
            }
            this.testBufferParam = function (f, r) {
                var q, n
                n = r
                for (var m, p = c.bufferParams.length - 1; 0 <= p; p--)
                    if (((m = c.bufferParams[p]), 'string' === typeof m)) {
                        if (m === f) return { toSetInBuffer: !1 }
                    } else {
                        a: {
                            q = f
                            var h = void 0,
                                s = void 0,
                                s = (h = s = h = void 0)
                            for (s in m)
                                if (
                                    m.hasOwnProperty(s) &&
                                    q === s &&
                                    ((h = n),
                                    'string' === typeof h && (h = e.jsonParse(h) || h),
                                    (h = a(h)),
                                    0 < h.array.length)
                                ) {
                                    s = m[s]
                                    s = b(h.array, s, !0)
                                    0 === s.length
                                        ? ((q = !1), (n = void 0))
                                        : ((h = h.isArray ? s : s[0]) &&
                                              'object' === typeof h &&
                                              (h = e.jsonSerialize(h)),
                                          (q = !0),
                                          (n = h))
                                    break a
                                }
                            q = !0
                        }
                        if (!q) return { toSetInBuffer: !1 }
                    }
                return { toSetInBuffer: !0, value: n }
            }
            this.processBufferParams = function (f, r, h) {
                for (var n, m = c.bufferParams.length - 1; 0 <= m; m--)
                    if (((n = c.bufferParams[m]), 'string' === typeof n)) r && r(n)
                    else {
                        var p = f,
                            l = r,
                            s = h,
                            t = void 0,
                            u = void 0,
                            w = (t = void 0),
                            z = (u = w = u = void 0)
                        for (z in n)
                            n.hasOwnProperty(z) &&
                                p &&
                                ((t = p(z)),
                                'undefined' !== typeof t &&
                                    ((u = t._value),
                                    'string' === typeof u && (u = e.jsonParse(u) || u),
                                    (t = t._options),
                                    (u = a(u)),
                                    0 < u.array.length &&
                                        ((w = n[z]),
                                        (w = b(u.array, w, !0)),
                                        0 === w.length
                                            ? l && l(z)
                                            : s &&
                                              ((u = u.isArray ? w : w[0]) &&
                                                  'object' === typeof u &&
                                                  (u = e.jsonSerialize(u)),
                                              s(z, u, t)))))
                    }
            }
            this.testContextParam = function (f, e) {
                var h, n
                n = e
                for (var m, p = c.contextParams.length - 1; 0 <= p; p--)
                    if (((m = c.contextParams[p]), 'string' === typeof m)) {
                        if (m === f) return { toSetInContext: !1 }
                    } else {
                        a: {
                            h = f
                            var l = void 0,
                                s = void 0,
                                t = (s = l = void 0)
                            for (t in m)
                                if (
                                    m.hasOwnProperty(t) &&
                                    h === t &&
                                    ((s = a(n)), 0 < s.array.length)
                                )
                                    if (
                                        ((l = m[t]),
                                        (l = b(s.array, l, !1)),
                                        0 === l.length)
                                    ) {
                                        if (t === h) {
                                            h = !1
                                            n = void 0
                                            break a
                                        }
                                    } else if (((s = s.isArray ? l : l[0]), t === h)) {
                                        h = !0
                                        n = s
                                        break a
                                    }
                            h = !0
                        }
                        if (!h) return { toSetInContext: !1 }
                    }
                return { toSetInContext: !0, value: n }
            }
            this.processContextParams = function (f, e, h) {
                for (var n, m = c.contextParams.length - 1; 0 <= m; m--)
                    if (((n = c.contextParams[m]), 'string' === typeof n)) e && e(n)
                    else {
                        var p = f,
                            l = e,
                            s = h,
                            t = void 0,
                            u = void 0,
                            w = (t = u = t = void 0)
                        for (w in n)
                            n.hasOwnProperty(w) &&
                                p &&
                                ((t = p(w)),
                                (t = a(t)),
                                0 < t.array.length &&
                                    ((u = n[w]),
                                    (u = b(t.array, u, !1)),
                                    0 === u.length
                                        ? l && l(w)
                                        : s && ((t = t.isArray ? u : u[0]), s(w, t))))
                    }
            }
            this.testPropertiesParam = function (a) {
                for (var b, d = c.propertiesParams.length - 1; 0 <= d; d--)
                    if (((b = c.propertiesParams[d]), 'string' === typeof b && b === a))
                        return { toSetInProperties: !1 }
                return { toSetInProperties: !0 }
            }
            this.processPropertiesParams = function (a) {
                for (var b, d = c.propertiesParams.length - 1; 0 <= d; d--)
                    (b = c.propertiesParams[d]), 'string' === typeof b && a && a(b)
            }
            this.setParameters = function (a) {
                c = a
            }
            this.getParameters = function () {
                return c
            }
            this.resetParameters = function () {
                c = {
                    storageParams: [],
                    bufferParams: [],
                    contextParams: [],
                    propertiesParams: [],
                }
            }
        })()
        e.optedOut = null
        e.addOptOutEvent = function (a, b) {
            e.addEvent('ATOptOutEvent', 'clientsideuserid', a, b)
        }
        e.removeOptOutEvent = function (a) {
            e.removeEvent('ATOptOutEvent', a)
        }
        e.dispatchOptOutEvent = function (a) {
            e.optedOut = a
            e.dispatchEvent('ATOptOutEvent', 'clientsideuserid')
        }
        e.userOptedOut = function () {
            e.dispatchOptOutEvent(!0)
        }
        e.userOptedIn = function () {
            e.dispatchOptOutEvent(!1)
        }
        e.isOptedOut = function () {
            if (null === e.optedOut) {
                var a
                a: {
                    a = null
                    e.isLocalStorageAvailable() &&
                        (a = localStorage.getItem('atuserid'))
                    if (null === a) {
                        var b = /(?:^| )atuserid=([^;]+)/.exec(document.cookie)
                        null !== b && (a = b[1])
                    }
                    if (null !== a)
                        try {
                            a = decodeURIComponent(a)
                        } catch (c) {}
                    if (
                        a &&
                        ((a = e.jsonParse(a) || e.jsonParse(e.Base64.decode(a))),
                        null !== a)
                    ) {
                        a = 'OPT-OUT' === a.val
                        break a
                    }
                    a = !1
                }
                e.optedOut = a
            }
            return !!e.optedOut
        }
        e.consentReceived = function (a) {
            e.consent = !!a
        }
        e.consent = !0
        e.isTabOpeningAction = function (a) {
            var b = !1
            a &&
                (a.ctrlKey ||
                    a.shiftKey ||
                    a.metaKey ||
                    (a.button && 1 === a.button)) &&
                (b = !0)
            return b
        }
        e.CLICKS_REDIRECTION = 'redirection'
        e.CLICKS_FORM = 'form'
        e.CLICKS_MAILTO = 'mailto'
    }
    ATInternet.Utils = new Utils()
    var BuildManager = function (a) {
            var l = this,
                h = 0,
                e = 0,
                b = ['dz'],
                c = '',
                d = function (a, b, c, f, d, g, k) {
                    a = '&' + a + '='
                    return {
                        param: a,
                        paramSize: a.length,
                        str: b,
                        strSize: b.length,
                        truncate: c,
                        multihit: f,
                        separator: d || '',
                        encode: g,
                        last: k,
                    }
                },
                k = function (a, b) {
                    var c = '',
                        f = 0,
                        d = 0,
                        g = 0,
                        f = -1,
                        k = null,
                        e = null,
                        r
                    for (r in a)
                        a.hasOwnProperty(r) &&
                            (k = a[r]) &&
                            ((f = b - d),
                            k.last && null !== e
                                ? (e[r] = k)
                                : k.strSize + k.paramSize <= f
                                ? ((c += k.param + k.str),
                                  (d += k.paramSize + k.strSize))
                                : ((e = e || {}),
                                  (e[r] = k),
                                  k.truncate &&
                                      ((g = f - k.paramSize),
                                      k.separator &&
                                          ((f = k.str.substring(0, f)),
                                          (f = k.encode
                                              ? f.lastIndexOf(
                                                    encodeURIComponent(k.separator)
                                                )
                                              : f.lastIndexOf(k.separator)),
                                          0 < f && (g = f)),
                                      (c += k.param + k.str.substring(0, g)),
                                      (d += k.paramSize + k.str.substring(0, g).length),
                                      (e[r].str = k.str.substring(g, k.strSize)),
                                      (e[r].strSize = e[r].str.length))))
                    return [c, e]
                },
                g = function (c, f, g) {
                    var r = '',
                        h = function (c) {
                            if (c === {}) return []
                            var f = [],
                                g
                            g = {}
                            var m = !1,
                                p = void 0,
                                h,
                                s,
                                t,
                                q,
                                n,
                                l,
                                u,
                                w,
                                B = '',
                                y
                            for (y in c)
                                if (c.hasOwnProperty(y))
                                    if (
                                        ((l = n = q = t = !1),
                                        (h = c[y]._value),
                                        (s = c[y]._options || {}),
                                        'boolean' === typeof s.encode && (t = s.encode),
                                        'function' === typeof h && (h = h()),
                                        (h =
                                            h instanceof Array
                                                ? h.join(s.separator || ',')
                                                : 'object' === typeof h
                                                ? ATInternet.Utils.jsonSerialize(h)
                                                : 'undefined' === typeof h
                                                ? 'undefined'
                                                : h.toString()),
                                        t && (h = encodeURIComponent(h)),
                                        -1 < ATInternet.Utils.arrayIndexOf(b, y)
                                            ? (q = !0)
                                            : 'boolean' === typeof s.truncate &&
                                              (q = s.truncate),
                                        'boolean' === typeof s.multihit &&
                                            (n = s.multihit),
                                        'boolean' === typeof s.last && (l = s.last),
                                        (h = d(y, h, q, n, s.separator, t, l)),
                                        n)
                                    )
                                        (e -= h.paramSize + h.strSize),
                                            (B += h.param + h.str)
                                    else if (l)
                                        h.paramSize + h.strSize > e &&
                                            ((h.str = h.str.substring(
                                                0,
                                                e - h.paramSize
                                            )),
                                            (h.strSize = h.str.length)),
                                            (u = y),
                                            (w = h)
                                    else if (
                                        ((g[y] = h),
                                        g[y].paramSize + g[y].strSize > e &&
                                            !g[y].truncate)
                                    ) {
                                        a.emit('Tracker:Hit:Build:Error', {
                                            lvl: 'ERROR',
                                            msg:
                                                'Too long parameter: "' +
                                                g[y].param +
                                                '"',
                                            details: { value: g[y].str },
                                        })
                                        m = !0
                                        p = y
                                        break
                                    }
                            u && (g[u] = w)
                            g = [g, m, p, B]
                            c = g[0]
                            m = g[1]
                            r = g[3]
                            m &&
                                ((g = g[2]),
                                (c = c[g]),
                                (c.str = c.str.substring(0, e - c.paramSize)),
                                (c.strSize = c.str.length),
                                (m = {}),
                                (m.mherr = d('mherr', '1', !1, !1, '', !1, !1)),
                                (m[g] = c),
                                (c = m))
                            c = k(c, e)
                            if (null === c[1]) f = c[0]
                            else
                                for (f.push(c[0]); null !== c[1]; )
                                    (c = k(c[1], e)), f.push(c[0])
                            return f
                        },
                        t = ''
                    a.buffer.presentInFilters(f, 'hitType') ||
                        (f = a.buffer.addInFilters(f, 'hitType', ['page']))
                    f = a.buffer.addInFilters(f, 'hitType', ['all'])
                    var q, l
                    if (ATInternet.Utils.isObject(c)) {
                        f = a.buffer.addInFilters(f, 'permanent', !0)
                        f = a.buffer.get(f, !0)
                        for (q in c)
                            c.hasOwnProperty(q) &&
                                ((t = {}),
                                c[q] &&
                                'object' === typeof c[q] &&
                                c[q].hasOwnProperty('_value')
                                    ? ((l = c[q]._value),
                                      c[q].hasOwnProperty('_options') &&
                                          (t = c[q]._options))
                                    : (l = c[q]),
                                (l = ATInternet.Utils.privacy.testBufferParam(q, l)),
                                l.toSetInBuffer &&
                                    (f[q] = { _value: l.value, _options: t }))
                        t = h(f)
                    } else
                        for (q in ((f = a.buffer.get(f, !0)), (t = h(f)), f))
                            f.hasOwnProperty(q) &&
                                ((f[q]._options && f[q]._options.permanent) ||
                                    a.buffer.del(q))
                    g && g(t, r)
                }
            l.getCollectDomain = function () {
                var b = '',
                    b = a.getConfig('logSSL') || a.getConfig('log'),
                    c = a.getConfig('domain')
                return (b =
                    b && c
                        ? b + '.' + c
                        : a.getConfig('collectDomainSSL') ||
                          a.getConfig('collectDomain'))
            }
            var f = function (b) {
                    var c = '',
                        f = a.getConfig('baseURL')
                    if (f) c = f
                    else {
                        var f = l.getCollectDomain(),
                            d = a.getConfig('pixelPath'),
                            d = d || '/'
                        '/' !== d.charAt(0) && (d = '/' + d)
                        f &&
                            (c =
                                (a.getConfig('forceHttp') ? 'http://' : 'https://') +
                                f +
                                d)
                    }
                    f = a.getConfig('site')
                    c && f
                        ? b && b(null, c + '?s=' + f)
                        : b && b({ message: 'Config error' })
                },
                r = function (a, b, c) {
                    f(function (f, d) {
                        f
                            ? c && c(f)
                            : ((e = h - (d.length + 27)),
                              g(a, b, function (a, b) {
                                  var f = [],
                                      g = ATInternet.Utils.uuid().num(13)
                                  if (a instanceof Array)
                                      for (var k = 1; k <= a.length; k++)
                                          f.push(
                                              d +
                                                  b +
                                                  '&mh=' +
                                                  k +
                                                  '-' +
                                                  a.length +
                                                  '-' +
                                                  g +
                                                  a[k - 1]
                                          )
                                  else f.push(d + b + a)
                                  c && c(null, f)
                              }))
                    })
                },
                q = function (b, c, f, d, g, k, e) {
                    return (function () {
                        return function (h) {
                            a.emit(b, {
                                lvl: g,
                                details: {
                                    hit: c,
                                    method: f,
                                    event: h,
                                    isMultiHit: k,
                                    elementType: e,
                                },
                            })
                            d && d()
                        }
                    })()
                }
            l.send = function (b, c, f, d, g) {
                r(b, c, function (b, c) {
                    if (b)
                        a.emit('Tracker:Hit:Build:Error', {
                            lvl: 'ERROR',
                            msg: b.message,
                            details: {},
                        }),
                            f && f()
                    else for (var k = 0; k < c.length; k++) l.sendUrl(c[k], f, d, g)
                })
            }
            h = Math.max(a.getConfig('maxHitSize') || 0, 2e3)
            e = Math.max(a.getConfig('maxHitSize') || 0, 2e3)
            c = a.getConfig('requestMethod')
            l.sendUrl = function (b, f, d, g) {
                var k = -1 < b.indexOf('&mh=')
                d = d || c
                ATInternet.Utils.isOptedOut() && !a.getConfig('sendHitWhenOptOut')
                    ? q('Tracker:Hit:Sent:NoTrack', b, d, f, 'INFO', k, g)()
                    : 'POST' === d && ATInternet.Utils.isBeaconMethodAvailable()
                    ? ((g = 'Tracker:Hit:Sent:Error'),
                      (d = 'ERROR'),
                      window.navigator.sendBeacon(b, null) &&
                          ((g = 'Tracker:Hit:Sent:Ok'), (d = 'INFO')),
                      q(g, b, 'POST', f, d, k, '')())
                    : ((d = new Image()),
                      (d.onload = q('Tracker:Hit:Sent:Ok', b, 'GET', f, 'INFO', k, g)),
                      (d.onerror = q(
                          'Tracker:Hit:Sent:Error',
                          b,
                          'GET',
                          f,
                          'ERROR',
                          k,
                          g
                      )),
                      (d.src = b))
            }
        },
        TriggersManager = function () {
            function a(a, c, d) {
                for (var k = [], g = 0; g < a.length; g++)
                    a[g].callback(c, d), a[g].singleUse || k.push(a[g])
                return k
            }
            function l(a, c, d, k) {
                var g = a.shift()
                if ('*' === g)
                    return (
                        (c['*'] = c['*'] || []),
                        c['*'].push({ callback: d, singleUse: k }),
                        c['*'].length - 1
                    )
                if (0 === a.length) return l([g, '*'], c, d, k)
                c['*'] = c['*'] || []
                c[g] = c[g] || {}
                return l(a, c[g], d, k)
            }
            function h(b, c, d, k) {
                var g = c.shift()
                '*' !== g &&
                    (0 === c.length
                        ? h(b, [g, '*'], d, k)
                        : d[g] && ((d[g]['*'] = a(d[g]['*'], b, k)), h(b, c, d[g], k)))
            }
            var e = {}
            this.on = function (a, c, d) {
                d = d || !1
                return l(a.split(':'), e, c, d)
            }
            this.emit = function (b, c) {
                e['*'] && (e['*'] = a(e['*'], b, c))
                h(b, b.split(':'), e, c)
            }
        },
        PluginsManager = function (a) {
            var l = {},
                h = {},
                e = 0,
                b = {},
                c = 0,
                d = function (a) {
                    var b = !1
                    l[a] && (b = !0)
                    return b
                },
                k = (this.unload = function (b) {
                    d(b)
                        ? ((l[b] = void 0),
                          a.emit('Tracker:Plugin:Unload:' + b + ':Ok', { lvl: 'INFO' }))
                        : a.emit('Tracker:Plugin:Unload:' + b + ':Error', {
                              lvl: 'ERROR',
                              msg: 'not a known plugin',
                          })
                    return a
                }),
                g = (this.load = function (b, c) {
                    'function' === typeof c
                        ? 'undefined' === typeof a.getConfig.plgAllowed ||
                          0 === a.getConfig.plgAllowed.length ||
                          -1 < a.getConfig.plgAllowed.indexOf(b)
                            ? ((l[b] = new c(a)),
                              h[b] &&
                                  d(b) &&
                                  ((h[b] = !1),
                                  e--,
                                  d(b + '_ll') && k(b + '_ll'),
                                  0 === e &&
                                      a.emit('Tracker:Plugin:Lazyload:File:Complete', {
                                          lvl: 'INFO',
                                          msg: 'LazyLoading triggers are finished',
                                      })),
                              a.emit('Tracker:Plugin:Load:' + b + ':Ok', {
                                  lvl: 'INFO',
                              }))
                            : a.emit('Tracker:Plugin:Load:' + b + ':Error', {
                                  lvl: 'ERROR',
                                  msg: 'Plugin not allowed',
                                  details: {},
                              })
                        : a.emit('Tracker:Plugin:Load:' + b + ':Error', {
                              lvl: 'ERROR',
                              msg: 'not a function',
                              details: { obj: c },
                          })
                    return a
                }),
                f = (this.isLazyloading = function (a) {
                    return a ? !0 === h[a] : 0 !== e
                }),
                r = function (a) {
                    return !d(a) && !f(a) && d(a + '_ll')
                },
                q = function (b) {
                    h[b] = !0
                    e++
                    ATInternet.Utils.loadScript({
                        url: a.getConfig('lazyLoadingPath') + b + '.js',
                    })
                },
                n = function (a) {
                    return r(a) ? (q(a), !0) : !1
                },
                m = function (a) {
                    b[a] ? b[a]++ : (b[a] = 1)
                    c++
                },
                p = function (a, b, c, f) {
                    var g = null
                    b = b.split('.')
                    d(a) &&
                        l[a][b[0]] &&
                        (g =
                            1 < b.length && l[a][b[0]][b[1]]
                                ? l[a][b[0]][b[1]].apply(l[a], c)
                                : l[a][b[0]].apply(l[a], c))
                    f && f(g)
                },
                v = function (f, d, g, k) {
                    m(f)
                    a.onTrigger(
                        'Tracker:Plugin:Load:' + f + ':Ok',
                        function () {
                            p(f, d, g, function (d) {
                                b[f]--
                                c--
                                0 === c &&
                                    a.emit('Tracker:Plugin:Lazyload:Exec:Complete', {
                                        lvl: 'INFO',
                                        msg:
                                            'All exec waiting for lazyloading are done',
                                    })
                                k && k(d)
                            })
                        },
                        !0
                    )
                },
                s = function (a) {
                    for (var b = { mcount: 0, plugins: {} }, c = 0; c < a.length; c++)
                        l.hasOwnProperty(a[c]) || (b.mcount++, (b.plugins[a[c]] = !0))
                    return b
                }
            this.isExecWaitingLazyloading = function () {
                return 0 !== c
            }
            a.exec = this.exec = function (a, b, c, d) {
                r(a) ? (v(a, b, c, d), q(a)) : f(a) ? v(a, b, c, d) : p(a, b, c, d)
            }
            this.waitForDependencies = function (b, c) {
                var f = s(b)
                if (0 === f.mcount)
                    a.emit('Tracker:Plugin:Dependencies:Loaded', {
                        lvl: 'INFO',
                        details: { dependencies: b },
                    }),
                        c()
                else
                    for (var d in f.plugins)
                        f.plugins.hasOwnProperty(d) &&
                            (a.emit('Tracker:Plugin:Dependencies:Error', {
                                lvl: 'WARNING',
                                msg: 'Missing plugin ' + d,
                            }),
                            a.onTrigger(
                                'Tracker:Plugin:Load:' + d,
                                function (a, b) {
                                    var d = a.split(':'),
                                        g = d[3]
                                    'Ok' === d[4] &&
                                        ((f.plugins[g] = !1),
                                        f.mcount--,
                                        0 === f.mcount && c())
                                },
                                !0
                            ),
                            n(d))
            }
            this.init = function () {
                for (var a in ATInternet.Tracker.pluginProtos)
                    ATInternet.Tracker.pluginProtos.hasOwnProperty(a) &&
                        g(a, ATInternet.Tracker.pluginProtos[a])
            }
        },
        CallbacksManager = function (a) {
            var l = this,
                h = {},
                e = function (b) {
                    if (b.name) {
                        var c = !0,
                            d = a.getConfig('callbacks')
                        'undefined' !== typeof d &&
                            (d.include instanceof Array &&
                                -1 ===
                                    ATInternet.Utils.arrayIndexOf(d.include, b.name) &&
                                (c = !1),
                            d.exclude instanceof Array &&
                                -1 !==
                                    ATInternet.Utils.arrayIndexOf(d.exclude, b.name) &&
                                (c = !1))
                        ATInternet.Callbacks &&
                            ATInternet.Callbacks.hasOwnProperty(b.name) &&
                            ((d = {}),
                            (d[b.name] = { function: ATInternet.Callbacks[b.name] }),
                            c && l.load(b.name, d[b.name]['function']),
                            ATInternet.Tracker.callbackProtos[b.name] ||
                                (ATInternet.Tracker.callbackProtos[b.name] = d[b.name]))
                    }
                }
            l.load = function (b, c) {
                'function' === typeof c
                    ? (new c(a),
                      a.emit('Tracker:Callback:Load:' + b + ':Ok', {
                          lvl: 'INFO',
                          details: { obj: c },
                      }))
                    : a.emit('Tracker:Callback:Load:' + b + ':Error', {
                          lvl: 'ERROR',
                          msg: 'not a function',
                          details: { obj: c },
                      })
                return a
            }
            l.init = function () {
                if (a.getConfig('activateCallbacks')) {
                    var b = a.getConfig('callbacks')
                    if ('undefined' !== typeof b && b.include instanceof Array)
                        for (var c = 0; c < b.include.length; c++)
                            ATInternet.Callbacks &&
                                ATInternet.Callbacks.hasOwnProperty(b.include[c]) &&
                                ((h[b.include[c]] = {
                                    function: ATInternet.Callbacks[b.include[c]],
                                }),
                                ATInternet.Tracker.callbackProtos[b.include[c]] ||
                                    (ATInternet.Tracker.callbackProtos[b.include[c]] =
                                        h[b.include[c]]))
                    else
                        for (c in ATInternet.Callbacks)
                            ATInternet.Callbacks.hasOwnProperty(c) &&
                                ((h[c] = { function: ATInternet.Callbacks[c] }),
                                ATInternet.Tracker.callbackProtos[c] ||
                                    (ATInternet.Tracker.callbackProtos[c] = h[c]))
                    if ('undefined' !== typeof b && b.exclude instanceof Array)
                        for (c = 0; c < b.exclude.length; c++) delete h[b.exclude[c]]
                    for (var d in h)
                        h.hasOwnProperty(d) && h[d] && l.load(d, h[d]['function'])
                    ATInternet.Utils.addCallbackEvent(e)
                }
            }
            l.removeCallbackEvent = function () {
                ATInternet.Utils.removeCallbackEvent(e)
            }
        },
        BufferManager = function (a) {
            var l = this,
                h = {}
            l.set = function (a, b, k) {
                b = ATInternet.Utils.privacy.testBufferParam(a, b)
                b.toSetInBuffer &&
                    ((k = k || {}),
                    (k.hitType = k.hitType || ['page']),
                    (h[a] = { _value: b.value, _options: k }))
            }
            var e = function (a, b, k) {
                    return (a = ATInternet.Utils.cloneSimpleObject(a[b])) && !k
                        ? a._value
                        : a
                },
                b = function d(a, b) {
                    if (!(a && b instanceof Array && a instanceof Array)) return []
                    if (0 === a.length) return b
                    var f = a[0],
                        e,
                        q = [],
                        l = ATInternet.Utils.cloneSimpleObject(a)
                    l.shift()
                    for (var m = 0; m < b.length; m++)
                        if ('object' !== typeof f[1])
                            h[b[m]] && h[b[m]]._options[f[0]] === f[1] && q.push(b[m])
                        else {
                            e = f[1].length
                            for (var p = 0; p < e; p++)
                                if (
                                    h[b[m]] &&
                                    h[b[m]]._options[f[0]] instanceof Array &&
                                    0 <=
                                        ATInternet.Utils.arrayIndexOf(
                                            h[b[m]]._options[f[0]],
                                            f[1][p]
                                        )
                                ) {
                                    q.push(b[m])
                                    break
                                }
                        }
                    return d(l, q)
                }
            l.get = function (a, k) {
                var g = {}
                if ('string' === typeof a) g = e(h, a, k)
                else
                    for (
                        var f = b(a, ATInternet.Utils.getObjectKeys(h)), r = 0;
                        r < f.length;
                        r++
                    )
                        g[f[r]] = e(h, f[r], k)
                return g
            }
            l.presentInFilters = function (a, b) {
                return a && 0 !== a.length
                    ? a[0][0] === b
                        ? !0
                        : l.presentInFilters(a.slice(1), b)
                    : !1
            }
            l.addInFilters = function (a, b, g, f) {
                if (!a || 0 === a.length) return f ? [] : [[b, g]]
                var e = a[0][0],
                    h = a[0][1]
                e === b &&
                    (h instanceof Array &&
                        -1 === ATInternet.Utils.arrayIndexOf(h, g[0]) &&
                        h.push(g[0]),
                    (f = !0))
                return [[e, h]].concat(l.addInFilters(a.slice(1), b, g, f))
            }
            l.del = function (a) {
                h[a] = void 0
            }
            l.clear = function () {
                h = {}
            }
        },
        PropertiesManager = function (a) {
            var l = this,
                h = {}
            l.setProp = function (a, b, c) {
                'undefined' !== typeof a &&
                    ATInternet.Utils.privacy.testPropertiesParam(a).toSetInProperties &&
                    (h[a] = { value: b, persistent: !!c })
            }
            l.setProps = function (a, b) {
                if (ATInternet.Utils.isObject(a))
                    for (var c in a) a.hasOwnProperty(c) && l.setProp(c, a[c], b)
            }
            l.delProp = function (e, b) {
                'undefined' !== typeof h[e] && delete h[e]
                !b && a.delParam(e.toLowerCase())
            }
            l.delProps = function (a) {
                for (var b in h) h.hasOwnProperty(b) && l.delProp(b, a)
            }
            l.getProp = function (a) {
                h = h || {}
                return h[a]
            }
            l.getProps = function () {
                return h
            }
        },
        Tag = function (a, l, h) {
            l = l || {}
            var e = this
            e.version = '5.23.0'
            var b = ATInternet.Utils.cloneSimpleObject(l)
            e.triggers = new TriggersManager(e)
            e.emit = e.triggers.emit
            e.onTrigger = e.triggers.on
            var c = ATInternet.Utils.cloneSimpleObject(dfltGlobalCfg) || {},
                d
            for (d in a) a.hasOwnProperty(d) && (c[d] = a[d])
            e.getConfig = function (a) {
                return c[a]
            }
            e.setConfig = function (a, b, f) {
                ;(void 0 !== c[a] && f) ||
                    (e.emit('Tracker:Config:Set:' + a, {
                        lvl: 'INFO',
                        details: { bef: c[a], aft: b },
                    }),
                    (c[a] = b))
            }
            e.configPlugin = function (a, b, f) {
                c[a] = c[a] || {}
                for (var d in b)
                    b.hasOwnProperty(d) && void 0 === c[a][d] && (c[a][d] = b[d])
                f &&
                    (f(c[a]),
                    e.onTrigger('Tracker:Config:Set:' + a, function (a, b) {
                        f(b.details.aft)
                    }))
                return c[a]
            }
            e.getContext = function (a) {
                return b[a]
            }
            e.setContext = function (a, c) {
                e.emit('Tracker:Context:Set:' + a, {
                    lvl: 'INFO',
                    details: { bef: b[a], aft: c },
                })
                var f = ATInternet.Utils.privacy.testContextParam(a, c)
                f.toSetInContext && (b[a] = f.value)
            }
            e.delContext = function (a, c) {
                e.emit('Tracker:Context:Deleted:' + a + ':' + c, {
                    lvl: 'INFO',
                    details: { key1: a, key2: c },
                })
                if (a)
                    b.hasOwnProperty(a) &&
                        (c
                            ? b[a] && b[a].hasOwnProperty(c) && (b[a][c] = void 0)
                            : (b[a] = void 0))
                else if (c)
                    for (var f in b)
                        b.hasOwnProperty(f) &&
                            b[f] &&
                            b[f].hasOwnProperty(c) &&
                            (b[f][c] = void 0)
            }
            e.plugins = new PluginsManager(e)
            e.buffer = new BufferManager(e)
            e.setParam = e.buffer.set
            e.getParams = function (a) {
                return e.buffer.get(a, !1)
            }
            e.getParam = e.buffer.get
            e.delParam = e.buffer.del
            e.builder = new BuildManager(e)
            e.sendUrl = e.builder.sendUrl
            e.callbacks = new CallbacksManager(e)
            e.properties = new PropertiesManager(e)
            e.setProp = e.properties.setProp
            e.setProps = e.properties.setProps
            e.delProp = e.properties.delProp
            e.delProps = e.properties.delProps
            e.getProp = e.properties.getProp
            e.getProps = e.properties.getProps
            e.sendHit = function (a, b, c, d, h) {
                var l = e.getProps(),
                    m,
                    p
                for (p in l)
                    l.hasOwnProperty(p) &&
                        ((m = l[p].value),
                        l[p].persistent
                            ? e.setParam(p.toLowerCase(), m, {
                                  permanent: !0,
                                  hitType: ['all'],
                                  encode: !0,
                              })
                            : (ATInternet.Utils.isObject(a)
                                  ? (a[p.toLowerCase()] = {
                                        _value: m,
                                        _options: { hitType: ['all'], encode: !0 },
                                    })
                                  : e.setParam(p.toLowerCase(), m, {
                                        hitType: ['all'],
                                        encode: !0,
                                    }),
                              e.delProp(p, !0)))
                e.builder.send(a, b, c, d, h)
            }
            ATInternet.Utils.privacy.resetParameters()
            e.setParam(
                'ts',
                function () {
                    return new Date().getTime()
                },
                { permanent: !0, hitType: ['all'] }
            )
            ;(e.getConfig('disableCookie') || e.getConfig('disableStorage')) &&
                e.setParam('idclient', ATInternet.Utils.privacy.CONSENTNO, {
                    permanent: !0,
                    hitType: ['all'],
                })
            e.getConfig('medium') &&
                e.setParam('medium', e.getConfig('medium'), {
                    permanent: !0,
                    hitType: ['all'],
                })
            e.plugins.init()
            e.callbacks.init()
            e.emit('Tracker:Ready', {
                lvl: 'INFO',
                msg: 'Tracker initialized',
                details: { tracker: e, args: { config: a, context: l, callback: h } },
            })
            h && h(e)
            ATInternet.Tracker.instances.push(e)
        }
    ATInternet.Tracker.Tag = Tag
    ATInternet.Tracker.instances = []
    ATInternet.Tracker.pluginProtos = {}
    ATInternet.Tracker.addPlugin = function (a, l) {
        l = l || ATInternet.Tracker.Plugins[a]
        if (!ATInternet.Tracker.pluginProtos[a]) {
            ATInternet.Tracker.pluginProtos[a] = l
            for (var h = 0; h < ATInternet.Tracker.instances.length; h++)
                ATInternet.Tracker.instances[h].plugins.load(a, l)
        }
    }
    ATInternet.Tracker.delPlugin = function (a) {
        if (ATInternet.Tracker.pluginProtos[a]) {
            ATInternet.Tracker.pluginProtos[a] = void 0
            for (var l = 0; l < ATInternet.Tracker.instances.length; l++)
                ATInternet.Tracker.instances[l].plugins.unload(a)
        }
    }
    ATInternet.Tracker.callbackProtos = {}
}.call(window))
;(function () {
    var dfltPluginCfg = {}
    var dfltGlobalCfg = {}
    ATInternet.Tracker.Plugins.Utils = function (a) {
        var l = this,
            h = {}
        a.utils = {}
        a.utils.getQueryStringValue = l.getQueryStringValue = function (a, c) {
            var d = ATInternet.Utils.hashcode(c).toString()
            if (!h[d]) {
                h[d] = {}
                for (
                    var e = RegExp('[&#?]{1}([^&=#?]*)=([^&#]*)?', 'g'), g = e.exec(c);
                    null !== g;

                )
                    (h[d][g[1]] = g[2]), (g = e.exec(c))
            }
            return h[d].hasOwnProperty(a) ? h[d][a] : null
        }
        a.utils.manageChapters = l.manageChapters = function (b, c, d) {
            var e = ''
            if (b)
                for (
                    var g = a.getConfig('ignoreEmptyChapterValue'), f = '', h = 1;
                    h < parseInt(d, 10) + 1;
                    h++
                )
                    (f = b[c + h] || ''),
                        (e = g
                            ? e + (f ? f + '::' : '')
                            : e + (b.hasOwnProperty(c + h) ? f + '::' : ''))
            return e
        }
        a.utils.getDocumentLevel = l.getDocumentLevel = function () {
            var b = a.getConfig('documentLevel')
            if (b) {
                if (0 > b.indexOf('.')) return window[b] || document
                b = b.split('.')
                return window[b[0]][b[1]] || document
            }
            return document
        }
        a.utils.getLocation = l.getLocation = function () {
            return l.getDocumentLevel().location.href
        }
        a.utils.getHostName = l.getHostName = function () {
            return l.getDocumentLevel().location.hostname
        }
        a.dispatchIndex = {}
        a.dispatchStack = []
        a.dispatchEventFor = {}
        var e = 0
        a.dispatchSubscribe = function (b) {
            return a.dispatchIndex[b]
                ? !1
                : (a.dispatchStack.push(b), (a.dispatchIndex[b] = !0))
        }
        a.dispatchSubscribed = function (b) {
            return !0 === a.dispatchIndex[b]
        }
        a.addSpecificDispatchEventFor = function (b) {
            return a.dispatchEventFor[b] ? !1 : ((a.dispatchEventFor[b] = !0), e++, !0)
        }
        a.processSpecificDispatchEventFor = function (b) {
            a.dispatchEventFor[b] &&
                ((a.dispatchEventFor[b] = !1),
                e--,
                0 === e &&
                    ((a.dispatchEventFor = {}),
                    a.emit('Tracker:Plugin:SpecificEvent:Exec:Complete', {
                        lvl: 'INFO',
                    })))
        }
        a.dispatch = function (b, c) {
            var d = function () {
                    for (var d = '', e = null; 0 < a.dispatchStack.length; )
                        (d = a.dispatchStack.pop()),
                            0 === a.dispatchStack.length && (e = b),
                            a[d].onDispatch(e, c)
                    a.dispatchIndex = {}
                    a.delContext(void 0, 'customObject')
                },
                h = function () {
                    if (a.plugins.isExecWaitingLazyloading())
                        a.onTrigger(
                            'Tracker:Plugin:Lazyload:Exec:Complete',
                            function () {
                                d()
                            },
                            !0
                        )
                    else d()
                }
            if (0 === e) h()
            else
                a.onTrigger(
                    'Tracker:Plugin:SpecificEvent:Exec:Complete',
                    function () {
                        h()
                    },
                    !0
                )
        }
        a.dispatchRedirect = function (b) {
            var c = !0,
                d = '',
                e = null
            b &&
                ((e = null),
                b.hasOwnProperty('event') && (e = b.event || window.event),
                !ATInternet.Utils.isTabOpeningAction(e) &&
                    b.elem &&
                    a.plugins.exec('TechClicks', 'manageClick', [b.elem, e], function (
                        a
                    ) {
                        c = a.preservePropagation
                        d = a.elementType
                    }),
                (e = b.callback))
            a.dispatch(e, d)
            return c
        }
        a.manageSend = function (b) {
            if (!ATInternet.Utils.isPreview() || a.getConfig('preview'))
                ATInternet.Utils.isPrerender(function (a) {
                    b(a)
                }) || b()
        }
        a.processTagObject = function (b, c, d) {
            if ((b = a.getParam(b, !0)) && b._options.permanent) {
                for (var e = !1, g = b._options.hitType || [], f = 0; f < g.length; f++)
                    if (-1 !== ATInternet.Utils.arrayIndexOf(c.concat('all'), g[f])) {
                        e = !0
                        break
                    }
                e && (d = ATInternet.Utils.completeFstLevelObj(b._value || {}, d, !0))
            }
            return d
        }
        a.processContextObjectAndSendHit = function (b, c, d, e) {
            var g = {
                    hitType: c.hitType,
                    encode: c.encode,
                    separator: c.separator,
                    truncate: c.truncate,
                },
                f = a.getParam(b, !0)
            if (f) {
                for (var h = !1, l = f._options.hitType || [], n = 0; n < l.length; n++)
                    if (
                        -1 !==
                        ATInternet.Utils.arrayIndexOf(c.hitType.concat('all'), l[n])
                    ) {
                        h = !0
                        break
                    }
                h
                    ? ((h = ATInternet.Utils.cloneSimpleObject(f)),
                      (h._value = ATInternet.Utils.completeFstLevelObj(
                          h._value || {},
                          d,
                          !0
                      )),
                      a.setParam(b, h._value, g),
                      a.manageSend(function () {
                          a.sendHit(
                              null,
                              [['hitType', c.hitType]],
                              e,
                              c.requestMethod,
                              c.elementType
                          )
                      }),
                      f._options.permanent && a.setParam(b, f._value, f._options))
                    : (a.setParam(b, d, g),
                      a.manageSend(function () {
                          a.sendHit(
                              null,
                              [['hitType', c.hitType]],
                              e,
                              c.requestMethod,
                              c.elementType
                          )
                      }),
                      a.setParam(b, f._value, f._options))
            } else
                a.setParam(b, d, g),
                    a.manageSend(function () {
                        a.sendHit(
                            null,
                            [['hitType', c.hitType]],
                            e,
                            c.requestMethod,
                            c.elementType
                        )
                    })
        }
    }
    ATInternet.Tracker.addPlugin('Utils')
}.call(window))
;(function () {
    var dfltPluginCfg = {
        clicksAutoManagementEnabled: false,
        clicksAutoManagementTimeout: 500,
    }
    var dfltGlobalCfg = {}
    ATInternet.Tracker.Plugins.TechClicks = function (a) {
        var l = this,
            h = [
                'Tracker:Hit:Sent:Ok',
                'Tracker:Hit:Sent:Error',
                'Tracker:Hit:Sent:NoTrack',
            ],
            e,
            b,
            c = !1
        a.configPlugin('TechClicks', dfltPluginCfg || {}, function (a) {
            e = a.clicksAutoManagementEnabled
            b = a.clicksAutoManagementTimeout
        })
        var d = function (a) {
                if (!c)
                    switch (((c = !0), a.target)) {
                        case '_top':
                            window.top.location.href = a.url
                            break
                        case '_parent':
                            window.parent.location.href = a.url
                            break
                        default:
                            window.location.href = a.url
                    }
            },
            k = function (a) {
                a.mailto
                    ? (l.timeout = setTimeout(function () {
                          window.location.href = a.mailto
                      }, a.timeout))
                    : a.form
                    ? (l.timeout = setTimeout(function () {
                          a.form.submit()
                      }, a.timeout))
                    : a.url &&
                      (l.timeout = setTimeout(function () {
                          d({ url: a.url, target: a.target })
                      }, a.timeout))
            },
            g = function (b) {
                for (var c = 0; c < h.length; c++)
                    a.onTrigger(h[c], function (a, c) {
                        b && b(c)
                    })
            },
            f = function (a) {
                for (var c, e = '_self'; a; ) {
                    if (a.href && 0 === a.href.indexOf('http')) {
                        c = a.href.split('"').join('\\"')
                        e = a.target ? a.target : e
                        break
                    }
                    a = a.parentNode
                }
                c &&
                    (g(function (a) {
                        a.details.isMultiHit ||
                            a.details.elementType !==
                                ATInternet.Utils.CLICKS_REDIRECTION ||
                            (l.timeout && clearTimeout(l.timeout),
                            d({ url: c, target: e }))
                    }),
                    k({ url: c, target: e, timeout: b }))
            },
            r = function (a) {
                for (var c = a; c && 'FORM' !== c.nodeName; ) c = c.parentNode
                c &&
                    (g(function (a) {
                        a.details.isMultiHit ||
                            a.details.elementType !== ATInternet.Utils.CLICKS_FORM ||
                            (l.timeout && clearTimeout(l.timeout), c.submit())
                    }),
                    k({ form: c, timeout: b }))
            },
            q = function (a) {
                for (var c = a; c && !(c.href && 0 <= c.href.indexOf('mailto:')); )
                    c = c.parentNode
                c &&
                    (g(function (a) {
                        a.details.isMultiHit ||
                            a.details.elementType !== ATInternet.Utils.CLICKS_MAILTO ||
                            (l.timeout && clearTimeout(l.timeout),
                            (window.location.href = c.href))
                    }),
                    k({ mailto: c.href, timeout: b }))
            },
            n = function (a) {
                for (var b = a; b; ) {
                    if (b.href) {
                        if (0 <= b.href.indexOf('mailto:'))
                            return ATInternet.Utils.CLICKS_MAILTO
                        if (0 === b.href.indexOf('http'))
                            return ATInternet.Utils.CLICKS_REDIRECTION
                    } else if ('FORM' === b.nodeName) {
                        var c = a
                        a = !1
                        c &&
                            ((b = c.tagName || ''),
                            (b = b.toLowerCase()),
                            'form' === b
                                ? (a = !0)
                                : ((c = c.getAttribute('type') || ''),
                                  (c = c.toLowerCase()),
                                  'button' === b
                                      ? 'reset' !== c && 'button' !== c && (a = !0)
                                      : 'input' === b && 'submit' === c && (a = !0)))
                        if (a) return ATInternet.Utils.CLICKS_FORM
                        break
                    }
                    b = b.parentNode
                }
                return ''
            }
        l.isFormSubmit = function (a) {
            for (; a; ) {
                if ('FORM' === a.nodeName) return !0
                a = a.parentNode
            }
            return !1
        }
        a.techClicks = {}
        a.techClicks.manageClick = l.manageClick = function (a, b) {
            var c = !0,
                d = ''
            if (e && a) {
                var g
                a: {
                    for (d = a; d; ) {
                        if (
                            'function' === typeof d.getAttribute &&
                            ('_blank' === d.getAttribute('target') ||
                                'no' === d.getAttribute('data-atclickmanagement'))
                        ) {
                            g = !0
                            break a
                        }
                        d = d.parentNode
                    }
                    d = a
                    g = window.location.href
                    for (var h; d; ) {
                        if (
                            (h = d.href) &&
                            0 <= h.indexOf('#') &&
                            g.substring(
                                0,
                                0 <= g.indexOf('#') ? g.indexOf('#') : g.length
                            ) === h.substring(0, h.indexOf('#'))
                        ) {
                            g = !0
                            break a
                        }
                        d = d.parentNode
                    }
                    g = !1
                }
                d = n(a)
                if (!g && d) {
                    switch (d) {
                        case ATInternet.Utils.CLICKS_MAILTO:
                            q(a)
                            c = !1
                            break
                        case ATInternet.Utils.CLICKS_FORM:
                            r(a)
                            c = !1
                            break
                        case ATInternet.Utils.CLICKS_REDIRECTION:
                            f(a), (c = !1)
                    }
                    b &&
                        ((g = b.defaultPrevented),
                        'function' === typeof b.isDefaultPrevented &&
                            (g = b.isDefaultPrevented()),
                        g || (b.preventDefault && b.preventDefault()))
                }
            }
            return { preservePropagation: c, elementType: d }
        }
        a.techClicks.deactivateAutoManagement = function () {
            e = !1
        }
    }
    ATInternet.Tracker.addPlugin('TechClicks')
}.call(window))
;(function () {
    var dfltPluginCfg = {}
    var dfltGlobalCfg = {}
    ATInternet.Tracker.Plugins.Page = function (a) {
        var l = ['pageId', 'chapterLabel', 'update'],
            h = ['pid', 'pchap', 'pidt'],
            e = ['page', 'site'],
            b = ['f', 'x'],
            c = function (b) {
                return a.utils.manageChapters(b, 'chapter', 3) + (b.name ? b.name : '')
            },
            d = function (a, b, c) {
                b ? (a = b) : a || 'undefined' === typeof c || (a = c)
                return a
            },
            k = function (a, b, c) {
                b.hasOwnProperty(c) && (a[c] = d(a[c], b[c], void 0))
            },
            g = function (c, f, d) {
                if (f)
                    for (var g = 0; g < e.length; g++)
                        if (f.hasOwnProperty(e[g]) && f[e[g]])
                            for (var h in f[e[g]])
                                f[e[g]].hasOwnProperty(h) &&
                                    (d
                                        ? (c[b[g] + h] = f[e[g]][h])
                                        : a.setParam(b[g] + h, f[e[g]][h]))
            },
            f = function (b, c, f) {
                if (c) {
                    var d = a.utils.manageChapters(c, 'chapter', 3)
                    d && (c.chapterLabel = d.replace(/::$/gi, ''))
                    for (d = 0; d < h.length; d++)
                        c.hasOwnProperty(l[d]) &&
                            (f ? (b[h[d]] = c[l[d]]) : a.setParam(h[d], c[l[d]]))
                }
            },
            r = function (b, c, f) {
                if (c && c.keywords instanceof Array) {
                    var d = c.keywords.length
                    if (0 < d) {
                        for (var e = '', g = 0; g < d; g++)
                            e += '[' + c.keywords[g] + ']' + (g < d - 1 ? '|' : '')
                        f ? (b.tag = e) : a.setParam('tag', e)
                    }
                }
            },
            q = function (b, c, f) {
                if (c) {
                    var d,
                        e = function (a) {
                            return a ? a : '0'
                        }
                    d = '' + (e(c.category1) + '-')
                    d += e(c.category2) + '-'
                    d += e(c.category3)
                    f ? (b.ptype = d) : a.setParam('ptype', d)
                }
            },
            n = function (b, c, f) {
                if (c)
                    for (var d in c)
                        c.hasOwnProperty(d) &&
                            'undefined' !== typeof c[d] &&
                            (f ? (b[d] = c[d]) : a.setParam(d, c[d]))
            }
        a.customVars = {}
        a.customVars.set = function (b) {
            var c = a.getContext('page') || {},
                f = c.customVars
            if (f) {
                if (b)
                    for (var d in b)
                        b.hasOwnProperty(d) &&
                            (f[d] = ATInternet.Utils.completeFstLevelObj(
                                f[d],
                                b[d],
                                !0
                            ))
            } else f = b
            c.customVars = f
            a.setContext('page', c)
        }
        a.dynamicLabel = {}
        a.dynamicLabel.set = function (b) {
            var c = a.getContext('page') || {}
            c.dynamicLabel = ATInternet.Utils.completeFstLevelObj(c.dynamicLabel, b, !0)
            a.setContext('page', c)
        }
        a.tags = {}
        a.tags.set = function (b) {
            var c = a.getContext('page') || {}
            c.tags = ATInternet.Utils.completeFstLevelObj(c.tags, b, !0)
            a.setContext('page', c)
        }
        a.customTreeStructure = {}
        a.customTreeStructure.set = function (b) {
            var c = a.getContext('page') || {}
            c.customTreeStructure = ATInternet.Utils.completeFstLevelObj(
                c.customTreeStructure,
                b,
                !0
            )
            a.setContext('page', c)
        }
        a.page = {}
        a.page.reset = function () {
            a.delContext('page')
        }
        a.page.set = function (b) {
            b = b || {}
            a.dispatchSubscribe('page')
            var c = a.getContext('page') || {}
            c.name = d(c.name, b.name, '')
            c.level2 = d(c.level2, b.level2, '')
            k(c, b, 'chapter1')
            k(c, b, 'chapter2')
            k(c, b, 'chapter3')
            c.customObject = ATInternet.Utils.completeFstLevelObj(
                c.customObject,
                b.customObject,
                !0
            )
            a.setContext('page', c)
        }
        a.page.send = function (b) {
            b = b || {}
            var e = !0,
                h = '',
                l = { p: c(b), s2: b.level2 || '' },
                t = b.customObject
            if (t) {
                var u = ['page'],
                    t = a.processTagObject('stc', u, t)
                l.stc = {
                    _value: ATInternet.Utils.jsonSerialize(t),
                    _options: { hitType: u, encode: !0, separator: ',', truncate: !0 },
                }
            }
            t = a.getContext('page') || {}
            t.vrn && ((l.vrn = t.vrn), a.delContext('page', 'vrn'))
            u = a.getContext('InternalSearch') || {}
            'undefined' !== typeof u.keyword &&
                ((l.mc = ATInternet.Utils.cloneSimpleObject(u.keyword)),
                'undefined' !== typeof u.resultPageNumber &&
                    (l.np = ATInternet.Utils.cloneSimpleObject(u.resultPageNumber)),
                a.delContext('InternalSearch'))
            ATInternet.Utils.isPreview() && a.getConfig('preview') && (l.pvw = 1)
            g(l, b.customVars, !0)
            f(l, b.dynamicLabel, !0)
            r(l, b.tags, !0)
            q(l, b.customTreeStructure, !0)
            u = a.getContext('campaigns') || {}
            n(l, u, !0)
            a.delContext('campaigns')
            u = null
            b && b.hasOwnProperty('event') && (u = b.event || window.event)
            !ATInternet.Utils.isTabOpeningAction(u) &&
                b.elem &&
                ((u = a.techClicks.manageClick(b.elem, u)),
                (e = u.preservePropagation),
                (h = u.elementType))
            a.manageSend(function () {
                a.sendHit(l, null, b.callback, null, h)
            })
            t.name = d(t.name, b.name, '')
            t.level2 = d(t.level2, b.level2, '')
            k(t, b, 'chapter1')
            k(t, b, 'chapter2')
            k(t, b, 'chapter3')
            a.setContext('page', t)
            return e
        }
        a.page.onDispatch = function (b, d) {
            var e = a.getContext('page') || {},
                h = a.getContext('InternalSearch') || {}
            a.setParam('p', c(e))
            a.setParam('s2', e.level2 || '')
            e.vrn && (a.setParam('vrn', e.vrn), a.delContext('page', 'vrn'))
            'undefined' !== typeof h.keyword &&
                (a.setParam('mc', ATInternet.Utils.cloneSimpleObject(h.keyword)),
                'undefined' !== typeof h.resultPageNumber &&
                    a.setParam(
                        'np',
                        ATInternet.Utils.cloneSimpleObject(h.resultPageNumber)
                    ),
                a.delContext('InternalSearch'))
            ATInternet.Utils.isPreview() &&
                a.getConfig('preview') &&
                a.setParam('pvw', 1)
            g(null, e.customVars, !1)
            f(null, e.dynamicLabel, !1)
            r(null, e.tags, !1)
            q(null, e.customTreeStructure, !1)
            h = a.getContext('campaigns') || {}
            n(null, h, !1)
            a.delContext('campaigns')
            var k = ['page']
            ;(e = e.customObject)
                ? a.processContextObjectAndSendHit(
                      'stc',
                      {
                          hitType: k,
                          encode: !0,
                          separator: ',',
                          truncate: !0,
                          elementType: d,
                      },
                      e,
                      b
                  )
                : a.manageSend(function () {
                      a.sendHit(null, [['hitType', k]], b, null, d)
                  })
        }
    }
    ATInternet.Tracker.addPlugin('Page')
}.call(window))
if (typeof window.ATInternet.onTrackerLoad === 'function') {
    window.ATInternet.onTrackerLoad()
}
