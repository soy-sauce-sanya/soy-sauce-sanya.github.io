const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white text-center py-8">
      <div className="max-w-7xl mx-auto px-5">
        <p className="mb-2">
          &copy; {currentYear} Sanya. All rights reserved.
        </p>
        <p className="flex items-center justify-center gap-2">
          Built with <i className="fas fa-heart text-accent"></i> using React & Tailwind CSS
        </p>
      </div>
    </footer>
  )
}

export default Footer
