// Zeitbereich
const minUnix = -4244572800000;   // 1835-07-01
const maxUnix = 1772319600000;  // 2026-03-01

const myslider = document.getElementById("time-slider");
const label = document.getElementById("time-label");


// Slider konfigurieren
myslider.min = minUnix;
myslider.max = maxUnix;
myslider.value = minUnix;//Standard: minUnix

// Startdatum
let currentDate = new Date(minUnix);//Standard: minUnix
const unixTime = currentDate.getTime();

// Anzeige aktualisieren
function updateLabel() {
  label.textContent = currentDate.toLocaleDateString("de-DE");
}



myslider.addEventListener("input", () => {
  const unixTime = parseInt(myslider.value);

  currentDate = new Date(unixTime);

  updateLabel(); // sofort
  updateVisibility();
  //updateMap();   // sofort
});

// Buttons
document.querySelectorAll("#time-control button").forEach(btn => {
  btn.addEventListener("click", () => {
    const step = parseInt(btn.dataset.step);
    const unit = btn.dataset.unit;

    if (unit === "day") currentDate.setDate(currentDate.getDate() + step);
    if (unit === "month") currentDate.setMonth(currentDate.getMonth() + step);
    if (unit === "year") currentDate.setFullYear(currentDate.getFullYear() + step);

    let unix = currentDate.getTime();
    
    // Begrenzen
    unix = Math.max(minUnix, Math.min(maxUnix, unix));

    currentDate = new Date(unix);
    myslider.value = unix;

    updateLabel();
    updateVisibility();
  });
});

// Initial
updateLabel();

const provider = new Cesium.UrlTemplateImageryProvider({
    url: 'https://wmtsod1.bayernwolke.de/wmts/by_webkarte/smerc/{z}/{x}/{y}',
    //url: 'https://wmtsod1.bayernwolke.de/wmts/by_dop/smerc/{z}/{x}/{y}',
    minimumLevel: 0,
    maximumLevel: 19,
    credit: 'Bayerische Vermessungsverwaltung - www.geodaten.bayern.de (Daten verändert)'
  });

  var viewer = new Cesium.Viewer("cesiumContainer", {
    imageryProvider : provider,
    // terrainProvider: 
    //   new Cesium.CesiumTerrainProvider({
    //     url: 'https://bvv3d21.bayernwolke.de/3d-data/latest/terrain/'}),
    baseLayerPicker: false,
    animation : false,
    timeline: false
  });

  //   url: "",
  //   url: "https://haas-do.github.io/zeitreise-edelsfeld/data/3dtiles-hintergrund/hintergrund2/tileset.json",
  //   url: "https://haas-do.github.io/zeitreise-edelsfeld/data/3dtiles-hintergrund/vegetationsflaeche/tileset.json",
  //   url: "https://haas-do.github.io/zeitreise-edelsfeld/data/3dtiles-hintergrund/verkehrslinie/tileset.json",

  const tilesets = [
    new Cesium.Cesium3DTileset({
        url: "https://haas-do.github.io/zeitreise-edelsfeld/data/3dtiles-11-3857/tileset.json"
    }),

    new Cesium.Cesium3DTileset({
        url: "https://haas-do.github.io/zeitreise-edelsfeld/data/3dtiles-hintergrund/gewaesserflaeche/tileset.json"
    }),

    new Cesium.Cesium3DTileset({
        url: "https://haas-do.github.io/zeitreise-edelsfeld/data/3dtiles-hintergrund/siedlungsflaeche/tileset.json"
    }),

    new Cesium.Cesium3DTileset({
        url: "https://haas-do.github.io/zeitreise-edelsfeld/data/3dtiles-hintergrund/vegetationsflaeche/tileset.json",
    }),

    new Cesium.Cesium3DTileset({
        url: "https://haas-do.github.io/zeitreise-edelsfeld/data/3dtiles-hintergrund/hintergrund/tileset.json"
    }),

    new Cesium.Cesium3DTileset({
        url: "https://haas-do.github.io/zeitreise-edelsfeld/data/3dtiles-hintergrund/hintergrund2/tileset.json"
    }),

        new Cesium.Cesium3DTileset({
        url: "https://haas-do.github.io/zeitreise-edelsfeld/data/3dtiles-hintergrund/verkehrslinie/tileset.json"
    })
  ];

  // Gebäude Tileset  
  var cityStyle = new Cesium.Cesium3DTileStyle({
        color : {
            conditions : [
                ["${klasse} === 'Wohngebäude'", "color('rgb(179, 179, 179)')"],
                ["${klasse} === 'Gebäude für Wirtschaft und Gewerbe'", "color('rgb(179, 179, 179)')"],
                ["${klasse} === 'Gebäude für Wirtschaft oder Gewerbe'", "color('rgb(179, 179, 179)')"],
                ["${klasse} === 'Garage'", "color('rgb(179, 179, 179)')"],
                ["${klasse} === 'Kirche'", "color('rgb(193, 160, 161)')"],
                ["${klasse} === 'Rathaus'", "color('rgb(193, 160, 161)')"],
                ["${klasse} === 'Feuerwehr'", "color('rgb(193, 160, 161)')"],
                ["${klasse} === 'Kinderkrippe, Kindergarten, Kindertagesstätte'", "color('rgb(193, 160, 161)')"],
                ["${klasse} === 'Gebäude für Bildung und Forschung'", "color('rgb(193, 160, 161)')"],
                ["${klasse} === 'See'", "color('#A5BEEB')"],
                ["${klasse} === 'Rückhaltebecken'", "color('#A5BEEB')"],
                ["${klasse} === 'Siedlung'", "color('rgb(240, 230, 239)')"],
                ["${klasse} === 'Industrie- und Gewerbefläche'", "color('rgb(221,218,226)')"],
                ["${klasse} === 'Nadelholz'", "color('rgb(154,182,109)')"],
                ["${klasse} === 'Grünland'", "color('rgb(244, 250, 229)')"],
            ]
        }
    });
    tilesets.style = cityStyle;

    tilesets.forEach(tileset => {tileset.style = cityStyle;});

    //tilesets.imageBasedLighting.imageBasedLightingFactor = new Cesium.Cartesian2(13.0, 13.0);


  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(11.69573, 49.57710, 860), 
    orientation: {
      heading: Cesium.Math.toRadians(0),//Zeigt nach Norden
      pitch: Cesium.Math.toRadians(-90),//Neigung
      roll: 0
    },
    duration: 0
  });

// Alle Tilesets zu Cesium hinzufügen
tilesets.forEach(tileset => {
    viewer.scene.primitives.add(tileset);
});


// ============================================================
// GELADENE TILES
// ============================================================

// Hier werden alle geladenen Tiles aus allen Tilesets gespeichert
const loadedTiles = [];


// ============================================================
// TILE LOAD FÜR ALLE TILESETS
// ============================================================

tilesets.forEach(tileset => {

    tileset.tileLoad.addEventListener(function(tile) {

        const content = tile.content;

        if (!Cesium.defined(content) || !content.featuresLength) {
            return;
        }

        // Tile speichern
        loadedTiles.push(tile);

        // Attribute aller Features auslesen
        for (let i = 0; i < content.featuresLength; i++) {

            const feature = content.getFeature(i);

            feature._e_epoche =
                Number(feature.getProperty("e_epoche"));

            feature._u_epoche =
                Number(feature.getProperty("u_epoche"));
        }

        // Zeitfilter anwenden
        updateVisibility();
    });
});


// ============================================================
// SICHTBARKEIT AKTUALISIEREN
// ============================================================

function updateVisibility() {

    const currentUnix = currentDate.getTime();

    loadedTiles.forEach(tile => {

        const content = tile.content;

        if (!Cesium.defined(content) || !content.featuresLength) {
            return;
        }

        for (let i = 0; i < content.featuresLength; i++) {

            const feature = content.getFeature(i);

            feature.show =
                currentUnix >= feature._e_epoche &&
                currentUnix <= feature._u_epoche;
        }
    });
}

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function(click){
        const feature = viewer.scene.pick(click.position);
        console.log(feature);
        if(Cesium.defined(feature)){
            console.log(feature.getProperty);
        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);