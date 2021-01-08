/* Inspired by:
https://www.labnol.org/internet/light-youtube-embeds/27941/ */

function embedIframe(event) {
    const div = event.target.parentNode
    const iframe = document.createElement('iframe')
    iframe.setAttribute(
        'src',
        'https://www.youtube.com/embed/' + div.dataset.id + '?autoplay=1&rel=0'
    )
    iframe.setAttribute('frameborder', '0')
    iframe.setAttribute('allowfullscreen', '1')
    iframe.setAttribute(
        'allow',
        'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
    )
    div.parentNode.replaceChild(iframe, div)
}

export function lazilyEmbedVideos() {
    const placeholders = document.querySelectorAll('.video-player')
    Array.from(placeholders).forEach((placeholder) => {
        const videoId = placeholder.dataset.id
        const div = document.createElement('div')
        div.setAttribute('data-id', videoId)
        const thumbNode = document.createElement('img')
        thumbNode.src = `video-thumbnail-${videoId}.png`
        div.appendChild(thumbNode)
        const playButton = document.createElement('div')
        playButton.setAttribute('class', 'play')
        div.appendChild(playButton)
        div.addEventListener('click', embedIframe)
        placeholder.appendChild(div)
    })
}
