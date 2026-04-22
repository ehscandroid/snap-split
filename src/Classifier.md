<!-- https://docs.voxel51.com/index.html
https://cocodataset.org/#explore
https://datasetsearch.research.google.com/
https://www.ibisworld.com/
https://storage.googleapis.com/openimages/web/index.html -->


# Scene Classification API

CLIP-based scene classification service with FastAPI.

## Quick Start

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 main.py
----
source venv/bin/activate && python3 main.py
deactivate -> venv
```

Server runs at **http://localhost:8000** — API docs at **http://localhost:8000/docs**

## Endpoints

### `POST /classify-scene`

Upload an image and classify it into predefined scene categories using CLIP.

**Request:** `multipart/form-data` with an image file under the field `file`.

**Optional parameter:** `threshold` (float, default 0.1) — minimum confidence to include in `valid_labels`.

**Response:**
```json
{
  "id": "a1b2c3d4",
  "top_label": "beehive or apiary",
  "top_category": "beekeeping",
  "top_confidence": 0.72,
  "all_scores": [...],
  "valid_labels": [...],
  "threshold": 0.1,
  "image_width": 640,
  "image_height": 480,
  "processing_time_ms": 150.23
}
```

**Supported categories:** `beekeeping`, `construction`, `office`, `industrial`, `residential`, `urban`, `nature`, `medical`, `fire_safety`, `fire_hazard`

---

### `POST /classify-text`

Analyze raw text against predefined beekeeping categories using CLIP text embeddings.

**Request:** `application/json`

```json
{
  "text": "we treated the hives with oxalic acid strips yesterday",
  "threshold": 0.1
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `text` | string | *required* | Raw text to classify |
| `threshold` | float | 0.1 | Minimum confidence to include in `valid_labels` |

**Response:**
```json
{
  "id": "f8a1b2c3",
  "input_text": "we treated the hives with oxalic acid strips yesterday",
  "top_label": "text about treating bees with oxalic acid or thymol",
  "top_category": "bee_health",
  "top_confidence": 0.812,
  "all_scores": [...],
  "valid_labels": [...],
  "threshold": 0.1,
  "processing_time_ms": 95.41
}
```

**Beekeeping categories:**

| Category | Example labels |
|----------|---------------|
| `hive_management` | Hive inspections, requeening, splitting, combining colonies |
| `honey_production` | Harvesting, extracting, bottling, honey flow |
| `bee_health` | Varroa, foulbrood, nosema, treatments, mortality |
| `equipment` | Smokers, suits, hive tools, hive construction |
| `pollination` | Crop pollination, field placement, foraging |
| `bee_species` | Apis mellifera, bumblebees, stingless, solitary |
| `swarming` | Swarm capture, prevention, swarm traps |
| `wax_and_products` | Beeswax, propolis, royal jelly, candles |
| `seasonal_management` | Winterizing, spring feeding, fall prep |
| `not_beekeeping` | General unrelated text (catch-all) |

**Example:**
```bash
curl -X POST http://localhost:8000/classify-text \
  -H "Content-Type: application/json" \
  -d '{"text": "we inspected the brood frames and found good laying patterns"}'
```

---

### `GET /health`

Returns model loading status and service health.

**Response:**
```json
{
  "status": "ok",
  "clip_model_loaded": true,
  "yolo_model_loaded": true,
  "yolo_oiv7_model_loaded": true,
  "yolo_dnn_loaded": true,
  "device": "cuda"
}
```

---

## Object Detection Endpoints

### `POST /detect-objects`

Detect objects using YOLOv8 (PyTorch backend).

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `file` | file | *required* | Image file |
| `conf_threshold` | float | 0.25 | Minimum confidence |
| `iou_threshold` | float | 0.45 | NMS IoU threshold |
| `model` | string | "coco" | "coco" (80 classes) or "oiv7" (601 classes) |

**Response:**
```json
{
  "id": "abc12345",
  "detections": [
    {"label": "horse", "confidence": 0.901, "bbox": {"x1": 100, "y1": 50, "x2": 400, "y2": 300}}
  ],
  "image_width": 640,
  "image_height": 480,
  "processing_time_ms": 45.2
}
```

---

### `POST /detect-objects-dnn`

Detect objects using OpenCV DNN (ONNX backend, COCO only).

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `file` | file | *required* | Image file |
| `conf_threshold` | float | 0.25 | Minimum confidence |
| `iou_threshold` | float | 0.45 | NMS IoU threshold |

---

### `POST /detect-objects-with-crops`

Detect objects and return cropped images.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `file` | file | *required* | Image file |
| `conf_threshold` | float | 0.25 | Minimum confidence |
| `model` | string | "coco" | "coco" or "oiv7" |
| `include_crops` | bool | true | Include base64 images in response |
| `save_crops` | bool | false | Save crops to disk |

**Response:**
```json
{
  "id": "abc12345",
  "crops_directory": "outputs/crops_abc12345",
  "detections": [
    {
      "label": "horse",
      "confidence": 0.901,
      "bbox": {"x1": 100, "y1": 50, "x2": 400, "y2": 300},
      "image_base64": "/9j/4AAQSkZJRg...",
      "image_path": "outputs/crops_abc12345/0_horse_0.90.jpg"
    }
  ]
}
```

---

### `POST /analyze-spatial`

Detect objects and analyze spatial relationships between them.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `file` | file | *required* | Image file |
| `conf_threshold` | float | 0.25 | Minimum confidence |
| `model` | string | "coco" | "coco" or "oiv7" |

**Response:**
```json
{
  "id": "abc12345",
  "detections": [
    {"label": "potted plant", "confidence": 0.88, "bbox": {...}},
    {"label": "couch", "confidence": 0.85, "bbox": {...}},
    {"label": "chair", "confidence": 0.76, "bbox": {...}}
  ],
  "relations": [
    {"subject": "potted plant", "relation": "on", "object": "chair", ...},
    {"subject": "chair", "relation": "beside", "object": "couch", ...}
  ],
  "text_summary": "The image contains: potted plant, couch, chair. Spatial relationships: - potted plant on chair - chair beside couch",
  "processing_time_ms": 120.5
}
```

**Supported spatial relations:** `on`, `under`, `beside`, `above`, `in_front_of`

---

## Models

| Endpoint | Backend | Model | Classes |
|----------|---------|-------|---------|
| `/detect-objects` | PyTorch | yolov8n.pt | 80 (COCO) |
| `/detect-objects` | PyTorch | yolov8n-oiv7.pt | 601 (Open Images V7) |
| `/detect-objects-dnn` | OpenCV DNN | yolov8n.onnx | 80 (COCO) |
| `/detect-objects-with-crops` | PyTorch | yolov8n.pt / yolov8n-oiv7.pt | 80 / 601 |
| `/analyze-spatial` | PyTorch | yolov8n.pt / yolov8n-oiv7.pt | + spatial relations |
| `/classify-scene` | CLIP | openai/clip-vit-base-patch32 | scene categories |
| `/classify-text` | CLIP | openai/clip-vit-base-patch32 | beekeeping text |
