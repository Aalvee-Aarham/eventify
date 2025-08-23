const Hero: React.FC = () => {
  return (
    <section id="hero" className="bg-blue-500 text-white text-center py-20">
      <h1 className="text-4xl font-semibold mb-4">Welcome to Our Website!</h1>
      <p className="text-xl">Your journey starts here. Explore our features and services.</p>
      <a href="#feature" className="mt-6 inline-block px-8 py-3 bg-white text-blue-500 font-semibold rounded-lg">
        Learn More
      </a>
    </section>
  )
}

export default Hero
