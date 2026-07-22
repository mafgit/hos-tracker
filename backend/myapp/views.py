import json
from typing import Literal

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, HttpRequest
import requests
from .forms import SimulateRequestBody

@csrf_exempt
@require_http_methods(["POST"])
def simulate(request: HttpRequest):
    body = json.loads(request.body)
    form = SimulateRequestBody(body)
    print(body)

    if not form.is_valid():
        return JsonResponse({"message": "Invalid request body"}, status=400)


    lng1 = form.cleaned_data['lng1']
    lat1 = form.cleaned_data['lat1']
    lng2 = form.cleaned_data['lng2']
    lat2 = form.cleaned_data['lat2']
    lng3 = form.cleaned_data['lng3']
    lat3 = form.cleaned_data['lat3']
    current_cycle_used_hrs = form.cleaned_data['current_cycle_used_hrs']

    url = f'https://router.project-osrm.org/route/v1/driving/{lng1},{lat1};{lng2},{lat2};{lng3},{lat3}?overview=full&geometries=geojson&steps=false'
    # print(url)
    res = requests.get(url)
    data = res.json()


    all_days_events = []

    day = 1
    time = 0.0
    legs = data.routes[0].legs
    len_legs = len(legs)
    leg_idx = 0
    current_leg = legs[leg_idx]
    current_leg_dur = current_leg.duration / 3600.0 # hrs
    current_leg_dist = current_leg.distance / 1609.34 # miles
    current_leg_avg_speed = current_leg_dist / current_leg_dur
    dist_left = current_leg_dist
    dur_left = current_leg_dur
    continuous_driving_time = 0.0
    state: Literal['DRIVING', 'ON_DUTY_NOT_DRIVING', 'SLEEPER_BERTH', ''] = 'DRIVING'
    continuous_driving_dist = 0.0
    total_on_duty_since_reset = 0.0
    while leg_idx < len_legs and dist_left > 0:
        # on duty
        if state == 'DRIVING' or state == 'ON_DUTY_NOT_DRIVING':
            if state =='DRIVING':
                pass
            else:
                pass
        else:
            pass





    

    return JsonResponse({"data": data}, status=200)
