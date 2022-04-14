'use strict'

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

function onDrawText(ev) {
    ev.preventDefault()

    let txt = document.querySelector('input[name=line-input]')
    if (!txt.value) return

    let font = getFont()
    let fontSize = getFontSize() + 'px'
    let textColor = getTextColor()
    setMemeLine(txt.value, font, fontSize, textColor)
    drawText()
    txt.value = ''
}

function drawText() {
    let meme = getMeme()
    if (!meme) return
    let line = meme.lines[meme.lines.length - 1]

    gCtx.textBaseline = 'hanging';
    // gCtx.textAlign = 'center';

    gCtx.fillStyle = line.textColor
    gCtx.font = line.fontSize + ' ' + line.font;
    gCtx.fillText(line.txt, line.pos.x, line.pos.y);

    let textWidth = gCtx.measureText(line.txt).width
    createCtxObject(line.pos, textWidth, line.fontSize)

    // gCtx.strokeStyle = 'red';
    // gCtx.strokeText(txt, 100, 100);
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