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

let gCtxObjects = []
let gCurrFont = 'Impact'
let gCurrFontSize = 60
let gCurrTextColor = '#ffffff'

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

var gMeme

function getMeme() {
    return gMeme
}

function setMemeLine(txt, font, fontSize, textColor) {
    if (gMeme === undefined) return
    let line = _createLine(txt, font, fontSize, textColor)
    gMeme.lines.push(line)
}


function getImageById(imgId) {
    return gImgs.find(img => img.id === imgId)
}

function setMeme(imgId) {
    _createMeme(imgId)
}

// function getObject() {
//     return object
// }

function getFont() {
    return gCurrFont
}

function getFontSize() {
    return gCurrFontSize
}

function getTextColor() {
    return gCurrTextColor
}

function getImgs() {
    return gImgs
}

function createCtxObject(pos, width, height) {
    height = _getFixedHeight(height)
    let ctxObject = {
        pos,
        size: { x: width, y: height },
        isDrag: false,
        id: makeId()
    }
    gCtxObjects.push(ctxObject)
}


function isCtxObjectClicked(clickedPos) {
    console.log(clickedPos);
    console.log(gCtxObjects);

    var isClicked = gCtxObjects.some(ctxObject =>
        (clickedPos.x >= ctxObject.pos.x) && (clickedPos.x <= (ctxObject.pos.x + ctxObject.size.x))
        && (clickedPos.y >= ctxObject.pos.y) && (clickedPos.y <= (ctxObject.pos.y + ctxObject.size.y))
    )
    console.log(isClicked);
    return isClicked
}

function getCtxObjectByPos(pos) {
           return gCtxObjects.find(ctxObject => (pos.x >= ctxObject.pos.x) && (pos.x <= (ctxObject.pos.x + ctxObject.size.x))
        && (pos.y >= ctxObject.pos.y) && (pos.y <= (ctxObject.pos.y + ctxObject.size.y))
    )
}

function setCtxObjectDrag(ctxObject, isDrag) {
    ctxObject.isDrag = isDrag
    console.log(ctxObject);
}

function moveObject(ctxObject, dx, dy) {
    ctxObject.pos.x += dx
    ctxObject.pos.y += dy
}

function setFont(font) {
    gCurrFont = font
}

function setFontSize(diff) {
    gCurrFontSize += diff
}

function setTextColor(color) {
    gCurrTextColor = color
}

let gStickerPos
function getStickerPos(sticker) {
    if (gStickerPos) {
        gStickerPos.x += 70
    }
    else {
        gStickerPos = {
            x: (gElCanvas.width / 6),
            y: (gElCanvas.height / 4)
        }
    }
    return gStickerPos
}


function _createMeme(imgId) {
    gMeme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        inputCount: 0,
        lines: [],
    }
}

function _createLine(txt, font, fontSize, textColor) {
    return {
        txt,
        font,
        fontSize,
        textColor,
        pos: _getPos()
    }
}

function _getPos() {
    let pos = {}
    if (gMeme.inputCount === 0) {
        pos.x = gElCanvas.width / 3
        pos.y = gElCanvas.height / 6
    } else if (gMeme.inputCount === 1) {
        pos.x = gElCanvas.width / 2
        pos.y = (gElCanvas.height / 6) * 5
    } else {
        pos.x = gElCanvas.width / 2
        pos.y = gElCanvas.height / 2
    }
    gMeme.inputCount++
    pos.x = parseInt(pos.x)
    pos.y = parseInt(pos.y)
    return pos
}

function _getFixedHeight(height) {
    height = height.slice(0, height.indexOf('px'))
    return +height
}