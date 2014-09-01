# ralovely.com

This is the source code for the [ralovely.com](http://ralovely.com) website.

## Technology stack
It is a very basic [Middleman](http://middlemanapp.com) application that generates a static website and pushes to S3 for hosting.  
As simple as can be.

## Setup
```bash
# Clone the repo 
git clone git@github.com:ralovely/ralovely.git

# Change directory
cd ralovely

# Install Gems
bundle install

# Run locally
bundle exec middleman server
```

## Deploy

To deploy changes, use the `s3_sync` middleman extension.
You will need S3 credentials for this, either as env variables
or in a `.s3_sync` file (yaml).
See [s3_sync README](https://github.com/fredjean/middleman-s3_sync) for more details.

```
middleman s3_sync
```

