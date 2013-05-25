{Signal} = @Regime

create = (state = {}, listeners = []) ->
  return {state: state, listeners: listeners}

push_listeners = (controller, listeners) ->
  return create(controller.state, listeners)

merge = (obj, mixins...) ->
  for m in mixins
    obj[k] = v for k, v of m
  return obj

collect_path = (obj, path) ->
  path_obj = merge({}, obj)
  path_obj = path_obj?[p] for p in path.split('.')
  return path_obj

emit_state_path = (controller, path, state) ->
  unless state?
    state = collect_path(controller.state, path)
    return unless state?
  
  Signal.emit(controller.listeners, path, state)
  return

emit_state = (controller, state) ->
  for [path, path_state] in paths_and_scalar_values(state)
    emit_state_path(controller, path, path_state)

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

replace_state = (controller, state) ->
  controller.state = state
  emit_state(controller, state)
  return controller

add_listener = (controller, path, fn) ->
  listeners =
    Signal.add_listeners(
      controller.listeners,
      [path, (_, state) -> fn(state)])
  controller = push_listeners(controller, listeners)
  emit_state_path(controller, path)
  return controller

create_stateful = ->
  controller = create()

  return {} =
    state: (path) ->
      return merge({}, controller.state) unless path?
      return collect_path(controller.state, path)

    replace_state: (state) ->
      controller = replace_state(controller, state)
      return

    add_listener: (path, fn) ->
      controller = add_listener(controller, path, fn)
      return

@Regime.StateController =
  create: create
  replace_state: replace_state
  add_listener: add_listener
  create_stateful: create_stateful
