/* =========================================================
   RADAR RUSSIA
   script.js
   Карта + ДМРЛ + зоны покрытия
   Leaflet подключается в index.html:
   https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
   ========================================================= */
/* =========================================================
   1. СОЗДАНИЕ КАРТЫ
   ========================================================= */
const map = L.map("map", {
    zoomControl: true,
    attributionControl: true,
    minZoom: 3,
    maxZoom: 12
});
/* =========================================================
   2. БАЗОВАЯ КАРТА
   ========================================================= */
const baseMap = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }
);
baseMap.addTo(map);
/* =========================================================
   3. НАЧАЛЬНЫЙ ВИД
   ========================================================= */
map.setView([61.5, 95.0], 3);
/* =========================================================
   4. СЛОЙ РАДАРОВ
   ========================================================= */
const radarLayer = L.layerGroup().addTo(map);
const coverageLayer = L.layerGroup().addTo(map);
/* =========================================================
   5. РАДАРЫ ДМРЛ
   =========================================================
   radius = радиус покрытия в километрах.
   Координаты являются координатами радиолокационных
   пунктов/ориентиров и должны быть дополнительно
   сверены перед использованием как официального
   каталога радаров.
   Основная задача этого массива — создать рабочую
   структуру сайта.
   ========================================================= */
const radars = [
    {
        id: "barabinsk",
        name: "Барабинск",
        lat: 55.3500,
        lon: 78.3000,
        radius: 250000
    },

    {
        id: "kursk",
        name: "Курск",
        lat: 51.8667,
        lon: 36.1333,
        radius: 250000
    },

    {
        id: "volgograd",
        name: "Волгоград",
        lat: 48.7833,
        lon: 44.3333,
        radius: 250000
    },

    {
        id: "orel",
        name: "Орёл",
        lat: 53.0000,
        lon: 36.0000,
        radius: 250000
    }
];
/* =========================================================
   6. ИКОНКА РАДАРА
   ========================================================= */
const radarIcon = L.divIcon({
    className: "radar-marker",
    html: `
        <div style="
            width:18px;
            height:18px;
            border-radius:50%;
            background:#111;
            border:3px solid #00aaff;
            box-shadow:
                0 0 0 3px rgba(0,170,255,.25),
                0 0 12px rgba(0,170,255,.8);
        "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
});
/* =========================================================
   7. ФОРМАТИРОВАНИЕ КООРДИНАТ
   ========================================================= */
function formatCoord(value, type) {
    const direction =
        type === "lat"
            ? value >= 0 ? "с.ш." : "ю.ш."
            : value >= 0 ? "в.д." : "з.д.";
    return `${Math.abs(value).toFixed(4)}° ${direction}`;
}
/* =========================================================
   8. ДОБАВЛЕНИЕ РАДАРОВ
   ========================================================= */
radars.forEach((radar) => {
    /* ---------- Маркер ---------- */
    const marker = L.marker(
        [radar.lat, radar.lon],
        {
            icon: radarIcon,
            title: `ДМРЛ ${radar.name}`
        }
    );
    /* ---------- Popup ---------- */
    marker.bindPopup(`
        <div style="
            min-width:190px;
            font-family:Arial,sans-serif;
        ">
            <div style="
                font-size:16px;
                font-weight:700;
                margin-bottom:8px;
            ">
                ДМРЛ ${radar.name}
            </div>
            <div style="margin-bottom:5px;">
                <b>Широта:</b>
                ${formatCoord(radar.lat, "lat")}
            </div>
            <div style="margin-bottom:5px;">
                <b>Долгота:</b>
                ${formatCoord(radar.lon, "lon")}
            </div>
            <div>
                <b>Зона обзора:</b>
                ${radar.radius} км
            </div>
        </div>
    `);
    marker.addTo(radarLayer);
    /* ---------- Зона покрытия ---------- */
    const circle = L.circle(
        [radar.lat, radar.lon],
        {
            radius: radar.radius * 1000,
            color: "#00aaff",
            weight: 1,
            opacity: 0.7,
            fillColor: "#00aaff",
            fillOpacity: 0.04
        }
    );
    circle.bindTooltip(
        `Зона ДМРЛ: ${radar.name}`,
        {
            sticky: true
        }
    );
    circle.addTo(coverageLayer);
});
/* =========================================================
   9. КНОПКА "ЗОНЫ ПОКРЫТИЯ"
   ========================================================= */
const coverageButton =
    document.getElementById("coverageBtn");
let coverageVisible = true;
if (coverageButton) {
    coverageButton.addEventListener(
        "click",
        () => {
            if (coverageVisible) {
                map.removeLayer(coverageLayer);
                coverageButton.textContent =
                    "Показать зоны";
                coverageVisible = false;
            } else {
                coverageLayer.addTo(map);
                coverageButton.textContent =
                    "Зоны покрытия";
                coverageVisible = true;
            }
        }
    );
}
/* =========================================================
   10. ГЕОЛОКАЦИЯ
   ========================================================= */
const locateButton =
    document.getElementById("locate");
if (locateButton) {
    locateButton.addEventListener(
        "click",
        () => {
            map.locate({
                setView: true,
                maxZoom: 10,
                enableHighAccuracy: true
            });
        }
    );
}
map.on(
    "locationfound",
    (event) => {
        L.circleMarker(
            event.latlng,
            {
                radius: 7,
                color: "#ffffff",
                weight: 3,
                fillColor: "#2d7cff",
                fillOpacity: 1
            }
        )
        .addTo(map)
        .bindPopup("Ваше местоположение")
        .openPopup();
    }
);
map.on(
    "locationerror",
    () => {
        alert(
            "Не удалось определить местоположение."
        );
    }
);
/* =========================================================
   11. АВТОМАСШТАБ ПО РАДАРАМ
   ========================================================= */
function fitRadarCoverage() {
    const points = [];
    radars.forEach(
        radar => {
            points.push([
                radar.lat,
                radar.lon
            ]);
        }
    );
    if (points.length > 0) {
        const bounds =
            L.latLngBounds(points);
        map.fitBounds(
            bounds,
            {
                padding: [30, 30]
            }
        );
    }
}
/* =========================================================
   12. СТИЛЬ РАДАРНЫХ МАРКЕРОВ
   ========================================================= */
const radarMarkerStyle = document.createElement(
    "style"
);
radarMarkerStyle.textContent = `
.radar-marker {
    background: transparent !important;
    border: none !important;
}
`;
document.head.appendChild(
    radarMarkerStyle
);
/* =========================================================
   13. ЗАГОТОВКА ДЛЯ БУДУЩЕГО РАДАРНОГО СЛОЯ
   ========================================================= */
/*
   Здесь позже подключим настоящий источник
   отражаемости / интенсивности осадков.
   Пример:
   const radarReflectivity = L.tileLayer(
       RADAR_URL,
       {
           opacity: 1
       }
   );
   radarReflectivity.addTo(map);
*/
/* =========================================================
   14. ЗАГОТОВКА ДЛЯ ЛЕГЕНДЫ dBZ
   ========================================================= */
function createRadarLegend() {
    const legend =
        L.control({
            position: "bottomright"
        });
    legend.onAdd = function () {
        const div =
            L.DomUtil.create(
                "div",
                "radar-legend"
            );
        div.innerHTML = `
            <div style="
                background:rgba(20,20,20,.92);
                color:white;
                padding:10px;
                border-radius:10px;
                box-shadow:0 0 12px rgba(0,0,0,.3);
                font-size:12px;
            ">
                <div style="
                    font-weight:700;
                    margin-bottom:7px;
                ">
                    Отражаемость
                </div>
                <div style="
                    display:flex;
                    height:12px;
                    width:180px;
                ">
                    <span style="
                        flex:1;
                        background:#00bfff;
                    "></span>
                    <span style="
                        flex:1;
                        background:#00ff00;
                    "></span>
                    <span style="
                        flex:1;
                        background:#ffff00;
                    "></span>
                    <span style="
                        flex:1;
                        background:#ff9900;
                    "></span>
                    <span style="
                        flex:1;
                        background:#ff0000;
                    "></span>
                    <span style="
                        flex:1;
                        background:#ff00ff;
                    "></span>
                </div>
                <div style="
                    display:flex;
                    justify-content:space-between;
                    width:180px;
                    margin-top:4px;
                ">
                    <span>10</span>
                    <span>30</span>
                    <span>40</span>
                    <span>50</span>
                    <span>60+</span>
                </div>
            </div>
        `;
        return div;
    };
    legend.addTo(map);
}
/* =========================================================
   15. СОЗДАЁМ ЛЕГЕНДУ
   ========================================================= */
createRadarLegend();
/* =========================================================
   16. ГОТОВО
   ========================================================= */
console.log(
    `Radar Russia: загружено ${radars.length} радиолокационных пунктов`
);
