//========================================
//Zeitsteuerung
//========================================    

// Zeitbereich des Sliders
const minUnix = -4244572800000;   // 1835-07-01
const maxUnix = 1772319600000;  // 2026-03-01

const slider = document.getElementById("time-slider");
const label = document.getElementById("time-label");

// Slider konfigurieren
slider.min = minUnix;
slider.max = maxUnix;
slider.value = minUnix;//Standard: minUnix

// Startdatum
let currentDate = new Date(minUnix);//Standard: minUnix

// Anzeige aktualisieren
function updateLabel() {
  label.textContent = currentDate.toLocaleDateString("de-DE");
}

// Definition des Zeitfilter
function buildTimeFilter(unixTime) {
  return [
    "all",
    ["<=", ["get", "e_epoche"], unixTime],
    [
      "any",
      [">=", ["get", "u_epoche"], unixTime],
      ["!", ["has", "u_epoche"]]
    ]
  ];
}

// Anwendung des Zeitfilters und Deklarierung aller sonstigen Filter
function updateMap() {
  const unixTime = currentDate.getTime();
  const timefilter = buildTimeFilter(unixTime);

const layers = [
  ""
];

layers.forEach(layer => {
    if (map.getLayer(layer)) {
      map.setFilter(layer, timefilter);
    }
  });

  map.setFilter("zr_Gebaeude3D_nicht_oeffentlich", ["all",timefilter,["match",["get", "klasse"],["DTK25-NDFK","Gebäude für Wirtschaft oder Gewerbe","Wohngebäude","Überdachung","Garage","Nach Quellenlage nicht zu spezifizieren","Umformer","Wehr","Wasserbehälter","Historische Mauer","Kaserne","Tiefgarage","Parkhaus","Staumauer","Kammerschleuse"],true,false]]);
  map.setFilter("zr_Gebaeude3D_oeffentlich", ["all",timefilter,["match",["get", "klasse"],["DTK25-NDFK","Gebäude für Wirtschaft oder Gewerbe","Wohngebäude","Überdachung","Garage","Nach Quellenlage nicht zu spezifizieren","Umformer","Brücke","Wehr","Wasserbehälter","Historische Mauer","Kaserne","Tiefgarage","Parkhaus","Staumauer","Kammerschleuse"],false,true]]);
}

//Update des Datums bei Veränderung des Sliders
slider.addEventListener("input", () => {
  const unixTime = parseInt(slider.value);

  currentDate = new Date(unixTime);

  updateLabel();
  updateMap();
});

// Definiton der Buttons der Zeitsteurung
document.querySelectorAll("#time-control button").forEach(btn => {
  btn.addEventListener("click", () => {
    const step = parseInt(btn.dataset.step);
    const unit = btn.dataset.unit;

    if (unit === "day") currentDate.setDate(currentDate.getDate() + step);
    if (unit === "month") currentDate.setMonth(currentDate.getMonth() + step);
    if (unit === "year") currentDate.setFullYear(currentDate.getFullYear() + step);

    let unix = currentDate.getTime();
    
    // Begrenzung der Funktionalität innerhalb des Zeitintervalls
    unix = Math.max(minUnix, Math.min(maxUnix, unix));

    currentDate = new Date(unix);
    slider.value = unix;

    updateLabel();
    updateMap();
  });
});

// Initiales Update der Zeitanzeige
updateLabel();
//========================================
//Karteninhalt
//========================================

//Laden der Kartenquellen und Layer
mapboxgl.accessToken =
  "pk.eyJ1IjoiaGFhcy1kbyIsImEiOiJjbWZ5eXR0ZzkwM2w5MmtxeXUxNjYwdmQyIn0.JabLD01uXkzxBH0s_9Xyew";

const map = new mapboxgl.Map({
        container: 'map',
        style: 'https://vtod1.bayernwolke.de/styles/by_style_light.json',
        hash:true,
        zoom: 16,
        center: [11.69573, 49.57710],
        minZoom: 12,           // Minimaler Zoom
        maxZoom: 20,          // Maximaler Zoom
        maxBounds: [
            [11.55177, 49.48522], // Südwestliche räumliche Begrenzung der Karte
            [11.83918, 49.67145] // Nordöstliche Begrenzung der Karte
        ]
    });

    //Festlegen der Steuerungsoptionen
    map.addControl(new mapboxgl.NavigationControl({
        visualizePitch: true,
        visualizeRoll: true,
        showZoom: true,
        showCompass: true
    }));

    //Kartentitel
    // Ausblenden des Titels nach 5 Sekunden
    function hideTitle() {
    document.getElementById("mapTitle").classList.add("hide");
    }

    map.once("dragstart", hideTitle);
    map.once("zoomstart", hideTitle);
    map.once("rotatestart", hideTitle);

    setTimeout(hideTitle, 5000);


    map.on('load', () => {
        map.addSource('zr', {
            type: 'vector',
            url: "https://haas-do.github.io/zeitreise-edelsfeld/data/pmtiles-3857/zeitreise_3857.pmtiles"
        }
    );
      map.addLayer({
            'id': 'zr_Gebaeude3D_nicht_oeffentlich',
            'type': 'fill-extrusion',
            'source': 'zr',
            'source-layer': 'Gebaeudeflaeche',
            "minzoom": 14,
            "paint": {
            "fill-extrusion-color": "rgb(179,179,179)",
            "fill-extrusion-height": [
            "get",
            "hoehe"
            ],
            "fill-extrusion-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                0,
                14.5,
                0.7
                ]
        }
        });

        
        map.addLayer({
            'id': 'zr_Gebaeude3D_oeffentlich',
            'type': 'fill-extrusion',
            'source': 'zr',
            'source-layer': 'Gebaeudeflaeche',
            "minzoom": 14.5,
            "paint": {
            "fill-extrusion-color": "rgb(193,160,161)",
            "fill-extrusion-height": [
            "get",
            "hoehe"
            ],
            "fill-extrusion-opacity": 0.7
        }
        });
    updateMap();
});
