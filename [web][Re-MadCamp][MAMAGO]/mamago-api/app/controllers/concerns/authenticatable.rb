# frozen_string_literal: true

module Authenticatable
  extend ActiveSupport::Concern

  included do
    before_action :ensure_authenticate_user!
  end

  def current_user
    if request.headers['access-token']
      @current_user ||= User.find_by(access_token: request.headers['access-token'])
    end

    @current_user
  end

  private

  def ensure_authenticate_user!
    raise UnauthorizedError if current_user.nil?
  end
end
