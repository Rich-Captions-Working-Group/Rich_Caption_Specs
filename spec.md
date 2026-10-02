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
| `speakerId` | `Integer` | A unique integer value used to identify a speaker the project. This ID could be shared across videos (e.g., across episodes of a show).|
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
      "timeStart": "00:01:12.000"
    }
  ]
}
```


## Music

*Inherits from:* [`Block`](#block)

The `Music` class represents a time-bounded musical event. A Music block may describe an entire musical work, an excerpt from a work, incidental music, a recurring motif, or another temporally distinct musical event.

Music descriptions may contain both structured information about the music itself and authored natural-language descriptions. Structured information allows rendering systems to adapt captions according to user preferences and available display space, while authored text provides a lightweight fallback and allows captioners to preserve descriptions that cannot easily be decomposed.

### Block-Level Properties

| Property | Type | Description |
|---|---|---|
| `source` | `Object` | Spatial and diegetic information about where the music originates. Uses the same `Source` object as `Speech`. |
| `importance` | `Integer` | A 1–5 scale indicating the subjective priority of captioning this musical event (1 = Niche/Extremely low, 5 = Crucial). |
| `musicMetadata` | `Object` | Information identifying the musical work or recording, where known. |
| `musicalAttributes` | `Object` | Structured musical characteristics such as tempo, key, and genre. |
| `function` | `Array<String>` | One or more functions the music serves within the audiovisual material. |
| `sonicDescription` | `Object` | Perceptual characteristics of how the music sounds in this event. |
| `lyrics` | `Object` | Lyrics occurring during this musical event, where applicable. |
| `displayText` | `String` | Optional authored natural-language description of the musical event. May be used directly by renderers or as a fallback when richer structure is unavailable (e.g., the sentence `"Energetic drums bang on while a deep, synth bass quakes"` might be provided as a fallback to a structured representation of the two instruments). |
| `descriptionUnits` | `Array<DescriptionUnit>` | Structured descriptions of individual musically relevant objects or layers, such as instruments, rhythms, motifs, or voices. |
| `segments` | `Array<MusicSegment>` | Optional timed subdivisions of the musical event. Segment-level values override corresponding block-level values. When a segment supplies a nested object, only the properties explicitly supplied by the segment override the corresponding block-level properties. Other properties continue to inherit from the parent block. For example, a block may define `"QUIET"` as its `loudness`, while a segment may override this with `"LOUD"`. The override applied only to that segment; other properties continue to inherit from the parent block.
 |

---

### Music Metadata Object (`musicMetadata`)

`musicMetadata` identifies the musical work or recording when this information is known. All fields are optional.

Common metadata is represented through explicitly defined properties. Less common metadata may be included using `additionalMetadata`, allowing the format to remain extensible without requiring a predefined field for every possible music-industry metadata standard.

| Property | Type | Description |
|---|---|---|
| `title` | `String` | Title of the musical work or recording. |
| `artist` | `String` | Primary credited artist or performer. |
| `year` | `Integer` | Year of release, where known. |
| `album` | `String` | Album or collection containing the recording. |
| `composer` | `Array<String>` | Composer or composers of the musical work. |
| `lyricist` | `Array<String>` | Lyricist or lyricists. |
| `copyrightOwner` | `Array<String>` | Copyright owner or owners, where relevant and known. |
| `identifiers` | `Object` | Known external identifiers, expressed as key-value pairs using the identifier scheme as the key. |
| `additionalMetadata` | `Object` | Additional metadata not represented by the predefined properties. |

#### Example

```json
"musicMetadata": {
  "title": "The Batman Theme",
  "artist": "Danny Elfman",
  "year": 1989,
  "album": "Batman (Original Motion Picture Score)",
  "composer": ["Danny Elfman"],
  "lyricist": [],
  "identifiers": {
    "ISWC": "T-070.232.924-5",
    "ISRC": "USWB10000074"
  }
}
```

---

### Musical Attributes Object (`musicalAttributes`)

`musicalAttributes` contains structured characteristics of the music itself. These describe the musical event as a whole rather than individual description units.

| Property | Type | Description |
|---|---|---|
| `bpm` | `Float` | Approximate tempo in beats per minute. |
| `key` | `String` | Musical key, where identifiable and relevant. |
| `genre` | `Array<String>` | One or more genres or musical styles associated with the event (e.g., `["synth-pop", "dance"]`). |

---

### Function (`function`)

`function` describes what the music appears to contribute to the audiovisual material. It is distinct from `importance`: a function describes the role of the music, whereas `importance` concerns the priority of captioning the event.

Zero or more functions may be specified.

Current values are:

- `SET_MOOD_TONE`
- `CONVEY_PRESENCE_ABSENCE_PLACE_TIME`
- `CONNECT_TO_CULTURAL_TOPICS`

Further functions may be added as the specification develops.

#### Example

```json
"function": [
  "SET_MOOD_TONE",
  "CONVEY_PRESENCE_ABSENCE_PLACE_TIME"
]
```

---

### Sonic Description Object (`sonicDescription`)

`sonicDescription` describes perceptual properties of the musical event. These properties concern how the music sounds within the scene rather than its musical identity.

| Property | Type | Description |
|---|---|---|
| `description` | `String` | Free-form description of relevant sonic qualities, such as `"muffled"`, `"distorted"`, or `"tinny"`. |
| `loudness` | `Enum` | Loudness relative to other sounds in the scene. Options: `"QUIET"`, `"MEDIUM"`, `"LOUD"`. |
| `frequency` | `Object` | Optional description of the frequency characteristics of the event. |

#### Frequency Object

The representation of frequency characteristics remains provisional. This is intended to support viewers who may find it challenging to perceive some frequencies but not others (e.g., someone who may want musical events with predominantly high-frequency content to be captioned more consistently because of hearing loss at higher frequencies).

| Property | Type | Description |
|---|---|---|
| `dominantRange` | `Enum` | Predominant frequency range. Options: `"LOW"`, `"MID"`, `"HIGH"`. |

::: issue Issue Notice
  I had a reference to an additional "ML profile" with low, medium, and high values. I don't have a note describing what this is, and, er, I forgot. —Caluã
:::


---

### Lyrics Object (`lyrics`)

`lyrics` contains sung or otherwise musically performed lexical content occurring within the Music block.

| Property | Type | Description |
|---|---|---|
| `original` | `Object` | Lyrics in their original language, keyed by ISO language code. |
| `translations` | `Object` | Optional translations, keyed by ISO language code. |
| `isBurnedIn` | `Boolean` | `true` if the lyrics are already displayed as part of the source video. |

#### Example

```json
"lyrics": {
  "original": {
    "en": "There's a starman waiting in the sky"
  },
  "translations": {
    "pt-BR": "Sempre estar lá, e ver ele voltar"
  },
  "isBurnedIn": false
}
```

---

### Description Units (`descriptionUnits`)

`descriptionUnits` provide structured descriptions of identifiable musical objects or layers.

A unit is organised around an `anchor`: the primary musical element being described, such as an instrument, voice, rhythm, or the music as a whole. Descriptors are then associated with that anchor.

This structure allows information about different musical elements to remain semantically associated. For example, in:

> *energetic banjo plays with a slow, quiet bongo grooving warily*

`energetic` and `plays` may be associated with the banjo, while `slow`, `quiet`, `grooving`, and `warily` may be associated with the bongo.

For the moment, description units do **not** have independent importance values. Renderers may select or transform structured information according to user preferences and available space, but the specification does not require captioners to assign a relative priority to every musical object or descriptor.

::: note Basic Note
  `displayText` preserves an authored surface rendering. `descriptionUnits` encode semantic information and are not required to reproduce `displayText` verbatim; renderers may introduce, remove, or reorder grammatical material when constructing captions from structured data.
:::

::: note Basic Note
  Descriptors associated with an anchor do not override corresponding block-level structured properties. For example, describing an instrument as `"quiet"` does not change the event-level `sonicDescription.loudness`.
:::


#### Description Unit Object

| Property | Type | Description |
|---|---|---|
| `anchor` | `Object` | The primary musical element described by the unit. |
| `descriptors` | `Array<Object>` | Structured descriptors associated with the anchor. |
| `displayText` | `String` | Optional authored rendering of the complete unit. |

#### Anchor Object

| Property | Type | Description |
|---|---|---|
| `type` | `String` | Semantic category of the anchor, such as `"instrument"`, `"voice"`, `"rhythm"`, `"motif"`, or `"music"`. |
| `value` | `String` | Human-readable identification of the anchor, such as `"banjo"`, `"bongo"`, or `"Woody's theme"`. |

#### Descriptor Object

| Property | Type | Description |
|---|---|---|
| `type` | `String` | Semantic role of the descriptor, such as `"quality"`, `"action"`, `"manner"`, or `"affectiveQuality"`. |
| `value` | `String` | Descriptive value associated with the anchor. |

The descriptor vocabulary is intentionally extensible. Renderers should not assume that the order of descriptors corresponds to their relative importance or necessarily to their surface order in a particular language.

#### Example

```json
"descriptionUnits": [
  {
    "anchor": {
      "type": "instrument",
      "value": "banjo"
    },
    "descriptors": [
      {
        "type": "quality",
        "value": "energetic"
      },
      {
        "type": "action",
        "value": "plays"
      }
    ],
    "displayText": "energetic banjo plays"
  },
  {
    "anchor": {
      "type": "instrument",
      "value": "bongo"
    },
    "descriptors": [
      {
        "type": "quality",
        "value": "slow"
      },
      {
        "type": "quality",
        "value": "quiet"
      },
      {
        "type": "action",
        "value": "grooving"
      },
      {
        "type": "manner",
        "value": "warily"
      }
    ],
    "displayText": "a slow, quiet bongo grooving warily"
  }
]
```

The corresponding block-level `displayText` might be:

```json
"displayText": "energetic banjo plays with a slow, quiet bongo grooving warily"
```

A lightweight authoring workflow may provide only `displayText`. More detailed authoring workflows may additionally provide `descriptionUnits`, allowing renderers to adapt the description semantically.

---

### Segment-Level Properties (`MusicSegment`)

Music segments are optional timed subdivisions of a Music block. They are useful where characteristics change within a single musical event without requiring the entire event to be represented as a new block.

Timing is optional. Where omitted, rendering systems may infer timing from the parent block or neighbouring segments. If `timeStart` is provided with no corresponding `timeStop`, the parent block's `timeStop` is presumed.

| Property | Type | Description |
|---|---|---|
| `timeStart` | `String` | Start timestamp of the segment. |
| `timeStop` | `String` | End timestamp of the segment. |
| `function` | `Array<String>` | Segment-specific function values overriding the block-level value. |
| `sonicDescription` | `Object` | Segment-specific sonic properties overriding the block-level value. |
| `lyrics` | `Object` | Lyrics occurring specifically during this segment. |
| `displayText` | `String` | Optional authored description specific to the segment. |
| `descriptionUnits` | `Array<DescriptionUnit>` | Optional structured descriptions specific to the segment. |

Properties omitted from a segment inherit their values from the parent Music block. 
---

### Example Representation

```json
{
  "type": "Music",
  "timeStart": "00:01:12.000",
  "timeStop": "00:01:18.500",

  "importance": 4,

  "source": {
    "isDiegetic": true,
    "visualPresence": "NOT_IN_SHOT",
    "location": "Radio behind the kitchen door"
  },

  "musicMetadata": {
    "title": "Example Song",
    "artist": "Example Artist",
    "year": 1984
  },

  "musicalAttributes": {
    "bpm": 128,
    "key": "A minor",
    "genre": [
      "synth-pop",
      "dance"
    ]
  },

  "function": [
    "SET_MOOD_TONE",
    "CONVEY_PRESENCE_ABSENCE_PLACE_TIME"
  ],

  "sonicDescription": {
    "description": "slightly muffled",
    "loudness": "QUIET",
    "frequency": {
      "dominantRange": "HIGH"
    }
  },

  "displayText": "energetic banjo plays with a slow, quiet bongo grooving warily",

  "descriptionUnits": [
    {
      "anchor": {
        "type": "instrument",
        "value": "banjo"
      },
      "descriptors": [
        {
          "type": "quality",
          "value": "energetic"
        },
        {
          "type": "action",
          "value": "plays"
        }
      ],
      "displayText": "energetic banjo plays"
    },
    {
      "anchor": {
        "type": "instrument",
        "value": "bongo"
      },
      "descriptors": [
        {
          "type": "quality",
          "value": "slow"
        },
        {
          "type": "quality",
          "value": "quiet"
        },
        {
          "type": "action",
          "value": "grooving"
        },
        {
          "type": "manner",
          "value": "warily"
        }
      ],
      "displayText": "a slow, quiet bongo grooving warily"
    }
  ],

  "lyrics": {
    "original": {
      "en": "Example lyric line"
    },
    "isBurnedIn": false
  },

  "segments": [
    {
      "timeStart": "00:01:16.000",
      "sonicDescription": {
        "loudness": "LOUD"
      }
    }
  ],

  "notes": "Music is initially faint but establishes activity occurring off-screen.",

  "tags": [
    "#party",
    "#recurring-theme"
  ],

  "metadata": {
    "blockId": "550e8400-e29b-41d4-a716-446655440001",
    "author": "JaneDoe_Editor",
    "createdAt": "2026-07-01T14:30:00Z",
    "updatedAt": "2026-07-01T15:10:00Z"
  }
}
```

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
