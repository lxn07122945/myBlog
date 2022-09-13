"use strict"
var vs = `#version 300 es
  precision mediump float;
  in vec2 a_Position;
  uniform vec2 a_Screen_Size;
  in vec2 a_Uv;
  out vec2 v_Uv;
  void main(){
    vec2 position = a_Position / a_Screen_Size;
    vec2 zeroToTwo = position * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0 , 1);
    v_Uv = a_Uv;
  }
`;
var fs = `#version 300 es
  precision mediump float;
  uniform sampler2D u_Image;
  in vec2 v_Uv;
  out vec4 outColor;
  void main() {
    outColor = texture(u_Image, v_Uv);
  }
`

function createShader (gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader
  }
  gl.deleteShader(shader)
  return undefined
}
function createProgram(gl, vertextShaderSource, fragmentShaderSource){
  var program = gl.createProgram();
  gl.attachShader(program, vertextShaderSource);
  gl.attachShader(program, fragmentShaderSource)
  gl.linkProgram(program)
  var success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }
  gl.deleteProgram(program)
  return undefined
}

var random = Math.random;

function randomColor () {
  return [random() * 255, random() * 255, random() * 255, random()]
}

function resizeCanvasToDisplaySize(canvas) {
  const displayHeight = canvas.clientHeight;
  const displayWidth = canvas.clientWidth;
  const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
  return needResize
}
function main (image) {
  console.log(image)
  const canvas = document.querySelector('#c')
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    return
  }
  resizeCanvasToDisplaySize(canvas)
  const vShader = createShader(gl, gl.VERTEX_SHADER, vs);
  const fShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
  const program = createProgram(gl, vShader ,fShader);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  // get position of attribute
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_Position')
  const screenSizeLocation = gl.getUniformLocation(program, 'a_Screen_Size')
  const a_Uv = gl.getAttribLocation(program, 'a_Uv')
  const u_image = gl.getUniformLocation(program, 'u_Image');
  gl.useProgram(program)

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  const textBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textBuffer);
  gl.enableVertexAttribArray(a_Uv)
  gl.vertexAttribPointer(a_Uv, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0,  0.0,
    1.0,  0.0,
    0.0,  1.0,
    0.0,  1.0,
    1.0,  0.0,
    1.0,  1.0,
]), gl.STATIC_DRAW);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  var mipLevel = 0;               // the largest mip
  var internalFormat = gl.RGBA;   // format we want in the texture
  var srcFormat = gl.RGBA;        // format of data we are supplying
  var srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
  gl.texImage2D(gl.TEXTURE_2D,
                mipLevel,
                internalFormat,
                srcFormat,
                srcType,
                image);

  // gl.uniform4fv(colorLocation, [255, 0, 0, 1]);
  gl.uniform2f(screenSizeLocation, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.uniform1i(u_image, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setRectangle(gl, 200, 200, image.width, image.height);

  // Draw the rectangle.
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 6;
  gl.drawArrays(primitiveType, offset, count);
}

var image = new Image();
image.src = './static/map.png';
image.onload = function () {
  main(image)
}

function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW);
}


