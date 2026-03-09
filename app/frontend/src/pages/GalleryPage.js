import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import axios from 'axios';
import { API } from '../app';

export default function GalleryPage() {
  const [transformations, setTransformations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransformations();
  }, []);

  const fetchTransformations = async () => {
    try {
      const response = await axios.get(`${API}/transformations`);
      setTransformations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transformations:', error);
      setLoading(false);
    }
  };

  const portfolioImages = [
    {
      url: 'https://images.unsplash.com/photo-1599387737838-660b75526801?crop=entropy&cs=srgb&fm=jpg&q=85',
      title: 'Precision Cut',
    },
    {
      url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?crop=entropy&cs=srgb&fm=jpg&q=85',
      title: 'Color Artistry',
    },
    {
      url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?crop=entropy&cs=srgb&fm=jpg&q=85',
      title: 'Bridal Beauty',
    },
    {
      url: 'https://images.unsplash.com/photo-1720086196723-a1e0656a90a5?crop=entropy&cs=srgb&fm=jpg&q=85',
      title: 'Nail Perfection',
    },
    {
      url: 'https://images.unsplash.com/photo-1722350766824-f8520e9676ac?crop=entropy&cs=srgb&fm=jpg&q=85',
      title: 'Spa Serenity',
    },
    {
      url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?crop=entropy&cs=srgb&fm=jpg&q=85',
      title: 'Hair Transformation',
    },
  ];

  return (
    <div className="min-h-screen py-24 px-6" data-testid="gallery-page">
      <div className="max-w-[90vw] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-6">Our Gallery</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Witness the artistry and transformation. Each client tells a unique story of beauty and confidence.
          </p>
        </motion.div>

        {/* Before & After Transformations */}
        {transformations.length > 0 && (
          <section className="mb-24" data-testid="transformations-section">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Before & After</h2>
              <p className="text-muted-foreground">Drag the slider to see the transformation</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {transformations.map((transformation, index) => (
                <motion.div
                  key={transformation.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass rounded-sm overflow-hidden"
                  data-testid={`transformation-${index}`}
                >
                  <div className="h-96">
                    <ReactCompareSlider
                      itemOne={
                        <ReactCompareSliderImage
                          src={transformation.before_image}
                          alt="Before"
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                      }
                      itemTwo={
                        <ReactCompareSliderImage
                          src={transformation.after_image}
                          alt="After"
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                      }
                      style={{ height: '100%' }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-semibold mb-2">{transformation.title}</h3>
                    <p className="text-muted-foreground text-sm">{transformation.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Portfolio Masonry Grid */}
        <section data-testid="portfolio-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Our Work</h2>
            <p className="text-muted-foreground">A glimpse into our beauty artistry</p>
          </motion.div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {portfolioImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="break-inside-avoid image-zoom rounded-sm overflow-hidden group"
                data-testid={`portfolio-image-${index}`}
              >
                <div className="relative">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full rounded-sm"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <h3 className="text-white font-serif text-xl font-semibold">{image.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {loading && (
          <div className="text-center py-12" data-testid="loading-state">
            <p className="text-muted-foreground">Loading gallery...</p>
          </div>
        )}
      </div>
    </div>
  );
}