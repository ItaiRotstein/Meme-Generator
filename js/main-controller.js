'use strict'
'use strict'

let gElCanvas
let gCtx
let gStartPos
let gIsClicked = false
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function init() {

    createCanvas()

}

function createCanvas() {
    gElCanvas = document.querySelector('#canvas');
    gCtx = gElCanvas.getContext('2d');
    addListeners()

}

function renderCanvas(ctxObject) {
    let currMeme = getMeme()
    drawImgMeme(currMeme.selectedImgId)
    // gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
    drawText()
}

function renderGallery() {

    let elGallery = document.querySelector('.gallery')
    elGallery.classList.toggle('open')
    var imgs = getImgs()

    let strHtmls = ''
    strHtmls = imgs.map(img => `<img src="${img.url}" alt="" onclick="onSetImg(${img.id})">`)

    elGallery.innerHTML = strHtmls.join('')
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}


function onSetImg(imgId) {
    document.querySelector('.gallery').classList.remove('open')
    drawImgMeme(imgId)
    setMeme(imgId)
}

function drawImgMeme(id) {
    let imgMeme = getImageById(id)
    let img = new Image()
    img.src = imgMeme.url
    // resizeCanvas(img)
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height) //img,x,y,xend,yend
    }
}

function onSetFont(font) {
    setFont(font)
}

function onSetFontSize(diff) {
    setFontSize(diff)
}

function onSetTextColor(color) {
    setTextColor(color)
}

function onSetTextAlign(align) {
    setTextAlign(align)
}

function onSetTextStroke() {
    setTextStroke()
}

function onDrawText(ev) {
    ev.preventDefault()

    let txt = document.querySelector('input[name=line-input]')
    if (!txt.value) return

    let font = getFont()
    let fontSize = getFontSize() + 'px'
    let textColor = getTextColor()
    let textAlign = getTextAlign()
    let stroke = isStroke()
    setMemeLine(txt.value, font, fontSize, textColor, textAlign, stroke)
    drawText()
    txt.value = ''
}

function drawText() {
    let meme = getMeme()
    if (!meme) return
    let line = meme.lines[meme.lines.length - 1]
    console.log(meme);
    gCtx.textBaseline = 'hanging'
    gCtx.textAlign = line.align

    
    gCtx.fillStyle = line.textColor
    gCtx.font = line.fontSize + ' ' + line.font
    gCtx.fillText(line.txt, line.pos.x, line.pos.y)
    
    gCtx.strokeStyle = 'black';
    if (line.isStroke) gCtx.strokeText(line.txt, line.pos.x, line.pos.y);

    let textWidth = gCtx.measureText(line.txt).width
    createCtxObject(line.pos, textWidth, line.fontSize)

}

function onSetSticker(img) {
    drawSticker(img.src)
}

function drawSticker(stickerUrl) {
    let sticker = new Image()
    sticker.src = stickerUrl
    sticker.width = gElCanvas.width / 8
    sticker.height = gElCanvas.height / 8

    let pos = getStickerPos(sticker)
    sticker.onload = () => {
        gCtx.drawImage(sticker, pos.x, pos.y, sticker.width, sticker.height) //img,x,y,xend,yend
    }
}

function onDown(ev) {
    gIsClicked = true
    const pos = getEvPos(ev)
    let ctxObject = getCtxObjectByPos(pos)
    if (!ctxObject) return
    setCtxObjectDrag(ctxObject, true)
    gStartPos = pos
    document.body.style.cursor = 'grabbing'

}

function onMove(ev) {
    if (!gIsClicked) return
    const pos = getEvPos(ev)
    const ctxObject = getCtxObjectByPos(pos)
    if (!ctxObject.isDrag) return
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveObject(ctxObject, dx, dy)
    gStartPos = pos
    renderCanvas(ctxObject)
}

function onUp(ev) {
    const pos = getEvPos(ev)
    let ctxObject = getCtxObjectByPos(pos)
    setCtxObjectDrag(ctxObject, false)
    document.body.style.cursor = 'grab'
    gIsClicked = false
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}

function resizeCanvas(img) {
    // gElCanvas.width = (img.height * gElCanvas.height) / img.width    
    // gElCanvas.height = (img.height * gElCanvas.width) / img.width  
}

function downloadCanvas(elLink) {
    let meme = getMeme()
    if (!meme) return
    const data = gElCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my_canvas.jpg'
}
