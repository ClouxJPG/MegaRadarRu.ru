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
        name: "Архангельск",
        lat: 64.54,
        lon: 40.54,
        radius: 250
    },
    {
        name: "Брянск",
        lat: 53.25,
        lon: 34.37,
        radius: 250
    },
    {
        name: "Валдай",
        lat: 57.98,
        lon: 33.25,
        radius: 250
    },
    {
        name: "Волгоград",
        lat: 48.71,
        lon: 44.51,
        radius: 250
    },
    {
        name: "Ижевск",
        lat: 56.85,
        lon: 53.21,
        radius: 250
    },
    {
        name: "Казань",
        lat: 55.79,
        lon: 49.12,
        radius: 250
    },
    {
        name: "Смоленск",
        lat: 54.78,
        lon: 32.05,
        radius: 250
    },
    {
        name: "Ставрополь",
        lat: 45.04,
        lon: 41.97,
        radius: 250
    },
    {
        name: "Минеральные Воды",
        lat: 44.21,
        lon: 43.14,
        radius: 250
    },
    {
        name: "Уфа",
        lat: 54.74,
        lon: 55.97,
        radius: 250
    },
    {
        name: "Оренбург",
        lat: 51.77,
        lon: 55.10,
        radius: 250
    },
    {
        name: "Новосибирск",
        lat: 55.03,
        lon: 82.92,
        radius: 250
    },
    {
        name: "Барабинск",
        lat: 55.36,
        lon: 78.36,
        radius: 250
    },
    {
        name: "Екатеринбург",
        lat: 56.84,
        lon: 60.61,
        radius: 250
    },
    {
        name: "Пермь",
        lat: 58.01,
        lon: 56.25,
        radius: 250
    },
    {
        name: "Владивосток",
        lat: 43.12,
        lon: 131.89,
        radius: 250
    },
    {
        name: "Хабаровск",
        lat: 48.48,
        lon: 135.07,
        radius: 250
    },
    {
        name: "Петропавловск-Камчатский",
        lat: 53.05,
        lon: 158.65,
        radius: 250
    },
    {
        name: "Чита",
        lat: 52.03,
        lon: 113.50,
        radius: 250
    },
    {
        name: "Москва — Внуково",
        lat: 55.60,
        lon: 37.29,
        radius: 250
    },
    {
        name: "Москва — Шереметьево",
        lat: 55.97,
        lon: 37.41,
        radius: 250
    },
    {
        name: "Пулково",
        lat: 59.80,
        lon: 30.26,
        radius: 250
    },
    {
        name: "Воейково",
        lat: 59.95,
        lon: 30.72,
        radius: 250
    },
    {
        name: "Киров",
        lat: 58.60,
        lon: 49.66,
        radius: 250
    },
    {
        name: "Калуга",
        lat: 54.51,
        lon: 36.26,
        radius: 250
    },
    {
        name: "Петрозаводск",
        lat: 61.78,
        lon: 34.35,
        radius: 250
    },
    {
        name: "Калининград",
        lat: 54.71,
        lon: 20.51,
        radius: 250
    },
    {
        name: "Ростов-на-Дону",
        lat: 47.24,
        lon: 39.71,
        radius: 250
    },
    {
        name: "Краснодар",
        lat: 45.04,
        lon: 38.98,
        radius: 250
    },
    {
        name: "Астрахань",
        lat: 46.35,
        lon: 48.04,
        radius: 250
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
