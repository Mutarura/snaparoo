'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Camera, Settings, Users, Image as ImageIcon, ExternalLink, Copy, Download,
  CheckCircle, HardDrive, ToggleLeft, ToggleRight, QrCode, Share2, ArrowLeft,
  Edit3, Eye, EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Types matching Prisma schema
type Event = {
  id: string;
  name: string;
  email: string;
  date: string;
  endDate?: string;
  plan: string;
  paymentStatus: string;
  organizerToken: string;
  cameraToken: string;
  branding: string;
  maxUploads: number;
  currentUploads: number;
  uniqueParticipants: number;
  guestLimit: number;
  galleryViewing: string;
  allowGuestGallery: boolean;
  filters: string;
  mediaLimitPerGuest: number;
  backgroundPoster?: string;
  driveConnected: boolean;
  createdAt: string;
  _count: { uploads: number };
};

const FILTERS = ['None', 'Vintage', 'B&W', 'Vibrant', 'Warm', 'Cool'];
const GALLERY_OPTIONS = ['During', 'After', '12h after', '24h after'];

export default function Dashboard() {
  const params = useParams();
  const token = params.token as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'qr'>('overview');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Local editable settings
  const [settings, setSettings] = useState({
    galleryViewing: 'During',
    allowGuestGallery: true,
    filters: 'None',
    mediaLimitPerGuest: 25,
    brandingTitle: '',
    brandingSubtitle: '',
    primaryColor: '#facc15',
  });

  const cameraUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/camera/${event?.cameraToken}`
    : '';
  const dashboardUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/dashboard/${token}`
    : '';

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/event/${token}`);
        if (res.ok) {
          const data = await res.json();
          setEvent(data);
          const branding = JSON.parse(data.branding || '{}');
          setSettings({
            galleryViewing: data.galleryViewing || 'During',
            allowGuestGallery: data.allowGuestGallery ?? true,
            filters: data.filters || 'None',
            mediaLimitPerGuest: data.mediaLimitPerGuest || 25,
            brandingTitle: branding.title || data.name,
            brandingSubtitle: branding.subtitle || 'Capture the moment!',
            primaryColor: branding.primaryColor || '#facc15',
          });
        }
      } catch (error) {
        console.error('Failed to fetch event:', error);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [token]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const fd = new FormData();
    fd.append('galleryViewing', settings.galleryViewing);
    fd.append('allowGuestGallery', settings.allowGuestGallery.toString());
    fd.append('filters', settings.filters);
    fd.append('mediaLimitPerGuest', settings.mediaLimitPerGuest.toString());
    fd.append('title', settings.brandingTitle);
    fd.append('subtitle', settings.brandingSubtitle);
    fd.append('primaryColor', settings.primaryColor);
    try {
      await fetch(`/api/event/${token}`, { method: 'PATCH', body: fd });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔗</div>
          <h2 className="text-xl font-bold mb-2">Event not found</h2>
          <p className="text-white/40 mb-6">This dashboard link may be invalid or expired.</p>
          <Link href="/create" className="btn-primary px-6 py-3">Create New Event</Link>
        </div>
      </div>
    );
  }

  const uploadPercent = Math.min((event._count.uploads / event.maxUploads) * 100, 100);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="glass-dark border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-400/20 flex items-center justify-center">
              <Camera className="w-4.5 h-4.5 text-yellow-400" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">{event.name}</h1>
              <p className="text-white/30 text-xs">Organizer Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={cameraUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4" /> Open Camera <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl glass border border-white/8 mb-8 w-fit">
          {(['overview', 'settings', 'qr'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === tab ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}>
              {tab === 'qr' ? 'QR & Share' : tab}
            </button>
          ))}
        </div>

        {/* ---- OVERVIEW TAB ---- */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Stat cards */}
            <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Photos Taken', value: event._count.uploads, icon: <ImageIcon className="w-5 h-5 text-yellow-400" />, color: 'text-yellow-400' },
                { label: 'Participants', value: event.uniqueParticipants, icon: <Users className="w-5 h-5 text-blue-400" />, color: 'text-blue-400' },
                { label: 'Guest Limit', value: event.guestLimit, icon: <Users className="w-5 h-5 text-purple-400" />, color: 'text-purple-400' },
                { label: 'Shots/Guest', value: event.mediaLimitPerGuest, icon: <Camera className="w-5 h-5 text-green-400" />, color: 'text-green-400' },
              ].map(stat => (
                <div key={stat.label} className="glass border border-white/8 rounded-2xl p-5">
                  {stat.icon}
                  <div className={`text-3xl font-black mt-3 mb-1 ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-white/30 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Storage progress */}
            <div className="md:col-span-2 glass border border-white/8 rounded-2xl p-6">
              <h3 className="font-bold text-sm text-white/40 uppercase tracking-wider mb-4">Storage Usage</h3>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">{event._count.uploads} uploads</span>
                <span className="text-white/60">{event.maxUploads} max</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-700"
                  style={{ width: `${uploadPercent}%` }}
                />
              </div>
              <p className="text-xs text-white/30 mt-3">
                {uploadPercent.toFixed(0)}% of storage used · Plan: <span className="text-yellow-400 font-semibold capitalize">{event.plan}</span>
              </p>

              {/* Camera Link */}
              <div className="mt-6 pt-5 border-t border-white/8">
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-2">Guest Camera Link</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white/60 truncate">
                    {cameraUrl || 'Loading...'}
                  </div>
                  <button onClick={() => copyToClipboard(cameraUrl)}
                    className={`px-4 py-3 rounded-xl border transition-all text-sm font-semibold flex items-center gap-1.5 ${copied ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-white/10 glass hover:border-white/20'}`}>
                    {copied ? <><CheckCircle className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
                  </button>
                </div>
              </div>
            </div>

            {/* Cloud Storage */}
            <div className="glass border border-white/8 rounded-2xl p-6">
              <h3 className="font-bold text-sm text-white/40 uppercase tracking-wider mb-4">Cloud Storage</h3>
              {event.driveConnected ? (
                <div className="flex items-center gap-3 text-green-400 bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <div className="font-bold text-sm">Google Drive Connected</div>
                    <div className="text-xs text-white/40 mt-0.5">Uploads sync automatically</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-white/40">Connect cloud storage to automatically save all event media.</p>
                  <button className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2">
                    <HardDrive className="w-4 h-4" /> Connect Google Drive
                  </button>
                  <button className="btn-ghost w-full py-3 text-sm flex items-center justify-center gap-2">
                    Connect iCloud
                  </button>
                </div>
              )}

              {/* Event info */}
              <div className="mt-6 pt-5 border-t border-white/8 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Status</span>
                  <span className={`font-semibold ${event.paymentStatus === 'PAID' ? 'text-green-400' : 'text-orange-400'}`}>{event.paymentStatus}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Filter</span>
                  <span className="font-medium">{event.filters}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Gallery</span>
                  <span className="font-medium">{event.allowGuestGallery ? `Visible (${event.galleryViewing})` : 'Hidden'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---- SETTINGS TAB ---- */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            {/* Branding */}
            <div className="glass border border-white/8 rounded-2xl p-6">
              <h3 className="font-bold mb-5 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-yellow-400" /> Camera Branding
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-white/40 font-semibold uppercase">Event Title</label>
                  <input value={settings.brandingTitle}
                    onChange={e => setSettings(p => ({ ...p, brandingTitle: e.target.value }))}
                    className="input-dark" placeholder="Event name shown on camera screen" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-white/40 font-semibold uppercase">Subtitle / Tagline</label>
                  <input value={settings.brandingSubtitle}
                    onChange={e => setSettings(p => ({ ...p, brandingSubtitle: e.target.value }))}
                    className="input-dark" placeholder="e.g. Capture the moment!" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-white/40 font-semibold uppercase">Accent Color</label>
                  <div className="flex gap-3">
                    {['#facc15', '#ef4444', '#3b82f6', '#10b981', '#a855f7', '#f97316'].map(col => (
                      <button key={col} onClick={() => setSettings(p => ({ ...p, primaryColor: col }))}
                        className={`w-9 h-9 rounded-full border-2 transition-all ${settings.primaryColor === col ? 'border-white scale-110' : 'border-transparent scale-100'}`}
                        style={{ backgroundColor: col }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Settings */}
            <div className="glass border border-white/8 rounded-2xl p-6">
              <h3 className="font-bold mb-5 flex items-center gap-2">
                <Eye className="w-4 h-4 text-yellow-400" /> Gallery Settings
              </h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">Guests Can View Gallery</div>
                    <div className="text-xs text-white/30 mt-0.5">Turn off for a surprise reveal after the event</div>
                  </div>
                  <button onClick={() => setSettings(p => ({ ...p, allowGuestGallery: !p.allowGuestGallery }))}>
                    {settings.allowGuestGallery
                      ? <ToggleRight className="w-9 h-9 text-yellow-400" />
                      : <ToggleLeft className="w-9 h-9 text-white/30" />}
                  </button>
                </div>

                {settings.allowGuestGallery && (
                  <div>
                    <label className="text-xs text-white/40 font-semibold uppercase block mb-2">When to show gallery</label>
                    <div className="grid grid-cols-2 gap-2">
                      {GALLERY_OPTIONS.map(opt => (
                        <button key={opt} onClick={() => setSettings(p => ({ ...p, galleryViewing: opt }))}
                          className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${settings.galleryViewing === opt ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400' : 'border-white/8 text-white/50 hover:border-white/15'}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Media Settings */}
            <div className="glass border border-white/8 rounded-2xl p-6">
              <h3 className="font-bold mb-5 flex items-center gap-2">
                <Camera className="w-4 h-4 text-yellow-400" /> Media Settings
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="text-xs text-white/40 font-semibold uppercase block mb-3">
                    Filter Applied to Guest Photos: <span className="text-white normal-case">{settings.filters}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {FILTERS.map(f => (
                      <button key={f} onClick={() => setSettings(p => ({ ...p, filters: f }))}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${settings.filters === f ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400' : 'border-white/8 text-white/50 hover:border-white/15'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/40 font-semibold uppercase block mb-3">
                    Shots Per Guest: <span className="text-white normal-case">{settings.mediaLimitPerGuest}</span>
                  </label>
                  <input type="range" min={5} max={100} step={5} value={settings.mediaLimitPerGuest}
                    onChange={e => setSettings(p => ({ ...p, mediaLimitPerGuest: parseInt(e.target.value) }))}
                    className="w-full accent-yellow-400" />
                </div>
              </div>
            </div>

            <button onClick={handleSaveSettings} disabled={saving}
              className={`btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60 ${saved ? 'bg-green-500 hover:bg-green-400' : ''}`}>
              {saving ? 'Saving...' : saved ? <><CheckCircle className="w-5 h-5" /> Saved!</> : <>Save Changes</>}
            </button>
          </div>
        )}

        {/* ---- QR & SHARE TAB ---- */}
        {activeTab === 'qr' && (
          <div className="max-w-xl space-y-6">
            <div className="glass border border-white/8 rounded-2xl p-8 flex flex-col items-center text-center">
              <h3 className="font-bold text-lg mb-2">Event QR Code</h3>
              <p className="text-white/40 text-sm mb-8">Display this at your venue. Guests scan to open the camera.</p>

              <div className="bg-white p-5 rounded-2xl mb-6">
                {cameraUrl && <QRCodeSVG value={cameraUrl} size={220} />}
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mb-6">
                <button className="btn-ghost py-3 text-sm flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download QR
                </button>
                <button onClick={() => navigator.share?.({ url: cameraUrl, title: event.name })}
                  className="btn-ghost py-3 text-sm flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" /> Share Link
                </button>
              </div>
            </div>

            <div className="glass border border-white/8 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm mb-4">Share Links</h3>

              <div>
                <label className="text-xs text-white/40 font-semibold uppercase block mb-1.5">Guest Camera Link</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black/50 border border-white/8 rounded-xl px-4 py-3 text-sm font-mono text-white/50 truncate">{cameraUrl}</div>
                  <button onClick={() => copyToClipboard(cameraUrl)}
                    className={`px-4 rounded-xl border text-sm font-semibold flex items-center gap-1.5 transition-all ${copied ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-white/10 glass hover:border-white/20'}`}>
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/40 font-semibold uppercase block mb-1.5">Your Dashboard Link</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black/50 border border-white/8 rounded-xl px-4 py-3 text-sm font-mono text-white/50 truncate">{dashboardUrl}</div>
                  <button onClick={() => copyToClipboard(dashboardUrl)}
                    className="px-4 rounded-xl border border-white/10 glass text-sm font-semibold flex items-center gap-1.5 hover:border-white/20 transition-all">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-white/25 mt-1.5">⚠️ Keep this link private — it gives full dashboard access.</p>
              </div>
            </div>

            <div className="glass border border-yellow-400/20 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-400/20 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <div className="font-semibold text-sm mb-1">Launch Camera Directly</div>
                  <p className="text-white/40 text-xs mb-3">Open the guest camera view right from here.</p>
                  <a href={cameraUrl} target="_blank" rel="noopener noreferrer"
                    className="btn-primary text-sm px-5 py-2.5 inline-flex items-center gap-1.5">
                    Open Camera <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
