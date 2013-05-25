listeners = (listeners...) ->
  stack = []
  for [event_names, listener] in listeners
    for event_name in event_names.split(' ')
      stack.push([event_name, listener])
  return stack

add_listeners = (old_listeners, additional_listeners...) ->
  return old_listeners.concat(listeners(additional_listeners...))

emit = (listeners, signal, args...) ->
  for [event_name, listener] in listeners
    if event_name is '' or event_name is signal
      listener.apply(@, [signal].concat(args))
  return

@Regime.Signal =
  listeners: listeners
  add_listeners: add_listeners
  emit: emit
