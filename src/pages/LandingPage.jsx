import React from 'react';
import Hero from '../components/Hero';
import OpportunityTypes from '../components/OpportunityTypes';
import WhyJoinUs from '../components/WhyJoinUs';
import AboutLeadership from '../components/AboutLeadership';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <OpportunityTypes />
      <WhyJoinUs />
      <AboutLeadership />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;