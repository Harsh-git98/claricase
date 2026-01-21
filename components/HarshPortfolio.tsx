import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValue } from 'framer-motion';

const HarshPortfolio = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Parallax effects
  const y1 = useTransform(smoothProgress, [0, 1], [0, -200]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, -400]);
  const opacityHero = useTransform(smoothProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#02040f] text-white selection:bg-purple-500/30 overflow-x-hidden font-sans">
      
      {/* --- Ambient Background System --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Grain Overlay for Texture */}
        <div className="absolute inset-0 opacity-[0.03] z-50 mix-blend-overlay" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />
        
        {/* Fluid Gradients */}
        <motion.div style={{ y: y1 }} className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
        <motion.div style={{ y: y2 }} className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-4000" />
      </div>

      {/* --- Floating Navigation --- */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl">
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-purple-500/10"
        >
          <span className="font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Harsh Ranjan
          </span>
          <div className="flex gap-6 text-sm font-medium text-gray-300">
           <SocialLink href="https://github.com/yourusername" icon={Icons.github} label="GitHub" />
            <SocialLink href="https://linkedin.com/in/yourusername" icon={Icons.linkedin} label="LinkedIn" />
              
           </div>
        </motion.div>
      </nav>

      <main className="relative z-10 px-6">
        
        {/* --- Hero Section --- */}
        <section className="min-h-screen flex flex-col items-center justify-center pt-20">
          <motion.div 
            style={{ opacity: opacityHero }}
            className="text-center max-w-4xl mx-auto space-y-8"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium uppercase tracking-wider"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Available for new projects
            </motion.div>
           

            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-8xl font-bold tracking-tight"
            >
               <img src="untitled56.jpg" alt="Logo" className="w-48 h-48 rounded-full inline-flex items-center gap-2 px-3 py-1" />
            <br />
             Building digital <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                products that matter.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              I'm <span className="text-white font-semibold">Harsh Ranjan</span>, a product-minded engineer bridging the gap between complex systems and intuitive user experiences.
            </motion.p>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {/* <div className="flex justify-center gap-6 mb-8 flex-wrap">
              <SocialLink href="https://github.com/yourusername" icon={Icons.github} label="GitHub" />
              <SocialLink href="https://twitter.com/yourusername" icon={Icons.twitter} label="X (Twitter)" />
              <SocialLink href="https://linkedin.com/in/yourusername" icon={Icons.linkedin} label="LinkedIn" />
              <SocialLink href="https://producthunt.com/@yourusername" icon={Icons.producthunt} label="Product Hunt" />
              <SocialLink href="https://reddit.com/user/yourusername" icon={Icons.reddit} label="Reddit" />
              <SocialLink href="https://instagram.com/yourusername" icon={Icons.instagram} label="Instagram" />
            </div> */}
             
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            style={{ opacity: opacityHero }}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500"
          >
            <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 bg-gray-400 rounded-full" />
            </div>
          </motion.div>
        </section>

        {/* --- Featured Projects (Spotlight Effect) --- */}
        <section id="projects" className="py-32 max-w-6xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl font-bold mb-4">Selected Work</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
             <SpotlightCard>
                <div className="h-full flex flex-col">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/30">
                      📱
                    </div>
                    <span className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">LIVE ON APP STORE</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">RePromptt.com</h3>
                  <p className="text-gray-400 mb-6 flex-grow">
                    A clarity-first AI assistant designed for non-technical users. It abstracts complex prompt engineering into simple, structured interactions.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <TechBadge>React Native</TechBadge>
                    <TechBadge>OpenAI</TechBadge>
                    <TechBadge>RevenueCat</TechBadge>
                  </div>
                </div>
             </SpotlightCard>

             <SpotlightCard>
                <div className="h-full flex flex-col">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/30">
                      ⚖️
                    </div>
                    <span className="text-xs font-mono text-blue-300 bg-blue-400/10 px-2 py-1 rounded">WEB PLATFORM</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Claricase.xyz</h3>
                  <p className="text-gray-400 mb-6 flex-grow">
                    Legal tech platform using AI to simplify complex case documents into readable summaries while preserving neutrality.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <TechBadge>Full-stack</TechBadge>
                    <TechBadge>Tailwind</TechBadge>
                    <TechBadge>NLP</TechBadge>
                  </div>
                </div>
             </SpotlightCard>

             <SpotlightCard>
                <div className="h-full flex flex-col">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center border border-pink-500/30">
                      ✨
                    </div>
                    <span className="text-xs font-mono text-purple-300 bg-purple-400/10 px-2 py-1 rounded">Co-founder</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Poppio.io</h3>
                  <p className="text-gray-400 mb-6 flex-grow">
                      search any event around you using natural language. Just type "Tech meetups in SF this weekend" and get instant results.                   
                      </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <TechBadge>MERN</TechBadge>
                    <TechBadge>Web Scraping</TechBadge>
                  </div>
                </div>
             </SpotlightCard>

             <SpotlightCard>
                <div className="h-full flex flex-col">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/30">
                      💸
                    </div>
                    <span className="text-xs font-mono text-yellow-300 bg-yellow-400/10 px-2 py-1 rounded">MVP</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Splitkaro</h3>
                  <p className="text-gray-400 mb-6 flex-grow">
                    Natural language expense splitting. Just type "Dinner with Mike 50 bucks" and the AI handles the math.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <TechBadge>GenAI</TechBadge>
                    <TechBadge>Mobile</TechBadge>
                  </div>
                </div>
             </SpotlightCard>
          </div>
        </section>

        {/* --- Tech Arsenal (Skills) --- */}
        <section id="skills" className="py-32 relative overflow-hidden">
          
          {/* Background Gradient for this section */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6 mb-12">
            <h2 className="text-4xl font-bold mb-4">Technical Arsenal</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
            <p className="text-gray-400 max-w-xl pt-4">
              I don't just use tools; I choose the right stack for the job. Here is the technology I use to build scalable products.
            </p>
          </div>

          {/* Infinite Marquees - Moving Text Effect */}
          <div className="flex flex-col gap-4 mb-20 opacity-80 mask-linear-fade">
            <InfiniteLoop direction="left" speed={50}>
              <span className="text-5xl font-bold text-white/5 mx-8">JAVASCRIPT</span>
              <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mx-8">REACT NATIVE</span>
              <span className="text-5xl font-bold text-white/5 mx-8">PYTHON</span>
              <span className="text-5xl font-bold text-white/5 mx-8">NODE.JS</span>
              <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 mx-8">TYPESCRIPT</span>
              <span className="text-5xl font-bold text-white/5 mx-8">SQL</span>
            </InfiniteLoop>
            <InfiniteLoop direction="right" speed={50}>
              <span className="text-5xl font-bold text-white/5 mx-8">SYSTEM DESIGN</span>
              <span className="text-5xl font-bold text-white/5 mx-8">DOCKER</span>
              <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mx-8">OPENAI API</span>
              <span className="text-5xl font-bold text-white/5 mx-8">MONGODB</span>
              <span className="text-5xl font-bold text-white/5 mx-8">STRIPE</span>
            </InfiniteLoop>
          </div>

          {/* Categorized Skills Grid */}
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Languages */}
            <SkillCard title="Languages" icon="💻" color="blue">
              {['C++', 'C', 'JavaScript', 'TypeScript', 'Python', 'SQL', 'Shell Scripting', 'HTML5', 'CSS3'].map((skill) => (
                <SkillPill key={skill}>{skill}</SkillPill>
              ))}
            </SkillCard>

            {/* Frameworks */}
            <SkillCard title="Frameworks & Libs" icon="⚛️" color="purple">
              {['React.js', 'React Native', 'Node.js', 'Express.js', 'Tailwind CSS', 'MongoDB', 'REST APIs'].map((skill) => (
                <SkillPill key={skill}>{skill}</SkillPill>
              ))}
            </SkillCard>

            {/* Tools */}
            <SkillCard title="Tools & Tech" icon="🛠️" color="cyan">
              {['Git', 'Docker', 'Google Colab', 'Render', 'Stripe API', 'RevenueCat', 'OpenAI API', 'Generative AI'].map((skill) => (
                <SkillPill key={skill}>{skill}</SkillPill>
              ))}
            </SkillCard>

            {/* Core Competencies (Spanning 2 columns on large screens) */}
           
          </div>
        </section>

        {/* --- Process Section (Bento Grid Style) --- */}
        <section id="process" className="py-32 max-w-6xl mx-auto">
          <div className="mb-20 md:text-center">
            <h2 className="text-4xl font-bold mb-4">How I Build</h2>
              <p className="text-gray-400">From vague idea to production-ready scalable product.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:bg-white/[0.05] transition-colors">
              <span className="text-4xl font-bold bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent opacity-30">01</span>
              <h3 className="text-2xl font-semibold mt-2 mb-4 text-purple-200">Clarity First</h3>
              <p className="text-gray-400 leading-relaxed">
                Most products fail because they solve the wrong problem. I spend significant time refining the mental model and UX flow before writing a single line of code.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-900/20 to-purple-900/20 border border-white/10 backdrop-blur-sm">
               <span className="text-4xl font-bold bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent opacity-30">02</span>
               <h3 className="text-xl font-semibold mt-2 mb-4 text-blue-200">User Centric</h3>
               <p className="text-gray-400 text-sm">
                 Accessibility and onboarding are not afterthoughts. I design for trust.
               </p>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-b from-purple-900/20 to-pink-900/20 border border-white/10 backdrop-blur-sm">
               <span className="text-4xl font-bold bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent opacity-30">03</span>
               <h3 className="text-xl font-semibold mt-2 mb-4 text-pink-200">End-to-End</h3>
               <p className="text-gray-400 text-sm">
                 Frontend, Backend, AI, Payments. I own the stack to ensure speed.
               </p>
            </div>

            <div className="md:col-span-2 p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:bg-white/[0.05] transition-colors">
              <span className="text-4xl font-bold bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent opacity-30">04</span>
              <h3 className="text-2xl font-semibold mt-2 mb-4 text-purple-200">Ship & Iterate</h3>
              <p className="text-gray-400 leading-relaxed">
                Real users beat perfect code. I ship MVPs fast, gather feedback, and iterate based on actual usage data rather than assumptions.
              </p>
            </div>
          </div>
        </section>

        {/* --- Footer / Contact --- */}
       {/* --- Footer / Contact --- */}
        <section id="contact" className="py-32 max-w-4xl mx-auto text-center px-4">
          
          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-8 md:p-12 rounded-[3rem] overflow-hidden border border-white/10 bg-white/[0.02]"
          >
            {/* Gradient Background for Card */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/20 to-black/50 backdrop-blur-xl -z-10" />
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">
              Ready to ship?
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-lg mx-auto">
              I'm always open to discussing new ideas, co-founder opportunities, or just nerding out about AI.
            </p>
            
            <a href="mailto:shriharshranjangupta@gmail.com" className="inline-block relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
              <button className="relative px-8 py-4 bg-black rounded-full border border-white/10 text-white font-semibold flex items-center gap-2 group-hover:scale-[1.02] transition-transform">
                <span>shriharshranjangupta@gmail.com</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </a>
          </motion.div>

          {/* Social Dock */}
          <footer className="mt-24">
           

            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-sm text-gray-500">
              <p>© 2026 ClariCase. All rights reserved.</p>
              <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
           
              
               </div>
          </footer>
        </section>

      </main>

      {/* --- Styles for Animations --- */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .mask-linear-fade {
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-gradient {
          animation: gradient 8s linear infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

// --- Sub-components ---

const TechBadge = ({ children }) => (
  <span className="px-3 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/10 text-gray-300">
    {children}
  </span>
);
// Infinite Loop Component for the Marquee
const InfiniteLoop = ({ children, direction = "left", speed = 25 }) => {
  return (
    <div className="relative flex overflow-hidden w-full mask-gradient">
      <motion.div
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
        className="flex flex-nowrap whitespace-nowrap"
      >
        {children}
        {children} {/* Duplicate for seamless loop */}
      </motion.div>
    </div>
  );
};

// Simple Card for Skills
const SkillCard = ({ title, icon, children, color = "purple" }) => (
  <div className={`p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-${color}-500/30 transition-colors`}>
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
    </div>
    <div className="flex flex-wrap gap-2">
      {children}
    </div>
  </div>
);

// Individual Skill Badge
const SkillPill = ({ children, glow = false }) => (
  <span className={`
    px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 cursor-default
    ${glow 
      ? "bg-purple-500/20 text-purple-200 border border-purple-500/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]" 
      : "bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10 hover:text-white hover:border-white/20"}
  `}>
    {children}
  </span>
);
// High-end card with mouse-following spotlight effect
const SpotlightCard = ({ children }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] px-8 py-10"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(120, 119, 198, 0.1), transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};

// Simple SVG icon set used by the footer social links
const Icons: { [key: string]: React.ReactNode } = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.54-3.88-1.54-.53-1.36-1.3-1.72-1.3-1.72-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.02 11.02 0 0 1 2.9-.39c.99 0 1.99.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.71 5.4-5.29 5.69.42.36.8 1.08.8 2.18 0 1.58-.01 2.86-.01 3.25 0 .3.21.67.8.55C20.71 21.42 24 17.1 24 12 24 5.65 18.35.5 12 .5z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M22 5.92c-.66.29-1.36.48-2.09.57.75-.45 1.33-1.16 1.6-2.01-.71.42-1.5.73-2.34.9A3.64 3.64 0 0 0 12.2 8.5c0 .29.03.58.1.85-3.02-.15-5.7-1.6-7.5-3.8-.31.54-.48 1.16-.48 1.83 0 1.26.64 2.38 1.62 3.03-.6-.02-1.16-.18-1.65-.45v.05c0 1.77 1.26 3.24 2.93 3.57-.31.09-.64.14-.98.14-.24 0-.48-.02-.71-.07.48 1.5 1.87 2.6 3.52 2.63A7.3 7.3 0 0 1 3 19.54a10.27 10.27 0 0 0 5.56 1.63c6.67 0 10.32-5.52 10.32-10.32v-.47C21.4 7.34 21.75 6.67 22 5.92z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.98h5V24H0V8.98zM8.5 8.98h4.78v2.04h.07c.67-1.27 2.3-2.6 4.74-2.6 5.06 0 6 3.33 6 7.66V24h-5V16.1c0-1.9-.04-4.34-2.64-4.34-2.64 0-3.04 2.06-3.04 4.2V24h-5V8.98z" />
    </svg>
  ),
  producthunt: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm1.9 17.6c0 1.6-.92 2.4-2.6 2.4-2.38 0-3.5-1.84-3.5-4.7 0-3.02 1.38-5 3.48-5 1.48 0 2.3.96 2.3 2.28 0 .84-.34 1.7-.9 2.44.9.7 1.22 2.1 1.22 2.3z" />
    </svg>
  ),
  reddit: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10 10-4.48 10-10zm-9.5 5.5c-1.72 0-3.12-1.32-3.12-1.32s1.4-.98 3.12-.98 3.12.98 3.12.98S14.22 17.5 12.5 17.5zM9 11.5a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.2c3.2 0 3.584.01 4.85.07 1.17.06 1.96.25 2.42.41.6.22 1.03.48 1.48.93.45.45.71.88.93 1.48.16.46.35 1.25.41 2.42.06 1.27.07 1.65.07 4.85s-.01 3.584-.07 4.85c-.06 1.17-.25 1.96-.41 2.42-.22.6-.48 1.03-.93 1.48-.45.45-.88.71-1.48.93-.46.16-1.25.35-2.42.41-1.27.06-1.65.07-4.85.07s-3.584-.01-4.85-.07c-1.17-.06-1.96-.25-2.42-.41-.6-.22-1.03-.48-1.48-.93-.45-.45-.71-.88-.93-1.48-.16-.46-.35-1.25-.41-2.42C2.21 15.584 2.2 15.2 2.2 12s.01-3.584.07-4.85c.06-1.17.25-1.96.41-2.42.22-.6.48-1.03.93-1.48.45-.45.88-.71 1.48-.93.46-.16 1.25-.35 2.42-.41C8.416 2.21 8.8 2.2 12 2.2zM12 5.8A6.2 6.2 0 1 0 18.2 12 6.21 6.21 0 0 0 12 5.8zm0 10.2A4 4 0 1 1 16 12a4 4 0 0 1-4 4zM18.4 6.2a1.44 1.44 0 1 1-1.44-1.44A1.44 1.44 0 0 1 18.4 6.2z" />
    </svg>
  ),
};

// Reusable social link component
const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label?: string }) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-300 hover:text-white transition-colors"
  >
    <span className="sr-only">{label}</span>
    <span className="w-6 h-6 inline-block">{icon}</span>
  </a>
);

export default HarshPortfolio;