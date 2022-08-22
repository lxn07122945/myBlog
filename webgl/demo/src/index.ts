var VectorTile = require('@mapbox/vector-tile').VectorTile;
var Protobuf = require('pbf');
"use strict";

var vertexShaderSource = `#version 300 es
  in vec2 a_position;
  uniform vec2 u_scale;
  uniform vec2 u_resolution;
  void main() {
    vec2 doubleSize = a_position * u_scale;
    vec2 zeroToOne = a_position / u_resolution;
    gl_Position = vec4(zeroToOne, 0, 1);
  }
`;

var fragmentShaderSource = `#version 300 es
  precision highp float;
  uniform vec4 u_color;
  out vec4 outColor;
  void main() {
    outColor = u_color;
  }
`;

function createShader(gl: any, type: any, source: any) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader)
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader
  }
  gl.deleteShader(shader);
  return undefined;
}

function createProgram(gl: any, vertexShader: any, fragmentShader: any) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }
  gl.deleteProgram(program)
  return undefined;
}

function renderFeature(feature: any, gl: any) {
  if (!feature) {
    return
  }
  switch (feature.geometry.type){
    case 'MultiPolygon':
      const MultoPolypoints = feature.geometry.coordinates.flat(1);
      MultoPolypoints.forEach((tiemPointe: string | any[]) => {
        for (var i = 0; i < tiemPointe.length - 2; i++) {
          setString([tiemPointe[i], tiemPointe[i+1]].flat(Infinity), gl)
        }
      })
    
      break;
    case 'Polygon':
      const polypoints = feature.geometry.coordinates[0];
      for (var i = 0; i < polypoints.length - 2; i++) {
        setString([polypoints[i], polypoints[i+1]].flat(Infinity), gl)
      }
      break;
    case 'Point':
      break;
    case 'Polyline':
      setString(feature.geometry.coordinates.flat(Infinity), gl)
      break
    case 'LineString':
      const points = feature.geometry.coordinates;
      for (var i = 0; i < points.length - 2; i++) {
        setString([points[i], points[i+1]].flat(Infinity), gl)
      }
      break
    case 'MultiLineString':
      const MutilPoints = feature.geometry.coordinates;
      for (var i = 0; i < MutilPoints.length - 1; i++) {
        setString(MutilPoints[i].flat(Infinity), gl)
      }
      break
    default:
  }
}

function main() {
  var canvas = document.querySelector("#c");
  // @ts-ignore
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }
  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Link the two shaders into a program
  var program = createProgram(gl, vertexShader, fragmentShader);
  var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  var resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  var colorLocation = gl.getUniformLocation(program, "u_color");
  var scaleLocation = gl.getUniformLocation(program, 'u_scale')

  var positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  var color = [Math.random(), Math.random(), Math.random(), 1];
  var scale = [1.0, 1.0];

  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao)
  gl.enableVertexAttribArray(positionAttributeLocation)
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
  //@ts-ignore
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);
  gl.bindVertexArray(vao);


  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform4fv(colorLocation, color);
  gl.uniform4fv(scaleLocation, scale);


  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);

  // png url: https://tile.openstreetmap.org/{z}/{x}/{y}.png
  const x = 0;
  const y = 0;
  const z = 0;
  getTile(x, y, z).then(tile => {
    var layerNames = Object.keys(tile.layers);    
    if (layerNames.length > 0) {
        layerNames.forEach(name => {
          for(let i = 0; i < tile.layers[name].length; i++) {
            const feature = tile.layers[name].feature(i).toGeoJSON(x, y, z);
            renderFeature(feature, gl);
          }
        })
    }
  })
}

function setString (points: number[], gl: any) {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points.map(item => item * 10)), gl.STATIC_DRAW);
    // draw
    var primitiveType = gl.LINES;
    var offset = 0;
    var count = 2;
    gl.drawArrays(primitiveType, offset, count);
}


function getTile (x: number, y: number, z: number){
  const tileUrl = `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8,mapbox.mapbox-terrain-v2/${z}/${x}/${y}.vector.pbf?sku=101bR8hC38ulS&access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p1dHRybDR5MGJuZjQzcGhrZ2doeGgwNyJ9.a-vxW4UaxOoUMWUTGnEArw`;
  return fetch(tileUrl).then(response => response.arrayBuffer())
        .then(data => {
          var tile = new VectorTile(new Protobuf(data));
          return tile;
        })
}
main();
