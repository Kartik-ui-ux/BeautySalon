import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Star, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { API } from '../app';

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, reviewsRes, promotionsRes] = await Promise.all([
        axios.get(`${API}/services`),
        axios.get(`${API}/reviews`),
        axios.get(`${API}/promotions`),
      ]);
      setServices(servicesRes.data.slice(0, 3));
      setReviews(reviewsRes.data.slice(0, 3));
      setPromotions(promotionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden noise-overlay">
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1705326701287-346fc37a2c86?crop=entropy&cs=srgb&fm=jpg&q=85"
            alt="Luxury salon interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 text-center px-6 max-w-5xl"
          data-testid="hero-section"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-8"
          >
            <Sparkles size={16} className="text-primary" />
            <span className="text-xs uppercase tracking-widest font-semibold">Luxury Beauty Experience</span>
          </motion.div>

          <h1 className="font-serif text-6xl md:text-8xl italic font-normal tracking-tighter mb-6 leading-tight">
            Where Beauty
            <br />
            <span className="text-gradient">Becomes Art</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience transformative beauty treatments in our serene sanctuary.
            Where expertise meets elegance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/booking">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="hero-book-button"
                className="btn-hover bg-primary text-white px-8 py-4 rounded-sm text-sm font-semibold uppercase tracking-widest shadow-soft"
              >
                Book Appointment
              </motion.button>
            </Link>
            <Link to="/services">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="hero-services-button"
                className="btn-hover border border-primary text-primary px-8 py-4 rounded-sm text-sm font-semibold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors"
              >
                View Services
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Services */}
      <section className="py-24 md:py-32 px-6" data-testid="featured-services">
        <div className="max-w-[90vw] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-4">Our Signature Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Curated treatments designed to enhance your natural beauty
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-lift glass rounded-sm overflow-hidden group"
                data-testid={`service-card-${index}`}
              >
                <div className="image-zoom h-64 overflow-hidden">
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
                    {service.category}
                  </div>
                  <h3 className="text-xl font-serif font-semibold mb-3">{service.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-semibold text-primary">${service.price}</span>
                    <span className="text-sm text-muted-foreground">{service.duration} min</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="view-all-services-button"
                className="btn-hover inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-sm text-sm font-medium uppercase tracking-widest"
              >
                <span>View All Services</span>
                <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      {promotions.length > 0 && (
        <section className="py-24 bg-secondary" data-testid="promotions-section">
          <div className="max-w-[90vw] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-4">Special Offers</h2>
              <p className="text-muted-foreground text-lg">Exclusive promotions just for you</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {promotions.map((promo, index) => (
                <motion.div
                  key={promo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-heavy rounded-sm overflow-hidden p-8 text-center card-lift"
                  data-testid={`promo-card-${index}`}
                >
                  <div className="text-3xl font-serif font-bold text-primary mb-3">
                    {promo.discount}
                  </div>
                  <h3 className="text-xl font-serif font-semibold mb-3">{promo.title}</h3>
                  <p className="text-muted-foreground mb-4">{promo.description}</p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Valid until {new Date(promo.valid_until).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="py-24 md:py-32 px-6" data-testid="reviews-section">
          <div className="max-w-[90vw] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-4">Client Love</h2>
              <p className="text-muted-foreground text-lg">What our clients say about us</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass rounded-sm p-8"
                  data-testid={`review-card-${index}`}
                >
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">"{review.comment}"</p>
                  <div className="border-t border-border pt-4">
                    <p className="font-semibold">{review.client_name}</p>
                    <p className="text-sm text-muted-foreground">{review.service_name}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/reviews">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid="view-all-reviews-button"
                  className="btn-hover inline-flex items-center space-x-2 border border-primary text-primary px-6 py-3 rounded-sm text-sm font-medium uppercase tracking-widest hover:bg-primary hover:text-white transition-colors"
                >
                  <span>View All Reviews</span>
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-accent text-white relative overflow-hidden" data-testid="cta-section">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1726896512442-09e073b678a6?crop=entropy&cs=srgb&fm=jpg&q=85"
            alt="Texture"
            className="w-full h-full object-cover"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center px-6 relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
            Ready to Transform Your Look?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Book your appointment today and experience the art of beauty
          </p>
          <Link to="/booking">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="cta-book-button"
              className="btn-hover bg-white text-accent px-8 py-4 rounded-sm text-sm font-semibold uppercase tracking-widest shadow-soft"
            >
              Book Your Experience
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}