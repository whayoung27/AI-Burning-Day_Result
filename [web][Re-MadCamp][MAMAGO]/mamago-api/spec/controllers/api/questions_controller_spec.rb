# frozen_string_literal: true

require 'rails_helper'

describe Api::QuestionsController, 'GET #index' do
  let(:user) { FactoryBot.create(:user, email: 'testing@gmail.com', password: 'test_password') }

  before { request.headers['access-token'] = user.access_token }

  subject { get :index, params: { format: :json } }

  context '' do
    it do
      subject
    end
  end
end
