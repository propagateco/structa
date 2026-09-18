# Crown Molding / Coving Compound Angle Calculations

## Overview

This document describes the mathematical formulas and principles for calculating compound miter and bevel angles when cutting crown molding (also called coving or cornice) for installation at corners. These calculations enable The Clerk to provide precise cutting instructions for renovation projects involving decorative molding installation.

---

## 1. The Core Problem

When installing crown molding at a corner, you need to cut the molding at specific compound angles so that two pieces fit together seamlessly. The challenge is that crown molding doesn't sit flat against a wall—it's mounted at an angle (called the **spring angle**), and corners can be various angles (not just 90°). This creates a 3D geometric problem requiring both:

- **Miter Angle**: Rotation of the saw base (left/right swing)
- **Bevel Angle**: Tilt of the saw blade

---

## 2. Input Parameters

| Parameter | Description | Common Values |
|-----------|-------------|---------------|
| **Spring Angle (B)** | The angle at which molding sits against the wall, measured from vertical | 38° (38/52 crown), 45° (45/45 crown), custom |
| **Wall Angle (A)** | The angle between two walls meeting at a corner | 90° (standard), 135° (bay windows), 120°, 45°, etc. |
| **Corner Type** | Inside corner (concave) or Outside corner (convex) | N/A |
| **Ceiling Pitch** | For vaulted/raking ceilings | 0° for flat ceilings |
| **Corner Side** | Left piece or Right piece | Affects saw setup orientation |

### Understanding Spring Angle

Most crown molding is manufactured with either:
- **38° spring angle** (38/52 crown): 38° against wall, 52° against ceiling - most decorative profiles
- **45° spring angle** (45/45 crown): 45° against wall, 45° against ceiling - simple, symmetrical profiles

The spring angle is the angle between the back face of the molding and the wall when installed. It determines how the molding "nests" in the corner between wall and ceiling.

For custom molding, the spring angle can be measured:
```
Spring Angle = arctan(height / projection)
```
Where:
- `height` = vertical rise from wall
- `projection` = horizontal extension from wall

Example: molding 75mm tall, projecting 77mm:
```
Spring Angle = arctan(75 / 77) = arctan(0.974) = 44.25°
```

---

## 3. Output Values

| Output | Description | Saw Setting |
|--------|-------------|-------------|
| **Miter Angle** | Angle the saw turns left/right from center | Rotational setting on saw base |
| **Bevel Angle** | Angle the saw blade tilts from vertical | Tilt setting on saw arm |

---

## 4. The Mathematical Formulas

### Core Formulas (for molding laid flat in compound miter saw)

```
Miter = arctan(cos(Spring) × tan(Wall/2))
Bevel = arcsin(sin(Spring) × sin(Wall/2))
```

Where:
- **Spring** = spring angle of the molding (in radians or degrees)
- **Wall** = corner/wall angle (in radians or degrees)

### Mathematical Derivation

The derivation uses 3D vector geometry and trigonometry:

#### For Miter Angle

1. Consider the molding's inside surface projected onto the horizontal plane
2. The miter angle relates to the projection of the corner angle through the tilted molding surface
3. The relationship is:
   ```
   tan(miter) = cos(φ) × tan(θ/2)
   ```
   Where:
   - `φ` (phi) = spring angle
   - `θ` (theta) = corner angle (wall angle)
   - `θ/2` = half the corner angle (since we cut both pieces)

4. Therefore:
   ```
   miter = arctan(cos(φ) × tan(θ/2))
   ```

#### For Bevel Angle

1. Uses surface normal vectors in 3D space
2. The inner surface normal vector `s` for a molding tilted by angle φ:
   ```
   s = <sin(φ), 0, cos(φ)>
   ```
3. The cutting plane normal vector `c` that includes the origin:
   ```
   c = <sin(θ/2), -cos(θ/2), 0>
   ```
4. The angle β between the side surface and cutting plane is the same as the angle between their normals
5. Using the geometric definition of the dot product:
   ```
   s · c = |s| |c| cos(β)
   ```
   Where both |s| and |c| are unit vectors (length = 1)
6. Solving for β:
   ```
   β = arccos(s · c)
     = arccos(<sin(φ), 0, cos(φ)> · <sin(θ/2), -cos(θ/2), 0>)
     = arccos(sin(φ) × sin(θ/2))
   ```
7. The bevel angle is the complement to β:
   ```
   bevel = 90° - arccos(sin(φ) × sin(θ/2))
          = arcsin(sin(φ) × sin(θ/2))
   ```

### Alternative Formula Forms

There are multiple equivalent formulations derived from trigonometric identities:

**Relationship between miter, bevel, and spring:**
```
tan(Bevel) = sin(Miter) ÷ tan(Spring)
cos(Bevel) = sin(Wall) ÷ cos(Miter)
cos(Bevel) = sin(Spring) × cos(Wall) ÷ sin(Miter)
sin(Bevel) = tan(Miter) × sin(Wall) ÷ tan(Spring)
```

**Calculate Miter first, then Bevel:**
```
tan(Bevel) = sin(Miter) ÷ tan(Spring)
cos(Bevel) = sin(Wall) ÷ cos(Miter)
cos(Bevel) = sin(Spring) × cos(Wall) ÷ sin(Miter)
```

**Calculate Bevel first, then Miter:**
```
tan(Miter) = sin(Bevel) × tan(Spring) ÷ sin(Wall)
cos(Miter) = sin(Wall) ÷ cos(Bevel)
sin(Miter) = tan(Bevel) × tan(Spring)
sin(Miter) = sin(Spring) × cos(Wall) ÷ cos(Bevel)
```

---

## 5. Two Cutting Methods

### Method 1: Non-Compound (Vertically Nested)

**Approach**: Place molding in miter saw as it would sit against wall and ceiling.

**Setup:**
- Bottom of molding against the fence
- Top of molding against the table
- Molded angled "flats" on back rest squarely on fence and base

**Calculations:**
```
Miter Angle = Wall Angle / 2
Bevel Angle = 0° (no bevel required)
```

**Example**: 90° corner → Miter = 45°

**Pros**: Simpler, no bevel angle calculation needed
**Cons**: Requires saw with tall fence to accommodate molding standing up

---

### Method 2: Compound (Flat Down)

**Approach**: Place molding flat on saw table with decorative face up.

**Setup:**
- Broad back surface of molding down flat on saw table
- Decorative profile facing upward
- Top edge of molding may or may not touch fence (depends on saw)

**Calculations**: Use the core formulas above:
```
Miter = arctan(cos(Spring) × tan(Wall/2))
Bevel = arcsin(sin(Spring) × sin(Wall/2))
```

**Pros**: Works with standard compound miter saws, more stable
**Cons**: Requires both miter and bevel angle calculations

This is the method used by most calculators and what this document focuses on.

---

## 6. Example Calculations

### Example 1: Standard Corner (90°) with 38° Spring Crown

```
Given:
  Spring Angle = 38°
  Wall Angle = 90°

Miter = arctan(cos(38°) × tan(90°/2))
      = arctan(0.7880 × tan(45°))
      = arctan(0.7880 × 1.0)
      = arctan(0.7880)
      = 38.22°

Bevel = arcsin(sin(38°) × sin(45°))
      = arcsin(0.6157 × 0.7071)
      = arcsin(0.4354)
      = 25.81°

Result: Miter = 38.2°, Bevel = 25.8°
```

### Example 2: Bay Window (135°) with 38° Spring

```
Given:
  Spring Angle = 38°
  Wall Angle = 135°

Miter = arctan(cos(38°) × tan(67.5°))
      = arctan(0.7880 × 2.4142)
      = arctan(1.9028)
      = 62.26°

Bevel = arcsin(sin(38°) × sin(67.5°))
      = arcsin(0.6157 × 0.9239)
      = arcsin(0.5688)
      = 34.64°

Result: Miter = 62.3°, Bevel = 34.6°
```

### Example 3: 45° Spring Crown (45/45) with 90° Corner

```
Given:
  Spring Angle = 45°
  Wall Angle = 90°

Miter = arctan(cos(45°) × tan(45°))
      = arctan(0.7071 × 1.0)
      = arctan(0.7071)
      = 35.26°

Bevel = arcsin(sin(45°) × sin(45°))
      = arcsin(0.7071 × 0.7071)
      = arcsin(0.5000)
      = 30.00°

Result: Miter = 35.3°, Bevel = 30.0°
```

### Example 4: Custom Spring Angle (44.25°) with 90° Corner

For a molding measuring 75mm height × 77mm projection:
```
Given:
  Spring Angle = 44.25° (from arctan(75/77))
  Wall Angle = 90°

Miter = arctan(cos(44.25°) × tan(45°))
      = arctan(0.7163 × 1.0)
      = arctan(0.7163)
      = 35.61°

Bevel = arcsin(sin(44.25°) × sin(45°))
      = arcsin(0.6988 × 0.7071)
      = arcsin(0.4942)
      = 29.61°

Result: Miter = 35.6°, Bevel = 29.6°
```

---

## 7. Special Cases

### Vaulted/Sloped Ceilings

When ceilings are not horizontal (vaulted, cathedral, tray ceilings), an additional angle is required:

```
Additional Parameter: Ceiling Pitch Angle (α)
```

The calculations become more complex, involving the interaction between:
- Spring angle (molding to wall)
- Ceiling pitch (wall to ceiling plane)
- Wall angle (corner between walls)

Simplified approach for shallow pitches: Use effective spring angle:
```
Effective Spring = arctan(tan(Spring) × cos(Ceiling Pitch))
```

### Polygon Rooms (Hexagon, Octagon, etc.)

For rooms with more than 4 sides (polygonal floor plans):

```
Wall Angle = 360° / Number of Sides
```

Examples:
- Pentagon (5 sides): 360° / 5 = 72° wall angle
- Hexagon (6 sides): 360° / 6 = 60° wall angle
- Octagon (8 sides): 360° / 8 = 45° wall angle
- Decagon (10 sides): 360° / 10 = 36° wall angle
- Dodecagon (12 sides): 360° / 12 = 30° wall angle

Use the wall angle in the standard formulas with the appropriate spring angle.

### Radius Corners

Curved corners (radiused corners) are typically built using multiple straight pieces. The angle for each piece:

```
Radius Corner Angle = 180° + (90° - Number of Pieces)
```

Or calculate based on number of pieces:
```
Piece Angle = 180° / Number of Pieces
```

Examples:
- 1-piece radius corner: 180° angle
- 2-piece radius corner: 90° angle each
- 3-piece radius corner: 60° angle each

### Inside vs Outside Corners

**Mathematically**: The miter and bevel angles are **identical** for inside and outside corners.

**Practically**: The difference is in how you orient the piece in the saw:
- **Inside corner**: The top of the molding will be shorter than the bottom
- **Outside corner**: The bottom of the molding will be shorter than the top

---

## 8. Reference Tables

### Common Spring Angle 38° (38/52 Crown)

| Wall Angle | Miter Angle | Bevel Angle |
|-----------|-------------|-------------|
| 45° | 56.07° | 46.72° |
| 90° | 31.62° | 33.86° |
| 120° | 19.57° | 19.99° |
| 135° | 14.31° | 17.55° |
| 270° | 31.62° | 33.86° |

### Common Spring Angle 45° (45/45 Crown)

| Wall Angle | Miter Angle | Bevel Angle |
|-----------|-------------|-------------|
| 45° | 45.00° | 45.00° |
| 90° | 35.26° | 30.00° |
| 120° | 25.29° | 23.13° |
| 135° | 22.50° | 20.71° |
| 270° | 35.26° | 30.00° |

### Polygon Angles (38° Spring)

| Shape | Sides | Wall Angle | Miter | Bevel | Upside Down Angle |
|-------|--------|-------------|---------|---------|-------------------|
| Pentagon | 5 | 72.00° | 24.10° | 27.59° |
| Hexagon | 6 | 60.00° | 19.57° | 23.20° |
| Heptagon | 7 | 51.43° | 16.51° | 20.08° |
| Octagon | 8 | 45.00° | 14.31° | 17.55° |
| Nonagon | 9 | 40.00° | 12.63° | 15.64° |
| Decagon | 10 | 36.00° | 11.31° | 14.09° |
| Dodecagon | 12 | 30.00° | 9.37° | 11.77° |

---

## 9. Implementation Guide (for Structa)

### TypeScript/JavaScript Implementation

```typescript
/**
 * Calculate compound miter and bevel angles for crown molding
 * @param springAngle - Angle at which molding sits against wall (degrees)
 * @param wallAngle - Angle between walls at corner (degrees)
 * @returns Object with miter and bevel angles in degrees
 */
export function calculateCrownMoldingAngles(
  springAngle: number,
  wallAngle: number
): { miter: number; bevel: number } {
  // Convert to radians
  const springRad = (springAngle * Math.PI) / 180;
  const wallRad = (wallAngle * Math.PI) / 180;
  
  // Calculate miter angle using derived formula
  const miter = Math.atan(
    Math.cos(springRad) * Math.tan(wallRad / 2)
  );
  
  // Calculate bevel angle using derived formula
  const bevel = Math.asin(
    Math.sin(springRad) * Math.sin(wallRad / 2)
  );
  
  // Convert back to degrees
  return {
    miter: (miter * 180) / Math.PI,
    bevel: (bevel * 180) / Math.PI
  };
}

/**
 * Calculate spring angle from molding dimensions
 * @param height - Vertical rise from wall (mm)
 * @param projection - Horizontal extension from wall (mm)
 * @returns Spring angle in degrees
 */
export function calculateSpringAngle(
  height: number,
  projection: number
): number {
  return (Math.atan(height / projection) * 180) / Math.PI;
}

/**
 * Get wall angle for regular polygon room
 * @param sides - Number of sides in the room
 * @returns Wall angle in degrees
 */
export function getPolygonWallAngle(sides: number): number {
  return 360 / sides;
}
```

### Validation Functions

```typescript
/**
 * Validate calculated angles are within saw limits
 */
export function validateAngles(miter: number, bevel: number): {
  valid: boolean;
  errors?: string[];
} {
  const errors: string[] = [];
  
  // Typical compound miter saw limits
  if (miter < 0 || miter > 60) {
    errors.push(`Miter angle ${miter.toFixed(1)}° is outside typical saw range (0-60°)`);
  }
  
  if (bevel < 0 || bevel > 50) {
    errors.push(`Bevel angle ${bevel.toFixed(1)}° is outside typical saw range (0-50°)`);
  }
  
  // Check for mathematical edge cases
  if (isNaN(miter) || isNaN(bevel)) {
    errors.push('Calculation resulted in invalid angle (NaN)');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}
```

---

## 10. Practical Considerations for Users

### Saw Calibration Variations

Different saws use different reference conventions:

**Convention A (0° for square cut):**
- Miter 0° = blade perpendicular to fence
- Bevel 0° = blade perpendicular to table

**Convention B (90° for square cut):**
- Miter 90° = blade perpendicular to fence
- Bevel 90° = blade perpendicular to table

When implementing, allow user to specify their saw's convention and convert accordingly.

### Left vs Right Pieces

For the same corner, left and right pieces use the **same mathematical angles** but different saw orientations:

- Both pieces: Same miter angle, same bevel angle
- Left piece: Swing miter to left
- Right piece: Swing miter to right
- Orientation of piece on table may flip (top to fence vs top away)

### Test Cuts Are Critical

Real-world walls often deviate from exact angles. Always recommend:

1. **Measure actual wall angles** using a digital protractor or bevel gauge
2. **Cut test pieces** from scrap molding before cutting measured lengths
3. **Adjust angles** by ±1-2° based on test fit
4. **Account for wall irregularities** (bulges, not plumb, out-of-square corners)

### Spring Angle Measurement Tips

For custom molding where spring angle is unknown:

**Using a Bevel Gauge:**
1. Place one arm of bevel gauge against the wall
2. Place the other arm against the ceiling
3. Lock the gauge and read the angle

**From Molding Dimensions:**
1. Measure the vertical height (from wall to top edge)
2. Measure the horizontal projection (from wall to back edge)
3. Calculate: `Spring = arctan(height / projection)`

---

## 11. Common Pitfalls & Troubleshooting

### Gap at Top or Bottom

**Gap at Top (inside corner)**: Likely wall angle is larger than measured
**Gap at Bottom (inside corner)**: Likely wall angle is smaller than measured
**Gap at Top (outside corner)**: Likely wall angle is smaller than measured
**Gap at Bottom (outside corner)**: Likely wall angle is larger than measured

**Solution**: Re-measure wall angle, adjust by ±2° and test again

### Gaps Even After Correct Angles

If pieces have gaps even when angles are correct:

1. **Check spring angle**: Molding may not be standard 38° or 45°
2. **Verify wall is plumb**: Use a spirit level
3. **Check ceiling is level**: Sagging or uneven ceilings affect fit
4. **Verify saw calibration**: Check that miter and bevel scales are accurate

### Tear-Out on Cut Edges

**Causes**: Blade dull, wrong blade type, cutting too fast

**Solutions**:
- Use sharp, fine-tooth blade (80-120 TPI for molding)
- Cut slowly, especially on finished surfaces
- Use masking tape on cut line to prevent tear-out
- Score cut line with utility knife before sawing

---

## 12. Integration with Structa Digital Twin

### Data Requirements

To support crown molding calculations in the floor plan editor, capture:

**Per-Room Metadata:**
- Wall angles at each corner (manual input or measured)
- Ceiling type (flat, vaulted, tray)
- Ceiling height (for vaulted ceiling calculations)

**Molding Specifications:**
- Spring angle (dropdown: 38°, 45°, custom)
- Molding profile type (standard, custom)
- Molding dimensions (width, height, projection)

### Clerk AI Capabilities

The Clerk should be able to:

1. **Explain calculations**: When asked "What angles do I need for a 135° bay window?" show the formula derivation
2. **Detect context**: From floor plan, identify corners requiring crown molding
3. **Generate cutting instructions**: "For the bay window at coordinates (x,y), cut the left piece at 62.3° miter, 34.6° bevel. Place molding with top against fence..."
4. **Calculate material quantities**: Based on room perimeter and molding length per piece
5. **Flag non-standard angles**: "Your plan shows a 112.5° corner—this will require miter = 25.3°, bevel = 23.1°"

### Visual Diagrams

Floor plan editor should show:
- **3D corner view** with molding in place
- **Cut plane visualization** showing miter and bevel angles
- **Cross-section view** showing spring angle relationship
- **Saw setup diagram** with actual angle settings

---

## 13. References & Further Reading

### Mathematical Sources

- **Compound Angle Derivation**: http://jansson.us/nsideboxderive.html - 3D vector geometry approach
- **Stack Exchange Discussion**: https://math.stackexchange.com/questions/3663454/compound-angles-formula-derivationcrown-molding
- **Trigonometric Identities**: Standard trig identities for angle conversions

### Practical Tools

- **blocklayer.com Calculator**: https://www.blocklayer.com/crown-molding - Comprehensive tables and diagrams
- **SBE Builders Tables**: https://www.sbebuilders.com/cgi-bin/geometry/crown_table.cgi - Detailed angle tables
- **WoodCentral Formula**: https://www.woodcentral.com/articles/miter_formula.php - Original formula derivation

### Building Regulations

When providing advice, consider:

- **UK Building Regulations Part P**: Electrical safety if installing coving with integrated lighting
- **UK Building Regulations Part B**: Fire safety considerations for molding materials
- **Health & Safety**: Working at height, dust control (PPE requirements)

---

## 14. Testing & Validation

### Unit Test Cases

```typescript
describe('Crown Molding Calculations', () => {
  test('90° corner with 38° spring', () => {
    const result = calculateCrownMoldingAngles(38, 90);
    expect(result.miter).toBeCloseTo(38.22, 0.01);
    expect(result.bevel).toBeCloseTo(25.81, 0.01);
  });
  
  test('45° corner with 45° spring', () => {
    const result = calculateCrownMoldingAngles(45, 45);
    expect(result.miter).toBeCloseTo(45.00, 0.01);
    expect(result.bevel).toBeCloseTo(45.00, 0.01);
  });
  
  test('135° bay window with 38° spring', () => {
    const result = calculateCrownMoldingAngles(38, 135);
    expect(result.miter).toBeCloseTo(62.26, 0.01);
    expect(result.bevel).toBeCloseTo(34.64, 0.01);
  });
  
  test('Spring angle from dimensions', () => {
    const spring = calculateSpringAngle(75, 77);
    expect(spring).toBeCloseTo(44.25, 0.01);
  });
  
  test('Polygon wall angles', () => {
    expect(getPolygonWallAngle(8)).toBe(45); // Octagon
    expect(getPolygonWallAngle(6)).toBe(60); // Hexagon
  });
});
```

### Validation Benchmarks

- **Angle Accuracy**: Calculated angles must match reference tables within ±0.1°
- **Edge Cases**: Handle 0° (straight wall), 180° (flat line), and extreme angles gracefully
- **NaN Prevention**: All trigonometric calculations must validate inputs before computation

---

## Summary

Crown molding compound angle calculations are a foundational mathematical tool for renovation projects. By understanding the relationship between spring angle, wall angle, and the resulting miter and bevel angles, Structa can provide precise, context-aware guidance that reduces material waste and installation errors.

**Key Takeaway**: The formulas are straightforward, but real-world application requires attention to:
- Accurate wall angle measurement
- Correct spring angle determination
- Saw calibration and convention
- Test cuts before final installation

This mathematical foundation enables The Clerk to move from generic advice to specific, actionable cutting instructions based on the user's actual property geometry.
