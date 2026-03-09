import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Sparkles } from 'lucide-react';
import axios from 'axios';
import { API } from '../App';

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get(`${API}/staff`);
      setStaff(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-6" data-testid="staff-page">
      <div className="max-w-[90vw] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-6">Meet Our Team</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Our talented professionals are dedicated to bringing your beauty vision to life with expertise and care
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12" data-testid="loading-state">
            <p className="text-muted-foreground">Loading team members...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {staff.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass rounded-sm overflow-hidden card-lift group"
                data-testid={`staff-member-${index}`}
              >
                <div className="image-zoom h-80 overflow-hidden">
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary uppercase tracking-widest font-semibold mb-3">
                    {member.title}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{member.bio}</p>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                    <Award size={16} className="text-primary" />
                    <span>{member.years_experience} years experience</span>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">
                      Specialties
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center space-x-1 text-xs px-3 py-1 bg-secondary rounded-full text-secondary-foreground"
                        >
                          <Sparkles size={10} className="text-primary" />
                          <span>{specialty}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}