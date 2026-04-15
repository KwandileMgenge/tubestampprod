# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_functions.options import set_global_options
from firebase_admin import initialize_app
import json
import os
import urllib.error
import urllib.request

# For cost control, you can set the maximum number of containers that can be
# running at the same time. This helps mitigate the impact of unexpected
# traffic spikes by instead downgrading performance. This limit is a per-function
# limit. You can override the limit for each function using the max_instances
# parameter in the decorator, e.g. @https_fn.on_request(max_instances=5).
set_global_options(max_instances=10)

initialize_app()


@https_fn.on_request()
def health_check(req: https_fn.Request) -> https_fn.Response:
    """Simple health endpoint for uptime checks and smoke tests."""
    return https_fn.Response(
        '{"ok":true,"service":"tubestampprod-functions"}',
        status=200,
        headers={"Content-Type": "application/json"},
    )


@https_fn.on_call()
def generate_timestamps(req: https_fn.CallableRequest) -> dict:
    """Callable endpoint to generate YouTube timestamps via BumpUps."""
    data = req.data or {}
    url = data.get("url")
    if not isinstance(url, str) or not url.strip():
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            message="The request must include a non-empty 'url' string.",
        )

    api_key = os.getenv("BUMPUPS_API_KEY")
    if not api_key:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.FAILED_PRECONDITION,
            message="Missing BUMPUPS_API_KEY in functions environment.",
        )

    payload = {
        "url": url.strip(),
        "model": "bump-1.0",
        "language": "en",
        "timestamps_style": "long",
    }
    request = urllib.request.Request(
        "https://api.bumpups.com/general/timestamps",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "X-Api-Key": api_key,
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            response_body = response.read().decode("utf-8")
            return json.loads(response_body)
    except urllib.error.HTTPError as err:
        error_body = err.read().decode("utf-8", errors="ignore")
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INTERNAL,
            message=f"BumpUps API request failed with status {err.code}.",
            details=error_body,
        )
    except urllib.error.URLError as err:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.UNAVAILABLE,
            message="Unable to reach BumpUps API.",
            details=str(err.reason),
        )
    except json.JSONDecodeError:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INTERNAL,
            message="BumpUps API returned invalid JSON.",
        )
