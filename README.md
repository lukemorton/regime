# Regime

It's a coup d'état.

## Example

``` javascript
var controller = Regime.StateController.create_stateful();

controller.add_listener('user', function (user) {
  console.log('user:', user);
});

controller.add_listener('user.name', function (name) {
  console.log('user.name:', name);
});

controller.merge_state({user: {name: 'Luke'}});
controller.merge_state({user: {age: 23}});
controller.merge_state({user: {name: 'Rosa'}});
console.log(controller.state());

controller.replace_state({});
console.log(controller.state());
```

## License

Copyright © 2013 Luke Morton

Distributed under MIT.
