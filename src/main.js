import './style.css'

const video = document.querySelector('.hero-video-wrap video')
video.removeAttribute('loop')
let forward = true

video.addEventListener('ended', () => {
  forward = false
  video.play()
})

video.addEventListener('timeupdate', () => {
  if (!forward) {
    video.currentTime -= 0.05
    if (video.currentTime <= 0) {
      forward = true
      video.play()
    }
  }
})
