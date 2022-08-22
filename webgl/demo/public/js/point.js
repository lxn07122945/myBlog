"use strict"
var vertextShaderSource = `#version 300 es
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
var fragmentShaderSource = `#version 300 es
  precision highp float;
  uniform vec4 u_color;
  out vec4 outColor;
  void main() {
    vec4 color = u_color / vec4(255.0, 255.0, 255.0, 1.0);
    outColor = color;
  }
`;
function createShader (gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }
  gl.deleteShader(shader)
  return undefined;
}

function createProgram (gl, vertextShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertextShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program)
  var success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if(success) {
    return program
  }
  gl.deleteProgram(program);
  return undefined
}
function randomColor () {
  return [
    Math.random() * 255,
    Math.random() * 255,
    Math.random() * 255,
    Math.random()
  ]
}

function resizeCanvasToDisplaySize(canvas) {
  // 获取浏览器显示的画布的CSS像素值
  const displayWidth = canvas.clientWidth
  const displayHeight = canvas.clientHeight

  // 检查画布大小是否相同。
  const needResize =
      canvas.width !== displayWidth || canvas.height !== displayHeight

  if (needResize) {
      // 使画布大小相同
      canvas.width = displayWidth
      canvas.height = displayHeight
  }

  return needResize
}

function main () {
  var canvas = document.querySelector('#c');

  var gl = canvas.getContext('webgl2');
  if (!gl) {
    return
  }
  resizeCanvasToDisplaySize(canvas)
  var vs = createShader(gl,gl.VERTEX_SHADER, vertextShaderSource);
  var fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  var program = createProgram(gl, vs, fs);
  var positionAttributeLocation = gl.getAttribLocation(program, 'a_Position')
  var a_Screen_Size = gl.getUniformLocation(program, 'a_Screen_Size')
  var u_Color = gl.getUniformLocation(program, 'u_color')
  // reset view port
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  var vao = gl.createVertexArray();
  // // 将属性集绑定到webgl
  gl.bindVertexArray(vao)
  // // 启用属性
  gl.enableVertexAttribArray(positionAttributeLocation)
  // 属性值从缓冲区中取出数据
  var size = 2;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize,stride, offset)


  gl.useProgram(program);

  gl.uniform2f(a_Screen_Size, gl.canvas.width, gl.canvas.height);
  console.log(gl.canvas.width, gl.canvas.height)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([250, 250]), gl.STATIC_DRAW);

  gl.uniform4fv(u_Color, [255, 0 ,0 ,1]);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.POINTS, 0, 1)


  var points = [];

  canvas.addEventListener('click', (evt) => {
    var x = evt.pageX;
    var y = evt.pageY;
    console.log(x/canvas.width * 2 - 1)
    console.log(-(y/canvas.height * 2 - 1))
    var color = randomColor();
    points.push({
      x,
      y,
      color
    })
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    for (let i = 0; i < points.length; i++) {
      const {color, x , y} = points[i];
      console.log(x, y)
      gl.uniform4fv(u_Color, color);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x, y]), gl.STATIC_DRAW);
      gl.drawArrays(gl.POINTS, 0 ,1)
    }
  })

}

main()