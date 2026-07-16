# Rich Captions Specification

Rich Captions uses an object-oriented approach...


## Block

The `Block` is the foundational base class from which all other elements in the format (such as `Speech`) inherit. It defines the universal properties required for temporal positioning, spatial constraints, editor annotations, and system tracking. 

### Properties

| Property | Type | Description |
|---|---|---|
| `timeStart` | `String` | The precise timestamp when the block begins (e.g., `00:01:23.450`). |
| `timeStop` | `String` | The precise timestamp when the block ends (e.g., `00:01:28.000`). |
| `positionNoGos` | `Array<Object>` | An array of spatial bounding boxes (defined in X/Y percentages) where captions/UI must *not* be placed to avoid obscuring on-screen text or crucial visual elements. |
| `notes` | `String` | Free-form text for author comments, context, or translator instructions. |
| `tags` | `Array<String>` | An array of descriptive markers for categorization, conventionally prefixed with `#`. |
| `metadata` | `Object` | A nested object containing system and attribution data for the block. |

---

### Position No-Go Object 

Each object in the `positionNoGos` array defines a restricted rectangular area on the screen using percentages. `0,0` represents the top-left corner.

| Property | Type | Description |
|---|---|---|
| `xMin` | `Float` | The left-most edge of the restricted area as a percentage of screen width (0-100). |
| `xMax` | `Float` | The right-most edge of the restricted area as a percentage of screen width (0-100). |
| `yMin` | `Float` | The top-most edge of the restricted area as a percentage of screen height (0-100). |
| `yMax` | `Float` | The bottom-most edge of the restricted area as a percentage of screen height (0-100). |

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

```json
{
  "type": "Block",
  "timeStart": "00:01:23.450",
  "timeStop": "00:01:28.000",
  "positionNoGos": [
    {
      "xMin": 25.0,
      "xMax": 75.0,
      "yMin": 85.0,
      "yMax": 95.0
    }
  ],
  "notes": "Avoid the lower third; burned-in location text appears here.",
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
## Header

The `Header` is a global configuration object that sits at the beginning of every Rich Caption file. It defines file-wide mappings, supported languages, and dictionaries to ensure the block-level data remains lightweight and prevents repetitive declarations.

### Properties

| Property | Type | Description |
|---|---|---|
| `speakers` | `Object` | A dictionary mapping unique `speakerId` integers to their default `speaker` objects (names and descriptions). |
| `supportedLanguages` | `Object` | Key-value pairs of ISO language codes used in the file to their human-readable names (e.g., `{"pt-BR": "Brazilian Portuguese"}`). |

---

## Speech

*Inherits from:* [`Block`](#block)

The `Speech` class represents ways of communicating that have well-established lexical meaning. This includes spoken languages, signed languages, and fictitious/constructed languages. 

### Block-Level Properties

These properties apply to the entire speech event.

| Property | Type | Description |
|---|---|---|
| `speaker` | `Object` | Identifying information about the entity communicating. |
| `source` | `Object` | Spatial and diegetic information about where the communication originates. |
| `lexicalContent` | `Object` | The verbatim communication, translations, and text-display flags. |
| `importance` | `Integer` | A 1-5 scale indicating the subjective priority of captioning this event (1 = Niche/Extremely low, 5 = Crucial). |
| `annotations` | `Object` | Block-level defaults for manner of speech and sonic properties. These apply to all segments unless overridden. |
| `segments` | `Array<Segment>` | An ordered list of `Segment` objects breaking the block down into smaller timed units (e.g., words, phrases, syllables). |

---

### Component Objects

#### Speaker Object (`speaker`)

| Property | Type | Description |
|---|---|---|
| `speakerId` | `Integer` | A unique accession ID for the speaker within the project. |
| `narrativeName` | `String` | The character's actual name (e.g., `"Sarah"`, `"Prof. X"`). |
| `descriptiveName` | `String` | A physical or contextual description (e.g., `"Man in red hat"`). |
| `spoilerName` | `String` | The name to be displayed if character identity `"spoilers"` are desired. |

#### Source Object (`source`)

| Property | Type | Description |
|---|---|---|
| `isDiegetic` | `Boolean` | `true` if the source exists within the world of the video (e.g., a radio playing in a scene); `false` if external (e.g., a narrator). |
| `visualPresence` | `Enum` | Options: `"FOCUS"`, `"CLEARLY_IN_SHOT"`, `"SOMEWHAT_IN_SHOT"`, `"NOT_IN_SHOT"`. |
| `location` | `String` | Descriptive location of the source (e.g., `"Behind the door"`, `"Over the PA system"`). |

#### Lexical Content Object (`lexicalContent`)

| Property | Type | Description |
|---|---|---|
| `original` | `Object` | The verbatim communication in its primary language, keyed by ISO code (e.g., `{"es": "..."}`). |
| `translations` | `Object` | Key-value pairs of ISO language codes to translated strings (e.g., `{"en": "...", "es": "...", "en-simplified": "..."}`). |
| `isBurnedIn` | `Boolean` | `true` if this specific block is already burned into the source video file as open captions. |

#### Annotations Object (`annotations`)
*Note: This object can exist at both the Block level (as a default) and the Segment level (as an override).*

| Property | Type | Description |
|---|---|---|
| `language` | `String` | **(Segment-level only)** ISO language code overriding the block's primary language. Used for code-switching (mixed languages). |
| `mannerOfSpeech` | `String` | The affect or style of communication (e.g., `"Sarcastic"`, `"Happy"`). |
| `accentGeneral` | `String` | Description of an accent in general terms, such as a country, large region, or cultural group (e.g., `"Thick Australian accent"`, `"Deaf accent"`). |
| `accentSpecific` | `String` | Description of a highly specific accent, such as a region within a nation (e.g., `"Thick Texan accent"`). |
| `impersonation` | `String` | Descriptive string if the speaker is mimicking another entity (e.g., `"As Dolly Parton"`). |
| `sonicDescription` | `String` | Environmental effects altering the sound (e.g., `"Muffled"`, `"Distorted"`). |
| `vocalEffort` | `Enum` | Options: `"WHISPER"`, `"NORMAL"`, `"SHOUT"`. |

---

### Segment-Level Properties (`Segment`)

Segments are the lowest configurable units within a `Speech` block. Timing is optional at the segment level; if omitted, rendering engines should interpolate based on the parent Block's start and stop times.

| Property | Type | Description |
|---|---|---|
| `content` | `String` | The specific unit of communication (e.g., a word, syllable, or punctuation mark). |
| `timeStart` | `String` | The start timestamp of this specific segment. |
| `timeStop` | `String` | The end timestamp of this specific segment. |
| `annotations` | `Object` | Segment-specific overrides, such as language shifts (code-switching) or vocal effort. |

---

### Example Representation

This example demonstrates a primarily English sentence with a Spanish phrase embedded within it, utilizing segment-level language overrides.

```json
{
  "type": "Speech",
  "timeStart": "00:01:10.000",
  "timeStop": "00:01:12.500",
  "importance": 4,
  "speaker": {
    "speakerId": 104,
    "narrativeName": "John",
    "descriptiveName": "Man in Suit",
    "spoilerName": "Dad"
  },
  "source": {
    "isDiegetic": true,
    "visualPresence": "FOCUS",
    "location": "Center stage"
  },
  "lexicalContent": {
    "original": {
      "en": "Look at this chico genial over here."
    },
    "translations": {
      "es": "Mira a este chico genial por aquí."
    },
    "isBurnedIn": false
  },
  "annotations": {
    "mannerOfSpeech": "Casual",
    "vocalEffort": "NORMAL"
  },
  "segments": [
    {
      "content": "Look at this ",
      "timeStart": "00:01:10.000"
    },
    {
      "content": "chico genial ",
      "timeStart": "00:01:11.200",
      "annotations": {
        "language": "es",
        "mannerOfSpeech": "Enthusiastic"
      }
    },
    {
      "content": "over here.",
      "timeStart": "00:01:12.500"
    }
  ]
}
```


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