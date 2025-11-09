import { useEffect, useRef } from 'react'

const Projects = () => {
  const projects = [
    {
      image: 'https://via.placeholder.com/400x300/667eea/ffffff?text=Project+1',
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with payment integration and admin dashboard.',
      tags: ['React', 'Node.js', 'MongoDB'],
      link: '#'
    },
    {
      image: 'https://via.placeholder.com/400x300/f093fb/ffffff?text=Project+2',
      title: 'Task Management App',
      description: 'A collaborative task management tool with real-time updates and notifications.',
      tags: ['Vue.js', 'Firebase', 'Tailwind'],
      link: '#'
    },
    {
      image: 'https://via.placeholder.com/400x300/4facfe/ffffff?text=Project+3',
      title: 'Portfolio Generator',
      description: 'An automated portfolio generator that creates beautiful websites from templates.',
      tags: ['JavaScript', 'CSS', 'API'],
      link: '#'
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
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
          Featured Projects
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-5 rounded"></div>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {projects.map((project, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="bg-white rounded-2xl overflow-hidden shadow-lg
                hover:-translate-y-3 hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-60 overflow-hidden group">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100
                  transition-opacity duration-300 flex items-center justify-center">
                  <a
                    href={project.link}
                    className="text-white text-3xl hover:scale-125 transition-transform"
                  >
                    <i className="fas fa-external-link-alt"></i>
                  </a>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-gradient-to-r from-primary to-accent
                        text-white text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
