# Rich Captions Specification

Rich Captions uses an object-oriented approach


## Block

The `Block` is the foundational base class from which all other elements in the format (such as `Speech`) inherit. It defines the universal properties required for temporal positioning, editor annotations, and system tracking. 

### Properties

| Property | Type | Description |
|---|---|---|
| `timeStart` | `String` | The precise timestamp when the block begins (e.g., `00:01:23.450`). |
| `timeStop` | `String` | The precise timestamp when the block ends (e.g., `00:01:28.000`). |
| `notes` | `String` | Free-form text for author comments, context, or translator instructions. |
| `tags` | `Array<String>` | An array of descriptive markers for categorization, conventionally prefixed with `#`. |
| `metadata` | `Object` | A nested object containing system and attribution data for the block. |

---

### Metadata Object (`metadata`)

The `metadata` object encapsulates tracking information. This data does not impact the content itself but is essential for version control, auditing, and collaborative editing.

| Property | Type | Description |
|---|---|---|
| `blockId` | `String` | A universally unique identifier (e.g., UUID) for referencing the specific block. |
| `author` | `String` | The identifier of the user, system, or program that created the block. |
| `createdAt` | `String` | An ISO 8601 timestamp indicating when the block was generated. |
| `updatedAt` | `String` | An ISO 8601 timestamp indicating when the block was last modified. |

---

### Example Representation

The following JSON illustrates a standard instance of a `Block` object:


```json
{
  "type": "Block",
  "timeStart": "00:01:23.450",
  "timeStop": "00:01:28.000",
  "notes": "Ensure the timing perfectly aligns with the door slam audio.",
  "tags": [
    "#action-sync",
    "#needs-review"
  ],
  "metadata": {
    "blockId": "550e8400-e29b-41d4-a716-446655440000",
    "author": "JaneDoe_Editor",
    "createdAt": "2026-07-16T11:00:00Z",
    "updatedAt": "2026-07-16T11:15:30Z"
  }
}
```


## Speech

`class Speech extends [Block](#block)`

The Speech object is used to...

--------

## Speech

> **Extends:** [`Block`](#block)

The Speech object is used to...

-------
## Speech

| | |
|---|---|
| **Inherits from** | `Block` |
| **Description**   | (Add a brief description of what the Speech class does here) |


## Music

## Sound Effects

## Misc


# Design Principles

The intial version of the Rich Captioning Specifications was designed by Benjamin Gorman, Caluã de Lacerda Pataca, Saad Hassan, and Lloyd May. They attempted to follow the following design principles while constructing the first version: 

* **Technology-aware approach:**
  * We are imagining this format from scratch and are assuming a translation/interpretation layer exists to transform an RC file into webVTT, srt, etc.
  * While imagining the format from scratch, where two options seem equally valid, we choose the one that interacts most favorably with existing caption formats.

* **Descriptive rather than prescriptive:**
  * We want to describe what is happening as well as the creator’s intent where possible. We do not want to enforce any regulatory or regional guidelines (e.g., FCC, OFCOM, etc.).

* **Stylization is out-of-scope:**
  * Things that affect stylization (color, bold, exact placement on screen, etc.) are out-of-scope. Those visual decisions are deferred to the interpreter/translator program.

* **Tag vs. Class distinction:**
  * If a characteristic is exclusive, it is a *class*; otherwise, it is a *tag*.

* **Separation of structure and use case:**
  * Classes, tags, and attributes are distinct from use cases. For example, *"For hearing aid users"* is a use case, not a class.

* **Sparsity by default:**
  * Most of the time, fields will be empty (similar to standard JSON behavior).

* **Backward compatibility (Can't break VTT):**
  * The file must be able to be fed directly into an older, legacy player and still function.