import React, { useState, useEffect } from 'react';
import './LMSHomepage.css';

const LMSHomepage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState('explore');
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Python Full Stack Developer',
      chapters: 7,
      students: 1229,
      image: '/api/placeholder/200/120',
      category: 'micro',
      tags: ['Python', 'Web Dev', 'Full Stack'],
      progress: 65
    },
    {
      id: 2,
      title: 'Jumpstart Your Journey in AI, ML & Data Science',
      chapters: 12,
      students: 764,
      image: '/api/placeholder/200/120',
      category: 'micro',
      tags: ['AI', 'Machine Learning', 'Data Science'],
      progress: 45
    },
    {
      id: 3,
      title: 'Speed, Development & Algorithms',
      chapters: 4,
      students: 528,
      image: '/api/placeholder/200/120',
      category: 'micro',
      tags: ['Algorithms', 'Performance', 'Coding'],
      progress: 80
    },
    {
      id: 4,
      title: 'Data Science & Business Analysis Mastery',
      chapters: 5,
      students: 355,
      image: '/api/placeholder/200/120',
      category: 'professional',
      tags: ['Data Science', 'Business', 'Analytics'],
      progress: 30
    },
    {
      id: 5,
      title: 'Advanced Financial Strategies',
      chapters: 6,
      students: 39,
      image: '/api/placeholder/200/120',
      category: 'professional',
      tags: ['Finance', 'Strategy', 'Investment'],
      progress: 55
    },
    {
      id: 6,
      title: 'Six Sigma Certification',
      chapters: 2,
      students: 142,
      image: '/api/placeholder/200/120',
      category: 'professional',
      tags: ['Six Sigma', 'Quality', 'Management'],
      progress: 90
    }
  ]);

  const [notifications, setNotifications] = useState(3);
  const [score, setScore] = useState(61);
  const [username, setUsername] = useState('MamidipalliJayaRam');
  const [institute, setInstitute] = useState('KKR & KSR Institute');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
      bar.style.width = `${bar.dataset.progress}%`;
    });

    const cards = document.querySelectorAll('.course-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('visible');
      }, 100 * index);
    });
  }, []);

  const handleSidebarClick = (tab, hasSubmenu = false) => {
    if (hasSubmenu) {
      setExpandedMenu(expandedMenu === tab ? null : tab);
    } else {
      setActiveTab(tab);
      setExpandedMenu(null);
      const contentArea = document.querySelector('.content-area');
      contentArea.classList.add('fade-transition');
      setTimeout(() => {
        contentArea.classList.remove('fade-transition');
      }, 500);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sidebarMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard-icon' },
    {
      // id: 'learn', label: 'Learn', icon: 'learn-icon', hasSubmenu: true,
      id: 'learn', label: 'LearningProgress:)', icon: 'learn-icon', hasSubmenu: true,

      submenu: [
        { id: 'explore', label: 'Explore' },
        { id: 'lesson-plan', label: 'Lesson Plan' },
        { id: 'micro-credentials', label: 'Micro Credentials' },
        { id: 'certifications', label: 'Certifications' }
      ]
    },
    { id: 'coding', label: 'Coding Track', icon: 'coding-icon' },
    {
      id: 'prepare', label: 'Prepare', icon: 'prepare-icon', hasSubmenu: true,
      submenu: [
        { id: 'mock-tests', label: 'Mock Tests' },
        { id: 'interviews', label: 'Interview Prep' },
        { id: 'resume', label: 'Resume Builder' }
      ]
    },
    {
      id: 'gest', label: 'GEST', icon: 'gest-icon', hasSubmenu: true,
      submenu: [
        { id: 'assessments', label: 'Assessments' },
        { id: 'results', label: 'Results' },
        { id: 'progress', label: 'Progress' }
      ]
    },
    { id: 'jobs', label: 'Job Posts', icon: 'jobs-icon' },
    {
      id: 'study', label: 'Study Abroad', icon: 'study-icon', hasSubmenu: true,
      submenu: [
        { id: 'countries', label: 'Countries' },
        { id: 'universities', label: 'Universities' },
        { id: 'applications', label: 'Applications' }
      ]
    },
    {
      id: 'college', label: 'My College', icon: 'college-icon', hasSubmenu: true,
      submenu: [
        { id: 'events', label: 'Events' },
        { id: 'clubs', label: 'Clubs' },
        { id: 'resources', label: 'Resources' }
      ]
    },
    { id: 'ticket', label: 'Raise a Ticket', icon: 'ticket-icon' }
  ];

  return (
    <div className="lms-container">
      <div className="sidebar">
        <div className="logo-container">
          <div className="logo">
            <span className="logo-circle"></span>
            <span className="logo-text">TaPTaP</span>
          </div>
          <div className="by-text">by Blackbucks</div>
        </div>

        <div className="sidebar-menu">
          {sidebarMenuItems.map((item, index) => (
            <div key={item.id}>
              <div 
                className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleSidebarClick(item.id, item.hasSubmenu)}
                style={{ '--animation-order': index }}
              >
                <i className={`icon ${item.icon}`}></i>
                <span>{item.label}</span>
                {item.hasSubmenu && (
                  <i className={`icon arrow-icon ${expandedMenu === item.id ? 'rotated' : ''}`}></i>
                )}
              </div>

              {item.hasSubmenu && expandedMenu === item.id && (
                <div className="submenu">
                  {item.submenu.map((subItem, subIndex) => (
                    <div 
                      key={subItem.id}
                      className={`submenu-item ${activeTab === subItem.id ? 'active-submenu' : ''}`}
                      onClick={() => handleSidebarClick(subItem.id)}
                      style={{ '--animation-order': subIndex }}
                    >
                      <span className="dot"></span>
                      <span>{subItem.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search courses, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="user-actions">
            <div className="happy-days-button">HAPPIEDAYS</div>
            
            <div className="score-badge">
              <div className="score">{score}%</div>
              <div className="score-text">PGEST Score</div>
              <div className="progress-bar">
                <div className="progress-fill" data-progress={score}></div>
              </div>
            </div>

            <div className="band-badge">
              <div className="band">C</div>
              <div className="band-text">PGEST Band</div>
            </div>

            <div className="action-icon code-icon" title="Coding Practice"></div>
            <div className="action-icon learn-progress-icon" title="Learning Progress"></div>

            <div className="notification-icon" title="Notifications">
              {notifications > 0 && <span className="notification-badge">{notifications}</span>}
            </div>

            <div className="user-profile">
              <div className="user-initials">MJ</div>
              <div className="user-info">
                <div className="user-name">{username}</div>
                <div className="user-institute">{institute}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-area">
          {filteredCourses.length === 0 ? (
            <div className="no-improvements-message">
              No courses found matching your search
            </div>
          ) : (
            <>
              <div className="section">
                <div className="section-header">
                  <h2>Micro Credentials</h2>
                  <a href="#" className="see-all">See All</a>
                </div>
                
                <div className="course-grid">
                  {filteredCourses.filter(course => course.category === 'micro').map(course => (
                    <div key={course.id} className="course-card">
                      <div className="course-content">
                        <h3>{course.title}</h3>
                        <div className="course-meta">
                          <div className="meta-item">
                            <i className="icon chapter-icon"></i>
                            <span>{course.chapters} Chapters</span>
                          </div>
                          <div className="meta-item">
                            <i className="icon students-icon"></i>
                            <span>{course.students}</span>
                          </div>
                        </div>
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              data-progress={course.progress}
                            ></div>
                          </div>
                          <span className="progress-text">{course.progress}%</span>
                        </div>
                        <button className="get-certified-btn">Continue Learning</button>
                      </div>
                      <div className="course-image">
                        <img src={course.image} alt={course.title} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section">
                <div className="section-header">
                  <h2>Professional Certifications</h2>
                  <a href="#" className="see-all">See All</a>
                </div>
                
                <div className="course-grid">
                  {filteredCourses.filter(course => course.category === 'professional').map(course => (
                    <div key={course.id} className="course-card">
                      <div className="course-content">
                        <h3>{course.title}</h3>
                        <div className="course-meta">
                          <div className="meta-item">
                            <i className="icon chapter-icon"></i>
                            <span>{course.chapters} Chapters</span>
                          </div>
                          <div className="meta-item">
                            <i className="icon students-icon"></i>
                            <span>{course.students}</span>
                          </div>
                        </div>
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              data-progress={course.progress}
                            ></div>
                          </div>
                          <span className="progress-text">{course.progress}%</span>
                        </div>
                        <div className="course-tags">
                          {course.tags.map((tag, index) => (
                            <span key={index} className="course-tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="course-image">
                        <img src={course.image} alt={course.title} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="chat-button" title="Chat Support">
        <i className="chat-icon"></i>
      </div>
    </div>
  );
};

export default LMSHomepage