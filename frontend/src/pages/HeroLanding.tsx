import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Building2, School, ChevronRight } from 'lucide-react';
import ColorBends from '../components/ui/ColorBends';
import TextPressure from '../components/ui/TextPressure';
import BlurText from '../components/ui/BlurText';
import LiquidEther from '../components/ui/LiquidEther';
import GooeyNav from '../components/ui/GooeyNav';
import '../App.css';

const navItems = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Universities', href: '/' },
    { label: 'Students', href: '/student/login' },
    { label: 'Companies', href: '/company/login' },
    { label: 'Contact', href: '#contact' },
];

const FadeInSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {children}
        </motion.div>
    );
};

const HeroLanding = () => {
    const navigate = useNavigate();

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', overflow: 'hidden' }}>
            {/* Navigation */}
            <GooeyNav
                items={navItems}
                initialActiveIndex={0}
                particleCount={20}
                particleDistances={[90, 10]}
                particleR={120}
                animationTime={600}
                timeVariance={400}
                colors={['#8b5cf6', '#06b6d4', '#ec4899', '#22c55e', '#7c3aed', '#0891b2']}
            />

            {/* Hero Section */}
            <section id="hero" style={{
                position: 'relative',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            }}>
                {/* ColorBends Background */}
                <ColorBends
                    rotation={45}
                    speed={0.15}
                    colors={['#6b21a8', '#db2777', '#06b6d4', '#3b82f6', '#7c3aed']}
                    transparent={false}
                    scale={1.2}
                    frequency={0.8}
                    mouseInfluence={0.8}
                    parallax={0.5}
                />

                {/* Dark overlay for text readability */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
                    zIndex: 1,
                }} />

                {/* Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: '1200px',
                    padding: '0 2rem',
                }}>
                    {/* Main Title with TextPressure */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{ width: '100%' }}
                    >
                        <TextPressure
                            text="STARTIN'"
                            textColor="#FFFFFF"
                            minFontSize={140}
                        />
                    </motion.div>

                    {/* Subtitle with BlurText */}
                    <div style={{ marginTop: '1.5rem', maxWidth: '800px', margin: '1.5rem auto 0' }}>
                        <BlurText
                            text="Connecting students, companies, and opportunities."
                            delay={100}
                            className=""
                            animateBy="words"
                            direction="bottom"
                            stepDuration={0.4}
                        />
                    </div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        style={{
                            marginTop: '3rem',
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <button
                            onClick={() => navigate('/select-university')}
                            style={{
                                padding: '1rem 2.5rem',
                                background: 'var(--gradient-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '1.05rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                                transition: 'all 0.3s',
                                fontFamily: 'inherit',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(139, 92, 246, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)';
                            }}
                        >
                            Get Started <ChevronRight size={18} />
                        </button>
                        <button
                            onClick={() => {
                                const el = document.getElementById('about');
                                el?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            style={{
                                padding: '1rem 2.5rem',
                                background: 'rgba(255, 255, 255, 0.08)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '1.05rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s',
                                fontFamily: 'inherit',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                            }}
                        >
                            Learn More
                        </button>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    style={{
                        position: 'absolute',
                        bottom: '2rem',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        Scroll
                    </span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            width: '24px',
                            height: '40px',
                            border: '2px solid rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'center',
                            paddingTop: '8px',
                        }}
                    >
                        <div style={{
                            width: '3px',
                            height: '8px',
                            borderRadius: '2px',
                            background: 'var(--accent-purple)',
                        }} />
                    </motion.div>
                </motion.div>

                {/* Bottom gradient transition */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '150px',
                    background: 'linear-gradient(to bottom, transparent, var(--bg-primary))',
                    zIndex: 1,
                    pointerEvents: 'none'
                }} />
            </section>

            {/* About Section */}
            <section id="about" style={{
                position: 'relative',
                minHeight: '100vh',
                padding: '8rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {/* LiquidEther Background */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden' }}>
                    <LiquidEther style={{ width: '100%', height: '100%' }} />
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '150px',
                        background: 'linear-gradient(to top, transparent, var(--bg-primary))', zIndex: 2, pointerEvents: 'none'
                    }} />
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px',
                        background: 'linear-gradient(to bottom, transparent, var(--bg-primary))', zIndex: 2, pointerEvents: 'none'
                    }} />
                </div>

                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: '1000px',
                    width: '100%',
                }}>
                    <FadeInSection>
                        <h2 style={{
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 800,
                            textAlign: 'center',
                            marginBottom: '1rem',
                            background: 'var(--gradient-primary)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            The Future of Campus Recruiting
                        </h2>
                    </FadeInSection>

                    <FadeInSection delay={0.2}>
                        <p style={{
                            textAlign: 'center',
                            color: 'var(--text-secondary)',
                            fontSize: '1.4rem',
                            maxWidth: '600px',
                            margin: '0 auto 4rem',
                            lineHeight: 1.7,
                            fontFamily: "'Yrsa', serif",
                        }}>
                            STARTIN' bridges the gap between ambitious students and innovative companies,
                            creating a seamless pipeline for talent discovery.
                        </p>
                    </FadeInSection>

                    {/* Feature Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem',
                    }}>
                        {[
                            {
                                icon: <GraduationCap size={44} strokeWidth={1.5} />,
                                title: 'For Students',
                                desc: 'Discover internships, connect with mentors, and launch your career from campus.',
                            },
                            {
                                icon: <Building2 size={44} strokeWidth={1.5} />,
                                title: 'For Companies',
                                desc: 'Access top university talent, post opportunities, and build your dream team.',
                            },
                            {
                                icon: <School size={44} strokeWidth={1.5} />,
                                title: 'For Universities',
                                desc: 'Create your exclusive ecosystem and track placement success in real-time.',
                            },
                        ].map((feature, i) => (
                            <FadeInSection key={i} delay={0.3 + i * 0.15}>
                                <div style={{
                                    background: 'var(--bg-glass)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '2rem',
                                    backdropFilter: 'blur(20px)',
                                    transition: 'all 0.3s',
                                    cursor: 'default',
                                    height: '100%',
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--border-hover)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <div style={{ marginBottom: '1.5rem', color: 'var(--accent-purple)' }}>{feature.icon}</div>
                                    <h3 style={{
                                        fontSize: '1.25rem',
                                        fontWeight: 700,
                                        marginBottom: '0.75rem',
                                        color: 'var(--text-primary)',
                                        fontFamily: "'Outfit', sans-serif",
                                    }}>
                                        {feature.title}
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        {feature.desc}
                                    </p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact / CTA Section */}
            <section id="contact" style={{
                position: 'relative',
                padding: '8rem 2rem 0',
                textAlign: 'center',
                overflow: 'hidden',
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
                {/* LiquidEther Background */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden' }}>
                    <LiquidEther style={{ width: '100%', height: '100%' }} />
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '150px',
                        background: 'linear-gradient(to top, transparent, var(--bg-primary))', zIndex: 2, pointerEvents: 'none'
                    }} />
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px',
                        background: 'linear-gradient(to bottom, transparent, var(--bg-primary))', zIndex: 2, pointerEvents: 'none'
                    }} />
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <FadeInSection>
                        <h2 style={{
                            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 800,
                            marginBottom: '1.5rem',
                            color: 'var(--text-primary)',
                        }}>
                            Ready to Start?
                        </h2>
                    </FadeInSection>
                    <FadeInSection delay={0.2}>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '1.3rem',
                            maxWidth: '500px',
                            margin: '0 auto 2.5rem',
                            fontFamily: "'Yrsa', serif",
                        }}>
                            Join your university's startup ecosystem and unlock your potential.
                        </p>
                    </FadeInSection>
                    <FadeInSection delay={0.4}>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                padding: '1rem 3rem',
                                background: 'var(--gradient-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                                transition: 'all 0.3s',
                                fontFamily: 'inherit',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 8px 40px rgba(139, 92, 246, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.4)';
                            }}
                        >
                            Select Your University <ChevronRight size={20} />
                        </button>
                    </FadeInSection>
                </div>

                {/* Footer */}
                <div style={{
                    marginTop: '6rem',
                    padding: '2rem 0',
                    borderTop: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                }}>
                    <p>© 2026 STARTIN'. All rights reserved.</p>
                </div>
            </section>
        </div>
    );
};

export default HeroLanding;
