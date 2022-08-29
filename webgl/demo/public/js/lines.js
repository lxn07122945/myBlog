"use strict"
var vs = `#version 300 es
  precision mediump float;
  in vec2 a_Position;
  uniform vec2 a_Screen_Size;
  void main(){
    vec2 position = a_Position / a_Screen_Size;
    vec2 zeroToTwo = position * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0 , 1);
    gl_PointSize = 5.0;
  }
`;
var fs = `#version 300 es
  precision mediump float;
  uniform vec4 u_Color;
  out vec4 outColor;
  void main() {
    outColor = u_Color / vec4(255, 255, 255, 1);
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
function main () {
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
  const colorLocation = gl.getUniformLocation(program, 'u_Color')

  // buffer
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.enableVertexAttribArray(positionAttributeLocation)
  const size = 2;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

  // color buffer
  // const colorBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  // gl.enableVertexAttribArray(colorLocation);
  // const colorSize = 4;
  // const colorType = gl.FLOAT;
  // const colorNormalize = false;
  // const colorStride = 0;
  // const colorOffset = 0;
  // gl.vertexAttribPointer(colorLocation, colorSize, colorType, colorNormalize, colorStride, colorOffset);

  gl.useProgram(program)


  gl.uniform4fv(colorLocation, [255, 0, 0, 1]);
  gl.uniform2f(screenSizeLocation, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT)



  let points = [];
  let moveing = false;
  let colors = [];
  canvas.addEventListener('click', (evt) => {
    var x = evt.pageX;
    var y = evt.pageY;
    points.push(x, y);
    // colors = colors.concat(randomColor());
    if (points.length % 4 !== 0) {
      moveing = true
    }
    if (points.length % 4 === 0) {
      moveing = false;
      // gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.DYNAMIC_DRAW)
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      // 线段
      gl.drawArrays(gl.LINES, 0 , points.length / 2)
      // 连续折线
      // gl.drawArrays(gl.LINE_STRIP, 0 , points.length / 2)
      // 线环
      // gl.drawArrays(gl.LINE_LOOP, 0 , points.length / 2)

      // 宽线？ 还没发现是干嘛的
      // gl.drawArrays(gl.LINE_WIDTH, 0 , points.length / 2)

      gl.drawArrays(gl.POINTS, 0 , (points.length + 2) / 2)

    }
  })

  canvas.addEventListener('mousemove', evt => {
    if (!moveing) {
      return
    }
    var x = evt.pageX;
    var y = evt.pageY;
    // gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points.concat([x,y])), gl.DYNAMIC_DRAW)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.LINES, 0 , (points.length + 2) / 2)
    // gl.drawArrays(gl.LINE_STRIP, 0 , (points.length + 2) / 2)
    // gl.drawArrays(gl.LINE_LOOP, 0 , (points.length + 2) / 2)
    // gl.drawArrays(gl.LINE_WIDTH, 0 , (points.length + 2) / 2)

    gl.drawArrays(gl.POINTS, 0 , (points.length + 2))

  })
}
main();