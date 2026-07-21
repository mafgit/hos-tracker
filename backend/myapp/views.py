from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, HttpRequest

@csrf_exempt
@require_http_methods(["POST"])
def simulate(request: HttpRequest):
    return JsonResponse({"message": "Simulation successful!"}, status=200)
