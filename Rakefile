require 'fileutils'
require 'zip/zip'
require 'zip/zipfilesystem'
require 'coyote'
require 'coyote/rake'

task :build do
  FileUtils.mkdir_p "build"
  Coyote.run "src/retina.coffee", "build/retina.js", :compress => true
  FileUtils.mkdir_p "test/functional/public"
  Coyote.run "src/retina.coffee", "test/functional/public/retina.js"
end

coyote :watch do |config|
  config.input = "src/retina.coffee"
  config.output = "test/functional/public/retina.js"
end

task :package => [:build] do
  tmp = "tmp/#{Time.now.to_i}"
  zip = "pkg/retina.zip"

  FileUtils.rm zip, :force => true
  FileUtils.mkdir_p tmp
  FileUtils.cp "README.md",         "#{tmp}/README.md"
  FileUtils.cp "src/retina.less",   "#{tmp}/retina.less"
  FileUtils.cp "build/retina.js",   "#{tmp}/retina.js"

  Zip::ZipFile.open(zip, 'w') do |zipfile|
    Dir["#{tmp}/**/**"].reject { |f| f == zip }.each do |file|
      zipfile.add(file.sub(tmp+'/',''),file)
    end
  end
end

