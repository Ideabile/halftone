function EventTarget() {
  const bus = global.Element ? document.createElement('div') : null

  this.addEventListener = (...args) => {
    if (bus) {
      bus.addEventListener(...args)
    }
  }

  this.dispatchEvent = (...args) => {
    if (bus) {
      bus.dispatchEvent(...args)
    }
  }
}

class Bus extends EventTarget {
}

export default new Bus()
