import splitJs from 'split.js'

// This is used to expose the instance so that instance methods can be used
export let splitInstance = null

export default {
  mounted(el) {
    const idList = Array.from(el.children).map(e => `#${(e as any).id}`)
    splitInstance = splitJs(idList, {
      sizes: [20, 80],
      minSize: 320,
      expandToMin: true,
      gutterSize: 2,
      cursor: 'col-resize',
      gutter(index, gutterDirection) {
        const gutter = document.createElement('div')
        const gripper = document.createElement('span')
        gripper.innerHTML = '&#xe1fa;'
        gripper.className = 'gripper'
        gutter.className = `gutter gutter-${gutterDirection}`
        gutter.appendChild(gripper)
        return gutter
      },
    })
  },
}
