# frozen_string_literal: true

require 'rails_helper'

describe Api::UsersController, 'POST #create' do
  let(:email) { 'test@email.com' }
  let(:password) { '12345' }
  subject { post :create, params: { email: email, password: password, format: :json } }

  context '' do
    it do
      subject
    end
  end
end
