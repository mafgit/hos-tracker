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


    all_days_logs = []

    day = 1
    time = 0.0

    # state: Literal['DRIVING', 'ON_DUTY_NOT_DRIVING', 'SLEEPER_BERTH', 'OFF_DUTY'] = 'DRIVING'

    # for leg in data.routes[0].legs:
    #     miles_left = leg.distance / 1609.34
    #     hrs_left = leg.duration / 3600

    #     while miles_left > 1e-6:
    #         miles_left - 
            

    data['days'] = all_days_logs

    return JsonResponse({"data": data}, status=200)
