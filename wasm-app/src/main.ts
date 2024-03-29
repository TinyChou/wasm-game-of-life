import './style.css'
import typescriptLogo from './typescript.svg'
import { setupCounter, setupWasmGreet } from './counter'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
      <button id="wasm" type="button">Greet</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
    <pre id="game-of-life-pre"></pre>
    <canvas id="game-of-life-canvas"></canvas>
    <div id="fps"></div>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
setupWasmGreet(document.querySelector<HTMLButtonElement>('#wasm')!)