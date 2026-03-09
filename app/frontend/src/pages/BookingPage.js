import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Calendar as CalendarIcon, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { API } from '../app';
import { toast } from 'sonner';

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    service_id: '',
    staff_id: '',
    date: '',
    time: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      const [servicesRes, staffRes] = await Promise.all([
        axios.get(`${API}/services`),
        axios.get(`${API}/staff`),
      ]);
      setServices(servicesRes.data);
      setStaff(staffRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load booking data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const steps = [
    { number: 1, title: 'Select Service', icon: '💆' },
    { number: 2, title: 'Choose Stylist', icon: '✨' },
    { number: 3, title: 'Pick Date & Time', icon: '📅' },
    { number: 4, title: 'Your Details', icon: '👤' },
  ];

  const selectedService = services.find(s => s.id === formData.service_id);
  const selectedStaff = staff.find(s => s.id === formData.staff_id);

  const handleNext = () => {
    if (currentStep === 1 && !formData.service_id) {
      toast.error('Please select a service');
      return;
    }
    if (currentStep === 2 && !formData.staff_id) {
      toast.error('Please choose a stylist');
      return;
    }
    if (currentStep === 3 && (!formData.date || !formData.time)) {
      toast.error('Please select date and time');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.client_name || !formData.client_email || !formData.client_phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API}/bookings`, formData);
      toast.success('Booking confirmed! We look forward to seeing you.');
      
      // Reset form
      setFormData({
        service_id: '',
        staff_id: '',
        date: '',
        time: '',
        client_name: '',
        client_email: '',
        client_phone: '',
        notes: '',
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM',
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-state">
        <p className="text-muted-foreground">Loading booking form...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-6 relative overflow-hidden" data-testid="booking-page">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1726896512442-09e073b678a6?crop=entropy&cs=srgb&fm=jpg&q=85"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-6">Book Your Experience</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Reserve your spot for a transformative beauty experience
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12" data-testid="booking-steps">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all ${
                    currentStep >= step.number
                      ? 'bg-primary text-white shadow-soft'
                      : 'glass text-muted-foreground'
                  }`}
                  data-testid={`step-indicator-${step.number}`}
                >
                  {currentStep > step.number ? <Check size={20} /> : step.number}
                </div>
                <p className="text-xs mt-2 font-medium hidden md:block">{step.title}</p>
              </motion.div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 md:w-24 h-0.5 mx-2 transition-all ${
                    currentStep > step.number ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Wizard Content */}
        <div className="glass-heavy rounded-sm p-8 md:p-12">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Service */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                data-testid="step-select-service"
              >
                <h2 className="text-2xl font-serif font-semibold mb-6">Select Your Service</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <motion.div
                      key={service.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, service_id: service.id })}
                      data-testid={`service-option-${service.id}`}
                      className={`p-6 rounded-sm cursor-pointer transition-all ${
                        formData.service_id === service.id
                          ? 'bg-primary/10 border-2 border-primary'
                          : 'bg-white/40 border border-border hover:border-primary/50'
                      }`}
                    >
                      <h3 className="font-semibold mb-2">{service.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary font-semibold">${service.price}</span>
                        <span className="text-muted-foreground">{service.duration} min</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Choose Stylist */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                data-testid="step-choose-stylist"
              >
                <h2 className="text-2xl font-serif font-semibold mb-6">Choose Your Stylist</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staff.map((member) => (
                    <motion.div
                      key={member.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, staff_id: member.id })}
                      data-testid={`staff-option-${member.id}`}
                      className={`p-6 rounded-sm cursor-pointer transition-all ${
                        formData.staff_id === member.id
                          ? 'bg-primary/10 border-2 border-primary'
                          : 'bg-white/40 border border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-16 h-16 rounded-sm object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{member.name}</h3>
                          <p className="text-xs text-primary uppercase tracking-widest mb-2">
                            {member.title}
                          </p>
                          <p className="text-sm text-muted-foreground">{member.years_experience} years exp.</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Pick Date & Time */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                data-testid="step-date-time"
              >
                <h2 className="text-2xl font-serif font-semibold mb-6">Pick Date & Time</h2>
                
                <div className="mb-8">
                  <label className="block text-sm font-semibold mb-3 flex items-center space-x-2">
                    <CalendarIcon size={16} className="text-primary" />
                    <span>Select Date</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    data-testid="date-input"
                    className="w-full px-4 py-3 rounded-sm border border-border bg-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 flex items-center space-x-2">
                    <Clock size={16} className="text-primary" />
                    <span>Select Time</span>
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                      <motion.button
                        key={time}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFormData({ ...formData, time })}
                        data-testid={`time-slot-${time.replace(/\s/g, '-')}`}
                        className={`py-3 rounded-sm text-sm font-medium transition-all ${
                          formData.time === time
                            ? 'bg-primary text-white shadow-soft'
                            : 'bg-white/40 border border-border hover:border-primary/50'
                        }`}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Your Details */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                data-testid="step-details"
              >
                <h2 className="text-2xl font-serif font-semibold mb-6">Your Details</h2>
                
                {/* Booking Summary */}
                <div className="bg-secondary/50 rounded-sm p-6 mb-8">
                  <h3 className="font-semibold mb-4">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    {selectedService && (
                      <p><span className="text-muted-foreground">Service:</span> <span className="font-medium">{selectedService.name}</span></p>
                    )}
                    {selectedStaff && (
                      <p><span className="text-muted-foreground">Stylist:</span> <span className="font-medium">{selectedStaff.name}</span></p>
                    )}
                    {formData.date && (
                      <p><span className="text-muted-foreground">Date:</span> <span className="font-medium">{new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                    )}
                    {formData.time && (
                      <p><span className="text-muted-foreground">Time:</span> <span className="font-medium">{formData.time}</span></p>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 flex items-center space-x-2">
                      <User size={16} className="text-primary" />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      data-testid="client-name-input"
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-sm border border-border bg-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 flex items-center space-x-2">
                      <Mail size={16} className="text-primary" />
                      <span>Email Address *</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.client_email}
                      onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                      data-testid="client-email-input"
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 rounded-sm border border-border bg-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 flex items-center space-x-2">
                      <Phone size={16} className="text-primary" />
                      <span>Phone Number *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.client_phone}
                      onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                      data-testid="client-phone-input"
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 rounded-sm border border-border bg-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 flex items-center space-x-2">
                      <MessageSquare size={16} className="text-primary" />
                      <span>Special Requests (Optional)</span>
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      data-testid="notes-input"
                      placeholder="Any special requests or notes..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-sm border border-border bg-white/60 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              disabled={currentStep === 1}
              data-testid="back-button"
              className={`inline-flex items-center space-x-2 px-6 py-3 rounded-sm text-sm font-medium transition-all ${
                currentStep === 1
                  ? 'opacity-50 cursor-not-allowed text-muted-foreground'
                  : 'text-foreground hover:bg-primary/10'
              }`}
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </motion.button>

            {currentStep < 4 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                data-testid="next-button"
                className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-sm text-sm font-semibold shadow-soft"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={submitting}
                data-testid="confirm-button"
                className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-sm text-sm font-semibold shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{submitting ? 'Confirming...' : 'Confirm Booking'}</span>
                <Check size={16} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
