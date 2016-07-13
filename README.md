
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

