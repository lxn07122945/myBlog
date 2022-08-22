
export function resizeCanvasToDisplaySize(canvas: any) {
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