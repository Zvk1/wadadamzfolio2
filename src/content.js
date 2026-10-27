// Edit this file to personalize the portfolio. Empty URLs stay as clear placeholders.
window.PORTFOLIO = {
  name: 'Zaki Lorenzo V. Boongaling', availability: '',
  university: 'Technological Institute of The Philippines - Manila',
  photo: '/Zaki.png',
  photoLight: '/Zaki-black-shirt.png',
  links: { github: 'https://github.com/Zvk1', linkedin: 'https://www.linkedin.com/in/zak1-boongaling', email: 'zaki.bnglng@gmail.com', other: '' },
  projects: [
    {
      title: 'review.mnl', category: 'WEB APPLICATION', number: '01', visual: 'network',
      description: 'A centralized review-center platform that helps students discover programs, explore available centers, and find a clearer path to enrollment.',
      role: 'Full-stack development',
      learning: 'The project brought review-center information into one focused experience, balancing student discovery with the need to present each center clearly and consistently.',
      url: 'https://review-mnl-gamma.vercel.app',
      image: '/assets/projects/review-mnl/screenshot.png', imageAlt: 'review.mnl homepage with review center search and categories'
    },
    {
      title: 'The Event Lab', category: 'STUDENT EVENT PLATFORM', number: '02', visual: 'terminal',
      description: 'A student event platform for TIP that brings event information, scheduling, and coordination into one organized space.',
      role: 'Frontend and backend development',
      learning: 'The platform was shaped around making campus events easier to organize and easier for students to follow, from the initial event details through coordination.',
      url: 'https://theeventlabs.netlify.app',
      image: '/assets/projects/the-event-lab/screenshot.png', imageAlt: 'The Event Lab Our Story page describing its mission and student-first values'
    }
  ],
  ctfs: [
    {
      title: 'Cyber Apocalypse CTF 2026: The Salt Crown',
      organizer: 'Hack The Box', category: 'CTF', status: 'Participated',
      date: 'July 24, 2026', url: '',
      certificate: '/assets/certifications/cyber-apocalypse-2026/certificate.pdf',
      certificateImage: '/assets/certifications/cyber-apocalypse-2026/certificate.png'
    },
    {
      title: 'LearnPossible 2 CTF', organizer: 'Hexcore Labs PH',
      category: 'CTF', status: 'Participated', date: 'October 16, 2026', url: ''
    },
    {
      title: 'Kaspersky{CTF}', organizer: 'Kaspersky{CTF}',
      category: 'CTF', status: 'Participated', date: 'August 28, 2026', url: ''
    }
  ],
  certifications: [
    {
      title: 'CCNA: Enterprise Networking, Security, and Automation',
      issuer: 'Cisco', date: 'September 2026', status: 'Certification',
      url: '/assets/certifications/ccna-enterprise-networking-security-automation/certificate.pdf',
      linkLabel: 'View certificate'
    }
  ]
};
