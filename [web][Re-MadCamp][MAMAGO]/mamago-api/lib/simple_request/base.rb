# frozen_string_literal: true
module SimpleRequest
  #
  # SimpleRequest Base Class
  #
  class Base
    attr_reader :header

    def initialize
      @header = nil
    end
  end
end