from django.contrib import admin
from django.db.models import Sum, Count
from django.utils.html import format_html
from .models import Currency, BankAccount, TransferRequest, SiteSettings

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('site_name', 'support_phone', 'is_maintenance')
    
    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ('flag', 'code', 'name', 'buy_rate', 'sell_rate', 'change_percent', 'is_active', 'show_in_rates_table')
    list_editable = ('buy_rate', 'sell_rate', 'change_percent', 'is_active', 'show_in_rates_table')
    search_fields = ('code', 'name')
    list_filter = ('is_active', 'show_in_rates_table')

@admin.register(BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    list_display = ('bank_name', 'country', 'account_name', 'currency', 'is_active')
    list_filter = ('country', 'currency', 'is_active')
    list_editable = ('is_active',)

@admin.register(TransferRequest)
class TransferRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'status_colored', 'amount_display', 'to_sdg_display', 'bankak_name', 'created_at')
    list_filter = ('status', 'created_at', 'currency_sent', 'selected_account')
    search_fields = ('bankak_name', 'bankak_number', 'sender_name', 'id')
    readonly_fields = ('created_at', 'updated_at', 'ip_address', 'user_agent', 'exchange_rate_at_time', 'amount_to_receive_sdg')
    
    fieldsets = (
        ('Status Control', {
            'fields': ('status', 'receipt')
        }),
        ('Transfer Details', {
            'fields': ('selected_account', 'amount_sent', 'currency_sent', 'exchange_rate_at_time', 'amount_to_receive_sdg')
        }),
        ('Recipient (Bankak)', {
            'fields': ('bankak_name', 'bankak_number', 'sender_name')
        }),
        ('User Metadata (Analytics)', {
            'classes': ('collapse',),
            'fields': ('ip_address', 'user_agent', 'created_at', 'updated_at')
        }),
    )

    def status_colored(self, obj):
        colors = {
            'pending': 'orange',
            'processing': 'blue',
            'approved': 'green',
            'rejected': 'red',
        }
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            colors.get(obj.status, 'black'),
            obj.get_status_display()
        )
    status_colored.short_description = 'Status'

    def amount_display(self, obj):
        return f"{obj.amount_sent} {obj.currency_sent.code if obj.currency_sent else ''}"
    amount_display.short_description = 'Sent Amount'

    def to_sdg_display(self, obj):
        return f"{obj.amount_to_receive_sdg} SDG"
    to_sdg_display.short_description = 'Receive (SDG)'

    def changelist_view(self, request, extra_context=None):
        stats = TransferRequest.objects.aggregate(
            total_approved_sdg=Sum('amount_to_receive_sdg', filter=admin.models.models.Q(status='approved')),
            total_pending=Count('id', filter=admin.models.models.Q(status='pending')),
            total_today=Count('id', filter=admin.models.models.Q(created_at__date=admin.models.models.timezone.now().date()))
        )
        extra_context = extra_context or {}
        extra_context['summary_stats'] = stats
        return super().changelist_view(request, extra_context=extra_context)
