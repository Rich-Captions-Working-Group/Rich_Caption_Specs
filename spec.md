Rich Captions uses an object-oriented approach...

## Block

The `Block` is the foundational base class from which all other elements in the format (such as `Speech`) inherit. It defines the universal properties required for temporal positioning, spatial constraints, editor annotations, and system tracking.

### Properties

| Property        | Type            | Description                                                                                                                                                          |
| --------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `timeStart`     | `String`        | The precise timestamp when the block begins (e.g., `00:01:23.450`).                                                                                                  |
| `timeStop`      | `String`        | The precise timestamp when the block ends (e.g., `00:01:28.000`).                                                                                                    |
| `positionNoGos` | `Array<Object>` | An array of spatial bounding boxes (defined in X/Y percentages) where captions/UI must _not_ be placed to avoid obscuring on-screen text or crucial visual elements. |
| `notes`         | `String`        | Free-form text for author comments, context, or translator instructions.                                                                                             |
| `tags`          | `Array<String>` | An array of descriptive markers for categorization, conventionally prefixed with `#`.                                                                                |
| `metadata`      | `Object`        | A nested object containing system and attribution data for the block.                                                                                                |

---

### Position No-Go Object

Each object in the `positionNoGos` array defines a restricted rectangular area on the screen using percentages. `0,0` represents the top-left corner.

| Property | Type    | Description                                                                           |
| -------- | ------- | ------------------------------------------------------------------------------------- |
| `xMin`   | `Float` | The left-most edge of the restricted area as a percentage of screen width (0-100).    |
| `xMax`   | `Float` | The right-most edge of the restricted area as a percentage of screen width (0-100).   |
| `yMin`   | `Float` | The top-most edge of the restricted area as a percentage of screen height (0-100).    |
| `yMax`   | `Float` | The bottom-most edge of the restricted area as a percentage of screen height (0-100). |

---

### Metadata Object (`metadata`)

The `metadata` object encapsulates tracking information. This data does not impact the content itself but is essential for version control, auditing, and collaborative editing.

| Property    | Type     | Description                                                                      |
| ----------- | -------- | -------------------------------------------------------------------------------- |
| `blockId`   | `String` | A universally unique identifier (e.g., UUID) for referencing the specific block. |
| `author`    | `String` | The identifier of the user, system, or program that created the block.           |
| `createdAt` | `String` | An ISO 8601 timestamp indicating when the block was generated.                   |
| `updatedAt` | `String` | An ISO 8601 timestamp indicating when the block was last modified.               |

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
  "tags": ["#action-sync", "#needs-review"],
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

| Property             | Type     | Description                                                                                                                       |
| -------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `speakers`           | `Object` | A dictionary mapping unique `speakerID` integers to their default `speaker` object values (names and descriptions). These default values will be used if a `speakerID` is used but no other details are given.                     |
| `supportedLanguages` | `Object` | Key-value pairs of ISO 639-1 language codes used in the file to their human-readable names (e.g., `{"pt-BR": "Brazilian Portuguese"}`). |

---

### Example Representation

```json
{
  "type": "Header",
  "speakers": [
    {
      "speaker": {
        "speakerID": 104,
        "narrativeName": "John",
        "descriptiveName": "Man in Suit",
        "spoilerName": "Dad"
      },
      "speaker": {
        "speakerID": 107,
        "narrativeName": "Sarah",
        "descriptiveName": "Dcotor",
        "spoilerName": "Sister"
      }
    }
  ],
  "supportedLanguages": {
    "en": "English",
    "pt-BR": "Brazilian Portuguese",
    "es": "Spanish"
  }
}
```

## Speech

_Inherits from:_ [`Block`](#block)

The `Speech` class represents ways of communicating that have well-established lexical meaning. This includes spoken languages, signed languages, and fictitious/constructed languages. `Speech` opperates at a Block-level, which represents a single chunk or unit of speech/signing to be communicated, and a Segement-level, in which particular words or phrases in the Speech Block can be given distinct customization parameters. 

### Block-Level Properties

These properties apply to the entire speech event.

| Property         | Type             | Description                                                                                                              |
| ---------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `speaker`        | `Object`         | Identifying information about the entity communicating.                                                                  |
| `source`         | `Object`         | Spatial and diegetic information about where the communication originates.                                               |
| `lexicalContent` | `Object`         | The verbatim communication (i.e. what was said or signed) or its translations.                                                        |
| `importance`     | `Integer`        | A 1-5 scale indicating the subjective priority of captioning this event (1 = Niche/Extremely low priority, 5 = Crucial).          |
| `annotations`    | `Object`         | Block-level defaults for manner of speech and sonic properties. These apply to all segments unless overridden at the segment level.           |
| `segments`       | `Array<Segment>` | An ordered list of `Segment` objects breaking the block down into smaller timed units (e.g., words, phrases, syllables). |

---

### Speech Event Objects

#### Speaker Object (`speaker`)

Default `speaker` properties are defined in the `Header`. If there are any differences between the `Header` speaker object and the `speech`-level speaker object, the `speech`-level object will take priority. 

| Property          | Type      | Description                                                                                                                             |
| ----------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `speakerID`       | `Integer` | A unique integer value used to identify a speaker in the project. This ID could be shared across videos (e.g., across episodes of a show). |
| `narrativeName`   | `String`  | The name the character is known by in the narrative (e.g., `"Sarah"`, `"Prof. X"`). NOTE: Some characters speak before their names are revealed. In this case, it is recommended to input a null value of `""` in the narrativeName until the audience knows their name.  |
| `descriptiveName` | `String`  | A physical or contextual description (e.g., `"Man in red hat"`). NOTE: Some contextual descriptors like `"Mom"` or `"CEO"` should only be used if this description is already clearly established.|
| `spoilerName`     | `String`  | The name to be displayed if character identity `"spoilers"` are desired. For example, if a character's identity is masked or hidden, say as `Superhero X`, but later revelaed to be a named character, say `Jane Doe`, then the `spoilerName` for both `Superhero X` and `Jane Doe` would be `Jane Doe`. |

#### Source Object (`source`)

| Property         | Type      | Description                                                                                                                           |
| ---------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `isDiegetic`     | `Boolean` | Where the communication originates from. `true` if the source exists within the world of the video (e.g., a radio playing in a scene); `false` if external (e.g., a narrator). |
| `visualPresence` | `Enum`    | How clearly visible the person communicating can be seen in the video. Options: `"FOCUS"`, `"CLEARLY_IN_FRAME"`, `"SOMEWHAT_IN_FRAME"` (particially obscured or only briefly in the shot), `"NOT_IN_FRAME"`.                                                       |
| `location`       | `String`  | Descriptive location of the source (e.g., `"Behind the door"`, `"Over the PA system"`). |

#### Lexical Content Object (`lexicalContent`)

| Property       | Type      | Description                                                                                                               |
| -------------- | --------- | ------------------------------------------------------------------------------------------------------------------------- |
| `original`     | `Object`  | The verbatim communication in its primary language, keyed by ISO code (e.g., `{"es": "..."}`).                            |
| `translations` | `Object`  | Key-value pairs of ISO language codes to translated strings (e.g., `{"en": "...", "pt": "...", "en-simplified": "..."}`). |
| `isBurnedIn`   | `Boolean` | `true` if this specific block is already burned into the source video file as open captions; `false` otherwise |

#### Annotations Object (`annotations`)

_Note: This object can exist at both the Block level (as a default) and the Segment level (as an override)._

| Property           | Type     | Description                                                                                                                                         |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `language`         | `String` | **(Segment-level only)** ISO language code overriding the block's primary language. Used for code-switching (mixed languages).                      |
| `mannerOfSpeech`   | `String` | The affect or style of communication (e.g., `"Sarcastic"`, `"Happy"`).                                                                              |
| `accentGeneral`    | `String` | Description of an accent in general terms, such as a country, large region, or cultural group (e.g., `"Thick Australian accent"`, `"Deaf accent"`). |
| `accentSpecific`   | `String` | Description of a highly specific accent, such as a region within a nation (e.g., `"Thick Texan accent"`).                                           |
| `impersonation`    | `String` | Descriptive string if the speaker is mimicking another entity (e.g., `"As Dolly Parton"`).                                                          |
| `sonicDescription` | `String` | Environmental effects altering the sound (e.g., `"Muffled"`, `"Distorted"`).                                                                        |
| `vocalDelivery`      | `Enum`   | The volume at which speech in particular is delivered. Options: `"WHISPER"`, `"NORMAL"`, `"SHOUT"`.                                                                                                        |

---

### Segment-Level Properties (`Segment`)

Segments are the lowest configurable units within a `Speech` block. Timing is optional at the segment level; if omitted, rendering engines should interpolate based on the parent Block's start and stop times.

| Property      | Type     | Description                                                                           |
| ------------- | -------- | ------------------------------------------------------------------------------------- |
| `content`     | `String` | The specific unit of communication (e.g., a word, syllable, or punctuation mark).     |
| `timeStart`   | `String` | The start timestamp of this specific segment.                                         |
| `timeStop`    | `String` | The end timestamp of this specific segment.                                           |
| `annotations` | `Object` | Segment-specific overrides, such as language shifts or vocal effort. |

---

### Example Representation

This example demonstrates a primarily English sentence with a Spanish phrase embedded within it, utilizing segment-level language overrides to communicate that the phrase "chico genial" is a Spanish phrase in an English sentence.

```json
{
  "type": "Speech",
  "timeStart": "00:01:10.000",
  "timeStop": "00:01:12.500",
  "importance": 4,
  "speaker": {
    "speakerID": 104,
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

_Inherits from:_ [`Block`](#block)

The `Music` class represents a time-bounded musical event. A Music block may describe an entire musical work, an excerpt from a work, incidental music, a recurring motif, or another temporally distinct musical event.

Music descriptions may contain both structured information about the music itself and authored natural-language descriptions. Structured information allows rendering systems to adapt captions according to user preferences and available display space, while authored text provides a lightweight fallback and allows captioners to preserve descriptions that cannot easily be decomposed.

### Block-Level Properties

| Property            | Type                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`            | `Object`                 | Spatial and diegetic information about where the music originates. Uses the same `Source` object as `Speech`.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `importance`        | `Integer`                | A 1–5 scale indicating the subjective priority of captioning this musical event (1 = Niche/Extremely low, 5 = Crucial).                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `musicMetadata`     | `Object`                 | Information identifying the musical work or recording, where known.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `musicalAttributes` | `Object`                 | Structured musical characteristics such as tempo, key, and genre.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `function`          | `Array<String>`          | One or more functions the music serves within the audiovisual material.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `sonicDescription`  | `Object`                 | Perceptual characteristics of how the music sounds in this event.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `lyrics`            | `Object`                 | Lyrics occurring during this musical event, where applicable.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `displayText`       | `String`                 | Optional authored natural-language description of the musical event. May be used directly by renderers or as a fallback when richer structure is unavailable (e.g., the sentence `"Energetic drums bang on while a deep, synth bass quakes"` might be provided as a fallback to a structured representation of the two instruments).                                                                                                                                                                                                                  |
| `descriptionUnits`  | `Array<DescriptionUnit>` | Structured descriptions of individual musically relevant objects or layers, such as instruments, rhythms, motifs, or voices.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `segments`          | `Array<MusicSegment>`    | Optional timed subdivisions of the musical event. Segment-level values override corresponding block-level values. When a segment supplies a nested object, only the properties explicitly supplied by the segment override the corresponding block-level properties. Other properties continue to inherit from the parent block. For example, a block may define `"QUIET"` as its `loudness`, while a segment may override this with `"LOUD"`. The override applied only to that segment; other properties continue to inherit from the parent block. |
|                     |

---

### Music Metadata Object (`musicMetadata`)

`musicMetadata` identifies the musical work or recording when this information is known. All fields are optional.

Common metadata is represented through explicitly defined properties. Less common metadata may be included using `additionalMetadata`, allowing the format to remain extensible without requiring a predefined field for every possible music-industry metadata standard.

| Property             | Type            | Description                                                                                      |
| -------------------- | --------------- | ------------------------------------------------------------------------------------------------ |
| `title`              | `String`        | Title of the musical work or recording.                                                          |
| `artist`             | `String`        | Primary credited artist or performer.                                                            |
| `year`               | `Integer`       | Year of release, where known.                                                                    |
| `album`              | `String`        | Album or collection containing the recording.                                                    |
| `composer`           | `Array<String>` | Composer or composers of the musical work.                                                       |
| `lyricist`           | `Array<String>` | Lyricist or lyricists.                                                                           |
| `copyrightOwner`     | `Array<String>` | Copyright owner or owners, where relevant and known.                                             |
| `identifiers`        | `Object`        | Known external identifiers, expressed as key-value pairs using the identifier scheme as the key. |
| `additionalMetadata` | `Object`        | Additional metadata not represented by the predefined properties.                                |

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

| Property | Type            | Description                                                                                      |
| -------- | --------------- | ------------------------------------------------------------------------------------------------ |
| `bpm`    | `Float`         | Approximate tempo in beats per minute.                                                           |
| `key`    | `String`        | Musical key, where identifiable and relevant.                                                    |
| `genre`  | `Array<String>` | One or more genres or musical styles associated with the event (e.g., `["synth-pop", "dance"]`). |

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

| Property      | Type     | Description                                                                                          |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `description` | `String` | Free-form description of relevant sonic qualities, such as `"muffled"`, `"distorted"`, or `"tinny"`. |
| `loudness`    | `Enum`   | Loudness relative to other sounds in the scene. Options: `"QUIET"`, `"MEDIUM"`, `"LOUD"`.            |
| `frequency`   | `Object` | Optional description of the frequency characteristics of the event.                                  |

#### Frequency Object

The representation of frequency characteristics remains provisional. This is intended to support viewers who may find it challenging to perceive some frequencies but not others (e.g., someone who may want musical events with predominantly high-frequency content to be captioned more consistently because of hearing loss at higher frequencies).

| Property        | Type   | Description                                                       |
| --------------- | ------ | ----------------------------------------------------------------- |
| `dominantRange` | `Enum` | Predominant frequency range. Options: `"LOW"`, `"MID"`, `"HIGH"`. |


<!-- 
::: issue Issue Notice
I had a reference to an additional "ML profile" with low, medium, and high values. I don't have a note describing what this is, and, er, I forgot. —Caluã
:::
-->

---

### Lyrics Object (`lyrics`)

`lyrics` contains sung or otherwise musically performed lexical content occurring within the Music block.

| Property       | Type      | Description                                                             |
| -------------- | --------- | ----------------------------------------------------------------------- |
| `original`     | `Object`  | Lyrics in their original language, keyed by ISO language code.          |
| `translations` | `Object`  | Optional translations, keyed by ISO language code.                      |
| `isBurnedIn`   | `Boolean` | `true` if the lyrics are already displayed as part of the source video. |

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

> _energetic banjo plays with a slow, quiet bongo grooving warily_

`energetic` and `plays` may be associated with the banjo, while `slow`, `quiet`, `grooving`, and `warily` may be associated with the bongo.

For the moment, description units do **not** have independent importance values. Renderers may select or transform structured information according to user preferences and available space, but the specification does not require captioners to assign a relative priority to every musical object or descriptor.

::: note Basic Note
`displayText` preserves an authored surface rendering. `descriptionUnits` encode semantic information and are not required to reproduce `displayText` verbatim; renderers may introduce, remove, or reorder grammatical material when constructing captions from structured data.
:::

::: note Basic Note
Descriptors associated with an anchor do not override corresponding block-level structured properties. For example, describing an instrument as `"quiet"` does not change the event-level `sonicDescription.loudness`.
:::

#### Description Unit Object

| Property      | Type            | Description                                        |
| ------------- | --------------- | -------------------------------------------------- |
| `anchor`      | `Object`        | The primary musical element described by the unit. |
| `descriptors` | `Array<Object>` | Structured descriptors associated with the anchor. |
| `displayText` | `String`        | Optional authored rendering of the complete unit.  |

#### Anchor Object

| Property | Type     | Description                                                                                              |
| -------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `type`   | `String` | Semantic category of the anchor, such as `"instrument"`, `"voice"`, `"rhythm"`, `"motif"`, or `"music"`. |
| `value`  | `String` | Human-readable identification of the anchor, such as `"banjo"`, `"bongo"`, or `"Woody's theme"`.         |

#### Descriptor Object

| Property | Type     | Description                                                                                            |
| -------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `type`   | `String` | Semantic role of the descriptor, such as `"quality"`, `"action"`, `"manner"`, or `"affectiveQuality"`. |
| `value`  | `String` | Descriptive value associated with the anchor.                                                          |

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

| Property           | Type                     | Description                                                         |
| ------------------ | ------------------------ | ------------------------------------------------------------------- |
| `timeStart`        | `String`                 | Start timestamp of the segment.                                     |
| `timeStop`         | `String`                 | End timestamp of the segment.                                       |
| `function`         | `Array<String>`          | Segment-specific function values overriding the block-level value.  |
| `sonicDescription` | `Object`                 | Segment-specific sonic properties overriding the block-level value. |
| `lyrics`           | `Object`                 | Lyrics occurring specifically during this segment.                  |
| `displayText`      | `String`                 | Optional authored description specific to the segment.              |
| `descriptionUnits` | `Array<DescriptionUnit>` | Optional structured descriptions specific to the segment.           |

## Properties omitted from a segment inherit their values from the parent Music block.

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
    "genre": ["synth-pop", "dance"]
  },

  "function": ["SET_MOOD_TONE", "CONVEY_PRESENCE_ABSENCE_PLACE_TIME"],

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

  "tags": ["#party", "#recurring-theme"],

  "metadata": {
    "blockId": "550e8400-e29b-41d4-a716-446655440001",
    "author": "JaneDoe_Editor",
    "createdAt": "2026-07-01T14:30:00Z",
    "updatedAt": "2026-07-01T15:10:00Z"
  }
}
```

## Sound Effects

**Inherits from:** [`Block`](#block)

The `SoundEffect` class represents a time-bounded non-lexical, non-musical sound event. A SoundEffect block may describe an individual sound, a sequence of related sounds, a continuous environmental sound, or another temporally distinct auditory event.

Sound effect descriptions may contain both structured information about the sound itself and authored natural-language descriptions. Structured information allows rendering systems to adapt captions according to user preferences and available display space, while authored text provides a lightweight fallback and allows captioners to preserve descriptions that cannot easily be decomposed.

### Block-Level Properties

| Property           | Type                        | Description                                                                                                                                                  |
| ------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `source`           | `Object`                    | Spatial and diegetic information about where the sound originates. Uses the same `Source` object as `Speech` and `Music`.                                    |
| `importance`       | `Integer`                   | A 1–5 scale indicating the subjective priority of captioning this event (1 = Niche/Extremely low, 5 = Crucial).                                              |
| `soundMetadata`    | `Object`                    | Information identifying a specific or culturally recognisable sound, or information about its production, where known.                                       |
| `function`         | `Array<String>`             | One or more functions the sound serves within the audiovisual material.                                                                                      |
| `sonicDescription` | `Object`                    | Perceptual characteristics of how the sound is heard in the scene.                                                                                           |
| `displayText`      | `String`                    | Optional authored natural-language description of the sound effect. May be used directly by renderers or as a fallback when richer structure is unavailable. |
| `descriptionUnits` | `Array<DescriptionUnit>`    | Structured descriptions of individual sounds, sound sources, actions, or other relevant elements within the event.                                           |
| `segments`         | `Array<SoundEffectSegment>` | Optional timed subdivisions of the sound effect event. Segment-level values override corresponding block-level values.                                       |

---

### Sound Metadata Object (`soundMetadata`)

`soundMetadata` identifies a specific or culturally recognisable sound, or provides information about the production of the sound, where this information is known. All fields are optional.

| Property             | Type      | Description                                                                            |
| -------------------- | --------- | -------------------------------------------------------------------------------------- |
| `name`               | `String`  | Name or recognised identity of the sound, where known.                                 |
| `category`           | `String`  | General category of sound.                                                             |
| `year`               | `Integer` | Year associated with the original recording or creation of the sound, where known.     |
| `source`             | `String`  | Original work, collection, recording, or other source from which the sound originates. |
| `performer`          | `String`  | Performer responsible for the sound, where applicable.                                 |
| `recordingTechnique` | `String`  | Information about how the sound was recorded or produced, where relevant.              |
| `identifiers`        | `Object`  | External or domain-specific identifiers, where available.                              |
| `additionalMetadata` | `Object`  | Additional metadata not represented by the predefined properties.                      |

Example:

```json
"soundMetadata": {
  "name": "Wilhelm scream",
  "category": "Human vocalisation",
  "year": 1951,
  "source": "Distant Drums",
  "performer": "Sheb Wooley (attributed)",
  "recordingTechnique": "Studio-recorded sound effect",
  "identifiers": {
    "assetId": "SFX-HUM-SCREAM-001",
    "libraryId": "WB-SFX-0427"
  },
  "additionalMetadata": {
    "originalScene": "Recorded for a scene in which a man is attacked by an alligator",
    "laterAssociation": "Named after Private Wilhelm in The Charge at Feather River (1953)",
    "library": "Warner Bros. sound effects library"
  }
}
```

---

### Source (`source`)

Sound Effects use the same `Source` object as [`Speech`](#source-object-source) and `Music`. This describes whether a sound is diegetic, the visual presence of its source, and its location within the scene.

Sound Effects may also contain additional spatial information describing the apparent direction and movement of a sound. These properties are proposed as extensions to the shared `Source` object and may also be applicable to Speech and Music.

| Property    | Type     | Description                                                                                                            |
| ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| `direction` | `Enum`   | Apparent direction from which the sound is heard. Options: `LEFT`, `RIGHT`, `CENTRE`, `ABOVE`, `BELOW`, `SURROUNDING`. |
| `movement`  | `Object` | Optional spatial movement of the sound, specifying its starting and ending directions.                                 |

#### Movement Object (`movement`)

| Property | Type   | Description                                                                |
| -------- | ------ | -------------------------------------------------------------------------- |
| `from`   | `Enum` | Starting direction of the sound, using the values defined for `direction`. |
| `to`     | `Enum` | Ending direction of the sound, using the values defined for `direction`.   |

####

**Example 1: Stationary sound source**

The following example describes a telephone ringing in an adjacent room to the left of the viewer.

```json
{
  "source": {
    "isDiegetic": true,
    "visualPresence": "NOT_IN_SHOT",
    "location": "Inside the neighbouring room",
    "direction": "LEFT"
  }
}
```

The telephone is not visible, but its sound originates from the left. As the sound remains stationary, no `movement` property is required.

**Example 2: Moving sound source**

The following example describes an aeroplane flying overhead, with its engine noise moving from left to right.

```json
{
  "source": {
    "isDiegetic": true,
    "visualPresence": "CLEARLY_IN_SHOT",
    "location": "An aeroplane flying overhead",
    "direction": "LEFT",
    "movement": {
      "from": "LEFT",
      "to": "RIGHT"
    }
  }
}
```

The engine noise initially comes from the left and moves towards the right as the aeroplane passes overhead. The `movement` object describes this directional change over the duration of the event.

<!-- TODO:
- SHARED SOURCE OBJECT:
  Direction and movement are proposed additions to the existing Source
  object used by Speech and Music. If agreed, these properties should
  be incorporated into the shared definition rather than maintained
  separately within SoundEffect.

- DIRECTION:
  Confirm the proposed enum values: LEFT, RIGHT, CENTRE, ABOVE,
  BELOW, SURROUNDING.
  Consider whether SURROUNDING should instead represent a separate
  spatial characteristic, since it describes a diffuse rather than
  directional source.

- MOVEMENT:
  The proposed from/to structure supports straightforward directional
  movement but does not fully represent more complex trajectories.
  Consider whether additional movement types (e.g., CIRCLING,
  APPROACHING, RECEDING) are necessary.
  Clarify how direction relates to movement.from when both are supplied,
  to avoid redundant or contradictory values.

- SEGMENT-LEVEL CHANGES:
  Use SoundEffect segments to represent changes in direction, movement
  and visualPresence over time, following the inheritance/override
  approach established by Music.
  Confirm that nested Source properties can be overridden independently
  at segment level.

- FUTURE EXAMPLE:
  Consider a more complex example in the Sound Effect Segments section:
  Tinker Bell's magical chimes begin off-screen, swirl from left to
  right, and become associated with a visible source when she enters
  the shot. This could demonstrate spatial movement, changes in
  visualPresence and timed segment-level overrides.

-->

### Importance (`importance`)

The `importance` property uses the same 1–5 scale as `Speech` and `Music`, indicating the subjective priority of captioning a sound effect.

Importance reflects the extent to which omitting the sound could affect a viewer's interpretation or understanding of the audiovisual content. It does not necessarily correspond to the loudness or prominence of the sound.

For example, a quiet door unlocking may be crucial to understanding a scene, while a loud but incidental background noise may have relatively low importance.

<!-- TODO:
- Confirm that Sound Effects should use the existing shared
  1–5 importance scale.
- Consider whether additional guidance or examples are needed
  to support consistent importance ratings across captioners.
- Confirm whether importance can be overridden at segment level
  when the significance of a sound changes over time.
-->

---

### Function (`function`)

`function` describes what a sound effect contributes to the audiovisual material. It is distinct from `importance`: function describes the role of the sound, whereas importance concerns the priority of captioning the event.

Zero or more functions may be specified. A sound effect may serve multiple functions simultaneously.

The following values are shared with Music:

- `SET_MOOD_TONE`
- `CONVEY_PRESENCE_ABSENCE_PLACE_TIME`
- `CONNECT_TO_CULTURAL_TOPICS`

The following additional values are proposed for Sound Effects:

- `CONVEY_ACTION_EVENT` — Communicates an action or event, including those occurring outside the visible scene.
- `REVEAL_NARRATIVE_INFORMATION` — Provides information that contributes to the viewer's understanding of the narrative, such as revealing an unseen presence, danger or significant development.
- `SIGNAL_TRANSITION_CHANGE` — Indicates a change in state, activity or situation, such as an engine stopping, a door opening or an alarm activating.

#### Example

A quiet metallic click might indicate a door being unlocked, revealing that someone has gained access to a locked room.

```json
"function": [
  "CONVEY_ACTION_EVENT",
  "REVEAL_NARRATIVE_INFORMATION"
]
```

Although the sound may be quiet, it could have high `importance` because it communicates a significant narrative development.

<!-- TODO:
- Confirm whether these additional narrative functions are useful
  and sufficiently distinct from the existing Music functions.

- Consider whether CONVEY_ACTION_EVENT and
  REVEAL_NARRATIVE_INFORMATION overlap, and whether both are needed.

- Consider whether these functions should be shared across Speech,
  Music and Sound Effects rather than defined separately.
-->

---

### Sonic Description (`sonicDescription`)

`sonicDescription` describes the perceptual characteristics of a sound effect as heard within the audiovisual material. These properties concern how the sound is heard rather than its source, identity, or narrative function.

The structure follows the `sonicDescription` object defined for Music, allowing perceptual characteristics to be represented consistently across sound event types.

| Property      | Type     | Description                                                                                                          |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `description` | `String` | Free-form description of relevant sonic qualities, such as `"metallic"`, `"muffled"`, `"echoing"`, or `"crackling"`. |
| `loudness`    | `Enum`   | Perceived loudness relative to other sounds in the scene. Options: `QUIET`, `MEDIUM`, `LOUD`.                        |
| `frequency`   | `Object` | Optional description of the frequency characteristics of the sound effect. Uses the same structure as Music.         |

#### Example

```json
"sonicDescription": {
  "description": "Sharp, metallic, with a lingering echo",
  "loudness": "LOUD",
  "frequency": {
    "dominantRange": "HIGH"
  }
}
```

This example describes a loud, high-pitched metallic sound with a lingering echo, such as a metal object being struck.

<!-- TODO:
- Consider whether sonicDescription should be defined as a shared
  object across Speech, Music and Sound Effects.

- Confirm whether the existing loudness values (QUIET, MEDIUM, LOUD)
  provide sufficient granularity for sound effects.

- Consider whether a single free-text description is sufficient
  for perceptual qualities, or whether structured descriptors
  would better support filtering and personalised rendering.

- Clarify the distinction between sonicDescription and
  descriptionUnits to avoid duplicating information.

- Confirm whether sonicDescription properties can be overridden
  at segment level to represent changes in the sound over time.
-->

#### Frequency Object (`frequency`)

The `frequency` object describes the predominant frequency characteristics of a sound effect. It follows the same structure as the Frequency object defined for Music.

This information may support personalised caption rendering, particularly for viewers who have difficulty perceiving sounds within certain frequency ranges.

| Property        | Type   | Description                                                                     |
| --------------- | ------ | ------------------------------------------------------------------------------- |
| `dominantRange` | `Enum` | Predominant frequency range of the sound effect. Options: `LOW`, `MID`, `HIGH`. |

#### Example

```json
"frequency": {
  "dominantRange": "HIGH"
}
```

This example could describe a high-pitched electronic beep or whistle.

<!-- TODO:
- Confirm whether LOW, MID and HIGH provide sufficient
  granularity for sound effects.

- Consider how to represent sounds containing multiple
  prominent frequency ranges, such as explosions or machinery.

- Determine whether frequency boundaries should be formally
  defined or remain perceptual categories.

- Consider whether frequency should become a shared object
  across Speech, Music and Sound Effects.

- Retain the unresolved question from Music regarding
  the proposed ML profile and its intended purpose.
-->

---

### Description Units (`descriptionUnits`)

`descriptionUnits` provide structured descriptions of individual sounds, sound sources, actions, or other identifiable elements within a sound effect event.

Each unit is organised around an `anchor`: the primary element being described. Descriptors are associated with that anchor to describe its actions, qualities, or manner.

This structure allows information about different elements of a sound effect to remain semantically associated, while supporting different approaches to describing the same auditory event.

#### Sound-Centred and Source-Centred Descriptions

Description units support two complementary approaches to describing sound effects:

- **Sound-centred descriptions** focus on the audible event itself, such as footsteps, a crash, or a ringing sound.
- **Source-centred descriptions** focus on the entity or action producing the sound, such as a person walking, a glass breaking, or a telephone ringing.

Captioners may use either approach or combine both within the same sound effect event. Where both perspectives are represented in the structured data, rendering systems may select or combine information according to listener preferences and available display space.

For example, the same event might be described as:

- **Sound-centred:** "Click"
- **Source-centred:** "Camera turns off"
- **Combined:** "Camera turns off with a soft click"

Neither approach is considered inherently preferable. The appropriate level and focus of description depend on the audiovisual context and the information available to the captioner.

As with Music, description units do not currently have independent importance values. Renderers may select or transform structured information according to user preferences and available space, but captioners are not required to assign a relative priority to every element or descriptor.

`displayText` preserves an authored natural-language rendering, while `descriptionUnits` encode semantic information. Renderers are not required to reproduce the authored text verbatim and may introduce, remove, or reorder grammatical material when constructing captions.

Descriptors associated with an individual anchor do not override corresponding block-level structured properties. For example, describing footsteps as `"quiet"` does not change the event-level `sonicDescription.loudness`.

#### Description Unit Object

| Property      | Type            | Description                                                                      |
| ------------- | --------------- | -------------------------------------------------------------------------------- |
| `anchor`      | `Object`        | The primary sound, source, action, or other event element described by the unit. |
| `descriptors` | `Array<Object>` | Structured descriptors associated with the anchor.                               |
| `displayText` | `String`        | Optional authored rendering of the complete unit.                                |

#### Anchor Object

| Property | Type     | Description                                                                                                 |
| -------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `type`   | `String` | Semantic category of the anchor, such as `"sound"`, `"object"`, `"person"`, `"animal"`, or `"environment"`. |
| `value`  | `String` | Human-readable identification of the anchor, such as `"footsteps"`, `"person"`, `"keys"`, or `"thunder"`.   |

The anchor vocabulary is intentionally extensible, allowing captioners to represent both audible events and their sources without requiring separate data structures.

#### Descriptor Object

| Property | Type     | Description                                                                                            |
| -------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `type`   | `String` | Semantic role of the descriptor, such as `"quality"`, `"action"`, `"manner"`, or `"affectiveQuality"`. |
| `value`  | `String` | Descriptive value associated with the anchor.                                                          |

The descriptor vocabulary is intentionally extensible. Renderers should not assume that the order of descriptors corresponds to their relative importance or necessarily to their surface order in a particular language.

#### Example

The following example demonstrates both sound-centred and source-centred descriptions of footsteps approaching.

```json
"descriptionUnits": [
  {
    "anchor": {
      "type": "sound",
      "value": "footsteps"
    },
    "descriptors": [
      {
        "type": "quality",
        "value": "heavy"
      },
      {
        "type": "action",
        "value": "approach"
      }
    ],
    "displayText": "Heavy footsteps approach"
  },
  {
    "anchor": {
      "type": "person",
      "value": "person"
    },
    "descriptors": [
      {
        "type": "action",
        "value": "walks"
      },
      {
        "type": "manner",
        "value": "heavily"
      }
    ],
    "displayText": "A person walks heavily"
  }
]
```

The first unit describes the audible footsteps, while the second describes the person producing them. Both describe the same underlying event from different perspectives.

A rendering system could use either description, provided the information is available, or potentially combine them into a more detailed caption.

<!-- TODO:
- STRUCTURAL CONSOLIDATION:
  The original placeholder sections "Description Unit Structure",
  "Anchors" and "Descriptors" have been removed because their
  intended content is now incorporated into the Description Units
  section above.

  The Description Unit Object defines the overall structure,
  including anchors, descriptors and optional displayText.
  The Anchor and Descriptor Objects define their respective
  properties. Separate sections would duplicate this information.

- SOUND-CENTRED AND SOURCE-CENTRED DESCRIPTIONS:
  The structure intentionally supports both descriptions of sounds
  themselves (e.g., "footsteps approach") and descriptions of their
  sources or actions (e.g., "a person walks").

  Neither approach is preferred. Captioners may use either or both,
  and renderers may support different listener preferences where
  sufficient structured information is available.

  Consider whether alternative descriptions of the same event
  require explicit relationships or grouping, so renderers can
  distinguish alternatives from independent sounds.

- SHARED STRUCTURE WITH MUSIC:
  The anchor/descriptor approach follows Music's Description Units,
  but has been adapted to accommodate sound effects, their sources
  and associated actions.

  Consider whether the underlying objects should eventually be
  shared across Music and Sound Effects, while allowing different
  anchor categories.

- ANCHOR CATEGORIES:
  The original brainstorm included sounds, objects/sources,
  non-lexical human and animal vocalisations, and environmental
  sounds. These are accommodated through extensible anchor types.

  Review whether controlled categories are needed and how to
  distinguish a sound from the object or entity producing it.

- DESCRIPTOR CATEGORIES:
  The current structure supports qualities, actions, manner and
  affective qualities.

  Consider whether additional descriptor types are needed for
  repetition and temporal patterns, such as "three rapid knocks",
  "intermittent beeping" or "rhythmic tapping".

  Determine whether repetition should be represented through
  descriptors, segments or another structured property.

- SONIC DESCRIPTION:
  Clarify the boundary between individual descriptors and
  block-level sonicDescription properties to avoid unnecessary
  duplication or contradictory values.

- MULTIPLE SOUNDS:
  Consider how to represent simultaneous, sequential and causally
  related sounds, including relationships between description units.

- RENDERING:
  Consider how renderers can select sound-centred, source-centred
  or combined descriptions based on listener preferences and
  available display space.

  Renderers should not infer sources, actions or relationships
  that are not represented in the structured data.

- SEGMENTS:
  Confirm whether descriptionUnits can be supplied or overridden
  at segment level when sounds begin, change or end.

- IMPORTANCE:
  Description Units currently follow Music in not having their
  own importance values. Revisit whether unit-level importance
  would improve personalised caption rendering.
-->

---

### Sound Effect Segments (`segments`)

A `SoundEffect` block may contain one or more timed segments representing changes within a longer sound effect event.

Segments allow a continuous or related sequence of sounds to be represented as a single block while preserving changes in their characteristics, actions, spatial properties or descriptions over time.

For example, segments may represent:

- Footsteps beginning slowly and gradually accelerating.
- An alarm starting quietly and becoming louder.
- An engine starting, idling and then revving.
- A sequence of related impacts or mechanical sounds.
- A sound moving through the scene or becoming associated with a visible source.

#### Sound Effect Segment Object

Each `SoundEffectSegment` specifies a time interval within the parent block and may provide properties that override the corresponding block-level values.

| Property           | Type                     | Description                                                                                      |
| ------------------ | ------------------------ | ------------------------------------------------------------------------------------------------ |
| `timeStart`        | `String`                 | Start time of the segment, using the same timestamp format as other blocks.                      |
| `timeStop`         | `String`                 | End time of the segment, using the same timestamp format as other blocks.                        |
| `source`           | `Object`                 | Optional override of the sound's spatial or diegetic properties.                                 |
| `importance`       | `Integer`                | Optional override of the sound's importance (1–5).                                               |
| `function`         | `Array<String>`          | Optional override of the functions served by the sound.                                          |
| `sonicDescription` | `Object`                 | Optional override of the sound's perceptual characteristics.                                     |
| `displayText`      | `String`                 | Optional authored description specific to the segment.                                           |
| `descriptionUnits` | `Array<DescriptionUnit>` | Optional structured descriptions of the sounds, sources or actions occurring within the segment. |

#### Inheritance and Overrides

Segments follow the same inheritance model as Music.

Properties defined at block level apply throughout the event unless overridden by a segment. When a segment provides a nested object, only the explicitly supplied properties override the corresponding block-level properties. Other properties continue to inherit from the parent block.

For example, a block may describe an engine as `QUIET`, while a later segment overrides its loudness to `LOUD` as the engine revs.

This allows changes to be represented without repeating information that remains consistent throughout the event.

#### Example

The following example represents an engine starting, idling and then revving.

```json
{
  "timeStart": "00:01:10.000",
  "timeStop": "00:01:18.000",
  "displayText": "An engine starts, idles, then revs loudly",
  "source": {
    "isDiegetic": true,
    "visualPresence": "CLEARLY_IN_SHOT",
    "location": "A car parked in the foreground"
  },
  "sonicDescription": {
    "loudness": "MEDIUM",
    "description": "Low mechanical rumbling"
  },
  "segments": [
    {
      "timeStart": "00:01:10.000",
      "timeStop": "00:01:12.000",
      "displayText": "The engine starts",
      "descriptionUnits": [
        {
          "anchor": {
            "type": "object",
            "value": "engine"
          },
          "descriptors": [
            {
              "type": "action",
              "value": "starts"
            }
          ]
        }
      ]
    },
    {
      "timeStart": "00:01:12.000",
      "timeStop": "00:01:15.000",
      "displayText": "The engine idles",
      "descriptionUnits": [
        {
          "anchor": {
            "type": "object",
            "value": "engine"
          },
          "descriptors": [
            {
              "type": "action",
              "value": "idles"
            }
          ]
        }
      ]
    },
    {
      "timeStart": "00:01:15.000",
      "timeStop": "00:01:18.000",
      "displayText": "The engine revs loudly",
      "sonicDescription": {
        "loudness": "LOUD"
      },
      "descriptionUnits": [
        {
          "anchor": {
            "type": "object",
            "value": "engine"
          },
          "descriptors": [
            {
              "type": "action",
              "value": "revs"
            }
          ]
        }
      ]
    }
  ]
}
```

The parent block identifies the overall sound event and provides properties shared across its duration.

Each segment describes a distinct phase of the event. The final segment overrides the block-level loudness while inheriting the remaining properties.

<!-- TODO:
- INHERITANCE:
  Confirm that SoundEffect segments should follow Music's
  inheritance and nested-property override model.

- OVERRIDABLE PROPERTIES:
  Review which block-level properties should be overridable
  at segment level, including source, importance, function,
  sonicDescription, displayText and descriptionUnits.

- DESCRIPTION UNITS:
  Confirm whether segment-level descriptionUnits replace the
  block-level array or whether individual units can be
  inherited, modified or supplemented.

- SOUND DEVELOPMENT:
  Segments are intended to represent the development of
  a sound over time, including changes in action, intensity,
  quality, repetition and spatial characteristics.

  Consider whether gradual transitions require additional
  properties or whether successive segments are sufficient.

- SPATIAL CHANGES:
  Confirm how changes in source.direction, source.movement
  and source.visualPresence should be represented across
  segments.

  A potential future example is Tinker Bell's magical chimes
  beginning off-screen, moving through the scene and becoming
  associated with a visible source.

- TIMING:
  Confirm whether segments may overlap, whether gaps are
  permitted and how simultaneous changes should be handled.

- BLOCK BOUNDARIES:
  Clarify when a developing sound should remain one
  SoundEffect block with multiple segments versus when
  separate SoundEffect blocks are more appropriate.

- METADATA:
  Consider whether soundMetadata should remain exclusively
  at block level or whether metadata changes are meaningful
  at segment level.
-->

---

### Full Example

The following fictional example demonstrates a `SoundEffect` block representing an initially unidentified mechanical sound that gradually becomes recognisable as an approaching helicopter. The helicopter moves into the foreground, where a mounted Gatling gun begins spinning up before the helicopter accelerates towards the viewer and opens fire.

The example demonstrates how a sound effect can develop over time, both acoustically and narratively. It also illustrates how structured captions can preserve the gradual identification of a sound source rather than revealing its identity immediately.

The example includes:

- Block-level timing, importance and function.
- Changes in the identification and visual prominence of a sound source.
- Spatial movement and changing audible characteristics.
- Sound-centred and source-centred descriptions.
- Multiple related sounds, including continuous rotor noise and a new mechanical sound.
- Authored natural-language descriptions.
- Timed segments with property inheritance and overrides.

#### Example

#### Full Example

The following example describes a sound that develops from a faint mechanical whirring into a recognisable helicopter rotor, accompanied by an increasingly high-pitched mechanical whine and rapid bursts of gunfire.

```json
{
  "type": "SoundEffect",
  "timeStart": 0,
  "timeStop": 25,
  "source": {
    "isDiegetic": true,
    "visualPresence": "NOT_IN_SHOT"
  },
  "importance": 4,
  "function": ["SET_MOOD_TONE", "CONVEY_PRESENCE_ABSENCE_PLACE_TIME"],
  "sonicDescription": {
    "description": "A mechanical sound develops into a loud, rhythmic rotor noise, joined by a rising metallic whine and rapid explosive bursts.",
    "loudness": "LOUD",
    "frequency": {
      "dominantRange": "LOW"
    }
  },
  "segments": [
    {
      "timeStart": 0,
      "timeStop": 4,
      "importance": 2,
      "function": ["SET_MOOD_TONE"],
      "sonicDescription": {
        "description": "A faint, low mechanical whirring with an uneven, pulsing rhythm.",
        "loudness": "QUIET"
      },
      "displayText": "A faint mechanical whirring.",
      "descriptionUnits": [
        {
          "anchor": {
            "type": "SOUND",
            "value": "mechanical whirring"
          },
          "descriptors": [
            {
              "type": "LOUDNESS",
              "value": "faint"
            },
            {
              "type": "RHYTHM",
              "value": "unevenly pulsing"
            }
          ]
        }
      ]
    },
    {
      "timeStart": 4,
      "timeStop": 8,
      "importance": 3,
      "function": ["CONVEY_PRESENCE_ABSENCE_PLACE_TIME"],
      "sonicDescription": {
        "description": "The whirring grows louder and develops a distinct, rhythmic chopping quality.",
        "loudness": "MEDIUM"
      },
      "displayText": "The whirring grows into a rhythmic chopping sound.",
      "descriptionUnits": [
        {
          "anchor": {
            "type": "SOUND",
            "value": "mechanical whirring"
          },
          "descriptors": [
            {
              "type": "RHYTHM",
              "value": "rhythmic chopping"
            },
            {
              "type": "LOUDNESS",
              "value": "growing louder"
            }
          ]
        }
      ]
    },
    {
      "timeStart": 8,
      "timeStop": 12,
      "source": {
        "location": "Helicopter",
        "direction": "ABOVE"
      },
      "importance": 4,
      "function": ["CONVEY_PRESENCE_ABSENCE_PLACE_TIME", "CONVEY_ACTION_EVENT"],
      "sonicDescription": {
        "description": "Loud helicopter rotors produce a deep, repetitive chopping sound.",
        "loudness": "LOUD"
      },
      "displayText": "Helicopter rotors thrum loudly overhead.",
      "descriptionUnits": [
        {
          "anchor": {
            "type": "SOURCE",
            "value": "helicopter rotors"
          },
          "descriptors": [
            {
              "type": "SOUND",
              "value": "deep, repetitive chopping"
            },
            {
              "type": "LOUDNESS",
              "value": "loud"
            }
          ]
        }
      ]
    },
    {
      "timeStart": 12,
      "timeStop": 16,
      "importance": 4,
      "function": ["SET_MOOD_TONE", "REVEAL_NARRATIVE_INFORMATION"],
      "sonicDescription": {
        "description": "A rapid metallic whirring emerges beneath the rotor noise, rising steadily in pitch.",
        "loudness": "MEDIUM",
        "frequency": {
          "dominantRange": "HIGH"
        }
      },
      "displayText": "A metallic whine rises beneath the rotor noise.",
      "descriptionUnits": [
        {
          "anchor": {
            "type": "SOUND",
            "value": "metallic whirring"
          },
          "descriptors": [
            {
              "type": "PITCH",
              "value": "steadily rising"
            },
            {
              "type": "TIMBRE",
              "value": "metallic"
            }
          ]
        }
      ]
    },
    {
      "timeStart": 16,
      "timeStop": 20,
      "importance": 5,
      "function": ["SET_MOOD_TONE", "REVEAL_NARRATIVE_INFORMATION"],
      "sonicDescription": {
        "description": "The metallic whine becomes faster and sharper, layered over the continuous rotor thrum.",
        "loudness": "LOUD",
        "frequency": {
          "dominantRange": "HIGH"
        }
      },
      "displayText": "The metallic whine intensifies over the thundering rotors.",
      "descriptionUnits": [
        {
          "anchor": {
            "type": "SOUND",
            "value": "metallic whine"
          },
          "descriptors": [
            {
              "type": "PITCH",
              "value": "high and rising"
            },
            {
              "type": "INTENSITY",
              "value": "increasing"
            }
          ]
        }
      ]
    },
    {
      "timeStart": 20,
      "timeStop": 25,
      "importance": 5,
      "function": ["CONVEY_ACTION_EVENT"],
      "sonicDescription": {
        "description": "A rapid succession of sharp, explosive cracks erupts over the continuous mechanical roar.",
        "loudness": "LOUD"
      },
      "displayText": "Rapid gunfire rattles over the roaring rotors.",
      "descriptionUnits": [
        {
          "anchor": {
            "type": "SOURCE",
            "value": "gunfire"
          },
          "descriptors": [
            {
              "type": "SOUND",
              "value": "sharp explosive cracks"
            },
            {
              "type": "RHYTHM",
              "value": "rapid succession"
            }
          ]
        }
      ]
    }
  ]
}
```

#### Interpretation

The example demonstrates the progression of an auditory event through six phases:

1. **Unidentified sound:** A faint, low mechanical whirring is audible. The caption describes its characteristics without prematurely identifying the source.
2. **Developing sound:** The whirring grows louder and develops a more distinct, rhythmic chopping quality.
3. **Source identification:** The sound becomes recognisable as helicopter rotors, producing a loud, repetitive thrum.
4. **Additional sound:** A rapid metallic whirring emerges beneath the continuing rotor noise, gradually increasing in pitch.
5. **Increasing intensity:** The metallic whine becomes faster and sharper, layered over the continuous rotor sound.
6. **Gunfire:** Rapid, explosive cracks become audible alongside the continuing mechanical roar.

The parent `SoundEffect` block represents the overall event, while individual segments describe how its audible characteristics, source identification, spatial properties, importance and narrative function develop over time.

The example demonstrates both **sound-centred** descriptions, such as the unidentified mechanical whirring and metallic whine, and **source-centred** descriptions, such as helicopter rotors and gunfire.

The `function` property distinguishes between sounds that establish mood or presence, reveal narrative information, and communicate actions or events. These functions may change as the sound develops.

Segment-level values override corresponding block-level properties. For nested objects, only explicitly supplied properties are overridden, while other values continue to be inherited.

The example deliberately omits `soundMetadata`, as it describes generic helicopter and weapon sounds rather than a particular recording or recognisable sound associated with a specific work. However, if the example instead featured the distinctive sound of a TIE fighter from _Star Wars_, `soundMetadata` could identify the sound and its fictional origin. This would help distinguish a culturally recognisable sound effect from a generic description of an engine or spacecraft, while `sonicDescription` would continue to describe its audible characteristics.

<!-- TODO:
- PROGRESSIVE IDENTIFICATION:
  The example begins with an unidentified sound that later
  becomes recognisable as a helicopter.

  Consider how to represent progressive identification without
  requiring the source to be named at block level, potentially
  revealing information before the intended narrative moment.

  The current example uses segment-level descriptionUnits and
  authored displayText to preserve this progression.

  Clarify whether segment-level displayText should take precedence
  over block-level displayText during the segment's time interval,
  ensuring that renderers do not reveal information prematurely.

- CHANGING IMPORTANCE:
  The example uses segment-level importance values to represent
  the increasing narrative significance of the sound.

  Confirm whether this is the intended interpretation of
  importance and how segment-level values interact with the
  block-level value.

- SPATIAL MOVEMENT:
  Review whether direction, movement and location adequately
  represent a helicopter approaching from a distance, moving
  overhead and accelerating towards the viewer.

  Consider whether distance, approach and recession require
  additional structured spatial properties.

- MULTIPLE SOUNDS FROM A SHARED SOURCE:
  The helicopter produces continuous rotor noise while a mounted
  Gatling gun introduces a separate mechanical sound.

  Consider how to associate multiple sound-producing components
  with a shared parent source.

- SIMULTANEOUS SOUND DEVELOPMENT:
  The rotor noise continues while the Gatling gun spins up and
  fires. The example currently represents these overlapping
  sounds through combined segment descriptions.

  Determine whether this approach is sufficient or whether
  independently developing sounds require separate SoundEffect
  blocks or explicit relationships.

- SOUND-CENTRED AND SOURCE-CENTRED DESCRIPTIONS:
  Consider how alternative descriptions of the same underlying
  sound can be explicitly associated, allowing renderers to
  distinguish different perspectives from separate audible events.

- DESCRIPTION UNIT INHERITANCE:
  The example assumes that segment-level descriptionUnits replace
  the block-level array for the corresponding time interval.

  Confirm whether replacement, extension or individual unit
  overrides are appropriate.

- FREQUENCY:
  The example avoids assigning a single dominant frequency to
  segments containing several overlapping sounds with different
  frequency characteristics.

  Consider whether frequency should be associated with individual
  description units or independent sound events in such cases.

- BLOCK BOUNDARIES:
  Consider whether the entire sequence should remain one
  SoundEffect block or whether the helicopter and weapon should
  be represented as separate, related SoundEffect blocks.

- METADATA:
  Consider adding a separate example demonstrating soundMetadata
  for an identifiable recording or culturally recognisable sound.
-->

## Misc

*Inherits from:* [`Block`](#block)

The `Misc` class represents caption information that is not directly present in the audio. Most often this is non-speech visual information, such as a translation of a sign written in another language, a correction of something stated on screen, or a news headline. Misc blocks may also carry information that a captioner or researcher chooses to add for a particular audience, such as descriptions of important visual events for viewers with low vision.

Misc is intentionally open. It gives captioners and researchers a place to experiment with new kinds of caption content without requiring a new class for every idea. If a kind of Misc content becomes common and well defined, it may later be promoted to its own class.

### Block-Level Properties

| Property | Type | Description |
|---|---|---|
<!--
| `importance` | `Integer` | A 1–5 scale indicating the subjective priority of captioning this information (1 = Niche/Extremely low, 5 = Crucial). |
-->
| `informationType` | `String` | The context or purpose of the text, such as a translation or a caption credit. |
| `textContent` | `Object` | The text of the Misc block in its original language, along with any translations. |

<!--
::: issue Issue Notice
  I added `importance` to match `Speech` and `Music`, but I am not sure it means the same thing here. Some Misc content (e.g., `ATTRIBUTION` or `ADVERT`) is not really "captioning an event," so a 1–5 priority may be less meaningful. Should we keep it, define it differently for Misc, or drop it? —Saad
:::
-->
---

### Information Type (`informationType`)

`informationType` describes why the Misc block exists. It is distinct from `importance`: a type describes the role of the information, whereas `importance` concerns the priority of captioning it.

The field is purposely open for experimentation. Captioners and researchers may define their own values (e.g., `COGNITIVE_ACCESS_LOW`, a value a researcher might add for a study on simplified captions).

Suggested values are:

- `DIRECTORIAL_ASIDE`
- `CORRECTION`
- `TRANSLATION`
- `ON_SCREEN_TEXT`
- `EXTRA_CONTEXT`
- `IMPLIED_MEANING`
- `LOW_VISION_ACCESS`
- `ATTRIBUTION`
- `ADVERT`

Further values may be added as the specification develops.

#### Example

```json
"informationType": "CORRECTION"
```

::: issue Issue Notice
  Should `informationType` allow more than one value? Some blocks fit several types. For example, a translated news headline is both `TRANSLATION` and `ON_SCREEN_TEXT`. One option is to make it an `Array<String>`, like `function` in `Music`. —Saad
:::

---

### Text Content Object (`textContent`)

`textContent` contains the text displayed by the Misc block. It follows the same structure as the `lexicalContent` object in `Speech`.

| Property | Type | Description |
|---|---|---|
| `original` | `Object` | The text in its primary language, keyed by ISO language code. |
| `translations` | `Object` | Optional translations, keyed by ISO language code. |

#### Example

```json
"textContent": {
  "original": {
    "en": "Actually the 400 series"
  },
  "translations": {
    "es": "En realidad, la serie 400"
  }
}
```

---

### Example Representation

```json
{
  "type": "Misc",
  "timeStart": "00:03:05.000",
  "timeStop": "00:03:08.000",

  "importance": 3,

  "informationType": "TRANSLATION",

  "textContent": {
    "original": {
      "en": "The White Rabbit"
    },
    "translations": {
      "pt-BR": "O Coelho Branco"
    }
  },

  "positionNoGos": [
    {
      "xMin": 30.0,
      "xMax": 70.0,
      "yMin": 10.0,
      "yMax": 25.0
    }
  ],

  "notes": "Translates the German pub sign 'Das Weiße Kaninchen' shown above the door.",

  "tags": [
    "#signage"
  ],

  "metadata": {
    "blockId": "550e8400-e29b-41d4-a716-446655440002",
    "author": "JaneDoe_Editor",
    "createdAt": "2026-10-10T14:00:00Z",
    "updatedAt": "2026-10-10T14:05:00Z"
  }
}
```

# Design Principles

The intial version of the Rich Captioning Specifications was designed by Benjamin Gorman, Caluã de Lacerda Pataca, Saad Hassan, and Lloyd May. They attempted to follow the following design principles while constructing the first version:

- **Technology-aware approach:**
  - We are imagining this format from scratch and are assuming a translation/interpretation layer exists to transform an RC file into webVTT, srt, etc.
  - While imagining the format from scratch, where two options seem equally valid, we choose the one that interacts most favorably with existing caption formats.

- **Descriptive rather than prescriptive:**
  - We want to describe what is happening as well as the creator’s intent where possible. We do not want to enforce any regulatory or regional guidelines (e.g., FCC, OFCOM, etc.).

- **Stylization is out-of-scope:**
  - Things that affect stylization (color, bold, exact placement on screen, etc.) are out-of-scope. Those visual decisions are deferred to the interpreter/translator program.

- **Tag vs. Class distinction:**
  - If a characteristic is exclusive, it is a _class_; otherwise, it is a _tag_.

- **Separation of structure and use case:**
  - Classes, tags, and attributes are distinct from use cases. For example, _"For hearing aid users"_ is a use case, not a class.

- **Sparsity by default:**
  - Most of the time, fields will be empty (similar to standard JSON behavior).

- **Backward compatibility (Can't break VTT):**
  - The file must be able to be fed directly into an older, legacy player and still function.
