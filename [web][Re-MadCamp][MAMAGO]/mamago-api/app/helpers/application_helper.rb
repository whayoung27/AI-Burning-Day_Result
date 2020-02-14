# frozen_string_literal: true

module ApplicationHelper
  def json_response(meta: nil, data: nil)
    meta ||= {
      code: 200
    }
    {
      meta: meta,
      data: data
    }
  end
end
