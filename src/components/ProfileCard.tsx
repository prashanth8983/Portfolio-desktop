
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import './ProfileCard.css';

const ANIMATION_CONFIG = {
    INITIAL_DURATION: 1200,
    INITIAL_X_OFFSET: 70,
    INITIAL_Y_OFFSET: 60,
    DEVICE_BETA_OFFSET: 20,
    ENTER_TRANSITION_MS: 180
};

const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v: number, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

interface ProfileCardProps {
    avatarUrl?: string;
    sealUrl?: string;
    logoUrl?: string;
    grainUrl?: string;
    className?: string;
    enableTilt?: boolean;
    enableMobileTilt?: boolean;
    mobileTiltSensitivity?: number;
    firstName?: string;
    lastName?: string;
    expirationDate?: string;
    role?: string;
}

const BASE_PATH = import.meta.env.BASE_URL;

const ProfileCardComponent: React.FC<ProfileCardProps> = ({
    avatarUrl = 'https://github.com/prashanth8983.png',
    sealUrl = `${BASE_PATH}nyu_seal.svg`,
    logoUrl = `${BASE_PATH}icons/symbol.svg`,
    grainUrl = 'https://raw.githubusercontent.com/javicodes/profile-card/main/public/grain.webp',
    className = '',
    enableTilt = true,
    enableMobileTilt = false,
    mobileTiltSensitivity = 5,
    firstName = 'Prashanth',
    lastName = 'Kumar',
    expirationDate = 'August 2027',
    role = 'STUDENT'
}) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const shellRef = useRef<HTMLDivElement>(null);

    const enterTimerRef = useRef<number | null>(null);
    const leaveRafRef = useRef<number | null>(null);

    const tiltEngine = useMemo(() => {
        if (!enableTilt) return null;

        let rafId: number | null = null;
        let running = false;
        let lastTs = 0;

        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;

        const DEFAULT_TAU = 0.14;
        const INITIAL_TAU = 0.6;
        let initialUntil = 0;

        const setVarsFromXY = (x: number, y: number) => {
            const shell = shellRef.current;
            const wrap = wrapRef.current;
            if (!shell || !wrap) return;

            const width = shell.clientWidth || 1;
            const height = shell.clientHeight || 1;

            const percentX = clamp((100 / width) * x);
            const percentY = clamp((100 / height) * y);

            const centerX = percentX - 50;
            const centerY = percentY - 50;

            const properties: Record<string, string> = {
                '--pointer-x': `${percentX}%`,
                '--pointer-y': `${percentY}%`,
                '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
                '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
                '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
                '--pointer-from-top': `${percentY / 100}`,
                '--pointer-from-left': `${percentX / 100}`,
                '--rotate-x': `${round(-(centerX / 5))}deg`,
                '--rotate-y': `${round(centerY / 4)}deg`
            };

            for (const [k, v] of Object.entries(properties)) {
                wrap.style.setProperty(k, v);
            }
        };

        const step = (ts: number) => {
            if (!running) return;
            if (lastTs === 0) lastTs = ts;
            const dt = (ts - lastTs) / 1000;
            lastTs = ts;

            const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
            const k = 1 - Math.exp(-dt / tau);

            currentX += (targetX - currentX) * k;
            currentY += (targetY - currentY) * k;

            setVarsFromXY(currentX, currentY);

            const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

            if (stillFar || document.hasFocus()) {
                rafId = requestAnimationFrame(step);
            } else {
                running = false;
                lastTs = 0;
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            }
        };

        const start = () => {
            if (running) return;
            running = true;
            lastTs = 0;
            rafId = requestAnimationFrame(step);
        };

        return {
            setImmediate(x: number, y: number) {
                currentX = x;
                currentY = y;
                setVarsFromXY(currentX, currentY);
            },
            setTarget(x: number, y: number) {
                targetX = x;
                targetY = y;
                start();
            },
            toCenter() {
                const shell = shellRef.current;
                if (!shell) return;
                this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
            },
            beginInitial(durationMs: number) {
                initialUntil = performance.now() + durationMs;
                start();
            },
            getCurrent() {
                return { x: currentX, y: currentY, tx: targetX, ty: targetY };
            },
            cancel() {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = null;
                running = false;
                lastTs = 0;
            }
        };
    }, [enableTilt]);

    const getOffsets = (evt: React.PointerEvent | MouseEvent, el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
    };

    const handlePointerMove = useCallback(
        (event: any) => {
            const shell = shellRef.current;
            if (!shell || !tiltEngine) return;
            const { x, y } = getOffsets(event, shell);
            tiltEngine.setTarget(x, y);
        },
        [tiltEngine]
    );

    const handlePointerEnter = useCallback(
        (event: any) => {
            const shell = shellRef.current;
            if (!shell || !tiltEngine) return;

            shell.classList.add('active');
            shell.classList.add('entering');
            if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
            enterTimerRef.current = window.setTimeout(() => {
                shell.classList.remove('entering');
            }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

            const { x, y } = getOffsets(event, shell);
            tiltEngine.setTarget(x, y);
        },
        [tiltEngine]
    );

    const handlePointerLeave = useCallback(() => {
        const shell = shellRef.current;
        if (!shell || !tiltEngine) return;

        tiltEngine.toCenter();

        const checkSettle = () => {
            const { x, y, tx, ty } = tiltEngine.getCurrent();
            const settled = Math.hypot(tx - x, ty - y) < 0.6;
            if (settled) {
                shell.classList.remove('active');
                leaveRafRef.current = null;
            } else {
                leaveRafRef.current = requestAnimationFrame(checkSettle);
            }
        };
        if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
        leaveRafRef.current = requestAnimationFrame(checkSettle);
    }, [tiltEngine]);

    const handleDeviceOrientation = useCallback(
        (event: DeviceOrientationEvent) => {
            const shell = shellRef.current;
            if (!shell || !tiltEngine) return;

            const { beta, gamma } = event;
            if (beta == null || gamma == null) return;

            const centerX = shell.clientWidth / 2;
            const centerY = shell.clientHeight / 2;
            const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, shell.clientWidth);
            const y = clamp(
                centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
                0,
                shell.clientHeight
            );

            tiltEngine.setTarget(x, y);
        },
        [tiltEngine, mobileTiltSensitivity]
    );

    useEffect(() => {
        if (!enableTilt || !tiltEngine) return;

        const shell = shellRef.current;
        if (!shell) return;

        const pointerMoveHandler = handlePointerMove as any;
        const pointerEnterHandler = handlePointerEnter as any;
        const pointerLeaveHandler = handlePointerLeave as any;
        const deviceOrientationHandler = handleDeviceOrientation as any;

        shell.addEventListener('pointerenter', pointerEnterHandler);
        shell.addEventListener('pointermove', pointerMoveHandler);
        shell.addEventListener('pointerleave', pointerLeaveHandler);

        const handleClick = () => {
            if (!enableMobileTilt || location.protocol !== 'https:') return;

            const anyMotion = (window as any).DeviceMotionEvent;

            if (anyMotion && typeof anyMotion.requestPermission === 'function') {
                anyMotion
                    .requestPermission()
                    .then((state: string) => {
                        if (state === 'granted') {
                            window.addEventListener('deviceorientation', deviceOrientationHandler);
                        }
                    })
                    .catch(console.error);
            } else {
                window.addEventListener('deviceorientation', deviceOrientationHandler);
            }
        };
        shell.addEventListener('click', handleClick);

        const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
        const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
        tiltEngine.setImmediate(initialX, initialY);
        tiltEngine.toCenter();
        tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

        return () => {
            shell.removeEventListener('pointerenter', pointerEnterHandler);
            shell.removeEventListener('pointermove', pointerMoveHandler);
            shell.removeEventListener('pointerleave', pointerLeaveHandler);
            shell.removeEventListener('click', handleClick);
            window.removeEventListener('deviceorientation', deviceOrientationHandler);
            if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
            if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
            tiltEngine.cancel();
            shell.classList.remove('entering');
        };
    }, [
        enableTilt,
        enableMobileTilt,
        tiltEngine,
        handlePointerMove,
        handlePointerEnter,
        handlePointerLeave,
        handleDeviceOrientation
    ]);

    const cardStyle = useMemo(
        () => ({
            '--seal': sealUrl ? `url(${sealUrl})` : 'none',
            '--seal-url': sealUrl ? `url(${sealUrl})` : 'none',
            '--grain': grainUrl ? `url(${grainUrl})` : 'none',
        } as React.CSSProperties),
        [sealUrl, grainUrl]
    );

    return (
        <div ref={wrapRef} className={`nyu-card-wrapper ${className}`.trim()} style={cardStyle}>
            {/* Behind glow effect */}
            <div className="nyu-behind" />

            <div ref={shellRef} className="nyu-card-shell">
                <section className="nyu-card">
                    {/* Holographic shine overlay */}
                    <div className="nyu-shine" />
                    <div className="nyu-glare" />

                    {/* Card content */}
                    <div className="nyu-card-content">
                        {/* NYU Header - Logo in white box with NYU text outside */}
                        <div className="nyu-header">
                            <div className="nyu-logo-box">
                                <img src={logoUrl} alt="NYU Logo" className="nyu-logo-img" />
                            </div>
                            <span className="nyu-logo-text">NYU</span>
                        </div>

                        {/* Main photo area */}
                        <div className="nyu-photo-section">
                            {/* Main photo */}
                            <div className="nyu-photo-frame">
                                <img
                                    src={avatarUrl}
                                    alt={`${firstName} ${lastName}`}
                                    className="nyu-photo"
                                    onError={(e: any) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Expiration date */}
                        <div className="nyu-expiration">
                            {expirationDate}
                        </div>

                        {/* Name section */}
                        <div className="nyu-name-section">
                            <div className="nyu-lastname">{lastName}</div>
                            <div className="nyu-firstname">{firstName}</div>
                        </div>

                        {/* Small photo and role */}
                        <div className="nyu-footer">
                            <div className="nyu-small-photo">
                                <img
                                    src={avatarUrl}
                                    alt={`${firstName} ${lastName}`}
                                    onError={(e: any) => {
                                        e.target.style.opacity = '0.5';
                                    }}
                                />
                            </div>
                            <div className="nyu-role">{role}</div>
                        </div>
                    </div>

                    {/* Holographic seal pattern overlay - on top of everything */}
                    <div
                        className="nyu-seal-holographic"
                        style={{ '--seal-url': `url(${sealUrl})` } as React.CSSProperties}
                    />
                </section>
            </div>
        </div>
    );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
