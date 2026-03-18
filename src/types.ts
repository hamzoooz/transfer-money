export interface Currency {
  code: string;
  name: string;
  flag: string;
  rateToSDG: number; // How many SDG for 1 unit of this currency
}

export const CURRENCIES: Currency[] = [
  { code: 'SDG', name: 'جنيه سوداني', flag: '🇸🇩', rateToSDG: 1 },
  { code: 'SAR', name: 'ريال سعودي', flag: '🇸🇦', rateToSDG: 160 },
  { code: 'USD', name: 'دولار أمريكي', flag: '🇺🇸', rateToSDG: 600 },
  { code: 'AED', name: 'درهم إماراتي', flag: '🇦🇪', rateToSDG: 163 },
  { code: 'QAR', name: 'ريال قطري', flag: '🇶🇦', rateToSDG: 164 },
];

export interface BankAccount {
  country: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  currency: string;
}

export const BANK_ACCOUNTS: BankAccount[] = [
  { country: 'السعودية', bankName: 'مصرف الراجحي', accountNumber: '1234567890123456', accountName: 'شركة حول يا زول للتحويلات', currency: 'SAR' },
  { country: 'قطر', bankName: 'بنك قطر الوطني (QNB)', accountNumber: '9876543210987654', accountName: 'Hawil Ya Zol Trading', currency: 'QAR' },
  { country: 'السودان', bankName: 'بنك الخرطوم (بنكك)', accountNumber: '1234567', accountName: 'أحمد محمد علي', currency: 'SDG' },
];

export interface MarketRate {
  currency: string;
  buy: number;
  sell: number;
  change: number;
}
