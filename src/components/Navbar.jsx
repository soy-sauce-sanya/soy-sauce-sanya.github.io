import { useState, useEffect } from 'react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Update navbar shadow on scroll
      setScrolled(window.pageYOffset > 100)

      // Update active section
      const sections = ['home', 'about', 'skills', 'projects', 'contact']
      const navHeight = 80

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId)
        if (section) {
          const sectionTop = section.offsetTop - navHeight - 100
          const sectionHeight = section.clientHeight

          if (window.pageYOffset >= sectionTop &&
              window.pageYOffset < sectionTop + sectionHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (e, href) => {
    e.preventDefault()
    setIsOpen(false)

    const targetId = href.substring(1)
    const targetSection = document.getElementById(targetId)

    if (targetSection) {
      const navHeight = 80
      const targetPosition = targetSection.offsetTop - navHeight

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
    }
  }

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' }
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 bg-white/98 backdrop-blur-md z-50 transition-shadow duration-300 ${
        scrolled ? 'shadow-2xl' : 'shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center py-4">
          {/* Brand */}
          <div className="text-2xl font-bold text-gradient">
            Portfolio
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8">
            {navLinks.map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className={`relative font-medium text-gray-800 hover:text-primary transition-colors duration-300
                    after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5
                    after:bg-primary after:transition-all after:duration-300 hover:after:w-full
                    ${activeSection === link.href.substring(1) ? 'text-primary' : ''}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col space-y-[5px] p-2 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-gray-800 rounded transition-all duration-300 ${
                isOpen ? 'rotate-45 translate-y-[7px]' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-gray-800 rounded transition-all duration-300 ${
                isOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-gray-800 rounded transition-all duration-300 ${
                isOpen ? '-rotate-45 -translate-y-[7px]' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-96 pb-4' : 'max-h-0'
          }`}
        >
          <ul className="flex flex-col space-y-4 pt-4">
            {navLinks.map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className={`block text-center font-medium text-gray-800 hover:text-primary transition-colors duration-300 ${
                    activeSection === link.href.substring(1) ? 'text-primary' : ''
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
