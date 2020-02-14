# frozen_string_literal: true

module ApplicationErrorHandlerable
  extend ActiveSupport::Concern

  included do
    rescue_from Exception, with: ErrorResponse.with_status(400)
    rescue_from ApplicationError, with: ErrorResponse.with_status(403)
    rescue_from UnauthorizedError, with: ErrorResponse.with_status(401)
    rescue_from RestClient::ExceptionWithResponse, with: ErrorResponse.with_status(400)
  end

  #
  # Class for Error Handling
  #
  class ErrorResponse
    def self.with_status(status)
      lambda { |exception|
        meta = {
          code: exception.try(:code) || status,
          error_type: exception.class.name,
          message: exception.message
        }

        render json: { meta: meta }, status: status || 400
      }
    end
  end
end
