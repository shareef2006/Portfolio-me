// Default Portfolio Data
// ข้อมูลตั้งต้นของ Portfolio สามารถแก้ไขผ่านหน้าเว็บได้ทันที และจะบันทึกใน LocalStorage
const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    name: "วรพล เจริญกิจพาณิชย์",
    nameEn: "Woraphon Charoenkit",
    title: "Full-Stack Developer & UI/UX Designer",
    statusBadge: "พร้อมรับงาน / Open to Opportunities",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    bio: "นักพัฒนาเว็บและผู้หลงใหลในเทคโนโลยี มีความมุ่งมั่นในการสร้างสรรค์ซอฟต์แวร์ที่ใช้งานง่าย สวยงาม และแก้ปัญหาได้จริง มีความเชี่ยวชาญทั้งการพัฒนา Front-end, Back-end และการออกแบบประสบการณ์ผู้ใช้ (UI/UX) พร้อมเรียนรู้เทคโนโลยีใหม่ๆ อยู่เสมอ",
    quote: "\"เปลี่ยนความคิดสร้างสรรค์ให้กลายเป็นผลงานที่ใช้งานได้จริง ด้วยโค้ดที่มีคุณภาพ\"",
    yearsExperience: "3+",
    completedProjects: "18+",
    skillsCount: "25+",
    happyClients: "100%",
    location: "กรุงเทพมหานคร, ประเทศไทย (Bangkok, Thailand)",
    email: "contact.woraphon@example.com",
    phone: "081-234-5678",
    lineId: "@woraphon.dev",
    lineQrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://line.me/ti/p/~woraphon.dev",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    resumeUrl: "#"
  },
  about: {
    greeting: "สวัสดีครับ! ผมชื่อ",
    introduction: "ผมเป็นนักพัฒนาเว็บไซต์และซอฟต์แวร์ที่มีประสบการณ์ในการสร้างสรรค์เว็บแอปพลิเคชันที่ทันสมัย รวดเร็ว และตอบโจทย์ผู้ใช้งาน สนใจในการผสมผสานระหว่างการเขียนโค้ดที่มีประสิทธิภาพและการออกแบบ UI ที่สวยงามสะดุดตา",
    details: [
      { label: "วันเกิด / อายุ", value: "15 มกราคม 2545 (24 ปี)" },
      { label: "ที่อยู่ปัจจุบัน", value: "จตุจักร, กรุงเทพมหานคร" },
      { label: "ระดับการศึกษา", value: "ปริญญาตรี วิทยาการคอมพิวเตอร์" },
      { label: "ภาษาที่สื่อสาร", value: "ไทย (เจ้าของภาษา), อังกฤษ (ระดับทำงาน)" },
      { label: "สถานะการทำงาน", value: "Freelance & Full-time (Open to Remote)" },
      { label: "งานอดิเรก", value: "เขียนบล็อกเทคโนโลยี, เล่นดนตรี, ถ่ายภาพ" }
    ],
    highlights: [
      {
        icon: "code",
        title: "Clean & Maintainable Code",
        description: "เขียนโค้ดที่เป็นระเบียบ อ่านง่าย ปฏิบัติตาม Best Practices และรองรับการขยายตัวในอนาคต"
      },
      {
        icon: "palette",
        title: "Modern UI/UX Design",
        description: "เข้าใจหลักการออกแบบที่เน้นผู้ใช้งานเป็นศูนย์กลาง (User-Centered Design) และความสวยงามระดับพรีเมียม"
      },
      {
        icon: "zap",
        title: "Fast Performance & SEO",
        description: "ปรับแต่งเว็บให้โหลดเร็ว รองรับมือถือทุกขนาด (Responsive) และถูกต้องตามหลักเกณฑ์ Search Engine"
      },
      {
        icon: "users",
        title: "Teamwork & Communication",
        description: "สื่อสารกระชับ เข้าใจง่าย สามารถทำงานร่วมกับทีม Product, Design และ Business ได้อย่างราบรื่น"
      }
    ]
  },
  education: [
    {
      id: "edu-1",
      period: "2563 - 2567",
      degree: "ปริญญาตรี วิทยาศาสตรบัณฑิต (วท.บ.)",
      major: "สาขาวิทยาการคอมพิวเตอร์ (Computer Science)",
      institution: "มหาวิทยาลัยเกษตรศาสตร์ (Kasetsart University)",
      gpa: "เกรดเฉลี่ย: 3.72 (เกียรตินิยมอันดับสอง)",
      description: "เน้นการศึกษาด้านโครงสร้างข้อมูล อัลกอริทึม การพัฒนาซอฟต์แวร์ และระบบฐานข้อมูล เป็นหัวหน้าทีมทำโครงงานจบการศึกษา (Senior Project) ระบบจัดการร้านค้าอัจฉริยะ"
    },
    {
      id: "edu-2",
      period: "2557 - 2563",
      degree: "มัธยมศึกษาตอนปลาย",
      major: "แผนการเรียน วิทย์-คณิต (Science-Mathematics)",
      institution: "โรงเรียนเตรียมอุดมศึกษา",
      gpa: "เกรดเฉลี่ย: 3.85",
      description: "ตัวแทนโรงเรียนแข่งขันการเขียนโปรแกรมคอมพิวเตอร์โอลิมปิกระดับชาติ (POSN) และประธานชมรมคอมพิวเตอร์"
    }
  ],
  skills: {
    technical: [
      { name: "HTML5 / CSS3 / Modern CSS", level: 95, category: "frontend" },
      { name: "JavaScript (ES6+) / TypeScript", level: 90, category: "frontend" },
      { name: "React.js / Next.js", level: 85, category: "frontend" },
      { name: "Node.js / Express.js", level: 80, category: "backend" },
      { name: "Python / FastAPI", level: 78, category: "backend" },
      { name: "PostgreSQL / MongoDB / MySQL", level: 82, category: "database" },
      { name: "RESTful API & GraphQL", level: 85, category: "backend" },
      { name: "Git / GitHub / CI/CD", level: 88, category: "tools" }
    ],
    tools: [
      { name: "Visual Studio Code", icon: "code" },
      { name: "Figma (UI/UX)", icon: "figma" },
      { name: "Docker", icon: "docker" },
      { name: "Postman", icon: "postman" },
      { name: "Vercel / Netlify", icon: "cloud" },
      { name: "Linux / Bash", icon: "terminal" },
      { name: "Tailwind CSS", icon: "palette" },
      { name: "Jest / Vitest", icon: "check-circle" }
    ],
    soft: [
      { name: "Problem Solving & Analytical Thinking", desc: "การคิดวิเคราะห์และแก้ปัญหาอย่างเป็นระบบ" },
      { name: "Effective Communication", desc: "การสื่อสารที่มีประสิทธิภาพทั้งในและนอกทีม" },
      { name: "Continuous Learning", desc: "เรียนรู้และปรับตัวเข้ากับเครื่องมือใหม่ๆ อย่างรวดเร็ว" },
      { name: "Time Management & Agile", desc: "การบริหารจัดการเวลาและการส่งมอบงานตามกำหนด" }
    ]
  },
  projects: [
    {
      id: "proj-1",
      title: "Smart Commerce - แพลตฟอร์มอีคอมเมิร์ซแบบครบวงจร",
      category: "web",
      categoryLabel: "Web Application",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
      description: "ระบบร้านค้าออนไลน์พร้อมระบบตะกร้าสินค้า ชำระเงินผ่าน PromptPay / บัตรเครดิต และ Dashboard จัดการสต็อกสินค้าแบบ Real-time",
      details: "พัฒนาด้วยสถาปัตยกรรม Microservices ออกแบบระบบรองรับผู้ใช้งานพร้อมกันจำนวนมาก มีระบบแจ้งเตือนคำสั่งซื้อผ่าน Line Notify และรายงานยอดขายรายวัน",
      tags: ["React", "Node.js", "MongoDB", "Stripe API", "TailwindCSS"],
      liveDemo: "https://example.com/demo1",
      github: "https://github.com/example/smart-commerce",
      featured: true
    },
    {
      id: "proj-2",
      title: "TaskFlow - ระบบจัดการงานและโปรเจกต์ทีมสไตล์ Kanban",
      category: "web",
      categoryLabel: "Web Application",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      description: "เว็บแอปพลิเคชันสำหรับบริหารงานในทีม รองรับ Drag & Drop การ์ดงาน มอบหมายงาน กำหนดเวลา และพูดคุยแสดงความคิดเห็น",
      details: "ใช้ WebSockets ในการอัปเดตสถานะของงานทันทีเมื่อเพื่อนร่วมทีมเลื่อนการ์ด พร้อมระบบส่งออกรายงานสรุปงานรายสัปดาห์ในรูปแบบ PDF",
      tags: ["TypeScript", "Next.js", "Socket.io", "PostgreSQL", "Prisma"],
      liveDemo: "https://example.com/demo2",
      github: "https://github.com/example/taskflow",
      featured: true
    },
    {
      id: "proj-3",
      title: "FinTrack - Mobile App วางแผนและบันทึกการเงินส่วนบุคคล",
      category: "mobile",
      categoryLabel: "Mobile App",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
      description: "แอปพลิเคชันบันทึกรายรับ-รายจ่าย วิเคราะห์พฤติกรรมการใช้เงินด้วยกราฟ พร้อมระบบเตือนสติการใช้จ่ายเกินงบประมาณ",
      details: "ออกแบบ UI/UX ให้ใช้งานง่าย บันทึกรายการได้ภายใน 3 วินาที มีระบบความปลอดภัยสแกนลายนิ้วมือ / FaceID และสำรองข้อมูลบน Cloud",
      tags: ["React Native", "Expo", "Firebase", "Chart.js"],
      liveDemo: "https://example.com/demo3",
      github: "https://github.com/example/fintrack-app",
      featured: false
    },
    {
      id: "proj-4",
      title: "HealthCare Plus - ออกแบบระบบนัดหมายแพทย์และ UI Design System",
      category: "design",
      categoryLabel: "UI/UX Design",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      description: "งานออกแบบ UI/UX ครบวงจรสำหรับระบบจองคิวตรวจแพทย์ทางไกล (Telemedicine) พร้อม Design System และ Component Library",
      details: "ผ่านการทำ User Research และ Usability Testing กับกลุ่มผู้ใช้งานจริงกว่า 30 ราย เพื่อลดขั้นตอนการทำนัดหมายเหลือเพียง 4 ขั้นตอน",
      tags: ["Figma", "Design System", "User Research", "Wireframing", "Prototyping"],
      liveDemo: "https://example.com/figma-demo",
      github: "",
      featured: false
    }
  ]
};
