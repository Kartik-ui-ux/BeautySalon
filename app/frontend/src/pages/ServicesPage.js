import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Tag } from 'lucide-react';
import axios from 'axios';
import { API } from '../app';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API}/services`);
      setServices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(services.map(s => s.category))];
  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="min-h-screen py-24 px-6" data-testid="services-page">
      <div className="max-w-[90vw] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-6">Our Services</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover our comprehensive range of beauty treatments, each designed to bring out your best self
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-16"
          data-testid="category-filter"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              data-testid={`category-${category.toLowerCase()}`}
              className={`px-6 py-2 rounded-sm text-sm font-medium uppercase tracking-widest transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-soft'
                  : 'glass text-foreground hover:bg-primary/10'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading services...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="glass rounded-sm overflow-hidden card-lift group"
                data-testid={`service-item-${index}`}
              >
                <div className="image-zoom h-56 overflow-hidden">
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center space-x-1 text-xs uppercase tracking-widest text-primary font-semibold">
                      <Tag size={12} />
                      <span>{service.category}</span>
                    </span>
                    <span className="text-2xl font-semibold text-primary">${service.price}</span>
                  </div>
                  <h3 className="text-xl font-serif font-semibold mb-3">{service.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock size={16} className="text-primary" />
                      <span>{service.duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <DollarSign size={16} className="text-primary" />
                      <span>${service.price}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredServices.length === 0 && !loading && (
          <div className="text-center py-12" data-testid="no-services">
            <p className="text-muted-foreground">No services found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}