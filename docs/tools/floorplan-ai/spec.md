# Floor Plan Image → 3D Model Pipeline

**Status:** Draft Spec
**Model:** FloorPlanFormer (AAAI 2026)
**Inference Runtime:** C++ (ONNX Runtime, Lambda GPU)
**Last Updated:** July 29, 2026

---

## 1. Problem & Motivation

Structa's current floor plan workflow requires users to **draw their floor plan manually** using CAD-lite tools. This is a barrier to entry: most users already have floor plan images from surveys, estate agent listings, or quick sketches. Re-drawing from scratch is slow, error-prone, and discourages adoption.

This feature eliminates that barrier. A user uploads a photo or scan of their floor plan, clicks two points to set the scale, and receives a **to-scale 3D model** with room labels, dimensions, and spatial metadata — ready to feed into Structa's digital twin.

### Why Now?

- **AI maturity:** Transformer-based floor plan parsing (FloorPlanFormer) now achieves production-ready accuracy on raster floor plans
- **GPU Lambda availability:** AWS Lambda now supports GPU-accelerated custom runtimes, making serverless GPU inference cost-effective for bursty workloads
- **Digital twin dependency:** Accurate floor plans unlock credible cost estimates, material lists, and sequencing advice from The Clerk

### What This Enables

- **Instant digital twin creation**: Upload a survey floor plan → get a fully-populated digital twin in seconds
- **Credible cost estimates**: The Clerk uses actual room dimensions, wall counts, and opening specs — not guesses
- **Professional output**: 3D floor plans for project packs, tradesperson briefs, and export to CAD formats
- **Low-friction onboarding**: Users get immediate value without drawing skills

---

## 2. User Flow

### 2.1 Happy Path

```
1. User navigates to "Floor Plans" → "Add Floor Plan"
2. Sees two options: "Draw manually" (existing) | "Upload image" (new)
3. User selects "Upload image" → file picker (PNG/JPG/PDF)
4. Upload begins → progress indicator
5. Once uploaded, user sees their image in a calibration view:
   a. Drag four corners to define the floor plan boundary
      (corrects perspective distortion via homography)
   b. Click two points on the image + enter the real-world distance
      (e.g., "Wall is 4.2m")
   c. Preview of corrected, scaled image shown
6. User clicks "Process" → async job starts
7. User sees a loading state with estimated time (~2-5 seconds)
8. Result appears as an interactive 3D model:
   - Walls extruded, rooms labeled, dimensions displayed
   - Color-coded by room type (Bedroom, Kitchen, Bathroom, etc.)
   - Measurement overlays on walls
9. User can:
   - ✅ **Confirm**: Accept → spatial metadata populates digital twin
   - ✏️ **Edit**: Adjust wall positions, split/merge rooms, relabel
   - ❌ **Reject**: Delete and try again with better calibration
```

### 2.2 Alternative Flows

| Scenario | Behaviour |
|---|---|
| **Low-confidence result** (<70%) | Flag to user: "I'm not fully confident in this result. Please review carefully." |
| **Partial failure** | Some rooms detected, others missed → show detected elements, highlight uncertain areas |
| **Non-Manhattan walls** | Model handles angled walls but with lower confidence. Flag for user review. |
| **Multi-floor image** | Prompt: "Does this image contain multiple floors? If so, let's process each separately." |
| **Sketch (not clean plan)** | Deferred to Phase E. For MVP, recommend clean scanned floor plans. |

### 2.3 Calibration UI Detail

The calibration step is critical for scale accuracy:

```
┌─────────────────────────────────────────────┐
│  Step 1: Drag corners to outline your plan   │
│                                              │
│  ┌──────────────────────────────────┐        │
│  │  ┌───┬──────────────────────┐    │        │
│  │  │   │                      │    │        │
│  │  │   │  [Floor plan image]  │    │        │
│  │  │   │                      │    │        │
│  │  └───┴──────────────────────┘    │        │
│  └──────────────────────────────────┘        │
│                                              │
│  Step 2: Click two points + enter distance    │
│                                              │
│  Click a point on a wall you know →          │
│  Click another point →                       │
│  "Distance between these points: [ 4.2 ] m"  │
│                                              │
│  [Preview corrected & scaled]                │
│                                              │
│           [← Back]    [Process →]            │
└─────────────────────────────────────────────┘
```

### 2.4 3D Viewer Controls

Once processed, the 3D viewer supports:

- **Orbit/Pan/Zoom** — standard Three.js camera controls
- **Click wall** → shows wall length, type (exterior/interior)
- **Hover room** → highlights room, shows name + area
- **Toggle layers** → walls, room labels, measurements, openings
- **Edit mode** → drag wall vertices to correct errors
- **Export** → GLB, OBJ, DXF

---

## 3. System Architecture

### 3.1 Component Diagram

```
                         FRONTEND (Browser)
┌───────────────────────────────────────────────────────────┐
│  React / TanStack Start                                   │
│                                                           │
│  ┌─────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │ Upload  │  │ Calibration  │  │ 3D Viewer          │   │
│  │ Widget  │  │ UI           │  │ (Three.js / R3F)   │   │
│  └────┬────┘  └──────┬───────┘  └─────────┬──────────┘   │
│       │              │                    │              │
│       ▼              ▼                    ▼              │
│  ┌──────────────────────────────────────────────────┐    │
│  │           API Client (TanStack Query)             │    │
│  └──────────────────────┬───────────────────────────┘    │
└─────────────────────────┼────────────────────────────────┘
                          │ HTTPS
                          ▼
                  API GATEWAY (Nitro/AWS)
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  POST /upload      → R2 signed URL                       │
│  POST /calibrate   → stores calibration metadata          │
│  POST /process     → invokes state machine                │
│  GET  /status      → returns job status + result          │
│  POST /confirm     → ingests into digital twin            │
│  GET  /export      → streams 3D file                     │
│                                                           │
└──────┬──────────────────────┬────────────────────────────┘
       │                      │
       ▼                      ▼
┌──────────────┐    ┌──────────────────────────┐
│ Preprocess   │    │ Infer + Vectorize        │
│ Lambda       │    │ Lambda (GPU)             │
│ (Python)     │    │ (C++ ONNX Runtime)       │
│              │    │                          │
│ • Download   │    │ • FloorPlanFormer model  │
│   from R2    │    │ • Contour extraction     │
│ • Deskew     │    │ • Polygon simplification │
│ • Perspective│    │ • Topology enforcement   │
│   correction │    │ • Room labeling          │
│ • Resize to  │    │ • Measurement computation│
│   512×512    │    │ • JSON output            │
│ • Normalize  │    │                          │
│ • Send to    │    │   Output: VectorFloorPlan │
│   GPU Lambda │    └──────────┬───────────────┘
└──────────────┘               │
                               ▼
                     ┌──────────────────┐
                     │     R2 / S3      │
                     │  (raw uploads +  │
                     │   processed GLB) │
                     └──────────────────┘
                               │
                               ▼
                     ┌──────────────────┐
                     │  Durable Streams │
                     │  (VectorFloorPlan│
                     │   JSON docs)     │
                     └──────────────────┘
                               │
                               ▼
                     ┌──────────────────┐
                     │  Electric SQL    │
                     │  (SpatialMetadata│
                     │   + references)  │
                     └──────────────────┘
```

### 3.2 Data Flow (Sequenced)

```
1. Browser uploads image → R2 (presigned URL via API)
2. User calibrates in browser → API stores calibration metadata
3. Browser POST /process → triggers Step Functions state machine
4. State Machine Step 1: Preprocess Lambda (Python)
   a. Load image from R2
   b. Apply homography correction from calibration data
   c. Resize to 512×512
   d. Normalize to [0,1] float32 tensor
   e. Write tensor to shared tmpfs / send payload to GPU Lambda
5. State Machine Step 2: GPU Lambda (C++)
   a. Warm-start: model already loaded in memory (snapStart / provisioned concurrency)
   b. ONNX Runtime inference → segmentation + junction heatmaps
   c. Vectorization: contour tracing → polygon simplification → topology → room labels
   d. Compute measurements from calibration scale factor
   e. Write VectorFloorPlan JSON to R2 + Durable Streams
   f. Generate simple glTF/GLB 3D mesh (extrude walls, cut openings)
   g. Return job result with URLs
6. State Machine Step 3: Notification callback
   a. Update Electric SQL with status
   b. Trigger notification (WebSocket push to browser)
7. Browser polls status / receives push → renders result
8. User confirms → API ingests spatial metadata into digital twin
```

### 3.3 Synchronous vs. Asynchronous

The process endpoint is **asynchronous by design**:

- **Upload + calibrate** — synchronous, fast (<1s)
- **Process** — kicks off pipeline, returns jobId immediately
- **Status polling** — client polls every 500ms or receives WebSocket push

This avoids API gateway timeouts (Lambda max is 15min, but we want <5s) and allows the user to navigate away and come back.

---

## 4. Pipeline Stages (Detailed)

### Stage 1: Upload & Validation

**Location:** Browser → API → R2

**Steps:**
1. User selects file (accept: PNG, JPG, PDF)
2. Client-side validation:
   - Min resolution: 500×500px
   - Max file size: 50MB
   - File type check
3. API generates presigned R2/S3 upload URL
4. Browser uploads directly to R2 (avoids Lambda invocation for large files)
5. API creates `FloorPlanImage` record in Electric SQL (status: `uploaded`)

**Validation rules:**

| Check | Rejection threshold |
|---|---|
| Resolution | < 500×500 or > 10000×10000 |
| File size | > 50MB |
| Aspect ratio | > 5:1 or < 1:5 (unlikely to be a floor plan) |
| Exif orientation | Auto-rotate applied |

**Edge cases:**
- PDF with multiple pages → extract first page, prompt user if more than one
- Very large images (>4000px) → downsample for model input, retain original for calibration

---

### Stage 2: Preprocessing (Python Lambda)

**Location:** Python Lambda (CPU, 1024MB memory, 30s timeout)

**Input:** `{ imageKey: string, calibration: CalibrationData }`

**Steps:**

```
1. Load image from R2
2. Convert to RGB (if PDF: render first page to image via pdf2image/pdftoppm)
3. Apply perspective correction (homography):
   H, _ = cv2.findHomography(src_corners, dst_corners)
   corrected = cv2.warpPerspective(img, H, (target_w, target_h))
4. Apply scale calibration:
   pixels_per_meter = euclidean_distance(p1_px, p2_px) / real_world_distance_m
5. Resize to model input dimensions (512×512, preserving aspect ratio with padding)
6. Convert to tensor: float32, normalized to [0,1], CHW format
7. Serialize tensor as raw bytes (or NPY format)
8. Return: { tensorBytes (base64), pixelsPerMeter, width, height }
```

**Why a separate step from inference?**
- GPU Lambda is expensive per-second. Preprocessing is pure CPU work that is cheaper to run on a standard Lambda.
- The preprocessing result is small (~3MB for a 512×512 float32 tensor), fast to transfer.
- If the GPU Lambda fails, we don't re-pay for preprocessing.

**Libraries used:**
- `opencv-python-headless` — perspective correction, resizing
- `pillow` — image loading and format handling
- `numpy` — tensor construction
- `pdf2image` / `pdftoppm` — PDF rasterization (bundled as Lambda layer)

---

### Stage 3: FloorPlanFormer Inference (C++ GPU Lambda)

**Location:** C++ Lambda (GPU, 5120MB+ memory, 60s timeout)

#### 3.1 Model Architecture Summary

FloorPlanFormer is a **multi-task Transformer** with an outer-to-inner feature refinement strategy. At a high level:

```
Input Image (512×512)
        │
        ▼
┌───────────────────┐
│   Backbone CNN    │  ← EfficientNet / ResNet feature extractor
│ (Feature Pyramid) │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Transformer      │  ← Global contextual attention
│  Encoder          │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Prompt Encoder   │  ← Learns spatial prompts for outer contours
│  + GCAM           │  ← Global Contextual Attention Module
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Mask Decoder     │  ← Generates segmentation masks
│  + MFRM           │  ← Masked Feature Refinement Module
└────────┬──────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│  Output Heads (parallel):                        │
│  • Wall segmentation (binary mask)               │
│  • Room classification (N+1 classes per pixel)   │
│  • Opening segmentation (doors + windows)        │
│  • Junction heatmaps (21-channel keypoints)      │
└──────────────────────────────────────────────────┘
```

**Key architectural innovations:**

| Component | Purpose |
|---|---|
| **GCAM (Global Contextual Attention Module)** | Generates clean outer contour masks by attending to the full spatial context |
| **MFRM (Masked Feature Refinement Module)** | Accurately delineates inner contours by modeling relationships between local inner and outer boundaries |
| **Prompt encoder** | Learns to generate spatial prompts for contour refinement (inspired by SAM) |
| **Multi-task heads** | Jointly optimizing wall, room, opening, and junction objectives produces better feature representations |

#### 3.2 ONNX Export & Optimization

```
Training (PyTorch):
  FloorPlanFormer checkpoint (.pth)
        │
        ▼
  torch.onnx.export():
    - dynamic axes for optional batch dimension
    - opset_version = 21
    - input: (1, 3, 512, 512) float32
    - output: tuple of (seg_mask, junctions, room_classes)
        │
        ▼
  Optimization:
    - FP16 quantization (reduces model size ~50%, minimal accuracy loss)
    - Graph optimization (onnxruntime-tools: transformers, constant folding)
    - Memory pattern optimization
        │
        ▼
  FloorPlanFormer.onnx (~200-400MB depending on backbone)
```

**Backbone comparison:**

| Backbone | Model Size (FP16) | Accuracy | Latency (GPU) |
|---|---|---|---|
| EfficientNet-B4 | ~85MB | Good | ~80ms |
| EfficientNet-B7 | ~200MB | Better | ~150ms |
| ResNet-152 | ~400MB | Best | ~200ms |

Recommendation: start with **EfficientNet-B7** for the MVP (best accuracy/speed tradeoff), use ResNet-152 for final production model.

#### 3.3 Output Specification

The model produces raw tensors that are post-processed on the GPU Lambda:

```cpp
struct ModelOutput {
    // shape: (1, 1, 512, 512), values: 0.0 (background) or 1.0 (wall)
    float* wallMask;

    // shape: (1, N_room_classes, 512, 512), argmax gives room type per pixel
    float* roomClassLogits;

    // shape: (1, 2, 512, 512), threshold gives door/window openings
    float* openingMask;

    // shape: (1, 21, 512, 512), peaks indicate junction locations + types
    float* junctionHeatmaps;

    // shape: (1, 256, 256), corner probability map
    float* cornerMap;
};
```

These are consumed by the vectorization step running in the same process.

#### 3.4 ONNX Runtime C++ Implementation

```cpp
// Key structure of the inference Lambda handler
#include <ort/onnxruntime_cxx_api.h>

class FloorPlanInference {
    Ort::Session session;
    Ort::MemoryInfo memoryInfo;

public:
    FloorPlanInference(const std::string& modelPath) {
        Ort::SessionOptions options;
        options.SetGraphOptimizationLevel(GraphOptimizationLevel::ORT_ENABLE_ALL);
        options.SetExecutionMode(ExecutionMode::ORT_SEQUENTIAL);
        // Enable CUDA if available
        if (hasCuda()) {
            OrtCUDAProviderOptions cudaOptions;
            cudaOptions.device_id = 0;
            options.AppendExecutionProvider_CUDA(cudaOptions);
        }
        session = Ort::Session(env, modelPath.c_str(), options);
    }

    ModelOutput infer(const float* inputTensor) {
        // Run inference → returns raw tensor outputs
        // No post-processing here — that's done in the vectorization pass
    }
};
```

---

### Stage 4: Vectorization (C++, same Lambda)

**Location:** Same process as inference (no serialization cost between stages)

The vectorization step converts raw model outputs into structured vector geometry. This runs in the same C++ process as inference to avoid transferring large tensors over inter-process communication.

#### 4.1 Contour Extraction

```cpp
// From wall mask → wall polygons
std::vector<Polygon> extractWalls(const float* wallMask, int width, int height) {
    // 1. Threshold mask at 0.5
    cv::Mat binary(height, width, CV_32F, const_cast<float*>(wallMask));
    cv::Mat thresh;
    cv::threshold(binary, thresh, 0.5f, 1.0f, cv::THRESH_BINARY);

    // 2. Morphological close to fill small gaps
    cv::morphologyEx(thresh, thresh, cv::MORPH_CLOSE,
                     cv::getStructuringElement(cv::MORPH_ELLIPSE, cv::Size(3, 3)));

    // 3. Find contours
    std::vector<std::vector<cv::Point>> contours;
    cv::findContours(thresh, contours, cv::RETR_LIST, cv::CHAIN_APPROX_SIMPLE);

    // 4. Filter by area (remove speckles)
    // 5. Classify as interior vs. exterior wall
    // 6. Return as world-space polygons using pixelsPerMeter
}
```

#### 4.2 Polygon Simplification

- **Douglas-Peucker algorithm** with epsilon proportional to scale (e.g., 0.01m tolerance)
- **Right-angle enforcement**: snap near-parallel segments to exact orthogonality
- **Corner cleanup**: merge near-vertices within threshold
- **Output:** clean wall polygons in world coordinates (meters)

#### 4.3 Topology Enforcement

- **Room closure verification**: each room polygon must form a closed loop
- **Wall sharing detection**: adjacent rooms share wall segments (no gaps or overlaps)
- **Opening alignment**: doors and windows must intersect detected wall segments
- **Consistency check**: room boundaries align with wall positions

```cpp
struct VectorFloorPlan {
    std::vector<Wall> walls;       // { id, vertices[], length, type (exterior/interior) }
    std::vector<Room> rooms;       // { id, name, vertices[], area, perimeter }
    std::vector<Opening> doors;    // { id, position, width, wallId }
    std::vector<Opening> windows;  // { id, position, width, height, wallId }
    double pixelsPerMeter;
    double totalArea;
};
```

#### 4.4 Room Labeling

The room classification logits from the model are argmaxed to assign per-pixel room types. The dominant type within each room polygon becomes the room label:

| Class ID | Room Type | Colour (3D viz) |
|---|---|---|
| 0 | Background | — |
| 1 | Bedroom | #4A90D9 |
| 2 | Living Room | #50C878 |
| 3 | Kitchen | #FF6B35 |
| 4 | Bathroom | #00B4D8 |
| 5 | Hallway | #E8D5B7 |
| 6 | Dining Room | #9B59B6 |
| 7 | Utility | #95A5A6 |
| 8+ | Other | #BDC3C7 |

**All metadata is in real-world units** (metres) because the calibration step provides `pixelsPerMeter`.

---

### Stage 5: 3D Extrusion (Browser, Three.js)

**Location:** Browser (React Three Fiber / Three.js)

The 3D extrusion runs **in the browser**, not on the server. This keeps the GPU Lambda focused on inference + vectorization and makes the 3D feel responsive (orbit controls, edits update in real-time).

**Pipeline:**

```
VectorFloorPlan JSON (from API)
        │
        ▼
┌───────────────────────────────┐
│  Three.js Extrusion Engine    │
│                               │
│  1. For each wall:            │
│     - Create Shape from       │
│       wall polygon            │
│     - ExtrudeGeometry(        │
│         height: 2.7m,         │
│         bevelEnabled: false   │
│       )                       │
│     - Assign material (wall   │
│       colour / texture)       │
│                               │
│  2. For each opening:         │
│     - Boolean subtract from   │
│       wall geometry           │
│     - Or: split wall into     │
│       two segments with gap   │
│                               │
│  3. For each room:            │
│     - Create floor plane      │
│     - Create ceiling plane    │
│     - Apply room colour       │
│     - Add room label (Sprite) │
│                               │
│  4. Add measurement overlay:  │
│     - Dimension lines on each │
│       wall segment            │
│     - Room area text overlay  │
│                               │
│  5. Add interactivity:        │
│     - Raycaster for clicks    │
│     - Hover highlighting      │
│     - Transform controls      │
└───────────────────────────────┘
```

**Key design decision:** We extrude in the browser, not on the server, because:

1. **Immediate feedback** — users can edit walls and see the 3D update in real-time
2. **No server GPU cost** — Three.js uses the client GPU which is idle anyway
3. **Export on demand** — GLB export uses the same geometry at the click of a button
4. **Progressive enhancement** — user sees a 2D plan immediately, 3D loads asynchronously

**Default ceiling height:** 2.7m (configurable per floor in Structa onboarding).

**Export formats:**

| Format | Library | Use case |
|---|---|---|
| glTF / GLB | Three.js GLTFExporter | 3D viewers, AR/VR |
| OBJ | Three.js OBJExporter | Blender, CAD software |
| DXF | Custom exporter | AutoCAD, professional workflows |
| PNG (2D) | Three.js screenshot | Project packs, quick sharing |

---

### Stage 6: Digital Twin Ingestion

**Location:** API Gateway → Electric SQL + Durable Streams

Once the user confirms the result, spatial metadata is extracted and written to Structa's data layer:

```typescript
// Written to Electric SQL (structured data for querying)
interface SpatialMetadata {
  projectId: string;
  floorPlanImageId: string;
  totalAreaM2: number;
  totalPerimeterM: number;
  roomBreakdown: {
    [roomType: string]: {
      count: number;
      totalAreaM2: number;
      avgAreaM2: number;
    };
  };
  wallBreakdown: {
    exteriorLengthM: number;
    interiorLengthM: number;
    totalLengthM: number;
  };
  openingCounts: {
    doors: number;
    windows: number;
  };
  ceilingHeightM: number;
}

// Written to Durable Streams (document for The Clerk context)
// Full VectorFloorPlan JSON — walls, rooms, openings with all geometry
```

**What this enables:**

- The Clerk can answer: "How big is my kitchen?" → `2.8m × 4.2m = 11.8m²`
- Material lists: "How much paint for living room?" → perimeter × ceiling height = wall area
- Cost estimates: "Kitchen extension" → existing kitchen volume anchors the estimate
- Sequencing: "Windows first" → window positions/configs from floor plan inform order

---

## 5. Lambda Design: GPU Custom Runtime

### 5.1 Architecture

```
┌───────────────────────────────────────────────────────────┐
│                AWS Lambda (GPU Custom Runtime)              │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Custom Runtime Bootstrap (using runtime API)         │  │
│  │  1. Load FloorPlanFormer.onnx into ONNX Runtime      │  │
│  │  2. Allocate CUDA context (warm start)               │  │
│  │  3. Start HTTP listener on :8080                     │  │
│  │  4. Signal runtime API: "ready"                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Per-Invocation Handler                              │  │
│  │  1. Receive: { tensorBytes (base64), scale, meta }  │  │
│  │  2. Deserialize tensor                                │  │
│  │  3. ONNX Run (CUDA): ~100-200ms                     │  │
│  │  4. Post-process: argmax, contour tracing (CPU)     │  │
│  │  5. Vectorize: simplify, label, compute (CPU)       │  │
│  │  6. Return: VectorFloorPlan JSON                     │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  GPU: NVIDIA T4 / L4 (available in Lambda GPU us-east-1)  │
│  Memory: 10,240MB (recommended for model + overhead)      │
│  Ephemeral storage: 512MB (sufficient for temp files)      │
│  Timeout: 60s (pipeline completes in <5s)                │
└───────────────────────────────────────────────────────────┘
```

### 5.2 Cold Start Strategy

GPU Lambda cold starts are **~30-45 seconds** (GPU context initialization + model loading). We mitigate this with:

| Strategy | Description |
|---|---|
| **Provisioned Concurrency** | 1-2 warm instances during business hours. Cost: ~$30-60/mo |
| **SnapStart (Lambda)** | Pre-load model during snapshot creation. Cuts cold start to ~5-10s. |
| **Warm-up pings** | CloudWatch Events pings every 5 minutes during expected usage windows |
| **Optimistic loading** | Model loaded at function init, not per-invocation |

**Cold vs. warm latency:**

| State | Latency |
|---|---|
| Cold start (no provisioned) | ~35s |
| Cold start (SnapStart) | ~8s |
| Provisioned concurrency | ~100ms |
| Warm (after recent invocation) | ~400ms |

For an MVP, provisioned concurrency of 1 is sufficient. Scale up as usage grows.

### 5.3 Payload Interface

The C++ Lambda receives payload from the Python Preprocess Lambda via direct invocation (or SQS for async):

```json
{
  "tensorBytes": "<base64-encoded float32 tensor, 3×512×512 = 3,145,728 bytes>",
  "pixelsPerMeter": 48.7,
  "metadata": {
    "imageKey": "uploads/abc123.png",
    "originalWidth": 2048,
    "originalHeight": 1536,
    "inputWidth": 512,
    "inputHeight": 512
  }
}
```

**Response:**

```json
{
  "status": "success",
  "vectorFloorPlan": {
    "walls": [
      { "id": "w1", "vertices": [[0,0], [4.2,0], [4.2,2.8], [0,2.8]],
        "length": 4.2, "type": "exterior" }
    ],
    "rooms": [
      { "id": "r1", "name": "Living Room",
        "vertices": [[0,0], [4.2,0], [4.2,2.8], [0,2.8]],
        "area": 11.76, "perimeter": 14.0 }
    ],
    "doors": [],
    "windows": [],
    "pixelsPerMeter": 48.7,
    "totalArea": 11.76,
    "confidence": 0.92
  },
  "inferenceTimeMs": 187,
  "vectorizationTimeMs": 312
}
```

### 5.4 Building the C++ Lambda

**Dependencies:**

| Library | Purpose |
|---|---|
| `onnxruntime` (CUDA) | Model inference |
| `OpenCV` (C++) | Image processing, contour extraction |
| `libcurl` / `aws-lambda-cpp` | Lambda runtime API |
| `nlohmann/json` | JSON serialization |
| `Eigen` | Geometry math (optional, for simplification) |

**Dockerfile (multi-stage build):**

```dockerfile
FROM nvidia/cuda:12.2-runtime AS base
# ... install onnxruntime, opencv, etc.

FROM public.ecr.aws/lambda/custom-runtime:latest
COPY --from=base /opt/model /opt/model
COPY --from=base /opt/bin/infer /opt/bin/infer
COPY FloorPlanFormer.onnx /opt/model/
COPY bootstrap /opt/
# bootstrap handles Lambda runtime API + starts HTTP listener
```

---

## 6. API Routes

| Route | Method | Auth | Input | Output | Notes |
|---|---|---|---|---|---|
| `/api/floorplan/upload` | POST | Required | `multipart: file` | `{ id, presignedUrl }` | Returns presigned PUT URL for direct-to-R2 upload |
| `/api/floorplan/:id/upload-complete` | POST | Required | `{ id, key }` | `{ status: "uploaded" }` | Confirms upload, creates DB record |
| `/api/floorplan/:id/calibrate` | PUT | Required | `{ corners: Point4[], scaleRef: { p1, p2, distanceM } }` | `{ previewUrl, pixelsPerMeter }` | Stores calibration, returns corrected preview |
| `/api/floorplan/:id/process` | POST | Required | — | `{ jobId, status: "processing" }` | Triggers Step Functions pipeline |
| `/api/floorplan/:id/status` | GET | Required | — | `{ status, progress?, result? }` | Poll endpoint. Status: `queued → preprocessing → inferring → vectorizing → complete/failed` |
| `/api/floorplan/:id/result` | GET | Required | — | `{ vectorFloorPlan, modelUrl, thumbnailUrl }` | Returns processed result data |
| `/api/floorplan/:id/confirm` | POST | Required | `{ edits?: Partial<VectorFloorPlan>, ceilingHeight? }` | `{ digitalTwinId }` | Accept result, ingest into digital twin |
| `/api/floorplan/:id/export` | GET | Required | `?format=glb\|obj\|dxf\|png` | Binary file | Export in requested format |
| `/api/floorplan/:id/feedback` | POST | Required | `{ helpful: bool, issues?: string }` | `{ ok: true }` | Anonymous feedback for model improvement |

### Example: Process Polling Flow

```typescript
// Client-side (TanStack Query)
const processMutation = useMutation({
  mutationFn: (id: string) => api.post(`/floorplan/${id}/process`),
  onSuccess: (data) => {
    // Start polling
    const interval = setInterval(async () => {
      const status = await api.get(`/floorplan/${data.jobId}/status`);
      if (status.status === 'complete') {
        clearInterval(interval);
        queryClient.setQueryData(['floorplan', id], status.result);
      }
    }, 500);
  },
});
```

---

## 7. Data Model

### 7.1 Electric SQL Schema

```typescript
// packages/core/src/db/schema/floorplan-ai.ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const floorplanImages = sqliteTable('floorplan_images', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull(),
  originalKey: text('original_key').notNull(),      // R2 key
  status: text('status', {
    enum: ['uploaded', 'calibrated', 'processing', 'completed', 'failed', 'confirmed']
  }).notNull().default('uploaded'),
  calibrationCorners: text('calibration_corners'),    // JSON: Point4[]
  scaleRef: text('scale_ref'),                        // JSON: { p1, p2, distanceM }
  pixelsPerMeter: real('pixels_per_meter'),
  resultKey: text('result_key'),                      // R2 key for VectorFloorPlan JSON
  modelKey: text('model_key'),                        // R2 key for GLB model
  confidence: real('confidence'),
  errorMessage: text('error_message'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const spatialMetadata = sqliteTable('spatial_metadata', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull(),
  floorplanImageId: text('floorplan_image_id').references(() => floorplanImages.id),
  floorPlanVersionId: text('floor_plan_version_id'), // Link to existing floor plan editor version
  totalAreaM2: real('total_area_m2'),
  totalPerimeterM: real('total_perimeter_m'),
  ceilingHeightM: real('ceiling_height_m').default(2.7),
  roomBreakdown: text('room_breakdown'),              // JSON
  wallBreakdown: text('wall_breakdown'),              // JSON
  openingCounts: text('opening_counts'),              // JSON
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
```

### 7.2 Durable Streams Document

```typescript
// Full vector floor plan stored as a document (CRDT-friendly for editing)
interface DurableFloorPlanDocument {
  id: string;
  projectId: string;
  type: 'ai-processed' | 'manual-drawn' | 'hybrid';
  sourceImageId?: string;
  walls: Wall[];
  rooms: Room[];
  doors: Opening[];
  windows: Opening[];
  scale: {
    pixelsPerMeter: number;
    calibratedDistance: number;
  };
  metadata: {
    modelConfidence: number;
    processingTimeMs: number;
    modelVersion: string;
  };
}

interface Wall {
  id: string;
  vertices: [number, number][];    // World-space coordinates (meters)
  length: number;
  type: 'exterior' | 'interior';
  thickness?: number;               // Default 0.25m
  adjacencies: string[];            // IDs of adjacent rooms
}

interface Room {
  id: string;
  name: string;                     // e.g., "Kitchen", "Bedroom"
  type: RoomType;
  vertices: [number, number][];     // Outer boundary
  area: number;                     // Square meters
  perimeter: number;                // Meters
  openings: string[];               // IDs of doors/windows in this room
}

interface Opening {
  id: string;
  type: 'door' | 'window';
  wallId: string;
  position: [number, number];       // Start point on wall
  width: number;
  height: number;                   // Window height (door default = wall height)
  params?: Record<string, unknown>; // e.g., { glazing: 'double', swing: 'inward' }
}

type RoomType =
  | 'bedroom' | 'living_room' | 'kitchen' | 'bathroom'
  | 'hallway' | 'dining_room' | 'utility' | 'office'
  | 'toilet' | 'storage' | 'garage' | 'garden'
  | 'balcony' | 'other';
```

---

## 8. FloorPlanFormer Integration

### 8.1 Training Strategy

```
Phase 1: Pre-training (foundation model)
├── Dataset: CubiCasa5K (5,000 floor plans, CC BY-NC)
├── Dataset: RPLAN (80,000 floor plans, research only)
├── Dataset: FloorPlan8K (8,200 images, 77,434 instances)
├── Augmentation: Random rotation, scaling, color jitter, synthetic noise
└── Epochs: 100 (or until convergence)

Phase 2: Fine-tuning (domain adaptation)
├── Dataset: UK-specific floor plans (scanned survey drawings)
├── Target: Differentiate UK conventions (metric units, specific symbols)
├── Augmentation: Scan noise, fold lines, handwritten annotations
└── Epochs: 20-30

Phase 3: Iterative improvement
├── Collect anonymized feedback from user confirmations/rejections
├── Semi-supervised learning on confirmed results (pseudo-labeling)
└── Quarterly re-training
```

**Important licensing note:** CubiCasa5K is CC BY-NC (non-commercial). RPLAN is research-only. For commercial use, you need:
1. A proprietary dataset (annotate your own floor plans)
2. Or use models trained on permissively licensed data (e.g., FloorPlan8K)
3. Or fine-tune a model pre-trained on non-copyrighted synthetic data

### 8.2 Export Pipeline (PyTorch → ONNX)

```bash
# Export FloorPlanFormer to ONNX with FP16 optimization
python scripts/export_onnx.py \
  --checkpoint checkpoints/floorplanformer_b7.pt \
  --output model/floorplanformer.onnx \
  --input-size 512 512 \
  --fp16 \
  --opset 21

# Validate ONNX output
python scripts/validate_onnx.py \
  --model model/floorplanformer.onnx \
  --test-samples 10

# Benchmark
python scripts/benchmark_onnx.py \
  --model model/floorplanformer.onnx \
  --provider CUDAExecutionProvider \
  --iterations 100
```

**ONNX runtime configuration for deployment:**

```cpp
Ort::SessionOptions options;
options.SetGraphOptimizationLevel(ORT_ENABLE_ALL);
options.SetIntraOpNumThreads(4);
options.SetExecutionMode(ORT_SEQUENTIAL);
options.SetInterOpNumThreads(1);

// Enable CUDA with FP16 support
OrtCUDAProviderOptions cuda;
cuda.device_id = 0;
cuda.cudnn_conv_algo_search = OrtCudnnConvAlgoSearch::EXHAUSTIVE;
cuda.do_copy_in_default_stream = true;
cuda.has_user_compute_stream = false;
cuda.default_memory_arena_cfg = nullptr;
cuda.tunable_op_enabled = false;
cuda.enable_trimmed_onnx_model = false;
options.AppendExecutionProvider_CUDA(cuda);
```

---

## 9. Calibration & Scale — Design Detail

The calibration step is the **most user-facing part** and deserves careful design.

### 9.1 Perspective Correction

```
User drags 4 corner handles to outline the floor plan area:

    ┌───┬──────────────────────┐
    │   │                      │
    │   │    [image]           │
    │   │                      │
    └───┴──────────────────────┘
    ↑                        ↑
   corner 1               corner 4

These 4 points + target rectangle → homography matrix H
cv2.findHomography(src_points, dst_points) → warped planar view
```

The output is an orthographic (top-down) view of the floor plan, removing camera perspective distortion.

### 9.2 Scale Calculation

```
User clicks two points on the corrected image:

    p1 = (x1, y1)          p2 = (x2, y2)
    │                         │
    └─────────────────────────┘
    "Enter the real distance: [ 4.2 ] metres"

pixel_distance = sqrt((x2-x1)² + (y2-y1)²)
pixels_per_meter = pixel_distance / 4.2
```

**This single value anchors all downstream measurements:**
- Wall lengths = pixel_length / pixels_per_meter
- Room areas = pixel_area / (pixels_per_meter²)
- 3D model = extruded to real-world scale

### 9.3 Validation

- If the user-entered distance is wildly inconsistent with the image resolution (e.g., pixel distance suggests 50m for a room), we flag it
- Users can re-calibrate at any time (changing the scale recomputes all measurements)
- Multiple calibration points (optional) enables consistency cross-checking

---

## 10. Integration with Structa

### 10.1 Digital Twin Population

When a user confirms the AI result, the following happens:

1. **Create/update floor plan version** in Durable Streams (the VectorFloorPlan becomes editable geometry)
2. **Write spatial metadata** to Electric SQL (room areas, wall lengths, opening counts)
3. **Link to project** — the floor plan appears in the project's floor plan list
4. **Notify The Clerk** — the new spatial context is available for AI queries

### 10.2 The Clerk Integration

The Clerk's RAG context is enriched with:

```typescript
// Added to AI context when answering renovation questions:
const spatialContext = {
  property: {
    totalArea: 85.5,           // m²
    roomCount: 6,
    wallLength: 68.2,          // m (exterior)
  },
  rooms: [
    { name: "Kitchen", area: 12.3, perimeter: 14.8, walls: 4 },
    { name: "Living Room", area: 18.7, perimeter: 17.2, walls: 4 },
  ],
  openings: {
    doors: 8,
    windows: 6,
  },
};
```

This enables responses like:
> "Your living room is 18.7m² with four walls. Painting it would require approximately 2 coats × 54m² of wall area = ~10 litres of emulsion."

### 10.3 Floor Plan Editor Interop

The AI-generated vector floor plan can be **edited in the existing CAD-lite editor**:

- User confirms → VectorFloorPlan loads into the editor
- User can drag walls, split rooms, adjust openings
- Edits are synced via Yjs CRDT (existing real-time collaboration)
- On save, spatial metadata is recalculated and updated

This means the AI result is a **starting point**, not a final product. The user always has full control.

---

## 11. Performance Budget

### 11.1 Latency Targets

| Stage | Target (P50) | Target (P95) | Compute | Notes |
|---|---|---|---|---|
| Upload (browser → R2) | 500ms | 2s | Network | Depends on file size |
| Preprocessing (Python Lambda) | 150ms | 400ms | CPU | OpenCV resize + warp |
| Inference (GPU Lambda) | 200ms | 500ms | GPU | FloorPlanFormer forward pass |
| Vectorization (GPU Lambda, same process) | 300ms | 700ms | CPU | Contours + simplify + label |
| **Total server-side** | **~650ms** | **~1.6s** | — | Excluding upload |
| 3D extrusion (browser) | 100ms | 300ms | Client GPU | Three.js geometry generation |
| **Total user-facing** | **~2-4s** | **~5-8s** | — | Including upload + polling |

### 11.2 Cost Estimates (per 1,000 invocations)

| Component | Cost | Notes |
|---|---|---|
| Python Lambda (CPU, 1GB, 0.5s) | ~$0.05 | Standard Lambda pricing |
| GPU Lambda (10GB, T4, 1s) | ~$0.80 | GPU Lambda pricing (~$0.80/GB-hr for T4) |
| Provisioned concurrency (1 unit) | ~$0.60/hr | ~$432/mo if 24/7. Use during business hours only |
| R2 storage | Negligible | $0.015/GB/mo |
| Step Functions | ~$0.03 | Per 1,000 state transitions |
| **Total per floor plan** | **~$0.88** | Dominated by GPU compute. ~100 plans/mo = ~$88/mo |

**Cost optimization:**
- Use Spot/Weights on GPU Lambda (available soon in some regions)
- Batch infrequent processing into off-peak hours
- Cache identical floor plans (unlikely but possible)

### 11.3 Throughput

- Single GPU Lambda handles ~3-5 requests/second (synchronous)
- Concurrency limit: 10-100 depending on AWS account limits (request increase for production)
- Maximum throughput: ~30-500 floor plans per minute with sufficient concurrency

---

## 12. Phasing Plan

| Phase | Focus | Key Deliverables | Estimated Effort |
|---|---|---|---|
| **A** | **Training + C++ Inference** | FloorPlanFormer trained on CubiCasa5K; ONNX export working; C++ Lambda running model inference returning raw segmentation masks | 4-6 weeks |
| **B** | **Vectorization in C++** | Contour extraction, polygon simplification, topology enforcement, room labeling, measurement computation — all in C++. Combined infer+vectorize Lambda returning structured VectorFloorPlan JSON | 2-3 weeks |
| **C** | **Frontend + 3D** | Upload widget, calibration UI, Three.js 3D viewer, API integration, edit/confirm/reject flow | 3-4 weeks |
| **D** | **Digital Twin Wire** | Spatial metadata ingestion into Electric SQL + Durable Streams; Clerk context integration; floor plan editor interop | 1-2 weeks |
| **E** | **Polish & Edge Cases** | Non-Manhattan walls, low-confidence flags, multi-floor detection, export formats (DXF, IFC), user feedback collection | 2-3 weeks |
| | **Total** | | **12-18 weeks** |

### Phase A: Training + C++ Inference (Weeks 1-6)

```
Week 1-2: Environment setup & dataset curation
  - Set up GPU training environment
  - Curate training data (CubiCasa5K + RPLAN)
  - Implement data augmentation pipeline
  - Set up experiment tracking (Weights & Biases)

Week 3-4: Model training
  - Train FloorPlanFormer from reference paper
  - Iterate on hyperparameters (learning rate, loss weights)
  - Validate on held-out test set
  - Export to ONNX with FP16 optimization

Week 5-6: C++ Lambda build
  - Build C++ Lambda custom runtime with ONNX Runtime
  - Implement image → tensor pipeline
  - Validate CUDA inference matches PyTorch output
  - Benchmark latency and memory usage
  - Set up provisioned concurrency + SnapStart
```

### Phase B: Vectorization in C++ (Weeks 7-9)

```
Week 7: Contour extraction pipeline
  - Thread-safe OpenCV contour extraction from model output
  - Morphological cleanup (close gaps, remove speckles)
  - Contour filtering by area and shape

Week 8: Polygon simplification & topology
  - Douglas-Peucker with scale-dependent epsilon
  - Right-angle snapping for Manhattan enforcement
  - Room closure verification and wall sharing detection

Week 9: Labeling & measurement
  - Room type assignment from classification logits
  - World-space measurement computation
  - JSON output serialization
  - End-to-end integration test with Phase A Lambda
```

### Phase C: Frontend + 3D (Weeks 10-13)

```
Week 10-11: Upload & calibration UI
  - Image upload widget with drag-and-drop
  - Four-point corner drag interface
  - Two-click scale calibration
  - Perspective correction preview

Week 12-13: 3D viewer
  - Three.js / React Three Fiber scene setup
  - Wall extrusion from VectorFloorPlan data
  - Room coloring and labeling
  - Measurement overlays
  - Orbit controls, click-to-inspect, hover highlighting
  - Edit mode (drag wall vertices)
  - Export (GLB, OBJ, PNG)
```

### Phase D: Digital Twin Wire (Week 14-15)

```
Week 14: Data integration
  - Electric SQL schema for spatial metadata
  - Durable Streams document for VectorFloorPlan
  - Confirm → ingest flow

Week 15: Clerk integration
  - Spatial context in AI prompts
  - Example: "How big is the kitchen?" → answers from floor plan data
  - Example: "How much paint needed?" → wall area calculation
  - Floor plan editor interop (AI result → editable)
```

### Phase E: Polish (Weeks 16-18)

```
- Non-Manhattan wall handling
- User feedback collection and model improvement pipeline
- Multi-floor detection
- DXF/IFC export for professional workflows
- Accessibility (keyboard nav, screen reader for room labels)
- Error states and retry logic
- Documentation
```

---

## 13. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| **CubiCasa5K is CC BY-NC** | Cannot use for commercial product without license | High | Use for prototyping only. Train on proprietary or synthetic data for production. |
| **GPU Lambda cold start** | Poor UX on first daily use | Medium | Provisioned concurrency (1 unit) + SnapStart. Inform user "first load may take a moment." |
| **FloorPlanFormer model doesn't generalize to UK survey floor plans** | Poor accuracy on real user data | Medium | Fine-tune on UK-specific data. Collect feedback for iterative improvement. |
| **Non-Manhattan floor plans (angled walls)** | Model produces poor results | Medium | Flag low confidence. Fall back to manual drawing. Phase E addresses this. |
| **Large PDF uploads (>100 pages)** | Long processing, poor UX | Low | Cap at first page for MVP. Offer page selection in Phase E. |
| **User enters wrong scale** | Entire model is wrong | Low | Validate against image dimensions. Allow re-calibration without re-processing. |
| **ONNX export differences from PyTorch** | Numerical drift in output | Low | Validate with per-tensor comparison tools (torch.onnx.export validation suite). |

---

## 14. Open Questions

- **GPU Lambda availability:** AWS GPU Lambda (T4/L4) is currently limited to specific regions (us-east-1, us-west-2, eu-west-1). We need to confirm availability in our deployment region.
- **FloorPlanFormer weights:** The paper authors may release pre-trained weights. If available, this saves weeks of training time. If not, we train from scratch using the paper specification.
- **UK floor plan conventions:** Do UK survey floor plans differ enough from the training data to require significant fine-tuning? We should collect a sample of 50-100 UK plans early and run inference to assess quality.
- **Commercial dataset licensing:** What's the fastest path to a permissively-licensed training dataset? Options: (a) license CubiCasa5K commercially, (b) create synthetic floor plans, (c) partner with a floor plan data provider.

---

## Appendix A: Related Work & References

1. **FloorPlanFormer** — Liang et al., AAAI 2026. Multi-task Transformer with outer-to-inner feature refinement. [Paper](https://ojs.aaai.org/index.php/AAAI/article/view/37625)
2. **FPP-Former** — Wang et al., 2026. Transformer-based end-to-end for large-scale floor plates. [Paper](http://scis.scichina.com/en/2026/152106.pdf)
3. **MitUNet** — Parashchuk et al., 2026. Hybrid Mix-Transformer + U-Net for wall segmentation. [Paper](https://arxiv.org/abs/2512.02413)
4. **RoomFormer** — Yue et al., CVPR 2023. Two-level query Transformer for floor plan reconstruction. [Project](https://ywyue.github.io/RoomFormer/)
5. **CubiCasa5K** — Kalervo et al., 2019. Benchmark dataset of 5,000 floor plans. [Dataset](https://github.com/CubiCasa/CubiCasa5k)
6. **RPLAN** — Wu et al., 2019. 80,000 raster floor plans. [Dataset](https://github.com/art-programmer/FloorplanTransformation)
7. **ResPlan** — Abouagour & Garyfallidis, 2025. 17,000 vector-graph floor plans. [Paper](https://arxiv.org/abs/2508.14006)
8. **Raster-to-Vector** — Liu et al., ICCV 2017. Foundational paper on learning-based floor plan parsing. [Paper](https://art-programmer.github.io/floorplan-transformation.html)

## Appendix B: Glossary

| Term | Definition |
|---|---|
| **Homography** | 3×3 matrix transformation that maps points between two planar surfaces. Used to correct perspective distortion. |
| **Manhattan world** | Assumption that walls meet at right angles (90° corners). Most floor plans follow this. |
| **ONNX** | Open Neural Network Exchange — an open format for ML model interoperability. |
| **CRDT** | Conflict-free Replicated Data Type — enables real-time collaborative editing (Yjs). |
| **GPU Lambda** | AWS Lambda with attached NVIDIA GPU (T4 or L4) for accelerated inference. |
| **Digital twin** | Structa's spatial data model: rooms, walls, openings with measurements and materials. |
| **Vectorization** | Converting raster/segmentation output into structured vector polygons (walls, rooms). |
| **Pixels per meter** | Calibration factor that converts image coordinates to real-world measurements. |
