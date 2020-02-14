# frozen_string_literal: true

module Api
  class QuestionsController < BaseController
    before_action :set_questions, only: %i[index]

    def index
      render json: json_response(data: @questions.map { |o| QuestionSerializer.new(o).as_json })
    end

    def create
      question = Question.create!(question_params)
      render json: json_response(data: QuestionSerializer.new(question).as_json)
    end

    def update
      question = Question.find params[:id]

      unless params[:content].present?
        raise ApplicationError, 'can update content only'
      end

      question = question.update!(content: params[:content])
      render json: json_response(data: QuestionSerializer.new(question).as_json)
    end

    private

    def set_questions
      @questions = p Question.all
    end

    def question_params
      params.permit(:target, :source, :content)
    end
  end
end
