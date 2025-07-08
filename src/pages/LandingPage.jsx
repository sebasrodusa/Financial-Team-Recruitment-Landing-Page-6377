import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import OpportunityTypes from '../components/OpportunityTypes';
import WhyJoinUs from '../components/WhyJoinUs';
import AboutLeadership from '../components/AboutLeadership';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
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