# Load the Rails application.
require_relative "application"

# Initialize the Rails application.
Rails.application.initialize!

# Ensuring the SECRET_KEY_BASE is loaded correctly
Rails.application.config.secret_key_base = ENV['SECRET_KEY_BASE']
