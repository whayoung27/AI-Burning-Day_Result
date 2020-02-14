# frozen_string_literal: true

class UnauthorizedError < StandardError
  def initialize(message = 'unauthorized error')
    super(message)
  end
end
