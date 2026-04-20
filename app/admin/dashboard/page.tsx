'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  getProducts, addProduct, updateProduct, deleteProduct, formatPrice,
} from '@/lib/defaultProducts';
import { Product } from '@/lib/types';
import {
  Plus, Pencil, Trash2, X, Save, LogOut, Package, Settings,
  Phone, Lock, LayoutDashboard, Upload, ImageIcon, Trash, Loader2,
  ShoppingBag, ChevronDown, ChevronUp, Truck, Mail,
} from 'lucide-react';
import Image from 'next/image';

const CATEGORIES = ['Resin Art', 'Keychains', 'Jewelry', 'Necklace', 'Bracelet', 'Earrings', 'Rings', 'Kids', 'Gifts'];

const EMPTY_FORM: Omit<Product, 'id'> = { name: '', category: 'Keychains', price: 0, description: '', image: '', max_quantity: undefined };

// ── Image compression ─────────────────────────────────────────────────────────
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 800;
        let { width, height } = img;
        if (width > height) { if (width > MAX) { height = Math.round((height * MAX) / width); width = MAX; } }
        else { if (height > MAX) { width = Math.round((width * MAX) / height); height = MAX; } }
        canvas.width = width; canvas.height = height;
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

// ── Image Upload Zone ─────────────────────────────────────────────────────────
function ImageUploadZone({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setLoading(true);
    try { const c = await compressImage(file); onChange(c); } finally { setLoading(false); }
  }, [onChange]);
  const onDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }, [processFile]);
  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) processFile(f); e.target.value = ''; }, [processFile]);
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-gray-700">Product Image</label>
      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border-2" style={{ borderColor: 'rgba(196,120,138,0.3)' }}>
          <div className="relative w-full h-52"><Image src={value} alt="Product preview" fill className="object-cover" /></div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button type="button" onClick={() => inputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold bg-white/20 hover:bg-white/30 backdrop-blur transition"><Upload size={14} /> Change</button>
            <button type="button" onClick={() => onChange('')} className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold bg-red-500/70 hover:bg-red-500/90 backdrop-blur transition"><Trash size={14} /> Remove</button>
          </div>
        </div>
      ) : (
        <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop} onClick={() => inputRef.current?.click()}
          className="relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center gap-3 py-10 px-4 text-center"
          style={{ borderColor: dragging ? '#C4788A' : 'rgba(196,120,138,0.35)', backgroundColor: dragging ? 'rgba(196,120,138,0.07)' : 'rgba(249,238,243,0.4)' }}>
          {loading ? (
            <div className="flex flex-col items-center gap-2"><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#C4788A', borderTopColor: 'transparent' }} /><p className="text-sm text-gray-500">Uploading…</p></div>
          ) : (
            <><div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(196,120,138,0.12)' }}><ImageIcon size={26} style={{ color: '#C4788A' }} /></div>
              <div><p className="text-sm font-semibold" style={{ color: '#8B4E6B' }}>Drag &amp; drop your photo here</p><p className="text-xs text-gray-400 mt-1">or <span className="underline font-medium" style={{ color: '#C4788A' }}>click to browse</span></p></div>
              <p className="text-xs text-gray-400">📱 On phone: choose from Gallery or Camera<br />💻 On PC: pick any image file</p></>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" capture={undefined} className="hidden" onChange={onFileChange} />
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  // Settings
  const [whatsapp, setWhatsapp] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState('0');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  // Orders
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // ── Secure API helper (attaches admin token to every request) ────────────────
  const adminFetch = useCallback((url: string, options: RequestInit = {}) => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('adminToken') ?? '' : '';
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers ?? {}),
      },
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('isAdmin') !== 'true') { router.push('/admin/login'); return; }
    setLoadingProducts(true);
    getProducts().then((d) => { setProducts(d); setLoadingProducts(false); });
    // Load all settings via secure API route
    adminFetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        setWhatsapp(data.whatsapp_number ?? '');
        setAdminEmail(data.admin_email ?? '');
        setDeliveryCharge(data.delivery_charge ?? '0');
      })
      .catch(() => {/* settings load failed silently */});
  }, [router, adminFetch]);

  useEffect(() => {
    if (activeTab === 'orders') {
      setLoadingOrders(true);
      adminFetch('/api/admin/orders')
        .then((r) => r.json())
        .then((d) => { setOrders(Array.isArray(d) ? d : []); setLoadingOrders(false); })
        .catch(() => setLoadingOrders(false));
    }
  }, [activeTab, adminFetch]);

  const handleLogout = () => { sessionStorage.removeItem('isAdmin'); sessionStorage.removeItem('adminToken'); router.push('/admin/login'); };
  const openAddModal = () => { setEditingProduct(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEditModal = (p: Product) => { setEditingProduct(p); setForm({ name: p.name, category: p.category, price: p.price, description: p.description, image: p.image, max_quantity: p.max_quantity }); setShowModal(true); };

  const handleSaveProduct = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editingProduct) {
        const ok = await updateProduct(editingProduct.id, form);
        if (ok) setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? { ...editingProduct, ...form } : p));
      } else {
        const created = await addProduct(form);
        if (created) setProducts((prev) => [...prev, created]);
      }
      setShowModal(false);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const ok = await deleteProduct(id);
    if (ok) setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveSettings = async () => {
    setPasswordError('');
    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) { setPasswordError('Password must be at least 6 characters.'); return; }
      if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match.'); return; }
    }
    setSavingSettings(true);
    try {
      const updates: Record<string, string> = {
        whatsapp_number: whatsapp,
        admin_email: adminEmail,
        delivery_charge: (parseFloat(deliveryCharge) || 0).toString(),
      };
      if (newPassword) updates.admin_password = newPassword;
      await adminFetch('/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify(updates),
      });
      if (newPassword) { setNewPassword(''); setConfirmPassword(''); }
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
    } finally { setSavingSettings(false); }
  };

  const handleOrderStatus = async (id: string, status: string) => {
    await adminFetch('/api/admin/orders', {
      method: 'PATCH',
      body: JSON.stringify({ id, status }),
    });
    setOrders((prev) => prev.map((o) => (o.id as string) === id ? { ...o, status } : o));
  };

  const SidebarBtn = ({ tab, icon, label, badge }: { tab: 'products' | 'orders' | 'settings'; icon: React.ReactNode; label: string; badge?: number }) => (
    <button onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full ${activeTab === tab ? 'text-white' : 'text-white/60 hover:text-white/90 hover:bg-white/5'}`}
      style={activeTab === tab ? { backgroundColor: '#C4788A' } : {}}>
      {icon} {label}
      {badge != null && badge > 0 && <span className="ml-auto text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">{badge}</span>}
    </button>
  );

  const newOrdersCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F9EEF3' }}>
      {/* Sidebar */}
      <aside className="w-56 min-h-screen flex flex-col shadow-xl" style={{ backgroundColor: '#1A1A2E' }}>
        <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif' }}>Eclat Perlé ✨</h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Admin Panel</p>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          <SidebarBtn tab="products" icon={<Package size={16} />} label="Products" />
          <SidebarBtn tab="orders" icon={<ShoppingBag size={16} />} label="Orders" badge={newOrdersCount} />
          <SidebarBtn tab="settings" icon={<Settings size={16} />} label="Settings" />
        </nav>
        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <button onClick={() => router.push('/')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white transition-colors w-full mb-1"><LayoutDashboard size={14} /> View Website</button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-red-300 transition-colors w-full"><LogOut size={14} /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">

        {/* ── Products Tab ── */}
        {activeTab === 'products' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}>Products</h2>
                <p className="text-gray-500 text-sm mt-1">Manage your product catalog ({products.length} items)</p>
              </div>
              <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold text-sm transition-all hover:scale-105 shadow-md" style={{ backgroundColor: '#C4788A' }}>
                <Plus size={16} /> Add Product
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border" style={{ borderColor: 'rgba(196,120,138,0.15)' }}>
              {loadingProducts ? (
                <div className="py-20 flex items-center justify-center gap-3" style={{ color: '#C4788A' }}><Loader2 size={22} className="animate-spin" /><span className="text-sm text-gray-400">Loading products…</span></div>
              ) : (
                <table className="w-full">
                  <thead><tr style={{ backgroundColor: '#F9EEF3' }}>
                    {['Product', 'Category', 'Price', 'Max Qty', 'Actions'].map((h, i) => (
                      <th key={h} className={`${i === 4 ? 'text-right' : 'text-left'} px-5 py-3.5 text-xs font-semibold uppercase tracking-wider`} style={{ color: '#8B4E6B' }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-t transition-colors hover:bg-pink-50/30" style={{ borderColor: 'rgba(196,120,138,0.08)' }}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                              {product.image ? <div className="relative w-10 h-10"><Image src={product.image} alt={product.name} fill className="object-cover" /></div>
                                : <div className="w-full h-full flex items-center justify-center text-lg" style={{ background: 'linear-gradient(135deg,#F9EEF3,rgba(196,120,138,0.2))' }}>
                                  {product.category === 'Jewelry' || product.category === 'Necklace' || product.category === 'Bracelet' || product.category === 'Earrings' || product.category === 'Rings' ? '💎' : product.category === 'Keychains' ? '🔑' : product.category === 'Resin Art' ? '🎨' : product.category === 'Kids' ? '🌈' : product.category === 'Gifts' ? '🎁' : '✨'}
                                </div>}
                            </div>
                            <div><p className="font-semibold text-sm" style={{ color: '#1A1A2E' }}>{product.name}</p><p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{product.description}</p></div>
                          </div>
                        </td>
                        <td className="px-5 py-4"><span className="text-xs font-semibold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: '#C4788A' }}>{product.category}</span></td>
                        <td className="px-5 py-4"><span className="text-sm font-bold" style={{ color: '#8B4E6B' }}>{formatPrice(product.price)}</span></td>
                        <td className="px-5 py-4"><span className="text-sm text-gray-500">{product.max_quantity ?? '—'}</span></td>
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
              )}
              {!loadingProducts && products.length === 0 && (
                <div className="py-16 text-center text-gray-400"><div className="text-4xl mb-3">📦</div><p>No products yet. Add your first product!</p></div>
              )}
            </div>
          </div>
        )}

        {/* ── Orders Tab ── */}
        {activeTab === 'orders' && (
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}>Orders</h2>
            {loadingOrders ? (
              <div className="flex items-center justify-center gap-3 py-20" style={{ color: '#C4788A' }}><Loader2 size={22} className="animate-spin" /><span className="text-sm text-gray-400">Loading orders…</span></div>
            ) : orders.length === 0 ? (
              <div className="py-20 text-center text-gray-400"><div className="text-4xl mb-3">🛍️</div><p>No orders yet.</p></div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((order) => {
                  const id = order.id as string;
                  const isExpanded = expandedOrder === id;
                  const items = order.items as { name: string; quantity: number; price: number }[];
                  const statusColor = order.status === 'pending' ? '#D4A853' : order.status === 'confirmed' ? '#3D9B8C' : order.status === 'delivered' ? '#8B4E6B' : '#999';
                  return (
                    <div key={id} className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: 'rgba(196,120,138,0.15)' }}>
                      <div className="flex items-center justify-between p-5 cursor-pointer" onClick={() => setExpandedOrder(isExpanded ? null : id)}>
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-semibold text-sm" style={{ color: '#1A1A2E' }}>{order.customer_name as string}</p>
                            <p className="text-xs text-gray-400">{order.customer_phone as string} · {new Date(order.created_at as string).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold" style={{ color: '#8B4E6B' }}>${(order.total as number).toFixed(2)}</span>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: statusColor }}>{order.status as string}</span>
                          {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="border-t px-5 pb-5 pt-4 flex flex-col gap-4" style={{ borderColor: 'rgba(196,120,138,0.1)' }}>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><span className="text-gray-400 text-xs uppercase">Address</span><p className="font-medium text-gray-700">{order.customer_address as string}{order.customer_city ? `, ${order.customer_city as string}` : ''}</p></div>
                            {order.customer_notes ? <div><span className="text-gray-400 text-xs uppercase">Notes</span><p className="font-medium text-gray-700">{String(order.customer_notes)}</p></div> : null}
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3">
                            {items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm py-1"><span className="text-gray-600">{item.name} <span className="text-gray-400">×{item.quantity}</span></span><span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span></div>
                            ))}
                            <div className="border-t mt-2 pt-2 flex flex-col gap-1" style={{ borderColor: '#e5e7eb' }}>
                              <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>${(order.subtotal as number).toFixed(2)}</span></div>
                              <div className="flex justify-between text-sm text-gray-500"><span>Delivery</span><span>${(order.delivery_charge as number).toFixed(2)}</span></div>
                              <div className="flex justify-between text-sm font-bold" style={{ color: '#8B4E6B' }}><span>Total</span><span>${(order.total as number).toFixed(2)}</span></div>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {['pending', 'confirmed', 'delivered', 'cancelled'].map((s) => (
                              <button key={s} onClick={() => handleOrderStatus(id, s)}
                                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all border"
                                style={{ backgroundColor: order.status === s ? statusColor : 'transparent', color: order.status === s ? 'white' : '#666', borderColor: order.status === s ? statusColor : '#ddd' }}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Settings Tab ── */}
        {activeTab === 'settings' && (
          <div className="p-8 max-w-xl">
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}>Settings</h2>

            <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6" style={{ borderColor: 'rgba(196,120,138,0.15)' }}>
              <h3 className="font-semibold text-base mb-4 flex items-center gap-2" style={{ color: '#1A1A2E' }}><Phone size={16} style={{ color: '#C4788A' }} /> WhatsApp Contact</h3>
              <label className="block text-sm font-medium mb-1.5 text-gray-600">WhatsApp Number (without +)</label>
              <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="96170000000"
                className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none" style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }} />
              <p className="text-xs text-gray-400 mt-1.5">Example: 96170000000 (Lebanon: 961 + number)</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6" style={{ borderColor: 'rgba(196,120,138,0.15)' }}>
              <h3 className="font-semibold text-base mb-4 flex items-center gap-2" style={{ color: '#1A1A2E' }}><Mail size={16} style={{ color: '#C4788A' }} /> Order Notification Email</h3>
              <label className="block text-sm font-medium mb-1.5 text-gray-600">Email address to receive new orders</label>
              <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none" style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }} />
              <p className="text-xs text-gray-400 mt-1.5">You will receive a copy of every order placed on the website. Requires Resend API key to be active.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6" style={{ borderColor: 'rgba(196,120,138,0.15)' }}>
              <h3 className="font-semibold text-base mb-4 flex items-center gap-2" style={{ color: '#1A1A2E' }}><Truck size={16} style={{ color: '#C4788A' }} /> Delivery Charge</h3>
              <label className="block text-sm font-medium mb-1.5 text-gray-600">Delivery Charge (USD $)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">$</span>
                <input type="number" value={deliveryCharge} onChange={(e) => setDeliveryCharge(e.target.value)} placeholder="0.00" min="0" step="0.50"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border text-sm focus:outline-none" style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }} />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Set to 0 for free delivery. This will appear on the customer checkout.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6" style={{ borderColor: 'rgba(196,120,138,0.15)' }}>
              <h3 className="font-semibold text-base mb-4 flex items-center gap-2" style={{ color: '#1A1A2E' }}><Lock size={16} style={{ color: '#C4788A' }} /> Change Password</h3>
              <div className="flex flex-col gap-3">
                <div><label className="block text-sm font-medium mb-1.5 text-gray-600">New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Leave blank to keep current"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none" style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }} /></div>
                <div><label className="block text-sm font-medium mb-1.5 text-gray-600">Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password"
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none" style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }} /></div>
              </div>
              {passwordError && <p className="text-xs text-red-500 mt-2">{passwordError}</p>}
            </div>

            <button onClick={handleSaveSettings} disabled={savingSettings}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm transition-all hover:scale-105 shadow-md disabled:opacity-60"
              style={{ backgroundColor: settingsSaved ? '#3D9B8C' : '#C4788A' }}>
              {savingSettings ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {savingSettings ? 'Saving…' : settingsSaved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(196,120,138,0.15)' }}>
              <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#1A1A2E' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <ImageUploadZone value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
              <div><label className="block text-sm font-medium mb-1.5 text-gray-700">Product Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Pink Resin Heart Keychain"
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none" style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5 text-gray-700">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none bg-white" style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }}>
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select></div>
              <div><label className="block text-sm font-medium mb-1.5 text-gray-700">Price (USD $) *</label>
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">$</span>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="0.00" min="0" step="0.01"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border text-sm focus:outline-none" style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }} /></div></div>
              <div><label className="block text-sm font-medium mb-1.5 text-gray-700">Max Quantity <span className="text-gray-400 font-normal">(optional — leave empty for unlimited)</span></label>
                <input type="number" value={form.max_quantity ?? ''} onChange={(e) => setForm({ ...form, max_quantity: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="e.g. 10" min="1"
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none" style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }} /></div>
              <div><label className="block text-sm font-medium mb-1.5 text-gray-700">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the product..." rows={3}
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none resize-none" style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#1A1A2E' }} /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border font-semibold text-sm hover:bg-gray-50 transition" style={{ borderColor: 'rgba(196,120,138,0.3)', color: '#8B4E6B' }}>Cancel</button>
                <button onClick={handleSaveProduct} disabled={!form.name.trim() || saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#C4788A' }}>
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {saving ? 'Saving…' : editingProduct ? 'Update' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
