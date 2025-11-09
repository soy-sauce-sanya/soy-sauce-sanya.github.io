import { useState, useEffect, useRef } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const contactRef = useRef(null)

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

    if (contactRef.current) {
      contactRef.current.style.opacity = '0'
      contactRef.current.style.transform = 'translateY(30px)'
      contactRef.current.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
      observer.observe(contactRef.current)
    }

    return () => {
      if (contactRef.current) {
        observer.unobserve(contactRef.current)
      }
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for your message! I will get back to you soon.')
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  }

  const contactInfo = [
    {
      icon: 'fas fa-envelope',
      title: 'Email',
      value: 'your.email@example.com',
      link: 'mailto:your.email@example.com'
    },
    {
      icon: 'fas fa-phone',
      title: 'Phone',
      value: '+1 (234) 567-890',
      link: 'tel:+1234567890'
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Location',
      value: 'Your City, Country',
      link: null
    }
  ]

  const socialLinks = [
    { icon: 'fab fa-github', link: '#' },
    { icon: 'fab fa-linkedin', link: '#' },
    { icon: 'fab fa-twitter', link: '#' },
    { icon: 'fab fa-codepen', link: '#' }
  ]

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
          Get In Touch
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-5 rounded"></div>
        </h2>

        <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto mt-6 mb-12">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>

        <div ref={contactRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="text-2xl text-primary mt-1">
                  <i className={info.icon}></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{info.title}</h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-gray-600">{info.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="flex gap-4 pt-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent
                    text-white flex items-center justify-center text-xl
                    hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                  focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10
                  transition-all duration-300"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                  focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10
                  transition-all duration-300"
              />
            </div>

            <div>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                  focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10
                  transition-all duration-300"
              />
            </div>

            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows="5"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none
                  focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10
                  transition-all duration-300"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-primary to-accent
                text-white rounded-xl font-semibold hover:-translate-y-1
                hover:shadow-xl transition-all duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
