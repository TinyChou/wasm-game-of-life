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

export function setupWasmGreet(_: HTMLButtonElement) {
  const pre = document.querySelector('#game-of-life-pre')
  const universe = Universe.new()

  const renderLoop = () => {
    pre!.textContent = universe.render()
    universe.tick()

    requestAnimationFrame(renderLoop)
  }

  requestAnimationFrame(renderLoop)
}
