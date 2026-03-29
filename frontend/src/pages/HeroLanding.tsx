import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Building2, School, ChevronRight } from 'lucide-react';
import ColorBends from '../components/ui/ColorBends';
import TextPressure from '../components/ui/TextPressure';
import BlurText from '../components/ui/BlurText';
import DotGrid from '../components/ui/DotGrid';
import Particles from '../components/ui/Particles';
import GooeyNav from '../components/ui/GooeyNav';
import GlareHover from '../components/ui/GlareHover';
import ElectricBorder from '../components/ui/ElectricBorder';
import '../App.css';

const navItems = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Universities', href: '/' },
    { label: 'Students', href: '/student/login' },
    { label: 'Companies', href: '/company/login' },
    { label: 'Contact', href: '#contact' },
];

const FadeInSection = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
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
                    background: 'radial-gradient(ellipse at center, rgba(15,15,20,0.5) 0%, rgba(15,15,20,0.85) 100%)',
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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
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
                            marginTop: '3.5rem',
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
                                background: 'white',
                                color: 'black',
                                border: 'none',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '1.05rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontFamily: 'inherit',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 255, 255, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
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
                                background: 'rgba(255, 255, 255, 0.03)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '1.05rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s',
                                fontFamily: 'inherit',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            Explore Platform
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
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                        Scroll
                    </span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            width: '22px',
                            height: '36px',
                            border: '1.5px solid rgba(255,255,255,0.15)',
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'center',
                            paddingTop: '6px',
                        }}
                    >
                        <div style={{
                            width: '2px',
                            height: '6px',
                            borderRadius: '2px',
                            background: 'white',
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

            {/* About Section - Bento Layout */}
            <section id="about" style={{
                position: 'relative',
                minHeight: '100vh',
                padding: '10rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {/* Minimal Tech Grid Background */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
                        <DotGrid
                            baseColor="rgba(255, 255, 255, 0.1)"
                            activeColor="rgba(255, 255, 255, 0.8)"
                            gap={32}
                            dotSize={2}
                            proximity={100}
                        />
                    </div>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '200px',
                        background: 'linear-gradient(to top, transparent, var(--bg-primary))', zIndex: 2, pointerEvents: 'none'
                    }} />
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px',
                        background: 'linear-gradient(to bottom, transparent, var(--bg-primary))', zIndex: 2, pointerEvents: 'none'
                    }} />
                </div>

                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: '1200px',
                    width: '100%',
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <FadeInSection>
                            <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                                The Future of Recruitment
                            </div>
                        </FadeInSection>
                        <FadeInSection delay={0.1}>
                            <h2 style={{
                                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: 600,
                                marginBottom: '1.5rem',
                                color: 'white',
                                letterSpacing: '-0.02em',
                                lineHeight: 1.1
                            }}>
                                A unified platform for<br />
                                <span style={{ color: 'rgba(255,255,255,0.5)' }}>campus recruitment.</span>
                            </h2>
                        </FadeInSection>
                        <FadeInSection delay={0.2}>
                            <p style={{
                                color: 'var(--text-secondary)',
                                fontSize: '1.25rem',
                                maxWidth: '600px',
                                margin: '0 auto',
                                lineHeight: 1.6,
                            }}>
                                STARTIN' closes the gap between ambitious talent, cutting-edge companies, and modern universities.
                            </p>
                        </FadeInSection>
                    </div>

                    {/* Bento Grid Layout */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                    }}>
                        {/* Top row */}
                        <div style={{
                            display: 'flex',
                            gap: '1.5rem',
                            flexWrap: 'wrap'
                        }}>
                            {/* Students (Bigger Card) */}
                            <FadeInSection delay={0.3} className="flex-grow flex-1" style={{ flexBasis: '400px' }}>
                                <div style={{ minHeight: '360px', height: '100%' }}>
                                    <GlareHover width="100%" height="100%" background="linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)" borderColor="rgba(255, 255, 255, 0.08)" borderRadius="24px" transitionDuration={800}>
                                        <div style={{ padding: '3rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ background: 'rgba(255, 255, 255, 0.05)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: 'auto', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                <GraduationCap size={32} />
                                            </div>
                                            <div style={{ marginTop: '3rem' }}>
                                                <h3 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'white', marginBottom: '1rem', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>For Students</h3>
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '400px' }}>Discover verified internships, build your portfolio, and algorithmically match with opportunities that suit your unique skills.</p>
                                            </div>
                                        </div>
                                    </GlareHover>
                                </div>
                            </FadeInSection>

                            {/* Universities */}
                            <FadeInSection delay={0.4} className="flex-grow flex-1" style={{ flexBasis: '350px' }}>
                                <div style={{ minHeight: '360px', height: '100%' }}>
                                    <GlareHover width="100%" height="100%" background="linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)" borderColor="rgba(255, 255, 255, 0.05)" borderRadius="24px">
                                        <div style={{ padding: '3rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ background: 'rgba(255, 255, 255, 0.03)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)', marginBottom: 'auto' }}>
                                                <School size={32} />
                                            </div>
                                            <div style={{ marginTop: '3rem' }}>
                                                <h3 style={{ fontSize: '2rem', fontWeight: 500, color: 'white', marginBottom: '1rem', fontFamily: "'Outfit', sans-serif" }}>For Universities</h3>
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>Maintain a private talent network. Track placement metrics and streamline campus recruitment digitally.</p>
                                            </div>
                                        </div>
                                    </GlareHover>
                                </div>
                            </FadeInSection>
                        </div>

                        {/* Bottom Row */}
                        <FadeInSection delay={0.5}>
                            <div style={{ width: '100%', minHeight: '280px' }}>
                                <GlareHover width="100%" height="100%" background="linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)" borderColor="rgba(255, 255, 255, 0.08)" borderRadius="24px">
                                    <div style={{ padding: '3.5rem', height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
                                        <div style={{ background: 'rgba(255, 255, 255, 0.05)', width: '80px', height: '80px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <Building2 size={40} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: '300px' }}>
                                            <h3 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'white', marginBottom: '0.75rem', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>For Companies</h3>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '600px' }}>Skip the noise. Access a direct pipeline to top university talent, filter by verified skills, and build your team faster than ever.</p>
                                        </div>
                                    </div>
                                </GlareHover>
                            </div>
                        </FadeInSection>
                    </div>
                </div>
            </section>

            {/* Contact / CTA Section */}
            <section id="contact" style={{
                position: 'relative',
                padding: '10rem 2rem',
                textAlign: 'center',
                overflow: 'hidden',
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {/* Subtle Particles Background */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden', background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.02) 0%, transparent 60%)' }}>
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
                        <Particles
                            particleCount={80}
                            particleColors={['#ffffff', '#8b5cf6', '#4a4a5a']}
                            speed={0.1}
                            moveParticlesOnHover={true}
                            particleHoverFactor={2}
                            alphaParticles={true}
                            particleSpread={15}
                        />
                    </div>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '200px',
                        background: 'linear-gradient(to top, transparent, var(--bg-primary))', zIndex: 2, pointerEvents: 'none'
                    }} />
                </div>

                <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <FadeInSection>
                        <ElectricBorder
                            color="#ffffff"
                            speed={0.5}
                            chaos={0.03}
                            borderRadius={32}
                            style={{
                                maxWidth: '800px',
                                margin: '0 auto',
                                background: 'rgba(15, 15, 20, 0.7)',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            <div style={{
                                padding: '5rem 3rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center'
                            }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '50%', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'white' }}>
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                                <h2 style={{
                                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                                    fontFamily: "'Outfit', sans-serif",
                                    fontWeight: 600,
                                    marginBottom: '1.5rem',
                                    color: 'white',
                                    letterSpacing: '-0.03em',
                                    lineHeight: 1.1
                                }}>
                                    Ready to innovate?
                                </h2>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '1.2rem',
                                    maxWidth: '450px',
                                    margin: '0 auto 3.5rem',
                                    lineHeight: 1.6,
                                }}>
                                    Join the premier ecosystem scaling the next generation of campus recruitment.
                                </p>
                                <button
                                    onClick={() => navigate('/select-university')}
                                    style={{
                                        padding: '1.2rem 3rem',
                                        background: 'white',
                                        color: 'black',
                                        border: 'none',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        fontFamily: 'inherit',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-3px)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 255, 255, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    Select Your University
                                </button>
                            </div>
                        </ElectricBorder>
                    </FadeInSection>
                </div>

                {/* Footer */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    padding: '2rem 0',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.85rem',
                    zIndex: 2,
                    fontWeight: 500
                }}>
                    <p>© 2026 STARTIN'. All rights reserved.</p>
                </div>
            </section>
        </div>
    );
};

export default HeroLanding;
