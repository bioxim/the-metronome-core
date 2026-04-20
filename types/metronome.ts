/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/metronome.json`.
 */
export type Metronome = {
  "address": "EADt5m5ur3ur8YNKWdX2FRsF8UkTzPzW7tiNMFiqjued",
  "metadata": {
    "name": "metronome",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initializeRhythm",
      "discriminator": [
        44,
        87,
        240,
        204,
        222,
        30,
        238,
        220
      ],
      "accounts": [
        {
          "name": "rhythmAccount",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "depositAmount",
          "type": "u64"
        },
        {
          "name": "buyDropPercentage",
          "type": "u8"
        },
        {
          "name": "sellPumpPercentage",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "rhythm",
      "discriminator": [
        252,
        25,
        86,
        22,
        64,
        83,
        255,
        61
      ]
    }
  ],
  "types": [
    {
      "name": "rhythm",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "depositAmount",
            "type": "u64"
          },
          {
            "name": "buyDropPercentage",
            "type": "u8"
          },
          {
            "name": "sellPumpPercentage",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
