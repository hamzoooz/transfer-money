import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, TrendingUp, ShieldCheck, Zap, Info, Phone, Menu, X, Calculator, Send, Landmark, CheckCircle2, ChevronLeft, Upload, User, LogOut, History, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Currency, BankAccount } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

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
  currency_sent: number;
  currency_code: string;
  amount_to_receive_sdg: number;
  status: string;
  created_at: string;
  bankak_name: string;
}

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
            <a href="#rates" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">الأسعار</a>
            
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
              <a href="#rates" className="text-slate-600 py-2" onClick={() => setIsMenuOpen(false)}>الأسعار</a>
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
      .then(data => setHistory(data))
      .finally(() => setLoading(false));
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-2xl bg-white rounded-[2rem] p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <History className="text-emerald-600" />
            سجل التحويلات
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
        </div>

        {loading ? (
          <p className="text-center py-10">جاري التحميل...</p>
        ) : history.length === 0 ? (
          <p className="text-center py-10 text-slate-500">لا يوجد تحويلات سابقة</p>
        ) : (
          <div className="space-y-4">
            {history.map(item => (
              <div key={item.id} className="p-4 border rounded-2xl flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div>
                  <div className="font-bold">{item.amount_sent} {item.currency_code}</div>
                  <div className="text-xs text-slate-400">{new Date(item.created_at).toLocaleString('ar-EG')}</div>
                  <div className="text-sm text-slate-600">إلى: {item.bankak_name}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                  item.status === 'pending' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.status === 'approved' ? 'مكتمل' : item.status === 'pending' ? 'قيد الانتظار' : 'مرفوض'}
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

      if (!response.ok) {
        throw new Error('فشل إرسال الطلب، الرجاء المحاولة مرة أخرى');
      }

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
              <h3 className="text-2xl font-bold text-slate-900">اختر بلد التحويل</h3>
              <p className="text-slate-500">من أين ستقوم بإرسال الأموال؟</p>
            </div>
            <div className="grid gap-4">
              {bankAccounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => { setSelectedAccount(acc); handleNext(); }}
                  className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                      {acc.country === 'السعودية' ? '🇸🇦' : acc.country === 'قطر' ? '🇶🇦' : (acc.country === 'مصر' ? '🇪🇬' : (acc.country === 'تركيا' ? '🇹🇷' : '🌍'))}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{acc.country}</div>
                      <div className="text-xs text-slate-500">{acc.bank_name}</div>
                    </div>
                  </div>
                  <ChevronLeft className="text-slate-300 group-hover:text-emerald-500" />
                </button>
              ))}
              {bankAccounts.length === 0 && <p className="text-center text-slate-500">جاري تحميل الحسابات...</p>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <h4 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <Landmark className="w-5 h-5" />
                بيانات حسابنا في {selectedAccount?.country}
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-emerald-100 pb-2">
                  <span className="text-emerald-600">البنك:</span>
                  <span className="font-bold text-emerald-900">{selectedAccount?.bank_name}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-100 pb-2">
                  <span className="text-emerald-600">اسم الحساب:</span>
                  <span className="font-bold text-emerald-900">{selectedAccount?.account_name}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-100 pb-2">
                  <span className="text-emerald-600">رقم الحساب:</span>
                  <span className="font-bold text-emerald-900 font-mono tracking-wider">{selectedAccount?.account_number}</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-emerald-700/70 text-center">
                * يرجى التحويل لهذا الحساب ثم إكمال البيانات أدناه
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-800">بيانات استلام "بنكك" في السودان</h4>
              {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
              <div className="grid gap-4">
                <input
                  type="text"
                  placeholder="اسم المستلم في بنكك"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.bankakName}
                  onChange={(e) => setFormData({ ...formData, bankakName: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="رقم حساب بنكك"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.bankakNumber}
                  onChange={(e) => setFormData({ ...formData, bankakNumber: e.target.value })}
                />
                <input
                  type="number"
                  placeholder={`المبلغ بـ ${selectedAccount?.currency_code}`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <label className="block border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">{formData.receipt ? formData.receipt.name : 'ارفع صورة إيصال التحويل'}</p>
                <input type="file" className="hidden" onChange={(e) => setFormData({ ...formData, receipt: e.target.files ? e.target.files[0] : null })} />
              </label>
            </div>

            <div className="flex gap-3">
              <button onClick={handleBack} disabled={isLoading} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">رجوع</button>
              <button onClick={handleSubmit} disabled={!formData.bankakNumber || !formData.amount || isLoading} className="flex-[2] py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 shadow-lg shadow-emerald-100">
                {isLoading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">تم استلام طلبك بنجاح!</h3>
            <p className="text-slate-600 mb-8">
              يقوم فريقنا الآن بمراجعة التحويل. سيتم إرسال المبلغ إلى حساب بنكك المذكور خلال 15-30 دقيقة.
            </p>
            <button onClick={onClose} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all">
              العودة للرئيسية
            </button>
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
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-800">{settings?.site_name || 'حول يا زول'}</span>
              <div className="bg-emerald-600 p-1 rounded-md"><ArrowRightLeft className="text-white w-4 h-4" /></div>
            </div>
          </div>
          {renderStep()}
        </div>
      </motion.div>
    </div>
  );
};

// ... Hero, CurrencyConverter, MarketRates, DirectTransfer, Footer remain similar ...

const Hero = ({ onTransferClick, settings }: { onTransferClick: () => void, settings: SiteSettings | null }) => (
  <section className="relative py-16 lg:py-32 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-8">
            حول قروشك <span className="text-emerald-600">بأمان</span> وسرعة <br /> مع "{settings?.site_name || 'حول يا زول'}"
          </h1>
          <p className="text-xl text-slate-600 mb-12 leading-relaxed">المنصة الأولى الموثوقة لتحويل الأموال بين الجنيه السوداني والعملات العالمية. أسعار منافسة، سرعة في التنفيذ، وخدمة عملاء على مدار الساعة.</p>
          <div className="flex flex-wrap gap-6 justify-center">
            <button onClick={onTransferClick} className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold text-xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all">ابدأ التحويل الآن</button>
            <a href="#rates" className="px-10 py-5 bg-white text-emerald-700 border-2 border-emerald-100 rounded-2xl font-bold text-xl hover:bg-emerald-50 transition-all">عرض أسعار اليوم</a>
          </div>
        </motion.div>
      </div>
    </div>
    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none"></div>
  </section>
);

const CurrencyConverter = ({ currencies }: { currencies: Currency[] }) => {
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState<Currency | null>(null);
  const [toCurrency, setToCurrency] = useState<Currency | null>(null);
  const [result, setResult] = useState<number>(0);

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
      const converted = (amount * fromRate) / toRate;
      setResult(converted);
    }
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    if (!fromCurrency || !toCurrency) return;
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  if (!fromCurrency || !toCurrency) return <div className="py-12 text-center">جاري التحميل...</div>;

  return (
    <section id="converter" className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-50 rounded-3xl p-6 md:p-10 shadow-inner border border-slate-200">
          <div className="flex items-center gap-3 mb-8"><Calculator className="text-emerald-600 w-6 h-6" /><h2 className="text-2xl font-bold text-slate-800">حاسبة سعر الصرف</h2></div>
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 mr-2">من</label>
              <div className="flex gap-2">
                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
                <select value={fromCurrency.code} onChange={(e) => setFromCurrency(currencies.find(c => c.code === e.target.value)!)} className="bg-white border border-slate-200 rounded-xl px-3 py-3 font-bold outline-none">
                  {currencies.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                </select>
              </div>
            </div>
            <button onClick={swapCurrencies} className="bg-white p-3 rounded-full border border-slate-200 shadow-sm hover:bg-emerald-50 mb-1"><ArrowRightLeft className="w-5 h-5" /></button>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 mr-2">إلى</label>
              <div className="flex gap-2">
                <div className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-lg font-bold text-emerald-800">{result.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                <select value={toCurrency.code} onChange={(e) => setToCurrency(currencies.find(c => c.code === e.target.value)!)} className="bg-white border border-slate-200 rounded-xl px-3 py-3 font-bold outline-none">
                  {currencies.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="mt-8 p-4 bg-emerald-600/5 rounded-2xl border border-emerald-600/10 text-center">
            <p className="text-slate-600">سعر الصرف التقريبي: <span className="font-bold text-emerald-700">1 {fromCurrency.code} = {(parseFloat(fromCurrency.buy_rate.toString()) / parseFloat(toCurrency.buy_rate.toString())).toFixed(2)} {toCurrency.code}</span></p>
          </div>
        </div>
      </div>
    </section>
  );
};

const MarketRates = ({ currencies }: { currencies: Currency[] }) => {
  const tableCurrencies = currencies.filter(c => c.show_in_rates_table);
  return (
    <section id="rates" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 mb-2"><TrendingUp className="w-5 h-5" /><span className="font-bold uppercase tracking-wider text-sm">مؤشر السوق</span></div>
            <h2 className="text-3xl font-bold text-slate-900">أسعار الصرف اليوم</h2>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm bg-white px-4 py-2 rounded-full border border-slate-200">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>تحديث مباشر: {new Date().toLocaleTimeString('ar-EG')}
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr><th className="px-6 py-4 font-bold text-slate-700">العملة</th><th className="px-6 py-4 font-bold text-slate-700">شراء (SDG)</th><th className="px-6 py-4 font-bold text-slate-700">بيع (SDG)</th><th className="px-6 py-4 font-bold text-slate-700">التغير</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tableCurrencies.map((c) => (
                    <tr key={c.code} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5"><div className="flex items-center gap-3"><span className="text-2xl">{c.flag}</span><div><div className="font-bold text-slate-900">{c.code}</div><div className="text-xs text-slate-500">{c.name}</div></div></div></td>
                      <td className="px-6 py-5 font-mono font-bold text-slate-800">{parseFloat(c.buy_rate.toString()).toFixed(2)}</td>
                      <td className="px-6 py-5 font-mono font-bold text-slate-800">{parseFloat(c.sell_rate.toString()).toFixed(2)}</td>
                      <td className="px-6 py-5"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.change_percent.startsWith('+') ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{c.change_percent}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-emerald-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <h3 className="text-xl font-bold mb-4 relative z-10">خدماتنا الأخرى</h3>
              <ul className="space-y-4 relative z-10">
                <li className="flex items-center gap-3"><div className="bg-white/20 p-2 rounded-lg"><Zap className="w-4 h-4" /></div><span>شحن رصيد (زين، سوداني، MTN)</span></li>
                <li className="flex items-center gap-3"><div className="bg-white/20 p-2 rounded-lg"><ShieldCheck className="w-4 h-4" /></div><span>دفع فواتير الكهرباء والماء</span></li>
                <li className="flex items-center gap-3"><div className="bg-white/20 p-2 rounded-lg"><Send className="w-4 h-4" /></div><span>تحويل بنكك وفوري</span></li>
              </ul>
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
      <h2 className="text-3xl font-bold text-slate-900 mb-6">هل لديك استفسار؟</h2>
      <p className="text-slate-600 mb-10">فريق الدعم الفني متاح للرد على جميع تساؤلاتكم ومساعدتكم في أي وقت.</p>
      <div className="flex justify-center"><a href={settings?.whatsapp_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold text-xl shadow-xl hover:bg-emerald-700 transition-all"><Phone className="w-6 h-6" />تواصل مع الدعم عبر الواتساب</a></div>
    </div>
  </section>
);

const Footer = ({ settings }: { settings: SiteSettings | null }) => (
  <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6"><div className="bg-emerald-600 p-1.5 rounded-lg"><ArrowRightLeft className="text-white w-5 h-5" /></div><span className="text-2xl font-bold text-white">{settings?.site_name}</span></div>
          <p className="max-w-md leading-relaxed">منصة "{settings?.site_name}" هي خيارك الأول لتحويل الأموال من وإلى السودان. نهدف لتسهيل حياة السودانيين في الداخل والخارج عبر توفير خدمة آمنة، سريعة، وبأقل التكاليف.</p>
        </div>
        <div><h4 className="text-white font-bold mb-6">روابط سريعة</h4><ul className="space-y-4"><li><a href="#converter" className="hover:text-emerald-500">الحاسبة</a></li><li><a href="#rates" className="hover:text-emerald-500">أسعار الصرف</a></li></ul></div>
        <div><h4 className="text-white font-bold mb-6">تواصل معنا</h4><ul className="space-y-4"><li className="flex items-center gap-3"><Phone className="w-4 h-4" /><span dir="ltr">{settings?.support_phone}</span></li><li className="flex items-center gap-3"><Send className="w-4 h-4" />{settings?.support_email}</li></ul></div>
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
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
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
    fetch(`${API_URL}/bank-accounts/`).then(res => res.json()).then(data => setBankAccounts(data));
  }, []);

  const handleLoginSuccess = (user: any, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (settings?.is_maintenance) return <div className="flex h-screen items-center justify-center text-2xl font-bold">الموقع في صيانة حالياً، سنعود قريباً...</div>;

  return (
    <div className="min-h-screen font-sans">
      <Header 
        onTransferClick={() => setIsTransferOpen(true)} 
        onAuthClick={() => user ? setIsHistoryOpen(true) : setIsAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
        settings={settings}
      />
      <main>
        <Hero onTransferClick={() => setIsTransferOpen(true)} settings={settings} />
        <CurrencyConverter currencies={currencies} />
        <MarketRates currencies={currencies} />
        <section id="how-it-works" className="py-20 bg-white"><div className="max-w-7xl mx-auto px-4"><div className="text-center mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-4">كيف تتم عملية التحويل؟</h2><p className="text-slate-600">ثلاث خطوات بسيطة تفصلك عن استلام أموالك</p></div><div className="grid md:grid-cols-3 gap-8">{[{ title: 'احسب المبلغ', icon: <Calculator /> }, { title: 'تواصل معنا', icon: <Phone /> }, { title: 'أرسل واستلم', icon: <Zap /> }].map((step, idx) => (<div key={idx} className="relative p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all group"><div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-100 group-hover:scale-110 transition-transform">{step.icon}</div><h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3><div className="absolute top-8 left-8 text-6xl font-black text-slate-200/50 pointer-events-none">0{idx + 1}</div></div>))}</div></div></section>
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
