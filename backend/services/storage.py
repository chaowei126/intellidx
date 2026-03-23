import shutil
import os

def upload_to_gcs(local_path: str, report_id: str, fmt: str) -> str:
    """
    Upload file. Either routes to local storage (for dev) or GCS.
    """
    if os.getenv("USE_LOCAL_STORAGE", "").lower() == "true":
        os.makedirs("/app/outputs", exist_ok=True)
        dest = f"/app/outputs/{report_id}.{fmt}"
        shutil.copy(local_path, dest)
        return f"/download/{report_id}.{fmt}"
    else:
        # Placeholder for actual GCS upload
        destination_blob_name = f"{report_id}.{fmt}"
        print(f"Uploading {local_path} to GCS as {destination_blob_name}")
        return f"https://storage.googleapis.com/fake-bucket/{destination_blob_name}"
