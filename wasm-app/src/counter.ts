import { Universe, BitUniverse, Cell } from 'wasm-game-of-life'
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg.wasm'

export function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}

export function setupWasmGreet(element: HTMLButtonElement) {
  renderUniverseUsingCanvas2D(element)
}

export function renderUniverseUsingCanvas2D(element: HTMLButtonElement) {
  const CELL_SIZE = 5
  const GRID_COLOR = '#cccccc'
  const DEAD_COLOR = '#ffffff'
  const ALIVE_COLOR = '#000000'

  const universe = BitUniverse.new()
  const width = universe.width()
  const height = universe.height()

  const canvas = <HTMLCanvasElement>document.getElementById('game-of-life-canvas')
  if (!canvas) return
  canvas.height = (CELL_SIZE + 1) * height + 1
  canvas.width = (CELL_SIZE + 1) * width + 1

  canvas.addEventListener('click', e => {
    const boundingRect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / boundingRect.width
    const scaleY = canvas.height / boundingRect.height
    const canvasLeft = (e.clientX - boundingRect.left) * scaleX
    const canvasTop = (e.clientY - boundingRect.top) * scaleY
    const row = Math.min(
      Math.floor(canvasTop / (CELL_SIZE + 1)),
      height - 1,
    )
    const col = Math.min(
      Math.floor(canvasLeft / (CELL_SIZE + 1)),
      width - 1,
    )

    universe.toggle_cell(row, col)
    drawGrid()
    drawCells()
  })

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const drawGrid = () => {
    ctx.beginPath()
    ctx.strokeStyle = GRID_COLOR

    for (let i = 0; i <= width; i++) {
      ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0)
      ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1)
    }

    for (let j = 0; j <= height; j ++) {
      ctx.moveTo(0, j * (CELL_SIZE + 1) + 1)
      ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1)
    }

    ctx.stroke()
  }

  const bitIsSet = (n: number, arr: Uint8Array) => {
    const byte = Math.floor(n / 8)
    const mask = 1 << (n % 8)
    return (arr[byte] & mask) === mask
  }
  const getIndex = (row: number, column: number) => row * width + column
  const drawCells = () => {
    const cellsPtr = universe.cells()
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height)
    
    ctx.beginPath()

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const idx = getIndex(row, col)

        ctx.fillStyle = bitIsSet(idx, cells) ? DEAD_COLOR : ALIVE_COLOR
        ctx.fillRect(
          col * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE,
        )
      }
    }
  }

  let animationId: number | null = null
  const renderLoop = () => {
    universe.tick()

    drawGrid()
    drawCells()
    animationId = requestAnimationFrame(renderLoop)
  }

  animationId = requestAnimationFrame(renderLoop)

  const isPaused = () => animationId === null
  const play = () => {
    element.textContent = '⏸'
    renderLoop()
  }
  const pause = () => {
    element.textContent = '▶'
    if (animationId) cancelAnimationFrame(animationId)
    animationId = null
  }
  element.addEventListener('click', () => {
    if (isPaused()) play()
    else pause()
  })
}

export function renderUniverseUsingDOM() {
  const pre = document.querySelector('#game-of-life-pre')
  const universe = Universe.new_random()

  const renderLoop = () => {
    pre!.textContent = universe.render()
    universe.tick()

    requestAnimationFrame(renderLoop)
  }

  requestAnimationFrame(renderLoop)
}
