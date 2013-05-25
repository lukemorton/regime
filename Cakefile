exec = require('child_process').exec

exec_out = (cmd, after) ->
  console.log(cmd)
  exec cmd, (err, stdout, stderr) ->
    throw err if err
    console.log(stdout + stderr) if stdout or stderr
    after?()

build = (after) ->
  exec_out 'rm -rf lib/ examples/lib/', ->
    exec_out 'coffee -o lib/ src/', ->
      exec_out('coffee -o examples/lib/ examples/src/', after)

task 'build', ->
  build()

task 'dist', ->
  build ->
    order = [
      'lib/regime.js'
      'lib/regime/signal.js'
      'lib/regime/state_controller.js'
    ]

    exec_out("cat #{order.join(' ')} > dist/regime.js")
