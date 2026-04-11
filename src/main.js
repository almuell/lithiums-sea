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
const AUTOPLAY_VOLUME = 0.08
const AUTOPLAY_DELAY_MS = 3000
const FADE_MS = 2000
const MIN_GAP_MS = 10_000
const MAX_GAP_MS = 30_000

const audio = new Audio()
audio.preload = 'auto'

let enabled = true
let started = false
let lastIndex = -1
let nextTimer = null
let fadeRaf = null
let currentVolume = TARGET_VOLUME

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
    audio.volume = currentVolume * t
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
  clearTimeout(autoplayTimer)
  hideHint()
  if (started || !enabled) return
  started = true
  playNext()
}

window.addEventListener('scroll', start, { once: true, passive: true })
document.addEventListener('click', start, { once: true })

// Best-effort autoplay: most browsers will reject this without a user gesture,
// but returning visitors with Chrome's Media Engagement Index built up can get
// audio without interaction. If it fails we fall back silently to the gesture
// flow above; nothing breaks for first-time visitors.
function tryAutoplayStart() {
  if (started || !enabled) return
  currentVolume = AUTOPLAY_VOLUME
  const i = pickNextIndex()
  audio.src = encodeURI(TRACKS[i])
  audio.volume = 0
  const p = audio.play()

  const handleSuccess = () => {
    if (started || !enabled) {
      audio.pause()
      audio.currentTime = 0
      return
    }
    started = true
    lastIndex = i
    hideHint()
    fadeIn()
  }

  if (p && typeof p.then === 'function') {
    p.then(handleSuccess).catch(() => {
      // Autoplay was blocked. Restore the gesture-volume default so the
      // eventual gesture flow plays at the normal 0.12 instead of 0.08.
      currentVolume = TARGET_VOLUME
    })
  } else {
    handleSuccess()
  }
}

let autoplayTimer = setTimeout(tryAutoplayStart, AUTOPLAY_DELAY_MS)

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
  clearTimeout(autoplayTimer)
  hideHint()
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

// ---------- First-interaction hint ----------

const hint = document.createElement('div')
hint.className = 'sound-hint'
hint.textContent = 'click anywhere for sound'
document.body.appendChild(hint)

// Slight delay so the page settles before the hint fades in.
const hintShowTimer = setTimeout(() => {
  hint.classList.add('is-visible')
}, 1500)

let hintHidden = false
function hideHint() {
  if (hintHidden) return
  hintHidden = true
  clearTimeout(hintShowTimer)
  hint.classList.remove('is-visible')
  // Wait out the fade transition (0.6s) before removing from DOM.
  setTimeout(() => hint.remove(), 700)
}
