import { tracks } from './tracks.js'

const progressContainer = document.querySelector('.progress-container')
const progressBar = document.querySelector('.progress-bar')
const image = document.querySelector('.image')
const title = document.querySelector('.title')
const playlistContainer = document.querySelector('.playlist-container')
const currentTrack = new Audio(tracks[0].url)

let currentIndex = 0

const render = _ => {
  let markup = ''
  image.src = tracks[currentIndex].image
  title.innerText = tracks[currentIndex].title
  tracks.forEach((elem, i) => {
    markup +=
     `<div class="track ${i === currentIndex ? 'active' : ''}">
        <span class="fa-solid ${i === currentIndex && !currentTrack.paused ? 'fa-pause' : 'fa-play'}"></span>
        <span class="track-title">${elem.title}</span>
        <span class="track-length">${elem.length}</span>
      </div>`
  })
  playlistContainer.innerHTML = markup
  addTrackListener()
}

const addTrackListener = _ => {
  document.querySelectorAll('.track').forEach((elem, i) => {
    elem.addEventListener('click', _ => {
      if (i === currentIndex) {
        if (currentTrack.paused) {
          currentTrack.play()
          elem.firstElementChild.classList.replace('fa-play', 'fa-pause')
        }
        else {
          currentTrack.pause()
          elem.firstElementChild.classList.replace('fa-pause', 'fa-play')
        }
      }
      else {
        progressBar.style.width = 0
        currentIndex = i
        currentTrack.src = tracks[currentIndex].url
        currentTrack.play()
        render()
      }
    })
  })
}

const addListeners = _ => {
  currentTrack.addEventListener('timeupdate', _ => {
    progressBar.style.width = `${(currentTrack.currentTime / currentTrack.duration) * 100}%`
  })

  currentTrack.addEventListener('ended', _ => {
    progressBar.style.width = 0
    if (tracks[currentIndex + 1]) {
      currentTrack.src = tracks[++currentIndex].url
      currentTrack.play()
    }
    else {
      currentIndex = 0
      currentTrack.src = tracks[0].url
    }
    render()
  })

  progressContainer.addEventListener('click', e => {
    currentTrack.currentTime = (e.offsetX / progressContainer.offsetWidth) * currentTrack.duration
  })
}

addListeners()
render()