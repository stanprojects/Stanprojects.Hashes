
const Colors = Object.freeze({
    Dark: 'dark',
    Light: 'light',
});

const HashAlgorithm = Object.freeze({
    MD5: 'md5',
    SHA1: 'sha1',
    SHA256: 'sha256',
    SHA512: 'sha512',
});

let _colors = undefined
let _hashAlgorithm = undefined
const hashAlgorithms = [
    HashAlgorithm.MD5,
    HashAlgorithm.SHA1,
    HashAlgorithm.SHA256,
    HashAlgorithm.SHA512,
]

const ColorsSwitch = document.getElementById('ColorsSwitch')
const HashAlgorithmList = document.getElementById('HashAlgorithmList')

function colorsOf(name) {
    return Object.values(Colors).includes(name) ? name : Colors.Dark;
}

function hashAlgorithmOf(name) {
    return Object.values(HashAlgorithm).includes(name) ? name : HashAlgorithm.MD5;
}

function renderColors(colors) {
    _colors = colors
    ColorsSwitch.textContent = colors
    document.documentElement.setAttribute('data-colors', colors)
    document.querySelector('link[rel="icon"]').href = colors === Colors.Dark
        ? './src/main/svg/favicon_dark.svg'
        : './src/main/svg/favicon_light.svg'
}

function renderHashAlgorithm(hashAlgorithm) {
    _hashAlgorithm = hashAlgorithm
    HashAlgorithmList.querySelectorAll('.HashAlgorithmItem').forEach((it) => {
        it.classList.toggle('selected', it.dataset.id === hashAlgorithm)
    })
    // todo
}

function getState({ colors = _colors, hashAlgorithm = _hashAlgorithm } = {}) {
    return `#colors=${colors}&ha=${hashAlgorithm}`
}

function onStateChange({ colors = _colors, hashAlgorithm = _hashAlgorithm }, needsToPush = false) {
    if (_colors !== colors) {
        renderColors(colors)
    }
    if (_hashAlgorithm !== hashAlgorithm) {
        renderHashAlgorithm(hashAlgorithm)
    }
    const expected = getState({ colors: colors, hashAlgorithm: hashAlgorithm })
    if (location.hash !== expected) {
        if (needsToPush) {
            history.pushState(null, '', expected)
        } else {
            history.replaceState(null, '', expected)
        }
    }
}

function onPopState() {
    const params = new URLSearchParams(location.hash.slice(1))
    const colors = colorsOf(params.get('colors'))
    const hashAlgorithm = hashAlgorithmOf(params.get('ha'))
    onStateChange({ colors: colors, hashAlgorithm: hashAlgorithm })
}

function initHashAlgorithms(hashAlgorithms) {
    HashAlgorithmList.replaceChildren()
    for (const hashAlgorithm of hashAlgorithms) {
        const it = document.createElement('div')
        it.dataset.id = hashAlgorithm
        it.className = 'Box Clickable HashAlgorithmItem'
        it.textContent = hashAlgorithm
        HashAlgorithmList.appendChild(it)
    }
}

ColorsSwitch.addEventListener('click', () => {
    const colors = _colors === Colors.Dark ? Colors.Light : Colors.Dark
    onStateChange({ colors: colors })
})

window.addEventListener('popstate', () => {
    onPopState()
})

initHashAlgorithms(hashAlgorithms)

onPopState()
