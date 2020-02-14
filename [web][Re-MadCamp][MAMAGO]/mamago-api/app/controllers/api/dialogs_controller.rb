# frozen_string_literal: true

module Api
  class DialogsController < BaseController
    skip_before_action :ensure_authenticate_user!

    before_action :set_dialog, only: %i[update]
    before_action :set_dialogs, only: %i[index]

    def index
      render json: json_response(data: @dialogs.map { |o| DialogSerializer.new(o).as_json })
    end

    def create
      source = params[:source]
      target = params[:target]

      dialog = DialogService.create_dialog(target: target, source: source, user: current_user)

      render json: json_response(data: DialogSerializer.new(dialog).as_json)
    end

    def update
      @dialog = DialogService.update_dialog(
        @dialog,
        **dialog_params.as_json.transform_keys(&:to_sym)
      )

      render json: json_response(data: DialogSerializer.new(@dialog).as_json)
    end

    private

    def set_dialog
      @dialog = Dialog.find(params[:id])
    end

    def set_dialogs
      @dialogs = current_user.dialogs
    end

    def dialog_params
      params.permit(:target, :source, :complete, :feedback, :original, :user_intention)
    end
  end
end
