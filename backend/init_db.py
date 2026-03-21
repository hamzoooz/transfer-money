import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from api.models import Currency, BankAccount, SiteSettings, Service

User = get_user_model()

# Create Superuser if needed
if not User.objects.filter(username='admin_hamza').exists():
    User.objects.create_superuser('admin_hamza', 'hamza@livolaunch.com', 'Hamza@2026Admin')
    print("Superuser created.")

# Load Site Settings
SiteSettings.objects.get_or_create(id=1, defaults={
    'site_name': 'حول يا زول',
    'support_phone': '+249920380318',
    'whatsapp_link': 'https://wa.me/249920380318'
})

# Load Services
services_data = [
    {'title': 'شحن رصيد (زين، سوداني، MTN)', 'icon_name': 'Zap', 'priority': 1},
    {'title': 'دفع فواتير الكهرباء والماء', 'icon_name': 'ShieldCheck', 'priority': 2},
    {'title': 'تحويل فوري وبنكك', 'icon_name': 'Send', 'priority': 3},
]

for svc in services_data:
    Service.objects.get_or_create(title=svc['title'], defaults=svc)

print(f"Loaded {len(services_data)} services.")

# Comprehensive list of World Currencies
currencies_data = [
    # Active Key Currencies
    {'code': 'SDG', 'name': 'جنيه سوداني', 'flag': '🇸🇩', 'symbol': 'SDG', 'buy_rate': 1, 'sell_rate': 1, 'region': 'africa', 'priority': 1, 'is_active': True, 'show_in_rates_table': False},
    {'code': 'SAR', 'name': 'ريال سعودي', 'flag': '🇸🇦', 'symbol': 'SR', 'buy_rate': 160, 'sell_rate': 165, 'region': 'middle_east', 'priority': 2, 'is_active': True, 'show_in_rates_table': True},
    {'code': 'USD', 'name': 'دولار أمريكي', 'flag': '🇺🇸', 'symbol': '$', 'buy_rate': 600, 'sell_rate': 605, 'region': 'global', 'priority': 3, 'is_active': True, 'show_in_rates_table': True},
    {'code': 'AED', 'name': 'درهم إماراتي', 'flag': '🇦🇪', 'symbol': 'AED', 'buy_rate': 163, 'sell_rate': 168, 'region': 'middle_east', 'priority': 4, 'is_active': True, 'show_in_rates_table': True},
    {'code': 'QAR', 'name': 'ريال قطري', 'flag': '🇶🇦', 'symbol': 'QR', 'buy_rate': 164, 'sell_rate': 169, 'region': 'middle_east', 'priority': 5, 'is_active': True, 'show_in_rates_table': True},
    
    # East Africa (Now Active)
    {'code': 'UGX', 'name': 'شلن أوغندي', 'flag': '🇺🇬', 'symbol': 'USh', 'buy_rate': 0.16, 'sell_rate': 0.18, 'region': 'africa', 'priority': 6, 'is_active': True, 'show_in_rates_table': True},
    {'code': 'KES', 'name': 'شلن كيني', 'flag': '🇰🇪', 'symbol': 'KSh', 'buy_rate': 4.50, 'sell_rate': 4.70, 'region': 'africa', 'priority': 7, 'is_active': True, 'show_in_rates_table': True},
    {'code': 'RWF', 'name': 'فرنك رواندي', 'flag': '🇷🇼', 'symbol': 'RF', 'buy_rate': 0.45, 'sell_rate': 0.50, 'region': 'africa', 'priority': 8, 'is_active': True, 'show_in_rates_table': True},
    {'code': 'ETB', 'name': 'بير إثيوبي', 'flag': '🇪🇹', 'symbol': 'Br', 'buy_rate': 10.50, 'sell_rate': 11.00, 'region': 'africa', 'priority': 9, 'is_active': True, 'show_in_rates_table': True},

    # Others
    {'code': 'EUR', 'name': 'يورو', 'flag': '🇪🇺', 'symbol': '€', 'region': 'europe', 'priority': 10},
    {'code': 'GBP', 'name': 'جنيه إسترليني', 'flag': '🇬🇧', 'symbol': '£', 'region': 'europe', 'priority': 11},
    {'code': 'TRY', 'name': 'ليرة تركية', 'flag': '🇹🇷', 'symbol': '₺', 'region': 'asia', 'priority': 12},
    {'code': 'EGP', 'name': 'جنيه مصري', 'flag': '🇪🇬', 'symbol': 'LE', 'region': 'africa', 'priority': 13},
]

for curr in currencies_data:
    Currency.objects.update_or_create(code=curr['code'], defaults=curr)

print(f"Loaded {len(currencies_data)} world currencies.")

# Load Bank Accounts with specific methods
bank_accounts = [
    # Saudi
    {'country': 'السعودية', 'provider_name': 'مصرف الراجحي', 'account_number': '1234567890123456', 'account_name': 'شركة حول يا زول للتحويلات', 'currency_code': 'SAR', 'method_type': 'bank'},
    
    # Uganda
    {'country': 'أوغندا', 'provider_name': 'Stanbic Bank', 'account_number': '9030012345678', 'account_name': 'Hawil Ya Zol UG', 'currency_code': 'UGX', 'method_type': 'bank', 'additional_info': 'Branch: Corporate Branch, SWIFT: SBICUGKA'},
    {'country': 'أوغندا', 'provider_name': 'MTN Mobile Money', 'account_number': '256770000000', 'account_name': 'Hamza Ahmed', 'currency_code': 'UGX', 'method_type': 'mobile_money', 'additional_info': 'MTN Uganda Only'},
    {'country': 'أوغندا', 'provider_name': 'Airtel Money', 'account_number': '256700000000', 'account_name': 'Hamza Ahmed', 'currency_code': 'UGX', 'method_type': 'mobile_money', 'additional_info': 'Airtel Uganda Only'},

    # Kenya
    {'country': 'كينيا', 'provider_name': 'M-Pesa', 'account_number': '254700000000', 'account_name': 'Hawil Ya Zol KE', 'currency_code': 'KES', 'method_type': 'mobile_money', 'additional_info': 'Paybill: 123456, Account: HAWIL'},
    {'country': 'كينيا', 'provider_name': 'Equity Bank', 'account_number': '0123456789', 'account_name': 'Hawil Ya Zol Limited', 'currency_code': 'KES', 'method_type': 'bank'},

    # Ethiopia
    {'country': 'إثيوبيا', 'provider_name': 'Commercial Bank of Ethiopia (CBE)', 'account_number': '1000123456789', 'account_name': 'Hawil Ya Zol ET', 'currency_code': 'ETB', 'method_type': 'bank'},
    {'country': 'إثيوبيا', 'provider_name': 'Telebirr', 'account_number': '251900000000', 'account_name': 'Hamza Ahmed', 'currency_code': 'ETB', 'method_type': 'mobile_money'},

    # Sudan (Recipient)
    {'country': 'السودان', 'provider_name': 'بنك الخرطوم (بنكك)', 'account_number': '1234567', 'account_name': 'أحمد محمد علي', 'currency_code': 'SDG', 'method_type': 'bank'},
]

for acc in bank_accounts:
    try:
        curr = Currency.objects.get(code=acc['currency_code'])
        BankAccount.objects.update_or_create(
            account_number=acc['account_number'], 
            provider_name=acc['provider_name'],
            defaults={
                'country': acc['country'],
                'account_name': acc['account_name'],
                'currency': curr,
                'method_type': acc.get('method_type', 'bank'),
                'additional_info': acc.get('additional_info', '')
            }
        )
    except Currency.DoesNotExist:
        print(f"Currency {acc['currency_code']} not found, skipping account.")

print("Bank Accounts & Payment Methods loaded.")
