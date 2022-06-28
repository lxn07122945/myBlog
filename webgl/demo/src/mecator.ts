/**
 * 赤道半径：6378137.8m
 * 两极半径：63567523m
 * 平均半径：6371008.8m
 */
const earthRadius = 6371008.8;
const PI = Math.PI;
const DEGREES_TO_RADIANS = PI / 180;
const RADIANS_TO_DEGREES = 180 / PI;
// Latitude that makes a square world, 2 * atan(E ** PI) - PI / 2
const MAX_LATITUDE = 85.051129;
const DEFAULT_ALTITUDE = 1.5;
const DEFAULT_TILE_SIZE = 256;
const EARTH_CIRCUMFERENCE = 40.03e6;
/**
 * Project [lng,lat] on sphere onto [x,y] on 512*512 Mercator Zoom 0 tile.
 * Performs the nonlinear part of the web mercator projection.
 * Remaining projection is done with 4x4 matrices which also handles
 * perspective.
 *
 * @param lngLat - [lng, lat] coordinates
 *   Specifies a point on the sphere to project onto the map.
 * @return [x,y] coordinates.
 */
//  export function lngLatToWorld(lngLat: number[]): [number, number] {
//   const [lng, lat] = lngLat;

//   const lambda2 = lng * DEGREES_TO_RADIANS;
//   const phi2 = lat * DEGREES_TO_RADIANS;
//   const x = (TILE_SIZE * (lambda2 + PI)) / (2 * PI);
//   const y = (TILE_SIZE * (PI + Math.log(Math.tan(PI_4 + phi2 * 0.5)))) / (2 * PI);
//   return [x, y];
// }

export function sign (x: number) {
  return x < 0 ? -1 : x > 0 ? 1 : 0;
}
/**
 * Transelate Lnglat point to mecator meter point;
 * @param lngLat 
 * @returns 
 */
export function convertToMercator(lngLat: number[]) {
 const MAXEXTENT = 20037508.342789244;
  var adjusted = Math.abs(lngLat[0]) <= 180 ? lngLat[0] : lngLat[0] - sign(lngLat[0]) * 360;
  var xy = [
    earthRadius * adjusted * DEGREES_TO_RADIANS,
    earthRadius * Math.log(Math.tan(Math.PI * 0.25 + 0.5 * lngLat[1] * DEGREES_TO_RADIANS)),
    // earthRadius * 0.5 * (Math.log((1 + sin) / (1 - sin)))
  ];
  // if xy value is beyond maxextent (e.g. poles), return maxextent
  if (xy[0] > MAXEXTENT)
      xy[0] = MAXEXTENT;
  if (xy[0] < -MAXEXTENT)
      xy[0] = -MAXEXTENT;
  if (xy[1] > MAXEXTENT)
      xy[1] = MAXEXTENT;
  if (xy[1] < -MAXEXTENT)
      xy[1] = -MAXEXTENT;
  return xy;
}

export function convertToWgs84(xy: number[]) {
  return [
      (xy[0] * RADIANS_TO_DEGREES) / earthRadius,
      (Math.PI * 0.5 - 2.0 * Math.atan(Math.exp(-xy[1] / earthRadius))) * RADIANS_TO_DEGREES,
  ];
}

export function pointToTile(lngLat: number[], z: number) {
  const [lng, lat] = lngLat;
  var tile = pointToTileFraction(lng, lat, z);
  tile[0] = Math.floor(tile[0]);
  tile[1] = Math.floor(tile[1]);
  return tile;
}

export function pointToTileFraction(lng: number, lat: number, z: number) {
  const sin = Math.sin(lat * DEGREES_TO_RADIANS);
  const z2 = Math.pow(2, z);
  let x = z2 * (lng / 360 + 0.5);
  const y = z2 * (0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI);

  x = x % z2;
  if (x < 0) x = x + z2;
  return [x, y, z];
}

// function bboxToTile(bboxCoords) {
//   var min = pointToTile(bboxCoords[0], bboxCoords[1], 32);
//   var max = pointToTile(bboxCoords[2], bboxCoords[3], 32);
//   var bbox = [min[0], min[1], max[0], max[1]];

//   var z = getBboxZoom(bbox);
//   if (z === 0) return [0, 0, 0];
//   var x = bbox[0] >>> (32 - z);
//   var y = bbox[1] >>> (32 - z);
//   return [x, y, z];
// }

export function tile2lon(x: number, z: number) {
  return x / Math.pow(2, z) * 360 - 180;
}

export function tile2lat(y: number, z: number) {
  var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
  return RADIANS_TO_DEGREES * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}
