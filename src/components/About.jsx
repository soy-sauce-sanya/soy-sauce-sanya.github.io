import { useState, useEffect, useRef } from 'react'

const About = () => {
  const [stats, setStats] = useState([
    { value: 0, target: 5, label: 'Years Experience' },
    { value: 0, target: 50, label: 'Projects Completed' },
    { value: 0, target: 30, label: 'Happy Clients' }
  ])
  const [hasAnimated, setHasAnimated] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            animateStats()
          }
        })
      },
      { threshold: 0.5 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [hasAnimated])

  const animateStats = () => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    stats.forEach((stat, index) => {
      const increment = stat.target / steps
      let currentValue = 0

      const interval = setInterval(() => {
        currentValue += increment
        if (currentValue >= stat.target) {
          currentValue = stat.target
          clearInterval(interval)
        }

        setStats(prevStats => {
          const newStats = [...prevStats]
          newStats[index] = { ...newStats[index], value: Math.ceil(currentValue) }
          return newStats
        })
      }, stepDuration)
    })
  }

  return (
    <section id="about" className="py-20 bg-white" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800 relative">
          About Me
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-5 rounded"></div>
        </h2>

        <div className="max-w-4xl mx-auto mt-12">
          <div className="text-center space-y-6">
            <p className="text-lg md:text-xl text-gray-600">
              hi! my name is Sanya.
            </p>

            <p className="text-lg md:text-xl text-gray-600">
              When I'm not coding, you can find me exploring new technologies, contributing
              to open-source projects, or enjoying a good cup of coffee while reading about
              the latest tech trends.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                    {stat.value}+
                  </h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
