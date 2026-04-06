'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  getProducts,
  saveProducts,
  formatPrice,
  getWhatsAppNumber,
  saveWhatsAppNumber,
  getAdminPassword,
  saveAdminPassword,
} from '@/lib/defaultProducts';
import { Product } from '@/lib/types';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  LogOut,
  Package,
  Settings,
  Phone,
  Lock,
  LayoutDashboard,
  Upload,
  ImageIcon,
  Trash,
} from 'lucide-react';
import Image from 'next/image';

const CATEGORIES = ['Resin Art', 'Keychains', 'Jewelry', 'Kids', 'Gifts', 'Summer'];

const EMPTY_FORM: Omit<Product, 'id'> = {
  name: '',
  category: 'Keychains',
  price: 0,
  description: '',
  image: '',
};

// Compress and resize image using canvas → base64
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 800;
        let { width, height } = img;
        if (width > height) {
          if (width > MAX) { height = Math.round((height * MAX) / width); width = MAX; }
        } else {
          if (height > MAX) { width = Math.round((width * MAX) / height); height = MAX; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas not supported'));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Image Upload Zone ────────────────────────────────────────────────────────
function ImageUploadZone({
  value,
  onChange,
}: {
  value: string;
  onChange: (base64: string) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return;
      setLoading(true);
      try {
        const compressed = await compressImage(file);
        onChange(compressed);
      } finally {
        setLoading(false);
      }
    },
    [onChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = '';
    },
    [processFile]
  );

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-gray-700">
        Product Image
      </label>

      {value ? (
        /* ── Preview ── */
        <div className="relative group rounded-2xl overflow-hidden border-2" style={{ borderColor: 'rgba(196,120,138,0.3)' }}>
          <div className="relative w-full h-52">
            <Image src={value} alt="Product preview" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold bg-white/20 hover:bg-white/30 backdrop-blur transition"
            >
              <Upload size={14} /> Change
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold bg-red-500/70 hover:bg-red-500/90 backdrop-blur transition"
            >
              <Trash size={14} /> Remove
            </button>
          </div>
        </div>
      ) : (
        /* ── Drop Zone ── */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className="relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-3 py-10 px-4 text-center"
          style={{
            borderColor: dragging ? '#C4788A' : 'rgba(196,120,138,0.35)',
            backgroundColor: dragging ? 'rgba(196,120,138,0.07)' : 'rgba(249,238,243,0.4)',
          }}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: '#C4788A', borderTopColor: 'transparent' }}
              />
              <p className="text-sm text-gray-500">Uploading…</p>
            </div>
          ) : (
            <>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(196,120,138,0.12)' }}
              >
                <ImageIcon size={26} style={{ color: '#C4788A' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#8B4E6B' }}>
                  Drag &amp; drop your photo here
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  or <span className="underline font-medium" style={{ color: '#C4788A' }}>click to browse</span>
                </p>
              </div>
              <p className="text-xs text-gray-400">
                📱 On phone: choose from Gallery or Camera
                <br />
                💻 On PC: pick any image file
              </p>
            </>
          )}
        </div>
      )}

      {/* Hidden file input — accepts images, opens gallery/camera on mobile */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture={undefined}
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY_FORM);
  const [whatsapp, setWhatsapp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAdmin = sessionStorage.getItem('isAdmin');
      if (isAdmin !== 'true') { router.push('/admin/login'); return; }
      setProducts(getProducts());
      setWhatsapp(getWhatsAppNumber());
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    router.push('/admin/login');
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({ name: product.name, category: product.category, price: product.price, description: product.description, image: product.image });
    setShowModal(true);
  };

  const handleSaveProduct = () => {
    if (!form.name.trim()) return;
    let updated: Product[];
    if (editingProduct) {
      updated = products.map((p) => p.id === editingProduct.id ? { ...editingProduct, ...form } : p);
    } else {
      updated = [...products, { ...form, id: Date.now().toString() }];
    }
    saveProducts(updated);
    setProducts(updated);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this product?')) return;
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
    setProducts(updated);
  };

  const handleSaveSettings = () => {
    setPasswordError('');
    saveWhatsAppNumber(whatsapp);
    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) { setPasswordError('Password must be at least 6 characters.'); return; }
      if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match.'); return; }
      saveAdminPassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
    }
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  // ── Sidebar button helper
  const SidebarBtn = ({ tab, icon, label }: { tab: 'products' | 'settings'; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab ? 'text-white' : 'text-white/60 hover:text-white/90 hover:bg-white/5'}`}
      style={activeTab === tab ? { backgroundColor: '#C4788A' } : {}}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F9EEF3' }}>
      {/* ── Sidebar ── */}
      <aside className="w-56 min-h-screen flex flex-col shadow-xl" style={{ backgroundColor: '#1A1A2E' }}>
        <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}>
            Eclat Perlé ✨
          </h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Admin Panel</p>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          <SidebarBtn tab="products" icon={<Package size={16} />} label="Products" />
          <SidebarBtn tab="settings" icon={<Settings size={16} />} label="Settings" />
        </nav>
        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <button onClick={() => router.push('/')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white transition-colors w-full mb-1">
            <LayoutDashboard size={14} /> View Website
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-red-300 transition-colors w-full">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}>
                  Products
                </h2>
                <p className="text-gray-500 text-sm mt-1">Manage your product catalog ({products.length} items)</p>
              </div>
              <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold text-sm transition-all hover:scale-105 shadow-md" style={{ backgroundColor: '#C4788A' }}>
                <Plus size={16} /> Add Product
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border" style={{ borderColor: 'rgba(196,120,138,0.15)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#F9EEF3' }}>
                    {['Product', 'Category', 'Price', 'Actions'].map((h, i) => (
                      <th key={h} className={`${i === 3 ? 'text-right' : 'text-left'} px-5 py-3.5 text-xs font-semibold uppercase tracking-wider`} style={{ color: '#8B4E6B' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t transition-colors hover:bg-pink-50/30" style={{ borderColor: 'rgba(196,120,138,0.08)' }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                            {product.image ? (
                              <div className="relative w-10 h-10">
                                <Image src={product.image} alt={product.name} fill className="object-cover" />
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg" style={{ background: 'linear-gradient(135deg,#F9EEF3,rgba(196,120,138,0.2))' }}>
                                {product.category === 'Jewelry' ? '💎' : product.category === 'Keychains' ? '🔑' : product.category === 'Resin Art' ? '🎨' : product.category === 'Kids' ? '🌈' : product.category === 'Gifts' ? '🎁' : '✨'}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: '#1A1A2E' }}>{product.name}</p>
                            <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: '#C4788A' }}>{product.category}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold" style={{ color: '#8B4E6B' }}>{formatPrice(product.price)}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditModal(product)} className="p-2 rounded-xl transition-colors hover:bg-blue-50 text-blue-500"><Pencil size={15} /></button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 rounded-xl transition-colors hover:bg-red-50 text-red-400"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="py-16 text-center text-gray-400">
                  <div className="text-4xl mb-3">📦</div>
                  <p>No products yet. Add your first product!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="p-8 max-w-xl">
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}>Settings</h2>

            <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6" style={{ borderColor: 'rgba(196,120,138,0.15)' }}>
              <h3 className="font-semibold text-base mb-4 flex items-center gap-2" style={{ color: '#1A1A2E' }}>
                <Phone size={16} style={{ color: '#C4788A' }} /> WhatsApp Contact
              </h3>
              <label className="block text-sm font-medium mb-1.5 text-gray-600">WhatsApp Number (without +)</label>
              <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="96170000000"
                className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none" style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }} />
              <p className="text-xs text-gray-400 mt-1.5">Example: 96170000000 (Lebanon: 961 + number)</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6" style={{ borderColor: 'rgba(196,120,138,0.15)' }}>
              <h3 className="font-semibold text-base mb-4 flex items-center gap-2" style={{ color: '#1A1A2E' }}>
                <Lock size={16} style={{ color: '#C4788A' }} /> Change Password
              </h3>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-600">New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Leave blank to keep current"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none" style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-600">Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none" style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }} />
                </div>
              </div>
              {passwordError && <p className="text-xs text-red-500 mt-2">{passwordError}</p>}
            </div>

            <button onClick={handleSaveSettings} className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm transition-all hover:scale-105 shadow-md"
              style={{ backgroundColor: settingsSaved ? '#3D9B8C' : '#C4788A' }}>
              <Save size={16} /> {settingsSaved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        )}
      </main>

      {/* ── Add/Edit Product Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(196,120,138,0.15)' }}>
              <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors"><X size={18} /></button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              {/* Image Upload */}
              <ImageUploadZone value={form.image} onChange={(v) => setForm({ ...form, image: v })} />

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Product Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Pink Resin Heart Keychain"
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none" style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }} />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none bg-white" style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }}>
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Price (USD $) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">$</span>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    placeholder="0.00" min="0" step="0.01"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border text-sm focus:outline-none" style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the product..." rows={3}
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none resize-none" style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }} />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border font-semibold text-sm hover:bg-gray-50 transition"
                  style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#8B4E6B' }}>Cancel</button>
                <button onClick={handleSaveProduct} disabled={!form.name.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#C4788A' }}>
                  <Save size={15} /> {editingProduct ? 'Update' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
