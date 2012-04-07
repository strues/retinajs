require 'fileutils'
require 'zip/zip'
require 'zip/zipfilesystem'
require 'coyote'

task :build do
  Coyote.run "src/retina.coffee", "build/retina.js", :compress => true
  Coyote.run "src/retina.coffee", "test/public/retina.js", :compress => true
end

task :package => [:build] do
  tmp = "tmp/#{Time.now.to_i}"
  zip = "pkg/retina.zip"

  FileUtils.rm zip, :force => true
  FileUtils.mkdir_p tmp
  FileUtils.cp "src/retina.coffee", "#{tmp}/retina.coffee"
  FileUtils.cp "src/retina.less",   "#{tmp}/retina.less"
  FileUtils.cp "build/retina.js",   "#{tmp}/retina.js"

  Zip::ZipFile.open(zip, 'w') do |zipfile|
    Dir["#{tmp}/**/**"].reject { |f| f == zip }.each do |file|
      zipfile.add(file.sub(tmp+'/',''),file)
    end
  end
end

