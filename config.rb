set :css_dir, 'stylesheets'

set :js_dir, 'javascripts'

set :images_dir, 'images'

set :helpers_dir, 'lib/helpers'


# Markdown (see https://github.com/vmg/redcarpet)
set :markdown_engine, :redcarpet
set :markdown,  :smartypants => true,
                :tables => true,
                :autolink => true,
                :gh_blockcode => true,
                :fenced_code_blocks => true,
                :strikethrough => true,
                :lax_spacing => true

# Code highlighting
activate :syntax

activate :s3_sync do |s3_sync|
  s3_sync.bucket                     = 'ralovely.com'
  s3_sync.region                     = 'ap-southeast-2'
  s3_sync.delete                     = true
  s3_sync.after_build                = false
  s3_sync.path_style                 = true
  s3_sync.acl                        = 'public-read'
  s3_sync.verbose                    = false
  s3_sync.prefer_gzip                = true
  s3_sync.reduced_redundancy_storage = false
end


# Time.zone = "UTC"

activate :blog do |blog|
  # This will add a prefix to all links, template references and source paths
  blog.prefix = "blog"

  blog.layout = "post"

  # blog.permalink = "{year}/{month}/{day}/{title}.html"
  # Matcher for blog source files
  # blog.sources = "{year}-{month}-{day}-{title}.html"
  # blog.taglink = "tags/{tag}.html"
  # blog.summary_separator = /(READMORE)/
  # blog.summary_length = 250
  # blog.year_link = "{year}.html"
  # blog.month_link = "{year}/{month}.html"
  # blog.day_link = "{year}/{month}/{day}.html"
  # blog.default_extension = ".markdown"

  # blog.tag_template = "blog/tag.html"
  # blog.calendar_template = "blog/calendar.html"

  # Enable pagination
  # blog.paginate = true
  # blog.per_page = 10
  # blog.page_link = "page/{num}"
end

activate :directory_indexes

ready do
  @punches = Dir.glob("source/images/punches/*")
  @punches.map! {|pathname| "punches/" + File.basename(pathname) }
  nil
end


# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript

  # Enable cache buster
  # activate :asset_hash

  # Use relative URLs
  # activate :relative_assets

  # Or use a different image path
  # set :http_prefix, "/Content/images/"
end
