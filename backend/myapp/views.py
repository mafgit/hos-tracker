import json
from typing import Literal, Optional

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, HttpRequest
import requests
from .forms import SimulateRequestBody

def fetch_OSRM_data(form: Optional[SimulateRequestBody] = None):
    if form is None:
        from .fake_response_data import fake_response_data
        data = fake_response_data
        return data
    
    lng1 = form.cleaned_data['lng1']
    lat1 = form.cleaned_data['lat1']
    lng2 = form.cleaned_data['lng2']
    lat2 = form.cleaned_data['lat2']
    lng3 = form.cleaned_data['lng3']
    lat3 = form.cleaned_data['lat3']
    print('FORM CLEANED', form.cleaned_data)
    url = f'https://router.project-osrm.org/route/v1/driving/{lng1},{lat1};{lng2},{lat2};{lng3},{lat3}?overview=full&geometries=geojson&steps=false'
    res = requests.get(url)
    data = res.json()
    return data

@csrf_exempt
@require_http_methods(["POST"])
def simulate(request: HttpRequest):
    body = json.loads(request.body)
    form = SimulateRequestBody(body)

    if not form.is_valid():
        return JsonResponse({"message": "Invalid request body"}, status=400)

    data = fetch_OSRM_data(form=form) # form=None for testing

    if data['code'] != 'Ok':
        return JsonResponse({"message": data['message']}, status=400)

    current_cycle_used_hrs = form.cleaned_data['current_cycle_used_hrs']
    
    all_days_logs = [[]]
    day = 1

    def log(state: str, start: float, end: float):
        nonlocal day

        max_end_time_day = day * 24
        max_start_time_day = max_end_time_day - 24

        if start > max_end_time_day:
            day += 1
            max_end_time_day = day * 24
            max_start_time_day = max_end_time_day - 24
            all_days_logs.append([])

        if end > max_end_time_day:
            # break into two days
            thisDayLog = {"state": state, "from": start % 24, "to": 24}
            nextDayLog = {"state": state, "from": 0, "to": 24 if end % 24 == 0 else end % 24}
            all_days_logs[day - 1].append(thisDayLog)
            day += 1
            all_days_logs.append([])
            all_days_logs[day - 1].append(nextDayLog)
        else:
            all_days_logs[day - 1].append({
                "state": state,
                "from": start % 24,
                "to": 24 if end % 24 == 0 else end % 24
            })

    time = 0

    state: Literal['DRIVING', 'ON_DUTY_NOT_DRIVING', 'SLEEPER_BERTH', 'OFF_DUTY'] = 'DRIVING'
    last_break_time = 0.0

    legs = data['routes'][0]['legs']
    len_legs = len(legs)
    
    for leg_idx in range(len_legs):
        leg = legs[leg_idx]
        miles_left = leg['distance'] / 1609.34
        hrs_left = leg['duration'] / 3600
        current_avg_speed = miles_left / hrs_left

        while miles_left > 0 and hrs_left > 0:
            # assumed to be driving by default initially
            miles_since_last_break = (time - last_break_time) * current_avg_speed
            max_miles_possible = min(miles_left, 1000 - miles_since_last_break)
            max_miles_possible = max(0, max_miles_possible)
            if max_miles_possible == 0:
                last_break_time = time
                state = 'OFF_DUTY'
                start_time = time
                time += 0.5 # half hr break
                current_cycle_used_hrs += 0.5
                log(state=state, start=start_time, end=time)
            elif current_cycle_used_hrs >= 70:
                last_break_time = time
                state = 'OFF_DUTY'
                start_time = time
                time += 34
                current_cycle_used_hrs = 0
                log(state=state, start=start_time, end=time)
            else:
                # drive
                state = 'DRIVING'
                start_time = time
                miles_left -= max_miles_possible
                max_hrs_possible = max_miles_possible / current_avg_speed
                hrs_left -= max_hrs_possible
                miles_since_last_break += max_miles_possible
                time += max_hrs_possible
                current_cycle_used_hrs += max_hrs_possible
                log(state=state, start=start_time, end=time)

        state = 'ON_DUTY_NOT_DRIVING'
        start_time = time
        time += 0.5 # 0.5 hr for loading/unloading
        log(state, start=start_time, end=time)

        # to complete a day even if dropped last item off
        if leg_idx == len_legs - 1:
            if time % 24 != 0:
                last_break_time = time
                state = 'OFF_DUTY' # should be on duty but for simplicity, otherwise need further on_duty -> other states on constraint breaks
                start_time = time
                which_day = time // 24
                time = ((time // 24) + 1) * 24 # to end of day
                # current_cycle_used_hrs = 0
                log(state, start=start_time, end=time)
        else:
            if current_cycle_used_hrs >= 70:
                last_break_time = time
                state = 'OFF_DUTY'
                start_time = time
                time += 34
                current_cycle_used_hrs = 0
                log(state, start=start_time, end=time)

    data['days'] = all_days_logs

    return JsonResponse(data, status=200)
