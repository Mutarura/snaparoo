import { getEventByToken, updateEventBranding } from '@/app/actions';
import { notFound } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Camera, Download, Settings, Users, Image as ImageIcon, ExternalLink, HardDrive, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default async function Dashboard({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const event = await getEventByToken(token);

  if (!event) {
    notFound();
  }

  const branding = JSON.parse(event.branding);
  const cameraUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/camera/${event.cameraToken}`;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-10 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded flex items-center justify-center text-black">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{event.name}</h1>
            <p className="text-gray-400 text-sm">Dashboard</p>
          </div>
        </div>
        <div className="flex gap-4">
          <a 
            href={cameraUrl} 
            target="_blank" 
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded flex items-center gap-2 transition-colors"
          >
            Launch Camera <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Stats Column */}
        <div className="space-y-6">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10">
            <h3 className="text-gray-400 text-sm font-bold uppercase mb-4">Event Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black p-4 rounded-xl">
                <ImageIcon className="w-5 h-5 text-yellow-400 mb-2" />
                <div className="text-2xl font-bold">{event._count.uploads}</div>
                <div className="text-xs text-gray-500">Photos Taken</div>
              </div>
              <div className="bg-black p-4 rounded-xl">
                <Users className="w-5 h-5 text-blue-400 mb-2" />
                <div className="text-2xl font-bold">{event.uniqueParticipants}</div>
                <div className="text-xs text-gray-500">Participants</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Storage Used</span>
                    <span>{event._count.uploads} / {event.maxUploads}</span>
                </div>
                <div className="h-2 bg-black rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" 
                        style={{ width: `${Math.min((event._count.uploads / event.maxUploads) * 100, 100)}%` }}
                    />
                </div>
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10">
            <h3 className="text-gray-400 text-sm font-bold uppercase mb-4">Google Drive</h3>
            {event.driveConnected ? (
                <div className="flex items-center gap-3 text-green-400 bg-green-900/20 p-4 rounded-xl border border-green-500/20">
                    <CheckCircle className="w-5 h-5" />
                    <div>
                        <div className="font-bold">Connected</div>
                        <div className="text-xs text-gray-400">Uploads sync automatically</div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-gray-400">Connect your Google Drive to automatically save all photos captured at your event.</p>
                    <button className="w-full py-3 bg-white text-black font-bold rounded flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                        <HardDrive className="w-4 h-4" /> Connect Drive
                    </button>
                </div>
            )}
          </div>
          
          <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
            <h3 className="text-gray-400 text-sm font-bold uppercase mb-4">Event QR Code</h3>
            <div className="bg-white p-4 rounded-xl mb-4">
                <QRCodeSVG value={cameraUrl} size={180} />
            </div>
            <p className="text-xs text-gray-500 max-w-[200px]">Scan to access the camera app directly</p>
            <div className="mt-4 flex gap-2 w-full">
                <button className="flex-1 py-2 bg-white/10 rounded text-sm font-bold hover:bg-white/20 transition-colors">Print</button>
                <button className="flex-1 py-2 bg-white/10 rounded text-sm font-bold hover:bg-white/20 transition-colors">Copy Link</button>
            </div>
          </div>
        </div>

        {/* Branding Column */}
        <div className="md:col-span-2 bg-zinc-900 p-8 rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-yellow-400" /> Customize Camera App
          </h2>
          
          <form action={updateEventBranding.bind(null, token)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Event Title</label>
                    <input 
                        name="title" 
                        defaultValue={branding.title || event.name}
                        className="w-full bg-black border border-white/20 rounded p-3 focus:border-yellow-400 outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Subtitle / Tagline</label>
                    <input 
                        name="subtitle" 
                        defaultValue={branding.subtitle || "Capture the moment!"}
                        className="w-full bg-black border border-white/20 rounded p-3 focus:border-yellow-400 outline-none"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm text-gray-400">Accent Color</label>
                <div className="flex gap-4">
                    {['#facc15', '#ef4444', '#3b82f6', '#10b981', '#a855f7'].map((color) => (
                        <label key={color} className="cursor-pointer">
                            <input 
                                type="radio" 
                                name="primaryColor" 
                                value={color} 
                                defaultChecked={branding.primaryColor === color}
                                className="peer sr-only"
                            />
                            <div className="w-10 h-10 rounded-full bg-current border-2 border-transparent peer-checked:border-white peer-checked:scale-110 transition-all" style={{ backgroundColor: color }} />
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-black rounded-xl border border-white/10">
                <input 
                    type="checkbox" 
                    name="showVintage" 
                    id="vintage"
                    defaultChecked={branding.showVintage}
                    className="w-5 h-5 rounded border-gray-600 text-yellow-400 focus:ring-yellow-400"
                />
                <label htmlFor="vintage" className="flex-1 cursor-pointer">
                    <div className="font-bold">Enable Vintage Filter</div>
                    <div className="text-xs text-gray-500">Apply a disposable camera look to all photos</div>
                </label>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
                <button type="submit" className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors">
                    Save Changes
                </button>
            </div>
          </form>

          {/* Preview Area (Mock) */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-sm text-gray-400 font-bold uppercase mb-4">Live Preview</h3>
            <div className="aspect-video bg-black rounded-xl border border-white/20 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop)' }} />
                <div className="relative z-10 text-center">
                    <h1 className="text-3xl font-bold mb-2">{branding.title || event.name}</h1>
                    <p className="text-lg opacity-80">{branding.subtitle || "Capture the moment!"}</p>
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                    <button className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-full shadow-lg transform group-hover:scale-105 transition-transform">
                        Start Capturing
                    </button>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
