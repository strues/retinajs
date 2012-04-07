require 'coyote'

task :build do
  Coyote.run "src/retina.coffee", "build/retina.js", :compress => true
  Coyote.run "src/retina.coffee", "test/public/retina.js", :compress => true
end