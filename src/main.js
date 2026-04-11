import './style.css'

// Hero video: slow-motion forward loop
const video = document.querySelector('.hero-video-wrap video')
video.playbackRate = 0.4

// ---------- Ambient audio system ----------

const TRACKS = [
  '/audio/Radiant Somber Web.mp3',
  '/audio/Ah 3.0.mp3',
  '/audio/Ah 2.0.mp3',
  '/audio/Ah 1.0.mp3',
]
const TARGET_VOLUME = 0.12
const FADE_MS = 2000
const MIN_GAP_MS = 30_000
const MAX_GAP_MS = 90_000

const audio = new Audio()
audio.preload = 'auto'

let enabled = true
let started = false
let lastIndex = -1
let nextTimer = null
let fadeRaf = null

function pickNextIndex() {
  if (TRACKS.length <= 1) return 0
  let i
  do {
    i = Math.floor(Math.random() * TRACKS.length)
  } while (i === lastIndex)
  return i
}

function fadeIn() {
  cancelAnimationFrame(fadeRaf)
  audio.volume = 0
  const t0 = performance.now()
  const step = (now) => {
    const t = Math.min(1, (now - t0) / FADE_MS)
    audio.volume = TARGET_VOLUME * t
    if (t < 1) fadeRaf = requestAnimationFrame(step)
  }
  fadeRaf = requestAnimationFrame(step)
}

function playNext() {
  if (!enabled) return
  const i = pickNextIndex()
  lastIndex = i
  audio.src = encodeURI(TRACKS[i])
  audio.volume = 0
  const p = audio.play()
  if (p && typeof p.then === 'function') {
    p.then(fadeIn).catch(() => {})
  } else {
    fadeIn()
  }
}

function scheduleNext() {
  clearTimeout(nextTimer)
  if (!enabled) return
  const delay = MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS)
  nextTimer = setTimeout(playNext, delay)
}

audio.addEventListener('ended', scheduleNext)

function start() {
  if (started || !enabled) return
  started = true
  playNext()
}

window.addEventListener('scroll', start, { once: true, passive: true })
document.addEventListener('click', start, { once: true })

// ---------- Sound toggle button ----------

const toggle = document.createElement('button')
toggle.className = 'sound-toggle'
toggle.type = 'button'
toggle.setAttribute('aria-label', 'Toggle ambient sound')
toggle.textContent = '🔊'
document.body.appendChild(toggle)

toggle.addEventListener('click', (e) => {
  // Don't let this click also trigger the document-level start() listener.
  e.stopPropagation()
  enabled = !enabled
  toggle.textContent = enabled ? '🔊' : '🔇'
  if (!enabled) {
    clearTimeout(nextTimer)
    cancelAnimationFrame(fadeRaf)
    audio.pause()
    audio.currentTime = 0
  } else if (!started) {
    started = true
    playNext()
  } else {
    scheduleNext()
  }
})
