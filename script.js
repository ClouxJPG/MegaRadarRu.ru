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
    { id: "Архангельск", name: "Архангельск", lat: 64.6167, lon: 40.5000, radius: 250000 },
    { id: "Валдай", name: "Валдай", lat: 57.9833, lon: 33.2500, radius: 250000 },
    { id: "Владивосток", name: "Владивосток", lat: 43.1150, lon: 131.8850, radius: 250000 },
    { id: "Внуково", name: "Внуково (Москва)", lat: 55.6031, lon: 37.2922, radius: 250000 },
    { id: "Воейково", name: "Воейково (СПб)", lat: 60.0000, lon: 30.4000, radius: 250000 },
    { id: "Волгоград", name: "Волгоград", lat: 48.7833, lon: 44.3333, radius: 250000 },
    { id: "Вологда", name: "Вологда", lat: 59.2167, lon: 39.9000, radius: 250000 },
    { id: "Воронеж", name: "Воронеж", lat: 51.6667, lon: 39.1667, radius: 250000 },
    { id: "Ижевск", name: "Ижевск", lat: 56.8333, lon: 53.1833, radius: 250000 },
    { id: "Казань", name: "Казань", lat: 55.7833, lon: 49.1167, radius: 250000 },
    { id: "Калевала", name: "Калевала", lat: 65.2000, lon: 31.2000, radius: 250000 },
    { id: "Калининград", name: "Калининград", lat: 54.7000, lon: 20.5000, radius: 250000 },
    { id: "Краснодар", name: "Краснодар", lat: 45.0333, lon: 39.0000, radius: 250000 },
    { id: "Красный Кут", name: "Красный Кут", lat: 50.9500, lon: 46.9667, radius: 250000 },
    { id: "Махачкала", name: "Махачкала", lat: 43.0000, lon: 47.5000, radius: 250000 },
    { id: "Миллерово", name: "Миллерово", lat: 48.9167, lon: 40.4000, radius: 250000 },
    { id: "Минеральные Воды", name: "Минеральные Воды", lat: 44.4336, lon: 43.9031, radius: 250000 },
    { id: "Мурманск", name: "Мурманск", lat: 68.9667, lon: 33.0833, radius: 250000 },
    { id: "Ниж. Новгород", name: "Нижний Новгород", lat: 56.3167, lon: 44.0000, radius: 250000 },
    { id: "Новосибирск", name: "Новосибирск", lat: 55.0302, lon: 82.9204, radius: 250000 },
    { id: "Пермь", name: "Пермь", lat: 58.0000, lon: 56.3167, radius: 250000 },
    { id: "Петрозаводск", name: "Петрозаводск", lat: 61.7833, lon: 34.3333, radius: 250000 },
    { id: "Петропавловск-Камч", name: "Петропавловск-Камчатский", lat: 53.0333, lon: 158.6500, radius: 250000 },
    { id: "Псков", name: "Псков", lat: 57.8167, lon: 28.3333, radius: 250000 },
    { id: "Самара", name: "Самара", lat: 53.2000, lon: 50.1500, radius: 250000 },
    { id: "Саранск", name: "Саранск", lat: 54.1833, lon: 45.1667, radius: 250000 },
    { id: "Саратов", name: "Саратов", lat: 51.5667, lon: 46.0333, radius: 250000 },
    { id: "Смоленск", name: "Смоленск", lat: 54.7833, lon: 32.0500, radius: 250000 },
    { id: "Сочи-Адлер", name: "Сочи-Адлер", lat: 43.4491, lon: 39.9154, radius: 250000 },
    { id: "Ставрополь", name: "Ставрополь", lat: 45.0500, lon: 41.9667, radius: 250000 },
    { id: "Тамбов", name: "Тамбов", lat: 52.7167, lon: 41.4333, radius: 250000 },
    { id: "Тюмень", name: "Тюмень", lat: 57.1500, lon: 65.5333, radius: 250000 },
    { id: "Уфа", name: "Уфа", lat: 54.7333, lon: 55.9667, radius: 250000 },
    { id: "Челябинск", name: "Челябинск", lat: 55.1500, lon: 61.4000, radius: 250000 }
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
