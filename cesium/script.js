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
    url: 'https://wmtsod1.bayernwolke.de/wmts/by_webkarte_grau/smerc/{z}/{x}/{y}',
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

  //Dein lokales Tileset
  const tileset = new Cesium.Cesium3DTileset({
    //url: "http://localhost:5500/output/tileset.json"
    url: "https://haas-do.github.io/zeitreise-edelsfeld/data/3dtiles-11-3857/tileset.json",
    color:'red'
  });

  viewer.scene.primitives.add(tileset);

  const loadedTiles = [];

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(11.69573, 49.57710, 860), 
    orientation: {
      heading: Cesium.Math.toRadians(0),//Zeigt nach Norden
      pitch: Cesium.Math.toRadians(-45),//Neigung
      roll: 0
    },
    duration: 0
  });

//==================== 
//Zeitlogik
//====================

    tileset.tileLoad.addEventListener(function(tile) {
        const content = tile.content;
        if (!Cesium.defined(content) || !content.featuresLength)
            return;
        loadedTiles.push(tile);
        for (let i = 0; i < content.featuresLength; i++) {
            const feature = content.getFeature(i);
            feature._e_epoche = Number(feature.getProperty("e_epoche"));
            feature._u_epoche = Number(feature.getProperty("u_epoche"));
        }
        updateVisibility();
    });

    function updateVisibility() {
    const currentUnix = currentDate.getTime();
    loadedTiles.forEach(tile => {

        const content = tile.content;
        if (!Cesium.defined(content) || !content.featuresLength)
            return;
        for (let i = 0; i < content.featuresLength; i++) {
            const feature = content.getFeature(i);
            feature.show =
                currentUnix >= feature._e_epoche &&
                currentUnix <= feature._u_epoche;
            }
        });
    };

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function(click){
        const feature = viewer.scene.pick(click.position);
        console.log(feature);
        if(Cesium.defined(feature)){
            console.log(feature.getProperty);
        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);