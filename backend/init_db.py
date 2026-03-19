import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from api.models import Currency, BankAccount, SiteSettings

User = get_user_model()

# Create Superuser
if not User.objects.filter(username='hamzooooz').exists():
    User.objects.create_superuser('hamzooooz', 'hamzoooz123@gmail.com', 'Hamza@2020')
    print("Superuser created.")

# Load Site Settings
SiteSettings.objects.get_or_create(id=1, defaults={
    'site_name': 'حول يا زول',
    'support_phone': '+249920380318',
    'whatsapp_link': 'https://wa.me/249920380318'
})

# Load Currencies
currencies = [
    {'code': 'SDG', 'name': 'جنيه سوداني', 'flag': '🇸🇩', 'buy_rate': 1, 'sell_rate': 1, 'change_percent': '0%', 'show_in_rates_table': False},
    {'code': 'SAR', 'name': 'ريال سعودي', 'flag': '🇸🇦', 'buy_rate': 160, 'sell_rate': 165, 'change_percent': '+0.5%'},
    {'code': 'USD', 'name': 'دولار أمريكي', 'flag': '🇺🇸', 'buy_rate': 600, 'sell_rate': 605, 'change_percent': '+0.5%'},
    {'code': 'AED', 'name': 'درهم إماراتي', 'flag': '🇦🇪', 'buy_rate': 163, 'sell_rate': 168, 'change_percent': '+0.5%'},
    {'code': 'QAR', 'name': 'ريال قطري', 'flag': '🇶🇦', 'buy_rate': 164, 'sell_rate': 169, 'change_percent': '+0.5%'},
    {'code': 'EUR', 'name': 'يورو', 'flag': '🇪🇺', 'buy_rate': 650, 'sell_rate': 660, 'change_percent': '+0.2%'},
    {'code': 'GBP', 'name': 'جنيه إسترليني', 'flag': '🇬🇧', 'buy_rate': 750, 'sell_rate': 765, 'change_percent': '+0.3%'},
    {'code': 'TRY', 'name': 'ليرة تركية', 'flag': '🇹🇷', 'buy_rate': 20, 'sell_rate': 22, 'change_percent': '-0.1%'},
    {'code': 'EGP', 'name': 'جنيه مصري', 'flag': '🇪🇬', 'buy_rate': 12, 'sell_rate': 13, 'change_percent': '+0.1%'},
]

for curr in currencies:
    Currency.objects.update_or_create(code=curr['code'], defaults=curr)

print("Currencies loaded.")

# Load Bank Accounts
bank_accounts = [
    {'country': 'السعودية', 'bank_name': 'مصرف الراجحي', 'account_number': '1234567890123456', 'account_name': 'شركة حول يا زول للتحويلات', 'currency_code': 'SAR'},
    {'country': 'قطر', 'bank_name': 'بنك قطر الوطني (QNB)', 'account_number': '9876543210987654', 'account_name': 'Hawil Ya Zol Trading', 'currency_code': 'QAR'},
    {'country': 'السودان', 'bank_name': 'بنك الخرطوم (بنكك)', 'account_number': '1234567', 'account_name': 'أحمد محمد علي', 'currency_code': 'SDG'},
]

for acc in bank_accounts:
    curr = Currency.objects.get(code=acc['currency_code'])
    BankAccount.objects.update_or_create(
        account_number=acc['account_number'], 
        defaults={
            'country': acc['country'],
            'bank_name': acc['bank_name'],
            'account_name': acc['account_name'],
            'currency': curr
        }
    )

print("Bank Accounts loaded.")
