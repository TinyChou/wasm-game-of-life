import { Universe } from 'wasm-game-of-life'

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
  element.addEventListener('click', () => {
    const pre = document.getElementById('game-of-life-canvas')
    const universe = Universe.new()
    const renderLoop = () => {
      pre!.textContent = universe.render()
      universe.tick()

      requestAnimationFrame(renderLoop)
    }

    requestAnimationFrame(renderLoop)
  })
}