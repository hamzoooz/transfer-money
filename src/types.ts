export interface Currency {
  id: number;
  code: string;
  name: string;
  flag: string;
  buy_rate: number;
  sell_rate: number;
  change_percent: string;
  is_active: boolean;
  show_in_rates_table: boolean;
}

export interface BankAccount {
  id: number;
  country: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  currency: number;
  currency_code: string;
  is_active: boolean;
}

export interface MarketRate {
  currency: string;
  buy: number;
  sell: number;
  change: number;
}
