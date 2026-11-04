import './fonts.js'
import './style.css'

// Hero video: slow-motion forward loop
const video = document.querySelector('.hero-video-wrap video')
video.playbackRate = 0.4

// Browsers (esp. Chrome in background tabs, iOS in low-power mode) pause muted
// autoplay videos and don't always resume them. Nudge it back to life whenever
// the page becomes visible/focused or on first interaction.
function resumeHeroVideo() {
  if (video.paused) video.play().catch(() => {})
}
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) resumeHeroVideo()
})
window.addEventListener('focus', resumeHeroVideo)
window.addEventListener('pageshow', resumeHeroVideo)
window.addEventListener('scroll', resumeHeroVideo, { once: true, passive: true })
document.addEventListener('click', resumeHeroVideo, { once: true })

// Ambient audio, sound toggle and first-interaction hint are switched off in
// this temporary solo version (the clips were vocal tracks). The full code is on
// the duo-version branch.

// ---------- Editions lightbox ----------

const lightbox = document.createElement('div')
lightbox.className = 'lightbox'
lightbox.innerHTML = '<button class="lightbox-close" type="button">Close</button><img alt="" />'
document.body.appendChild(lightbox)
const lightboxImg = lightbox.querySelector('img')

function openLightbox(src, alt) {
  lightboxImg.src = src
  lightboxImg.alt = alt || ''
  lightbox.classList.add('is-open')
}
function closeLightbox() {
  lightbox.classList.remove('is-open')
}

document.querySelectorAll('.edition-art').forEach((art) => {
  const img = art.querySelector('img')
  if (!img) return
  art.addEventListener('click', () => openLightbox(img.src, img.alt))
  art.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openLightbox(img.src, img.alt)
    }
  })
})
lightbox.addEventListener('click', closeLightbox)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox()
})

// ---------- Contact form ----------
//
// Messages go through Web3Forms (https://web3forms.com) to the band inbox.
// The access key is public by design (it only lets someone send mail *to* us),
// so it lives in the client bundle. Form "lithiumsea.net Kontakt" in the
// Web3Forms account lithiumseamusic@gmail.com. VITE_WEB3FORMS_KEY overrides it.
// Without a key the form falls back to opening the visitor's mail app, so no
// message is ever silently lost.

const WEB3FORMS_KEY =
  import.meta.env.VITE_WEB3FORMS_KEY || '649da257-2025-4cfd-ab60-dcdc0a811086'
const CONTACT_EMAIL = 'contact@lithiumsea.net'

const form = document.querySelector('.contact-form')
const formStatus = form?.querySelector('.form-status')
const formSubmit = form?.querySelector('.form-submit')
const subjectInput = form?.querySelector('[name="subject"]')

function setStatus(text, kind = '') {
  if (!formStatus) return
  formStatus.textContent = text
  formStatus.dataset.kind = kind
}

function showFallback(prefix) {
  if (!formStatus) return
  formStatus.dataset.kind = 'error'
  formStatus.textContent = `${prefix} Please write to us directly: `
  const a = document.createElement('a')
  a.href = `mailto:${CONTACT_EMAIL}`
  a.textContent = CONTACT_EMAIL
  formStatus.appendChild(a)
}

function openMailApp(data) {
  const subject = data.subject || 'Inquiry via lithiumsea.net'
  const body = `${data.message}\n\n— ${data.name} (${data.email})`
  window.location.href =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  setStatus('Your mail app should open with the message ready to send.')
}

// Edition offers and press-kit requests jump to the form with the subject filled in.
document.querySelectorAll('.edition-offer[data-subject], .epk-dl[data-subject]').forEach((offer) => {
  offer.addEventListener('click', () => {
    if (subjectInput && !subjectInput.value) subjectInput.value = offer.dataset.subject
  })
})

form?.addEventListener('submit', async (e) => {
  e.preventDefault()
  if (formSubmit.disabled) return

  if (!form.checkValidity()) {
    form.reportValidity()
    setStatus('Please fill in name, a valid email and your message.', 'error')
    return
  }

  const fd = new FormData(form)
  const data = {
    name: fd.get('name').trim(),
    email: fd.get('email').trim(),
    subject: fd.get('subject').trim(),
    message: fd.get('message').trim(),
  }

  // Bot ticked the hidden box: pretend all is well, send nothing.
  if (fd.get('botcheck')) {
    form.reset()
    setStatus('Thank you — your message has been sent.', 'ok')
    return
  }

  if (!WEB3FORMS_KEY) {
    openMailApp(data)
    return
  }

  formSubmit.disabled = true
  const label = formSubmit.textContent
  formSubmit.textContent = 'Sending…'
  setStatus('')

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `[lithiumsea.net] ${data.subject || 'New message'}`,
        from_name: 'Lithium Sea Website',
        replyto: data.email,
        name: data.name,
        email: data.email,
        message: data.message,
        botcheck: false,
      }),
    })
    const json = await res.json().catch(() => ({}))
    if (res.ok && json.success) {
      form.reset()
      setStatus('Thank you — your message has been sent.', 'ok')
    } else {
      showFallback('Sorry, that didn’t go through.')
    }
  } catch {
    showFallback('Sorry, the message couldn’t be sent.')
  } finally {
    formSubmit.disabled = false
    formSubmit.textContent = label
  }
})
