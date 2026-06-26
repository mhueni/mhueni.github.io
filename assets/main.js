(function () {
  'use strict'

  var SPEED = 15
  var targets = document.querySelectorAll('.subtitle')
  if (!targets.length) return

  var ready = []

  targets.forEach(function (el) {
    var text = el.innerText
    if (!text.trim()) return
    el.dataset.text = text
    el.innerHTML = '&nbsp;'
    ready.push(el)
  })

  if (!ready.length) return

  var queue = []
  var isProcessing = false

  var obs = new IntersectionObserver(
    function (entries) {
      var newlyVisible = false
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.dataset.queued) {
          entry.target.dataset.queued = '1'
          queue.push(entry.target)
          obs.unobserve(entry.target)
          newlyVisible = true
        }
      })

      if (newlyVisible && !isProcessing) {
        isProcessing = true
        processNext()
      }
    },
    { threshold: 0.15 }
  )

  ready.forEach(function (el) {
    obs.observe(el)
  })

  function processNext() {
    if (!queue.length) {
      isProcessing = false
      return
    }
    var el = queue.shift()
    startTyping(el, processNext)
  }

  function startTyping(el, callback) {
    var text = el.dataset.text
    el.innerText = ''
    el.classList.add('typing-active')

    var i = 0
    function tick() {
      if (i < text.length) {
        el.innerText += text[i]
        i++
        setTimeout(tick, SPEED)
      } else {
        el.classList.remove('typing-active')
        if (callback) callback()
      }
    }
    tick()
  }
})()
