import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/home/Footer';
import SEO from '../components/SEO';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendar,
  faUser,
  faArrowRight,
  faDumbbell,
  faHeart,
  faRunning
} from '@fortawesome/free-solid-svg-icons';
import './FitnessBlogPage.css';

const FitnessBlogPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['All', 'Workouts', 'Nutrition', 'Motivation', 'Tips'];

  const blogPosts = [
    {
      id: 1,
      title: '10 Essential Exercises for Building Muscle',
      excerpt: 'Discover the most effective exercises that will help you build strength and muscle mass efficiently.',
      category: 'Workouts',
      author: 'John Trainer',
      date: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: faDumbbell
    },
    {
      id: 2,
      title: 'Nutrition Guide for Optimal Performance',
      excerpt: 'Learn about the best foods to fuel your workouts and recover faster for better results.',
      category: 'Nutrition',
      author: 'Sarah Nutritionist',
      date: '2024-01-12',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: faHeart
    },
    {
      id: 3,
      title: 'Staying Motivated: Your Journey to Success',
      excerpt: 'Tips and strategies to maintain motivation and consistency in your fitness journey.',
      category: 'Motivation',
      author: 'Mike Coach',
      date: '2024-01-10',
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: faRunning
    },
    {
      id: 4,
      title: 'Cardio vs Strength Training: What You Need to Know',
      excerpt: 'Understanding the differences and benefits of cardio and strength training for your goals.',
      category: 'Tips',
      author: 'John Trainer',
      date: '2024-01-08',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: faDumbbell
    },
    {
      id: 5,
      title: 'Pre and Post Workout Nutrition Essentials',
      excerpt: 'What to eat before and after your workouts to maximize performance and recovery.',
      category: 'Nutrition',
      author: 'Sarah Nutritionist',
      date: '2024-01-05',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: faHeart
    },
    {
      id: 6,
      title: 'Building a Home Workout Routine',
      excerpt: 'Create an effective workout routine you can do at home with minimal equipment.',
      category: 'Workouts',
      author: 'Mike Coach',
      date: '2024-01-03',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: faDumbbell
    }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="blog-page">
      <SEO 
        title="Fitness Blog - Fitness Alive Gym | Workout Tips & Health Articles"
        description="Read our fitness blog for workout tips, nutrition advice, motivation, and health articles. Stay updated with the latest fitness trends and expert advice from Fitness Alive Gym."
        keywords="fitness blog, workout tips, nutrition advice, fitness motivation, health articles, gym blog hyderabad"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="container">
          <h1 className="blog-hero-title">FITNESS BLOG</h1>
          <p className="blog-hero-subtitle">
            Expert tips, workouts, and insights to help you achieve your fitness goals
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="blog-categories">
        <div className="container">
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category.toLowerCase() ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.toLowerCase())}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="blog-posts-section">
        <div className="container">
          <div className="blog-grid">
            {filteredPosts.map((post) => (
              <article key={post.id} className="blog-card">
                <div className="blog-card-image">
                  <img src={post.image} alt={post.title} />
                  <div className="blog-card-category">
                    <FontAwesomeIcon icon={post.icon} />
                    <span>{post.category}</span>
                  </div>
                </div>
                <div className="blog-card-content">
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="blog-card-meta">
                    <span>
                      <FontAwesomeIcon icon={faUser} />
                      {post.author}
                    </span>
                    <span>
                      <FontAwesomeIcon icon={faCalendar} />
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <a href="#" className="read-more">
                    Read More
                    <FontAwesomeIcon icon={faArrowRight} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FitnessBlogPage;

