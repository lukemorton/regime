@Regime.Controller = Controller = {}

{Signal} = @Regime

Controller.create = (state = {}, listeners = []) ->
  return {state: state, listeners: listeners}

Controller.push_listeners = (controller, listeners) ->
  return Controller.create(controller.state, listeners)

collect_path = (obj, path) ->
  path_obj = merge({}, obj)
  path_obj = path_obj?[p] for p in path.split('.')
  return path_obj
  
merge = (obj, mixins...) ->
  for m in mixins
    obj[k] = v for k, v of m
  return obj

Controller.emit_state = (controller, path, state) ->
  unless state?
    state = collect_path(controller.state, path)
    return unless state?
  
  Signal.emit(controller.listeners, path, state)
  return

is_scalar = (v) ->
  switch typeof v
    when 'string', 'number', 'boolean'
      return yes
  return yes unless v?
  return no

paths_and_scalar_values = (obj, prefix = '') ->
  p = []

  for k, v of obj
    path = "#{prefix}#{k}"
    p.push([path, v])

    unless is_scalar(v)
      p = p.concat(paths_and_scalar_values(v, "#{path}.")) 

  return p

Controller.push_state = (controller, state) ->
  merge(controller.state, state)

  for [path, path_state] in paths_and_scalar_values(state)
    Controller.emit_state(controller, path, path_state)

  return controller

Controller.add_listener = (controller, path, fn) ->
  listeners =
    Signal.add_listeners(
      controller.listeners,
      [path, (_, state) -> fn(state)])
  controller = Controller.push_listeners(controller, listeners)
  Controller.emit_state(controller, path)
  return controller

Controller.create_stateful = ->
  controller = Controller.create()

  return {} =
    state: (path) ->
      return controller.state unless path?
      return collect_path(controller.state, path)

    push_state: (state) ->
      controller = Controller.push_state(controller, state)
      return

    add_listener: (path, fn) ->
      controller = Controller.add_listener(controller, path, fn)
      return

