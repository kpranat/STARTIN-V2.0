import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string;
}

interface GooeyNavProps {
  items: NavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: number[];
  particleR?: number;
  timeVariance?: number;
  colors?: string[]; // Changed to string for hex/color names
  initialActiveIndex?: number;
}

const GooeyNav = ({
  items = [],
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = ['#8b5cf6', '#06b6d4', '#ec4899', '#22c55e', '#a855f7'],
  initialActiveIndex = 0
}: GooeyNavProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const navigate = useNavigate();

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance: number, pointIndex: number, totalPoints: number) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i: number, t: number, d: number[], r: number) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const makeParticles = (element: HTMLElement) => {
    const d = particleDistances;
    const r = particleR;
    element.style.setProperty('--time', `${animationTime * 2 + timeVariance}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');

      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', p.color);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);

        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);

        requestAnimationFrame(() => {
          element.classList.add('active');
        });

        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch (e) {
            // Particle might already be removed
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };

    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);

    // Safety check for text
    const link = element.querySelector('a');
    textRef.current.innerText = link ? link.innerText : element.innerText;
  };

  const handleClick = (e: React.MouseEvent | { currentTarget: HTMLElement }, index: number, href: string) => {
    const liEl = e.currentTarget as HTMLElement;
    if (activeIndex === index) return;

    setActiveIndex(index);
    updateEffectPosition(liEl);

    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll('.particle');
      particles.forEach(p => {
        try { filterRef.current?.removeChild(p); } catch (e) { }
      });
      makeParticles(filterRef.current);
    }

    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }

    // Handle navigation logic
    if (href.startsWith('/')) {
      navigate(href);
    } else if (href.startsWith('#')) {
      const id = href.substring(1);
      const target = document.getElementById(id);
      target?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;

    const elements = navRef.current.querySelectorAll('li');
    const activeLi = elements[activeIndex] as HTMLElement;

    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
    }

    const handleResize = () => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex] as HTMLElement;
      if (currentActiveLi) updateEffectPosition(currentActiveLi);
    };

    window.addEventListener('resize', handleResize);
    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [activeIndex, items]);

  return (
    <>
      <style>
        {`
          .gooey-nav-fixed-container {
            position: fixed;
            top: 24px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            padding: 8px 12px;
            background: rgba(10, 10, 15, 0.4);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 999px;
            width: fit-content;
            max-width: 95vw;
          }

          .gooey-nav-inner {
            position: relative;
            display: flex;
            align-items: center;
          }

          .gooey-nav-list {
            display: flex !important;
            flex-direction: row !important;
            list-style: none !important;
            padding: 0 !important;
            margin: 0 !important;
            gap: 8px !important;
            position: relative;
            z-index: 3;
          }

          .gooey-nav-item {
            position: relative;
            cursor: pointer;
            border-radius: 999px;
            transition: color 0.3s ease;
          }

          .gooey-nav-link {
            display: block;
            padding: 0.6rem 1.4rem;
            color: rgba(255, 255, 255, 0.6);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            white-space: nowrap;
            transition: color 0.3s ease;
          }

          .gooey-nav-item.active .gooey-nav-link {
            color: transparent; /* Text is shown by effect.text layer */
          }

          .effect {
            position: absolute;
            opacity: 1;
            pointer-events: none;
            display: grid;
            place-items: center;
            z-index: 1;
            border-radius: 999px;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }

          .effect.text {
            color: white;
            z-index: 4;
            font-size: 0.9rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .effect.filter {
            filter: blur(8px) contrast(30); /* Adjusted contrast for cleaner look */
            mix-blend-mode: lighten;
            z-index: 2;
          }

          .effect.filter::after {
            content: "";
            position: absolute;
            inset: 0;
            background: rgba(255, 255, 255, 0.15); /* Subtle white pill */
            transform: scale(0);
            opacity: 0;
            z-index: -1;
            border-radius: 999px;
          }

          .effect.active::after {
            animation: pill-appear 0.3s ease forwards;
          }

          @keyframes pill-appear {
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          .particle {
            position: absolute;
            top: 50%;
            left: 50%;
            animation: particle-move var(--time) ease forwards;
          }

          .point {
            display: block;
            width: 14px;
            height: 14px;
            border-radius: 999px;
            background: var(--color);
            transform: scale(0);
            animation: point-scale var(--time) ease forwards;
          }

          @keyframes particle-move {
            0% { transform: translate(var(--start-x), var(--start-y)); opacity: 1; }
            100% { transform: translate(var(--end-x), var(--end-y)); opacity: 0; }
          }

          @keyframes point-scale {
            0% { transform: scale(0); }
            50% { transform: scale(var(--scale)); }
            100% { transform: scale(0); }
          }

          /* Remove bullets for good measure */
          ul.gooey-nav-list li::before {
            content: none !important;
          }
        `}
      </style>

      <div className="gooey-nav-fixed-container" ref={containerRef}>
        <nav className="gooey-nav-inner">
          <ul className="gooey-nav-list" ref={navRef}>
            {items.map((item, index) => (
              <li
                key={index}
                className={`gooey-nav-item ${activeIndex === index ? 'active' : ''}`}
                onClick={e => handleClick(e, index, item.href)}
              >
                <a
                  href={item.href}
                  className="gooey-nav-link"
                  onClick={e => e.preventDefault()}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Active elements */}
          <span className="effect filter" ref={filterRef} />
          <span className="effect text" ref={textRef} />
        </nav>
      </div>
    </>
  );
};

export default GooeyNav;
