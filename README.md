
# Recovery Tenant Lib

The recovery service is a smart oracle implementation. It's main functionality is to protect from keyloss in blockchain applications with client-side key setups.

## Assumptions

A smart contract implementing business logic of value (e.g. crypto currency) is operated by a company (tenant). The smart contract has operations to modify assets under control of a user (e.g. `transfer()`) and a function that allows to move all assets and permission at once from the control of one private key to another (e.g. `recover()`).

```js
contract CosignEnabled {

  modifier isCosigned() {
    // tenant approval checked here.
  }
}

contract RecoveryEnabled {

  modifier isRecovery() {
    // tenant and recovery service approval checked here.
  }
}

contract Asset is CosignEnabled, RecoveryEnabled {

  function transfer(address _to, uint _value) isCosigned {
    // only if isCosigned passed:
    //   modify asset
  }

  function recovery(address _old, address _new) isRecovery {
    // only if isRecovery passed:
    //   transfer all rights from old to new private key
  }

}
```

All functions that modify assets require signatures by user and tenant private keys (cosigning). The recovery function requires signatures from tenant and recovery service. 

Key A: user

Key B: tenant

Key C: recovery

access to funds: `(A && B) || (B && C)`


## Threads

### Attack vector 1: 
- attacker has captured the tenant's service
- attacker doesn't have user's private key, so attacker can't just take the funds

=> attacker will try to inject code into page, to capture user's private key (achieve `A && B`)
or

=> attacker will try to change or disable phone call, so recovery can be done silently (achieve `B && C`)

### Attack vector 2: 
- attacker has captured the user's browser
- user has co-signing set up, so attacker can't just take the funds

=> attacker will try to change or disable phone call, so recovery can be done silently (achieve `B && C`)

...

## Usercases


### Emergency Usecases

- As a user, I lost my private key and I do have access to my recovery phone number. -> do recovery
- As a user, I lost my private key and I don't have access to my recovery phone number. (e.g. lost phone, changed mobile providres)
- As a user, I need to know what my current recovery phone number is.

### Precaution Usecases

- As a user, I want to change my recovery phone number. I have a new one, and still access to old one.
- As a user, I want to change my recovery phone number. I have a new one, yet no access to old one.
- As a user, I want the ability to detect that someone is trying to change my recovery phone number.
- As a user, I want the ability to cancel a recovery phone number change request.

### Tenant Recovery Usecases

- As a tenant, I want users to recover their account, if they lost their key.
- As a tenant, I suspect that my key leaked. I want to rotate it.

### Cosign Usecases

- As a tenant, I want to protect user's from damages, if their keys leak.
- As a tenant, I want to protect user's from damages, if tenant key leak.
- As a tenant, I want to nitice suspicios behaviour with user accounts.


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
