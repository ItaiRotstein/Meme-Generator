'use strict'

var gImgs = [
    { id: 1, url: 'img/meme-imgs (square)/1.jpg', keywords: ['man', 'stupid'] },
    { id: 2, url: 'img/meme-imgs (square)/2.jpg', keywords: ['animal', 'cute'] },
    { id: 3, url: 'img/meme-imgs (square)/3.jpg', keywords: ['animal', 'cat'] },
    { id: 4, url: 'img/meme-imgs (square)/4.jpg', keywords: ['cat', 'cat'] },
    { id: 5, url: 'img/meme-imgs (square)/5.jpg', keywords: ['baby', 'funny'] },
    { id: 6, url: 'img/meme-imgs (square)/6.jpg', keywords: ['crazy', 'man'] },
    { id: 7, url: 'img/meme-imgs (square)/7.jpg', keywords: ['baby', 'cute'] },
    { id: 8, url: 'img/meme-imgs (square)/8.jpg', keywords: ['clown', 'man'] },
    { id: 9, url: 'img/meme-imgs (square)/9.jpg', keywords: ['baby', 'funny'] },
    { id: 10, url: 'img/meme-imgs (square)/10.jpg', keywords: ['man', 'smile'] },
    { id: 11, url: 'img/meme-imgs (square)/11.jpg', keywords: ['love', 'man'] },
    { id: 12, url: 'img/meme-imgs (square)/12.jpg', keywords: ['smart', 'man'] },
    { id: 13, url: 'img/meme-imgs (square)/13.jpg', keywords: ['handsome', 'man'] },
    { id: 14, url: 'img/meme-imgs (square)/14.jpg', keywords: ['brave', 'man'] },
    { id: 15, url: 'img/meme-imgs (square)/15.jpg', keywords: ['man', 'brave'] },
    { id: 16, url: 'img/meme-imgs (square)/16.jpg', keywords: ['captain', 'smart'] },
    { id: 17, url: 'img/meme-imgs (square)/17.jpg', keywords: ['man', 'stupid'] },
    { id: 18, url: 'img/meme-imgs (square)/18.jpg', keywords: ['comic', 'kids'] },
]

let gCurrFont = 'Impact'
let gCurrFontSize = 50
let gCurrTextColor = '#015EFE'
let gCurrTextAlign = 'center'
let gCurrIsStroke = false
let gCurrLineHeight = 50

const STORAGE_KEY = 'memeDb'
let gMemes = []


var gMeme

function getMeme() {
    return gMeme
}

function setMemeLine(txt, font, fontSize, textColor, align, stroke) {
    if (gMeme === undefined) return
    let line = _createLine(txt, font, fontSize, textColor, align, stroke)
    gMeme.lines.push(line)
}


function getImageById(imgId) {
    return gImgs.find(img => img.id === imgId)
}

function setMeme(imgId) {
    _createMeme(imgId)
}

function getFont() {
    return gCurrFont
}

function getFontSize() {
    return gCurrFontSize
}

function getTextColor() {
    return gCurrTextColor
}

function getTextAlign() {
    return gCurrTextAlign
}

function isStroke() {
    return gCurrIsStroke
}

function getImgs() {
    return gImgs
}

function setFont(font) {
    gCurrFont = font
}

function setFontSize(diff) {
    gCurrFontSize += diff
    gCurrLineHeight = gCurrFontSize
}

function setTextColor(color) {
    gCurrTextColor = color
}

function setTextAlign(align) {
    gCurrTextAlign = align
}

function setTextStroke() {
    if (!gCurrIsStroke) gCurrIsStroke = true
    else gCurrIsStroke = false
}

function saveToStorage() {
    const imgDataUrl = gElCanvas.toDataURL("image/jpeg");
    _doUploadImg(imgDataUrl);
}

function _doUploadImg(imgDataUrl) {

    const formData = new FormData();
    formData.append('img', imgDataUrl)

    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.text())
        .then((url) => {
            console.log('Got back live url:', url);
            gMemes.push(url)
            saveMemeToStorage(STORAGE_KEY, gMemes)
        })
        .catch((err) => {
            console.error(err)
        })
}

function _createMeme(imgId) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: -1,
        LinesCount: 0,
        lines: [],
        isLineChosen: false
    }
}

function _createLine(txt, font, fontSize, textColor, align, isStroke) {
    return {
        txt,
        font,
        fontSize,
        textColor,
        pos: _getPos(),
        isStroke,
        align,
        size: { height: gCurrLineHeight },
    }
}

function _getPos() {
    let pos = {}
    pos.x = gElCanvas.width / 2
    if (gMeme.LinesCount === 0) {
        pos.y = gElCanvas.height / 6
    } else if (gMeme.LinesCount === 1) {
        pos.y = (gElCanvas.height / 6) * 5
    } else {
        pos.y = gElCanvas.height / 2
    }

    gMeme.LinesCount++
    pos.x = parseInt(pos.x)
    pos.y = parseInt(pos.y)
    return pos
}
