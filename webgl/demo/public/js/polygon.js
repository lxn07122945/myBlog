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

function randomColor () {
  return {
    r: Math.random() * 255,
    g: Math.random() * 255,
    b: Math.random() * 255,
    a: Math.random()
  }
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
  gl.enableVertexAttribArray(a_Color);

  const size = 2;
  const type = gl.FLOAT;

  const stride = 0;
  const offset = 0;
  const normalize = false;
  gl.vertexAttribPointer(a_position, size, type, normalize, 24, offset);
  gl.vertexAttribPointer(a_Color, 4, type, normalize, 24, 8);

  gl.useProgram(program)
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform2f(screenSizeLocation, canvas.width, canvas.height)

  drawTriangle(gl);
  drawReactangle(gl);
  drawTriangleFan(gl);
  drawCircle(gl);

  drawRing(gl);
}
main();

function drawTriangle (gl) {
  var position = [
    30, 30, 255, 0, 0, 1,    //V0
    30, 300, 255, 0, 0, 1,   //V1
    300, 300, 255, 0, 0, 1,  //V2
    30, 30, 0, 255, 0, 1,    //V0
    300, 300, 0, 255, 0, 1,  //V2
    300, 30, 0, 255, 0, 1    //V3
  ]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW)
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}
// draw with elements
function drawReactangle (gl) {
  var indicbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicbuffer);

  var  position = [
    330, 30, 255, 0, 0, 1,    //V0
    330, 300, 255, 0, 0, 1,   //V1
    600, 300, 255, 0, 0, 1,  //V2
    600, 30, 0, 255, 0, 1    //V3
  ]
  var indices = [
    0,1,2,
    0,2,3
  ]
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW)

  /**
   * mode: 绘制图元类型
   * count: 绘制图形的顶点个数
   * type: 缓冲区中值的类型 gl.UNSIGNED_BYTE gl.UNSIGNED_SHORT  无符号8位证书 无符号16位整数
   * offset: 偏移量
   */
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

function drawTriangleFan (gl) {
  var position  = [
    780, 180, 255,0,0,1,
    630, 30, 66, 245, 197,1,
    630, 330, 66, 227, 245,1,
    930, 330, 233, 66, 245,1,
    930,30, 230, 245, 66,1,
    630, 30, 66, 245, 197,1
  ]
  // gl.enable(gl.CULL_FACE);
  // gl.cullFace(gl.FRONT);

  var indices = [
    5,1,4,
    5,2,1,
    // 5,3,2,
    // 5,4,3
  ]
  // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW)
  gl.drawArrays(gl.TRIANGLE_FAN, 0, position.length / 6);
  // gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_SHORT, 0);
}

function drawCircle(gl) {
  var positions = createCircleVertex(1100, 100, 50,  100);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
  gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 6);
}

function drawRing(gl) {
  var vertex = createRingVertex(1100, 500, 50, 100, 10);
  let indices = vertex.indices;
  let indicesBuffer = gl.createBuffer();
  //绑定索引缓冲区
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  //向索引缓冲区传递索引数据
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex.positions), gl.STATIC_DRAW);

  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

}
function createCircleVertex(x, y, radius, n) {
  var sin = Math.sin;
  var cos = Math.cos;
  var positions = [x, y, 255, 0, 0, 1];
  for (let i = 0; i <= n; i++) {
    var angle = i * Math.PI * 2 / n;
    positions.push(x + radius * sin(angle), y + radius * cos(angle), 255, 0, 0, 1);
  }
  return positions;
}

function createRingVertex(x, y, innerRadius, outerRadius, n) {
  const sin = Math.sin;
  const cos = Math.cos;
  var positions = [];
  var color = randomColor();
  for (var i = 0; i <= n; i++) {
      if (i % 2 == 0) {
          color = randomColor();
      }
      var angle = i * Math.PI * 2 / n;
      positions.push(x + innerRadius * sin(angle), y + innerRadius * cos(angle), color.r, color.g, color.b, color.a);
      positions.push(x + outerRadius * sin(angle), y + outerRadius * cos(angle), color.r, color.g, color.b, color.a);
  }
  var indices = [];
  for (var i = 0; i < n; i++) {
      var p0 = i * 2;
      var p1 = i * 2 + 1;
      var p2 = (i + 1) * 2 + 1;
      var p3 = (i + 1) * 2;
      if (i == n - 1) {
        p2 = 1;
        p3 = 0;
      }
      indices.push(p0, p1, p2, p2, p3, p0);
  }
  return { 
      positions: positions, 
      indices: indices 
  };
}