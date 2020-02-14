# frozen_string_literal: true

module Api
  class UsersController < BaseController
    skip_before_action :ensure_authenticate_user!, only: %i[create login]

    def create
      user = User.create!(user_params)
      meta = {
        code: 200,
        access_token: user.access_token
      }
      render json: json_response(meta: meta, data: UserSerializer.new(user).as_json)
    end

    def show
      user = User.find_by(access_token: request.headers['access-token'])

      raise ApplicationError, 'unvalid access_token' if user.empty?

      meta = {
        code: 200,
        access_token: user.access_token
      }
      render json: json_response(meta: meta, data: UserSerializer.new(user).as_json)
    end

    def login
      user = User.find_by(email: params[:email]).authenticate(params[:password])
      raise ApplicationError, 'unvalid access_token' unless user

      meta = {
        code: 200,
        access_token: user.access_token
      }

      render json: json_response(meta: meta, data: UserSerializer.new(user).as_json)
    end

    private

    def user_params
      params.permit(:email, :password)
    end
  end
end
