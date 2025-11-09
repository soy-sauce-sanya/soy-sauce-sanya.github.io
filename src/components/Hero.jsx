import { useState, useEffect } from 'react'

const Hero = () => {
  const [displayText, setDisplayText] = useState('')
  const [roleIndex, setRoleIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [opacity, setOpacity] = useState(1)

  const roles = ['Web Developer', 'Designer', 'Creator', 'Problem Solver']

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset
      const heroContent = document.querySelector('.hero-content')

      if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`
        setOpacity(1 - (scrolled / 500))
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let timeout

    const currentRole = roles[roleIndex]
    const currentLength = displayText.length

    if (isDeleting) {
      if (currentLength === 0) {
        setIsDeleting(false)
        setRoleIndex((prev) => (prev + 1) % roles.length)
        timeout = setTimeout(() => {}, 500)
      } else {
        timeout = setTimeout(() => {
          setDisplayText(currentRole.substring(0, currentLength - 1))
        }, 75)
      }
    } else {
      if (currentLength === currentRole.length) {
        timeout = setTimeout(() => {
          setIsDeleting(true)
        }, 2000)
      } else {
        timeout = setTimeout(() => {
          setDisplayText(currentRole.substring(0, currentLength + 1))
        }, 150)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, roleIndex, isDeleting])

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary relative overflow-hidden pt-20"
    >
      {/* Decorative SVG Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom',
          backgroundSize: 'cover'
        }}
      />

      {/* Content */}
      <div
        className="hero-content text-center text-white z-10 max-w-4xl px-5"
        style={{ opacity }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in-up">
          Hello, I'm <span className="bg-gradient-to-r from-accent via-pink-500 to-red-500 bg-clip-text text-transparent">Sanya</span>
        </h1>

        <p className="text-xl md:text-2xl mb-4 opacity-95 animate-fade-in-up [animation-delay:0.2s]">
          {displayText}
          <span className="animate-pulse">|</span>
        </p>

        <p className="text-base md:text-lg mb-8 opacity-90 animate-fade-in-up [animation-delay:0.4s]">
          I create beautiful and functional websites that make a difference.
        </p>

        <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up [animation-delay:0.6s]">
          <a
            href="#projects"
            className="px-8 py-3 bg-white text-primary rounded-full font-semibold
              hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="px-8 py-3 bg-transparent text-white border-2 border-white rounded-full
              font-semibold hover:bg-white hover:text-primary hover:-translate-y-1
              transition-all duration-300"
          >
            Get In Touch
          </a>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-arrow">
        <a href="#about" className="text-white text-3xl opacity-70 hover:opacity-100 transition-opacity">
          <i className="fas fa-chevron-down"></i>
        </a>
      </div>
    </section>
  )
}

export default Hero
