import { useEffect, useRef } from 'react'

const Skills = () => {
  const skills = [
    {
      icon: 'fab fa-html5',
      title: 'Frontend Development',
      description: 'HTML, CSS, JavaScript, React, Vue.js'
    },
    {
      icon: 'fas fa-server',
      title: 'Backend Development',
      description: 'Node.js, Python, PHP, Databases'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Responsive Design',
      description: 'Mobile-first, Cross-browser compatibility'
    },
    {
      icon: 'fas fa-paint-brush',
      title: 'UI/UX Design',
      description: 'Figma, Adobe XD, User Research'
    },
    {
      icon: 'fab fa-git-alt',
      title: 'Version Control',
      description: 'Git, GitHub, GitLab'
    },
    {
      icon: 'fas fa-database',
      title: 'Databases',
      description: 'MySQL, PostgreSQL, MongoDB'
    }
  ]

  const cardsRef = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1'
            entry.target.style.transform = 'translateY(0)'
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    )

    cardsRef.current.forEach(card => {
      if (card) {
        card.style.opacity = '0'
        card.style.transform = 'translateY(30px)'
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
        observer.observe(card)
      }
    })

    return () => {
      cardsRef.current.forEach(card => {
        if (card) observer.unobserve(card)
      })
    }
  }, [])

  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
          My Skills
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-5 rounded"></div>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {skills.map((skill, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="bg-white p-8 rounded-2xl text-center shadow-lg
                hover:-translate-y-3 hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-5xl text-gradient mb-4">
                <i className={skill.icon}></i>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {skill.title}
              </h3>
              <p className="text-gray-600">
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
