# frozen_string_literal: true

class ApplicationController < ActionController::API
  include Authenticatable
  include ApplicationErrorHandlerable

  include ApplicationHelper
end
