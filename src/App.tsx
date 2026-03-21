import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, TrendingUp, ShieldCheck, Zap, Info, Phone, Menu, X, Calculator, Send, Landmark, CheckCircle2, ChevronLeft, Upload, User, LogOut, History, LogIn, Smartphone, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Currency, BankAccount, Service } from './types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const IconMap: Record<string, React.ReactNode> = {
  'Zap': <Zap className="w-4 h-4" />,
  'ShieldCheck': <ShieldCheck className="w-4 h-4" />,
  'Send': <Send className="w-4 h-4" />,
  'Smartphone': <Smartphone className="w-4 h-4" />,
  'CreditCard': <CreditCard className="w-4 h-4" />,
  'Landmark': <Landmark className="w-4 h-4" />,
};

interface SiteSettings {
  site_name: string;
  support_phone: string;
  support_email: string;
  whatsapp_link: string;
  is_maintenance: boolean;
}

interface TransferHistory {
  id: number;
  amount_sent: number;
  currency_code: string;
  amount_to_receive_sdg: number;
  status: string;
  created_at: string;
  bankak_name: string;
}

const getCountryFlag = (country: string) => {
  if (country === 'السعودية') return '🇸🇦';
  if (country === 'أوغندا') return '🇺🇬';
  if (country === 'كينيا') return '🇰🇪';
  if (country === 'إثيوبيا') return '🇪🇹';
  if (country === 'رواندا') return '🇷🇼';
  if (country === 'قطر') return '🇶🇦';
  if (country === 'مصر') return '🇪🇬';
  if (country === 'تركيا') return '🇹🇷';
  if (country === 'السودان') return '🇸🇩';
  return '🌍';
};

// --- Components ---

const Header = ({ onTransferClick, onAuthClick, user, onLogout, settings }: { onTransferClick: () => void, onAuthClick: () => void, user: any, onLogout: () => void, settings: SiteSettings | null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="bg-emerald-600 p-2 rounded-lg">
              <ArrowRightLeft className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-emerald-800">{settings?.site_name || 'حول يا زول'}</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#converter" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">الحاسبة</a>
            <a href="#live-chart" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">الشارت اللحظي</a>
            <a href="#rates" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">الأسعار</a>
            <a href="#global-catalog" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">العملات وطرق الدفع</a>
            
            {user ? (
              <div className="flex items-center gap-4">
                <button onClick={onAuthClick} className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium">
                  <User className="w-5 h-5" />
                  <span>{user.username}</span>
                </button>
                <button onClick={onLogout} className="text-red-500 hover:text-red-700">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button onClick={onAuthClick} className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium">
                <LogIn className="w-5 h-5" />
                <span>تسجيل الدخول</span>
              </button>
            )}

            <button 
              onClick={onTransferClick}
              className="bg-emerald-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
            >
              حول الآن
            </button>
          </nav>

          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              <a href="#converter" className="text-slate-600 py-2" onClick={() => setIsMenuOpen(false)}>الحاسبة</a>
              <a href="#live-chart" className="text-slate-600 py-2" onClick={() => setIsMenuOpen(false)}>الشارت اللحظي</a>
              <a href="#rates" className="text-slate-600 py-2" onClick={() => setIsMenuOpen(false)}>الأسعار</a>
              <a href="#global-catalog" className="text-slate-600 py-2" onClick={() => setIsMenuOpen(false)}>العملات وطرق الدفع</a>
              {user ? (
                 <button onClick={() => { onAuthClick(); setIsMenuOpen(false); }} className="text-slate-600 py-2 text-right">حسابي ({user.username})</button>
              ) : (
                <button onClick={() => { onAuthClick(); setIsMenuOpen(false); }} className="text-slate-600 py-2 text-right">تسجيل الدخول</button>
              )}
              <button 
                onClick={() => { onTransferClick(); setIsMenuOpen(false); }}
                className="bg-emerald-600 text-white px-5 py-3 rounded-xl text-center font-bold"
              >
                حول الآن
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const AuthModal = ({ isOpen, onClose, onLoginSuccess }: { isOpen: boolean, onClose: () => void, onLoginSuccess: (user: any, token: string) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const endpoint = isLogin ? '/login/' : '/register/';
    const body = isLogin ? { username, password } : { username, password, email };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.non_field_errors?.[0] || 'حدث خطأ ما');
      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</h2>
        {error && <p className="text-red-500 mb-4 text-center text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="اسم المستخدم" className="w-full p-3 border rounded-xl" value={username} onChange={e => setUsername(e.target.value)} required />
          {!isLogin && <input type="email" placeholder="البريد الإلكتروني" className="w-full p-3 border rounded-xl" value={email} onChange={e => setEmail(e.target.value)} />}
          <input type="password" placeholder="كلمة المرور" className="w-full p-3 border rounded-xl" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white p-3 rounded-xl font-bold">
            {loading ? 'جاري التحميل...' : (isLogin ? 'دخول' : 'تسجيل')}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-sm text-slate-500 hover:text-emerald-600">
          {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ دخول'}
        </button>
      </motion.div>
    </div>
  );
};

const HistoryModal = ({ isOpen, onClose, token }: { isOpen: boolean, onClose: () => void, token: string }) => {
  const [history, setHistory] = useState<TransferHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_URL}/transfers/`, {
        headers: { 'Authorization': `Token ${token}` }
      })
      .then(res => res.json())
      .then(data => setHistory(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-2xl bg-white rounded-[2rem] p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2"><History className="text-emerald-600" />سجل التحويلات</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
        </div>
        {loading ? (
          <p className="text-center py-10">جاري التحميل...</p>
        ) : history.length === 0 ? (
          <p className="text-center py-10 text-slate-500">لا يوجد تحويلات سابقة</p>
        ) : (
          <div className="space-y-4 text-right">
            {history.map(item => (
              <div key={item.id} className="p-4 border rounded-2xl flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                  item.status === 'pending' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.status === 'approved' ? 'مكتمل' : item.status === 'pending' ? 'قيد الانتظار' : 'مرفوض'}
                </div>
                <div>
                  <div className="font-bold">{item.amount_sent} {item.currency_code}</div>
                  <div className="text-xs text-slate-400">{new Date(item.created_at).toLocaleString('ar-EG')}</div>
                  <div className="text-sm text-slate-600">إلى: {item.bankak_name}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

const TransferModal = ({ isOpen, onClose, bankAccounts, settings, token }: { isOpen: boolean, onClose: () => void, bankAccounts: BankAccount[], settings: SiteSettings | null, token: string | null }) => {
  const [step, setStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    bankakName: '',
    bankakNumber: '',
    senderName: '',
    receipt: null as File | null
  });

  if (!isOpen) return null;

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = new FormData();
      if (selectedAccount) data.append('selected_account', selectedAccount.id.toString());
      data.append('amount_sent', formData.amount);
      data.append('bankak_name', formData.bankakName);
      data.append('bankak_number', formData.bankakNumber);
      if (formData.senderName) data.append('sender_name', formData.senderName);
      if (formData.receipt) data.append('receipt', formData.receipt);

      const headers: any = {};
      if (token) headers['Authorization'] = `Token ${token}`;

      const response = await fetch(`${API_URL}/transfers/`, {
        method: 'POST',
        headers: headers,
        body: data,
      });

      if (!response.ok) throw new Error('فشل إرسال الطلب، الرجاء المحاولة مرة أخرى');
      setStep(3);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900">اختر بلد وطريقة التحويل</h3>
              <p className="text-slate-500">اختر الطريقة الأنسب لك لإرسال الأموال</p>
            </div>
            <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-2">
              {bankAccounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => { setSelectedAccount(acc); handleNext(); }}
                  className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group text-right"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                      {getCountryFlag(acc.country)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{acc.country}</div>
                      <div className="text-sm text-slate-600 flex items-center gap-1">
                        {acc.method_type === 'mobile_money' ? <Smartphone className="w-3 h-3" /> : <Landmark className="w-3 h-3" />}
                        {acc.provider_name}
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="text-slate-300 group-hover:text-emerald-500" />
                </button>
              ))}
              {bankAccounts.length === 0 && <p className="text-center text-slate-500">جاري تحميل الخيارات...</p>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-right">
              <h4 className="font-bold text-emerald-800 mb-4 flex items-center gap-2 justify-end">
                {selectedAccount?.method_type === 'mobile_money' ? <Smartphone className="w-5 h-5" /> : <Landmark className="w-5 h-5" />}
                بيانات {selectedAccount?.provider_name} في {selectedAccount?.country}
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-emerald-100 pb-2"><span className="font-bold text-emerald-900">{selectedAccount?.provider_name}</span><span className="text-emerald-600">:المزود</span></div>
                <div className="flex justify-between border-b border-emerald-100 pb-2"><span className="font-bold text-emerald-900">{selectedAccount?.account_name}</span><span className="text-emerald-600">:الاسم</span></div>
                <div className="flex justify-between border-b border-emerald-100 pb-2"><span className="font-bold text-emerald-900 font-mono tracking-wider">{selectedAccount?.account_number}</span><span className="text-emerald-600">:الرقم</span></div>
                {selectedAccount?.additional_info && (
                  <div className="p-2 bg-white/50 rounded-lg text-emerald-700 mt-2 text-xs">
                    <strong>ملاحظات:</strong> {selectedAccount.additional_info}
                  </div>
                )}
              </div>
              <p className="mt-4 text-xs text-emerald-700/70 text-center">* يرجى التحويل لهذا الحساب ثم إكمال البيانات أدناه</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-right">بيانات استلام "بنكك" في السودان</h4>
              {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
              <div className="grid gap-4">
                <input type="text" placeholder="اسم المستلم في بنكك" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-right" value={formData.bankakName} onChange={(e) => setFormData({ ...formData, bankakName: e.target.value })} />
                <input type="text" placeholder="رقم حساب بنكك" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-right" value={formData.bankakNumber} onChange={(e) => setFormData({ ...formData, bankakNumber: e.target.value })} />
                <input type="number" placeholder={`المبلغ بـ ${selectedAccount?.currency_code}`} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-right" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
              </div>
              <label className="block border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-400 cursor-pointer">
                <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">{formData.receipt ? formData.receipt.name : 'ارفع صورة إيصال التحويل'}</p>
                <input type="file" className="hidden" onChange={(e) => setFormData({ ...formData, receipt: e.target.files ? e.target.files[0] : null })} />
              </label>
            </div>

            <div className="flex gap-3">
              <button onClick={handleBack} disabled={isLoading} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">رجوع</button>
              <button onClick={handleSubmit} disabled={!formData.bankakNumber || !formData.amount || isLoading} className="flex-[2] py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 shadow-lg">
                {isLoading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-12 h-12" /></div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">تم استلام طلبك بنجاح!</h3>
            <p className="text-slate-600 mb-8">يقوم فريقنا الآن بمراجعة التحويل. سيتم إرسال المبلغ إلى حساب بنكك المذكور خلال 15-30 دقيقة.</p>
            <button onClick={onClose} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all">العودة للرئيسية</button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
            <div className="flex items-center gap-2"><span className="font-bold text-emerald-800">{settings?.site_name || 'حول يا زول'}</span><div className="bg-emerald-600 p-1 rounded-md"><ArrowRightLeft className="text-white w-4 h-4" /></div></div>
          </div>
          {renderStep()}
        </div>
      </motion.div>
    </div>
  );
};

const Hero = ({ onTransferClick, settings }: { onTransferClick: () => void, settings: SiteSettings | null }) => (
  <section className="relative py-16 lg:py-32 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-8">حول قروشك <span className="text-emerald-600">بأمان</span> وسرعة <br />مع "{settings?.site_name || 'حول يا زول'}"</h1>
        <p className="text-xl text-slate-600 mb-12 leading-relaxed">المنصة الموثوقة للتحويل بين الجنيه السوداني والعملات العالمية. أسعار منافسة، سرعة تنفيذ، ودعم في شرق أفريقيا والخليج.</p>
        <div className="flex flex-row gap-2 sm:gap-6 justify-center">
          <button onClick={onTransferClick} className="flex-1 sm:flex-none px-4 sm:px-10 py-4 sm:py-5 bg-emerald-600 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-xl shadow-xl hover:bg-emerald-700 transition-all">ابدأ التحويل الآن</button>
          <a href="#rates" className="flex-1 sm:flex-none px-4 sm:px-10 py-4 sm:py-5 bg-white text-emerald-700 border-2 border-emerald-100 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-xl hover:bg-emerald-50 transition-all flex items-center justify-center">أسعار اليوم</a>
        </div>
      </motion.div>
    </div>
    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none" />
  </section>
);

const CurrencyConverter = ({ currencies }: { currencies: Currency[] }) => {
  const [fromAmount, setFromAmount] = useState<number>(100);
  const [toAmount, setToAmount] = useState<number>(0);
  const [fromCurrency, setFromCurrency] = useState<Currency | null>(null);
  const [toCurrency, setToCurrency] = useState<Currency | null>(null);

  useEffect(() => {
    if (currencies.length > 0) {
      setFromCurrency(currencies.find(c => c.code === 'SAR') || currencies[0]);
      setToCurrency(currencies.find(c => c.code === 'SDG') || currencies[0]);
    }
  }, [currencies]);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      const fromRate = parseFloat(fromCurrency.buy_rate.toString());
      const toRate = parseFloat(toCurrency.buy_rate.toString());
      const converted = (fromAmount * fromRate) / toRate;
      setToAmount(Number(converted.toFixed(2)));
    }
  }, [fromAmount, fromCurrency, toCurrency]);

  const handleFromAmountChange = (val: number) => {
    setFromAmount(val);
  };

  const handleToAmountChange = (val: number) => {
    setToAmount(val);
    if (fromCurrency && toCurrency) {
      const fromRate = parseFloat(fromCurrency.buy_rate.toString());
      const toRate = parseFloat(toCurrency.buy_rate.toString());
      const converted = (val * toRate) / fromRate;
      setFromAmount(Number(converted.toFixed(2)));
    }
  };

  if (!fromCurrency || !toCurrency) return null;

  return (
    <section id="converter" className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-50 rounded-3xl p-6 md:p-10 border border-slate-200 shadow-inner">
          <div className="flex items-center gap-3 mb-8"><Calculator className="text-emerald-600" /><h2 className="text-2xl font-bold">حاسبة سعر الصرف</h2></div>
          <div className="flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-center md:items-end">
            <div className="space-y-2 w-full">
              <label className="text-sm font-semibold text-slate-500 mr-2 text-right block">من</label>
              <div className="flex gap-2">
                <input type="number" value={fromAmount} onChange={(e) => handleFromAmountChange(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold outline-none focus:ring-2 focus:ring-emerald-500" />
                <select value={fromCurrency.code} onChange={(e) => setFromCurrency(currencies.find(c => c.code === e.target.value)!)} className="bg-white border border-slate-200 rounded-xl px-3 py-3 font-bold outline-none">
                  {currencies.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                </select>
              </div>
            </div>
            
            <button 
              onClick={() => { const t = fromCurrency; setFromCurrency(toCurrency); setToCurrency(t); const tempAmt = fromAmount; setFromAmount(toAmount); setToAmount(tempAmt); }} 
              className="bg-white p-2 md:p-3 rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center -my-2 md:mb-1 z-10"
            >
              <ArrowRightLeft className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 rotate-90 md:rotate-0" />
            </button>

            <div className="space-y-2 w-full">
              <label className="text-sm font-semibold text-slate-500 mr-2 text-right block">إلى</label>
              <div className="flex gap-2">
                <input type="number" value={toAmount} onChange={(e) => handleToAmountChange(Number(e.target.value))} className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-lg font-bold text-emerald-800 outline-none focus:ring-2 focus:ring-emerald-500" />
                <select value={toCurrency.code} onChange={(e) => setToCurrency(currencies.find(c => c.code === e.target.value)!)} className="bg-white border border-slate-200 rounded-xl px-3 py-3 font-bold outline-none">
                  {currencies.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                </select>
              </div>
            </div>
          </div>
          <p className="mt-8 text-center text-slate-600">سعر الصرف التقريبي: <span className="font-bold text-emerald-700">1 {fromCurrency.code} = {(parseFloat(fromCurrency.buy_rate.toString()) / parseFloat(toCurrency.buy_rate.toString())).toFixed(2)} {toCurrency.code}</span></p>
        </div>
      </div>
    </section>
  );
};

const LiveRatesChart = ({ currencies }: { currencies: Currency[] }) => {
  const active = currencies.filter(c => c.is_active);
  const [selectedCode, setSelectedCode] = useState<string>(active[0]?.code || '');
  const [points, setPoints] = useState<{ t: number; v: number }[]>([]);

  useEffect(() => {
    if (!selectedCode && active[0]?.code) setSelectedCode(active[0].code);
  }, [selectedCode, active]);

  useEffect(() => {
    if (!selectedCode) return;
    const pushPoint = () => {
      const c = currencies.find(x => x.code === selectedCode);
      if (!c) return;
      const value = Number(c.buy_rate || 0);
      setPoints(prev => [...prev.slice(-23), { t: Date.now(), v: value }]);
    };
    pushPoint();
    const id = setInterval(pushPoint, 10000);
    return () => clearInterval(id);
  }, [selectedCode, currencies]);

  const values = points.map(p => p.v);
  const min = Math.min(...values, ...(values.length ? [] : [0]));
  const max = Math.max(...values, ...(values.length ? [] : [1]));
  const range = max - min || 1;
  const width = 720;
  const height = 220;

  const polyline = points
    .map((p, i) => {
      const x = (i / Math.max(points.length - 1, 1)) * (width - 20) + 10;
      const y = height - (((p.v - min) / range) * (height - 20) + 10);
      return `${x},${y}`;
    })
    .join(' ');

  const selected = currencies.find(c => c.code === selectedCode);

  return (
    <section className="py-12 bg-white" id="live-chart">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
            <h3 className="text-2xl font-bold text-slate-900">شارت لحظي لسعر الصرف</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">اختر العملة:</span>
              <select value={selectedCode} onChange={(e) => setSelectedCode(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-semibold">
                {active.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
              </select>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-3">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[220px]">
              <polyline fill="none" stroke="#10b981" strokeWidth="3" points={polyline} />
            </svg>
          </div>
          <p className="mt-3 text-sm text-slate-500 text-right">
            {selected ? `السعر الحالي (${selected.code}) شراء: ${Number(selected.buy_rate).toFixed(2)} SDG` : ''} — يتم تحديث الرسم كل 10 ثواني.
          </p>
        </div>
      </div>
    </section>
  );
};

const MarketRates = ({ currencies, services }: { currencies: Currency[], services: Service[] }) => {
  const tableCurrencies = currencies.filter(c => c.show_in_rates_table);
  return (
    <section id="rates" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-right">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full mb-4">
            <TrendingUp className="w-4 h-4" />
            <span className="font-bold text-xs uppercase tracking-wider">مؤشر السوق اللحظي</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">أسعار الصرف اليوم</h2>
              <p className="text-slate-500 max-w-xl">نقدم لكم أحدث أسعار صرف العملات مقابل الجنيه السوداني من قلب السوق، يتم التحديث دورياً لضمان الدقة.</p>
            </div>
            
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm self-start md:self-center">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">تحديث مباشر</span>
                <span className="text-sm font-bold text-slate-700 leading-none">{new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 overflow-hidden bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="overflow-x-auto"><table className="w-full text-right"><thead className="bg-slate-50 border-b border-slate-200"><tr><th className="px-6 py-4 font-bold">العملة</th><th className="px-6 py-4 font-bold">شراء (SDG)</th><th className="px-6 py-4 font-bold">بيع (SDG)</th><th className="px-6 py-4 font-bold">التغير</th></tr></thead><tbody className="divide-y divide-slate-100">
              {tableCurrencies.map(c => (
                <tr key={c.code} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5"><div className="flex items-center gap-3"><span className="text-2xl">{c.flag}</span><div><div className="font-bold">{c.code}</div><div className="text-xs text-slate-500">{c.name}</div></div></div></td>
                  <td className="px-6 py-5 font-mono font-bold">{parseFloat(c.buy_rate.toString()).toFixed(2)}</td>
                  <td className="px-6 py-5 font-mono font-bold">{parseFloat(c.sell_rate.toString()).toFixed(2)}</td>
                  <td className="px-6 py-5"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.change_percent.startsWith('+') ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{c.change_percent}</span></td>
                </tr>
              ))}
            </tbody></table></div>
          </div>
          <div className="space-y-6">
            <div className="bg-emerald-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl">
              <h3 className="text-xl font-bold mb-4 relative z-10">خدماتنا الأخرى</h3>
              <ul className="space-y-4 relative z-10 text-right">
                {services.map(svc => (
                  <li key={svc.id} className="flex items-center gap-3 justify-end">
                    <span>{svc.title}</span>
                    {IconMap[svc.icon_name] || <Zap className="w-4 h-4" />}
                  </li>
                ))}
                {services.length === 0 && (
                  <>
                    <li className="flex items-center gap-3 justify-end"><span>شحن رصيد (زين، سوداني، MTN)</span><Zap className="w-4 h-4" /></li>
                    <li className="flex items-center gap-3 justify-end"><span>دفع فواتير الكهرباء والماء</span><ShieldCheck className="w-4 h-4" /></li>
                    <li className="flex items-center gap-3 justify-end"><span>تحويل فوري وبنكك</span><Send className="w-4 h-4" /></li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const GlobalCatalog = ({ allCurrencies, allMethods }: { allCurrencies: Currency[], allMethods: BankAccount[] }) => {
  const activeCurrencies = allCurrencies.filter(c => c.is_active);
  const inactiveCurrencies = allCurrencies.filter(c => !c.is_active);

  return (
    <section className="py-16 bg-slate-50" id="global-catalog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold">العملات العالمية وطرق الدفع</h3>
          <p className="text-slate-600 mt-2">أضفنا أغلب العملات المشهورة مع وسائل الدفع المتاحة. غير المفعّل ظاهر كـ "قريباً".</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6">
            <h4 className="font-bold text-xl mb-4">العملات</h4>
            <div className="max-h-[420px] overflow-y-auto space-y-2">
              {[...activeCurrencies, ...inactiveCurrencies].map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3"><span className="text-2xl">{c.flag}</span><div><div className="font-bold">{c.code}</div><div className="text-xs text-slate-500">{c.name}</div></div></div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {c.is_active ? 'مفعل' : 'قريباً'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6">
            <h4 className="font-bold text-xl mb-4">طرق الدفع حسب الدول</h4>
            <div className="max-h-[420px] overflow-y-auto space-y-2">
              {allMethods.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                  <div>
                    <div className="font-bold">{getCountryFlag(m.country)} {m.country} - {m.provider_name}</div>
                    <div className="text-xs text-slate-500">{m.method_type} • {m.currency_code || '-'}</div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${m.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {m.is_active ? 'مفعل' : 'غير مفعل'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DirectTransfer = ({ settings }: { settings: SiteSettings | null }) => (
  <section id="contact" className="py-20 bg-slate-100 text-center">
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6">هل لديك استفسار؟</h2>
      <p className="text-slate-600 mb-10">فريق الدعم متاح في السودان، أوغندا، وكينيا لمساعدتكم في أي وقت.</p>
      <div className="flex justify-center"><a href={settings?.whatsapp_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold text-xl shadow-xl hover:bg-emerald-700 transition-all"><Phone />تواصل معنا عبر الواتساب</a></div>
    </div>
  </section>
);

const Footer = ({ settings }: { settings: SiteSettings | null }) => (
  <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-2 text-right">
          <div className="flex items-center gap-2 mb-6 justify-end"><span className="text-2xl font-bold text-white">{settings?.site_name}</span><div className="bg-emerald-600 p-1.5 rounded-lg"><ArrowRightLeft className="text-white w-5 h-5" /></div></div>
          <p className="max-w-md leading-relaxed ml-auto">الخيار الأول لتحويل الأموال من وإلى السودان. نوفر شبكة تغطي شرق أفريقيا والخليج بأفضل الأسعار وأعلى درجات الأمان.</p>
        </div>
        <div className="text-right"><h4 className="text-white font-bold mb-6">روابط سريعة</h4><ul className="space-y-4"><li><a href="#converter" className="hover:text-emerald-500">الحاسبة</a></li><li><a href="#rates" className="hover:text-emerald-500">الأسعار</a></li></ul></div>
        <div className="text-right"><h4 className="text-white font-bold mb-6">تواصل معنا</h4><ul className="space-y-4"><li className="flex items-center gap-3 justify-end"><span dir="ltr">{settings?.support_phone}</span><Phone className="w-4 h-4" /></li><li className="flex items-center gap-3 justify-end"><span>{settings?.support_email}</span><Send className="w-4 h-4" /></li></ul></div>
      </div>
      <div className="pt-8 border-t border-slate-800 text-center text-sm"><p>© {new Date().getFullYear()} {settings?.site_name}. جميع الحقوق محفوظة.</p></div>
    </div>
  </footer>
);

export default function App() {
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [allCurrencies, setAllCurrencies] = useState<Currency[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [allBankAccounts, setAllBankAccounts] = useState<BankAccount[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    fetch(`${API_URL}/settings/`).then(res => res.json()).then(data => setSettings(data));
    fetch(`${API_URL}/currencies/`).then(res => res.json()).then(data => setCurrencies(data));
    fetch(`${API_URL}/currencies/catalog/`).then(res => res.json()).then(data => setAllCurrencies(Array.isArray(data) ? data : []));
    fetch(`${API_URL}/bank-accounts/`).then(res => res.json()).then(data => setBankAccounts(data));
    fetch(`${API_URL}/bank-accounts/catalog/`).then(res => res.json()).then(data => setAllBankAccounts(Array.isArray(data) ? data : []));
    fetch(`${API_URL}/services/`).then(res => res.json()).then(data => setServices(Array.isArray(data) ? data : []));
  }, []);

  const handleLoginSuccess = (u: any, t: string) => { setUser(u); setToken(t); localStorage.setItem('token', t); localStorage.setItem('user', JSON.stringify(u)); };
  const handleLogout = () => { setUser(null); setToken(null); localStorage.removeItem('token'); localStorage.removeItem('user'); };

  if (settings?.is_maintenance) return <div className="flex h-screen items-center justify-center text-2xl font-bold">الموقع في صيانة حالياً، سنعود قريباً...</div>;

  return (
    <div className="min-h-screen font-sans">
      <Header onTransferClick={() => setIsTransferOpen(true)} onAuthClick={() => user ? setIsHistoryOpen(true) : setIsAuthOpen(true)} user={user} onLogout={handleLogout} settings={settings} />
      <main>
        <Hero onTransferClick={() => setIsTransferOpen(true)} settings={settings} />
        <CurrencyConverter currencies={currencies} />
        <LiveRatesChart currencies={currencies} />
        <MarketRates currencies={currencies} services={services} />
        <GlobalCatalog allCurrencies={allCurrencies.length ? allCurrencies : currencies} allMethods={allBankAccounts.length ? allBankAccounts : bankAccounts} />
        <section id="how-it-works" className="py-20 bg-white"><div className="max-w-7xl mx-auto px-4"><div className="text-center mb-16"><h2 className="text-3xl font-bold mb-4">كيف تتم العملية؟</h2><p className="text-slate-600">ثلاث خطوات بسيطة تفصلك عن استلام أموالك</p></div><div className="grid md:grid-cols-3 gap-8 text-right">{[{ title: 'احسب المبلغ', icon: <Calculator /> }, { title: 'حول واستلم', icon: <Phone /> }, { title: 'أرسل الإيصال', icon: <Zap /> }].map((step, idx) => (<div key={idx} className="relative p-8 rounded-3xl bg-slate-50 border border-slate-100"><div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">{step.icon}</div><h3 className="text-xl font-bold mb-3">{step.title}</h3><div className="absolute top-8 left-8 text-6xl font-black text-slate-200/50">0{idx + 1}</div></div>))}</div></div></section>
        <DirectTransfer settings={settings} />
      </main>
      <Footer settings={settings} />
      <AnimatePresence>
        {isTransferOpen && <TransferModal isOpen={isTransferOpen} onClose={() => setIsTransferOpen(false)} bankAccounts={bankAccounts} settings={settings} token={token} />}
        {isAuthOpen && <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={handleLoginSuccess} />}
        {isHistoryOpen && token && <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} token={token} />}
      </AnimatePresence>
    </div>
  );
}
