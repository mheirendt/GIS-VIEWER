/*
 *  config.js
 *  Utility Viewer Template
 *
 *  Created by Michael Heirendt on 5/1/2015.
 *  Copyright 2015 mheirendt. All rights reserved.
 *
 */

var pProxyPath;             //Path to your proxy. You will need this if you plan to use the printing services and to index searches
var pGeometryService;       //You will need to set this variable to the path of your geometry service on ArcGIS Server
var pDefaultBasemap;        //Variable to store the URL for the initial displays basemap service
var pOriginCoordinates;     //Variable to hold the coordinates for where the map will initially be centerred on
var pZoom;                  //Variable to hold the zoom level the app will initialize with
var pMapServiceLayer1;      //Variable to hold the REST URL for a map service
var pMapServiceLayer2;      //Variable to hold the REST URL for a map service
var pBasemapLayer1;         //Variable to hold a URL for the first alternative basemap option
var pBasemapLayer2;         //Variable to hold a URL for the second alternative basemap option
var pBasemapLayer3;         //Variable to hold a URL for the thrid alternative basemap option
var pBasemapLayer4;         //Variable to hold a URL for the fourth alternative basemap option
var searchFeatureLayer1;    //URL path to the first searchable layer. Change this to the REST URL of you map service of choice
var searchName1;            //The name that will show up for the map service layer in the selection are of the search widget
var searchSearchableFields1;//Name of the field to be searched. Should exactly match name on ArcGIS Server REST URL information page surrounded by quotes and [] brackets
var searchDisplayField1;    //Placeholder for the name of the searchable field
var searchInfoTemplate1;    //Info template that will show up in the side bar. The first section of quotes is a title, which is not visible. Everything in {} branckets is a unique field name.
                            //NOTE: YOU MUST ADD ALL ROOT URLS THAT USED HERE TO THE PROXY.COONFIG FILE LOCATED AT "proxxy/proxy.config"

pProxyPath = "proxy/proxy.ashx";
pGeometryService = "https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer";
pDefaultBasemap = "http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer";
pOriginCoordinates = [-85.662418, 38.197897];
pZoom = 6;
pMapServiceLayer1 = "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Louisville/LOJIC_LandRecords_Louisville/MapServer";
pMapServiceLayer2 = "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Louisville/LOJIC_PublicSafety_Louisville/MapServer";
pBasemapLayer1 = "http://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer";
pBasemapLayer2 = "http://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer";
pBasemapLayer3 = "http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer";
pBasemapLayer4 = "http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer";
searchFeatureLayer1 = "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Louisville/LOJIC_LandRecords_Louisville/MapServer/0";
searchName1 = "Parcels";
searchSearchableFields1 = ["PARCELID"];
searchDisplayField1 = "PARCELID";
                        //title      //Name       //text for 1st field  //name of first field
searchInfoTemplate1 = '"Parcels", "<b>Parcels</b><br><br>Parcel ID ID: ${PARCELID}"';
