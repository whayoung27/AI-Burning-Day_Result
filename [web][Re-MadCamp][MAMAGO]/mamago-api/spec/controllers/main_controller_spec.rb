# frozen_string_literal: true

require 'rails_helper'

describe MainController, 'GET #index' do
  subject { get :index, params: { format: :json } }

  context '' do
    it do
      subject
    end
  end
end
