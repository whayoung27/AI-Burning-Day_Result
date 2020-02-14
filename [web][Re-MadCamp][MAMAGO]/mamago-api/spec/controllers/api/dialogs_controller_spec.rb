# frozen_string_literal: true

require 'rails_helper'

describe Api::DialogsController, 'POST #create' do
  let(:user) { FactoryBot.create(:user, email: 'testing@gmail.com', password: 'test_password') }

  let!(:question) { FactoryBot.create(:question) }
  let(:source) { 0 }
  let(:target) { 1 }

  before { request.headers['access-token'] = user.access_token }

  subject { post :create, params: { source: source, target: target } }

  it do
    subject

    expect(response.code).to eq('200')
  end
end

describe Api::DialogsController, 'PUT #update' do
  let(:user) { FactoryBot.create(:user, email: 'testing@gmail.com', password: 'test_password') }
  let!(:question) { FactoryBot.create(:question) }
  let(:original) { nil }
  let(:feedback) { nil }
  let(:user_intention) { nil }
  let(:complete) { nil }
  let!(:dialog) { FactoryBot.create(:dialog, source: 0, target: 1, user: user, question: question) }
  let(:params) { {} }

  before { request.headers['access-token'] = user.access_token }
  subject { post :update, params: { id: dialog.id, **params } }

  context 'when original is given' do
    let(:original) { 'I am cutting my foot nails' }
    let(:params) { { original: original } }

    it do
      subject
      expect(response.code).to eq('200')
    end

    context 'when feedback is true' do
      let(:feedback) { true }
      let(:params) { { feedback: feedback } }

      before do
        DialogService.update_dialog(dialog, original: original)
      end

      it do
        subject
        expect(response.code).to eq('200')
        expect(dialog.reload.feedback).to eq(feedback)
      end

      context 'when user_intention is given' do
        let(:user_intention) { '나는 발톱을 자르고 있었어' }
        let(:params) { { user_intention: user_intention } }

        before do
          DialogService.update_dialog(dialog, feedback: feedback)
        end

        it do
          subject
          expect(response.code).to eq('200')
          expect(dialog.reload.user_intention).to eq(user_intention)
        end
      end
    end
  end
end
