import * as wasm from 'wasm-game-of-life'

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
  element.addEventListener('click', () => wasm.greet("Your Name"))
}