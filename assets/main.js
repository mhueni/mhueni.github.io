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
    ready.push(el)
  })

  if (!ready.length) return

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.dataset.typing) {
          startTyping(entry.target)
          obs.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15 }
  )

  ready.forEach(function (el) {
    obs.observe(el)
  })

  function startTyping(el) {
    el.dataset.typing = '1'
    var text = el.dataset.text

    el.innerText = text[0]
    el.classList.add('typing-active')

    var i = 1
    function tick() {
      if (i < text.length) {
        el.innerText += text[i]
        i++
        setTimeout(tick, SPEED)
      } else {
        el.classList.remove('typing-active')
      }
    }
    tick()
  }
})()
