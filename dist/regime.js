// Generated by CoffeeScript 1.5.0
(function() {

  this.Regime = {};

}).call(this);
// Generated by CoffeeScript 1.5.0
(function() {
  var add_listeners, emit, listeners,
    __slice = [].slice;

  listeners = function() {
    var event_name, event_names, listener, listeners, stack, _i, _j, _len, _len1, _ref, _ref1;
    listeners = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    stack = [];
    for (_i = 0, _len = listeners.length; _i < _len; _i++) {
      _ref = listeners[_i], event_names = _ref[0], listener = _ref[1];
      _ref1 = event_names.split(' ');
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        event_name = _ref1[_j];
        stack.push([event_name, listener]);
      }
    }
    return stack;
  };

  add_listeners = function() {
    var additional_listeners, old_listeners;
    old_listeners = arguments[0], additional_listeners = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return old_listeners.concat(listeners.apply(null, additional_listeners));
  };

  emit = function() {
    var args, event_name, listener, listeners, signal, _i, _len, _ref;
    listeners = arguments[0], signal = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    for (_i = 0, _len = listeners.length; _i < _len; _i++) {
      _ref = listeners[_i], event_name = _ref[0], listener = _ref[1];
      if (event_name === '' || event_name === signal) {
        listener.apply(this, [signal].concat(args));
      }
    }
  };

  this.Regime.Signal = {
    listeners: listeners,
    add_listeners: add_listeners,
    emit: emit
  };

}).call(this);
// Generated by CoffeeScript 1.5.0
(function() {
  var Signal, add_listener, collect_path, create, create_stateful, emit_state, emit_state_path, is_scalar, merge, merge_state, paths_and_scalar_values, push_listeners, replace_state,
    __slice = [].slice;

  Signal = this.Regime.Signal;

  create = function(state, listeners) {
    if (state == null) {
      state = {};
    }
    if (listeners == null) {
      listeners = [];
    }
    return {
      state: state,
      listeners: listeners
    };
  };

  push_listeners = function(controller, listeners) {
    return create(controller.state, listeners);
  };

  merge = function() {
    var k, m, mixins, obj, v, _i, _len;
    obj = arguments[0], mixins = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = mixins.length; _i < _len; _i++) {
      m = mixins[_i];
      for (k in m) {
        v = m[k];
        obj[k] = v;
      }
    }
    return obj;
  };

  collect_path = function(obj, path) {
    var p, path_obj, _i, _len, _ref;
    path_obj = merge({}, obj);
    _ref = path.split('.');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      path_obj = path_obj != null ? path_obj[p] : void 0;
    }
    return path_obj;
  };

  emit_state_path = function(controller, path, state) {
    if (state == null) {
      state = collect_path(controller.state, path);
      if (state == null) {
        return;
      }
    }
    Signal.emit(controller.listeners, path, state);
  };

  emit_state = function(controller, state) {
    var path, path_state, _i, _len, _ref, _ref1;
    _ref = paths_and_scalar_values(state);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      _ref1 = _ref[_i], path = _ref1[0], path_state = _ref1[1];
      emit_state_path(controller, path, path_state);
    }
  };

  is_scalar = function(v) {
    switch (typeof v) {
      case 'string':
      case 'number':
      case 'boolean':
        return true;
    }
    if (v == null) {
      return true;
    }
    return false;
  };

  paths_and_scalar_values = function(obj, prefix) {
    var k, p, path, v;
    if (prefix == null) {
      prefix = '';
    }
    p = [];
    for (k in obj) {
      v = obj[k];
      path = "" + prefix + k;
      p.push([path, v]);
      if (!is_scalar(v)) {
        p = p.concat(paths_and_scalar_values(v, "" + path + "."));
      }
    }
    return p;
  };

  replace_state = function(controller, state) {
    controller.state = state;
    emit_state(controller, state);
    return controller;
  };

  merge_state = function(controller, state) {
    merge(controller.state, state);
    emit_state(controller, state);
    return controller;
  };

  add_listener = function(controller, path, fn) {
    var listeners;
    listeners = Signal.add_listeners(controller.listeners, [
      path, function(_, state) {
        return fn(state);
      }
    ]);
    controller = push_listeners(controller, listeners);
    emit_state_path(controller, path);
    return controller;
  };

  create_stateful = function() {
    var controller;
    controller = create();
    return {
      state: function(path) {
        if (path == null) {
          return merge({}, controller.state);
        }
        return collect_path(controller.state, path);
      },
      replace_state: function(state) {
        controller = replace_state(controller, state);
      },
      merge_state: function(state) {
        controller = merge_state(controller, state);
      },
      add_listener: function(path, fn) {
        controller = add_listener(controller, path, fn);
      }
    };
  };

  this.Regime.StateController = {
    create: create,
    replace_state: replace_state,
    merge_state: merge_state,
    add_listener: add_listener,
    create_stateful: create_stateful
  };

}).call(this);
