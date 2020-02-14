# frozen_string_literal: true

class DialogSerializer < ActiveModel::Serializer
  attributes :id, :source, :target, :user_id, :complete, :feedback
  attributes :original, :translated, :comprehended
  attributes :user_intention, :user_intention_translated
  attributes :created_at, :updated_at
  attribute(:question)

  def question
    object.question&.content
  end
end
