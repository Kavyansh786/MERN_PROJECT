import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gem, Heart, Shield, Award, Image as ImageIcon } from "lucide-react";
import Footer from '../components/Footer';

const AboutPage = () => {
  const navigate = useNavigate();

  const handleExploreCollection = () => {
    navigate('/shop');
  };

  const handleBrowseCollection = () => {
    navigate('/shop');
  };

  return (
    <div className="min-h-screen bg-[#FEFCF8]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-[#FDF6E3]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Crafting
                  <span className="text-[#B8860B] block">Timeless Beauty</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                  Launched in 2025 with a bold vision to redefine modern luxury jewelry. We combine contemporary design
                  with traditional craftsmanship to create pieces that celebrate today's confident, sophisticated woman.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleExploreCollection}
                  className="bg-[#B8860B] hover:bg-[#9A7209] text-white px-8 py-3 text-lg cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                >
                  Explore Collection
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-full h-full bg-[#B8860B] bg-opacity-20 rounded-3xl transform rotate-3"></div>
              <video 
                className="relative w-full h-[450px] object-cover rounded-3xl shadow-2xl"
                controls
                autoPlay
                muted
                loop
              >
                <source src="/gettyimages-2156378656-640_adpp.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">A Fresh Perspective on Luxury</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Founded in 2025 by Anand Malhotra and Ansh Vaid, our brand was born from a desire to create
              jewelry that speaks to the modern woman - pieces that are both timeless and refreshingly contemporary.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mt-16">
            <div className="space-y-6 text-left">
              <h3 className="text-2xl font-bold text-gray-900">Born from Bold Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                Our journey began with a simple belief: that luxury jewelry should be accessible, ethical, and
                designed for the way women live today. We launched with a commitment to transparency, sustainability,
                and creating pieces that empower and inspire.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Though we're new to the scene, our team brings together decades of combined experience from renowned
                jewelry houses, united by a shared passion for innovation and excellence.
              </p>
            </div>
            <div className="relative h-96">
              <video 
                className="w-full h-full object-cover rounded-3xl shadow-lg"
                controls
                autoPlay
                muted
                loop
              >
                <source src="/3694177265-preview.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-12 pt-16 text-center">
            <div>
              <div className="text-4xl font-bold text-[#B8860B]">2025</div>
              <div className="text-sm text-gray-500 mt-1">Year Founded</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#B8860B]">200+</div>
              <div className="text-sm text-gray-500 mt-1">Pieces Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#B8860B]">100%</div>
              <div className="text-sm text-gray-500 mt-1">Ethically Sourced</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-[#FAF7F0]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every piece we create is guided by our fundamental principles of excellence, integrity, and innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-20 h-20 bg-[#F5E6A8] rounded-full flex items-center justify-center mx-auto">
                  <Gem className="w-10 h-10 text-[#B8860B]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Exceptional Craftsmanship</h3>
                <p className="text-gray-600 leading-relaxed">
                  Each piece is meticulously handcrafted by our skilled artisans, ensuring unparalleled quality and
                  attention to detail in every creation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-20 h-20 bg-[#F5E6A8] rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-10 h-10 text-[#B8860B]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Ethical Sourcing</h3>
                <p className="text-gray-600 leading-relaxed">
                  We are committed to responsible sourcing of all materials, ensuring our gemstones and metals are
                  ethically obtained and conflict-free.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-20 h-20 bg-[#F5E6A8] rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-10 h-10 text-[#B8860B]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Personal Connection</h3>
                <p className="text-gray-600 leading-relaxed">
                  We believe jewelry should tell your unique story. Our personalized service ensures each piece
                  perfectly captures your individual style and sentiment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#B8860B]">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white">Begin Your Journey</h2>
            <p className="text-xl text-amber-100 leading-relaxed">
              Join us at the beginning of our journey. Discover contemporary pieces designed for the modern woman who
              values both style and substance. Be part of our story from the very start.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleBrowseCollection}
                className="bg-white text-[#B8860B] hover:bg-[#FDF6E3] px-8 py-3 text-lg font-medium cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              >
                Browse Collection
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AboutPage;
