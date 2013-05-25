# Regime

It's a coup d'état.

## Example

``` javascript
var controller = Regime.Controller.create_stateful();

controller.add_listener('user', function (user) {
  console.log('user:', user);
});

controller.add_listener('user.name', function (name) {
  console.log('user.name:', name);
});

controller.merge_state({user: {name: 'Luke'}});
controller.merge_state({user: {age: 23}});
controller.merge_state({user: {name: 'Rosa'}});
controller.merge_state({user: false});
```

## License

Copyright © 2013 Luke Morton

Distributed under MIT.
