import { projects as projectsList, Project } from "./projects";

export interface ProjectItem {
  id: string;
  slug?: string;
  title: string;
  tags: string[];
  problem: string;
  role: string;
  result: string;
  liveUrl: string;
  githubUrl: string;
  image?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  bullets: string[];
  price: string;
  iconName: string;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
}

export interface InfoItem {
  icon: string;
  title: string;
  subtitle?: string;
  items?: string[];
}

export const SERVICES = [
  "Website Development",
  "Mobile Application Development",
  "Presentation Design",
  "Programming Tutoring & Mentoring",
  "Assignment Writer",
  "AI-to-Humanize",
  "Other"
] as const;

export type ServiceType = (typeof SERVICES)[number];

export const portfolioConfig = {
  name: "Altaf",
  fullName: "Altaf",
  badge: "Final Year Software Engineering Student | Pakistan",
  headline: {
    prefix: "I build modern web apps,\nmobile apps and help you ",
    highlight: "learn."
  },
  bio: "Final-year Software Engineering student and freelance developer, helping businesses, students, and researchers turn ideas into practical digital solutions. I also help researchers and students make AI-assisted writing more natural, clear, and human.",
  note: "Let's build something great.",
  
  contact: {
    email: "Altafnadir33@gmail.com",
    linkedin: "https://linkedin.com/in/altaf-se",
    github: "https://github.com/altaf-dev",
    location: "Pakistan"
  },

  academicInfo: [
    {
      type: "education",
      title: "BS Software Engineering",
      subtitle: "PMAS Arid Agriculture University (Final Year)"
    },
    {
      type: "internships",
      title: "Internships",
      items: [
        "Frontend Developer (DevelopersHub Corporation)",
        "Full Stack Developer (IT Software House)"
      ]
    },
    {
      type: "certifications",
      title: "Certifications",
      items: [
        "Frontend Development (Zynex Solutions)",
        "Cybersecurity (Zynex Solutions)",
        "More..."
      ]
    }
  ],

  // Editable stats badges (only real numbers)
  stats: [
    {
      id: "internships",
      value: 2,
      suffix: "",
      label: "Internships Completed",
      sublabel: "DevelopersHub Corporation & IT Software House"
    },
    {
      id: "projects",
      value: 3,
      suffix: "+",
      label: "Featured Projects",
      sublabel: "Full stack, AI integration, and modern UI"
    }
  ],

  services: [
    {
      id: "web-dev",
      title: "Website Development",
      tag: "For Businesses & Startups",
      description: "Modern, responsive web apps using React, Next.js, Node.js and databases. Perfect for businesses, portfolios, and startups.",
      bullets: [
        "Frontend + Backend",
        "Database & API Integration",
        "Fast, Responsive & SEO-Ready"
      ],
      price: "Starting from EUR 30",
      iconName: "Code2"
    },
    {
      id: "mobile-dev",
      title: "Mobile Application Development",
      tag: "iOS & Android",
      description: "Cross-platform mobile apps with React Native or Flutter. Great for MVPs, business tools, and custom mobile solutions.",
      bullets: [
        "iOS & Android Support",
        "Intuitive UI/UX Design",
        "API & Cloud Synchronization"
      ],
      price: "Starting from EUR 30",
      iconName: "Smartphone"
    },
    {
      id: "presentation-design",
      title: "Presentation Design",
      tag: "Professional & Academic",
      description: "Visually polished, engaging slide decks for business pitches, academic seminars, and technical project defenses.",
      bullets: [
        "Clean, Modern Visual Style",
        "Data & Diagram Visualization",
        "Structured & Persuasive Flow"
      ],
      price: "Starting from EUR 15",
      iconName: "Presentation"
    },
    {
      id: "tutoring",
      title: "Programming Tutoring & Mentoring",
      tag: "For Students & Learners",
      description: "One-to-one online sessions to understand concepts, debug code, and structure your own software projects.",
      bullets: [
        "Concept Explanation & Walkthrough",
        "Code Review & Debugging",
        "Project Structure Guidance"
      ],
      price: "Starting from EUR 10 / hour",
      iconName: "GraduationCap"
    },
    {
      id: "assignment-writer",
      title: "Assignment Writer",
      tag: "Academic & Research Support",
      description: "Academic writing and assignment assistance with clear structure, research support, formatting, and human-readable content.",
      bullets: [
        "Clear Structural Organization",
        "Proper Formatting & Citations",
        "Human-Readable Technical Content"
      ],
      price: "Starting from EUR 15",
      iconName: "FileEdit"
    },
    {
      id: "ai-humanize",
      title: "AI-to-Humanize",
      tag: "For Researchers & Students",
      description: "Make AI-assisted content sound more natural, readable, and human while preserving the original meaning.",
      bullets: [
        "Natural Tone & Cadence",
        "Preserves Core Technical Meaning",
        "Eliminates Robotic Phrasing"
      ],
      price: "Starting from EUR 15",
      iconName: "Sparkles"
    },
    {
      id: "other",
      title: "Other",
      tag: "Custom Solutions",
      description: "Custom scripts, technical troubleshooting, documentation review, or tailored software engineering work.",
      bullets: [
        "Custom Scripting & Automation",
        "API Integration & Debugging",
        "Tailored Technical Assistance"
      ],
      price: "Flexible Scope",
      iconName: "Layers"
    }
  ],

  projects: projectsList.map((p) => ({
    id: p.slug,
    slug: p.slug,
    title: p.title,
    tags: p.stack,
    problem: p.problem,
    role: p.role,
    result: p.result,
    liveUrl: p.liveUrl || "",
    githubUrl: p.githubUrl || ""
  })),

  translations: {
    en: {
      nav: {
        home: "Home",
        services: "Services",
        projects: "Projects",
        about: "About",
        process: "Process",
        testimonials: "Testimonials",
        faq: "FAQ",
        contact: "Contact"
      },
      hero: {
        badge: "Final Year Software Engineering Student | Pakistan",
        headlinePrefix: "I build modern web apps,\nmobile apps and help you ",
        headlineHighlight: "learn.",
        bio: "Final-year Software Engineering student and freelance developer, helping businesses, students, and researchers turn ideas into practical digital solutions. I also help researchers and students make AI-assisted writing more natural, clear, and human.",
        viewProjects: "View Projects",
        contactMe: "Contact Me",
        note: "Let's build something great."
      },
      about: {
        badge: "About Me",
        title: "Engineering Student & Freelance Developer",
        lead: "Final-year Software Engineering student and freelance developer, helping businesses, students, and researchers turn ideas into practical digital solutions. I also help researchers and students make AI-assisted writing more natural, clear, and human.",
        p1: "I specialize in modern web and mobile application development, focusing on clean architecture, responsiveness, and practical usability. Balancing rigorous final-year university coursework with client projects has given me hands-on experience delivering reliable software under real deadlines.",
        p2: "In addition to software engineering, I regularly assist students and researchers with coding problems, project structuring, and technical coursework. Recognizing how widespread AI assistance has become, I also provide an AI-to-Humanize service to help researchers and students refine AI-assisted writing into natural, authentic, and clear prose while preserving its original meaning.",
        highlightsTitle: "Quick Highlights",
        highlights: [
          "Final-year BS Software Engineering student",
          "Freelance developer building real-world web & mobile apps",
          "Programming tutor & academic project mentor",
          "AI-to-Humanize specialist for researchers & students"
        ]
      },
      servicesSection: {
        badge: "Services & Capabilities",
        title: "Available Digital Services",
        subtitle: "Practical, high-quality development, academic guidance, and AI-content refinement tailored to your needs.",
        inquireBtn: "Inquire About This Service"
      },
      projectsSection: {
        badge: "Featured Work",
        title: "Selected Engineering Projects",
        subtitle: "Real-world web apps, machine learning systems, and interactive tools built with clean architecture and modern stacks.",
        viewScreenshots: "View Screenshots",
        liveDemo: "Live Demo",
        github: "GitHub Code",
        problemLabel: "Problem",
        roleLabel: "Role",
        resultLabel: "Result",
        noImages: "No preview images available"
      },
      contact: {
        badge: "Get In Touch",
        title: "Let's talk about your next project",
        subtitle: "Write to me by email or use the form below and I will reply within 24 hours.",
        emailLabel: "Email Address",
        emailValue: "Altafnadir33@gmail.com",
        copyEmail: "Copy email",
        copied: "Copied!",
        availability: "Available for freelance projects & tutoring",
        responseTime: "Replies within 24 hours",
        form: {
          title: "Send an Inquiry",
          subtitle: "Fill out the form below and I'll respond within 24 hours.",
          nameLabel: "Full Name",
          namePlaceholder: "e.g. John Doe",
          emailLabel: "Email Address",
          emailPlaceholder: "e.g. john@example.com",
          serviceLabel: "Service",
          servicePlaceholder: "Select a service...",
          budgetLabel: "Budget (Optional)",
          budgetPlaceholder: "e.g. $100 - $300, €30, or Hourly",
          messageLabel: "Message",
          messagePlaceholder: "Describe your project requirements, questions, or learning goals (minimum 20 characters)...",
          messageMinHint: "Minimum 20 characters",
          submitButton: "Send Inquiry",
          submittingButton: "Sending...",
          successTitle: "Inquiry Sent Successfully!",
          successDesc: "Thank you for reaching out! I have received your message and will reply within 24 hours.",
          errorTitle: "Failed to Send Inquiry",
          errorDesc: "Something went wrong while sending your inquiry. Please try again or write directly to Altafnadir33@gmail.com.",
          errors: {
            nameRequired: "Full Name is required.",
            nameTooLong: "Name must not exceed 100 characters.",
            emailRequired: "Email is required.",
            emailInvalid: "Please enter a valid email address.",
            serviceRequired: "Please select a service.",
            messageRequired: "Message is required.",
            messageMinLength: "Message must contain at least 20 characters.",
            messageTooLong: "Message must not exceed 5,000 characters."
          }
        }
      },
      footer: {
        tagline: "Software Engineering student, Full Stack & Mobile Developer, and tutor building fast, scalable digital solutions.",
        rights: "All rights reserved.",
        quickLinks: "Quick Links"
      }
    },
    es: {
      nav: {
        home: "Inicio",
        services: "Servicios",
        projects: "Proyectos",
        about: "Sobre mí",
        process: "Proceso",
        testimonials: "Testimonios",
        faq: "Preguntas",
        contact: "Contacto"
      },
      hero: {
        badge: "Estudiante de Último Año de Ingeniería de Software | Pakistán",
        headlinePrefix: "Desarrollo apps web modernas,\napps móviles y te ayudo a ",
        headlineHighlight: "aprender.",
        bio: "Estudiante de último año de Ingeniería de Software y desarrollador freelance, ayudando a empresas, estudiantes e investigadores a transformar ideas en soluciones digitales prácticas. También ayudo a investigadores y estudiantes a humanizar la redacción asistida por IA para que suene más natural, clara y humana.",
        viewProjects: "Ver Proyectos",
        contactMe: "Contáctame",
        note: "Construyamos algo grandioso."
      },
      about: {
        badge: "Sobre Mí",
        title: "Estudiante de Ingeniería y Desarrollador Freelance",
        lead: "Estudiante de último año de Ingeniería de Software y desarrollador freelance, ayudando a empresas, estudiantes e investigadores a transformar ideas en soluciones digitales prácticas.",
        p1: "Me especializo en el desarrollo de aplicaciones web y móviles modernas, enfocándome en una arquitectura limpia, diseño adaptable y usabilidad real. Combinar los estudios universitarios de último año con proyectos reales para clientes me ha dado experiencia práctica entregando software confiable bajo plazos reales.",
        p2: "Además de la ingeniería de software, ayudo regularmente a estudiantes e investigadores con dudas de programación, estructura de proyectos y trabajos académicos técnicos. Al ser tan común el uso de herramientas de IA, también ofrezco el servicio AI-to-Humanize para refinar textos asistidos por IA, haciéndolos sonar naturales, auténticos y claros sin perder su rigor original.",
        highlightsTitle: "Puntos Destacados",
        highlights: [
          "Estudiante de último año de Ingeniería de Software",
          "Desarrollador freelance con proyectos web y móviles reales",
          "Tutor de programación y mentor de proyectos para estudiantes",
          "Especialista en humanizar contenido asistido por IA"
        ]
      },
      servicesSection: {
        badge: "Servicios y Capacidades",
        title: "Servicios Digitales Disponibles",
        subtitle: "Desarrollo práctico de alta calidad, mentoría académica y refinamiento de contenido IA adaptado a tus necesidades.",
        inquireBtn: "Consultar Este Servicio"
      },
      projectsSection: {
        badge: "Proyectos Destacados",
        title: "Proyectos de Ingeniería Seleccionados",
        subtitle: "Aplicaciones web reales, sistemas de machine learning y herramientas interactivas construidas con arquitecturas limpias y tecnologías modernas.",
        viewScreenshots: "Ver Capturas",
        liveDemo: "Ver Demo",
        github: "Código GitHub",
        problemLabel: "Problema",
        roleLabel: "Rol",
        resultLabel: "Resultado",
        noImages: "Sin imágenes de vista previa"
      },
      contact: {
        badge: "Contacto",
        title: "Hablemos de tu próximo proyecto",
        subtitle: "Escríbeme por correo electrónico o usa el formulario a continuación y responderé en menos de 24 horas.",
        emailLabel: "Correo Electrónico",
        emailValue: "Altafnadir33@gmail.com",
        copyEmail: "Copiar correo",
        copied: "¡Copiado!",
        availability: "Disponible para proyectos freelance y tutorías",
        responseTime: "Responde en menos de 24 horas",
        form: {
          title: "Enviar una Consulta",
          subtitle: "Completa el formulario y te responderé en un plazo de 24 horas.",
          nameLabel: "Nombre Completo",
          namePlaceholder: "ej. Carlos García",
          emailLabel: "Correo Electrónico",
          emailPlaceholder: "ej. carlos@ejemplo.com",
          serviceLabel: "Servicio",
          servicePlaceholder: "Selecciona un servicio...",
          budgetLabel: "Presupuesto (Opcional)",
          budgetPlaceholder: "ej. $100 - $300, 30 €, o por hora",
          messageLabel: "Mensaje",
          messagePlaceholder: "Describe los requerimientos de tu proyecto, dudas u objetivos (mínimo 20 caracteres)...",
          messageMinHint: "Mínimo 20 caracteres",
          submitButton: "Enviar Consulta",
          submittingButton: "Enviando...",
          successTitle: "¡Consulta Enviada con Éxito!",
          successDesc: "¡Gracias por contactarme! He recibido tu mensaje y te responderé en menos de 24 horas.",
          errorTitle: "Error al Enviar la Consulta",
          errorDesc: "Ocurrió un error al enviar tu consulta. Por favor, intenta de nuevo o escríbeme directamente a Altafnadir33@gmail.com.",
          errors: {
            nameRequired: "El nombre completo es obligatorio.",
            nameTooLong: "El nombre no puede exceder 100 caracteres.",
            emailRequired: "El correo electrónico es obligatorio.",
            emailInvalid: "Por favor ingresa un correo electrónico válido.",
            serviceRequired: "Por favor selecciona un servicio.",
            messageRequired: "El mensaje es obligatorio.",
            messageMinLength: "El mensaje debe contener al menos 20 caracteres.",
            messageTooLong: "El mensaje no puede exceder 5.000 caracteres."
          }
        }
      },
      footer: {
        tagline: "Estudiante de Ingeniería de Software, Desarrollador Full Stack & Móvil, y tutor creando soluciones digitales rápidas y escalables.",
        rights: "Todos los derechos reservados.",
        quickLinks: "Enlaces Rápidos"
      }
    }
  }
};
