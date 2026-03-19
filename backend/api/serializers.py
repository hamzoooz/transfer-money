from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Currency, BankAccount, TransferRequest, SiteSettings

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = '__all__'

class BankAccountSerializer(serializers.ModelSerializer):
    currency_code = serializers.CharField(source='currency.code', read_only=True)
    class Meta:
        model = BankAccount
        fields = '__all__'

class TransferRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferRequest
        fields = '__all__'
        read_only_fields = ('user', 'status', 'created_at', 'updated_at', 'ip_address', 'user_agent', 'exchange_rate_at_time', 'amount_to_receive_sdg')

    def create(self, validated_data):
        request = self.context.get('request')
        selected_account = validated_data.get('selected_account')
        amount_sent = validated_data.get('amount_sent')
        
        currency = selected_account.currency
        rate = currency.buy_rate
        
        validated_data['currency_sent'] = currency
        validated_data['exchange_rate_at_time'] = rate
        validated_data['amount_to_receive_sdg'] = amount_sent * rate
        
        if request:
            validated_data['ip_address'] = request.META.get('REMOTE_ADDR')
            validated_data['user_agent'] = request.META.get('HTTP_USER_AGENT')
            if request.user.is_authenticated:
                validated_data['user'] = request.user
            
        return super().create(validated_data)
