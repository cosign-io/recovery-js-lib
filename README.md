# recovery-lib

recovery service url: `https://qqkzo192l6.execute-api.eu-central-1.amazonaws.com/prod`

ethereum testnet url: `http://52.28.142.166:8555`

## Example Use

```js
var Lib = require('./lib/index.js');
var lib = new Lib(null,'https://qqkzo192l6.execute-api.eu-central-1.amazonaws.com/prod');
lib.setupRequest('75f24a36fbff3e57717b6badf82d3bbca56993dd', '+4915170196026', 'mail@johba.de');
> { verificationId: '6c2e673c-42af-484e-82b7-6fcf084d9f4d', recoveryId: '3b407ed5-85ec-4c87-8a7e-4301ce4ccf63' }
lib.confirm(100445, '6c2e673c-42af-484e-82b7-6fcf084d9f4d');
> { hash: '0x4884ec973c6ac7d6fcd05a18d41b0c0ed32cd33ba0bced3eb472e253762bcaee' }
lib.recoveryRequest('75f24a36fbff3e57717b6badf82d3bbca56993dd', 'eef24a36fbff3e57717b6badf82d3bbca56993ee', '3b407ed5-85ec-4c87-8a7e-4301ce4ccf63');
> { id: '8e13133c-22d9-46eb-817b-6390bb3910e7' }
lib.confirm(394797, '8e13133c-22d9-46eb-817b-6390bb3910e7');
> { hash: '0x68b995577c6fe6b33c2a03afbb0a0bee962b7e6723570d8d3e121617eff11201' }
```


## Account Setup

Example request:
```
POST /setup/9f160e5a-b6af-45b2-a948-6256693a8072
{
  "address": "0xdd0ca418cac231b683c25766850d90fc45d15fdd",
  "phone": "+491999422851",
  "email": "test@mail.de",
  "rTenant": "0xcc519ab33fff77820f9bf2020ec9a86e898bee098430f2ca9345aa6de5089cbe",
  "sTenant": "0x4b59d4e7f5fa58af9c771c749a7b3848beb3c820620fe24ec1f20a3fa360ee56",
  "vTenant": 28,
  "nonceTenant": 1234
}
```

Example response:
```
{"id": "f559d47b-c9ed-4c65-abff-6a084765b42d"}
```

## Setup Request Confirmation

Example request:
```
POST /confirm/f559d47b-c9ed-4c65-abff-6a084765b42d
{
  "code": 728479,
}
```

Example response:
```
{"hash":"0x34eeda8f7ce6269ed61c088ae8336b668530e826cd803e4988984b36929ccc37"}
```

## Account Recovery

Example request:
```
POST /recovery/9f160e5a-b6af-45b2-a948-6256693a8072
{
  "oldAddr": "0xdd0ca418cac231b683c25766850d90fc45d15fdd",
  "newAddr": "0xee0ca418cac231b683c25766850d90fc45d15fee",
  "rTenant": "0xad075491ebdb317f1eb77a0e660565f91f1789555aabe0f2b3dc947729aac8d1",
  "sTenant": "0x137fa810dc252cc09e931209031f8e2db0454581e9ea4e2c4179579f67d30b22",
  "vTenant": 27,
  "nonceTenant": 12345,
}
```

Example response:
```
{"id": "f559d47b-c9ed-4c65-abff-6a084765b42d"}
```

## Recovery Request Confirmation

Example request:
```
POST /confirm/f559d47b-c9ed-4c65-abff-6a084765b42d
{
  "code": 64937409,
}
```

Example response:
```
{"hash":"0xee723d8be34e7d185d80be4998650811999593a8f4b69113470af0e19c1f7331"}
```
