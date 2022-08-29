"use strict"

var vs = `#version 300 es
  precision mediump float;
  in vec2 a_Position;
  uniform vec2 a_Screen_Size;
  in vec4 a_Color;
  out vec4 v_Color;
  void main() {
    vec2 position = a_Position / a_Screen_Size;
    vec2 zeroToTwo = position * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0 , 1);
    gl_PointSize = 5.0;
    v_Color = a_Color;
  }
`;

var fs = `#version 300 es
  precision mediump float;
  in vec4 v_Color;
  out vec4 outColor;
  void main() {
    outColor = v_Color / vec4(255,255,255,1);
  }
`

function createShader (gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader)
  const success  = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader
  }
  gl.deleteShader(shader);
  return undefined
}

function createProgram(gl, vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs)
  gl.linkProgram(program);
  const status = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (status) {
    return program
  }
  gl.deleteProgram(program)
  return undefined
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

function main() {
  const canvas = document.querySelector('#c');
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    return
  }
  resizeCanvasToDisplaySize(canvas);
  const vsourece = createShader(gl, gl.VERTEX_SHADER, vs);
  const fsource = createShader(gl, gl.FRAGMENT_SHADER, fs);
  const program = createProgram(gl, vsourece, fsource);
  gl.viewport(0,0, canvas.width,canvas.height);

  //
  const a_position = gl.getAttribLocation(program, 'a_Position');
  const screenSizeLocation = gl.getUniformLocation(program, 'a_Screen_Size');
  const a_Color = gl.getAttribLocation(program, 'a_Color');

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(a_position);
  const size = 2;
  const type = gl.FLOAT;

  const stride = 0;
  const offset = 0;
  const normalize = false;
  gl.vertexAttribPointer(a_position, size, type, normalize, stride, offset);

  gl.useProgram(program)
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.vertexAttrib4fv(a_Color, [255, 0, 0, 1]);
  gl.uniform2f(screenSizeLocation, canvas.width, canvas.height)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 500,0, 500, 500]), gl.STATIC_DRAW)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}
main();