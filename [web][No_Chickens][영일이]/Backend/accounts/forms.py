# Python bytecode 3.7 (3394)
# Embedded file name: C:\Users\ASUS\to_git\ZeroOneTwo\Backend\accounts\forms.py
# Size of source mod 2**32: 636 bytes
# Decompiled by https://python-decompiler.com
from django import forms
from .models import Schedule, Receipt, Expenditure, ExchangeRates

class ScheduleForm(forms.ModelForm):
    class Meta:
        model = Schedule
        fields = '__all__'


class ReceiptForm(forms.ModelForm):
    class Meta:
        model = Receipt
        fields = '__all__'


class ExpenditureForm(forms.ModelForm):
    class Meta:
        model = Expenditure
        fields = '__all__'


class imageForm(forms.Form):
    image = forms.ImageField()
    image_base64 = forms.Textarea()
    origin = forms.CharField(max_length=20)
    translate = forms.CharField(max_length=20)