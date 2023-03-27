const topWindow = globalThis

export function isInIframe(w: Window | null | undefined) {
  const win = w || topWindow
  return win !== win?.top
}

export const error: ErrorCallback = (msg: String) => {
  topWindow.console.error(msg)
}

type ErrorCallback = (err: String) => void

// Loads a shader
export function loadShader(gl: WebGLRenderingContext, shaderSource: string, shaderType: number, optErrorCallback?: ErrorCallback) {
  const errorCallback = optErrorCallback || error
  // Create the shader object
  const shader = gl.createShader(shaderType)
  if (!shader) return errorCallback('gl.createShader failed!')
  // Load the shader source
  gl.shaderSource(shader, shaderSource)
  // Compile the shader
  gl.compileShader(shader)
  // Check the compile status
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!compiled) {
    // Something want wrong during compilation, get the error
    const lastError = gl.getShaderInfoLog(shader)
    const source = shaderSource.split('\n').map((l, i) => `${i + 1}: ${l}`).join('\n')
    errorCallback(`Error compiling shader '${shader}': ${lastError}\n${source}`)
    return null
  }
  return shader
}