import { tracks } from './tracks.js'

const progressContainer = document.querySelector('.progress-container')
const progressBar = document.querySelector('.progress-bar')
const image = document.querySelector('.image')
const title = document.querySelector('.title')
const artist = document.querySelector('.artist')
const playButton = document.querySelector('.play-button')
const playlistContainer = document.querySelector('.playlist-container')
const currentTrack = new Audio('https://colorghost.app/magic-of-the-mind.mp3')

let currentIndex = 0

const renderProgressBar = _ => {
  const progress = (currentTrack.currentTime / currentTrack.duration) * 100
  progressBar.style.width = `${progress}%`
}

const togglePlayPause = _ => {
  if (currentTrack.paused) {
    currentTrack.play()
    playButton.innerText = 'PAUSE'
  } else {
    currentTrack.pause()
    playButton.innerText = 'PLAY'
  }
}

const changeAudioSrc = _ => {
  currentTrack.src = tracks[currentIndex].path
}

const playNext = _ => {
  if (tracks[currentIndex + 1]) {
    currentIndex++
    progressBar.style.width = '0px'
    changeAudioSrc()
    togglePlayPause()
    render()
  } else {
    currentIndex = 0
    progressBar.style.width = '0px'
    playButton.innerText = 'PLAY'
    changeAudioSrc()
    render()
  }
}

const playlistListener = _ => {
  let playlist = document.querySelectorAll('.playlist-track')

  playlist.forEach((elem, index) => {
    elem.addEventListener('click', _ => {
      if (index === currentIndex) {
        togglePlayPause()
        render()
      } else {
        currentIndex = index
        progressBar.style.width = '0px'
        changeAudioSrc()
        togglePlayPause()
        render()
      }
    })
  })
}

playButton.addEventListener('click', _ => {
  togglePlayPause()
  render()
})

currentTrack.addEventListener('timeupdate', _ => {
  renderProgressBar()
})

currentTrack.addEventListener('ended', _ => {
  playNext()
})

progressContainer.addEventListener('click', event => {
  const progress = event.offsetX / progressContainer.offsetWidth
  currentTrack.currentTime = progress * currentTrack.duration
})

const toggleIcon = index => {
  if (currentIndex === index) {
    return currentTrack.paused ? 'fa-play' : 'fa-pause'
  }
  return 'fa-play'
}

const render = _ => {
  image.src = tracks[currentIndex].image
  title.innerText = tracks[currentIndex].title
  artist.innerText = tracks[currentIndex].artist

  let markup = ''

  tracks.forEach((elem, index) => {
    markup +=
      `<div class="playlist-track ${currentIndex === index ? 'active' : ''}">
        <span class="fa ${toggleIcon(index)}"></span>
        <span class="playlist-track-title">${elem.title}</span>
        <span class="playlist-track-length">${elem.length}</span>
      </div>`
  })
  playlistContainer.innerHTML = markup
  playlistListener()
}

render()
