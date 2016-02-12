/*
 *  initMap.js
 *  Utility Viewer Template
 *
 *  Created by Michael Heirendt on 5/1/2015.
 *  Copyright 2015 mheirendt. All rights reserved.
 *
 */

var app = {};
var map;                            //Map object
var graphic;
var isiOS = false;                  //This variable will be set to 'true' if the application is accessed from iPhone or iPad
var isBrowser = false;              //This variable will be set to 'true' when application is accessed from desktop browsers
var isTablet = false;               //This variable will be set to 'true' when application is accessed from tablet device
var isMobileDevice = false;         //This variable will be set to 'true' when application is accessed from mobile phone device
var isOrientationChanged = false;   //variable to store the flag on orientation
var searchTab = false;              //Flag for if the search sidebar interface is shown or hidden
var findTab = false;                //Flag for if you are actively identifying features
var measureTab = false;             //Flag for if the measuring sidebar interface is shown or hidden
var printTab = false;               //Flag for if the printing sidebar interface is shown or hidden
var legendTab = false;              //Flag for if the legend sidebar interface is shown or hidden
var basemapTab = false;             //Flag for if the basemap selection sidebar interface is shown or hidden
var helpTab = false;                //Flag for if the help sidebar interface is shown or hidden
require([
    "dojo/dom",
    "dojo/parser",
    "dojo/ready",
    "dojo/on",
    "dijit/registry",
    "dojo/_base/connect",
    "esri/config",
    "esri/map",
    "esri/dijit/Scalebar",
    "esri/geometry/scaleUtils",
    "esri/geometry/Point",
    "js/TocWidget",
    "js/KineticPanning",
    "esri/InfoTemplate",
    "esri/dijit/PopupTemplate",
    "esri/tasks/GeometryService",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/tasks/IdentifyTask",
    "esri/tasks/IdentifyParameters",
    "esri/dijit/Popup",
    "esri/dijit/InfoWindow",
    "esri/domUtils",
    "esri/arcgis/utils",
    "dojo/promise/all",
    "dojo/_base/array",
    "esri/Color",
    "dojo/dom-construct",
    "dojo/dom-style",
    "esri/graphic",
    "dojo/_base/declare",
    "esri/dijit/Measurement",
    "esri/dijit/BasemapGallery",
    "esri/layers/FeatureLayer",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/dijit/Search",
    "esri/tasks/locator",
    'dojo/_base/lang',
    'dojox/lang/functional',
    "esri/dijit/Print",
    "esri/tasks/PrintTemplate",
    "esri/request",
    "dijit/layout/BorderContainer",
    "dijit/layout/AccordionContainer",
    "dijit/layout/AccordionPane",
    "dijit/layout/ContentPane",
    "dojo/domReady!"
], function (
    dom,
    parser,
    ready,
    on,
    registry,
    connect,
    esriConfig,
    Map,
    Scalebar,
    scaleUtils,
    Point,
    TocWidget,
    KineticPanning,
    InfoTemplate,
    PopupTemplate,
    GeometryService,
    SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    PictureMarkerSymbol,
    IdentifyTask,
    IdentifyParameters,
    Popup,
    InfoWindow,
    domUtils,
    arcgisUtils,
    All,
    array,
    Color,
    domConstruct,
    domStyle,
    Graphic,
    declare,
    Measurement,
    BasemapGallery,
    FeatureLayer,
    ArcGISDynamicMapServiceLayer,
    Search,
    Locator,
    lang,
    func,
    Print,
    PrintTemplate,
    esriRequest,
    BorderContainer,
    AccordionContainer,
    AccordionPane,
    ContentPane
  ){
    parser.parse();
    //proxy is required for larger tasks like printing a map over 1 MB
    esriConfig.defaults.io.proxyUrl = pProxyPath;
    esriConfig.defaults.io.alwaysUseProxy = false;
    esri.config.defaults.io.timeout = 90000;
    esriConfig.defaults.geometryService = new GeometryService(pGeometryService);
    //Function to enable mobile orientation changing
    function orientationChanged() {
        if (map) {
            isOrientationChanged = true;
            console.log(["orientation Changed"]);
            var timeout = (isMobileDevice && isiOS) ? 100 : 500;
            map.reposition();
            map.resize();
        }}
    //Variables to store dimensions of screen in order to optimize performance for mobile, tablet, and desktop.
    ////conditional statements
    //For phone only search "isMobileDevice"
    //For Tablet only search "isTablet"
    //For Browser only search for "isBrowser"
    var userAgent = window.navigator.userAgent;
    if ((userAgent.indexOf("Android") >= 0 && userAgent.indexOf("Mobile") >= 0) || userAgent.indexOf("iPhone") >= 0) {
        fontSize = 15;
        isMobileDevice = true;
        dojo.byId("dynamicStyleSheet").href = "styles/mobile.css";
    } else if ((userAgent.indexOf("iPad") >= 0) || (userAgent.indexOf("Android") >= 0)) {
        fontSize = 14;
        isTablet = true;
        dojo.byId("dynamicStyleSheet").href = "styles/tablet.css";
    } else {
        isBrowser = true;
    }
        function ShowProgressIndicator(nodeId) {
            dojo.byId('divLoadingIndicator').style.display = "inline-block";
        }
        function HideProgressIndicator() {
            dojo.byId('divLoadingIndicator').style.display = "none";
            if (isMobileDevice) {
                if (map) {
                    var ext = map.extent;
                    ext.xmin = (map.extent.xmin + 2);
                    map.setExtent(ext);
                    map.resize();
                    map.reposition();
                }}}
    var loadCount = 0;
    var lods = [{
        "level": 5,
        "resolution": 4891.969824,
        "scale": 18489297.728
    }, {
        "level": 6,
        "resolution": 2445.984912,
        "scale": 9244648.86
    }, {
        "level": 7,
        "resolution": 1222.992456,
        "scale": 4622324.43
    }, {
        "level": 8,
        "resolution": 611.496228,
        "scale": 2311162.22
    }, {
        "level": 9,
        "resolution": 305.748114,
        "scale": 1155581.11
    }, {
        "level": 10,
        "resolution": 152.8740569564952,
        "scale": 577790.554352
    }, {
        "level": 11,
        "resolution": 76.4370282850732,
        "scale": 288895.277144
    }, {
        "level": 12,
        "resolution": 38.2185141425366,
        "scale": 144447.638572
    }, {
        "level": 13,
        "resolution": 19.1092570712683,
        "scale": 72223.819286
    }, {
        "level": 14,
        "resolution": 9.55462853563415,
        "scale": 36111.909643
    }, {
        "level": 15,
        "resolution": 4.77731426794937,
        "scale": 18055.954822
    }, {
        "level": 16,
        "resolution": 2.38865713397468,
        "scale": 9027.977411
    }, {
        "level": 17,
        "resolution": 1.1943285668550503,
        "scale": 4513.988705
    }, {
        "level": 18,
        "resolution": 0.5971642835598172,
        "scale": 2256.994353
    }, {
        "level": 19,
        "resolution": 0.29858214164761665,
        "scale": 1128.497176
    }, {
        "level": 20,
        "resolution": 0.149291070823808,
        "scale": 564.248588
    }, {
        "level": 21,
        "resolution": 0.074645535411904,
        "scale": 282.124294
    }, {
        "level": 22,
        "resolution": 0.037322767705952,
        "scale": 141.062147
    }, {
        "level": 23,
        "resolution": 0.018661383852976,
        "scale": 70.5310735
    }, {
        "level": 24,
        "resolution": 0.009330691926488,
        "scale": 35.26553675
    }];
    var defaultBasemap = new esri.layers.ArcGISTiledMapServiceLayer(pDefaultBasemap, {
    });
    function initmap() {
        map = new Map("map", {
            center: pOriginCoordinates,
            zoom: pZoom,
            lods: lods,
            sliderOrientation: "horizontal",
            sliderPosition: "bottom-right"
        });
        var panning = new KineticPanning(map);
        //creates a scale bar on the bottom center of the map tag
        var scalebar = new Scalebar({
            map: map,
            scalebarUnit: "english",
            attachTo:"bottom-center"
        });
        //Custom cursor customization for hand dragging on pan
        if (isBrowser) {
            map.setMapCursor("url(cursors/cursor.cur),auto");
            on(map, "pan", function pan() {
                map.setMapCursor("url(cursors/grabbed.cur),auto");
            });
            on(map, "pan-start", function pan() {
                map.setMapCursor("url(cursors/grabbed.cur),auto");
            });
            on(map, "pan-end", function pan() {
                map.setMapCursor("url(cursors/cursor.cur),auto");
            });
        }
        map.addLayer(defaultBasemap);
        if (isBrowser === true) {
            map.infoWindow.set("popupWindow", false);
        }
        dojo.connect(map, "onLoad", mapReady);
        function mapReady(map) {
            dojo.connect(map, "onClick", runIdentifies);
            initializeSidebar(map);
            search.startup();
        }
        function runIdentifies(evt) {
            if (isBrowser) {
                if (measureTab == false) {
                    map.setMapCursor("wait");
                };
            };
            //send the results of the identify task to an array
            identifyResults = [];
            idPoint = evt.mapPoint;
            var layers = dojo.map(map.layerIds, function (layerId) {
                return map.getLayer(layerId);
            });
            layers = dojo.filter(layers, function (layer) {
                if (layer.visibleLayers[0] !== -1) {
                    return layer.getImageUrl && layer.visible;
                }
            });
            var tasks = dojo.map(layers, function (layer) {
                return new esri.tasks.IdentifyTask(layer.url);
            }); //map each visible dynamic layer to a new identify task, using the layer url  
            var defTasks = dojo.map(tasks, function (task) {
                return new dojo.Deferred();
            }); //map each identify task to a new dojo.Deferred  
            var params = createIdentifyParams(layers, evt);
            var promises = [];
            for (i = 0; i < tasks.length; i++) {
                promises.push(tasks[i].execute(params[i])); //Execute each task  
            }
            var allPromises = new All(promises);
            allPromises.then(function (r) { showIdentifyResults(r, tasks); });
        }
        function showIdentifyResults(r, tasks) {
            //display identify cursor on task completion
            if (isBrowser) {
                if (measureTab == false) {
                    map.setMapCursor("url(cursors/moveIdentify.cur),auto");
                };
            };
            var results = [];
            var taskUrls = [];
            r = dojo.filter(r, function (result) {
                return r[0];
            });
            for (i = 0; i < r.length; i++) {
                results = results.concat(r[i]);
                for (j = 0; j < r[i].length; j++) {
                    taskUrls = taskUrls.concat(tasks[i].url);
                }
            }
            results = dojo.map(results, function (result, index) {
                var feature = result.feature;
                var layerName = result.layerName;
                var serviceUrl = taskUrls[index];
                feature.attributes.layerName = result.layerName;
                result.layerName = layerName;
                if (layerName === 'Parcels') {
                    var featureLayerTemplate1 = new esri.InfoTemplate("Parcels", "<b>Parcels</b><br><br>Parcel ID ID: ${PARCELID}");

                    feature.setInfoTemplate(featureLayerTemplate1);
                }
                else if (layerName === 'LandUse') {

                    var featureLayerTemplate2 = new esri.InfoTemplate("Land Use", "<b>Land Use</b><br><br>Land Use Code: ${LANDUSE_CODE}</br>Land Use Name: ${LANDUSE_NAME}");

                    feature.setInfoTemplate(featureLayerTemplate2);
                }
                else if (layerName === 'Zoning') {

                    var featureLayerTemplate3 = new esri.InfoTemplate("Zoning", "<b>Zoning</b><br><br>Zoning Code: ${ZONING_CODE}</br>Zoning Name: ${ZONING_NAME}</br>Zoning Type: ${ZONING_TYPE}");
                    featureLayerTemplate3.setTitle(result.layerName);

                    feature.setInfoTemplate(featureLayerTemplate3);
                }
                return feature;

            });
            if (results.length === 0) {
                map.infoWindow.clearFeatures();
            } else {
                map.infoWindow.setFeatures(results);
            }
            map.infoWindow.show(idPoint);
            return results;
        }
        //parameters for the identify task
        function createIdentifyParams(layers, evt) {
            var identifyParamsList = [];
            identifyParamsList.length = 0;
            dojo.forEach(layers, function (layer) {
                var idParams = new esri.tasks.IdentifyParameters();
                idParams.width = map.width;
                idParams.height = map.height;
                idParams.geometry = evt.mapPoint;
                idParams.mapExtent = map.extent;
                idParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_VISIBLE;
                var visLayers = layer.visibleLayers;
                if (visLayers !== -1) {
                    var subLayers = [];
                    for (var i = 0; i < layer.layerInfos.length; i++) {
                        if (layer.layerInfos[i].subLayerIds === null)
                            subLayers.push(layer.layerInfos[i].id);
                    }
                    idParams.layerIds = subLayers;
                } else {
                    idParams.layerIds = [];
                }
                idParams.tolerance = 3;
                idParams.returnGeometry = true;
                identifyParamsList.push(idParams);
            });
            return identifyParamsList;
        }
        //runs once the map is loaded
        function initializeSidebar(map) {
            var popup = map.infoWindow;
            //update content on selection change
            connect.connect(popup, "onSelectionChange", function () {
                displayPopupContent(popup.getSelectedFeature());
            });
            //Remove content when selection is cleared
            connect.connect(popup, "onClearFeatures", function () {
                dom.byId("featureCount").innerHTML = "Click to select feature(s)";
                registry.byId("popup").set("content", "");
                domUtils.hide(dom.byId("ZoomTo"));
                domUtils.hide(dom.byId("pager"));
            });
            //Update sidebar with updated content
            connect.connect(popup, "onSetFeatures", function () {
                displayPopupContent(popup.getSelectedFeature());
                dom.byId("featureCount").innerHTML = popup.features.length + " feature(s) selected";
                domUtils.show(dom.byId("ZoomTo"));
                //ShowIdentify(); exits whichever widget is currently active to display identify results, with the exception of measurment
                ShowIdentify();
                dojo.byId("intro").style.display = "none";
                dojo.byId("featureCount").style.display = "block";
                //enable navigation if more than one feature is selected 
                popup.features.length > 1 ? domUtils.show(dom.byId("pager")) : domUtils.hide(dom.byId("pager"));
            });
        }
        //function to display pop up content in the .HTML page in the "popup" div container
        function displayPopupContent(feature) {
            if (feature) {
                var content = feature.getContent();
                registry.byId("popup").set("content", content);
            }
        }
        //Remove unnecessary widgets from the mobile interface
        if (isMobileDevice) {
            $("table").remove(".noMobile");
        }
        //Creates jquery slider for transparency on operational layers
        $(function () {
            var slider  = $('#slider'),
				tooltip = $('.tooltip');
            //Hide the Tooltip at first
            tooltip.hide();
            slider.slider({
                range: "min",
                min: 0,
                max: 1,
                value: 1,
                step: .01,
                animate: "slow",
                start: function(event,ui) {
                    tooltip.fadeIn('fast');
                },
                slide: function(event, ui) { //When the slider is sliding
                    var value = slider.slider('value');
                    tooltip.css('left', value).text(ui.value);  //Adjust the tooltip accordingly
                    $('#map_layer1').css('opacity', ui.value);
                },
                stop: function(event,ui) {
                    tooltip.fadeOut('fast');
                },
            });
        });
        //Creates jquery slider for transparency on basemap layers
        $(function() {
        var slider  = $('#slider2'),
            tooltip = $('.tooltip2');
        tooltip.hide();
        slider.slider({
            range: "min",
            min: 0,
            max: 1,
            value: 1,
            step: .01,
            animate: "slow",
            start: function(event,ui) {
                tooltip.fadeIn('fast');
            },
            slide: function(event, ui) {
                var value = slider.slider('value');
                tooltip.css('left', value).text(ui.value);
                $('#map_layer0').css('opacity', ui.value);
                $('#map_layer3').css('opacity', ui.value);
                $('#map_layer4').css('opacity', ui.value);
                $('#map_layer5').css('opacity', ui.value);
                $('#map_layer6').css('opacity', ui.value);
                $('#map_layer7').css('opacity', ui.value);
                $('#map_layer8').css('opacity', ui.value);
                $('#map_layer9').css('opacity', ui.value);
                $('#map_layer10').css('opacity', ui.value);
                $('#map_layer11').css('opacity', ui.value);
                $('#map_layer12').css('opacity', ui.value);
                $('#map_layer13').css('opacity', ui.value);
                $('#map_layer14').css('opacity', ui.value);
            },
            stop: function(event,ui) {
                tooltip.fadeOut('fast');
            },
        });
        });
    //Links to the server for map services
        var ProductionMapService = new ArcGISDynamicMapServiceLayer(pMapServiceLayer1,
            { "opacity": 1 });
        map.addLayer(ProductionMapService);

        var BaseMapServiceLayer = new ArcGISDynamicMapServiceLayer(pMapServiceLayer2,
            { "opacity": 1 });
        map.addLayer(BaseMapServiceLayer);
    //creates the fill and point symbology for the measure tool
    var sfs = new SimpleFillSymbol(
        "solid",
    new SimpleLineSymbol("solid", new Color([136, 0, 72]), 2)
     );
    var pms = new esri.symbol.PictureMarkerSymbol("images/point.gif", 18, 18);
    var measurement = new esri.dijit.Measurement({
        map: map,
        lineSymbol: sfs,
        pointSymbol: pms
    }, dojo.byId("DivMeasurement1"));
    measurement.startup();
        //No existing convenient way to quit the measurement widget. Simply call deactivate() to deactivate the measurement widget temporarily
    function deactivate () {
        var locationBtn = dijit.byId('location'),
            distanceBtn = dijit.byId('distance'),
            areaBtn = dijit.byId('area');
        measurement.setTool("distance", false);
        measurement.setTool("location", false);
        measurement.setTool("area", false);
        measurement.clearResult();
    }
    //To make interface more userfriendly, we deactivate the measurement tool each time the user switches tools
    on(dom.byId("tdsearch"), "click", deactivate);
    on(dom.byId("tdParcelMarkUp"), "click", deactivate);
    on(dom.byId("tdlayers"), "click", deactivate);
    on(dom.byId("tdBaseMap"), "click", deactivate);
    on(dom.byId("tdHelp"), "click", deactivate);
    function createBasemapGallery() {
        //manually create basemaps to add to basemap gallery
        var basemaps = [];
        var topoTemplateLayer = new esri.dijit.BasemapLayer({
            url: pBasemapLayer1,
        });
        var topoBasemap = new esri.dijit.Basemap({
            layers: [topoTemplateLayer],
            title: "Topographic",
            thumbnailUrl: "images/topographic.jpg"
        });
        basemaps.push(topoBasemap);
        var streetLayer = new esri.dijit.BasemapLayer({
            url: pBasemapLayer2,
        });
        var streetBasemap = new esri.dijit.Basemap({
            layers: [streetLayer],
            title: "Streets",
            thumbnailUrl: "images/streets.jpg"
        });
        basemaps.push(streetBasemap);
        var imageryLayer = new esri.dijit.BasemapLayer({
            url: pBasemapLayer3,
        });
        var imageryBasemap = new esri.dijit.Basemap({
            layers: [imageryLayer],
            title: "Imagery",
            thumbnailUrl: "images/imagery.jpg"
        });
        basemaps.push(imageryBasemap);
        var canvasLayer = new esri.dijit.BasemapLayer({
            url: pBasemapLayer4,
        });
        var canvasBasemap = new esri.dijit.Basemap({
            layers: [canvasLayer],
            title: "Dark Grey Canvas",
            thumbnailUrl: "images/greyCanvas.jpg"
        });
        basemaps.push(canvasBasemap);
        var basemapGallery = new esri.dijit.BasemapGallery({
            showArcGISBasemaps: false,
            basemaps: basemaps,
            map: map
        }, "basemapGallery");
        basemapGallery.startup();
        dojo.connect(basemapGallery, "onError", function (error) {
            console.log(error);
        });
    }
    createBasemapGallery();
    var toc1 = new TocWidget({
        MapService: ProductionMapService,
        MapControl: map,
        Title: "Legend",
        Expand: { options: "none" }
    }, "tocDiv");
    var toc2 = new TocWidget({
        MapService: BaseMapServiceLayer,
        MapControl: map,
        Expand: { options: "none"}
    }, "toc2");
    var search = new Search({
        map: map,
        sources: [],
        zoomScale: 5000000
    }, "search");
    function clearSelection() {
        map.graphics.clear();
        dom.byId("featureCount").innerHTML = "Click to select feature(s)";
        dom.byId('featureCount').style.display = "block";
        dom.byId("header").style.display = "block";
        domUtils.hide(dom.byId("ZoomTo"));
        domUtils.hide(dom.byId("pager"));
        dom.byId("popup").style.display = "none";
        hidePanel();
    }
    on(dom.byId("clearselection"), "click", clearSelection);
        search.on("load", function () {
            var sources = search.get("sources");
            sources.push({
                featureLayer: new FeatureLayer(searchFeatureLayer1),
                name: searchName1,
                placeholder: searchName1,
                enableLabel: false,
                searchFields: searchSearchableFields1,
                displayField: searchDisplayField1,
                exactMatch: true,
                outFields: ["*"],
                maxResults: 6,
                maxSuggestions: 6,
                enableSuggestions: true,


                infoTemplate: new esri.InfoTemplate("Parcels", "<b>Parcels</b><br><br>Parcel ID ID: ${PARCELID}")

            });

            sources.push({
                featureLayer: new FeatureLayer("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Louisville/LOJIC_LandRecords_Louisville/MapServer/1"),
                name: "Land Use",
                placeholder: "Land Use",
                enableLabel: false,
                searchFields: ["LANDUSE_CODE"],
                displayField: "LANDUSE_CODE",
                exactMatch: true,
                outFields: ["*"],
                maxResults: 6,
                maxSuggestions: 6,
                enableSuggestions: true,
                highlightSymbol: new PictureMarkerSymbol("/images/gps.png", 20, 20),

                infoTemplate: new esri.InfoTemplate("Land Use", "<b>Land Use</b><br><br>Land Use Code: ${LANDUSE_CODE}</br>Land Use Name: ${LANDUSE_NAME}")
            });

            sources.push({
                locator: new esri.tasks.Locator("//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"),
                singleLineFieldName: "SingleLine",
                outFields: ["Addr_type"],
                name: "Address Search",
                placeholder: "Address Search",
                localSearchOptions: {
                    minScale: 300000,
                    distance: 50000
                },
                highlightSymbol: new PictureMarkerSymbol("/images/gps.png", 20, 20)
            });

            search.set("sources", sources);
        });
        app.printUrl = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
    function createPrintTask(printTitle, evt) {
        var template = new PrintTemplate();
        template.layout = document.getElementById("printLayoutId").value;
        template.label = "Landscape (PDF)";
        //sets the format to user input from the HTML page via a dropdown
        template.format = document.getElementById("printFormatId").value;
        template.showLabels = "true";
        template.layoutOptions = {
            scalebarUnit: "Miles",
            titleText: printTitle,
            copyrightText: document.getElementById("comments").value
        };
        template.exportOptions = {
            //sets the export quality to user input from the HTML page via a dropdown
            dpi: document.getElementById("printQualityId").value
        };
        var params = new esri.tasks.PrintParameters();
        params.map = map;
        params.template = template;
        var printTask = new esri.tasks.PrintTask(app.printUrl);
        var printObj = {
            printTask: printTask,
            params: params
        };
        return printObj;
    }
    on(dom.byId("btnPrintReady"), "click", function () {
        ShowProgressIndicator();
        document.getElementById("btnPrintReady").innerHTML = "Printing...";
        var printObj = createPrintTask(document.getElementById("printTitleId").value);
        var printTask = printObj.printTask;
        printTask.execute(printObj.params, function (evt) {
            document.getElementById("btnPrintReady").style.display = 'none';
            document.getElementById("printResult").href = evt.url;
            HideProgressIndicator();
            document.getElementById("information").style.display = 'none';
            document.getElementById("btnPrintReady").style.display = 'none';
            document.getElementById("nextPrint").style.display = 'inline-block';
            document.getElementById("note").style.display = 'inline-block';
            document.getElementById("dynamicPrint").style.display = 'inline-block';
            //jquery function to email link to url of the map from the server
            //as of now the links will expire after a given amount of time
            $(document).ready(function () {
                $('#groupwise').on('click', function () {
                    var str = "mailto:user@example.com?subject=GIS%20Viewer%20Map&body=";
                    var link = evt.url + "%20"
                    var total = str + link;
                    window.location.href = total;
                });
            });
            document.getElementById("printResult").style.display = 'inline-block';
            on(dom.byId("recreate"), "click", function () {
                document.getElementById("btnPrintReady").innerHTML = "Print";
                document.getElementById("information").style.display = 'inline-block';
                document.getElementById("dynamicPrint").style.display = 'none';
                document.getElementById("note").style.display = 'none';
                document.getElementById("btnPrintReady").style.display = 'inline-block';
                document.getElementById("btnPrintReady").disabled = false;
                document.getElementById("printResult").style.display = 'none';
                document.getElementById("btnPrintReady").style.display = 'inline-block';
            });
        }, function (evt) {
            document.getElementById("btnPrintReady").disabled = false;
            document.getElementById("btnPrintReady").innerHTML = "Print";
        });
    });
    //creates an event handler to show the pop up window when an asset is selected from the search bar
    on(search, 'select-result', function (showresult) {
        domUtils.show(dom.byId("popup"));
    });
    //creates an event handler to hide the pop up when the search result is cleared
    on(search, 'clear-search', function (hideresult) {
        domUtils.hide(dom.byId("popup"));
        console.log('selected result', hideresult);
    });
        //Creates a button when an asset is selected to zoom to its extent
    on(dom.byId("zoom"), "click", function zoomTo(evt) {
        var extent = esri.graphicsExtent(map.graphics.graphics);
        map.setExtent(extent, true);
    });
     //Creates a button to pan backward through features when multiple assets are selected
     on(dom.byId("previous"), "click", function selectPrevious() {
        map.infoWindow.selectPrevious();
     });
    //Creates a button to pan forward through features when multiple assets are selected
     on(dom.byId("next"), "click", function selectNext() {
         map.infoWindow.selectNext();
     });
     function hidePanel() {
         $('#BorderContainer').animate({ width: 'hide' });
         dom.byId("_hidebc").style.display = "none";
         dom.byId("_showbc").style.display = "inline";
     }
     on(dom.byId("_hidebc"), "click", hidePanel);
     function showPanel() {
         $('#BorderContainer').animate({ width: 'show' });
         dom.byId("_hidebc").style.display = "inline";
         dom.byId("_showbc").style.display = "none";
     };
         on(dom.byId("_showbc"), "click", showPanel);
     on(dom.byId("tdsearch"), "click", function ShowSearchPanel() {
         if (searchTab == false) {
             searchTab = true;
             measureTab = false;
             printTab = false;
             legendTab = false;
             basemapTab = false;
             helpTab = false;
             if (isBrowser) {
                 map.setMapCursor("url(cursors/cursor.cur),auto");
                 on(map, "pan-end", function pan() {
                     map.setMapCursor("url(cursors/cursor.cur),auto");
                 });
             };
             map.graphics.clear();
             showPanel();
             $(tdmeasure).removeClass("tdselected");
             $(tdParcelMarkUp).removeClass("tdselected");
             $(tdlayers).removeClass("tdselected");
             $(tdBaseMap).removeClass("tdselected");
             $(tdHelp).removeClass("tdselected");
             dojo.addClass("tdsearch", "tdselected");
             dom.byId("DivSearchContainer").style.display = "inline-block";
             dom.byId("search").style.display = "inline-block";
             dom.byId('intro').style.display = "none";
             dom.byId("measurementDiv1").style.display = "none";
             dom.byId("divCreatePDF").style.display = "none";
             dom.byId("header").style.display = "none";
             dom.byId("TOCdivContainer").style.display = "none";
             dom.byId("BasemapContainer").style.display = "none";
             dom.byId("popup").style.display = "none";
         }
         else {
             $(tdsearch).removeClass("tdselected");
             searchTab = false;
             hidePanel();
         };
     });
     function ShowIdentify() {
         if (measureTab == false) {
             searchTab = false;
             measureTab = false;
             printTab = false;
             legendTab = false;
             basemapTab = false;
             helpTab = false;
             map.graphics.show();
             showPanel();
             $(tdsearch).removeClass("tdselected");
             $(tdmeasure).removeClass("tdselected");
             $(tdParcelMarkUp).removeClass("tdselected");
             $(tdlayers).removeClass("tdselected");
             $(tdBaseMap).removeClass("tdselected");
             $(tdHelp).removeClass("tdselected");
             dom.byId("measurementDiv1").style.display = "none";
             dom.byId('intro').style.display = "none";
             dom.byId('featureCount').style.display = "inline-block";
             dom.byId("header").style.display = "inline-block";
             dom.byId("popup").style.display = "inline-block";
             dom.byId("divCreatePDF").style.display = "none";
             dom.byId("TOCdivContainer").style.display = "none";
             dom.byId("BasemapContainer").style.display = "none";
             dom.byId("DivSearchContainer").style.display = "none";
             dom.byId("search").style.display = "none";
             if (isBrowser) {
                 map.setMapCursor("url(cursors/moveIdentify.cur),auto");
                 on(map, "pan-end", function pan() {
                     map.setMapCursor("url(cursors/moveIdentify.cur),auto");
                 });
             };
         }}
     on(dom.byId("tdmeasure"), "click", function ShowMeasurement() {
         if (measureTab == false) {
             searchTab = false;
             //findTab = false;
             measureTab = true;
             printTab = false;
             legendTab = false;
             basemapTab = false;
             helpTab = false;
             if (isBrowser) {
                 map.setMapCursor("url(cursors/measure.cur),auto");
                 on(map, "pan-end", function pan() {
                     map.setMapCursor("url(cursors/measure.cur),auto");
                 });
             };
             map.graphics.show();
             showPanel();
             $(tdsearch).removeClass("tdselected");
             $(tdParcelMarkUp).removeClass("tdselected");
             $(tdlayers).removeClass("tdselected");
             $(tdBaseMap).removeClass("tdselected");
             $(tdHelp).removeClass("tdselected");
             dojo.addClass("tdmeasure", "tdselected");
             measurement.setTool("distance", true);
             dom.byId("measurementDiv1").style.display = "inline-block";
             dom.byId("header").style.display = "none";
             dom.byId("popup").style.display = "none";
             dom.byId('intro').style.display = "none";
             dom.byId("divCreatePDF").style.display = "none";
             dom.byId("TOCdivContainer").style.display = "none";
             dom.byId("BasemapContainer").style.display = "none";
             dom.byId("DivSearchContainer").style.display = "none";
             dom.byId("search").style.display = "none";
         }
         else {
             $(tdmeasure).removeClass("tdselected");
             measureTab = false;
             hidePanel();
         };
     });
     on(dom.byId("tdlayers"), "click", function ShowLayers() {
         if (legendTab == false) {
             searchTab = false;
             //findTab = false;
             measureTab = false;
             printTab = false;
             legendTab = true;
             basemapTab = false;
             helpTab = false;
             if (isBrowser) {
                 map.setMapCursor("url(cursors/cursor.cur),auto");
                 on(map, "pan-end", function pan() {
                     map.setMapCursor("url(cursors/cursor.cur),auto");
                 });
             };
             map.graphics.clear();
             showPanel();
             $(tdmeasure).removeClass("tdselected");
             $(tdParcelMarkUp).removeClass("tdselected");
             $(tdlayers).removeClass("tdsearch");
             $(tdBaseMap).removeClass("tdselected");
             $(tdHelp).removeClass("tdselected");
             $(tdsearch).removeClass("tdselected");
             dojo.addClass("tdlayers", "tdselected");
             dom.byId("TOCdivContainer").style.display = "inline-block";
             dom.byId('intro').style.display = "none";
             dom.byId("measurementDiv1").style.display = "none";
             dom.byId("header").style.display = "none";
             dom.byId("popup").style.display = "none";
             dom.byId("divCreatePDF").style.display = "none";
             dom.byId("BasemapContainer").style.display = "none";
             dom.byId("DivSearchContainer").style.display = "none";
             dom.byId("search").style.display = "none";
         }
         else {
             $(tdlayers).removeClass("tdselected");
             legendTab = false;
             hidePanel();
         };
     });
     on(dom.byId("tdParcelMarkUp"), "click", function ExportToPDF() {
         if (printTab == false) {
             searchTab = false;
             //findTab = false;
             measureTab = false;
             printTab = true;
             legendTab = false;
             basemapTab = false;
             helpTab = false;
             if (isBrowser) {
                 map.setMapCursor("url(cursors/cursor.cur),auto");
                 on(map, "pan-end", function pan() {
                     map.setMapCursor("url(cursors/cursor.cur),auto");
                 });
             };
             map.graphics.clear();
             showPanel();
             $(tdmeasure).removeClass("tdselected");
             $(tdsearch).removeClass("tdselected");
             $(tdlayers).removeClass("tdselected");
             $(tdBaseMap).removeClass("tdselected");
             $(tdHelp).removeClass("tdselected");
             dojo.addClass("tdParcelMarkUp", "tdselected");
             dom.byId("measurementDiv1").style.display = "none";
             dom.byId('intro').style.display = "none";
             dom.byId("divCreatePDF").style.display = "inline-block";
             dom.byId("header").style.display = "none";
             dom.byId("popup").style.display = "none";
             dom.byId("TOCdivContainer").style.display = "none";
             dom.byId("BasemapContainer").style.display = "none";
             dom.byId("DivSearchContainer").style.display = "none";
             dom.byId("search").style.display = "none";
         }
         else {
             $(tdParcelMarkUp).removeClass("tdselected");
             printTab = false;
             hidePanel();
         };
     });
     on(dom.byId("ResetForm"), "click", function CancelPdf() {
         dom.byId("printTitleId").value = "";
         dom.byId("comments").value = "";
         dom.byId("printLayoutId").value = "Letter ANSI A Landscape";
         dom.byId("printFormatId").value = "pdf";
         dom.byId("printQualityId").value = "300";
     });
     on(dom.byId("tdBaseMap"), "click", function ShowBaseMaps() {
         if (basemapTab == false) {
             searchTab = false;
             //findTab = false;
             measureTab = false;
             printTab = false;
             legendTab = false;
             basemapTab = true;
             helpTab = false;
             if (isBrowser) {
                 map.setMapCursor("url(cursors/cursor.cur),auto");
                 on(map, "pan-end", function pan() {
                     map.setMapCursor("url(cursors/cursor.cur),auto");
                 });
             };
             map.graphics.clear();
             showPanel();
             $(tdmeasure).removeClass("tdselected");
             $(tdParcelMarkUp).removeClass("tdselected");
             $(tdlayers).removeClass("tdselected");
             $(tdsearch).removeClass("tdselected");
             $(tdHelp).removeClass("tdselected");
             dojo.addClass("tdBaseMap", "tdselected");
             dom.byId("measurementDiv1").style.display = "none";
             dom.byId("BasemapContainer").style.display = "inline-block";
             dom.byId('intro').style.display = "none";
             dom.byId("header").style.display = "none";
             dom.byId("popup").style.display = "none";
             dom.byId("divCreatePDF").style.display = "none";
             dom.byId("TOCdivContainer").style.display = "none";
             dom.byId("DivSearchContainer").style.display = "none";
             dom.byId("search").style.display = "none";
         }
         else {
             $(tdBaseMap).removeClass("tdselected");
             basemapTab = false;
             hidePanel();
         };
     });
     on(dom.byId("tdHelp"), "click", function ShowHelp() {
         if (helpTab == false) {
             searchTab = false;
             //findTab = false;
             measureTab = false;
             printTab = false;
             legendTab = false;
             basemapTab = false;
             helpTab = true;
             if (isBrowser) {
                 map.setMapCursor("url(cursors/cursor.cur),auto");
                 on(map, "pan-end", function pan() {
                     map.setMapCursor("url(cursors/cursor.cur),auto");
                 });
             };
             map.graphics.clear();
             showPanel();
             $(tdmeasure).removeClass("tdselected");
             $(tdParcelMarkUp).removeClass("tdselected");
             $(tdlayers).removeClass("tdselected");
             $(tdBaseMap).removeClass("tdselected");
             $(tdsearch).removeClass("tdselected");
             dojo.addClass("tdHelp", "tdselected");
             dom.byId("measurementDiv1").style.display = "none";
             dom.byId("BasemapContainer").style.display = "none";
             dom.byId('intro').style.display = "inline-block";
             dom.byId("header").style.display = "none";
             dom.byId("popup").style.display = "none";
             dom.byId("divCreatePDF").style.display = "none";
             dom.byId("TOCdivContainer").style.display = "none";
             dom.byId("DivSearchContainer").style.display = "none";
             dom.byId("search").style.display = "none";
         }
         else {
             $(tdHelp).removeClass("tdselected");
             helpTab = false;
             hidePanel();
         };
     });
    //specify which widgets and sidebar functions are initially visible when the application is open
    dojo.byId("measurementDiv1").style.display = "none";
    dojo.byId("featureCount").style.display = "none";
    dojo.byId("DivSearchContainer").style.display = "none";
    dojo.byId("divCreatePDF").style.display = "none";
    dojo.byId("search").style.display = "none";
    dojo.byId("TOCdivContainer").style.display = "none";
    dojo.byId("BasemapContainer").style.display = "none";
    dojo.byId("divLogo").style.display = "inline-block";
    dojo.byId("header").style.display = "inline-block";
    dojo.byId('popup').style.display = "inline-block";
    dojo.byId('intro').style.display = "inline-block";
    }
    //function to set visibility of all HTML elements once the page has fully loaded
    $(document).ready(function () {
        document.getElementsByTagName("html")[0].style.visibility = "visible";
    });
    initmap();
});