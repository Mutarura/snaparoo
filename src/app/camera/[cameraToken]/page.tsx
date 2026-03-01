'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera, RefreshCw, Zap, ZapOff, Settings, QrCode,
    Video, Image as ImageIcon, X, Check, ChevronLeft, Download, Share2
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

type EventData = {
    id: string;
    name: string;
    branding: string;
    filters: string;
    mediaLimitPerGuest: number;
    allowGuestGallery: boolean;
    galleryViewing: string;
    backgroundPoster?: string;
    cameraToken: string;
    _count: { uploads: number };
};

// Generate or retrieve a persistent participant ID
function getParticipantId(): string {
    const key = 'snaparoo_pid';
    let pid = localStorage.getItem(key);
    if (!pid) {
        pid = `g-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        localStorage.setItem(key, pid);
    }
    return pid;
}

const FILTER_CSS: Record<string, string> = {
    None: 'none',
    Vintage: 'sepia(0.5) contrast(1.1) brightness(0.95) saturate(0.9)',
    'B&W': 'grayscale(1) contrast(1.1)',
    Vibrant: 'saturate(1.8) contrast(1.1)',
    Warm: 'sepia(0.3) saturate(1.3) brightness(1.05)',
    Cool: 'saturate(0.8) hue-rotate(20deg) brightness(1.05)',
};

export default function CameraPage() {
    const params = useParams();
    const cameraToken = params.cameraToken as string;

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<'photo' | 'video'>('photo');
    const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
    const [flash, setFlash] = useState(false);
    const [recording, setRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [capturedMedia, setCapturedMedia] = useState<{ src: string; type: 'photo' | 'video' } | null>(null);
    const [uploadsUsed, setUploadsUsed] = useState(0);
    const [cameraReady, setCameraReady] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [saving, setSaving] = useState(false);
    const [flashActive, setFlashActive] = useState(false);
    const [branding, setBranding] = useState<{ title?: string; subtitle?: string; primaryColor?: string }>({});
    const [participantId, setParticipantId] = useState('');
    const [limitReached, setLimitReached] = useState(false);

    // Load event data
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`/api/camera/${cameraToken}`);
                if (res.ok) {
                    const data = await res.json();
                    setEvent(data);
                    setBranding(JSON.parse(data.branding || '{}'));
                }
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        };
        fetchEvent();
        setParticipantId(getParticipantId());
    }, [cameraToken]);

    // Load previous upload count from localStorage
    useEffect(() => {
        if (!cameraToken) return;
        const count = parseInt(localStorage.getItem(`uploads_${cameraToken}`) || '0');
        setUploadsUsed(count);
    }, [cameraToken]);

    // Start camera
    const startCamera = useCallback(async () => {
        try {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode, aspectRatio: 9 / 16 },
                audio: mode === 'video',
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setCameraReady(true);
        } catch (e) {
            console.error('Camera error:', e);
        }
    }, [facingMode, mode]);

    useEffect(() => {
        startCamera();
        return () => {
            streamRef.current?.getTracks().forEach(t => t.stop());
        };
    }, [startCamera]);

    // Recording timer
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (recording) {
            interval = setInterval(() => setRecordingTime(t => t + 1), 1000);
        } else {
            setRecordingTime(0);
        }
        return () => clearInterval(interval);
    }, [recording]);

    const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const mediaLimit = event?.mediaLimitPerGuest || 25;

    const recordUpload = async () => {
        if (!participantId || !cameraToken) return;
        const newCount = uploadsUsed + 1;
        setUploadsUsed(newCount);
        localStorage.setItem(`uploads_${cameraToken}`, newCount.toString());
        if (newCount >= mediaLimit) setLimitReached(true);

        try {
            await fetch(`/api/camera/${cameraToken}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participantId }),
            });
        } catch (e) {
            console.error(e);
        }
    };

    const handleCapture = async () => {
        if (limitReached || uploadsUsed >= mediaLimit) {
            setLimitReached(true);
            return;
        }
        if (!videoRef.current || !canvasRef.current) return;

        // Flash effect
        if (flash) {
            setFlashActive(true);
            setTimeout(() => setFlashActive(false), 200);
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Apply filter
        const filterCSS = FILTER_CSS[event?.filters || 'None'];
        ctx.filter = filterCSS;
        if (facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0);
        if (facingMode === 'user') ctx.setTransform(1, 0, 0, 1, 0, 0);

        const src = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedMedia({ src, type: 'photo' });
        await recordUpload();
    };

    const startRecording = () => {
        if (limitReached || uploadsUsed >= mediaLimit || !streamRef.current) return;
        chunksRef.current = [];
        const recorder = new MediaRecorder(streamRef.current);
        recorder.ondataavailable = e => e.data.size > 0 && chunksRef.current.push(e.data);
        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            const src = URL.createObjectURL(blob);
            setCapturedMedia({ src, type: 'video' });
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
        setRecording(true);
    };

    const stopRecording = async () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
        await recordUpload();
    };

    const handleVideoToggle = () => {
        if (recording) stopRecording();
        else startRecording();
    };

    const handleSaveMedia = async () => {
        if (!capturedMedia) return;
        setSaving(true);
        const link = document.createElement('a');
        link.href = capturedMedia.src;
        link.download = `snaparoo-${Date.now()}.${capturedMedia.type === 'photo' ? 'jpg' : 'webm'}`;
        link.click();
        await new Promise(r => setTimeout(r, 500));
        setSaving(false);
        setCapturedMedia(null);
    };

    const filterStyle = FILTER_CSS[event?.filters || 'None'];
    const bgPoster = event?.backgroundPoster;
    const accentColor = branding.primaryColor || '#facc15';

    if (loading) {
        return (
            <div className="camera-fullscreen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/50 text-sm">Preparing your camera...</p>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="camera-fullscreen bg-black flex items-center justify-center">
                <div className="text-center p-8">
                    <Camera className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Event Not Found</h2>
                    <p className="text-white/40 text-sm">This event camera link is invalid or has expired.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="camera-fullscreen bg-black flex flex-col overflow-hidden select-none"
            style={bgPoster ? { backgroundImage: `url(${bgPoster})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>

            {/* Flash overlay */}
            <AnimatePresence>
                {flashActive && (
                    <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-white z-50 pointer-events-none" />
                )}
            </AnimatePresence>

            {/* Canvas (hidden) */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera video */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                    filter: filterStyle,
                    transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
                }}
            />

            {/* Dim overlay for bg poster aesthetic */}
            {bgPoster && <div className="absolute inset-0 bg-black/30 z-[1]" />}

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between px-5 pt-safe pt-4">
                {/* Recording indicator or event name */}
                <div>
                    {recording ? (
                        <div className="flex items-center gap-2 glass-dark px-3 py-1.5 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-white text-sm font-bold">{formatTime(recordingTime)}</span>
                        </div>
                    ) : (
                        <div className="glass-dark px-3 py-1.5 rounded-full">
                            <span className="text-white/70 text-xs font-medium">{branding.title || event.name}</span>
                        </div>
                    )}
                </div>

                {/* Top right controls */}
                <div className="flex items-center gap-2">
                    <button onClick={() => setFlash(!flash)}
                        className="w-10 h-10 rounded-full glass-dark flex items-center justify-center transition-colors"
                        style={flash ? { backgroundColor: `${accentColor}33`, borderColor: accentColor } : {}}>
                        {flash ? <Zap className="w-5 h-5" style={{ color: accentColor }} /> : <ZapOff className="w-5 h-5 text-white/60" />}
                    </button>
                    <button onClick={() => setShowQR(true)}
                        className="w-10 h-10 rounded-full glass-dark flex items-center justify-center">
                        <QrCode className="w-5 h-5 text-white/60" />
                    </button>
                    <button onClick={() => setShowSettings(true)}
                        className="w-10 h-10 rounded-full glass-dark flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white/60" />
                    </button>
                </div>
            </div>

            {/* Center: branding subtitle (when nothing happening) */}
            {!recording && (
                <div className="absolute inset-x-0 top-1/4 z-10 text-center px-8 pointer-events-none">
                    {branding.subtitle && (
                        <p className="text-white/40 text-sm font-light">{branding.subtitle}</p>
                    )}
                </div>
            )}

            {/* Bottom controls */}
            <div className="absolute bottom-0 inset-x-0 z-10 flex flex-col items-center pb-safe pb-8 pt-6"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}>

                {/* Media count */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="glass-dark px-4 py-2 rounded-full text-sm font-bold">
                        <span style={{ color: limitReached ? '#ef4444' : accentColor }}>{uploadsUsed}</span>
                        <span className="text-white/40">/{mediaLimit}</span>
                        <span className="text-white/40 ml-2 text-xs">{mode === 'photo' ? 'photos' : 'videos'}</span>
                    </div>
                </div>

                {/* Mode + Capture + Flip row */}
                <div className="flex items-center justify-between w-full max-w-xs px-4">
                    {/* Mode toggle */}
                    <div className="flex flex-col items-center gap-1">
                        <button onClick={() => setMode(mode === 'photo' ? 'video' : 'photo')}
                            className="w-12 h-12 rounded-full glass-dark flex items-center justify-center transition-all"
                            disabled={recording}>
                            {mode === 'photo'
                                ? <Video className="w-5 h-5 text-white/70" />
                                : <ImageIcon className="w-5 h-5 text-white/70" />}
                        </button>
                        <span className="text-white/40 text-xs">{mode === 'photo' ? 'Video' : 'Photo'}</span>
                    </div>

                    {/* Shutter / Record */}
                    <div className="relative">
                        {limitReached && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-red-400 font-semibold whitespace-nowrap">
                                Limit reached
                            </div>
                        )}
                        {mode === 'photo' ? (
                            <button
                                onClick={handleCapture}
                                disabled={limitReached}
                                className="camera-btn disabled:opacity-40"
                                style={limitReached ? {} : { borderColor: accentColor }}
                            />
                        ) : (
                            <button
                                onClick={handleVideoToggle}
                                disabled={limitReached && !recording}
                                className={`camera-btn-video disabled:opacity-40 ${recording ? 'recording' : ''}`}
                            />
                        )}
                    </div>

                    {/* Flip camera */}
                    <div className="flex flex-col items-center gap-1">
                        <button onClick={() => setFacingMode(f => f === 'environment' ? 'user' : 'environment')}
                            className="w-12 h-12 rounded-full glass-dark flex items-center justify-center transition-all"
                            disabled={recording}>
                            <RefreshCw className="w-5 h-5 text-white/70" />
                        </button>
                        <span className="text-white/40 text-xs">Flip</span>
                    </div>
                </div>
            </div>

            {/* ---- CAPTURED MEDIA PREVIEW ---- */}
            <AnimatePresence>
                {capturedMedia && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 bg-black flex flex-col">
                        <div className="flex items-center justify-between px-5 pt-safe pt-4">
                            <button onClick={() => setCapturedMedia(null)}
                                className="w-10 h-10 rounded-full glass-dark flex items-center justify-center">
                                <X className="w-5 h-5 text-white" />
                            </button>
                            <span className="text-white font-semibold text-sm">Preview</span>
                            <div className="w-10" />
                        </div>

                        <div className="flex-1 flex items-center justify-center p-4">
                            {capturedMedia.type === 'photo' ? (
                                <img src={capturedMedia.src} alt="Captured" className="max-h-full max-w-full rounded-2xl object-contain" />
                            ) : (
                                <video src={capturedMedia.src} controls className="max-h-full max-w-full rounded-2xl" />
                            )}
                        </div>

                        <div className="flex gap-3 px-5 pb-safe pb-8">
                            <button onClick={() => setCapturedMedia(null)}
                                className="btn-ghost flex-1 py-4 flex items-center justify-center gap-2">
                                <ChevronLeft className="w-4 h-4" /> Retake
                            </button>
                            <button onClick={handleSaveMedia} disabled={saving}
                                className="btn-primary flex-1 py-4 flex items-center justify-center gap-2">
                                {saving ? 'Saving...' : <><Download className="w-4 h-4" /> Save</>}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ---- QR CODE OVERLAY ---- */}
            <AnimatePresence>
                {showQR && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center p-8">
                        <button onClick={() => setShowQR(false)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full glass-dark flex items-center justify-center">
                            <X className="w-5 h-5 text-white" />
                        </button>
                        <h2 className="text-xl font-bold mb-2">{event.name}</h2>
                        <p className="text-white/40 text-sm mb-8">Scan to join the event camera</p>
                        <div className="bg-white p-5 rounded-2xl mb-8">
                            <QRCodeSVG
                                value={typeof window !== 'undefined' ? window.location.href : ''}
                                size={200}
                            />
                        </div>
                        <button
                            onClick={() => navigator.share?.({ url: window.location.href, title: event.name })}
                            className="btn-ghost px-8 py-3 flex items-center gap-2">
                            <Share2 className="w-4 h-4" /> Share Event Link
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ---- SETTINGS OVERLAY ---- */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="absolute inset-x-0 bottom-0 z-30 glass-dark rounded-t-3xl p-6 pb-safe pb-10">
                        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-bold text-lg">Event Info</h3>
                            <button onClick={() => setShowSettings(false)}>
                                <X className="w-5 h-5 text-white/50" />
                            </button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-white/40">Event</span>
                                <span className="font-semibold">{event.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/40">Your shots remaining</span>
                                <span className="font-bold" style={{ color: accentColor }}>{Math.max(0, mediaLimit - uploadsUsed)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/40">Filter</span>
                                <span className="font-semibold">{event.filters}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/40">Gallery visibility</span>
                                <span className="font-semibold">{event.allowGuestGallery ? `Visible (${event.galleryViewing})` : 'Hidden'}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
