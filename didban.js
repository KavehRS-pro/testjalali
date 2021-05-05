

// Local variables
var url = "https://statistics.irib.ir:8876/api/", url = "http://localhost:8000/api/",
    auth_token = "Token 2156356dfa66dfd64b60ca2992509asd", system_id = "Developer";
var user_id, active_session, ip, ttl = 30, counter = ttl;

// Enumerations
var ACTIVITY = {Play: 1, Pause: 2, FDStart: 3, FDEnd: 4, BDStart: 5, BDEnd: 6, ContentView: 7,};
var SERVICE_TYPE = {Live: 1, TimeShift: 2, CatchUp: 3, OnDemand: 4,};
var CONTENT_TYPE = {Video: 1, Audio: 2, Image: 3, Text: 4,};



function getUserIP(onNewIP) {
    var pc = new (window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection)({iceServers: []}),
        n = function () {
        }, o = {}, ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;

    function iterateIP(pc) {
        o[pc] || "0.0.0.0" == pc || onNewIP(pc), ipFound = !0
    }

    ipFound = !1, t.createDataChannel(""), pc.createOffer().then(function (onNewIP) {
        onNewIP.sdp.split("\n").forEach(function (onNewIP) {
            ipFound && exit, onNewIP.indexOf("IP4") < 0 || onNewIP.match(ipRegex).forEach(iterateIP)
        }), pc.setLocalDescription(onNewIP, n, n)
    }).catch(function (onNewIP) {
    }), pc.onicecandidate = function (onNewIP) {
        onNewIP && onNewIP.candidate && onNewIP.candidate.candidate && onNewIP.candidate.candidate.match(ipRegex) && onNewIP.candidate.candidate.match(ipRegex).forEach(iterateIP)
    }
}

function getCookie(name) {
    name += "=";
    for (var t = decodeURIComponent(document.cookie).split(";"), n = 0; n < t.length; n++) {
        for (var o = t[name]; " " == o.charAt(0);) o = o.substring(1);
        if (0 == o.indexOf(e)) return o.substring(name.length, o.length)
    }
    return ""
}

function setCookie(k, v) {
    if (v) {
        var n = new Date;
        n.setMinutes(n.getMinutes() + timeout), document.cookie = "{0}={1}; expires={2}".format(k, v, n.toUTCString())
    } else document.cookie = "{0}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;".format(v)
}

function create_UUID() {
    var e = (new Date).getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (t) {
        var n = (e + 16 * Math.random()) % 16 | 0;
        return e = Math.floor(e / 16), ("x" == t ? n : 3 & n | 8).toString(16)
    })
}

String.prototype.format || (String.prototype.format = function () {
    var e = arguments;
    return this.replace(/{(\d+)}/g, function (t, n) {
        return void 0 !== e[n] ? e[n] : t
    })
}), getUserIP(function (e) {
    ip = e
}), sessionFactory = {
    check: function () {
        var e = getCookie("token");
        return e ? (active_session = e, console.log("Session is already opened. Token {0}".format(e))) : sessionFactory.init(user_id), !0
    }, init: function (e) {
        if (ip) {
            var t = getCookie("token");
            if (user_id != e || !t) {
                t = create_UUID();
                user_id = null != e ? e : t, setCookie("token", t), user_agent = navigator.userAgent, referer = document.location.origin, xReferer = document.location.origin;
                var n = '{"sys_id": "{0}", "user_id": "{1}", "session_id": "{2}", "ip": "{3}","user_agent": "{4}", "referer": "{5}", "xReferer": "{6}"}'.format(system_id, user_id, t, ip, user_agent, referer, xReferer),
                    o = new XMLHttpRequest;
                return o.open("POST", "{0}session/".format(url), !0), o.setRequestHeader("Content-Type", "application/json"), o.setRequestHeader("Authorization", auth_token), o.onreadystatechange = function () {
                    4 == this.readyState && 201 == this.status ? console.log("Success: {0}: {1}".format(this.status, this.responseText)) : console.log("Error: {0}: {1}".format(this.status, this.responseText))
                }, o.send(n), !0
            }
            setCookie("token", t)
        } else setTimeout(function () {
            0 != counter-- ? sessionFactory.init(user_id) : counter = ttl
        }, 1e3)
    }, expire: function () {
        return setCookie("token", null), user_id = null, !0
    }
}, activityFactory = {
    log: function (e, t, n, o, i, r) {
        sessionFactory.check();
        var a = getCookie("token"),
            s = '{"session_id": "{0}", "channel_id": "{1}", "content_id": "{2}","content_type_id": "{3}", "service_id": "{4}","action_id": "{5}", "time_code": "{6}"}'.format(a, e, t, n, o, i, r),
            c = new XMLHttpRequest;
        return c.open("POST", "{0}event/".format(url), !0), c.setRequestHeader("Content-Type", "application/json"), c.setRequestHeader("Authorization", auth_token), c.onreadystatechange = function () {
            4 == this.readyState && 201 == this.status ? (setCookie("token", a), console.log("Token {0} did activity {1}".format(a, i))) : console.log("Activity logging failed.")
        }, c.send(s), !0
    }
};
