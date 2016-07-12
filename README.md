
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



# API Documentation

```
https://recovery.cosign.io/v1/:address/setup/:recoveryId
```

Example request:

```bash
curl -X POST -H "Content-Type: application/json" -d
'{
  "address": "0x75f24a36fbff3e57717b6badf82d3bbca56993dd",
  "phone": "+4916170294056",
  "email": "mail@test.com",
  "rTenant": "0xb7e0abe65c93c234c9f241312946d7591bbb6fa79033f12bf8e23dc438a71ae5",
  "sTenant": "0x2d7199c00a5dbec177797b7b136f14c3ba8c46b4ac1125a47ae7f8860254ed26",
  "vTenant": 27,
  "nonceTenant": "9b483377-8105-42de-b65b-0aa5a36d0b1a" 
}'
https://e87qi0eor1.execute-api.eu-central-1.amazonaws.com/v0/0xec74ccc1a6a9b58a873c060eba49cb868f2a5c6e/setup/782b8c6e-1657-4caf-9b6a-0d1929ea7b19
```


Example response:
```
{
  "verificationId": "9b483377-8105-42de-b65b-0aa5a36d0b1a"
}
```

## Setup Request Confirmation

```
https://recovery.cosign.io/v1/:address/confirm/:verificationId
```

Example request:
```bash
curl -X POST -H "Content-Type: application/json" -d
'{
  "code": 117803
}'
https://e87qi0eor1.execute-api.eu-central-1.amazonaws.com/v0/0xec74ccc1a6a9b58a873c060eba49cb868f2a5c6e/confirm/9b483377-8105-42de-b65b-0aa5a36d0b1a
```

Example response:
```
{
  "txHash":"0xf00bfa87375147ff70597f463139d04678e9033ef8d8717d3ef0b5632caa287a",
  "verificationId":"9b483377-8105-42de-b65b-0aa5a36d0b1a"
}
```

## Confirmation Polling

```
https://recovery.cosign.io/v1/:address/notification/:verificationId
```

Example request:

```bash
curl -X GET -H "Content-Type: application/json"
https://e87qi0eor1.execute-api.eu-central-1.amazonaws.com/v0/0xec74ccc1a6a9b58a873c060eba49cb868f2a5c6e/notification/9b483377-8105-42de-b65b-0aa5a36d0b1a
```

Example response:

```
{
  "request":"9b483377-8105-42de-b65b-0aa5a36d0b1a",
  "statusCode":0
}
```

## Account Recovery

```
https://recovery.cosign.io/v1/:address/recovery/:recoveryId
```

Example request:

```bash
curl -X POST -H "Content-Type: application/json" -d
'{
  "oldAddr": "0x75f24a36fbff3e57717b6badf82d3bbca56993dd",
  "newAddr": "0x75f24a36fbff3e57717b6badf82d3bbca56993ee",
  "rTenant": "0x4f0e49c23cde0416cbee3d565e49ece924e169d7746165ff32d7b0af8f97ee34",
  "sTenant": "0x00c1ae9ac91873f37ff3e6a100d61e796149dc546f0c4d38394e8748b976cdcd",
  "vTenant": 27,
  "nonceTenant": "5cfae0ae-cc4b-4b7f-8cc9-3ce1e45d95d0" 
}'
https://e87qi0eor1.execute-api.eu-central-1.amazonaws.com/v0/0xec74ccc1a6a9b58a873c060eba49cb868f2a5c6e/recovery/782b8c6e-1657-4caf-9b6a-0d1929ea7b19
```

Example response:
```
{
  "verificationId": "5cfae0ae-cc4b-4b7f-8cc9-3ce1e45d95d0"
}
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

