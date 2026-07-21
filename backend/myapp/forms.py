from django import forms

class SimulateRequestBody(forms.Form):
    lng1 = forms.FloatField(required=True)
    lat1 = forms.FloatField(required=True)
    lng2 = forms.FloatField(required=True)
    lat2 = forms.FloatField(required=True)
    lng3 = forms.FloatField(required=True)
    lat3 = forms.FloatField(required=True)
    current_cycle_used_hrs = forms.FloatField(required=True, min_value=0, max_value=70)