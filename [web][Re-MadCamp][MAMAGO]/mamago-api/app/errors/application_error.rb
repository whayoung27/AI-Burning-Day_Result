# frozen_string_literal: true

class ApplicationError < StandardError
  def initialize(message = 'application error')
    super(message)
  end
end
