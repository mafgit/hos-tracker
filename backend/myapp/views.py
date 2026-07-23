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
    # print('FORM CLEANED', form.cleaned_data)
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

        while start >= max_end_time_day:
            day += 1
            max_end_time_day += 24
            all_days_logs.append([])

        if end > max_end_time_day:
            # break into multiple days
            this_day_log = {"state": state, "from": start % 24, "to": 24}
            all_days_logs[day - 1].append(this_day_log)
            while end > max_end_time_day:
                day += 1
                max_end_time_day += 24
                all_days_logs.append([])
                next_day_log = {"state": state, "from": 0, "to": 24 if end % 24 == 0 else 24 if end > max_end_time_day else end % 24}
                all_days_logs[day - 1].append(next_day_log)
        else:
            all_days_logs[day - 1].append({
                "state": state,
                "from": start % 24,
                "to": 24 if end % 24 == 0 else end % 24
            })

    time = 0.0

    state: Literal['DRIVING', 'ON_DUTY_NOT_DRIVING', 'SLEEPER_BERTH', 'OFF_DUTY'] = 'DRIVING'
    dist_since_last_fuel = 0.0

    legs = data['routes'][0]['legs']
    len_legs = len(legs)

    hrs_driving_since_last_rest = 0.0

    # last_of_8_day_window_on_duty_hrs = 0.0
    
    for leg_idx in range(len_legs):
        leg = legs[leg_idx]
        miles_left = leg['distance'] / 1609.34
        hrs_left = leg['duration'] / 3600
        if miles_left == 0 or hrs_left == 0:
            continue
        current_avg_speed = miles_left / hrs_left

        while miles_left > 0 and hrs_left > 0:
            # assumed to be driving by default initially
            
            max_dur_possible_due_to_rest = max(0, min(8 - hrs_driving_since_last_rest, hrs_left))
            max_miles_possible_due_to_rest = max_dur_possible_due_to_rest * current_avg_speed

            max_miles_possible_due_to_fuel = max(0, min(1000 - dist_since_last_fuel, miles_left))
            max_dur_possible_due_to_fuel = max_miles_possible_due_to_fuel / current_avg_speed

            max_dur_possible_due_to_70_cycle = max(0, min(hrs_left, 70 - current_cycle_used_hrs))
            max_miles_possible_due_to_70_cycle = max_dur_possible_due_to_70_cycle * current_avg_speed

            max_miles_possible = min(max_miles_possible_due_to_fuel, max_miles_possible_due_to_70_cycle, max_miles_possible_due_to_rest)
            max_hrs_possible = min(max_dur_possible_due_to_70_cycle, max_dur_possible_due_to_fuel, max_dur_possible_due_to_rest)

            if max_miles_possible == 0:
                if max_miles_possible_due_to_70_cycle <= max_miles_possible_due_to_fuel:
                    if max_miles_possible_due_to_70_cycle <= max_miles_possible_due_to_rest:
                        constraint = 'cycle'
                    else:
                        constraint = 'rest'
                else:
                    if max_miles_possible_due_to_fuel <= max_miles_possible_due_to_rest:
                        constraint = 'fuel'
                    else:
                        constraint = 'rest'
                    
                if constraint == 'cycle':
                    # needs 34 hr reset
                    state = 'OFF_DUTY'
                    start_time = time
                    time += 34
                    current_cycle_used_hrs = 0
                    log(state=state, start=start_time, end=time)
                elif constraint == 'fuel':
                    # needs fuel
                    state = 'ON_DUTY_NOT_DRIVING'
                    start_time = time
                    time += 0.5 # for fueling
                    log(state, start=start_time, end=time)
                    dist_since_last_fuel = 0
                # elif constraint == 'rest':
                else:
                    # needs rest
                    state = 'SLEEPER_BERTH'
                    start_time = time
                    time += 0.5
                    hrs_driving_since_last_rest = 0
                    log(state, start=start_time, end=time)
                    
                    
            else:
                # drive
                state = 'DRIVING'
                start_time = time
                miles_left -= max_miles_possible
                hrs_left -= max_hrs_possible
                dist_since_last_fuel += max_miles_possible
                time += max_hrs_possible
                hrs_driving_since_last_rest += max_hrs_possible
                current_cycle_used_hrs += max_hrs_possible
                log(state=state, start=start_time, end=time)

        state = 'ON_DUTY_NOT_DRIVING'
        start_time = time
        time += 1 # for loading/unloading
        log(state, start=start_time, end=time)

        # to complete a day even if dropped last item off
        if leg_idx == len_legs - 1:
            if time % 24 != 0:
                state = 'OFF_DUTY' # should be on duty but for simplicity, otherwise need further on_duty -> other states on constraint breaks
                start_time = time
                time = ((time // 24) + 1) * 24 # to end of day
                # current_cycle_used_hrs = 0
                log(state, start=start_time, end=time)
        else:
            if current_cycle_used_hrs >= 70:
                state = 'OFF_DUTY'
                start_time = time
                time += 34
                current_cycle_used_hrs = 0
                log(state, start=start_time, end=time)

    data['days'] = all_days_logs

    return JsonResponse(data, status=200)
