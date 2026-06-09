  const piece = document.getElementById('piece')
  const pathEl = document.getElementById('piece-path')
  const code = document.getElementById('code')

  const controls = {
    size: document.getElementById('size'),
    tab: document.getElementById('tab'),
    radius: document.getElementById('radius'),

    top: document.getElementById('top'),
    right: document.getElementById('right'),
    bottom: document.getElementById('bottom'),
    left: document.getElementById('left'),
  }

  const labels = {
    sizeValue: document.getElementById('sizeValue'),
    tabValue: document.getElementById('tabValue'),
    radiusValue: document.getElementById('radiusValue'),
  }

  function edgeHorizontal(x, y, w, dir, tab, invert = false) {

    const third = w / 3
    const half = w / 2

    if (dir === 0) {
      return `L ${x+w} ${y}`
    }

    const sign = invert ? -dir : dir
    const bump = sign * tab
    const curve = Math.abs(tab) * 0.8

    return `
      L ${x+third} ${y}

      C ${x+third+curve} ${y}
        ${x+third+curve} ${y+bump}
        ${x+half} ${y+bump}

      C ${x+third*2-curve} ${y+bump}
        ${x+third*2-curve} ${y}
        ${x+third*2} ${y}

      L ${x+w} ${y}
    `
  }

  function edgeVertical(x, y, h, dir, tab, invert = false) {

    const third = h / 3
    const half = h / 2

    if (dir === 0) {
      return `L ${x} ${y+h}`
    }

    const sign = invert ? -dir : dir
    const bump = sign * tab
    const curve = Math.abs(tab) * 0.8

    return `
      L ${x} ${y+third}

      C ${x} ${y+third+curve}
        ${x+bump} ${y+third+curve}
        ${x+bump} ${y+half}

      C ${x+bump} ${y+third*2-curve}
        ${x} ${y+third*2-curve}
        ${x} ${y+third*2}

      L ${x} ${y+h}
    `
  }

  function buildPath() {

    const size = +controls.size.value
    const tab = +controls.tab.value
    const r = +controls.radius.value

    const top = +controls.top.value
    const right = +controls.right.value
    const bottom = +controls.bottom.value
    const left = +controls.left.value

    labels.sizeValue.textContent = size
    labels.tabValue.textContent = tab
    labels.radiusValue.textContent = r

    const x = tab + 20
    const y = tab + 20

    const w = size
    const h = size

    const path = `
      M ${x+r} ${y}

      ${edgeHorizontal(x, y, w, top, -tab)}

      Q ${x+w} ${y}
        ${x+w} ${y+r}

      ${edgeVertical(x+w, y, h, right, tab)}

      Q ${x+w} ${y+h}
        ${x+w-r} ${y+h}

      ${edgeHorizontal(x+w, y+h, -w, bottom, tab, true)}

      Q ${x} ${y+h}
        ${x} ${y+h-r}

      ${edgeVertical(x, y+h, -h, left, -tab, true)}

      Q ${x} ${y}
        ${x+r} ${y}

      Z
    `

    pathEl.setAttribute('d', path)

    piece.style.width = `${size + tab*2 + 40}px`
    piece.style.height = `${size + tab*2 + 40}px`

    piece.style.clipPath = `url(#piece-clip)`
    piece.style.webkitClipPath = `url(#piece-clip)`

    code.value = path
  }

  function randomSide() {
    return [-1,0,1][Math.floor(Math.random()*3)]
  }

  function randomize() {
    controls.top.value = randomSide()
    controls.right.value = randomSide()
    controls.bottom.value = randomSide()
    controls.left.value = randomSide()

    buildPath()
  }

  Object.values(controls).forEach(control => {
    control.addEventListener('input', buildPath)
  })

  document
    .getElementById('randomBtn')
    .addEventListener('click', randomize)

  buildPath()