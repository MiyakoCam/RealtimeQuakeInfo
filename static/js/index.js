Cookies.remove('sudenizumu');
Cookies.remove('firstse');
Cookies.remove('lnglat');
Cookies.remove('replay_true');
Cookies.remove('replay_datetime');
Cookies.remove('replay_first');
Cookies.remove('error_times');
Cookies.remove('getinfo_play');
Cookies.remove('1report_time');
Cookies.remove('visited');

if (! navigator.cookieEnabled) {
    setTimeout(() => {
        window.location.href = "static/setting/cookie.html";
    }, 1000);
}

var map = L.map('map', {
    center: [38.575, 137.984],
    zoom: 5,
    minZoom: 2,
});
L.control.scale({ maxWidth: 150, position: 'bottomright', imperial: false }).addTo(map);  // スケールを表示
map.zoomControl.setPosition('topright');

var PolygonLayer_Style_1 = {
    "color": "#777777",
    "weight": 1,
    "opacity": 1,
    "fillColor": "#F5F5F5",
    "fillOpacity": 1,
}
/*L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
L.tileLayer("https://tile.mierune.co.jp/mierune/{z}/{x}/{y}.png",
L.tileLayer("https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png",
L.tileLayer("https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", /*y:衛星+情報 s:衛星 r:道 m:一般マップ
L.tileLayer("http://tile.stamen.com/terrain/{z}/{x}/{y}.png",
    {
        attribution: '© <a href="https://google.com/maps">Google</a>'
    }).addTo(map);
    */
/*L.vectorGrid.protobuf("https://earthquake-alert.github.io/maps/pbf_japan/pref_jma/{z}/{x}/{y}.pbf", {
    attribution: "<a href='https://github.com/koukita/2018_09_06_atumatyou' target='_blank'>この地図は地理院地図　平成30年北海道胆振東部地震 厚真川地区 正射画像をトレースした地図です</a>",
    maxNativeZoom: 14,
    minNativeZoom: 14,
    maxZoom: 18,
    rendererFactory: L.canvas.tile
  }).addTo(map);*/
map.createPane("pane_map").style.zIndex = 1; //地図
map.createPane("userpoint").style.zIndex = 8000; //ユーザー地点
map.createPane("pane_circle").style.zIndex = 9990; //P,S波
map.createPane("shingen").style.zIndex = 9999; //震源
let border; //市区町界        
$.getJSON("static/js/zenkoku.geojson", function (data) {
    border = L.geoJson(data, {
        pane: "pane_map",
        style: PolygonLayer_Style_1,
    }).addTo(map);
});
var pwave = L.circle([0, 0], {
    pane: "pane_circle",
    radius: 0,
    color: 'blue',
    fillColor: '#399ade',
    fillOpacity: 0.15,
}).addTo(map);

//s波マーカー初期化
var swave = L.circle([0, 0], {
    pane: "pane_circle",
    radius: 0,
    color: '#dc143c',
    fillColor: '#dc143c',
    fillOpacity: 0.1,
    zIndexOffset: 100,
}).addTo(map);

let settings_click = document.getElementById('settings_click');
let settings = document.getElementById('settings');
let set_closebtn = document.getElementById('set_closebtn');
var set_replay_date = document.getElementById('set_replay_date');
var set_replay_time = document.getElementById('set_replay_time');
var set_replay_start = document.getElementById('set_replay_start');
var set_replay_reset = document.getElementById('set_replay_reset');
var replay_true;
var se_eew1 = new Audio('static/sound/eew1.mp3');
var se_eew2 = new Audio('static/sound/eew2.mp3');
var Realtime;

settings_click.addEventListener("click", () => {
    settings.classList.add('display');
});
set_closebtn.addEventListener("click", () => {
    settings.classList.remove('display');
});
document.getElementById('appinfo_click').addEventListener("click", () => {
    app_infomation.classList.add('display');
});
document.getElementById('appinfo_closebtn').addEventListener("click", () => {
    app_infomation.classList.remove('display');
});
document.getElementById('faq_click').addEventListener("click", () => {
    document.getElementById('faq_table').classList.add('display');
});
document.getElementById('faq_closebtn').addEventListener("click", () => {
    document.getElementById('faq_table').classList.remove('display');
});
document.getElementById('set_eew1test').addEventListener("click", () => {
    if (!se_eew1.paused) {
        document.getElementById('set_eew1test').innerHTML = '<i class="fas fa-play"></i> 予報テスト';
        se_eew1.pause();
        se_eew1.currentTime = 0;
    } else {
        se_eew1.currentTime = 0;
        document.getElementById('set_eew1test').innerHTML = '<i class="fas fa-pause"></i> 予報テスト';
        se_eew1.play();
    }
});
se_eew1.addEventListener("ended", () => {
    se_eew1.currentTime = 0;
    document.getElementById('set_eew1test').innerHTML = '<i class="fas fa-play"></i> 予報テスト';
});
document.getElementById('set_eew2test').addEventListener("click", () => {
    if (!se_eew2.paused) {
        document.getElementById('set_eew2test').innerHTML = '<i class="fas fa-play"></i> 警報テスト';
        se_eew2.pause();
        se_eew2.currentTime = 0;
    } else {
        se_eew2.currentTime = 0;
        document.getElementById('set_eew2test').innerHTML = '<i class="fas fa-pause"></i> 警報テスト';
        se_eew2.play();
    }
});
se_eew2.addEventListener("ended", () => {
    se_eew2.currentTime = 0;
    document.getElementById('set_eew2test').innerHTML = '<i class="fas fa-play"></i> 警報テスト';
});
document.getElementById('getinfo_click').addEventListener("click", () => {
    if (Cookies.get('getinfo_play') == 'pause') {
        Cookies.set('getinfo_play', 'play');
        document.getElementById('getinfo_click').innerHTML = 'pause';
    } else {
        Cookies.set('getinfo_play', 'pause');
        document.getElementById('getinfo_click').innerHTML = 'play_arrow';
    }
});
set_replay_start.addEventListener("click", () => {
    if (set_replay_date.value != '' && set_replay_time.value != '') {
        Cookies.set('replay_true', 'true');
    }
});
set_replay_reset.addEventListener("click", () => {
    Cookies.set('replay_true', 'false');
    Cookies.remove('replay_datetime');
    Cookies.remove('replay_first');
});
document.getElementById('switch_errorreload').addEventListener("change", () => {
    if (document.getElementById('switch_errorreload').checked) {
        localStorage.setItem('errorreload_onoff', 'on');
    } else {
        localStorage.setItem('errorreload_onoff', 'off');
    }
});
document.getElementById('switch_errorreload_network').addEventListener("change", () => {
    if (document.getElementById('switch_errorreload_network').checked) {
        localStorage.setItem('errorreload_network_onoff', 'on');
    } else {
        localStorage.setItem('errorreload_network_onoff', 'off');
    }
});
document.getElementById('switch_jishininfonokosu').addEventListener("click", () => {
    if (document.getElementById('switch_jishininfonokosu').checked) {
        localStorage.setItem('jishininfonokosu_onoff', 'on');
    } else {
        localStorage.setItem('jishininfonokosu_onoff', 'off');
    }
});
document.getElementById('errorreload_input').addEventListener("change", () => {
    localStorage.setItem('errorreload_sec', document.getElementById('errorreload_input').value);
});
document.getElementById('switch_errormes').addEventListener("change", () => {
    if (document.getElementById('switch_errormes').checked) {
        localStorage.setItem('errormes_onoff', 'on');
    } else {
        localStorage.setItem('errormes_onoff', 'off');
    }
});
document.getElementById('switch_realtimedata').addEventListener("change", () => {
    if (document.getElementById('switch_realtimedata').checked) {
        localStorage.setItem('realtimedata_onoff', 'on');
    } else {
        localStorage.setItem('realtimedata_onoff', 'off');
    }
});
document.getElementById('set_latlngset').addEventListener("click", () => {
    location.href = 'latlngset.html';
});
document.getElementById('set_latlngdel').addEventListener("click", () => {
    localStorage.removeItem('quake_lathome');
    localStorage.removeItem('quake_lnghome');
    location.reload();
});
document.getElementById('switch_admin_yosokujikan').addEventListener("click", () => {
    if (localStorage.getItem('switch_admin') == 'all') {
        if (document.getElementById('switch_admin_yosokujikan').checked) {
            localStorage.setItem('switch_admin_yosokujikan', 'on');
        } else {
            localStorage.setItem('switch_admin_yosokujikan', 'off');
        }
    } else {
        var pass = prompt("この設定を変更するには管理者パスワードが必要です。\nパスワードを入力してください。");
        if (pass == "kottaro") {
            localStorage.setItem('switch_admin', 'all');
            document.getElementById('switch_admin_yosokujikan').checked = true;
            localStorage.setItem('switch_admin_yosokujikan', 'on');
        } else {
            alert('！パスワードが違います！');
            document.getElementById('switch_admin_yosokujikan').checked = false;
        }
    }
});

if (localStorage.getItem('errorreload_onoff') != 'off') {
    localStorage.setItem('errorreload_onoff', 'on');
    document.getElementById('switch_errorreload').checked = true;
} else {
    document.getElementById('switch_errorreload').checked = false;
}
if (localStorage.getItem('errorreload_network_onoff') != 'off') {
    localStorage.setItem('errorreload_network_onoff', 'on');
    document.getElementById('switch_errorreload_network').checked = true;
} else {
    document.getElementById('switch_errorreload_network').checked = false;
}
if (localStorage.getItem('errorreload_sec') == null || localStorage.getItem('errorreload_sec') == undefined) {
    localStorage.setItem('errorreload_sec', '10');
    document.getElementById('errorreload_input').value = 10;
} else {
    document.getElementById('errorreload_input').value = localStorage.getItem('errorreload_sec');
}
if (localStorage.getItem('errormes_onoff') != 'off') {
    localStorage.setItem('errormes_onoff', 'on');
    document.getElementById('switch_errormes').checked = true;
} else {
    document.getElementById('switch_errormes').checked = false;
}
if (localStorage.getItem('jishininfonokosu_onoff') != 'off') {
    localStorage.setItem('jishininfonokosu_onoff', 'on');
    document.getElementById('switch_jishininfonokosu').checked = true;
} else {
    document.getElementById('switch_jishininfonokosu').checked = false;
}
if (localStorage.getItem('surface_bolehole') == 'on') {
    localStorage.setItem('surface_bolehole', 'on');
    document.getElementById('switch_surface').checked = true;
} else {
    localStorage.setItem('surface_bolehole', 'off');
    document.getElementById('switch_surface').checked = false;
}
if (localStorage.getItem('realtimedata_onoff') != 'off') {
    localStorage.setItem('realtimedata_onoff', 'on');
    document.getElementById('switch_realtimedata').checked = true;
} else {
    document.getElementById('switch_realtimedata').checked = false;
}


var TimeApi_offset = document.getElementById('TimeApi_offset');
if (localStorage.getItem('quake_TimeApiDelay') == null) {
    var TimeApiDelay = 2;
    TimeApi_offset.value = TimeApiDelay;
    localStorage.setItem('quake_TimeApiDelay', TimeApiDelay);
} else {
    var TimeApiDelay = localStorage.getItem('quake_TimeApiDelay');
    TimeApi_offset.value = TimeApiDelay;
}
TimeApi_offset.addEventListener("input", () => {
    localStorage.setItem('quake_TimeApiDelay', TimeApi_offset.value);
    TimeApiDelay = TimeApi_offset.value;
});

$(function () {
    if (localStorage.getItem('quake_lathome') == null || localStorage.getItem('quake_lnghome') == null) {
        const ipinfo = fetch('https://ipinfo.io?callback')
            .then(ipinfo => ipinfo.json())
            .then(ipinfo => {
                var home_kari = ipinfo['loc'];
                let home_kari_retsu = home_kari.split(',');
                localStorage.setItem('quake_lathome', home_kari_retsu[0]);
                localStorage.setItem('quake_lnghome', home_kari_retsu[1]);
                setTimeout(() => { location.reload(); }, 300);
            });
    }
    var userpoint = [{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [localStorage.getItem('quake_lathome'), localStorage.getItem('quake_lnghome')]
        }
    }];

    L.geoJson(userpoint[0],
        {
            onEachFeature: function (feature, layer) {
                if (feature.properties && feature.properties.popupContent) {
                    layer.bindPopup(feature.properties.popupContent);
                }
                layer.myTag = "Userpoint"
            },
            pointToLayer: function (feature, latlng) {
                var myIcon = L.icon({
                    pane: 'userpoint',
                    iconUrl: 'static/image/userpoint.png',
                    iconSize: [35, 35],
                    popupAnchor: [0, -35]
                });
                return L.marker([localStorage.getItem('quake_lathome'), localStorage.getItem('quake_lnghome')], { icon: myIcon, zIndexOffset: 50, title: '自分の現在地' }).bindPopup("自分の現在地。" + localStorage.getItem('quake_lathome') + "," + localStorage.getItem('quake_lnghome') + "<br>現在地と異なる場合は、設定から修正してください。");
            }

        }).addTo(map);

    var shindo = document.getElementById('shindo');
    var shindomoji = document.getElementById('shindomoji');
    var yosojikan = document.getElementById('yosojikan');
    var quakeinfo = document.getElementById('quakeinfo');
    var coloring_select = document.getElementById('coloring_select');
    var realtimedata = document.getElementById('realtimedata');
    var textcolor = document.getElementById('textcolor');
    let coloring_select_by_info = ['by フランソワさん', 'by Fukuさん', 'by 気象庁', 'by NHK', 'by こんぽさん', 'by よねさん', 'by りょーりょーさん', 'by ingenさん'];


    coloring_select.addEventListener("change", () => {
        localStorage.setItem('quake_coloring', coloring_select.value);
    });
    if (localStorage.getItem('quake_coloring') == 'NJQuake' || localStorage.getItem('quake_coloring') == null) {
    coloring_select.options[0].selected = true;
    } else if (localStorage.getItem('quake_coloring') == 'JQuake') {
    coloring_select.options[1].selected = true;
    } else if (localStorage.getItem('quake_coloring') == 'Quarog') {
    coloring_select.options[2].selected = true;
    } else if (localStorage.getItem('quake_coloring') == '気象庁') {
    coloring_select.options[3].selected = true;
    } else if (localStorage.getItem('quake_coloring') == 'NHK') {
    coloring_select.options[4].selected = true;
    } else if (localStorage.getItem('quake_coloring') == 'KiwiMonitor 第2版') {
    coloring_select.options[5].selected = true;
    } else if (localStorage.getItem('quake_coloring') == 'YDITS') {
    coloring_select.options[6].selected = true;
    } else if (localStorage.getItem('quake_coloring') == 'カラフル1') {
    coloring_select.options[7].selected = true;
    } else if (localStorage.getItem('quake_coloring') == 'ビビット') {
    coloring_select.options[8].selected = true;
    }

    realtimedata.addEventListener("change", () => {
        localStorage.setItem('realtimedata', realtimedata.value);
    });
    document.getElementById('switch_surface').addEventListener("change", () => {
        if (document.getElementById('switch_surface').checked) {
            localStorage.setItem('surface_bolehole', 'on');
        } else {
            localStorage.setItem('surface_bolehole', 'off');
        }
    });
    if (localStorage.getItem('realtimedata') == 'rd-shindo' || localStorage.getItem('realtimedata') == null) {
    realtimedata.options[0].selected = true;
    } else if (localStorage.getItem('realtimedata') == 'rd-pga') {
    realtimedata.options[1].selected = true;
    } else if (localStorage.getItem('realtimedata') == 'rd-pgv') {
    realtimedata.options[2].selected = true;
    } else if (localStorage.getItem('realtimedata') == 'rd-pgd') {
    realtimedata.options[3].selected = true;
    } else if (localStorage.getItem('realtimedata') == 'rd-0.125Hz') {
    realtimedata.options[4].selected = true;
    } else if (localStorage.getItem('realtimedata') == 'rd-0.25Hz') {
    realtimedata.options[5].selected = true;
    } else if (localStorage.getItem('realtimedata') == 'rd-0.5Hz') {
    realtimedata.options[6].selected = true;
    } else if (localStorage.getItem('realtimedata') == 'rd-1.0Hz') {
    realtimedata.options[7].selected = true;
    } else if (localStorage.getItem('realtimedata') == 'rd-2.0Hz') {
    realtimedata.options[8].selected = true;
    } else if (localStorage.getItem('realtimedata') == 'rd-4.0Hz') {
    realtimedata.options[9].selected = true;
    }

    setInterval(() => {
        if (Cookies.get('getinfo_play') == 'pause') {
            document.getElementById('clock').style.backgroundColor = "#4285f4";
            document.getElementById('clock').style.color = "#ffffff";
        } else {
            // var timejson = $.getJSON('http://worldtimeapi.org/api/timezone/Asia/Tokyo');
            var timejson = $.getJSON('https://3fe5a5f690efc790d4764f1c528a4ebb89fa4168.nict.go.jp/cgi-bin/json');
            $.when(timejson)
                .done(function (timeapi) {
                    var data_oomoto = timeapi;
                    var data_jikan_ichiji = new Date((data_oomoto["st"] * 1000));
                    console.log(data_jikan_ichiji);
                    if (Cookies.get('replay_true') == 'true') {
                        if (Cookies.get('replay_first') == 'no') {
                            let ichiji_replay_daytime = Cookies.get('replay_datetime');
                            let date = new Date(ichiji_replay_daytime.substring(0, 4), (Number(ichiji_replay_daytime.substring(4, 6)) - 1), ichiji_replay_daytime.substring(6, 8), ichiji_replay_daytime.substring(8, 10), ichiji_replay_daytime.substring(10, 12), ichiji_replay_daytime.substring(12, 14));
                            date.setSeconds(date.getSeconds() + 1);
                            var year = date.getFullYear();
                            var month = ('0' + (date.getMonth() + 1)).slice(-2);
                            var day = ('0' + date.getDate()).slice(-2);
                            var hour = ('0' + date.getHours()).slice(-2);
                            var minute = ('0' + date.getMinutes()).slice(-2);
                            var second = ('0' + date.getSeconds()).slice(-2);
                            Cookies.set('replay_datetime', year + "" + month + "" + day + "" + hour + "" + minute + "" + second);
                            document.getElementById('clock').style.backgroundColor = "#6e004d";
                            document.getElementById('clock').style.color = "#ffffff";
                            Cookies.set('nowtime_realtimeshindo',year + '' + month + day + hour + minute + second);
                        } else {
                            let ichiji_replay_daytime_2 = set_replay_date.value.substring(0, 4) + set_replay_date.value.substring(5, 7) + set_replay_date.value.substring(8, 10) + set_replay_time.value.substring(0, 2) + set_replay_time.value.substring(3, 5) + set_replay_time.value.substring(6, 8);
                            var year = ichiji_replay_daytime_2.substring(0, 4);
                            var month = ichiji_replay_daytime_2.substring(4, 6);
                            var day = ichiji_replay_daytime_2.substring(6, 8);
                            var hour = ichiji_replay_daytime_2.substring(8, 10);
                            var minute = ichiji_replay_daytime_2.substring(10, 12);
                            var second = ichiji_replay_daytime_2.substring(12, 14);
                            console.log(year + month + day + hour + minute + second);
                            Cookies.set('replay_first', 'no');
                            Cookies.set('replay_datetime', year + month + day + hour + minute + second);
                            document.getElementById('clock').style.backgroundColor = "#6e004d";
                            document.getElementById('clock').style.color = "#ffffff";
                        }
                    } else {
                        if (window.location.search.indexOf('replay_daytime') != -1) {
                            var replay_daytime = getParam('replay_daytime');
                            if (replay_daytime.length == 14) {
                                var year = replay_daytime.substring(0, 4);
                                var month = replay_daytime.substring(4, 6);
                                var day = replay_daytime.substring(6, 8);
                                var hour = replay_daytime.substring(8, 10);
                                var minute = replay_daytime.substring(10, 12);
                                var second = replay_daytime.substring(12, 14);
                                Cookies.set('replay_true', 'true');
                                Cookies.set('replay_datetime', replay_daytime);
                                Cookies.set('replay_first', 'no');
                                return;
                            }
                        }
                        // if (Cookies.get('ntp_hosei') != "already") {
                        //     console.log(data_oomoto);
                        //     var ntp_hosei_ichiji = JSON.parse('\"'+data_oomoto+'\"');
                        //     console.log(ntp_hosei_ichiji["st"]);
                        //     // var ntp_hoseikan = Number(ntp_hosei_ichiji.st);
                        //     // var ntp_hoseikan_saigo = ntp_hoseikan.slice(-3);
                        // }
                        document.getElementById('clock').style.backgroundColor = "#ffffff";
                        document.getElementById('clock').style.color = "#000000";
                        // var year = timeapi["datetime"].substring(0,4);
                        // var month = timeapi["datetime"].substring(5,7);
                        // var day = timeapi["datetime"].substring(8,10);
                        // var hour = timeapi["datetime"].substring(11,13);
                        // var minute = timeapi["datetime"].substring(14,16);
                        // var second = timeapi["datetime"].substring(17,19);
                        var year = data_jikan_ichiji.getFullYear();
                        var month = ('0' + (data_jikan_ichiji.getMonth() + 1)).slice(-2);
                        var day = ('0' + data_jikan_ichiji.getDate()).slice(-2);
                        var hour = ('0' + data_jikan_ichiji.getHours()).slice(-2);
                        var minute = ('0' + data_jikan_ichiji.getMinutes()).slice(-2);
                        var second = ('0' + data_jikan_ichiji.getSeconds()).slice(-2);
                        var date = new Date(year, (Number(month) - 1), day, hour, minute, second);
                        date.setSeconds(date.getSeconds() - TimeApiDelay);
                        var year = date.getFullYear();
                        var month = ('0' + (date.getMonth() + 1)).slice(-2);
                        var day = ('0' + date.getDate()).slice(-2);
                        var hour = ('0' + date.getHours()).slice(-2);
                        var minute = ('0' + date.getMinutes()).slice(-2);
                        var second = ('0' + date.getSeconds()).slice(-2);
                        Cookies.set('nowtime_realtimeshindo',year + '' + month + day + hour + minute + second);
                    }
                    document.getElementById('clock').innerText = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
                    var json1 = $.getJSON('https://weather-kyoshin.west.edge.storage-yahoo.jp/RealTimeData/' + year + month + day + '/' + year + month + day + hour + minute + second + '.json');
                    var json2 = $.getJSON('https://kyoshin.jishinalert.tech/webservice/hypo/eew/' + year + month + day + hour + minute + second + '.json');

                    $.when(json1, json2)
                        .done(function (yahoo_data, jishinalert_data) {
                            Cookies.remove('error_times');
                            if (Cookies.get('visited') == 'already') {
                                if (map.hasLayer(Realtime)){
                                    map.removeLayer(Realtime);
                                }
                            }
                            if (localStorage.getItem('surface_bolehole') == "on")/*bolehole*/ {var surface_bolehole = "_b";} else/*surface*/ {var surface_bolehole = "_s";}
                            if (localStorage.getItem('realtimedata') == 'rd-shindo' || localStorage.getItem('realtimedata') == null) {
                                var realtimedata_shurui = 'jma';
                                } else if (localStorage.getItem('realtimedata') == 'rd-pga') {
                                var realtimedata_shurui = 'acmap';
                                } else if (localStorage.getItem('realtimedata') == 'rd-pgv') {
                                var realtimedata_shurui = 'vcmap';
                                } else if (localStorage.getItem('realtimedata') == 'rd-pgd') {
                                var realtimedata_shurui = 'dcmap';
                                } else if (localStorage.getItem('realtimedata') == 'rd-0.125Hz') {
                                var realtimedata_shurui = 'rsp0125';
                                } else if (localStorage.getItem('realtimedata') == 'rd-0.25Hz') {
                                var realtimedata_shurui = 'rsp0250';
                                } else if (localStorage.getItem('realtimedata') == 'rd-0.5Hz') {
                                var realtimedata_shurui = 'rsp0500';
                                } else if (localStorage.getItem('realtimedata') == 'rd-1.0Hz') {
                                var realtimedata_shurui = 'rsp1000';
                                } else if (localStorage.getItem('realtimedata') == 'rd-2.0Hz') {
                                var realtimedata_shurui = 'rsp2000';
                                } else if (localStorage.getItem('realtimedata') == 'rd-4.0Hz') {
                                var realtimedata_shurui = 'rsp4000';
                                }
                            if (localStorage.getItem('realtimedata_onoff') == 'on') {
                                var image_url = 'http://www.kmoni.bosai.go.jp/data/map_img/RealTimeImg/'+realtimedata_shurui+surface_bolehole+'/'+(Cookies.get('nowtime_realtimeshindo').substr(0,8))+'/'+Cookies.get('nowtime_realtimeshindo')+'.'+realtimedata_shurui+surface_bolehole+'.gif';
                                var bounds = L.latLngBounds(
                                    [46, 128.6],
                                    [29.5,146],
                                ); // 画像を表示する範囲（緯度経度）
                                Realtime = L.imageOverlay(image_url, bounds, {}).addTo(map);
                                Cookies.set('visited','already');
                            } else {
                                Cookies.remove('visited');
                            }
                            
                            
                            if (yahoo_data[0]["psWave"] == null && yahoo_data[0]["hypoInfo"] == null) {
                                /*map.eachLayer(function (layer) {
                                    if (layer.myTag && layer.myTag === "Shingen") {
                                        map.removeLayer(layer)
                                    }
                                    layer = null;
                                });*/
                                //map.flyTo(new L.LatLng(37.575, 135.984), 5, { duration: 0.5 });

                                if (localStorage.getItem('jishininfonokosu_onoff') == "off") {
                                    shindomoji.innerHTML = '';
                                    quakeinfo.innerHTML = '';
                                    document.body.style.backgroundColor = '';
                                    textcolor.style.color = '';
                                    document.getElementById('copyitem_jishin_textarea').innerHTML = '';
                                }
                                pwave.setRadius('0');
                                swave.setRadius('0');
                                yosojikan.style.display = 'none';
                                Cookies.remove('sudenizumu');
                                Cookies.remove('firstse');
                                Cookies.remove('lnglat');
                                Cookies.remove('1report_time');
                                document.title = 'RealtimeQuakeInfo';
                                return;
                            } /*else if (Cookies.get('firstse') != 'yes') {
                                let firstse = new Audio('firstse.wav');
                                firstse.play();
                                Cookies.set('firstse','yes')
                            }*/ else {
                                var p = (yahoo_data[0]["psWave"]["items"][0]["pRadius"]) * 1000;
                                var s = (yahoo_data[0]["psWave"]["items"][0]["sRadius"]) * 1000;

                                //中心点(震源の緯度経度)を取り出す。
                                var lat = yahoo_data[0]["psWave"]["items"][0]["latitude"].replace("N", "");
                                //var lat = jishinalert_data[0]["latitude"];
                                var lng = yahoo_data[0]["psWave"]["items"][0]["longitude"].replace("E", "");
                                //var lng = jishinalert_data[0]["longitude"];
                                var magnitude = yahoo_data[0]["hypoInfo"]["items"][0]["magnitude"]; //マグニチュード
                                var calcintensity = yahoo_data[0]["hypoInfo"]["items"][0]["calcintensity"]; //最大震度
                                var regionName = yahoo_data[0]["hypoInfo"]["items"][0]["regionName"]; //震源名
                                var depth = yahoo_data[0]["hypoInfo"]["items"][0]["depth"]; //深さ
                                var reportNum = jishinalert_data[0]["report_num"]; //報数
                                var originTime = yahoo_data[0]["hypoInfo"]["items"][0]["originTime"]; //発生時刻
                                var isFinal = yahoo_data[0]["hypoInfo"]["items"][0]["isFinal"]; //最終報
                                if (isFinal == 'true') {
                                    var isFinal_text = '最終報';
                                } else {
                                    var isFinal_text = '';
                                }
                                var report_time = jishinalert_data[0]["report_time"]; //報告日時
                                if (reportNum == 1) {
                                    Cookies.set('1report_time', report_time);
                                }
                                var eewlevel = jishinalert_data[0]["alertflg"];

                                var psCenter = new L.LatLng(lat, lng);

                                var error_times = null;

                                if (Cookies.get('lnglat') != lat + ':' + lng) {
                                    map.eachLayer(function (layer) {
                                        if (layer.myTag && layer.myTag == "Shingen") {
                                            map.removeLayer(layer)
                                        }
                                        layer = null;
                                    });
                                }

                                document.title = '【受信中】RealtimeQuakeInfo';

                                //s波を更新
                                swave.setLatLng(psCenter);
                                swave.setRadius(s);
                                //p波を更新
                                pwave.setLatLng(psCenter);
                                pwave.setRadius(p);

                                var geojsonFeature = [{
                                    "type": "Feature",
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": [lng, lat]
                                    }
                                }];

                                L.geoJson(geojsonFeature[0],
                                    {
                                        onEachFeature: function (feature, layer) {
                                            if (feature.properties && feature.properties.popupContent) {
                                                layer.bindPopup(feature.properties.popupContent);
                                            }
                                            layer.myTag = "Shingen"
                                        },
                                        pointToLayer: function (feature, latlng) {
                                            var myIcon = L.icon({
                                                iconUrl: 'static/image/shingen.png',
                                                iconSize: [50, 50],
                                                popupAnchor: [0, -50]
                                            });
                                            return L.marker(latlng, { icon: myIcon, pane: 'shingen'}).bindPopup("発生時刻："+hasseijikoku+"<br>震源地："+regionName+"<br>マグニチュード："+magnitude+"<br>深さ："+depth);
                                        }

                                    }).addTo(map)

                            }

                            const R = Math.PI / 180;
                            function distance(lat1, lng1, lat2, lng2) {
                                lat1 *= R; lng1 *= R; lat2 *= R; lng2 *= R;
                                return 6371 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
                            }
                            var lathome = localStorage.getItem('quake_lathome');
                            var lnghome = localStorage.getItem('quake_lnghome');
                            var ptotatsu = ((distance(lat, lng, lathome, lnghome) - p / 1000) / 8).toFixed(1);
                            var stotatsu = ((distance(lat, lng, lathome, lnghome) - s / 1000) / 4).toFixed(1);
                            //setInterval(() => {
                            /*let ptotatsu_naibu = (Cookies.get('ptotatsu') - 0.1).toFixed(1);
                            let stotatsu_naibu = (Cookies.get('stotatsu') - 0.1).toFixed(1);
                            Cookies.set('ptotatsu',ptotatsu_naibu);
                            Cookies.set('stotatsu',stotatsu_naibu);*/
                            if ((localStorage.getItem('switch_admin') == "all") && (localStorage.getItem('switch_admin_yosokujikan') == "on")) {
                                yosojikan.style.display = 'block';
                                document.getElementById('pha_yosokujikan').value = ptotatsu;
                                document.getElementById('sha_yosokujikan').value = stotatsu;
                            }
                            //}, 100);

                            let Njquake_BackColor = ["rgb(107,120,120)", "rgb(30,110,230)", "rgb(50,180,100)", "rgb(255,224,93)", "rgb(255,170,19)", "rgb(239,112,15)", "rgb(230,0,0)", "rgb(160,0,0)", "rgb(93,0,144)", "rgb(57,59,59)", "rgb(150,150,150)"];
                            let Njquake_TextColor = ["rgb(255,255,255)", "rgb(255,255,255)", "rgb(255,255,255)", "rgb(8,8,8)", "rgb(8,8,8)", "rgb(8,8,8)", "rgb(255,255,255)", "rgb(255,255,255)", "rgb(255,255,255)", "rgb(255,255,255)"];
                            let jquake_BackColor = ["#6b7878", "#156ca5", "#139a4c", "#c99c00", "#e98226", "#d16a0e", "#eb1a00", "#9e0103", "#960096", "#408080"];
                            let jquake_TextColor = "#ffffff";
                            let quarog_BackColor = ["rgb(50, 90, 140)", "rgb(50, 120, 210)", "rgb(50, 210, 230)", "rgb(240, 240, 120)", "rgb(250, 180, 40)", "rgb(250, 120, 30)", "rgb(220, 30, 20)", "rgb(140, 20, 10)", "rgb(80, 10, 100)", "rgb(50, 60, 70)"];
                            let quarog_TextColor = ["rgb(255, 255, 255)", "rgb(255, 255, 255)", "rgb(30, 40, 50)", "rgb(30, 40, 50)", "rgb(30, 40, 50)", "rgb(30, 40, 50)", "rgb(255, 255, 255)", "rgb(255, 255, 255)", "rgb(255, 255, 255)", "rgb(255, 255, 255)"];
                            let kishocho_BackColor = ["rgb(242,242,255)", "rgb(0,170,255)", "rgb(0,65,255)", "rgb(250,230,150)", "rgb(255,230,0)", "rgb(255,153,0)", "rgb(255,40,0)", "rgb(165,0,33)", "rgb(180 ,0 ,104 )", "rgb(50, 60, 70)"];
                            let kishocho_TextColor = ["rgb(30, 40, 50)", "rgb(30, 40, 50)", "rgb(255, 255, 255)", "rgb(30, 40, 50)", "rgb(30, 40, 50)", "rgb(30, 40, 50)", "rgb(30, 40, 50)", "rgb(255, 255, 255)", "rgb(255, 255, 255)", "rgb(255, 255, 255)"];
                            let nhk_BackColor = ["#51b3fc", "#7dd45a", "#f0de7e", "#fa782c", "#b30f20", "#b30f20", "#ffcdde", "#ffcdde", "#9400d3", "#808080"];
                            let nhk_TextColor = ["#000000", "#000000", "#000000", "#000000", "#ffffff", "#ffffff", "#b30f20", "#b30f20", "#ffff6c", "#ffffff"];
                            let kiwi2_BackColor = ["rgb(70, 100, 110)", "rgb(30, 110, 230)", "rgb(0, 200, 200)", "rgb(250, 250, 100)", "rgb(255, 180 ,0)", "rgb(255, 120, 0)", "rgb(230, 0, 0)", "rgb(160, 0, 0)", "rgb(150, 0, 150)", "rgb(241, 241, 241)"];
                            let kiwi2_TextColor = ["rgb(255, 255, 255)", "rgb(30, 40, 50)", "rgb(30, 40, 50)", "rgb(30, 40, 50)", "rgb(30, 40, 50)", "rgb(30, 40, 50)", "rgb(30, 40, 50)", "rgb(255, 255, 255)", "rgb(255, 255, 255)", "rgb(30, 40, 50)"];
                            let ydits_BackColor = ['#bec2bd', '#1e21bb', '#00c123', '#bbc124', '#bea222', '#bf8020', '#c0211c', '#a0221d', '#7f217c', '#7b80bd'];
                            let ydits_TextColor = ['#000000', '#ffffff', '#000000', '#000000', '#000000', '#000000', '#ffffff', '#ffffff', '#ffffff', '#000000'];
                            let colorful1_BackColor = ["rgb(0, 50, 165)", "rgb(0, 124, 255)", "rgb(0, 160, 130)", "rgb(240, 201, 80)", "rgb(249, 146, 48)", "rgb(249, 99, 44)", "rgb(254, 25, 32)", "rgb(206, 0, 0)", "rgb(109, 47, 161)", "rgb(70, 80, 100)"];
                            let colorful1_TextColor = ["rgb(241, 241, 241)", "rgb(241, 241, 241)", "rgb(241, 241, 241)", "rgb(30, 40, 50)", "rgb(241, 241, 241)", "rgb(241, 241, 241)", "rgb(241, 241, 241)", "rgb(241, 241, 241)", "rgb(241, 241, 241)", "rgb(241, 241, 241)"];
                            let vivid_BackColor = ["#FFFAFA", "#1E90FF", "#3CB371", "#DAA520", "#FF8C00", "#FF8C00", "#DC143C", "#DC143C", "#FF1493", "#808080"];
                            let vivid_TextColor = ["#808080", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"];
                            if (localStorage.getItem('quake_coloring') == 'NJQuake' || localStorage.getItem('quake_coloring') == null) {
                                if (calcintensity == '01') { MaxShindo = '1'; BackColor = Njquake_BackColor[0]; TextColor = Njquake_TextColor[0]; } else if (calcintensity == '02') { MaxShindo = '2'; BackColor = Njquake_BackColor[1]; TextColor = Njquake_TextColor[1]; } else if (calcintensity == '03') { MaxShindo = '3'; BackColor = Njquake_BackColor[2]; TextColor = Njquake_TextColor[2]; } else if (calcintensity == '04') { MaxShindo = '4'; BackColor = Njquake_BackColor[3]; TextColor = Njquake_TextColor[3]; } else if (calcintensity == '5-') { MaxShindo = '5弱'; BackColor = Njquake_BackColor[4]; TextColor = Njquake_TextColor[4]; } else if (calcintensity == '5+') { MaxShindo = '5強'; BackColor = Njquake_BackColor[5]; TextColor = Njquake_TextColor[5]; } else if (calcintensity == '6-') { MaxShindo = '6弱'; BackColor = Njquake_BackColor[6]; TextColor = Njquake_TextColor[6]; } else if (calcintensity == '6+') { MaxShindo = '6強'; BackColor = Njquake_BackColor[7]; TextColor = Njquake_TextColor[7]; } else if (calcintensity == '07') { MaxShindo = '7'; BackColor = Njquake_BackColor[8]; TextColor = Njquake_TextColor[8]; } else { MaxShindo = '不明'; BackColor = Njquake_BackColor[9]; TextColor = Njquake_TextColor[9]; }
                            } else if (localStorage.getItem('quake_coloring') == 'JQuake') {
                                if (calcintensity == '01') { MaxShindo = '1'; BackColor = jquake_BackColor[0]; TextColor = jquake_TextColor; } else if (calcintensity == '02') { MaxShindo = '2'; BackColor = jquake_BackColor[1]; TextColor = jquake_TextColor; } else if (calcintensity == '03') { MaxShindo = '3'; BackColor = jquake_BackColor[2]; TextColor = jquake_TextColor; } else if (calcintensity == '04') { MaxShindo = '4'; BackColor = jquake_BackColor[3]; TextColor = jquake_TextColor; } else if (calcintensity == '5-') { MaxShindo = '5弱'; BackColor = jquake_BackColor[4]; TextColor = jquake_TextColor; } else if (calcintensity == '5+') { MaxShindo = '5強'; BackColor = jquake_BackColor[5]; TextColor = jquake_TextColor; } else if (calcintensity == '6-') { MaxShindo = '6弱'; BackColor = jquake_BackColor[6]; TextColor = jquake_TextColor; } else if (calcintensity == '6+') { MaxShindo = '6強'; BackColor = jquake_BackColor[7]; TextColor = jquake_TextColor; } else if (calcintensity == '07') { MaxShindo = '7'; BackColor = jquake_BackColor[8]; TextColor = jquake_TextColor; } else { MaxShindo = '不明'; BackColor = jquake_BackColor[9]; TextColor = jquake_TextColor; }
                            } else if (localStorage.getItem('quake_coloring') == 'Quarog') {
                                if (calcintensity == '01') { MaxShindo = '1'; BackColor = quarog_BackColor[0]; TextColor = quarog_TextColor[0]; } else if (calcintensity == '02') { MaxShindo = '2'; BackColor = quarog_BackColor[1]; TextColor = quarog_TextColor[1]; } else if (calcintensity == '03') { MaxShindo = '3'; BackColor = quarog_BackColor[2]; TextColor = quarog_TextColor[2]; } else if (calcintensity == '04') { MaxShindo = '4'; BackColor = quarog_BackColor[3]; TextColor = quarog_TextColor[3]; } else if (calcintensity == '5-') { MaxShindo = '5弱'; BackColor = quarog_BackColor[4]; TextColor = quarog_TextColor[4]; } else if (calcintensity == '5+') { MaxShindo = '5強'; BackColor = quarog_BackColor[5]; TextColor = quarog_TextColor[5]; } else if (calcintensity == '6-') { MaxShindo = '6弱'; BackColor = quarog_BackColor[6]; TextColor = quarog_TextColor[6]; } else if (calcintensity == '6+') { MaxShindo = '6強'; BackColor = quarog_BackColor[7]; TextColor = quarog_TextColor[7]; } else if (calcintensity == '07') { MaxShindo = '7'; BackColor = quarog_BackColor[8]; TextColor = quarog_TextColor[8]; } else { MaxShindo = '不明'; BackColor = quarog_BackColor[9]; TextColor = quarog_TextColor[9]; }
                            } else if (localStorage.getItem('quake_coloring') == '気象庁') {
                                if (calcintensity == '01') { MaxShindo = '1'; BackColor = kishocho_BackColor[0]; TextColor = kishocho_TextColor[0]; } else if (calcintensity == '02') { MaxShindo = '2'; BackColor = kishocho_BackColor[1]; TextColor = kishocho_TextColor[1]; } else if (calcintensity == '03') { MaxShindo = '3'; BackColor = kishocho_BackColor[2]; TextColor = kishocho_TextColor[2]; } else if (calcintensity == '04') { MaxShindo = '4'; BackColor = kishocho_BackColor[3]; TextColor = kishocho_TextColor[3]; } else if (calcintensity == '5-') { MaxShindo = '5弱'; BackColor = kishocho_BackColor[4]; TextColor = kishocho_TextColor[4]; } else if (calcintensity == '5+') { MaxShindo = '5強'; BackColor = kishocho_BackColor[5]; TextColor = kishocho_TextColor[5]; } else if (calcintensity == '6-') { MaxShindo = '6弱'; BackColor = kishocho_BackColor[6]; TextColor = kishocho_TextColor[6]; } else if (calcintensity == '6+') { MaxShindo = '6強'; BackColor = kishocho_BackColor[7]; TextColor = kishocho_TextColor[7]; } else if (calcintensity == '07') { MaxShindo = '7'; BackColor = kishocho_BackColor[8]; TextColor = kishocho_TextColor[8]; } else { MaxShindo = '不明'; BackColor = kishocho_BackColor[9]; TextColor = kishocho_TextColor[9]; }
                            } else if (localStorage.getItem('quake_coloring') == 'NHK') {
                                if (calcintensity == '01') { MaxShindo = '1'; BackColor = nhk_BackColor[0]; TextColor = nhk_TextColor[0]; } else if (calcintensity == '02') { MaxShindo = '2'; BackColor = nhk_BackColor[1]; TextColor = nhk_TextColor[1]; } else if (calcintensity == '03') { MaxShindo = '3'; BackColor = nhk_BackColor[2]; TextColor = nhk_TextColor[2]; } else if (calcintensity == '04') { MaxShindo = '4'; BackColor = nhk_BackColor[3]; TextColor = nhk_TextColor[3]; } else if (calcintensity == '5-') { MaxShindo = '5弱'; BackColor = nhk_BackColor[4]; TextColor = nhk_TextColor[4]; } else if (calcintensity == '5+') { MaxShindo = '5強'; BackColor = nhk_BackColor[5]; TextColor = nhk_TextColor[5]; } else if (calcintensity == '6-') { MaxShindo = '6弱'; BackColor = nhk_BackColor[6]; TextColor = nhk_TextColor[6]; } else if (calcintensity == '6+') { MaxShindo = '6強'; BackColor = nhk_BackColor[7]; TextColor = nhk_TextColor[7]; } else if (calcintensity == '07') { MaxShindo = '7'; BackColor = nhk_BackColor[8]; TextColor = nhk_TextColor[8]; } else { MaxShindo = '不明'; BackColor = nhk_BackColor[9]; TextColor = nhk_TextColor[9]; }
                            } else if (localStorage.getItem('quake_coloring') == 'KiwiMonitor 第2版') {
                                if (calcintensity == '01') { MaxShindo = '1'; BackColor = kiwi2_BackColor[0]; TextColor = kiwi2_TextColor[0]; } else if (calcintensity == '02') { MaxShindo = '2'; BackColor = kiwi2_BackColor[1]; TextColor = kiwi2_TextColor[1]; } else if (calcintensity == '03') { MaxShindo = '3'; BackColor = kiwi2_BackColor[2]; TextColor = kiwi2_TextColor[2]; } else if (calcintensity == '04') { MaxShindo = '4'; BackColor = kiwi2_BackColor[3]; TextColor = kiwi2_TextColor[3]; } else if (calcintensity == '5-') { MaxShindo = '5弱'; BackColor = kiwi2_BackColor[4]; TextColor = kiwi2_TextColor[4]; } else if (calcintensity == '5+') { MaxShindo = '5強'; BackColor = kiwi2_BackColor[5]; TextColor = kiwi2_TextColor[5]; } else if (calcintensity == '6-') { MaxShindo = '6弱'; BackColor = kiwi2_BackColor[6]; TextColor = kiwi2_TextColor[6]; } else if (calcintensity == '6+') { MaxShindo = '6強'; BackColor = kiwi2_BackColor[7]; TextColor = kiwi2_TextColor[7]; } else if (calcintensity == '07') { MaxShindo = '7'; BackColor = kiwi2_BackColor[8]; TextColor = kiwi2_TextColor[8]; } else { MaxShindo = '不明'; BackColor = kiwi2_BackColor[9]; TextColor = kiwi2_TextColor[9]; }
                            } else if (localStorage.getItem('quake_coloring') == 'YDITS') {
                                if (calcintensity == '01') { MaxShindo = '1'; BackColor = ydits_BackColor[0]; TextColor = ydits_TextColor[0]; } else if (calcintensity == '02') { MaxShindo = '2'; BackColor = ydits_BackColor[1]; TextColor = ydits_TextColor[1]; } else if (calcintensity == '03') { MaxShindo = '3'; BackColor = ydits_BackColor[2]; TextColor = ydits_TextColor[2]; } else if (calcintensity == '04') { MaxShindo = '4'; BackColor = ydits_BackColor[3]; TextColor = ydits_TextColor[3]; } else if (calcintensity == '5-') { MaxShindo = '5弱'; BackColor = ydits_BackColor[4]; TextColor = ydits_TextColor[4]; } else if (calcintensity == '5+') { MaxShindo = '5強'; BackColor = ydits_BackColor[5]; TextColor = ydits_TextColor[5]; } else if (calcintensity == '6-') { MaxShindo = '6弱'; BackColor = ydits_BackColor[6]; TextColor = ydits_TextColor[6]; } else if (calcintensity == '6+') { MaxShindo = '6強'; BackColor = ydits_BackColor[7]; TextColor = ydits_TextColor[7]; } else if (calcintensity == '07') { MaxShindo = '7'; BackColor = ydits_BackColor[8]; TextColor = ydits_TextColor[8]; } else { MaxShindo = '不明'; BackColor = ydits_BackColor[9]; TextColor = ydits_TextColor[9]; }
                            } else if (localStorage.getItem('quake_coloring') == 'カラフル1') {
                                if (calcintensity == '01') { MaxShindo = '1'; BackColor = colorful1_BackColor[0]; TextColor = colorful1_TextColor[0]; } else if (calcintensity == '02') { MaxShindo = '2'; BackColor = colorful1_BackColor[1]; TextColor = colorful1_TextColor[1]; } else if (calcintensity == '03') { MaxShindo = '3'; BackColor = colorful1_BackColor[2]; TextColor = colorful1_TextColor[2]; } else if (calcintensity == '04') { MaxShindo = '4'; BackColor = colorful1_BackColor[3]; TextColor = colorful1_TextColor[3]; } else if (calcintensity == '5-') { MaxShindo = '5弱'; BackColor = colorful1_BackColor[4]; TextColor = colorful1_TextColor[4]; } else if (calcintensity == '5+') { MaxShindo = '5強'; BackColor = colorful1_BackColor[5]; TextColor = colorful1_TextColor[5]; } else if (calcintensity == '6-') { MaxShindo = '6弱'; BackColor = colorful1_BackColor[6]; TextColor = colorful1_TextColor[6]; } else if (calcintensity == '6+') { MaxShindo = '6強'; BackColor = colorful1_BackColor[7]; TextColor = colorful1_TextColor[7]; } else if (calcintensity == '07') { MaxShindo = '7'; BackColor = colorful1_BackColor[8]; TextColor = colorful1_TextColor[8]; } else { MaxShindo = '不明'; BackColor = colorful1_BackColor[9]; TextColor = colorful1_TextColor[9]; }
                            } else if (localStorage.getItem('quake_coloring') == 'ビビット') {
                                if (calcintensity == '01') { MaxShindo = '1'; BackColor = vivid_BackColor[0]; TextColor = vivid_TextColor[0]; } else if (calcintensity == '02') { MaxShindo = '2'; BackColor = vivid_BackColor[1]; TextColor = vivid_TextColor[1]; } else if (calcintensity == '03') { MaxShindo = '3'; BackColor = vivid_BackColor[2]; TextColor = vivid_TextColor[2]; } else if (calcintensity == '04') { MaxShindo = '4'; BackColor = vivid_BackColor[3]; TextColor = vivid_TextColor[3]; } else if (calcintensity == '5-') { MaxShindo = '5弱'; BackColor = vivid_BackColor[4]; TextColor = vivid_TextColor[4]; } else if (calcintensity == '5+') { MaxShindo = '5強'; BackColor = vivid_BackColor[5]; TextColor = vivid_TextColor[5]; } else if (calcintensity == '6-') { MaxShindo = '6弱'; BackColor = vivid_BackColor[6]; TextColor = vivid_TextColor[6]; } else if (calcintensity == '6+') { MaxShindo = '6強'; BackColor = vivid_BackColor[7]; TextColor = vivid_TextColor[7]; } else if (calcintensity == '07') { MaxShindo = '7'; BackColor = vivid_BackColor[8]; TextColor = vivid_TextColor[8]; } else { MaxShindo = '不明'; BackColor = vivid_BackColor[9]; TextColor = vivid_TextColor[9]; }
                            }

                            var hasseijikoku = originTime.substring(0, 4) + '/' + originTime.substring(5, 7) + '/' + originTime.substring(8, 10) + ' ' + originTime.substring(11, 13) + ':' + originTime.substring(14, 16) + ':' + originTime.substring(17, 19);
                            shindomoji.innerHTML = '<span style="font-size: min(6vh,calc(13vw/6));line-height: 1.1em;">最大震度</span><br><span style="font-size: min(15vh,17vw/2);line-height: 1.1em;font-weight: bold;">' + MaxShindo + '</span>';
                            quakeinfo.innerHTML = '<span style="font-size: 5.5vh;font-weight: 500;">' + regionName + '</span><br><span style="font-size: calc(10vh / 3);">' + hasseijikoku + '発生<br>規模 : M' + magnitude + '　深さ : ' + depth + '<br>緊急地震速報（' + eewlevel + '）　' + isFinal_text + '第 ' + reportNum + ' 報';
                            document.body.style.backgroundColor = BackColor;
                            textcolor.style.color = TextColor;

                            var copyitem_jishin = hasseijikoku + 'ごろ、' + regionName + 'で震度' + MaxShindo + 'の地震が発生しました。\nM' + magnitude + '、深さ' + depth + 'と推定されています。\n緊急地震速報(' + eewlevel + ')、' + isFinal_text + '第' + reportNum + '報\n#緊急地震速報 #地震 #地震情報 #' + regionName + ' #震度' + MaxShindo + '\n' + document.getElementById('clock').innerText + '時点での情報です。\n第一報：' + Cookies.get('1report_time');
                            document.getElementById('copyitem_jishin_textarea').innerHTML = copyitem_jishin;

                            document.getElementById('infocopy_click').addEventListener("click", () => {
                                new ClipboardJS('#infocopy_click');
                            });

                            Cookies.set('lnglat', (lng + ':' + lat));

                            if (Cookies.get('sudenizumu') != 'yes') {
                                if (magnitude < 5) {
                                    Cookies.set('sudenizumu', 'yes');
                                    map.flyTo(psCenter, Math.floor((8 - magnitude) * 1.7), { duration: 0.5 });
                                } else {
                                    Cookies.set('sudenizumu', 'yes');
                                    map.flyTo(psCenter, Math.floor(parseInt(magnitude * 1.1)), { duration: 0.5 });
                                }
                            }

                        })
                        .fail(function () {
                            if (document.getElementById('switch_errormes').checked) {
                                error_shori1_checked();
                            } else {
                                error_shori1_checkednone();
                            }
                        });

                })
                .fail(function () {
                    if (document.getElementById('switch_errormes').checked) {
                        document.getElementById('error_mes_time').classList.add('display');
                        document.getElementById('clock').style.backgroundColor = "#9999dd";
                        document.getElementById('clock').style.color = "#ff0000";
                        error_shori_network();
                    } else {
                        error_shori_network();
                    }
                });
        }
    }, 1000);


});

function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function error_shori1() {
    if (Cookies.get('replay_true') == "true") {
        document.getElementById('error_mes_replay').classList.add('display');
        settings_click.style.backgroundColor = "#ff0000";
        settings_click.style.color = "#ffffff";
        document.getElementById('set_replay').style.color = "#ffffff";
        document.getElementById('set_replay').style.backgroundColor = "#ff0000";
    } else {
        document.getElementById('error_mes_info').classList.add('display');
        settings_click.style.backgroundColor = "#ff0000";
        settings_click.style.color = "#ffffff";
        document.getElementById('set_chienoffset').style.color = "#ffffff";
        document.getElementById('set_chienoffset').style.backgroundColor = "#ff0000";
    }
}

function error_shori1_checked() {
    if (localStorage.getItem('errorreload_onoff') == 'on') {
        if (Cookies.get('error_times') == null) {
            Cookies.set('error_times', 1);
            error_shori1();
        } else {
            var error_time = Number(Cookies.get('error_times'));
            error_time += 1;
            Cookies.set('error_times', error_time);
            if (Cookies.get('error_times') == localStorage.getItem('errorreload_sec')) {
                localStorage.setItem('quake_TimeApiDelay', 2);
                location.reload();
            }
        }
    } else {
        error_shori1();
    }
}
function error_shori1_checkednone() {
    if (localStorage.getItem('errorreload_onoff') == 'on') {
        if (Cookies.get('error_times') == null) {
            Cookies.set('error_times', 1);
        } else {
            var error_time = Number(Cookies.get('error_times'));
            error_time += 1;
            Cookies.set('error_times', error_time);
            if (Cookies.get('error_times') == localStorage.getItem('errorreload_sec')) {
                localStorage.setItem('quake_TimeApiDelay', 2);
                location.reload();
            }
        }
    } else {
    }
}

function error_shori_network() {
    if (localStorage.getItem('errorreload_onoff') == 'on') {
        if (localStorage.getItem('errorreload_network_onoff') == 'on') {
            if (Cookies.get('error_times') == null) {
                Cookies.set('error_times', 1);
            } else {
                var error_time = Number(Cookies.get('error_times'));
                error_time += 1;
                Cookies.set('error_times', error_time);
                if (Cookies.get('error_times') == localStorage.getItem('errorreload_sec')) {
                    location.reload();
                }
            }
        }
    }
}

document.getElementById('btn_note_top').addEventListener("click", () => {
    document.getElementById('note_top').style.display = "none";
});
document.getElementById('btn_note_top_ura').addEventListener("click", () => {
    document.getElementById('note_top').style.display = "initial";
});