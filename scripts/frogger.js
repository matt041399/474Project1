document.addEventListener('DOMContentLoaded', () => {
    const logsRight = document.querySelectorAll('.log-left')

    function moveLogRight(logRight) {
        switch (true) {
          case logRight.classList.contains('l1'):
          logRight.classList.remove('l1')
          logRight.classList.add('l5')
          break
          case logRight.classList.contains('l2'):
          logRight.classList.remove('l2')
          logRight.classList.add('l1')
          break
          case logRight.classList.contains('l3'):
          logRight.classList.remove('l3')
          logRight.classList.add('l2')
          break
          case logRight.classList.contains('l4'):
          logRight.classList.remove('l4')
          logRight.classList.add('l3')
          break
          case logRight.classList.contains('l5'):
          logRight.classList.remove('l5')
          logRight.classList.add('l4')
          break
        }
      }
)}