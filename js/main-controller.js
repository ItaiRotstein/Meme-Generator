'use strict'

let gElCanvas
let gCtx
var gKeywordSearchCountMap = { 'FUNNY': 12, 'ANIMAL': 16, 'BABY': 6, 'CUTE': 22, 'MAN': 14 }

function init() {
    createCanvas()
    onKeyWordsSetup()
    addListeners()
    drawImgMeme('img/meme-imgs (square)/5.jpg')
    document.querySelector('.font-size-show').innerText = getFontSize()
}

function createCanvas() {
    gElCanvas = document.querySelector('#canvas');
    gCtx = gElCanvas.getContext('2d');
}

function addListeners() {
    let elKeyWords = document.querySelectorAll('.tag-search h6')
    elKeyWords.forEach(elKeyWord => elKeyWord.addEventListener('click', onIncreaseKeyWordFontSize))
}


function onIncreaseKeyWordFontSize(keyword) {
    let elKeyWord = keyword.target
    gKeywordSearchCountMap[elKeyWord.innerText] += 2
    let fontSize = gKeywordSearchCountMap[elKeyWord.innerText]
    elKeyWord.style.fontSize = fontSize + 'px'
}

function onKeyWordsSetup() {
    let strHtmls = ''
    for (let i in gKeywordSearchCountMap) {
        strHtmls += `<h6 style="font-size: ${gKeywordSearchCountMap[i]}px;" onclick="onFilterKeyWordsTag('${i}')">${i}</h6>`
    }
    document.querySelector('.tag-search').innerHTML = strHtmls
}

function toggleMenu() {
    document.body.classList.toggle('menu-open')
}

function renderCanvas() {
    let meme = getMeme()
    let memeImg = getImageById(meme.selectedImgId)
    drawImgMeme(memeImg.url)
    setTimeout(() => {
        drawText(meme)
        drawRect(meme)
    }, 1)
}

function drawImgMeme(imageUrl) {
    if (!imageUrl) return

    let img = new Image()
    img.src = imageUrl

    resizeCanvas(img)
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    }
}

function drawText(meme) {
    if (!meme || meme.lines.length === 0) return
    meme.lines.forEach(line => {

        gCtx.textBaseline = 'hanging'
        gCtx.textAlign = line.align

        gCtx.fillStyle = line.textColor
        gCtx.font = line.fontSize + 'px' + ' ' + line.font
        gCtx.fillText(line.txt, line.pos.x, line.pos.y)
        gCtx.strokeStyle = 'black';
        if (line.isStroke) gCtx.strokeText(line.txt, line.pos.x, line.pos.y);

        line.size.width = parseInt(gCtx.measureText(line.txt).width)
    })
}


function drawRect(meme) {
    if (!meme || !meme.isLineChosen || meme.selectedLineIdx === -1 || meme.lines.length === 0) return
    let line = meme.lines[meme.selectedLineIdx]

    let rect = {
        x: line.pos.x,
        y: line.pos.y,
        width: line.size.width,
        height: line.size.height
    }

    if (line.align === 'center') rect.x = rect.x - (rect.width / 2)
    else if (line.align === 'right') rect.x = rect.x - rect.width

    gCtx.beginPath()
    gCtx.rect(rect.x - 5, rect.y - 2, rect.width + 10, rect.height + 2);
    gCtx.strokeStyle = 'black';
    gCtx.stroke();
    gCtx.closePath()

    meme.isLineChosen = false
}

function renderGalleryModal(keyword) {
    var imgs = getImgs()

    if (keyword) imgs = imgs.filter(img => img.keywords.includes(keyword))

    let strHtmls = ''
    strHtmls = imgs.map(img => `<img src="${img.url}" onclick="onSetImg(${img.id})">`)

    document.querySelector('.gallery-content').innerHTML = strHtmls.join('')
}

function renderMemsModal(elMemes) {
    let memes = loadFromStorage(STORAGE_KEY)
    if (!memes || memes.length === 0) return
    let strHtmls = ''
    memes.map((meme) => {
        var imgId = meme.slice(47)
        strHtmls += elMemes.innerHTML = `<img src="http://ca-upload.com/here/img/${imgId}.jpg" onclick="onRenderSavedMeme(this)">`
    })
    elMemes.innerHTML = strHtmls
}

function onRenderSavedMeme(img) {
    document.querySelector('.memes-modal').classList.remove('open')

    drawImgMeme(img.src)
}

function onRenderGalleryModal() {
    document.body.classList.remove("menu-open");
    document.querySelector('.memes-modal').classList.remove('open')
    let elGallery = document.querySelector('.gallery-modal')
    elGallery.classList.toggle('open')

    renderGalleryModal()
}

function onRenderMemesModal() {
    document.body.classList.remove("menu-open");
    document.querySelector('.gallery-modal').classList.remove('open')

    let elMemes = document.querySelector('.memes-modal')
    renderMemsModal(elMemes)
    elMemes.classList.toggle('open')
}

function onFilterKeyWordsDataList(ev) {
    ev.preventDefault()
    let keyword = document.querySelector('#keyword').value
    renderGalleryModal(keyword.toLowerCase())
}

function onFilterKeyWordsTag(keyword) {
    renderGalleryModal(keyword.toLowerCase())
}

function onSetImg(imgId) {
    document.querySelector('.gallery-modal').classList.remove('open')
    setMeme(imgId)
    renderCanvas()
}

function onSetLine(ev) {
    ev.preventDefault()

    let meme = getMeme()
    let txt = document.querySelector('input[name=line-input]')
    if (!txt.value || !meme) return

    let font = getFont()
    let fontSize = getFontSize()
    let textColor = getTextColor()
    let textAlign = getTextAlign()
    let stroke = isStroke()
    setMemeLine(txt.value, font, fontSize, textColor, textAlign, stroke)
    renderCanvas()
    txt.value = ''
}

function onSetFont(font) {
    setFont(font)
}

function onSetFontSize(diff) {
    setFontSize(diff)
    let fontSize = getFontSize()
    document.querySelector('.font-size-show').innerText = fontSize
    let meme = getMeme()
    if (!meme || meme.selectedLineIdx === -1) return
    meme.lines[meme.selectedLineIdx].fontSize += diff
    renderCanvas()

}

function onSetTextColor(color) {
    setTextColor(color)
    document.querySelector('.btn-control.color').style.backgroundColor = color
    let meme = getMeme()
    if (!meme || meme.selectedLineIdx === -1) return
    meme.lines[meme.selectedLineIdx].textColor = color
    renderCanvas()
}

function onSetTextAlign(align) {
    setTextAlign(align)
    const elALigns = document.querySelectorAll('.align')
    elALigns.forEach(elAlign => elAlign.classList.remove('active'))
    document.querySelector('.align-' + align).classList.toggle('active')
}

function onSetTextStroke(elStroke) {
    setTextStroke()
    elStroke.classList.toggle('active')
}

function onChooseLine() {
    const meme = getMeme()
    if (!meme || meme.lines.length === 0) return
    meme.isLineChosen = true
    meme.selectedLineIdx++
    if (meme.selectedLineIdx > meme.lines.length - 1) meme.selectedLineIdx = 0
    renderCanvas()
}

function onMoveLine(diff) {
    const meme = getMeme()
    if (!meme || meme.selectedLineIdx === -1 || meme.lines.length === 0) return
    meme.isLineChosen = false
    meme.lines[meme.selectedLineIdx].pos.y += diff
    renderCanvas()
}

function onRemoveLine() {
    const meme = getMeme()
    if (!meme || meme.selectedLineIdx === -1) return
    let idx = meme.selectedLineIdx
    meme.lines.splice(idx, 1)
    renderCanvas()
}

function resizeCanvas(img) {
    gElCanvas.width = img.width
    gElCanvas.height = (img.height * gElCanvas.width) / img.width
}

function downloadCanvas(elLink) {
    const meme = getMeme()
    if (!meme) return
    const data = gElCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my_canvas.jpg'
}

function onSaveToStorage() {
    alert('Your meme is saved!')
    const meme = getMeme()
    if (!meme) return
    saveToStorage()
}