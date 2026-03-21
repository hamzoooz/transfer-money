from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=20, blank=True, null=True, verbose_name="Phone Number")
    whatsapp_number = models.CharField(max_length=20, blank=True, null=True, verbose_name="WhatsApp Number")
    address = models.TextField(blank=True, null=True, verbose_name="Address")
    id_document = models.ImageField(upload_to='id_documents/', blank=True, null=True, verbose_name="ID Document (Passport/National ID)")
    is_verified = models.BooleanField(default=False, verbose_name="Is Verified Identity")

    def __str__(self):
        return f"{self.user.username}'s Profile"

class SiteSettings(models.Model):
    site_name = models.CharField(max_length=100, default="حول يا زول")
    support_phone = models.CharField(max_length=20, default="+249920380318")
    support_email = models.EmailField(default="anwraltahir@gmail.com")
    whatsapp_link = models.URLField(default="https://wa.me/249920380318")
    is_maintenance = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return self.site_name

class Currency(models.Model):
    REGION_CHOICES = [
        ('global', 'Global'),
        ('africa', 'Africa'),
        ('middle_east', 'Middle East'),
        ('europe', 'Europe'),
        ('asia', 'Asia'),
        ('america', 'Americas'),
        ('oceania', 'Oceania'),
        ('crypto', 'Cryptocurrency'),
    ]

    code = models.CharField(max_length=10, unique=True, verbose_name="Currency Code")
    name = models.CharField(max_length=50, verbose_name="Currency Name")
    flag = models.CharField(max_length=10, verbose_name="Flag Emoji")
    symbol = models.CharField(max_length=10, blank=True, null=True, verbose_name="Symbol")
    
    buy_rate = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Buy Rate (SDG)", default=0)
    sell_rate = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Sell Rate (SDG)", default=0)
    change_percent = models.CharField(max_length=10, verbose_name="Change %", default="+0.0%")
    
    region = models.CharField(max_length=20, choices=REGION_CHOICES, default='global')
    priority = models.IntegerField(default=100, help_text="Lower values appear first")
    is_active = models.BooleanField(default=False, verbose_name="Active")
    show_in_rates_table = models.BooleanField(default=False, verbose_name="Show in Rates Table")
    is_crypto = models.BooleanField(default=False, verbose_name="Is Cryptocurrency")

    class Meta:
        verbose_name_plural = "Currencies"
        ordering = ['priority', 'code']

    def __str__(self):
        return f"{self.flag} {self.code} - {self.name}"

class BankAccount(models.Model):
    METHOD_CHOICES = [
        ('bank', 'Bank Transfer'),
        ('mobile_money', 'Mobile Money (MTN/Airtel/M-Pesa)'),
        ('cash', 'Cash Pickup'),
        ('crypto', 'Crypto Wallet'),
    ]

    country = models.CharField(max_length=50, verbose_name="Country")
    method_type = models.CharField(max_length=20, choices=METHOD_CHOICES, default='bank', verbose_name="Payment Method")
    provider_name = models.CharField(max_length=100, verbose_name="Bank / Provider Name", help_text="e.g. Stanbic Bank or MTN")
    account_number = models.CharField(max_length=50, verbose_name="Account / Phone Number")
    account_name = models.CharField(max_length=100, verbose_name="Account Name")
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='bank_accounts', null=True)
    
    additional_info = models.TextField(blank=True, null=True, verbose_name="Extra Details", help_text="Branch code, SWIFT, or specific instructions")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.provider_name} ({self.get_method_type_display()}) - {self.country}"

class Service(models.Model):
    title = models.CharField(max_length=200, verbose_name="Service Title")
    icon_name = models.CharField(max_length=50, default="Zap", help_text="Lucide icon name", verbose_name="Icon Name")
    is_active = models.BooleanField(default=True)
    priority = models.IntegerField(default=0)

    class Meta:
        ordering = ['priority', 'title']

    def __str__(self):
        return self.title

class TransferRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Requested By")
    selected_account = models.ForeignKey(BankAccount, on_delete=models.SET_NULL, null=True, verbose_name="Sent To Our Account")
    amount_sent = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Amount Sent", default=0)
    currency_sent = models.ForeignKey(Currency, on_delete=models.SET_NULL, null=True, related_name='transfers_from')
    
    exchange_rate_at_time = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Rate at Time", default=0)
    amount_to_receive_sdg = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Amount to Receive (SDG)", default=0)

    bankak_name = models.CharField(max_length=100, verbose_name="Bankak Recipient Name")
    bankak_number = models.CharField(max_length=50, verbose_name="Bankak Account Number")
    sender_name = models.CharField(max_length=100, blank=True, null=True, verbose_name="Sender Name")
    receipt = models.ImageField(upload_to='receipts/', blank=True, null=True, verbose_name="Transfer Receipt")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Status")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Requested At")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Transfer #{self.id} - {self.amount_sent} {self.currency_sent.code if self.currency_sent else ''} to {self.bankak_name}"
