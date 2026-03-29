import type { ReactNode, CSSProperties } from 'react';
import './GlareHover.css';

interface GlareHoverProps {
    width?: string;
    height?: string;
    background?: string;
    borderRadius?: string;
    borderColor?: string;
    children?: ReactNode;
    glareColor?: string;
    glareOpacity?: number;
    glareAngle?: number;
    glareSize?: number;
    transitionDuration?: number;
    playOnce?: boolean;
}

const GlareHover = ({
    width = '500px',
    height = '500px',
    background = 'rgba(255,255,255,0.05)',
    borderRadius = '20px',
    borderColor = 'rgba(255,255,255,0.1)',
    children,
    glareColor = '#ffffff',
    glareOpacity = 0.3,
    glareAngle = -45,
    glareSize = 250,
    transitionDuration = 650,
    playOnce = false
}: GlareHoverProps) => {
    const hex = glareColor.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;

    const vars: CSSProperties & Record<string, string> = {
        '--gh-width': width,
        '--gh-height': height,
        '--gh-bg': background,
        '--gh-br': borderRadius,
        '--gh-angle': `${glareAngle}deg`,
        '--gh-duration': `${transitionDuration}ms`,
        '--gh-size': `${glareSize}%`,
        '--gh-rgba': rgba,
        '--gh-border': borderColor
    };

    return (
        <div className={`glare-hover ${playOnce ? 'glare-hover--play-once' : ''}`} style={vars}>
            {children}
        </div>
    );
};

export default GlareHover;
