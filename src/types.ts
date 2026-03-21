export interface Currency {
  id: number;
  code: string;
  name: string;
  flag: string;
  symbol: string;
  buy_rate: number;
  sell_rate: number;
  change_percent: string;
  region: string;
  priority: number;
  is_active: boolean;
  show_in_rates_table: boolean;
  is_crypto: boolean;
}

export interface BankAccount {
  id: number;
  country: string;
  method_type: 'bank' | 'mobile_money' | 'cash' | 'crypto';
  provider_name: string;
  account_number: string;
  account_name: string;
  currency: number;
  currency_code: string;
  additional_info: string;
  is_active: boolean;
}

export interface Service {
  id: number;
  title: string;
  icon_name: string;
  is_active: boolean;
  priority: number;
}

export interface MarketRate {
  currency: string;
  buy: number;
  sell: number;
  change: number;
}
