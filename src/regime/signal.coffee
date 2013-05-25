@Regime.Signal = Signal = {}

Signal.listeners = (listeners...) ->
  stack = []
  for [event_names, listener] in listeners
    for event_name in event_names.split(' ')
      stack.push([event_name, listener])
  return stack

Signal.add_listeners = (listeners, additional_listeners...) ->
  return listeners.concat(Signal.listeners(additional_listeners...))

Signal.emit = (listeners, signal, args...) ->
  for [event_name, listener] in listeners
    if event_name is '' or event_name is signal
      listener.apply(@, [signal].concat(args))
  return
